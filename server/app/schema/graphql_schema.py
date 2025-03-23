import graphene
from app.models.loan import get_all_loans, get_all_payments


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


class Query(graphene.ObjectType):
    loans = graphene.List(ExistingLoans)
    loan_payments = graphene.List(LoanPayment)
    loans_with_payments = graphene.List(ExistingLoans)

    def resolve_loans(self, info):
        return get_all_loans()

    def resolve_loan_payments(self, info):
        return get_all_payments()

    def resolve_loans_with_payments(self, info):
        return get_all_loans()


schema = graphene.Schema(query=Query)
