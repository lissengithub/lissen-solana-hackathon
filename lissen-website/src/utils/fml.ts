export const getScoreColor = (score: number) => {
  if (score <= 19) {
    return "#D36665";
  } else if (score >= 20 && score <= 49) {
    return "#EEDB31";
  } else if (score >= 50 && score <= 69) {
    return "#56CCF2";
  }
  return "#50CD89";
};
