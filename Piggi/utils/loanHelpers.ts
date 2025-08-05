export function calculateLoan(
  principal: number,
  interestRate: number,
  monthlyPayment: number,
  extraMonthly?: number,
  lumpSum?: number,
) {
  // Simplified version for now
  const totalMonthly = monthlyPayment + (extraMonthly || 0);
  const monthlyRate = interestRate / 100 / 12;

  const term =
    (Math.log(1 - (principal * monthlyRate) / totalMonthly) /
      Math.log(1 + monthlyRate)) *
    -1;
  const totalPaid = totalMonthly * term;
  const totalInterest = totalPaid - principal - (lumpSum || 0);

  return {
    monthlyPayment: totalMonthly,
    totalPaid,
    totalInterest,
    term,
  };
}
