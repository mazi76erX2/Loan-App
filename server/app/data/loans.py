"""Represents the data for the loans and loan payments."""

import datetime

loans = [
    {
        "id": 1,
        "name": "Tom's Loan",
        "interest_rate": 5.0,
        "principal": 10000,
        "due_date": datetime.date(2025, 3, 1),
        "payment_date": datetime.date(2025, 3, 4),
        "status": "On Time",
    },
    {
        "id": 2,
        "name": "Chris Wailaka",
        "interest_rate": 3.5,
        "principal": 500000,
        "due_date": datetime.date(2025, 3, 1),
        "payment_date": datetime.date(2025, 3, 15),
        "status": "Late",
    },
    {
        "id": 3,
        "name": "NP Mobile Money",
        "interest_rate": 4.5,
        "principal": 30000,
        "due_date": datetime.date(2025, 3, 1),
        "payment_date": datetime.date(2025, 4, 5),
        "status": "Defaulted",
    },
    {
        "id": 4,
        "name": "Esther's Autoparts",
        "interest_rate": 1.5,
        "principal": 40000,
        "due_date": datetime.date(2025, 3, 1),
        "payment_date": None,
        "status": "Unpaid",
    },
]

loan_payments = [
    {"id": 1, "loan_id": 1, "payment_date": datetime.date(2025, 3, 4)},
    {"id": 2, "loan_id": 2, "payment_date": datetime.date(2025, 3, 15)},
    {"id": 3, "loan_id": 3, "payment_date": datetime.date(2025, 4, 5)},
]
