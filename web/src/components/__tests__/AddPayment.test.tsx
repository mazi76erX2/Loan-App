import { render, screen, fireEvent } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { AddPayment } from "../AddPayment";
import {
  ADD_LOAN_MUTATION,
  GET_LOANS_WITH_PAYMENTS,
} from "../../graphql/queries";

const mockAddLoanMutation = {
  request: {
    query: ADD_LOAN_MUTATION,
    variables: {
      name: "Test Loan",
      interestRate: 5.0,
      principal: 10000,
      dueDate: "2025-06-01",
      paymentDate: null,
    },
  },
  result: {
    data: {
      addLoan: {
        id: "5",
        name: "Test Loan",
        interestRate: 5.0,
        principal: 10000,
        dueDate: "2025-06-01",
        paymentDate: null,
        status: "Unpaid",
        color: "grey",
      },
    },
  },
};

describe("AddPayment Component", () => {
  it("renders form inputs", () => {
    const { getByLabelText } = render(
      <MockedProvider>
        <AddPayment />
      </MockedProvider>
    );

    expect(getByLabelText("Loan Name")).toBeTruthy();
    expect(getByLabelText("Interest Rate")).toBeTruthy();
    expect(getByLabelText("Principal Amount")).toBeTruthy();
    expect(getByLabelText("Due Date")).toBeTruthy();
    expect(getByLabelText("Payment Date")).toBeTruthy();
  });

  it("validates form inputs", async () => {
    const { getByText } = render(
      <MockedProvider>
        <AddPayment />
      </MockedProvider>
    );

    const submitButton = getByText(/Add Loan/i);
    fireEvent.click(submitButton);

    const loanNameError = await screen.findByText(/Loan name is required/i);
    const interestRateError = await screen.findByText(
      /Interest rate must be between 0 and 100/i
    );
    const principalError = await screen.findByText(
      /Principal must be a positive number/i
    );
    const dueDateError = await screen.findByText(/Due date is required/i);

    expect(loanNameError).toBeTruthy();
    expect(interestRateError).toBeTruthy();
    expect(principalError).toBeTruthy();
    expect(dueDateError).toBeTruthy();
  });

  it("submits form with valid data", async () => {
    const mocks = [
      mockAddLoanMutation,
      {
        request: {
          query: GET_LOANS_WITH_PAYMENTS,
        },
        result: {
          data: {
            loansWithPayments: [],
          },
        },
      },
    ];

    const { getByLabelText, getByText, queryByText } = render(
      <MockedProvider mocks={mocks}>
        <AddPayment />
      </MockedProvider>
    );

    fireEvent.change(getByLabelText("Loan Name"), {
      target: { value: "Test Loan" },
    });
    fireEvent.change(getByLabelText("Interest Rate"), {
      target: { value: "5.0" },
    });
    fireEvent.change(getByLabelText("Principal Amount"), {
      target: { value: "10000" },
    });
    fireEvent.change(getByLabelText("Due Date"), {
      target: { value: "2025-06-01" },
    });

    const submitButton = getByText(/Add Loan/i);
    fireEvent.click(submitButton);

    await screen.findByText(/Add Loan/i);
    const loadingText = queryByText(/Adding Loan.../i);

    expect(loadingText).toBeNull();
  });
});
