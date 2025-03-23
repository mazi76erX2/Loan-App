import graphene
from ..models.loan import get_all_loans


class ExistingLoans(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    interest_rate = graphene.Float(name="interestRate")
    principal = graphene.Int()
    due_date = graphene.String(name="dueDate")


class Query(graphene.ObjectType):
    loans = graphene.List(ExistingLoans)

    def resolve_loans(self, info):
        return get_all_loans()


schema = graphene.Schema(query=Query)
