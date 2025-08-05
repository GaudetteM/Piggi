// Compact formatting for summary cards (StatCard) - shows abbreviated amounts
export const formatCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount);
  const isNegative = amount < 0;
  const prefix = isNegative ? '-' : '';
  
  if (absAmount >= 1000000) {
    return `${prefix}$${(absAmount / 1000000).toFixed(1)}M`;
  } else if (absAmount >= 1000) {
    return `${prefix}$${(absAmount / 1000).toFixed(1)}K`;
  } else {
    return `${prefix}$${absAmount.toFixed(2)}`;
  }
};

// Full formatting for transactions - shows exact dollar amounts
export const formatCurrencyFull = (amount: number): string => {
  const isNegative = amount < 0;
  const displayAmount = Math.abs(amount);
  const prefix = isNegative ? '-' : '';
  
  return `${prefix}$${displayAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Legacy function for backward compatibility
export const formatCurrencyLong = formatCurrencyFull;