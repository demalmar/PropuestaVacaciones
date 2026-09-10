import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthGrid } from './MonthGrid.tsx';
import {
  LegendColorItem,
  ColoredDays,
  WeeklySelections,
  FixedWeeklySelections
} from '../../types/calendar.ts';
import './AnnualView.css';

interface AnnualViewProps {
  currentYear: number;
  onPrevYear: () => void;
  onNextYear: () => void;
  onYearChange?: (year: number) => void;
  showWeekends: boolean;
  showNextYearJanuary?: boolean;
  isDarkMode: boolean;
  coloredDays: ColoredDays;
  legendColors: LegendColorItem[];
  presencialFirstMonday: boolean;
  weeklySelections: WeeklySelections;
  fixedWeeklySelections: FixedWeeklySelections;
  onDayClick: (year: number, month: number, day: number) => void;
  onHeaderDayClick: (year: number, month: number, dayIndex: number) => void;
}

export const AnnualView: React.FC<AnnualViewProps> = ({
  currentYear,
  onPrevYear,
  onNextYear,
  onYearChange,
  showWeekends,
  showNextYearJanuary = false,
  isDarkMode,
  coloredDays,
  legendColors,
  presencialFirstMonday,
  weeklySelections,
  fixedWeeklySelections,
  onDayClick,
  onHeaderDayClick
}) => {
  const [yearText, setYearText] = useState(currentYear.toString());
  const [isFocused, setIsFocused] = useState(false);

  // Sincronizar texto si cambia currentYear por navegación con flechas o prop externa
  useEffect(() => {
    setYearText(currentYear.toString());
  }, [currentYear]);

  const commitYear = (valStr: string) => {
    const parsed = parseInt(valStr, 10);
    if (!isNaN(parsed) && parsed >= 1900 && parsed <= 2100) {
      if (parsed !== currentYear && onYearChange) {
        onYearChange(parsed);
      } else {
        setYearText(parsed.toString());
      }
    } else {
      setYearText(currentYear.toString());
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Solo permitir dígitos numéricos y un máximo de 4 cifras
    if (/^\d*$/.test(val) && val.length <= 4) {
      setYearText(val);
      // Si el usuario escribe 4 dígitos válidos, actualizar automáticamente
      if (val.length === 4) {
        const parsed = parseInt(val, 10);
        if (parsed >= 1900 && parsed <= 2100) {
          if (parsed !== currentYear && onYearChange) {
            onYearChange(parsed);
          }
        }
      }
    }
  };

  const handleYearBlur = () => {
    setIsFocused(false);
    commitYear(yearText);
  };

  const handleYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitYear(yearText);
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      setYearText(currentYear.toString());
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onNextYear();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onPrevYear();
    }
  };

  return (
    <div key="view-anual" className="view-transition-content">
      {/* Barra de navegación de año centrada */}
      <div 
        className="is-flex is-align-items-center is-justify-content-center mb-3"
        style={{ gap: '0.75rem', height: '38px' }}
      >
        <button
          type="button"
          onClick={onPrevYear}
          className="button is-small"
          style={{
            backgroundColor: isDarkMode ? '#0d9488' : '#0f766e',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            height: '34px',
            padding: '0 12px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 2px 8px rgba(15, 118, 110, 0.3)',
            cursor: 'pointer'
          }}
          title="Año anterior"
        >
          <ChevronLeft size={16} strokeWidth={2.8} />
          <span style={{ fontSize: 'var(--font-size-button)' }}>{currentYear - 1}</span>
        </button>

        {/* Input escribible para seleccionar el año a mano */}
        <input 
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={yearText}
          onChange={handleYearChange}
          onFocus={(e) => {
            setIsFocused(true);
            e.target.select();
          }}
          onBlur={handleYearBlur}
          onKeyDown={handleYearKeyDown}
          className="has-text-centered has-text-weight-bold"
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            border: isDarkMode 
              ? (isFocused ? '1.5px solid #14b8a6' : '1.5px solid #0d9488') 
              : (isFocused ? '1.5px solid #0d9488' : '1.5px solid #0f766e'),
            borderRadius: '10px',
            boxShadow: isFocused 
              ? (isDarkMode ? '0 0 0 3px rgba(20, 184, 166, 0.3)' : '0 0 0 3px rgba(15, 118, 110, 0.2)') 
              : (isDarkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,118,110,0.12)'),
            color: isDarkMode ? '#f8fafc' : '#0f172a',
            fontWeight: 800,
            fontSize: 'var(--font-size-title-year)',
            letterSpacing: '0.03em',
            width: '96px',
            height: '34px',
            padding: '0 4px',
            outline: 'none',
            textAlign: 'center',
            cursor: 'text',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            fontFamily: 'inherit'
          }}
          title="Haz clic o escribe para cambiar el año (Enter para confirmar)"
        />

        <button
          type="button"
          onClick={onNextYear}
          className="button is-small"
          style={{
            backgroundColor: isDarkMode ? '#0d9488' : '#0f766e',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            height: '34px',
            padding: '0 12px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 2px 8px rgba(15, 118, 110, 0.3)',
            cursor: 'pointer'
          }}
          title="Año siguiente"
        >
          <span style={{ fontSize: 'var(--font-size-button)' }}>{currentYear + 1}</span>
          <ChevronRight size={16} strokeWidth={2.8} />
        </button>
      </div>

      {/* Cuadrícula Anual: 4 columnas x 3 filas (12 meses) */}
      <div key={`annual-grid-${currentYear}`} className="annual-calendar-grid">
        {Array.from({ length: 12 }, (_, monthIdx) => (
          <div key={monthIdx} style={{ minWidth: 0, width: '100%' }}>
            <MonthGrid
              targetYear={currentYear}
              targetMonth={monthIdx}
              isExport={false}
              isCompact={true}
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
        ))}

        {/* Enero del año siguiente centrado en la siguiente fila */}
        {showNextYearJanuary && (
          <div className="annual-calendar-next-january">
            <div>
              <MonthGrid
                targetYear={currentYear + 1}
                targetMonth={0}
                customTitle={`Enero ${currentYear + 1}`}
                isExport={false}
                isCompact={true}
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
        )}
      </div>
    </div>
  );
};

