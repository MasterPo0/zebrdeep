/**
 * Formats amount into Azerbaijani Manat (AZN)
 * @param {number} amount 
 * @returns {string} Formatted string e.g. "14.99 AZN"
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '0.00 AZN';
  return `${amount.toFixed(2)} AZN`;
};

export const formatPriceParts = (amount) => {
  if (typeof amount !== 'number') return { integer: '0', decimal: '00', currency: 'AZN' };
  const parts = amount.toFixed(2).split('.');
  return {
    integer: parts[0],
    decimal: parts[1],
    currency: 'AZN'
  };
};
