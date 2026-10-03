from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import BatchLabReports
from app.rules import rule_based_triage
from database.mongodb import reports_collection

from datetime import datetime
import pickle
import pandas as pd


app = FastAPI(
    title="AI Lab Triage Assistant",
    description="A clinical decision support system for dialysis patient lab triage.",
    version="0.1.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Load ML Model
# --------------------------------------------------

with open("models/gradient_boosting_model.pkl", "rb") as file:
    ml_model = pickle.load(file)


# --------------------------------------------------
# Label Mapping
# --------------------------------------------------

label_mapping = {
    0: "monitor",
    1: "normal",
    2: "urgent"
}


# --------------------------------------------------
# Home
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to the AI Lab Triage Assistant API"
    }


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "OK"
    }


# --------------------------------------------------
# AI Triage
# --------------------------------------------------

@app.post("/triage")
def triage(batch: BatchLabReports):

    results = []

    for report in batch.reports:

        # ------------------------------------------
        # Check if Report ID already exists
        # ------------------------------------------

        existing_report = reports_collection.find_one(
            {
                "report_id": report.report_id
            }
        )

        if existing_report:

            raise HTTPException(
                status_code=400,
                detail=f"Report ID '{report.report_id}' already exists in Report History. Please use a different Report ID."
            )


        # ------------------------------------------
        # Rule-Based Prediction
        # ------------------------------------------

        rule_label, reasons = rule_based_triage(report)


        # ------------------------------------------
        # Prepare Data for ML Model
        # ------------------------------------------

        data = pd.DataFrame([
            {
                "hemoglobin": report.hemoglobin,
                "wbc": report.wbc,
                "creatinine": report.creatinine,
                "sodium": report.sodium,
                "potassium": report.potassium,
                "platelet": report.platelet
            }
        ])


        # ------------------------------------------
        # ML Prediction
        # ------------------------------------------

        prediction = ml_model.predict(data)

        ml_label = label_mapping[prediction[0]]


        # ------------------------------------------
        # ML Confidence
        # ------------------------------------------

        probabilities = ml_model.predict_proba(data)

        confidence = round(
            max(probabilities[0]) * 100,
            2
        )


        # ------------------------------------------
        # Create Result
        # ------------------------------------------

        result = {
            "report_id": report.report_id,

            "lab_values": {
                "hemoglobin": report.hemoglobin,
                "wbc": report.wbc,
                "creatinine": report.creatinine,
                "sodium": report.sodium,
                "potassium": report.potassium,
                "platelet": report.platelet
            },

            "triage_result": ml_label.capitalize(),

            "ml_prediction": ml_label.capitalize(),

            "ml_confidence": confidence,

            "rule_prediction": rule_label,

            "risk_factors": reasons,

            "created_at": datetime.now()
        }


        # ------------------------------------------
        # Save Result to MongoDB
        # ------------------------------------------

        reports_collection.insert_one(result)


        # Remove MongoDB internal ObjectId
        # before returning the result

        result.pop("_id", None)


        # ------------------------------------------
        # Add Result to Response
        # ------------------------------------------

        results.append(result)


    return {
        "results": results
    }


# --------------------------------------------------
# Get All Reports
# --------------------------------------------------

@app.get("/reports")
def get_reports():

    reports = list(
        reports_collection
        .find(
            {},
            {"_id": 0}
        )
        .sort(
            "created_at",
            -1
        )
    )

    return {
        "reports": reports
    }


# --------------------------------------------------
# Get Single Report
# --------------------------------------------------

@app.get("/reports/{report_id}")
def get_report(report_id: str):

    report = reports_collection.find_one(
        {
            "report_id": report_id.strip()
        },
        {
            "_id": 0
        }
    )

    if not report:

        return {
            "message": "Report not found"
        }

    return report


# --------------------------------------------------
# Delete Single Report
# --------------------------------------------------

@app.delete("/reports/{report_id}")
def delete_report(report_id: str):

    result = reports_collection.delete_one(
        {
            "report_id": report_id
        }
    )


    if result.deleted_count == 0:

        return {
            "message": "Report not found"
        }


    return {
        "message": f"Report {report_id} deleted successfully"
    }


# --------------------------------------------------
# Delete All Reports
# --------------------------------------------------

@app.delete("/reports")
def delete_all_reports():

    result = reports_collection.delete_many({})


    return {
        "message": "All reports deleted successfully",
        "deleted_count": result.deleted_count
    }