import React from "react";
import "./App.css";
import { LoanList } from "./components/LoanList";
import { AddPayment } from "./components/AddPayment";

function App() {
  return (
    <div className="app-container">
      <header>
        <img src="/logo.png" alt="Loan Management System Logo" />
        <h1>Loan Management System</h1>
      </header>
      <main>
        <LoanList />
        <AddPayment />
      </main>
    </div>
  );
}

export default App;
