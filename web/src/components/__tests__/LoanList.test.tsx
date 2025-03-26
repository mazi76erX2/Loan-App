import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { LoanList } from "../LoanList";
import { GET_LOANS_WITH_PAYMENTS } from "../../graphql/queries";

const mockLoansData = [
  {
    id: 1,
    name: "Tom's Loan",
    interestRate: 5.0,
    principal: 10000,
    dueDate: "2025-03-01",
    paymentDate: "2025-03-04",
    status: "On Time",
    color: "green",
  },
  {
    id: 2,
    name: "Chris Wailaka",
    interestRate: 3.5,
    principal: 500000,
    dueDate: "2025-03-01",
    paymentDate: "2025-03-15",
    status: "Late",
    color: "orange",
  },
  {
    id: 3,
    name: "NP Mobile Money",
    interestRate: 4.5,
    principal: 30000,
    dueDate: "2025-03-01",
    paymentDate: "2025-04-05",
    status: "Defaulted",
    color: "red",
  },
  {
    id: 4,
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
  it("handles loading state", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LoanList />
      </MockedProvider>
    );

    const loadingSpinner = screen.getByTestId("loading-spinner");
    expect(loadingSpinner).toBeTruthy();
  });

  it("renders loans with correct details", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LoanList />
      </MockedProvider>
    );

    // Wait for the loans to load
    const tomLoan = await screen.findByText("Tom's Loan");
    expect(tomLoan).toBeTruthy();

    // Verify all loan names are present
    const loanNames = [
      "Tom's Loan",
      "Chris Wailaka",
      "NP Mobile Money",
      "Esther's Autoparts",
    ];

    loanNames.forEach((name) => {
      const nameElement = screen.getByText(name);
      expect(nameElement).toBeTruthy();
    });
  });

  it("displays correct loan details", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LoanList />
      </MockedProvider>
    );

    // Verify loan details
    await screen.findByText("Tom's Loan");

    // Check specific loan details
    const principalElement = screen.getByText("$10000");
    const interestRateElement = screen.getByText("5.0%");
    const statusElement = screen.getByText("On Time");

    expect(principalElement).toBeTruthy();
    expect(interestRateElement).toBeTruthy();
    expect(statusElement).toBeTruthy();
  });
});
