from pydantic import BaseModel, Field


class LabReport(BaseModel):
    report_id: str

    hemoglobin: float = Field(..., gt=0)
    wbc: float = Field(..., gt=0)
    creatinine: float = Field(..., gt=0)
    sodium: float = Field(..., gt=0)
    potassium: float = Field(..., gt=0)
    platelet: float = Field(..., gt=0)


class BatchLabReports(BaseModel):
    reports: list[LabReport]