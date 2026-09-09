/**
 * Devuelve el índice del primer día del mes (0 = Lunes, 6 = Domingo)
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

/**
 * Convierte año, mes (0-indexed) y día a string con formato 'YYYY-M-D'
 */
export const dateToString = (year: number, month: number, day: number): string => `${year}-${month + 1}-${day}`;

