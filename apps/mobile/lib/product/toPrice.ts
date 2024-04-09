export const toPrice = (price: number | string) => {
  return Number(price).toFixed(2).replace(".", "€");
};
