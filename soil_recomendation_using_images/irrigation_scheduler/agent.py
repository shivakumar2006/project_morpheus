from train_model.predict_soil import predict_soil
from irrigation_scheduler.irrigation_logic import irrigation_advice


def crop_irrigation_agent(image_path):

    soil_type, confidence = predict_soil(image_path)

    # If not valid soil image
    if soil_type is None:
        return {
            "Status": "Invalid Image",
            "Message": "Uploaded image does not appear to be a valid soil type.",
            "Confidence": round(float(confidence), 2)
        }

    irrigation_plan = irrigation_advice(soil_type)

    response = {
        "Status": "Success",
        "Predicted Soil Type": soil_type,
        "Confidence": round(float(confidence), 2),

        "Recommended Crop": irrigation_plan.get("Crop"),
        "Irrigation Frequency": irrigation_plan.get("Irrigation Frequency"),
        "Water Amount": irrigation_plan.get("Water Amount"),

        "Soil Health Parameters": {
            "pH Value": irrigation_plan.get("pH Value"),
            "Nitrogen (N)": irrigation_plan.get("Nitrogen (N)"),
            "Phosphorus (P)": irrigation_plan.get("Phosphorus (P)"),
            "Potassium (K)": irrigation_plan.get("Potassium (K)")
        }
    }

    return response

