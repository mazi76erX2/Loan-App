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
      color
    }
  }
`;

export const ADD_LOAN_MUTATION = gql`
  mutation AddLoan(
    $name: String!
    $interestRate: Float!
    $principal: Int!
    $dueDate: String!
    $paymentDate: String
  ) {
    addLoan(
      name: $name
      interest_rate: $interestRate
      principal: $principal
      due_date: $dueDate
      payment_date: $paymentDate
    ) {
      id
      name
      interestRate
      principal
      dueDate
      paymentDate
      status
      color
    }
  }
`;
