import pickle
import pandas as pd

# Load trained model
with open("models/triage_model.pkl", "rb") as file:
    model = pickle.load(file)


# New patient's lab values
new_report = pd.DataFrame([
    {
        "hemoglobin": 8,
        "wbc": 12.9,
        "creatinine": 8.06,
        "sodium": 138,
        "potassium": 3,
        "platelet": 200
    }
])


# Make prediction
prediction = model.predict(new_report)

print(f"Prediction:{prediction}")

labels = {
    0: "monitor",
    1: "normal",
    2: "urgent"
}

print("Patient Status:", labels[prediction[0]])