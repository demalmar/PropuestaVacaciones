import { LegendColorItem } from '../types/calendar.ts';

export const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

export const DAYS_OF_WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const INITIAL_LEGEND_COLORS: LegendColorItem[] = [
  { id: '1', label: 'Vac. días independientes', fullName: 'Vacaciones días independientes', color: '#bbf7d0' },
  { id: '2', label: 'Vac. por periodo', fullName: 'Vacaciones por periodo', color: '#fef08a' },
  { id: '3', label: 'Asuntos Propios', fullName: 'Asuntos Propios', color: '#bae6fd' },
  { id: '4', label: 'Festivo', fullName: 'Festivo', color: '#ef4444' }
];

