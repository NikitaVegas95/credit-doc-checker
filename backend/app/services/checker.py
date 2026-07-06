import os
import uuid
from datetime import datetime, timezone
from typing import Literal

from fastapi import UploadFile

from app.schemas import CheckResult, DocumentInfo, ExtractedFields, Issue

Program = Literal["federal", "regional"]
Status = Literal["processing", "approve", "reject", "manual"]

_ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".jpg", ".jpeg", ".png"}

_REQUIRED_DOCS: dict[Program, list[str]] = {
    "federal":  ["contract", "spec", "invoice", "act"],
    "regional": ["contract", "invoice", "act"],
}

_TYPE_KEYWORDS: dict[str, list[str]] = {
    "contract": ["договор", "контракт", "соглашение", "dogovor", "contract"],
    "spec":     ["спецификация", "spec", "приложение"],
    "invoice":  ["счёт", "счет", "schet", "invoice"],
    "act":      ["акт", "упд", "накладная", "act", "upd"],
    "closing":  ["закрывающ", "закрытие", "closing"],
}

_TYPE_LABELS: dict[str, str] = {
    "contract": "договор",
    "spec":     "спецификация",
    "invoice":  "счёт на оплату",
    "act":      "акт / УПД",
    "closing":  "закрывающий документ",
}

_STATUS_LABELS: dict[Status, str] = {
    "processing": "Проверка выполняется",
    "approve": "Можно заявлять в банк",
    "reject":  "Нельзя заявлять в банк",
    "manual":  "Требуется ручная проверка",
}

_FAKE_CONTRACTORS = [
    ("ООО «ТехАгро»",      "7701234567"),
    ("АО «АгроСнаб»",      "5047123456"),
    ("ИП Смирнов В.А.",    "504712345678"),
    ("ООО «РусАгроТех»",   "7714567890"),
]
_FAKE_SUBJECTS = [
    "Поставка минеральных удобрений (карбамид)",
    "Поставка семян подсолнечника",
    "Техническое обслуживание сельхозтехники",
    "Поставка дизельного топлива",
    "Выполнение агрохимических работ",
]
_call_counter = 0


def _detect_type(filename: str) -> str:
    name = filename.lower()
    for doc_type, keywords in _TYPE_KEYWORDS.items():
        if any(kw in name for kw in keywords):
            return doc_type
    return "unknown"


def _build_issues(program: Program, docs: list[DocumentInfo]) -> list[Issue]:
    issues: list[Issue] = []
    present = {d.detected_type for d in docs}

    for required in _REQUIRED_DOCS[program]:
        if required not in present:
            issues.append(Issue(
                level="error",
                message=f"Отсутствует обязательный документ: {_TYPE_LABELS.get(required, required)}",
            ))

    for doc in docs:
        ext = os.path.splitext(doc.name)[1].lower()
        if ext not in _ALLOWED_EXTENSIONS:
            issues.append(Issue(level="error", message=f"Недопустимый формат файла: «{doc.name}»"))

    for doc in docs:
        if doc.size_kb > 20_480:
            issues.append(Issue(level="error", message=f"Файл превышает 20 МБ: «{doc.name}»"))

    for doc in docs:
        if doc.detected_type == "unknown":
            issues.append(Issue(
                level="warning",
                message=f"Не удалось определить тип документа: «{doc.name}»",
            ))

    if program == "regional" and "spec" not in present:
        issues.append(Issue(
            level="warning",
            message="Спецификация не обязательна для областной программы, но рекомендуется",
        ))

    return issues


def _resolve_status(issues: list[Issue]) -> tuple[Status, str]:
    errors = [i for i in issues if i.level == "error"]
    if errors:
        reason = "; ".join(i.message for i in errors[:2])
        if len(errors) > 2:
            reason += f" и ещё {len(errors) - 2} нарушени(й)"
        return "reject", reason
    if issues:
        return "manual", "Пакет документов требует дополнительной проверки специалиста."
    return "approve", "Пакет документов соответствует требованиям выбранной программы."


def _fake_extracted(idx: int) -> ExtractedFields:
    contractor, inn = _FAKE_CONTRACTORS[idx % len(_FAKE_CONTRACTORS)]
    amount = (idx + 1) * 450_000
    return ExtractedFields(
        contractor=contractor,
        inn=inn,
        amount=f"{amount:,} ₽".replace(",", " "),
        date="15.03.2025",
        subject=_FAKE_SUBJECTS[idx % len(_FAKE_SUBJECTS)],
    )


async def run_check(program: Program, files: list[UploadFile]) -> CheckResult:
    docs = []
    for f in files:
        docs.append(await build_document_info(f))

    return build_check_result(program, docs)


async def build_document_info(file: UploadFile) -> DocumentInfo:
    content = await file.read()
    filename = file.filename or "unnamed"

    return DocumentInfo(
        name=filename,
        detected_type=_detect_type(filename),
        size_kb=max(len(content) // 1024, 1),
    )


def build_processing_result(program: Program, docs: list[DocumentInfo]) -> CheckResult:
    return CheckResult(
        check_id=str(uuid.uuid4())[:8],
        program=program,
        status="processing",
        status_label=_STATUS_LABELS["processing"],
        reason="Файлы загружены. Проверка документов выполняется в фоне.",
        issues=[],
        documents=docs,
        extracted=ExtractedFields(
            contractor="",
            inn="",
            amount="",
            date="",
            subject="",
        ),
        checked_at=datetime.now(timezone.utc),
    )


def build_check_result(program: Program, docs: list[DocumentInfo], check_id: str | None = None) -> CheckResult:
    global _call_counter
    issues = _build_issues(program, docs)
    status, reason = _resolve_status(issues)

    result = CheckResult(
        check_id=check_id or str(uuid.uuid4())[:8],
        program=program,
        status=status,
        status_label=_STATUS_LABELS[status],
        reason=reason,
        issues=issues,
        documents=docs,
        extracted=_fake_extracted(_call_counter),
        checked_at=datetime.now(timezone.utc),
    )

    _call_counter += 1
    return result
