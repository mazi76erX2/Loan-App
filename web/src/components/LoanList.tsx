import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_LOANS_WITH_PAYMENTS } from "../graphql/queries";
import { LoadingSpinner } from "./LoadingSpinner";

type LoanType = {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  dueDate: string;
  paymentDate?: string | null;
  status: string;
  color: string;
};

export const LoanList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_LOANS_WITH_PAYMENTS);
  const [filter, setFilter] = useState<string>("all");

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-message">Error: {error.message}</p>;

  const loans = data?.loansWithPayments || [];

  const filteredLoans = loans.filter(
    (loan: LoanType) =>
      filter === "all" || loan.status.toLowerCase() === filter.toLowerCase()
  );

  const statusOptions = ["all", "on time", "late", "defaulted", "unpaid"];

  const statusCounts = loans.reduce(
    (acc: any, loan: LoanType) => {
      const status = loan.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {
      all: loans.length,
      "on time": 0,
      late: 0,
      defaulted: 0,
      unpaid: 0,
    }
  );

  return (
    <div className="loan-list-container">
      <h2>Existing Loans</h2>

      <div className="loan-filter">
        <label htmlFor="status-filter">Filter by Status: </label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="status-select"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <table className="loans-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Principal</th>
            <th>Interest Rate</th>
            <th>Due Date</th>
            <th>Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredLoans.length === 0 ? (
            <tr>
              <td colSpan={6} className="no-loans">
                No loans found for the selected status.
              </td>
            </tr>
          ) : (
            filteredLoans.map((loan: LoanType) => (
              <tr
                key={loan.id}
                className={`loan-status-${loan.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                <td>
                  <div
                    className="status-indicator"
                    style={{ backgroundColor: loan.color }}
                  />
                  {loan.status}
                </td>
                <td>{loan.name}</td>
                <td>${loan.principal.toLocaleString()}</td>
                <td>{loan.interestRate}%</td>
                <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                <td>
                  {loan.paymentDate
                    ? new Date(loan.paymentDate).toLocaleDateString()
                    : "Not Paid"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="loan-summary">
        <div className="summary-item">
          <span>Total Loans:</span>
          <strong>{loans.length}</strong>
        </div>
        {statusOptions.slice(1).map((status) => (
          <div key={status} className="summary-item">
            <span>
              {status.charAt(0).toUpperCase() + status.slice(1)} Loans:
            </span>
            <strong>{statusCounts[status.toLowerCase()] || 0}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
