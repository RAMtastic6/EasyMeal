export function getDayOfWeek(date: Date): string {
    const daysOfWeek = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
}

export function isDateGreaterOrEqual(date: Date): boolean {
    const currentDate = new Date();
    return date >= currentDate;
}
