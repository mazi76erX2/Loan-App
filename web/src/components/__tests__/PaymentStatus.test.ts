import { getPaymentStatus } from "../../utils/paymentUtils";

describe("Payment Status Utility", () => {
  const mockDueDate = new Date("2025-03-01");

  test('returns "Unpaid" when payment date is null', () => {
    const status = getPaymentStatus(mockDueDate, null);
    expect(status).toBe("Unpaid");
  });

  test('returns "On Time" when payment is within 5 days of due date', () => {
    const paymentDate = new Date("2025-03-04");
    const status = getPaymentStatus(mockDueDate, paymentDate);
    expect(status).toBe("On Time");
  });

  test('returns "Late" when payment is between 6 and 30 days after due date', () => {
    const paymentDate = new Date("2025-03-15");
    const status = getPaymentStatus(mockDueDate, paymentDate);
    expect(status).toBe("Late");
  });

  test('returns "Defaulted" when payment is more than 30 days late', () => {
    const paymentDate = new Date("2025-04-05");
    const status = getPaymentStatus(mockDueDate, paymentDate);
    expect(status).toBe("Defaulted");
  });
});
