import datetime

from ..data.loans import loans, loan_payments


def get_all_loans():
    return loans


def get_all_payments():
    return loan_payments


def add_payment(payment_data):
    new_payment = {
        "id": len(loan_payments) + 1,
        "loan_id": payment_data["loan_id"],
        "payment_date": payment_data.get(
            "payment_date", datetime.date.today().isoformat()
        ),
    }

    loan_payments.append(new_payment)
    return new_payment
