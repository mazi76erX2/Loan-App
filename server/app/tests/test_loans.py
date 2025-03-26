import unittest
import datetime
from app.utils.helpers import get_payment_status
from app.data.loans import loans
from app.schema.graphql_schema import AddLoanMutation


class TestLoanModels(unittest.TestCase):
    def setUp(self):
        self.original_loans = [loan.copy() for loan in loans]

    def tearDown(self):
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

    def test_add_loan_mutation_future_payment_date(self):
        loan_data = {
            "name": "Future Payment Loan",
            "interestRate": 4.5,
            "principal": 15000,
            "dueDate": "2025-06-01",
            "paymentDate": "2025-06-15",
        }

        class MockInfo:
            pass

        mutation = AddLoanMutation()
        with self.assertRaises(ValueError) as context:
            mutation.mutate(root=None, info=MockInfo(), **loan_data)

        self.assertTrue(
            "Payment date cannot be in the future" in str(context.exception)
        )

    def test_add_loan_mutation_payment_after_due_date(self):
        loan_data = {
            "name": "Late Payment Loan",
            "interestRate": 4.5,
            "principal": 15000,
            "dueDate": "2025-06-01",
            "paymentDate": "2025-06-15",
        }

        class MockInfo:
            pass

        mutation = AddLoanMutation()
        with self.assertRaises(ValueError) as context:
            mutation.mutate(root=None, info=MockInfo(), **loan_data)

        self.assertFalse(
            "Payment date cannot be after due date" in str(context.exception)
        )


def run_tests():
    loader = unittest.TestLoader()
    test_suite = loader.loadTestsFromTestCase(TestLoanModels)

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(test_suite)

    return result


if __name__ == "__main__":
    run_tests()
