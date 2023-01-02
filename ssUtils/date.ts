export const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

// GET MILLISECONDS

export const getSecondsMS = (seconds: number): number => seconds * 1000;
export const getMinutesMS = (minutes: number): number =>
  minutes * getSecondsMS(60);
export const getHoursMS = (hours: number): number => hours * getMinutesMS(60);
export const getDaysMS = (days: number): number => days * getHoursMS(24);
export const getWeeksMS = (weeks: number): number => weeks * getDaysMS(7);

// MONTH UTILS

/**
 * Defaults to today
 *
 * 0 - January
 * 1 - February
 * ...
 *
 * @param d
 */
export const getMonth = (d: Date = new Date()) => d.getMonth();
export const getYear = (d: Date = new Date()) => d.getFullYear();
/**
 * Get the day of the week of a given date
 *
 * 0 - Sunday
 * 1 - Monday
 * ...
 *
 * @param d
 */
export const getDay = (d: Date = new Date()) => d.getUTCDay();

export const getFirstDayOfMonth = (ms: number) => {
  const firstDateOfMonth: Date = floorMonth(new Date(ms));
  return getDay(firstDateOfMonth);
};
export const getLastDayOfMonth = (ms: number) => {
  const lastDateOfMonth: Date = ceilMonth(new Date(ms));
  return getDay(lastDateOfMonth);
};

export const getDaysInMonth = (ms: number) => {
  const d = new Date(ms);
  // Pass next month, which can then be floored to the end of the provided month
  const m: number = getMonth(d) + 1;
  const y: number = getYear(d);
  return getDaysInMonthMY(m, y);
};

/**
 * 0 - January
 * 1 - February
 * ...
 *
 * @param m
 * @param y
 * @returns
 */
export const getDaysInMonthMY = (m: number, y: number) =>
  m === 2
    ? y & 3 || (!(y % 25) && y & 15)
      ? 28
      : 29
    : 30 + ((m + (m >> 3)) & 1);

// FORMAT

export const abbrDateMs = (dateMs: number) => abbrDate(deserializeDate(dateMs));
export const abbrDate = (date: Date) => ({
  day: date.getDate(),
  month: date.toLocaleString('default', {month: 'short'}),
  year: date.getFullYear(),
});

// SERIALIZE DATE
// String
export const serializeDateStr = (date: Date) => date.toISOString();
// Number
export const serializeDateNum = (date: Date) => date.getTime();
// DESERIALIZE DATE
export const deserializeDate = (dateMs: number) => new Date(dateMs);

/**
 * Subtract 'days' number of days from today's date
 *
 * @param days
 * @returns
 */
export const getNDaysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return date;
};

// FLOOR/CEIL
/**
 * Round date to beginning of month, ie date is set to 1
 * Modifies in place
 *
 * @param date
 * @returns
 */
export const floorMonth = (date: Date) => {
  date.setDate(1);
  floorDay(date);

  return date;
};
/**
 * Round date to beginning of day
 * Modifies in place
 *
 * @param date
 * @returns
 */
export const floorDay = (date: Date) => {
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date;
};

/**
 * Round date to last millisecond of the month
 * Modifies in place
 *
 * @param date
 * @returns
 */
export const ceilMonth = (date: Date) => {
  // 1. Set month to next month
  date.setMonth(date.getMonth() + 1);
  // 2. Set day to 1 day before first day of month
  date.setDate(0);
  ceilDay(date);

  return date;
};
/**
 * Round date to the last millisecond of the day
 * Modifies in place
 *
 * @param date
 * @returns
 */
export const ceilDay = (date: Date) => {
  date.setUTCHours(23);
  date.setUTCMinutes(59);
  date.setUTCSeconds(59);
  date.setUTCMilliseconds(999);

  return date;
};

// SPLIT DAY
// Total minutes in a day, used to split a day to the nearest minute
const TOTAL_MIN: number = 24 * 60;
export const splitDay = (date: Date, segments: number): Date[] => {
  floorDay(date);

  const minPerSeg: number = Math.floor(TOTAL_MIN / segments);
  const daySegments: Date[] = [];
  for (let i = 0; i < segments; i++) {
    const daySeg: Date = new Date(date);
    daySeg.setUTCMinutes(i * minPerSeg);
    daySegments.push(daySeg);
  }

  return daySegments;
};
