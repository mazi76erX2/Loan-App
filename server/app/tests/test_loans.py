import unittest
import datetime
from app.models.loan import get_all_loans, get_all_payments
from app.utils.helpers import get_payment_status
from app.data.loans import loans
from app.schema.graphql_schema import AddLoanMutation


class TestLoanModels(unittest.TestCase):
    def setUp(self):
        # Create a deep copy of original data to reset between tests
        self.original_loans = [
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

    def tearDown(self):
        # Reset loans to original state
        loans.clear()
        loans.extend(self.original_loans)

    def test_payment_status_calculation(self):
        test_cases = [
            {
                "due_date": datetime.date(2025, 3, 1),
                "payment_date": datetime.date(2025, 3, 4),
                "expected_status": "On Time",
            },
            {
                "due_date": datetime.date(2025, 3, 1),
                "payment_date": datetime.date(2025, 3, 15),
                "expected_status": "Late",
            },
            {
                "due_date": datetime.date(2025, 3, 1),
                "payment_date": datetime.date(2025, 4, 5),
                "expected_status": "Defaulted",
            },
            {
                "due_date": datetime.date(2025, 3, 1),
                "payment_date": None,
                "expected_status": "Unpaid",
            },
        ]

        for case in test_cases:
            status = get_payment_status(case["due_date"], case["payment_date"])
            self.assertEqual(status, case["expected_status"])

    def test_initial_loan_data(self):
        # Verify the initial loan data matches the expected structure
        self.assertEqual(len(loans), 4)

        # Check specific loan details
        tom_loan = loans[0]
        self.assertEqual(tom_loan["name"], "Tom's Loan")
        self.assertEqual(tom_loan["interest_rate"], 5.0)
        self.assertEqual(tom_loan["principal"], 10000)
        self.assertEqual(tom_loan["status"], "On Time")

    def test_add_loan_mutation(self):
        # Prepare test loan data
        loan_data = {
            "name": "New Test Loan",
            "interest_rate": 6.0,
            "principal": 25000,
            "due_date": "2025-06-01",
            "payment_date": "2025-05-28",
        }

        # Create mock info object
        class MockInfo:
            pass

        # Execute mutation
        mutation = AddLoanMutation()
        result = mutation.mutate(MockInfo(), **loan_data)

        # Verify mutation result
        self.assertEqual(result.name, loan_data["name"])
        self.assertEqual(result.interest_rate, loan_data["interest_rate"])
        self.assertEqual(result.principal, loan_data["principal"])
        self.assertEqual(result.due_date, loan_data["due_date"])
        self.assertEqual(result.payment_date, loan_data["payment_date"])
        self.assertEqual(result.status, "On Time")
        self.assertEqual(result.color, "green")


def run_tests():
    test_suite = unittest.TestSuite()
    test_suite.addTests(unittest.makeSuite(TestLoanModels))

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(test_suite)

    return result


if __name__ == "__main__":
    run_tests()
