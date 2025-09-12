import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

def analyze_issue(description):
    desc_lower = description.lower()
    """
    NOTE THIS IS MOCK AI 
    """
    # -------------- category ----------------------
    category = "General Inquiry" # Default category
    if "pothole" in desc_lower or "crack" in desc_lower or "road" in desc_lower:
        category = "Road Hazard"
    elif "trash" in desc_lower or "waste" in desc_lower or "dumpster" in desc_lower:
        category = "Trash & Waste"
    elif "graffiti" in desc_lower or "vandalism" in desc_lower:
        category = "Vandalism"
    elif "light" in desc_lower or "lamp" in desc_lower:
        category = "Streetlight Outage"


    # -------------- priority ----------------------
    priority = "Medium" # Default priority
    if "fire" in desc_lower or "leak" in desc_lower or "danger" in desc_lower or "hazard" in desc_lower:
        priority = "High"
    elif "urgent" in desc_lower or "asap" in desc_lower:
        priority = "High"
    elif "minor" in desc_lower or "small" in desc_lower:
        priority = "Low"

    return {"category": category, "priority": priority}




@app.route("/triage", methods=["POST"])
# API to get issue and other stuff
def triage_issue():

    # Ensure the request contains JSON data
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    description = data.get("description", None)

    # Validate that a description was provided
    if not description:
        return jsonify({"error": "Missing 'description' in request body"}), 400

    # Get the analysis from our mock AI function
    analysis_result = analyze_issue(description)

    # Return the result as a JSON response
    return jsonify(analysis_result), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5002)) # Changed from 5001 to 5002
    app.run(debug=True, port=port)