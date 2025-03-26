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
      // Reset form
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
      console.error("Mutation Error:", err);
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

    const error = validateField(name, value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: error || "",
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

      if (paymentDate > new Date()) {
        newErrors.paymentDate = "Payment date cannot be in the future";
      }

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
          <div
            className="error-text"
            style={{ color: "red", marginBottom: "15px" }}
          >
            {error.message}
          </div>
        )}

        {loading && <LoadingSpinner />}

        {/* Name Input */}
        <div className="form-group">
          <label>Loan Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={formErrors.name ? "input-error" : ""}
            disabled={loading}
          />
          {formErrors.name && (
            <span className="error-text">{formErrors.name}</span>
          )}
        </div>

        {/* Interest Rate Input */}
        <div className="form-group">
          <label>Interest Rate (%)</label>
          <input
            type="number"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleInputChange}
            step="0.1"
            className={formErrors.interestRate ? "input-error" : ""}
            disabled={loading}
          />
          {formErrors.interestRate && (
            <span className="error-text">{formErrors.interestRate}</span>
          )}
        </div>

        {/* Principal Input */}
        <div className="form-group">
          <label>Principal Amount</label>
          <input
            type="number"
            name="principal"
            value={formData.principal}
            onChange={handleInputChange}
            className={formErrors.principal ? "input-error" : ""}
            disabled={loading}
          />
          {formErrors.principal && (
            <span className="error-text">{formErrors.principal}</span>
          )}
        </div>

        {/* Due Date Input */}
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
            className={formErrors.dueDate ? "input-error" : ""}
            disabled={loading}
          />
          {formErrors.dueDate && (
            <span className="error-text">{formErrors.dueDate}</span>
          )}
        </div>

        {/* Payment Date Input */}
        <div className="form-group">
          <label>Payment Date (Optional)</label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleInputChange}
            max={new Date().toISOString().split("T")[0]}
            disabled={loading}
          />
          {formErrors.paymentDate && (
            <span className="error-text">{formErrors.paymentDate}</span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Adding Loan..." : "Add Loan"}
        </button>
      </form>
    </div>
  );
};
