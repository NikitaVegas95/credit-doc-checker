import asyncio
from typing import Literal

from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile

from app.schemas import CheckResult, CheckSummary
from app.services.checker import build_check_result, build_document_info, build_processing_result
from app.store import store

router = APIRouter(prefix="/checks", tags=["checks"])


async def complete_check(check_id: str) -> None:
    processing_result = store.get(check_id)

    if not processing_result or processing_result.status != "processing":
        return

    await asyncio.sleep(5)
    result = build_check_result(
        program=processing_result.program,
        docs=processing_result.documents,
        check_id=processing_result.check_id,
    )
    store.save(result)


@router.post("", response_model=CheckResult, status_code=201)
async def create_check(
    background_tasks: BackgroundTasks,
    program: Literal["federal", "regional"] = Form(...),
    files: list[UploadFile] = File(...),
):
    docs = [await build_document_info(file) for file in files]
    result = build_processing_result(program, docs)
    store.save(result)
    background_tasks.add_task(complete_check, result.check_id)
    return result


@router.get("", response_model=list[CheckSummary])
def list_checks():
    return [
        CheckSummary(
            check_id=c.check_id,
            program=c.program,
            status=c.status,
            status_label=c.status_label,
            doc_count=len(c.documents),
            checked_at=c.checked_at,
        )
        for c in store.all()
    ]


@router.get("/{check_id}", response_model=CheckResult)
def get_check(check_id: str):
    result = store.get(check_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"Проверка {check_id!r} не найдена")
    return result


@router.delete("/{check_id}", status_code=204)
def delete_check(check_id: str):
    if not store.delete(check_id):
        raise HTTPException(status_code=404, detail=f"Проверка {check_id!r} не найдена")
