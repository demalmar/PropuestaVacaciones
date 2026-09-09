export interface LegendColorItem {
  id: string;
  label: string;
  fullName?: string;
  color: string;
}

export interface Table4060Data {
  cant: {
    periodo: number;
    independientes: number;
    asuntos: number;
  };
  pastDisfrutadas: {
    periodo: number;
    independientes: number;
    asuntos: number;
  };
  pastPresenc: number;
  pastTT: number;
}

export interface CalendarStats {
  periodo: number;
  independientes: number;
  asuntos: number;
  presencial: number;
  tt: number;
}

export type LimitsData = Record<string, { enabled: boolean; max: number }>;

export type PlanningMode = 'libre' | 'balance';

export type ViewMode = 'bimestral' | 'anual' | 'semestral';

export type ColoredDays = Record<string, string>;

export type WeeklySelections = Record<string, Record<number, boolean>>;

export type FixedWeeklySelections = Record<number, boolean>;

export interface DayData {
  day: number;
  isCurrentMonth: boolean;
  dateStr: string;
  dayIndex: number;
  owningMonthKey: string;
}

