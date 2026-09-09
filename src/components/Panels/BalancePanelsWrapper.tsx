import React from 'react';
import { BalancePanel } from './BalancePanel.tsx';
import { Proporcion4060Panel } from './Proporcion4060Panel.tsx';
import { Table4060Data, CalendarStats, LegendColorItem } from '../../types/calendar.ts';

interface BalancePanelsWrapperProps {
  table4060: Table4060Data;
  calendarStats: CalendarStats;
  legendColors: LegendColorItem[];
  isDarkMode: boolean;
  isExport?: boolean;
  includeBalance?: boolean;
  include4060?: boolean;
  onUpdateCant: (key: 'periodo' | 'independientes' | 'asuntos', value: number) => void;
  onUpdatePastDisfrutadas: (key: 'periodo' | 'independientes' | 'asuntos', value: number) => void;
  onUpdatePastPresenc: (val: number) => void;
  onUpdatePastTT: (val: number) => void;
  onClearTable: () => void;
  showClearConfirm: boolean;
  setShowClearConfirm: (show: boolean) => void;
  onOpenHelpModal: () => void;
}

export const BalancePanelsWrapper: React.FC<BalancePanelsWrapperProps> = ({
  table4060,
  calendarStats,
  legendColors,
  isDarkMode,
  isExport = false,
  includeBalance = true,
  include4060 = true,
  onUpdateCant,
  onUpdatePastDisfrutadas,
  onUpdatePastPresenc,
  onUpdatePastTT,
  onClearTable,
  showClearConfirm,
  setShowClearConfirm,
  onOpenHelpModal
}) => {
  if (!includeBalance && !include4060) return null;

  const isBoth = includeBalance && include4060;
  // En exportación con un solo panel: centrado al 50% de ancho
  const isOnlyOne = !isBoth;

  if (isOnlyOne && isExport) {
    // Contenedor centrado al 50%
    return (
      <div className="mt-3 view-transition-content" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ width: '50%', minWidth: '320px' }}>
          {includeBalance && (
            <BalancePanel
              table4060={table4060}
              calendarStats={calendarStats}
              legendColors={legendColors}
              isDarkMode={isDarkMode}
              isExport={isExport}
              onUpdateCant={onUpdateCant}
              onUpdatePastDisfrutadas={onUpdatePastDisfrutadas}
              onClearTable={onClearTable}
              showClearConfirm={showClearConfirm}
              setShowClearConfirm={setShowClearConfirm}
            />
          )}
          {include4060 && (
            <Proporcion4060Panel
              table4060={table4060}
              calendarStats={calendarStats}
              isDarkMode={isDarkMode}
              isExport={isExport}
              onUpdatePastPresenc={onUpdatePastPresenc}
              onUpdatePastTT={onUpdatePastTT}
              onOpenHelpModal={onOpenHelpModal}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="columns is-variable is-3 mt-3 is-desktop view-transition-content" style={{ height: 'auto' }}>
      {/* PANEL 1: BALANCE */}
      {includeBalance && (
        <div className={`column ${isBoth ? 'is-7-desktop is-12-tablet' : 'is-12'} is-flex-desktop`} style={{ height: 'auto' }}>
          <BalancePanel
            table4060={table4060}
            calendarStats={calendarStats}
            legendColors={legendColors}
            isDarkMode={isDarkMode}
            isExport={isExport}
            onUpdateCant={onUpdateCant}
            onUpdatePastDisfrutadas={onUpdatePastDisfrutadas}
            onClearTable={onClearTable}
            showClearConfirm={showClearConfirm}
            setShowClearConfirm={setShowClearConfirm}
          />
        </div>
      )}

      {/* PANEL 2: PROPORCIÓN 40-60 */}
      {include4060 && (
        <div className={`column ${isBoth ? 'is-5-desktop is-12-tablet' : 'is-12'} is-flex-desktop`} style={{ height: 'auto' }}>
          <Proporcion4060Panel
            table4060={table4060}
            calendarStats={calendarStats}
            isDarkMode={isDarkMode}
            isExport={isExport}
            onUpdatePastPresenc={onUpdatePastPresenc}
            onUpdatePastTT={onUpdatePastTT}
            onOpenHelpModal={onOpenHelpModal}
          />
        </div>
      )}
    </div>
  );
};

