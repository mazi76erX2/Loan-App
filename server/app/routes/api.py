from flask import Blueprint

api_bp = Blueprint("api", __name__)


@api_bp.route("/")
def home():
    return "Welcome to the Loan Application API"
