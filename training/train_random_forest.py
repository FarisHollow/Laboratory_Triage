import pandas as pd
import pickle
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)


# ==========================
# 1. Load Dataset
# ==========================

df = pd.read_csv("data/lab_reports_extended.csv")

print("Dataset:")
print(df.head())


# ==========================
# 2. Separate Features and Labels
# ==========================

X = df.drop("triage", axis=1)
y = df["triage"]


print("\nFeatures:")
print(X)

print("\nLabels:")
print(y)


# ==========================
# 3. Encode Labels
# ==========================

encoder = LabelEncoder()

y_encoded = encoder.fit_transform(y)


print("\nEncoded Labels:")
print(y_encoded)


print("\nLabel Mapping:")

for i, label in enumerate(encoder.classes_):
    print(f"{label} -> {i}")


# ==========================
# 4. Train-Test Split
# ==========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42
)


print("\nTraining samples:")
print(X_train)

print("\nTesting samples:")
print(X_test)


# ==========================
# 5. Train Random Forest
# ==========================

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

print("\nRandom Forest training completed!")


# ==========================
# 6. Prediction
# ==========================

y_pred = model.predict(X_test)

print("\nPredictions:")
print(y_pred)

print("\nActual:")
print(y_test)


# ==========================
# 7. Model Evaluation
# ==========================

accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy:")
print(accuracy)


print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred,
        target_names=encoder.classes_
    )
)


# ==========================
# 8. Confusion Matrix
# ==========================

cm = confusion_matrix(
    y_test,
    y_pred
)

print("\nConfusion Matrix:")
print(cm)


display = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=encoder.classes_
)

display.plot()

plt.title(
    "Random Forest Lab Triage Confusion Matrix"
)

plt.savefig(
    "random_forest_confusion_matrix.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()

print(
    "\nConfusion matrix saved as "
    "random_forest_confusion_matrix.png"
)


# ==========================
# 9. Save Random Forest Model
# ==========================

with open(
    "models/random_forest_model.pkl",
    "wb"
) as file:

    pickle.dump(
        model,
        file
    )


print("\nRandom Forest model saved successfully!")


# ==========================
# 10. Save Label Encoder
# ==========================

with open(
    "models/label_encoder.pkl",
    "wb"
) as file:

    pickle.dump(
        encoder,
        file
    )


print("Label encoder saved successfully!")

print("\nRandom Forest training pipeline completed!")