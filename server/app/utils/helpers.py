"""Helper functions for the application"""


def get_payment_status(due_date, payment_date):
    """
    Categorize payment status based on payment date relative to due date
    """
    if payment_date is None:
        return "Unpaid"

    # Calculate days difference between due date and payment date
    days_difference = (payment_date - due_date).days

    if days_difference <= 5:
        return "On Time"
    elif days_difference <= 30:
        return "Late"
    else:
        return "Defaulted"
