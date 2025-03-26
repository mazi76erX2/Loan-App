import graphene
import datetime
from app.data.loans import loans
from app.utils.helpers import get_payment_status


class LoanType(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    interest_rate = graphene.Float(name="interestRate")
    principal = graphene.Int()
    due_date = graphene.String(name="dueDate")
    payment_date = graphene.String(name="paymentDate")
    status = graphene.String()
    color = graphene.String()


class AddLoanMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        interest_rate = graphene.Float(required=True)
        principal = graphene.Int(required=True)
        due_date = graphene.String(required=True)
        payment_date = graphene.String(required=False)

    Output = LoanType

    @staticmethod
    def mutate(root, info, name, interest_rate, principal, due_date, payment_date=None):
        try:
            due_date_obj = datetime.datetime.strptime(due_date, "%Y-%m-%d").date()
            payment_date_obj = (
                datetime.datetime.strptime(payment_date, "%Y-%m-%d").date()
                if payment_date
                else None
            )

            status = (
                get_payment_status(due_date_obj, payment_date_obj)
                if payment_date_obj
                else "Unpaid"
            )

            status_colors = {
                "On Time": "green",
                "Late": "orange",
                "Defaulted": "red",
                "Unpaid": "grey",
            }

            new_loan = {
                "id": len(loans) + 1,
                "name": name,
                "interest_rate": interest_rate,
                "principal": principal,
                "due_date": due_date_obj.isoformat(),
                "payment_date": (
                    payment_date_obj.isoformat() if payment_date_obj else None
                ),
                "status": status,
                "color": status_colors.get(status, "grey"),
            }

            loans.append(new_loan)

            return LoanType(**new_loan)
        except Exception as e:
            raise Exception(f"Error adding loan: {str(e)}")


class Mutation(graphene.ObjectType):
    add_loan = AddLoanMutation.Field()


class Query(graphene.ObjectType):
    loans_with_payments = graphene.List(LoanType)

    def resolve_loans_with_payments(self, info):
        status_colors = {
            "On Time": "green",
            "Late": "orange",
            "Defaulted": "red",
            "Unpaid": "grey",
        }

        return [
            LoanType(
                id=loan["id"],
                name=loan["name"],
                interest_rate=loan["interest_rate"],
                principal=loan["principal"],
                due_date=loan["due_date"],
                payment_date=loan["payment_date"],
                status=get_payment_status(loan["due_date"], loan.get("payment_date")),
                color=status_colors.get(
                    get_payment_status(loan["due_date"], loan.get("payment_date")),
                    "grey",
                ),
            )
            for loan in loans
        ]


schema = graphene.Schema(query=Query, mutation=Mutation)
