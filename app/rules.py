def rule_based_triage(report):
    reasons = []

    # Potassium
    if report.potassium >= 6.0:
        reasons.append("Critical potassium level")

    # Hemoglobin
    if report.hemoglobin < 8.0:
        reasons.append("Very low hemoglobin")

    # Creatinine
    if report.creatinine >= 8.0:
        reasons.append("Very high creatinine")

    # WBC
    if report.wbc >= 15:
        reasons.append("High white blood cell count")

    # Platelet
    if report.platelet < 100:
        reasons.append("Low platelet count")


    # Final triage decision
    if len(reasons) >= 2:
        label = "Urgent"

    elif len(reasons) == 1:
        label = "Monitor"

    else:
        label = "Normal"
        reasons.append("No project-defined rule thresholds were triggered")


    return label, reasons