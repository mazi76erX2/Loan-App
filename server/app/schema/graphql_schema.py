import graphene
from app.models.loan import get_all_loans, get_all_payments
from app.utils.helpers import get_payment_status


class ExistingLoans(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    interest_rate = graphene.Float(name="interestRate")
    principal = graphene.Int()
    due_date = graphene.String(name="dueDate")


class LoanPayment(graphene.ObjectType):
    id = graphene.Int()
    loan_id = graphene.Int()
    payment_date = graphene.String(name="paymentDate")


class LoanWithPayment(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    interest_rate = graphene.Float(name="interestRate")
    principal = graphene.Int()
    due_date = graphene.String(name="dueDate")
    payment_date = graphene.String(name="paymentDate")
    payment_id = graphene.Int(name="paymentId")
    status = graphene.String()
    color = graphene.String()


class Query(graphene.ObjectType):
    loans = graphene.List(ExistingLoans)
    loan_payments = graphene.List(LoanPayment)
    loans_with_payments = graphene.List(LoanWithPayment)

    def resolve_loans(self, info):
        return get_all_loans()

    def resolve_loan_payments(self, info):
        return get_all_payments()

    def resolve_loans_with_payments(self, info):
        loans = get_all_loans()
        payments = get_all_payments()

        payment_dict = {payment["loan_id"]: payment for payment in payments}

        result = []
        for loan in loans:
            loan_id = loan["id"]
            payment = payment_dict.get(loan_id)

            status = get_payment_status(
                loan["due_date"], payment["payment_date"] if payment else None
            )

            status_colors = {
                "On Time": "green",
                "Late": "orange", 
                "Defaulted": "red",
                "Unpaid": "grey"
            }

            loan_with_payment = {
                "id": loan_id,
                "name": loan["name"],
                "interest_rate": loan["interest_rate"],
                "principal": loan["principal"],
                "due_date": loan["due_date"].isoformat(),
                "payment_date": (
                    payment["payment_date"].isoformat() if payment else None
                ),
                "payment_id": payment["id"] if payment else None,
                "status": status,
                "color": status_colors.get(status, "grey")
            }
            result.append(loan_with_payment)

        return result


schema = graphene.Schema(query=Query)