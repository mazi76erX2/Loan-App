import unittest
import datetime
from app.models.loan import get_all_loans, get_all_payments, add_payment
from app.utils.helpers import get_payment_status
from app.data.loans import loans, loan_payments


class TestLoanModels(unittest.TestCase):
    def setUp(self):
        self.original_loans = loans.copy()
        self.original_payments = loan_payments.copy()

    def tearDown(self):
        loans.clear()
        loans.extend(self.original_loans)
        loan_payments.clear()
        loan_payments.extend(self.original_payments)

    def test_get_all_loans(self):
        all_loans = get_all_loans()
        expected_output = [
            {
                "id": 1,
                "name": "Tom's Loan",
                "interest_rate": 5.0,
                "principal": 10000,
                "due_date": datetime.date(2025, 3, 1),
            },
            {
                "id": 2,
                "name": "Chris Wailaka",
                "interest_rate": 3.5,
                "principal": 500000,
                "due_date": datetime.date(2025, 3, 1),
            },
            {
                "id": 3,
                "name": "NP Mobile Money",
                "interest_rate": 4.5,
                "principal": 30000,
                "due_date": datetime.date(2025, 3, 1),
            },
            {
                "id": 4,
                "name": "Esther's Autoparts",
                "interest_rate": 1.5,
                "principal": 40000,
                "due_date": datetime.date(2025, 3, 1),
            },
        ]

        # Compare loans without mutating original objects
        for expected, actual in zip(expected_output, all_loans):
            self.assertEqual(expected["id"], actual["id"])
            self.assertEqual(expected["name"], actual["name"])
            self.assertEqual(expected["interest_rate"], actual["interest_rate"])
            self.assertEqual(expected["principal"], actual["principal"])
            self.assertEqual(expected["due_date"], actual["due_date"])

    def test_get_all_payments(self):
        all_payments = get_all_payments()
        expected_output = [
            {"id": 1, "loan_id": 1, "payment_date": datetime.date(2025, 3, 4)},
            {"id": 2, "loan_id": 2, "payment_date": datetime.date(2025, 3, 15)},
            {"id": 3, "loan_id": 3, "payment_date": datetime.date(2025, 4, 5)},
        ]

        # Compare payments without mutating original objects
        for expected, actual in zip(expected_output, all_payments):
            self.assertEqual(expected["id"], actual["id"])
            self.assertEqual(expected["loan_id"], actual["loan_id"])
            self.assertEqual(expected["payment_date"], actual["payment_date"])

    def test_add_payment(self):
        initial_payment_count = len(loan_payments)
        new_payment_data = {"loan_id": 4, "payment_date": datetime.date(2025, 3, 15)}

        added_payment = add_payment(new_payment_data)

        self.assertEqual(len(loan_payments), initial_payment_count + 1)
        self.assertEqual(added_payment["loan_id"], 4)
        self.assertEqual(added_payment["payment_date"], datetime.date(2025, 3, 15))
        self.assertEqual(added_payment["id"], initial_payment_count + 1)

    def test_add_payment_invalid_loan_id(self):
        with self.assertRaises(ValueError):
            add_payment({"loan_id": 999, "payment_date": datetime.date(2025, 3, 15)})

    def test_add_payment_future_date(self):
        future_date = datetime.date.today() + datetime.timedelta(days=1)
        with self.assertRaises(ValueError):
            add_payment({"loan_id": 4, "payment_date": future_date})

    def test_add_payment_invalid_date_format(self):
        with self.assertRaises(ValueError):
            add_payment({"loan_id": 4, "payment_date": "invalid-date"})


class TestPaymentHelpers(unittest.TestCase):
    def test_payment_status_matches_expected_output(self):
        from app.schema.graphql_schema import Query

        # Call the resolver directly to get loans with payments
        loans_with_payments = Query.resolve_loans_with_payments(None, None)

        # Define expected output structure
        expected_output = [
            {
                "id": 1,
                "name": "Tom's Loan",
                "interestRate": 5.0,
                "principal": 10000,
                "dueDate": "2025-03-01",
                "paymentDate": "2025-03-04",
                "status": "On Time",
            },
            {
                "id": 2,
                "name": "Chris Wailaka",
                "interestRate": 3.5,
                "principal": 500000,
                "dueDate": "2025-03-01",
                "paymentDate": "2025-03-15",
                "status": "Late",
            },
            {
                "id": 3,
                "name": "NP Mobile Money",
                "interestRate": 4.5,
                "principal": 30000,
                "dueDate": "2025-03-01",
                "paymentDate": "2025-04-05",
                "status": "Defaulted",
            },
            {
                "id": 4,
                "name": "Esther's Autoparts",
                "interestRate": 1.5,
                "principal": 40000,
                "dueDate": "2025-03-01",
                "paymentDate": None,
                "status": "Unpaid",
            },
        ]

        # Compare loans with payments
        for expected, actual in zip(expected_output, loans_with_payments):
            self.assertEqual(expected["id"], actual["id"])
            self.assertEqual(expected["name"], actual["name"])
            self.assertEqual(expected["interestRate"], actual["interest_rate"])
            self.assertEqual(expected["principal"], actual["principal"])
            self.assertEqual(expected["dueDate"], actual["due_date"])
            self.assertEqual(expected["paymentDate"], actual["payment_date"])
            self.assertEqual(expected["status"], actual["status"])


def run_tests():
    test_suite = unittest.TestSuite()

    # Add test cases
    test_suite.addTests(unittest.makeSuite(TestLoanModels))
    test_suite.addTests(unittest.makeSuite(TestPaymentHelpers))

    # Create a test runner
    runner = unittest.TextTestRunner(verbosity=2)

    # Run the tests
    result = runner.run(test_suite)

    return result


if __name__ == "__main__":
    run_tests()
