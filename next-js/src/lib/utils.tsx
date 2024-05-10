export function getDayOfWeek(date: Date): string {
  const daysOfWeek = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}

export function isDateGreaterOrEqual(date: Date): boolean {
  const currentDate = new Date();
  return date >= currentDate;
}

export const generatePagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages - 1, totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

export const getFormData = (keys: string[], formData: FormData) => {
  const formDataValues: any = {};
  keys.forEach((key) => {
    formDataValues[key] = formData.get(key);
  });
  return formDataValues;
};