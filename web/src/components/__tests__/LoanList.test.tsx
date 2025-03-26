import { render, screen } from "@testing-library/react";
import { toBeInTheDocument } from "@testing-library/jest-dom/matchers";
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
  },
  {
    id: 2,
    name: "Chris Wailaka",
    interestRate: 3.5,
    principal: 500000,
    dueDate: "2025-03-01",
    paymentDate: "2025-03-15",
    status: "Late",
  },
  {
    id: 3,
    name: "NP Mobile Money",
    interestRate: 4.5,
    principal: 30000,
    dueDate: "2025-03-01",
    paymentDate: "2025-04-05",
    status: "Defaulted",
  },
  {
    id: 4,
    name: "Esther's Autoparts",
    interestRate: 1.5,
    principal: 40000,
    dueDate: "2025-03-01",
    paymentDate: null,
    status: "Unpaid",
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
  it("renders loans with correct details", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LoanList />
      </MockedProvider>
    );

    // Wait for the loans to load
    const tomLoan = await screen.findByText("Tom's Loan");
    expect.extend({ toBeInTheDocument });

    expect(tomLoan).toBeInTheDocument();

    // Verify all loan names are present
    expect(screen.getByText("Tom's Loan")).toBeInTheDocument();
    expect(screen.getByText("Chris Wailaka")).toBeInTheDocument();
    expect(screen.getByText("NP Mobile Money")).toBeInTheDocument();
    expect(screen.getByText("Esther's Autoparts")).toBeInTheDocument();
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
    expect(screen.getByText("$10000")).toBeInTheDocument();
    expect(screen.getByText("5.0%")).toBeInTheDocument();
    expect(screen.getByText("On Time")).toBeInTheDocument();
  });
});
