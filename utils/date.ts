export const isToday = (someDate: Date) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
};

export const abbrDate = (date: Date) => ({
    day: date.getDate(),
    month: date.toLocaleString('default', { month: 'short' }),
});

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
}

// FLOOR/CEIL
/**
 * Round date to beginning of month
 * Modifies in place
 * 
 * @param date 
 * @returns 
 */
export const floorMonth = (date: Date) => {
    date.setDate(0);
    floorDay(date);

    return date;
}
/**
 * Round date to beginning of day
 * Modifies in place
 * 
 * @param date 
 * @returns 
 */
export const floorDay = (date: Date) => {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
}

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
}
/**
 * Round date to the last millisecond of the day
 * Modifies in place
 * 
 * @param date 
 * @returns 
 */
export const ceilDay = (date: Date) => {
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(999);

    return date;
}

// SPLIT DAY
// Total minutes in a day, used to split a day to the nearest minute
const TOTAL_MIN: number = 24*60;
export const splitDay = (date: Date, segments: number): Date[] => {
    floorDay(date);

    const minPerSeg: number = Math.floor(TOTAL_MIN/segments);
    const daySegments: Date[] = [];
    for(let i = 0; i < segments; i++) {
        const daySeg: Date = new Date(date);
        daySeg.setMinutes(i*minPerSeg);
        daySegments.push(daySeg);
    }

    return daySegments;
}
