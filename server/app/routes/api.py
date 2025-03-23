from flask import Blueprint, jsonify, request
from app.models.loan import add_payment

api_bp = Blueprint("api", __name__)


@api_bp.route("/")
def home():
    return "Welcome to the Loan Application API"


@api_bp.route("/api/payments", methods=["POST"])
def handle_add_payment():
    payment_data = request.json

    if not payment_data or "loan_id" not in payment_data:
        return jsonify({"error": "Invalid payment data"}), 400

    new_payment = add_payment(payment_data)
    return (
        jsonify({"message": "Payment added successfully", "payment": new_payment}),
        201,
    )
