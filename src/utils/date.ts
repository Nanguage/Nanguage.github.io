const SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Use UTC getters: pubDate is a bare YYYY-MM-DD parsed as UTC midnight,
// so local-time getters could shift the day (and year) backwards.
export const year = (d: Date) => d.getUTCFullYear();
export const fmtShort = (d: Date) => `${SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`;
export const fmtLong = (d: Date) => `${LONG[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
