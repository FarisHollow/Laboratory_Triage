import pandas as pd
import pickle
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import GradientBoostingClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)

# Load dataset
df = pd.read_csv("data/lab_reports_extended.csv")

print("Dataset:")
print(df.head())

# Separate features and target
X = df.drop("triage", axis=1)
y = df["triage"]

# Encode labels
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

print("\nLabel Mapping:")
for i, label in enumerate(encoder.classes_):
    print(f"{label} -> {i}")

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42
)

# Create Gradient Boosting model
model = GradientBoostingClassifier(
    n_estimators=100,
    learning_rate=0.1,
    random_state=42
)

# Train
model.fit(X_train, y_train)

print("\nGradient Boosting training completed!")

# Predictions
y_pred = model.predict(X_test)

print("\nPredictions:")
print(y_pred)

print("\nActual:")
print(y_test)

# Accuracy
accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy:")
print(accuracy)

# Classification report
print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=encoder.classes_
    )
)

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)

print("\nConfusion Matrix:")
print(cm)

display = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=encoder.classes_
)

display.plot()

plt.title("Gradient Boosting Confusion Matrix")

plt.savefig(
    "gradient_boosting_confusion_matrix.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()

print(
    "\nConfusion matrix saved as "
    "gradient_boosting_confusion_matrix.png"
)

# Save model
with open(
    "models/gradient_boosting_model.pkl",
    "wb"
) as file:
    pickle.dump(model, file)

print("\nGradient Boosting model saved successfully!")

# Save encoder
with open(
    "models/label_encoder.pkl",
    "wb"
) as file:
    pickle.dump(encoder, file)

print("Label encoder saved successfully!")
print("\nTraining pipeline completed!")