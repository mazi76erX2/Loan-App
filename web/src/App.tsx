import React from "react";
import "./App.css";
import { LoanList } from "./components/LoanList";
import { AddPayment } from "./components/AddPayment";

function App() {
  return (
    <div className="App">
      <h1>Loan Management System</h1>
      <LoanList />
      <AddPayment />
    </div>
  );
}

export default App;
