export const getErrorMessage = (error) => {
  if (!error) return null;
  return error.message || "Что-то пошло не так. Попробуйте еще раз";
};
