import graphene
import datetime
import traceback
from app.data.loans import loans
from app.utils.helpers import get_payment_status


class LoanType(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    interestRate = graphene.Float()
    principal = graphene.Int()
    dueDate = graphene.String()
    paymentDate = graphene.String()
    status = graphene.String()
    color = graphene.String()


class AddLoanMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        interestRate = graphene.Float(required=True)
        principal = graphene.Int(required=True)
        dueDate = graphene.String(required=True)
        paymentDate = graphene.String(required=False)

    Output = LoanType

    @staticmethod
    def mutate(root, info, **kwargs):
        try:
            print("Received mutation arguments:", kwargs)

            name = kwargs.get("name")
            interest_rate = kwargs.get("interestRate")
            principal = kwargs.get("principal")
            due_date = kwargs.get("dueDate")
            payment_date = kwargs.get("paymentDate", None)

            if not all([name, interest_rate is not None, principal, due_date]):
                raise ValueError("Missing required fields")

            due_date_obj = datetime.datetime.strptime(due_date, "%Y-%m-%d").date()
            payment_date_obj = (
                datetime.datetime.strptime(payment_date, "%Y-%m-%d").date()
                if payment_date
                else None
            )

            today = datetime.date.today()

            if payment_date_obj:
                if payment_date_obj > today:
                    raise ValueError("Payment date cannot be in the future")

                if payment_date_obj > due_date_obj:
                    raise ValueError("Payment date cannot be after due date")

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
                "interest_rate": float(interest_rate),
                "principal": int(principal),
                "due_date": due_date_obj,
                "payment_date": payment_date_obj,
                "status": status,
                "color": status_colors.get(status, "grey"),
            }

            loans.append(new_loan)

            return LoanType(
                id=new_loan["id"],
                name=new_loan["name"],
                interestRate=new_loan["interest_rate"],
                principal=new_loan["principal"],
                dueDate=new_loan["due_date"].isoformat(),
                paymentDate=(
                    new_loan["payment_date"].isoformat()
                    if new_loan["payment_date"]
                    else None
                ),
                status=status,
                color=new_loan["color"],
            )
        except Exception as e:
            print(f"Mutation Error: {str(e)}")
            print(traceback.format_exc())
            raise


class Mutation(graphene.ObjectType):
    add_loan = AddLoanMutation.Field()


class Query(graphene.ObjectType):
    loans_with_payments = graphene.List(LoanType)

    def resolve_loans_with_payments(self, info):
        result = []
        status_colors = {
            "On Time": "green",
            "Late": "orange",
            "Defaulted": "red",
            "Unpaid": "grey",
        }

        for loan in loans:
            payment_date = loan.get("payment_date")
            due_date = loan["due_date"]

            status = (
                get_payment_status(due_date, payment_date) if payment_date else "Unpaid"
            )

            result.append(
                LoanType(
                    id=loan["id"],
                    name=loan["name"],
                    interestRate=loan["interest_rate"],
                    principal=loan["principal"],
                    dueDate=due_date.isoformat(),
                    paymentDate=payment_date.isoformat() if payment_date else None,
                    status=status,
                    color=status_colors.get(status, "grey"),
                )
            )

        return result


schema = graphene.Schema(query=Query, mutation=Mutation)
