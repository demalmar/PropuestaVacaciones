import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthGrid } from './MonthGrid.tsx';
import {
  LegendColorItem,
  ColoredDays,
  WeeklySelections,
  FixedWeeklySelections
} from '../../types/calendar.ts';
import './SemestralView.css';

interface SemestralViewProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  showWeekends: boolean;
  isDarkMode: boolean;
  coloredDays: ColoredDays;
  legendColors: LegendColorItem[];
  presencialFirstMonday: boolean;
  weeklySelections: WeeklySelections;
  fixedWeeklySelections: FixedWeeklySelections;
  onDayClick: (year: number, month: number, day: number) => void;
  onHeaderDayClick: (year: number, month: number, dayIndex: number) => void;
}

export const SemestralView: React.FC<SemestralViewProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  showWeekends,
  isDarkMode,
  coloredDays,
  legendColors,
  presencialFirstMonday,
  weeklySelections,
  fixedWeeklySelections,
  onDayClick,
  onHeaderDayClick
}) => {
  const leftYear = currentDate.getFullYear();
  const leftMonth = currentDate.getMonth();

  const rightDate = new Date(leftYear, leftMonth + 1, 1);
  const rightYear = rightDate.getFullYear();
  const rightMonth = rightDate.getMonth();

  return (
    <div key="view-bimestral" className="view-transition-content">
      {/* Control de navegación bimestral (< >) centrado encima del calendario */}
      <div 
        className="is-flex is-align-items-center is-justify-content-center mb-3"
        style={{ height: '38px' }}
      >
        <div 
          className="is-flex is-align-items-center"
          style={{
            backgroundColor: isDarkMode ? '#0d9488' : '#0f766e',
            borderRadius: '9999px',
            boxShadow: '0 2px 8px rgba(15, 118, 110, 0.3)',
            overflow: 'hidden',
            border: isDarkMode ? '1.5px solid #14b8a6' : '1.5px solid #115e59',
            height: '34px'
          }}
        >
          <button
            type="button"
            onClick={onPrevMonth}
            className="button is-small p-0 oval-nav-btn"
            style={{
              width: '56px',
              height: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              borderRight: isDarkMode ? '1.5px solid rgba(255, 255, 255, 0.3)' : '1.5px solid rgba(255, 255, 255, 0.4)',
              borderRadius: 0,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Bimestre anterior"
          >
            <ChevronLeft size={19} strokeWidth={2.8} />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="button is-small p-0 oval-nav-btn"
            style={{
              width: '56px',
              height: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 0,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Bimestre siguiente"
          >
            <ChevronRight size={19} strokeWidth={2.8} />
          </button>
        </div>
      </div>

      {/* Meses del calendario bimestral */}
      <div className="is-flex is-justify-content-center" style={{ gap: '1.25rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, maxWidth: '440px', display: 'flex', justifyContent: 'center', minWidth: 0 }}>
          <MonthGrid
            targetYear={leftYear}
            targetMonth={leftMonth}
            showWeekends={showWeekends}
            isDarkMode={isDarkMode}
            coloredDays={coloredDays}
            legendColors={legendColors}
            presencialFirstMonday={presencialFirstMonday}
            weeklySelections={weeklySelections}
            fixedWeeklySelections={fixedWeeklySelections}
            onDayClick={onDayClick}
            onHeaderDayClick={onHeaderDayClick}
          />
        </div>
        <div style={{ flex: 1, maxWidth: '440px', display: 'flex', justifyContent: 'center', minWidth: 0 }}>
          <MonthGrid
            targetYear={rightYear}
            targetMonth={rightMonth}
            showWeekends={showWeekends}
            isDarkMode={isDarkMode}
            coloredDays={coloredDays}
            legendColors={legendColors}
            presencialFirstMonday={presencialFirstMonday}
            weeklySelections={weeklySelections}
            fixedWeeklySelections={fixedWeeklySelections}
            onDayClick={onDayClick}
            onHeaderDayClick={onHeaderDayClick}
          />
        </div>
      </div>
    </div>
  );
};

export const BimestralView = SemestralView;

