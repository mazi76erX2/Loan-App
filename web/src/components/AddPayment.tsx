import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_LOAN_MUTATION, GET_LOANS_WITH_PAYMENTS } from "../graphql/queries";
import { LoadingSpinner } from "./LoadingSpinner";

export const AddPayment: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    interestRate: "",
    principal: "",
    dueDate: "",
    paymentDate: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [addLoan, { loading, error }] = useMutation(ADD_LOAN_MUTATION, {
    refetchQueries: [{ query: GET_LOANS_WITH_PAYMENTS }],
    onCompleted: () => {
      setFormData({
        name: "",
        interestRate: "",
        principal: "",
        dueDate: "",
        paymentDate: "",
      });
      setFormErrors({});
    },
    onError: (err) => {
      console.error("Mutation Error Details:", err);
      console.error("Error Message:", err.message);
      console.error("GraphQL Errors:", err.graphQLErrors);
      console.error("Network Error:", err.networkError);
    },
  });

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case "name":
        return value.trim() ? null : "Loan name is required";
      case "interestRate":
        const rate = parseFloat(value);
        return !isNaN(rate) && rate >= 0 && rate <= 100
          ? null
          : "Interest rate must be between 0 and 100";
      case "principal":
        const principal = parseInt(value);
        return !isNaN(principal) && principal > 0
          ? null
          : "Principal must be a positive number";
      case "dueDate":
        return value ? null : "Due date is required";
      default:
        return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value) || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    (["name", "interestRate", "principal", "dueDate"] as const).forEach(
      (field) => {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    );

    // Validate payment date
    if (formData.paymentDate) {
      const paymentDate = new Date(formData.paymentDate);
      const dueDate = new Date(formData.dueDate);
      const today = new Date();

      // Remove time component for accurate date comparison
      today.setHours(0, 0, 0, 0);
      paymentDate.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);

      // Check if payment date is in the future
      if (paymentDate > today) {
        newErrors.paymentDate = "Payment date cannot be in the future";
      }

      // Check if payment date is after due date
      if (paymentDate > dueDate) {
        newErrors.paymentDate = "Payment date cannot be after due date";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    addLoan({
      variables: {
        name: formData.name,
        interestRate: parseFloat(formData.interestRate),
        principal: parseInt(formData.principal),
        dueDate: formData.dueDate,
        paymentDate: formData.paymentDate || null,
      },
    });
  };

  return (
    <div className="add-loan-container">
      <form onSubmit={handleSubmit} className="add-loan-form">
        <h2>Add New Loan</h2>

        {error && (
          <div className="error-text">
            {error.message}
            {error.graphQLErrors.map((err, index) => (
              <div key={index}>{err.message}</div>
            ))}
          </div>
        )}
        {loading && <LoadingSpinner />}

        <div className="form-group">
          <label>Loan Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
          />
          {formErrors.name && (
            <div className="error-text">{formErrors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label>Interest Rate (%)</label>
          <input
            type="number"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleInputChange}
            step="0.1"
            disabled={loading}
          />
          {formErrors.interestRate && (
            <div className="error-text">{formErrors.interestRate}</div>
          )}
        </div>

        <div className="form-group">
          <label>Principal Amount</label>
          <input
            type="number"
            name="principal"
            value={formData.principal}
            onChange={handleInputChange}
            disabled={loading}
          />
          {formErrors.principal && (
            <div className="error-text">{formErrors.principal}</div>
          )}
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            max={new Date().toISOString().split("T")[0]} // Prevent future due dates
            disabled={loading}
          />
          {formErrors.dueDate && (
            <div className="error-text">{formErrors.dueDate}</div>
          )}
        </div>

        <div className="form-group">
          <label>Payment Date (Optional)</label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleInputChange}
            max={new Date().toISOString().split("T")[0]} // Prevent future payment dates
            disabled={loading}
          />
          {formErrors.paymentDate && (
            <div className="error-text">{formErrors.paymentDate}</div>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Adding Loan..." : "Add Loan"}
        </button>
      </form>
    </div>
  );
};
