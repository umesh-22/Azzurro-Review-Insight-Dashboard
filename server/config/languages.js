const bookingCodes = {
  xu: "English",
  xt: "Chinese",
  xb: "Portuguese",
  xa: "Spanish",
  xm: "Spanish"
};

const displayNames = new Intl.DisplayNames(["en"], { type: "language" });

export function languageName(code) {
  return bookingCodes[code] || displayNames.of(code || "und");
}
