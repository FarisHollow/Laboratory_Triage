import pandas as pd
import pickle
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)


# ============================================================
# 1. LOAD DATASET
# ============================================================

df = pd.read_csv("data/lab_reports_extended.csv")

X = df.drop("triage", axis=1)
y = df["triage"]


# ============================================================
# 2. ENCODE LABELS
# ============================================================

encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

print("\n" + "=" * 60)
print("              DECISION TREE TRAINING")
print("=" * 60)

print("\nDataset Summary")
print("-" * 60)
print(f"Total samples       : {len(df)}")
print(f"Features            : {X.shape[1]}")
print(f"Feature names       : {', '.join(X.columns)}")
print(f"Classes             : {', '.join(encoder.classes_)}")

print("\nLabel Mapping")
print("-" * 60)

for i, label in enumerate(encoder.classes_):
    print(f"{label:<15} -> {i}")


# ============================================================
# 3. TRAIN-TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42
)

print("\nTrain-Test Split")
print("-" * 60)
print(f"Training samples    : {len(X_train)}")
print(f"Testing samples     : {len(X_test)}")
print(f"Test size           : 20%")
print(f"Random state        : 42")


# ============================================================
# 4. TRAIN DECISION TREE
# ============================================================

model = DecisionTreeClassifier(
    random_state=42
)

model.fit(X_train, y_train)

print("\nModel Training")
print("-" * 60)
print("Algorithm           : Decision Tree")
print("Training status     : Completed")


# ============================================================
# 5. PREDICTION
# ============================================================

y_pred = model.predict(X_test)


# ============================================================
# 6. MODEL EVALUATION
# ============================================================

accuracy = accuracy_score(y_test, y_pred)

report = classification_report(
    y_test,
    y_pred,
    target_names=encoder.classes_,
    output_dict=True
)

print("\n" + "=" * 60)
print("                 MODEL PERFORMANCE")
print("=" * 60)

print(f"\nAccuracy            : {accuracy:.2%}")

print("\nClass Performance")
print("-" * 60)
print(
    f"{'Class':<15}"
    f"{'Precision':>12}"
    f"{'Recall':>12}"
    f"{'F1-Score':>12}"
)

for label in encoder.classes_:
    print(
        f"{label:<15}"
        f"{report[label]['precision']:>12.2f}"
        f"{report[label]['recall']:>12.2f}"
        f"{report[label]['f1-score']:>12.2f}"
    )

print("-" * 60)
print(
    f"{'Macro Avg':<15}"
    f"{report['macro avg']['precision']:>12.2f}"
    f"{report['macro avg']['recall']:>12.2f}"
    f"{report['macro avg']['f1-score']:>12.2f}"
)

print(
    f"{'Weighted Avg':<15}"
    f"{report['weighted avg']['precision']:>12.2f}"
    f"{report['weighted avg']['recall']:>12.2f}"
    f"{report['weighted avg']['f1-score']:>12.2f}"
)


# ============================================================
# 7. CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    y_test,
    y_pred
)

print("\n" + "=" * 60)
print("                 CONFUSION MATRIX")
print("=" * 60)

print("\n              Predicted")
print(f"{'':15}{'Monitor':>10}{'Normal':>10}{'Urgent':>10}")

for i, label in enumerate(encoder.classes_):
    print(
        f"{'Actual ' + label:<15}"
        f"{cm[i][0]:>10}"
        f"{cm[i][1]:>10}"
        f"{cm[i][2]:>10}"
    )


# ============================================================
# 8. URGENT CLASS SUMMARY
# ============================================================

urgent_index = list(encoder.classes_).index("urgent")

urgent_correct = cm[urgent_index][urgent_index]
urgent_total = cm[urgent_index].sum()

urgent_recall = urgent_correct / urgent_total

print("\nUrgent Class Analysis")
print("-" * 60)
print(f"Actual Urgent cases : {urgent_total}")
print(f"Correctly detected  : {urgent_correct}")
print(f"Urgent Recall       : {urgent_recall:.2%}")


# ============================================================
# 9. SAVE CONFUSION MATRIX
# ============================================================

display = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=encoder.classes_
)

display.plot()

plt.title("Decision Tree - Lab Triage Confusion Matrix")

plt.savefig(
    "decision_tree_confusion_matrix.png",
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print("\nConfusion matrix saved:")
print("decision_tree_confusion_matrix.png")


# ============================================================
# 10. SAVE MODEL
# ============================================================

with open(
    "models/decision_tree_model.pkl",
    "wb"
) as file:
    pickle.dump(model, file)

print("\nModel saved:")
print("models/decision_tree_model.pkl")


# ============================================================
# 11. SAVE LABEL ENCODER
# ============================================================

with open(
    "models/label_encoder.pkl",
    "wb"
) as file:
    pickle.dump(encoder, file)

print("Label encoder saved:")
print("models/label_encoder.pkl")


# ============================================================
# COMPLETE
# ============================================================

print("\n" + "=" * 60)
print("           TRAINING PIPELINE COMPLETED")
print("=" * 60)