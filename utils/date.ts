export const isToday = (someDate: Date) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
};

export const abbrDate = (date: Date) => ({
    month: date.toLocaleString('default', { month: 'short' }),
    day: date.toLocaleString('default', { day: 'numeric' }),
});
