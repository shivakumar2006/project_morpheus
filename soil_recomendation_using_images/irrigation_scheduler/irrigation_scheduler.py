def irrigation_decision(soil_type):

    if soil_type == "sandy":
        return "High irrigation required"

    elif soil_type == "black":
        return "Low irrigation required"

    elif soil_type == "peat":
        return "Very low irrigation required"

    elif soil_type == "laterite":
        return "Medium irrigation required"

    elif soil_type == "yellow":
        return "Medium irrigation required"

    else:
        return "Unknown soil type"


# Testing purpose
if __name__ == "__main__":
    soil = "black"
    print("Soil Type:", soil)
    print("Irrigation:", irrigation_decision(soil))