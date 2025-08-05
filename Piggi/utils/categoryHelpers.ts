export const suggestCategoryFromTitle = (title: string, type: 'income' | 'expense'): string | null => {
  const titleLower = title.toLowerCase();
  
  if (type === 'expense') {
    // Food & Dining patterns
    if (titleLower.includes('grocery') || titleLower.includes('restaurant') || 
        titleLower.includes('food') || titleLower.includes('coffee') || 
        titleLower.includes('uber eats') || titleLower.includes('doordash') ||
        titleLower.includes('mcdonalds') || titleLower.includes('starbucks')) {
      return 'food';
    }
    
    // Transportation patterns
    if (titleLower.includes('gas') || titleLower.includes('uber') || 
        titleLower.includes('lyft') || titleLower.includes('taxi') ||
        titleLower.includes('bus') || titleLower.includes('train') ||
        titleLower.includes('metro') || titleLower.includes('parking')) {
      return 'transport';
    }
    
    // Entertainment patterns
    if (titleLower.includes('spotify') || titleLower.includes('netflix') || 
        titleLower.includes('movie') || titleLower.includes('cinema') ||
        titleLower.includes('gaming') || titleLower.includes('subscription') ||
        titleLower.includes('apple music') || titleLower.includes('youtube')) {
      return 'entertainment';
    }
    
    // Shopping patterns
    if (titleLower.includes('amazon') || titleLower.includes('target') || 
        titleLower.includes('walmart') || titleLower.includes('shopping') ||
        titleLower.includes('clothing') || titleLower.includes('best buy')) {
      return 'shopping';
    }
    
    // Utilities patterns
    if (titleLower.includes('electric') || titleLower.includes('water') || 
        titleLower.includes('internet') || titleLower.includes('phone') ||
        titleLower.includes('utility') || titleLower.includes('bill') ||
        titleLower.includes('comcast') || titleLower.includes('verizon')) {
      return 'utilities';
    }
    
    // Healthcare patterns
    if (titleLower.includes('doctor') || titleLower.includes('pharmacy') || 
        titleLower.includes('hospital') || titleLower.includes('medical') ||
        titleLower.includes('cvs') || titleLower.includes('walgreens')) {
      return 'healthcare';
    }
  } else if (type === 'income') {
    // Salary patterns
    if (titleLower.includes('paycheck') || titleLower.includes('salary') || 
        titleLower.includes('wages') || titleLower.includes('employment')) {
      return 'salary';
    }
    
    // Freelance patterns
    if (titleLower.includes('freelance') || titleLower.includes('contract') || 
        titleLower.includes('consulting') || titleLower.includes('gig') ||
        titleLower.includes('project') || titleLower.includes('client')) {
      return 'freelance';
    }
    
    // Investment patterns
    if (titleLower.includes('dividend') || titleLower.includes('investment') || 
        titleLower.includes('stock') || titleLower.includes('bond') ||
        titleLower.includes('return') || titleLower.includes('profit')) {
      return 'investment';
    }
  }
  
  return null; // No pattern matched
};

export const getCategoryColor = (categoryId: string): string => {
  const categoryColors: Record<string, string> = {
    // Income categories
    'salary': '#4CAF50',
    'freelance': '#8BC34A',
    'investment': '#CDDC39',
    'other-income': '#689F38',
    
    // Expense categories
    'food': '#FF9800',
    'transport': '#FF5722',
    'utilities': '#9C27B0',
    'entertainment': '#E91E63',
    'shopping': '#2196F3',
    'healthcare': '#00BCD4',
    'education': '#607D8B',
    'other-expense': '#795548',
  };
  
  return categoryColors[categoryId] || '#6C757D';
};
