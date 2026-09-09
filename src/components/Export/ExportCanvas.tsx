import React from 'react';
import { MonthGrid } from '../Calendar/MonthGrid.tsx';
import { BalancePanelsWrapper } from '../Panels/BalancePanelsWrapper.tsx';
import {
  ViewMode,
  LegendColorItem,
  ColoredDays,
  WeeklySelections,
  FixedWeeklySelections,
  Table4060Data,
  CalendarStats
} from '../../types/calendar.ts';

interface ExportCanvasProps {
  exportRef: React.RefObject<HTMLDivElement | null>;
  viewMode: ViewMode;
  currentYear: number;
  leftYear: number;
  leftMonth: number;
  rightYear: number;
  rightMonth: number;
  showWeekends: boolean;
  coloredDays: ColoredDays;
  legendColors: LegendColorItem[];
  presencialFirstMonday: boolean;
  weeklySelections: WeeklySelections;
  fixedWeeklySelections: FixedWeeklySelections;
  show4060?: boolean;
  exportIncludeBalance?: boolean;
  exportInclude4060?: boolean;
  table4060: Table4060Data;
  calendarStats: CalendarStats;
}

export const ExportCanvas: React.FC<ExportCanvasProps> = ({
  exportRef,
  viewMode,
  currentYear,
  leftYear,
  leftMonth,
  rightYear,
  rightMonth,
  showWeekends,
  coloredDays,
  legendColors,
  presencialFirstMonday,
  weeklySelections,
  fixedWeeklySelections,
  show4060,
  exportIncludeBalance = true,
  exportInclude4060 = true,
  table4060,
  calendarStats
}) => {
  // Calcular elementos para la leyenda exportable
  const usedColorIds = new Set<string>();
  Object.entries(coloredDays).forEach(([dateStr, colorId]) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const isVisible = viewMode === 'anual'
        ? (y === currentYear)
        : ((y === leftYear && m === leftMonth) || (y === rightYear && m === rightMonth));
      if (isVisible) {
        usedColorIds.add(colorId);
      }
    }
  });

  const usedLegends = legendColors.filter(color => usedColorIds.has(color.id));
  const hasWeeklySelections = viewMode === 'anual'
    ? Array.from({ length: 12 }, (_, i) => `${currentYear}-${i}`).some(mKey => 
        weeklySelections[mKey] && Object.values(weeklySelections[mKey]).some(isSelected => isSelected)
      )
    : [`${leftYear}-${leftMonth}`, `${rightYear}-${rightMonth}`].some(mKey => 
        weeklySelections[mKey] && Object.values(weeklySelections[mKey]).some(isSelected => isSelected)
      );

  // Funciones dummy requeridas por la firma de BalancePanelsWrapper pero inactivas en export
  const noop = () => {};

  return (
    <div style={{ position: 'fixed', left: '-99999px', top: '0', pointerEvents: 'none', zIndex: -9999 }}>
      <div 
        ref={exportRef} 
        style={{ 
          width: 'max-content', 
          backgroundColor: '#ffffff',
          padding: '2.5rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.75rem',
          fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          borderRadius: '16px',
          border: '1.5px solid #cbd5e1'
        }}
      >
        {/* Cabecera elegante del documento */}
        <div style={{ textAlign: 'center', width: '100%', paddingBottom: '0.75rem', borderBottom: '2px solid #e2e8f0' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Propuesta Vacaciones {viewMode === 'anual' ? `- Año ${currentYear}` : ''}
          </h1>
        </div>
        
        {/* Bloque central: Calendario a la izquierda + Leyenda en vertical a la derecha */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'stretch', width: '100%' }}>
          {/* Calendario (Anual o Bimestral) */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {viewMode === 'anual' ? (
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 280px)', 
                  gap: '1rem', 
                  width: '100%' 
                }}
              >
                {Array.from({ length: 12 }, (_, monthIdx) => (
                  <div key={monthIdx}>
                    <MonthGrid
                      targetYear={currentYear}
                      targetMonth={monthIdx}
                      isExport={true}
                      isCompact={true}
                      showWeekends={showWeekends}
                      isDarkMode={false}
                      coloredDays={coloredDays}
                      legendColors={legendColors}
                      presencialFirstMonday={presencialFirstMonday}
                      weeklySelections={weeklySelections}
                      fixedWeeklySelections={fixedWeeklySelections}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="is-flex" style={{ gap: '2rem', alignItems: 'flex-start' }}>
                <MonthGrid
                  targetYear={leftYear}
                  targetMonth={leftMonth}
                  isExport={true}
                  isCompact={false}
                  showWeekends={showWeekends}
                  isDarkMode={false}
                  coloredDays={coloredDays}
                  legendColors={legendColors}
                  presencialFirstMonday={presencialFirstMonday}
                  weeklySelections={weeklySelections}
                  fixedWeeklySelections={fixedWeeklySelections}
                />
                <MonthGrid
                  targetYear={rightYear}
                  targetMonth={rightMonth}
                  isExport={true}
                  isCompact={false}
                  showWeekends={showWeekends}
                  isDarkMode={false}
                  coloredDays={coloredDays}
                  legendColors={legendColors}
                  presencialFirstMonday={presencialFirstMonday}
                  weeklySelections={weeklySelections}
                  fixedWeeklySelections={fixedWeeklySelections}
                />
              </div>
            )}
          </div>

          {/* Leyenda de Colores y Días Presenciales en VERTICAL a la derecha */}
          {(usedLegends.length > 0 || hasWeeklySelections) && (
            <div 
              style={{ 
                width: '230px', 
                minWidth: '230px',
                backgroundColor: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                borderRadius: '12px',
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem'
              }}
            >
              <div style={{ paddingBottom: '0.5rem', borderBottom: '1.5px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 800, color: '#334155', letterSpacing: '0.06em', margin: 0 }}>
                  🖍️ Leyenda
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {usedLegends.map(color => (
                  <div key={color.id} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span 
                      style={{ 
                        width: '22px', 
                        height: '22px', 
                        borderRadius: '6px', 
                        backgroundColor: color.color, 
                        border: '1.5px solid rgba(0,0,0,0.18)', 
                        display: 'inline-block',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        flexShrink: 0
                      }} 
                    />
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.25 }}>
                      {color.fullName || color.label}
                    </span>
                  </div>
                ))}
                
                {hasWeeklySelections && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingTop: '0.35rem', borderTop: '1px dashed #cbd5e1' }}>
                    <div style={{ position: 'relative', width: '22px', height: '22px', borderRadius: '6px', border: '2px solid #2563eb', backgroundColor: '#eff6ff', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', top: '2px', right: '2px', width: '5px', height: '5px', backgroundColor: '#2563eb', borderRadius: '50%' }}></div>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: '#2563eb', opacity: 0.4 }}></div>
                    </div>
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.25 }}>
                      Días presenciales
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Si Balance o 40-60 están activos para exportar, los incluimos en la exportación PNG */}
        {(exportIncludeBalance || exportInclude4060) && (
          <div style={{ width: '100%' }}>
            <BalancePanelsWrapper
              includeBalance={exportIncludeBalance}
              include4060={exportInclude4060}
              table4060={table4060}
              calendarStats={calendarStats}
              legendColors={legendColors}
              isDarkMode={false}
              isExport={true}
              onUpdateCant={noop}
              onUpdatePastDisfrutadas={noop}
              onUpdatePastPresenc={noop}
              onUpdatePastTT={noop}
              onClearTable={noop}
              showClearConfirm={false}
              setShowClearConfirm={noop}
              onOpenHelpModal={noop}
            />
          </div>
        )}
      </div>
    </div>
  );
};

