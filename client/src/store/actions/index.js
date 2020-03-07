export const EXAMPLE_ACTION = (payload = {}, error = false, meta = {}) => {
  return {
    type: "EXAMPLE_ACTION",
    error,
    meta,
    payload
  }
};
