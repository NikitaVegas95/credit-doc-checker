from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class Issue(BaseModel):
    level: Literal["error", "warning"]
    message: str


class DocumentInfo(BaseModel):
    name: str
    detected_type: str
    size_kb: int


class ExtractedFields(BaseModel):
    contractor: str
    inn: str
    amount: str
    date: str
    subject: str


class CheckResult(BaseModel):
    check_id: str
    program: str
    status: Literal["approve", "reject", "manual"]
    status_label: str
    reason: str
    issues: list[Issue]
    documents: list[DocumentInfo]
    extracted: ExtractedFields
    checked_at: datetime


class CheckSummary(BaseModel):
    check_id: str
    program: str
    status: Literal["approve", "reject", "manual"]
    status_label: str
    doc_count: int
    checked_at: datetime
