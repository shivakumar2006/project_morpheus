def irrigation_advice(soil_type):

    irrigation_data = {

        "Black Soil": {
            "Crop": "Cotton",
            "Irrigation Frequency": "Every 6-7 days",
            "Water Amount": "40mm per session",
            "pH Value": "6.5 - 7.5",
            "Nitrogen (N)": "Medium",
            "Phosphorus (P)": "High",
            "Potassium (K)": "High"
        },

        "Cinder Soil": {
            "Crop": "Vegetables",
            "Irrigation Frequency": "Every 2-3 days",
            "Water Amount": "25mm per session",
            "pH Value": "6.0 - 6.8",
            "Nitrogen (N)": "Low",
            "Phosphorus (P)": "Medium",
            "Potassium (K)": "Low"
        },

        "Laterite Soil": {
            "Crop": "Tea",
            "Irrigation Frequency": "Every 3-4 days",
            "Water Amount": "30mm per session",
            "pH Value": "5.5 - 6.5",
            "Nitrogen (N)": "Low",
            "Phosphorus (P)": "Low",
            "Potassium (K)": "Medium"
        },

        "Peat Soil": {
            "Crop": "Rice",
            "Irrigation Frequency": "Maintain Moisture",
            "Water Amount": "Continuous shallow water",
            "pH Value": "3.5 - 5.5",
            "Nitrogen (N)": "High",
            "Phosphorus (P)": "Low",
            "Potassium (K)": "Low"
        },

        "Yellow Soil": {
            "Crop": "Groundnut",
            "Irrigation Frequency": "Every 4-5 days",
            "Water Amount": "35mm per session",
            "pH Value": "6.0 - 7.0",
            "Nitrogen (N)": "Low",
            "Phosphorus (P)": "Medium",
            "Potassium (K)": "Medium"
        }
    }

    return irrigation_data.get(soil_type, {})