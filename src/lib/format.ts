export const formatCurrency = (value: number) =>
  `Rs ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value)}`;
