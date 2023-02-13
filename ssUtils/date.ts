export const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getUTCDate() === today.getUTCDate() &&
    someDate.getUTCMonth() === today.getUTCMonth() &&
    someDate.getUTCFullYear() === today.getUTCFullYear()
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
export const getMonth = (d: Date = new Date()) => d.getUTCMonth();
export const getYear = (d: Date = new Date()) => d.getUTCFullYear();
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

export const getDate = (d: Date = new Date()) => d.getUTCDate();

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

// INCREMENT TIME UTILS

/**
 * Adds 'n' days to a date object
 * Updates Date object in-place
 * Accounts for incrementing months, years, etc
 *
 * @param d
 * @param days
 * @returns
 */
export const addDays = (d: Date, days: number): Date => {
  d.setUTCDate(d.getUTCDate() + days);

  return d;
};
export const addDaysMs = (ms: number, days: number): Date => {
  return addDays(new Date(ms), days);
};

/**
 * Adds 'n' months to a date object
 * Updates Date object in-place
 * Accounts for incrementing years, etc
 *
 * @param d
 * @param months
 * @returns
 */
export const addMonths = (d: Date, months: number): Date => {
  d.setUTCMonth(d.getUTCMonth() + months);

  return d;
};
export const addMonthsMs = (ms: number, months: number): Date => {
  return addMonths(deserializeDate(ms), months);
};

// GET RANGE UTILS
/**
 * Get the start of all months that fall within the [start-stop] range
 * Returns the start of each month as ms
 *
 * @param startMs
 * @param stopMs
 * @returns
 */
export const getAllMonthsRangeMs = (
  startMs: number,
  stopMs: number,
): number[] => {
  const range: number[] = [];

  // 0. Floor start month
  console.log('hereerere--------------------');
  console.log(new Date(startMs));
  startMs = serializeDateNum(floorMonthMs(startMs));
  console.log(deserializeDate(startMs));
  for (
    let curMs = startMs, i = 0;
    curMs <= stopMs && i < 10;
    // Add 1 month
    curMs = serializeDateNum(floorMonth(addMonthsMs(curMs, 1))), i++
  ) {
    range.push(curMs);
    console.log(i);
    console.log(new Date(curMs));
  }

  // Add month following stopMs
  // range.push(serializeDateNum(floorMonth(addMonths(floorMonthMs(stopMs), 1))));

  return range;
};

export const getSliceRangeMs = (
  startMs: number,
  stopMs: number,
  slices: number,
): number[] => {
  const rangeMs: number = (stopMs - startMs) / (slices - 1);

  const range: number[] = [];
  for (let curMs = startMs; curMs <= stopMs; curMs += rangeMs) {
    range.push(curMs);
  }

  console.log('ABC------------------------');
  console.log(range);

  return range;
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
  day: date.getUTCDate(),
  month: monthToString(date.getUTCMonth()),
  year: date.getUTCFullYear(),
});
const MONTHS: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const monthToString = (month: number): string => MONTHS[month];

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
  date.setUTCDate(date.getUTCDate() - days);

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
export const floorMonth = (date: Date): Date => {
  date.setUTCDate(1);
  floorDay(date);

  return date;
};
export const floorMonthMs = (ms: number): Date => {
  return floorMonth(new Date(ms));
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
  date.setUTCMonth(date.getUTCMonth() + 1);
  // 2. Set day to 1 day before first day of month
  date.setUTCDate(0);
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
