import "./App.css";
import { LoanList } from "./components/LoanList";
import { AddPayment } from "./components/AddPayment";

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Loan Management System</h1>
      </header>
      <main>
        <AddPayment />
        <LoanList />
      </main>
    </div>
  );
}

export default App;
