from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import BatchLabReports, LabReport
from app.rules import rule_based_triage

import pickle
import pandas as pd


app = FastAPI(
    title="AI Lab Triage Assistant",
    description="A clinical decision support system for dialysis patient lab triage.",
    version="0.1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model
with open("models/gradient_boosting_model.pkl", "rb") as file:
    ml_model = pickle.load(file)


# Label mapping
label_mapping = {
    0: "monitor",
    1: "normal",
    2: "urgent"
}


@app.get("/")
def home():
    return {
        "message": "Welcome to the AI Lab Triage Assistant API"
    }


@app.get("/health")
def health_check():
    return {
        "status": "OK"
    }



@app.post("/triage")
def triage(batch: BatchLabReports):

    results = []

    for report in batch.reports:

        # -----------------------
        # Rule Based Prediction
        # -----------------------

        rule_label, reasons = rule_based_triage(report)


        # -----------------------
        # ML Prediction
        # -----------------------

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


        prediction = ml_model.predict(data)

        ml_label = label_mapping[prediction[0]]


        # -----------------------
        # Confidence Score
        # -----------------------

        probabilities = ml_model.predict_proba(data)

        confidence = max(probabilities[0]) * 100
        confidence = round(confidence, 2)


        # -----------------------
        # Store Result
        # -----------------------

        results.append({
            "report_id": report.report_id,
            "triage_result": ml_label.capitalize(),
            "ml_prediction": ml_label.capitalize(),
            "ml_confidence": confidence,
            "rule_prediction": rule_label,
            "risk_factors": reasons
        })


    return {
        "results": results
    }