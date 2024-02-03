export const toPrice = (price: number) => {
  return price.toFixed(2).replace(".", "€");
};
