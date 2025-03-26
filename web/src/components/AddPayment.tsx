import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  ADD_PAYMENT_MUTATION,
  GET_LOANS_WITH_PAYMENTS,
} from "../graphql/queries";
import { LoadingSpinner } from "./LoadingSpinner";

export const AddPayment: React.FC = () => {
  const [loanId, setLoanId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [addPayment, { loading, error }] = useMutation(ADD_PAYMENT_MUTATION, {
    refetchQueries: [{ query: GET_LOANS_WITH_PAYMENTS }],
    onCompleted: () => {
      setLoanId("");
      setPaymentDate("");
      setFormError(null);
    },
    onError: (error) => {
      if (error.graphQLErrors.length > 0) {
        setFormError(error.graphQLErrors[0].message);
      } else if (error.networkError) {
        setFormError("Network error. Please check your connection.");
      } else {
        setFormError("An unexpected error occurred.");
      }
    },
  });

  const validateForm = () => {
    if (!loanId.trim()) {
      setFormError("Loan ID is required");
      return false;
    }

    const loanIdNum = parseInt(loanId);
    if (isNaN(loanIdNum) || loanIdNum <= 0) {
      setFormError("Loan ID must be a positive number");
      return false;
    }

    if (paymentDate) {
      const selectedDate = new Date(paymentDate);
      const today = new Date();
      if (selectedDate > today) {
        setFormError("Payment date cannot be in the future");
        return false;
      }
    }

    setFormError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    addPayment({
      variables: {
        loanId: parseInt(loanId),
        paymentDate: paymentDate || new Date().toISOString().split("T")[0],
      },
    });
  };

  return (
    <div>
      <h2>Add New Payment</h2>
      {formError && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "10px" }}
        >
          {formError}
        </div>
      )}
      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "10px" }}
        >
          Unexpected error: {error.message}
        </div>
      )}
      {loading && <LoadingSpinner />}
      <form
        onSubmit={handleSubmit}
        style={{
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <div>
          <label>Loan ID:</label>
          <input
            type="number"
            value={loanId}
            onChange={(e) => setLoanId(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label>Payment Date (optional):</label>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Payment"}
        </button>
      </form>
    </div>
  );
};
