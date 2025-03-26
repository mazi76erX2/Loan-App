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
      add_loan: {
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

    const loanNameInput = getByLabelText(/Loan Name/i);
    const interestRateInput = getByLabelText(/Interest Rate/i);
    const principalInput = getByLabelText(/Principal Amount/i);
    const dueDateInput = getByLabelText(/Due Date/i);
    const paymentDateInput = getByLabelText(/Payment Date/i);

    expect(loanNameInput).toBeTruthy();
    expect(interestRateInput).toBeTruthy();
    expect(principalInput).toBeTruthy();
    expect(dueDateInput).toBeTruthy();
    expect(paymentDateInput).toBeTruthy();
  });

  it("validates form inputs", async () => {
    const { getByText } = render(
      <MockedProvider>
        <AddPayment />
      </MockedProvider>
    );

    const submitButton = getByText(/Add Loan/i);
    fireEvent.click(submitButton);

    // Check for validation errors
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
            loans_with_payments: [],
          },
        },
      },
    ];

    const { getByLabelText, getByText, queryByText } = render(
      <MockedProvider mocks={mocks}>
        <AddPayment />
      </MockedProvider>
    );

    // Fill out form
    fireEvent.change(getByLabelText(/Loan Name/i), {
      target: { value: "Test Loan" },
    });
    fireEvent.change(getByLabelText(/Interest Rate/i), {
      target: { value: "5.0" },
    });
    fireEvent.change(getByLabelText(/Principal Amount/i), {
      target: { value: "10000" },
    });
    fireEvent.change(getByLabelText(/Due Date/i), {
      target: { value: "2025-06-01" },
    });

    const submitButton = getByText(/Add Loan/i);
    fireEvent.click(submitButton);

    // Wait for mutation to complete
    await screen.findByText(/Add Loan/i);
    const loadingText = queryByText(/Adding Loan.../i);

    expect(loadingText).toBeNull();
  });
});
