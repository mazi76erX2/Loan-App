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
    const delayedMock = {
      request: {
        query: GET_LOANS_WITH_PAYMENTS,
      },
      delay: 100,
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

    const loadingSpinner = screen.getByTestId("loading-spinner");
    expect(loadingSpinner).toBeTruthy();
  });

  it("renders loans with correct details", async () => {
    const { findByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LoanList />
      </MockedProvider>
    );

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

    await findByText("Tom's Loan");

    const statusSelect = getByRole("combobox");

    fireEvent.change(statusSelect, { target: { value: "on time" } });
    const tomLoan = await findByText("Tom's Loan");
    const chrisLoan = queryByText("Chris Wailaka");

    expect(tomLoan).toBeTruthy();
    expect(chrisLoan).toBeNull();

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

    const totalLoans = await findByText("4");
    const onTimeLoans = await findByText("1", {
      selector: ".summary-item strong",
    });
    const lateLoanCount = await findByText("1", {
      selector: ".summary-item strong",
    });
    const defaultedLoanCount = await findByText("1", {
      selector: ".summary-item strong",
    });
    const unpaidLoanCount = await findByText("1", {
      selector: ".summary-item strong",
    });

    expect(totalLoans).toBeTruthy();
    expect(onTimeLoans).toBeTruthy();
    expect(lateLoanCount).toBeTruthy();
    expect(defaultedLoanCount).toBeTruthy();
    expect(unpaidLoanCount).toBeTruthy();
  });
});
