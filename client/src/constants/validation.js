export const DATE = [
  {
    regex: "^((0[0-9])|(1[0-2]))/(([0-2][0-9])|(3[0-1]))/([0-9]{4})$",
    result: true,
    message: "",
  },
  {
    regex: ".*",
    result: false,
    message: "Format: mm/dd/yyyy",
  },
];
