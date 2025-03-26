import { gql } from "@apollo/client";

export const GET_LOANS_WITH_PAYMENTS = gql`
  query GetLoansWithPayments {
    loansWithPayments {
      id
      name
      interestRate
      principal
      dueDate
      paymentDate
      status
    }
  }
`;

export const ADD_PAYMENT_MUTATION = gql`
  mutation AddPayment($loanId: Int!, $paymentDate: String) {
    addPayment(loanId: $loanId, paymentDate: $paymentDate) {
      id
      loanId
      paymentDate
    }
  }
`;
