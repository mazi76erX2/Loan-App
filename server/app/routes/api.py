from flask import Blueprint, jsonify, request
from app.data.loans import loans
from app.utils.helpers import get_payment_status
import datetime

api_bp = Blueprint("api", __name__)


@api_bp.route("/")
def home():
    """
    Home route providing basic API information
    """
    return jsonify(
        {
            "message": "Welcome to the Loan Management API",
            "total_loans": len(loans),
            "endpoints": {"graphql": "/graphql", "home": "/"},
        }
    )


@api_bp.route("/loans", methods=["GET"])
def get_all_loans():
    """
    REST endpoint to retrieve all loans
    """
    loan_list = []
    for loan in loans:
        loan_data = loan.copy()
        loan_data["due_date"] = loan_data["due_date"].isoformat()
        loan_data["payment_date"] = (
            loan_data["payment_date"].isoformat() if loan_data["payment_date"] else None
        )
        loan_data["status"] = get_payment_status(
            loan["due_date"], loan.get("payment_date")
        )
        loan_list.append(loan_data)

    return jsonify(loan_list)


@api_bp.route("/loans/<int:loan_id>", methods=["GET"])
def get_loan_by_id(loan_id):
    """
    REST endpoint to retrieve a specific loan by ID
    """
    loan = next((loan for loan in loans if loan["id"] == loan_id), None)

    if not loan:
        return jsonify({"error": "Loan not found"}), 404

    loan_data = loan.copy()
    loan_data["due_date"] = loan_data["due_date"].isoformat()
    loan_data["payment_date"] = (
        loan_data["payment_date"].isoformat() if loan_data["payment_date"] else None
    )
    loan_data["status"] = get_payment_status(loan["due_date"], loan.get("payment_date"))

    return jsonify(loan_data)


@api_bp.route("/loans/status/<status>", methods=["GET"])
def get_loans_by_status(status):
    """
    REST endpoint to retrieve loans by status
    """
    status = status.replace("-", " ").title()
    filtered_loans = []

    for loan in loans:
        loan_status = get_payment_status(loan["due_date"], loan.get("payment_date"))

        if loan_status.lower() == status.lower():
            loan_data = loan.copy()
            loan_data["due_date"] = loan_data["due_date"].isoformat()
            loan_data["payment_date"] = (
                loan_data["payment_date"].isoformat()
                if loan_data["payment_date"]
                else None
            )
            loan_data["status"] = loan_status
            filtered_loans.append(loan_data)

    return jsonify(filtered_loans)


@api_bp.errorhandler(404)
def not_found(error):
    """
    Custom 404 error handler
    """
    return (
        jsonify(
            {
                "error": "Not Found",
                "message": "The requested resource could not be found",
            }
        ),
        404,
    )


@api_bp.errorhandler(500)
def server_error(error):
    """
    Custom 500 error handler
    """
    return (
        jsonify(
            {
                "error": "Internal Server Error",
                "message": "Something went wrong on the server",
            }
        ),
        500,
    )
