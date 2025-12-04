# app.py
"""
Flask backend for the Medical Insurance app.

Responsibilities:
- User signup & login (SQLite via SQLAlchemy)
- Premium prediction endpoint (/api/predict) using XGBoost model
- SHAP-based explainability for predictions
- Premium forecast endpoint (/api/forecast) using Holt–Winters model
"""

import os
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from ml_models import (
    predict_premium_from_input,
    explain_premium_from_input,
    forecast_premium_from_input,
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "models", "backend.db")

os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# ---------- DATABASE MODELS ----------

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)  # plain-text for demo only
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Quote(db.Model):
    __tablename__ = "quotes"

    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), nullable=True)
    age = db.Column(db.Integer, nullable=False)
    sex = db.Column(db.String(20), nullable=False)
    bmi = db.Column(db.Float, nullable=False)
    children = db.Column(db.Integer, nullable=False)
    smoker = db.Column(db.String(10), nullable=False)
    region = db.Column(db.String(50), nullable=False)
    predicted_amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, user_email=None, age=None, sex=None, bmi=None, children=None, smoker=None, region=None, predicted_amount=None):
        self.user_email = user_email
        self.age = age
        self.sex = sex
        self.bmi = bmi
        self.children = children
        self.smoker = smoker
        self.region = region
        self.predicted_amount = predicted_amount


with app.app_context():
    db.create_all()


# ---------- AUTH ENDPOINTS ----------

@app.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}

    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not first_name or not last_name or not email or not password:
        return jsonify({"error": "First name, last name, email and password are required."}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "User already exists."}), 400

    user = User()
    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    user.password = password  # plain-text for assignment simplicity
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Signup successful"}), 201


@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user or user.password != password:
        return jsonify({"error": "Invalid credentials."}), 401

    token = "fake-jwt-token"

    return jsonify({
        "message": "Login successful",
        "token": token,
        "firstName": user.first_name,
        "lastName": user.last_name,
    }), 200


# ---------- PREDICTION + XAI ENDPOINT ----------

@app.route("/api/predict", methods=["POST"])
def api_predict():
    """
    Called by the Quote form in the frontend.

    Expected JSON from UI:
    {
      "age": 28,
      "sex": "male",
      "bmi": 24.5,
      "children": 0,
      "smoker": "no",
      "region": "southwest",
      "userEmail": "someone@example.com"  (optional)
    }
    """
    data = request.get_json() or {}

    try:
        ui_input = {
            "age": int(data.get("age", 30)),
            "sex": data.get("sex", "male"),
            "bmi": float(data.get("bmi", 25.0)),
            "children": int(data.get("children", 0)),
            "smoker": data.get("smoker", "no"),
            "region": data.get("region", "southwest"),
        }

        predicted_amount = predict_premium_from_input(ui_input)
        explanation = explain_premium_from_input(ui_input, max_features=5)

        user_email = data.get("userEmail")
        quote = Quote(
            user_email=user_email,
            age=ui_input["age"],
            sex=ui_input["sex"],
            bmi=ui_input["bmi"],
            children=ui_input["children"],
            smoker=ui_input["smoker"],
            region=ui_input["region"],
            predicted_amount=predicted_amount,
        )
        db.session.add(quote)
        db.session.commit()

        label = "Low"
        if predicted_amount > 30000:
            label = "Very High"
        elif predicted_amount > 20000:
            label = "High"
        elif predicted_amount > 10000:
            label = "Medium"

        response = {
            "prediction": {
                "predicted_amount": predicted_amount,
                "risk_label": label,
                "monthly_estimate": round(predicted_amount / 12.0, 2),
            },
            "model_input": ui_input,
            "explainability": explanation,
            "transparency": {
                "model_type": "XGBoost regressor on Kaggle medical_insurance.csv",
                "note": "This is an estimate based on historical data and may not reflect an actual insurance quote."
            },
        }

        return jsonify(response), 200

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": str(e)}), 500


# ---------- FORECAST ENDPOINT ----------

@app.route("/api/forecast", methods=["POST"])
def api_forecast():
    """
    Forecast endpoint (second feature).

    Expected JSON:
    {
      "age": 35,
      "sex": "Female",
      "province": "Ontario",
      "employer_size": "Individual",
      "plan_type": "Extended Health",
      "risk_score": 1.5
    }
    """
    data = request.get_json() or {}

    try:
        ui_input = {
            "age": int(data.get("age", 35)),
            "sex": data.get("sex", "Female"),
            "province": data.get("province", "Ontario"),
            "employer_size": data.get("employer_size", "Individual"),
            "plan_type": data.get("plan_type", "Extended Health"),
            "risk_score": float(data.get("risk_score", 1.5)),
        }

        result = forecast_premium_from_input(ui_input)

        if "error" in result:
            return jsonify(result), 400

        return jsonify(result), 200

    except Exception as e:
        print("Forecast error:", e)
        return jsonify({"error": str(e)}), 500


# ---------- HEALTH CHECK ----------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
