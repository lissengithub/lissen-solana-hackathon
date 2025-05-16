export const isTodayMonday = () => {
  const date = new Date();
  const dayOfWeekUTC = date.getUTCDay();

  // Note: 0 = Sunday, 1 = Monday, etc.
  return dayOfWeekUTC === 1;
};
