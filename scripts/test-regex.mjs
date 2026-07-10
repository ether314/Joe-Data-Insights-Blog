const costText = "$8–10B (Phase 1)";
const CURRENCY_PREFIX = "(?:cad\\s*\\$|c\\$|€|£|\\$)";
const CURRENCY_CAPTURE = "(cad\\s*\\$|c\\$|€|£|\\$)";

const dashRe = new RegExp(
  `(${CURRENCY_CAPTURE})\\s*~?\\s*([\\d,]+(?:\\.\\d+)?)\\s*([bBmMtT]|bn|mn|million|billion|trillion)?\\s*[–\\-]\\s*(?:${CURRENCY_PREFIX}\\s*~?\\s*)?([\\d,]+(?:\\.\\d+)?)\\s*([bBmMtT]|bn|mn|million|billion|trillion)?`,
  "i",
);
const dashRange = costText.match(dashRe);
console.log("dashRange", dashRange);
console.log("groups", dashRange?.slice(1));
