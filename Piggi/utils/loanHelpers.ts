export type AmortizationEntry = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
};

export type LoanCalculation = {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  term: number;
  amortization: AmortizationEntry[];
  payoffDate: Date;
};

export function calculateLoan(
  principal: number,
  interestRate: number,
  monthlyPayment: number,
  extraMonthly?: number,
  lumpSum?: number,
): LoanCalculation {
  const monthlyRate = interestRate / 100 / 12;
  const extraPayment = extraMonthly || 0;
  const totalMonthlyPayment = monthlyPayment + extraPayment;
  
  let balance = principal;
  let month = 0;
  let totalInterestPaid = 0;
  const amortization: AmortizationEntry[] = [];
  
  // Apply lump sum at the beginning if provided
  if (lumpSum && lumpSum > 0) {
    balance = Math.max(0, balance - lumpSum);
  }
  
  while (balance > 0.01 && month < 600) { // Cap at 50 years to prevent infinite loops
    month++;
    
    const interestPayment = balance * monthlyRate;
    let principalPayment = Math.min(totalMonthlyPayment - interestPayment, balance);
    
    // Ensure we don't overpay
    if (principalPayment < 0) principalPayment = balance;
    
    const actualPayment = interestPayment + principalPayment;
    balance = Math.max(0, balance - principalPayment);
    totalInterestPaid += interestPayment;
    
    amortization.push({
      month,
      payment: actualPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance,
      totalInterest: totalInterestPaid,
    });
    
    if (balance <= 0.01) break;
  }
  
  const totalPaid = principal + totalInterestPaid + (lumpSum || 0);
  const startDate = new Date();
  const payoffDate = new Date(startDate.getFullYear(), startDate.getMonth() + month, startDate.getDate());
  
  return {
    monthlyPayment: totalMonthlyPayment,
    totalPaid,
    totalInterest: totalInterestPaid,
    term: month,
    amortization,
    payoffDate,
  };
}

export function calculateStandardLoan(
  principal: number,
  interestRate: number,
  termYears: number,
): number {
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = termYears * 12;
  
  if (monthlyRate === 0) {
    return principal / numPayments;
  }
  
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
}

export function compareLoanScenarios(
  principal: number,
  interestRate: number,
  monthlyPayment: number,
  extraPayments: number[],
): LoanCalculation[] {
  return extraPayments.map(extra => 
    calculateLoan(principal, interestRate, monthlyPayment, extra)
  );
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);
  
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  } else if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  } else {
    return `${years}y ${remainingMonths}m`;
  }
}
