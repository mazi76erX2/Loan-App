import React from "react";
import { useQuery } from "@apollo/client";
import { GET_LOANS_WITH_PAYMENTS } from "../graphql/queries";

type LoanType = {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  dueDate: string;
  paymentDate?: string;
  status: string;
  color: string;
};

export const LoanList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_LOANS_WITH_PAYMENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="loan-list">
      <h2>Existing Loans</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Principal</th>
            <th>Interest Rate</th>
            <th>Due Date</th>
            <th>Payment Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.loansWithPayments.map(
            (
              loan: LoanType // Update the type annotation
            ) => (
              <tr key={loan.id} style={{ backgroundColor: loan.color }}>
                <td>{loan.name}</td>
                <td>${loan.principal}</td>
                <td>{loan.interestRate}%</td>
                <td>{loan.dueDate}</td>
                <td>{loan.paymentDate || "Not Paid"}</td>
                <td>{loan.status}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};
