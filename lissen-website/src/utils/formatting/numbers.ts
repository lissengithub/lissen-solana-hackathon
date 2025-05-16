export const formatCompactNumber = (value: number): string => {
  if (value === 0) return "0";

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  const format = (num: number, suffix: string) => {
    const formatted = num.toFixed(1);
    return (
      sign +
      (formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted) +
      suffix
    );
  };

  if (absValue >= 1_000_000_000) {
    return format(absValue / 1_000_000_000, "B");
  }

  if (absValue >= 1_000_000) {
    return format(absValue / 1_000_000, "M");
  }

  if (absValue >= 1_000) {
    return format(absValue / 1_000, "K");
  }

  return sign + absValue.toString();
};
