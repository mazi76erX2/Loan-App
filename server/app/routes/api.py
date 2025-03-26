import datetime
from flask import Blueprint, jsonify, request
from app.models.loan import add_payment

api_bp = Blueprint("api", __name__)


@api_bp.route("/api/payments", methods=["POST"])
def handle_add_payment():
    try:
        payment_data = request.json

        # Validate input
        if not payment_data:
            return jsonify({"error": "No payment data provided"}), 400

        # Validate loan_id exists and is an integer
        if not isinstance(payment_data.get("loan_id"), int):
            return jsonify({"error": "Invalid loan_id. Must be an integer."}), 400

        # Validate loan_id exists in loans
        from app.data.loans import loans

        if not any(loan["id"] == payment_data["loan_id"] for loan in loans):
            return jsonify({"error": "Loan ID does not exist"}), 404

        # Validate payment date
        if "payment_date" in payment_data:
            try:
                datetime.datetime.strptime(payment_data["payment_date"], "%Y-%m-%d")
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

        new_payment = add_payment(payment_data)
        return (
            jsonify(
                {
                    "message": "Payment added successfully",
                    "payment": {
                        "id": new_payment["id"],
                        "loan_id": new_payment["loan_id"],
                        "payment_date": new_payment["payment_date"].isoformat(),
                    },
                }
            ),
            201,
        )

    except Exception as e:
        # Catch-all for unexpected errors
        return (
            jsonify({"error": "An unexpected error occurred", "details": str(e)}),
            500,
        )
