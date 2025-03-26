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
    onError: (err) => console.error("Mutation Error:", err),
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

    if (formData.paymentDate) {
      const paymentDate = new Date(formData.paymentDate);
      const dueDate = new Date(formData.dueDate);
      if (paymentDate > new Date())
        newErrors.paymentDate = "Payment date cannot be in the future";
      if (paymentDate > dueDate)
        newErrors.paymentDate = "Payment date cannot be after due date";
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

        {error && <div className="error-text">{error.message}</div>}
        {loading && <LoadingSpinner />}

        <div className="form-group">
          <label htmlFor="name">Loan Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
            aria-label="Loan Name"
          />
          {formErrors.name && (
            <div className="error-text">{formErrors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="interestRate">Interest Rate (%)</label>
          <input
            id="interestRate"
            type="number"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleInputChange}
            step="0.1"
            disabled={loading}
            aria-label="Interest Rate"
          />
          {formErrors.interestRate && (
            <div className="error-text">{formErrors.interestRate}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="principal">Principal Amount</label>
          <input
            id="principal"
            type="number"
            name="principal"
            value={formData.principal}
            onChange={handleInputChange}
            disabled={loading}
            aria-label="Principal Amount"
          />
          {formErrors.principal && (
            <div className="error-text">{formErrors.principal}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            disabled={loading}
            aria-label="Due Date"
          />
          {formErrors.dueDate && (
            <div className="error-text">{formErrors.dueDate}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="paymentDate">Payment Date (Optional)</label>
          <input
            id="paymentDate"
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleInputChange}
            disabled={loading}
            aria-label="Payment Date"
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
