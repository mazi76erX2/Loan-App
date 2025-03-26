import { render, screen, fireEvent } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { LoanList } from "../LoanList";
import { GET_LOANS_WITH_PAYMENTS } from "../../graphql/queries";

const mockLoansData = [
  {
    id: "1",
    name: "Tom's Loan",
    interestRate: 5.0,
    principal: 10000,
    dueDate: "2025-03-01",
    paymentDate: "2025-03-04",
    status: "On Time",
    color: "green",
  },
  {
    id: "2",
    name: "Chris Wailaka",
    interestRate: 3.5,
    principal: 500000,
    dueDate: "2025-03-01",
    paymentDate: "2025-03-15",
    status: "Late",
    color: "orange",
  },
  {
    id: "3",
    name: "NP Mobile Money",
    interestRate: 4.5,
    principal: 30000,
    dueDate: "2025-03-01",
    paymentDate: "2025-04-05",
    status: "Defaulted",
    color: "red",
  },
  {
    id: "4",
    name: "Esther's Autoparts",
    interestRate: 1.5,
    principal: 40000,
    dueDate: "2025-03-01",
    paymentDate: null,
    status: "Unpaid",
    color: "grey",
  },
];

const mocks = [
  {
    request: {
      query: GET_LOANS_WITH_PAYMENTS,
    },
    result: {
      data: {
        loansWithPayments: mockLoansData,
      },
    },
  },
];

describe("LoanList Component", () => {
  it("renders loading spinner initially", () => {
    // Create a mock that will delay the response
    const delayedMock = {
      request: {
        query: GET_LOANS_WITH_PAYMENTS,
      },
      delay: 100, // simulate a delay
      result: {
        data: {
          loansWithPayments: mockLoansData,
        },
      },
    };

    render(
      <MockedProvider mocks={[delayedMock]} addTypename={false}>
        <LoanList />
      </MockedProvider>
    );

    // Check for loading spinner
    const loadingSpinner = screen.getByTestId("loading-spinner");
    expect(loadingSpinner).toBeTruthy();
  });

  it("renders loans with correct details", async () => {
    const { findByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LoanList />
      </MockedProvider>
    );

    // Wait for and check each loan name
    const tomLoan = await findByText("Tom's Loan");
    const chrisLoan = await findByText("Chris Wailaka");
    const npmLoan = await findByText("NP Mobile Money");
    const estherLoan = await findByText("Esther's Autoparts");

    expect(tomLoan).toBeTruthy();
    expect(chrisLoan).toBeTruthy();
    expect(npmLoan).toBeTruthy();
    expect(estherLoan).toBeTruthy();
  });

  it("filters loans by status", async () => {
    const { findByText, queryByText, getByRole } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LoanList />
      </MockedProvider>
    );

    // Wait for loans to load
    await findByText("Tom's Loan");

    // Select status filter
    const statusSelect = getByRole("combobox");

    // Filter by "On Time"
    fireEvent.change(statusSelect, { target: { value: "on time" } });
    const tomLoan = await findByText("Tom's Loan");
    const chrisLoan = queryByText("Chris Wailaka");

    expect(tomLoan).toBeTruthy();
    expect(chrisLoan).toBeNull();

    // Filter by "Unpaid"
    fireEvent.change(statusSelect, { target: { value: "unpaid" } });
    const estherLoan = await findByText("Esther's Autoparts");
    const tomLoanAfter = queryByText("Tom's Loan");

    expect(estherLoan).toBeTruthy();
    expect(tomLoanAfter).toBeNull();
  });

  it("displays summary statistics", async () => {
    const { findByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LoanList />
      </MockedProvider>
    );

    // Wait for loans to load and check summary statistics
    const totalLoans = await findByText(/Total Loans: 4/);
    const onTimeLoans = await findByText(/On Time Loans: 1/);
    const lateLoanCount = await findByText(/Late Loans: 1/);
    const defaultedLoanCount = await findByText(/Defaulted Loans: 1/);
    const unpaidLoanCount = await findByText(/Unpaid Loans: 1/);

    expect(totalLoans).toBeTruthy();
    expect(onTimeLoans).toBeTruthy();
    expect(lateLoanCount).toBeTruthy();
    expect(defaultedLoanCount).toBeTruthy();
    expect(unpaidLoanCount).toBeTruthy();
  });
});
