import React, { useState } from 'react';
import { MONTHS, DAYS_OF_WEEK } from '../../constants/calendar.ts';
import { getFirstDayOfMonth, dateToString } from '../../utils/dateUtils.ts';
import {
  LegendColorItem,
  ColoredDays,
  WeeklySelections,
  FixedWeeklySelections,
  DayData
} from '../../types/calendar.ts';
import './MonthGrid.css';

interface MonthGridProps {
  targetYear: number;
  targetMonth: number;
  customTitle?: string;
  isExport?: boolean;
  isCompact?: boolean;
  showWeekends: boolean;
  isDarkMode: boolean;
  coloredDays: ColoredDays;
  legendColors: LegendColorItem[];
  presencialFirstMonday: boolean;
  weeklySelections: WeeklySelections;
  fixedWeeklySelections: FixedWeeklySelections;
  onDayClick?: (year: number, month: number, day: number) => void;
  onHeaderDayClick?: (year: number, month: number, dayIndex: number) => void;
}

export const MonthGrid: React.FC<MonthGridProps> = ({
  targetYear,
  targetMonth,
  customTitle,
  isExport = false,
  isCompact = false,
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
  const startDate = new Date(targetYear, targetMonth, 1);
  const startDayIndex = getFirstDayOfMonth(targetYear, targetMonth); // 0=Lunes
  
  // Calcular el último día del mes para saber exactamente cuántas semanas dibujar
  const endDate = new Date(targetYear, targetMonth + 1, 0);
  const endDayIndex = endDate.getDay() === 0 ? 6 : endDate.getDay() - 1; 
  const totalDaysToRender = startDayIndex + endDate.getDate() + (6 - endDayIndex);

  // Retroceder al Lunes de la primera semana para empezar a dibujar
  const gridStartDate = new Date(startDate);
  gridStartDate.setDate(startDate.getDate() - startDayIndex);
  
  const days: DayData[] = [];
  
  // Generar los días
  for (let i = 0; i < totalDaysToRender; i++) {
    const currentLoopDate = new Date(gridStartDate);
    currentLoopDate.setDate(gridStartDate.getDate() + i);
    
    const cYear = currentLoopDate.getFullYear();
    const cMonth = currentLoopDate.getMonth();
    const cDay = currentLoopDate.getDate();
    const dateStr = dateToString(cYear, cMonth, cDay);
    const dayIndex = i % 7; // 0=Lunes, 6=Domingo
    
    // Buscamos a qué mes pertenece el LUNES de esta semana
    const mondayDate = new Date(currentLoopDate);
    mondayDate.setDate(currentLoopDate.getDate() - dayIndex);
    const owningMonthKey = `${mondayDate.getFullYear()}-${mondayDate.getMonth()}`;
    
    days.push({
      day: cDay,
      isCurrentMonth: cMonth === targetMonth && cYear === targetYear,
      dateStr: dateStr,
      dayIndex: dayIndex,
      owningMonthKey: owningMonthKey
    });
  }

  const monthKey = `${targetYear}-${targetMonth}`;
  const isHeaderDaySelected = (dayIdx: number) => {
    return Boolean(weeklySelections[monthKey]?.[dayIdx]);
  };

  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);
  
  // Filtrar días y columnas si los findes están ocultos
  const visibleDays = showWeekends ? days : days.filter(d => d.dayIndex < 5);
  const cols = showWeekends ? 7 : 5;

  // En exportación siempre forzamos tema diurno claro para descarga PNG impecable
  const useDarkMode = isDarkMode && !isExport;
  const cellBorder = useDarkMode ? '1px solid #283445' : '1px solid #cbd5e1';

  return (
    <div 
      className="box p-0 mb-0" 
      style={{ 
        border: useDarkMode 
          ? (isCompact ? '1.5px solid #0d9488' : '2px solid #0d9488') 
          : (isCompact ? '1.5px solid #0f766e' : '2px solid #0f766e'), 
        borderRadius: isCompact ? '8px' : '12px', 
        overflow: 'hidden', 
        minWidth: isCompact ? '0' : (isExport ? (showWeekends ? '350px' : '260px') : (showWeekends ? '220px' : '170px')),
        width: isCompact ? '100%' : (isExport ? (showWeekends ? '350px' : '260px') : '100%'),
        backgroundColor: useDarkMode ? '#17202e' : '#ffffff',
        boxShadow: isExport ? '0 4px 20px rgba(0,0,0,0.08)' : (useDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 20px -2px rgba(15,118,110,0.1)'),
        alignSelf: 'flex-start',
        height: 'fit-content'
      }}
    >
      {/* Cabecera del Mes */}
      <div 
        style={{ 
          height: isCompact ? '28px' : '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: useDarkMode 
            ? (isCompact ? '1.5px solid #0d9488' : '2px solid #0d9488') 
            : (isCompact ? '1.5px solid #0f766e' : '2px solid #0f766e'),
          background: useDarkMode 
            ? 'linear-gradient(135deg, #1e293b 0%, #293548 100%)' 
            : 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
          padding: isCompact ? '0 0.5rem' : '0 1rem'
        }}
      >
          <h3 
          className="has-text-weight-bold mb-0" 
          style={{ 
            color: useDarkMode ? '#ffffff' : '#0f172a',
            fontSize: isCompact ? 'var(--font-size-title-month-annual)' : 'var(--font-size-title-month-bimestral)',
            letterSpacing: '0.01em',
            textAlign: 'center',
            userSelect: 'none'
          }}
        >
          {customTitle ? customTitle : (isCompact ? MONTHS[targetMonth] : `${MONTHS[targetMonth]} ${targetYear}`)}
        </h3>
      </div>
      
      {/* Días de la semana (Cabecera interactiva) */}
      <div 
        className={`calendar-grid-${cols}`} 
        style={{ 
          borderBottom: useDarkMode ? '1.5px solid #334155' : '1.5px solid #cbd5e1', 
          backgroundColor: useDarkMode ? '#131b26' : '#f8fafc' 
        }}
      >
        {DAYS_OF_WEEK.map((day, index) => {
          if (!showWeekends && index >= 5) return null;
          const isSelected = isHeaderDaySelected(index);
          const isWeekend = index >= 5;
          const isHovered = !isExport && hoveredDayIndex === index;
          
          let headerBg = 'transparent';
          if (isSelected) {
            headerBg = useDarkMode 
              ? (isHovered ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.28)') 
              : (isHovered ? '#93c5fd' : '#bfdbfe');
          } else if (isHovered) {
            headerBg = useDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(50, 115, 220, 0.12)';
          }

          let headerColor = isWeekend 
            ? (useDarkMode ? '#fb7185' : '#e11d48') 
            : (useDarkMode ? '#5eead4' : '#0f766e');

          return (
            <div 
              key={day} 
              onClick={!isExport && onHeaderDayClick ? () => onHeaderDayClick(targetYear, targetMonth, index) : undefined}
              onMouseEnter={!isExport ? () => setHoveredDayIndex(index) : undefined}
              onMouseLeave={!isExport ? () => setHoveredDayIndex(null) : undefined}
              className={`has-text-centered calendar-header-day ${isCompact ? 'is-compact' : ''} has-text-weight-bold`}
              style={{ 
                minHeight: isCompact ? '25px' : '38px',
                height: isCompact ? '25px' : undefined,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: (index === cols - 1) ? 'none' : (useDarkMode ? '1px solid #293548' : '1px solid #cbd5e1'),
                cursor: !isExport ? 'pointer' : 'default',
                userSelect: 'none',
                backgroundColor: headerBg,
                color: headerColor,
                transition: 'background-color 0.15s ease',
                fontSize: isCompact ? 'var(--font-size-header-weekday-annual)' : 'var(--font-size-header-weekday-bimestral)',
                fontWeight: 800
              }}
              title={`Seleccionar todos los ${day} de este mes (Presencial)`}
            >
              {day}
            </div>
          );
        })}
      </div>
      
      {/* Cuadrícula de días */}
      <div className={`calendar-grid-${cols}`} style={{ backgroundColor: useDarkMode ? '#131b26' : '#ffffff' }}>
        {visibleDays.map((dayData, index) => {
          // Si es un día fuera del mes (sobrantes antes del 1 o después del 30/31), casilla vacía sin romper bordes
          if (!dayData.isCurrentMonth) {
            return (
              <div 
                key={`${targetYear}-${targetMonth}-${index}`}
                className={`calendar-day-cell is-empty ${isCompact ? 'is-compact' : ''}`}
                style={{
                  height: isCompact ? '24px' : undefined,
                  minHeight: isCompact ? '24px' : undefined,
                  backgroundColor: useDarkMode ? '#111620' : '#f8fafc',
                  borderRight: (index % cols === cols - 1) ? 'none' : cellBorder,
                  borderBottom: cellBorder,
                  cursor: 'default'
                }}
              />
            );
          }

          // --- DETERMINAR COLOR DE FONDO ---
          const colorId = coloredDays[dayData.dateStr];
          const assignedColor = legendColors.find(c => c.id === colorId)?.color;
          let finalBgColor = assignedColor;
          
          // Color de fin de semana por defecto
          const WEEKEND_DEFAULT_COLOR = '#fca5a5';
          
          // Si es fin de semana del mes actual y no tiene color manual, hereda el color de fin de semana
          if (!assignedColor && dayData.dayIndex >= 5 && dayData.isCurrentMonth) {
            finalBgColor = WEEKEND_DEFAULT_COLOR;
          }

          // Color de fondo
          let cellBg = finalBgColor ? finalBgColor : (useDarkMode ? '#1c2635' : '#ffffff');
          
          // Color del texto
          let textColor = '#1e293b';
          if (finalBgColor) {
            if (finalBgColor === '#ef4444' || finalBgColor === '#dc2626') {
              textColor = '#ffffff';
            } else {
              textColor = '#0f172a';
            }
          } else if (useDarkMode) {
            textColor = dayData.dayIndex >= 5 ? '#fda4af' : '#e2e8f0';
          } else {
            textColor = dayData.dayIndex >= 5 ? '#e11d48' : '#1e293b';
          }
          
          // --- LÓGICA DE SELECCIÓN POR COLUMNA (PRESENCIAL) ---
          const isColumnSelected = presencialFirstMonday
            ? Boolean(weeklySelections[dayData.owningMonthKey]?.[dayData.dayIndex])
            : Boolean(weeklySelections[monthKey]?.[dayData.dayIndex]);

          const isPreview = !isExport && hoveredDayIndex !== null && dayData.dayIndex === hoveredDayIndex;

          return (
            <div 
              key={dayData.dateStr}
              onClick={!isExport && onDayClick ? () => {
                const parts = dayData.dateStr.split('-');
                onDayClick(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
              } : undefined}
              className={`calendar-day-cell ${isCompact ? 'is-compact' : ''} ${isColumnSelected ? 'is-presencial' : ''} ${isPreview ? 'is-presencial-preview' : ''}`}
              style={{
                height: isCompact ? '24px' : undefined,
                minHeight: isCompact ? '24px' : undefined,
                backgroundColor: cellBg,
                color: textColor,
                fontWeight: (dayData.dayIndex >= 5 || finalBgColor) ? 700 : 600,
                borderRight: (index % cols === cols - 1) ? 'none' : cellBorder,
                borderBottom: cellBorder,
              }}
            >
              {/* Indicadores visuales para "Días Presenciales" (permanente o preview) */}
              {isColumnSelected ? (
                <>
                  <span className="presencial-border" style={{ borderColor: useDarkMode ? '#4880ed' : '#2563eb' }} />
                  <span className="presencial-dot" style={{ backgroundColor: useDarkMode ? '#60a5fa' : '#2563eb' }} />
                  <span className="presencial-bar" style={{ backgroundColor: useDarkMode ? '#60a5fa' : '#2563eb' }} />
                </>
              ) : isPreview ? (
                <>
                  <span className="presencial-dot is-preview" style={{ backgroundColor: useDarkMode ? '#60a5fa' : '#2563eb' }} />
                  <span className="presencial-bar is-preview" style={{ backgroundColor: useDarkMode ? '#60a5fa' : '#2563eb' }} />
                </>
              ) : null}
              
              <span style={{ position: 'relative', zIndex: 1, fontSize: isCompact ? 'var(--font-size-day-annual)' : 'var(--font-size-day-bimestral)', fontWeight: (dayData.dayIndex >= 5 || finalBgColor) ? 800 : 700 }}>{dayData.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

