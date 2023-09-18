/**
 * TODO: Replace this with a real authentication system
 * TODO: add default restaurant from mainAddress (the nearest one)
 */
export const useAuth = () => {
  return {
    user: {
      first_name: "Anatole",
      last_name: "Lebigroux",
      mainAddress: {
        street: "23 Rue Amiral Cécille",
        zip_code: "76100",
        city: "Rouen",
        country: "France",
      },
    },
  };
};
