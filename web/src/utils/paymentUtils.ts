export function getPaymentStatus(
  dueDate: Date,
  paymentDate: Date | null
): string {
  if (paymentDate === null) {
    return "Unpaid";
  }

  const daysDifference = Math.ceil(
    (paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDifference <= 5) {
    return "On Time";
  } else if (daysDifference <= 30) {
    return "Late";
  } else {
    return "Defaulted";
  }
}
