export const isNumber = (v) => typeof v === "number" && Number.isFinite(v);
export const isNonNegNumber = (v) => isNumber(v) && v >= 0;
export const isNonNegInt = (v) => Number.isInteger(v) && v >= 0;
export const isRating = (v) => isNumber(v) && v >= 0 && v <= 5;

export const isPositiveInt = (v) => Number.isInteger(v) && v >= 1;
export const isStars = (v) => Number.isInteger(v) && v >= 1 && v <= 5;
export const isIsoDate = (v) =>
  typeof v === "string" && v.trim() !== "" && !Number.isNaN(Date.parse(v));

export const invalidFields = (data, rules) =>
  Object.keys(data).filter((f) => !rules[f](data[f]));

export const pick = (body, fields) =>
  Object.fromEntries(
    fields.filter((f) => body?.[f] !== undefined).map((f) => [f, body[f]])
  );

export const isNonEmptyString = (v) => typeof v === "string" && v.trim() !== "";