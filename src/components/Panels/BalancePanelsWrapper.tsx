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
  onUpdateCant,
  onUpdatePastDisfrutadas,
  onUpdatePastPresenc,
  onUpdatePastTT,
  onClearTable,
  showClearConfirm,
  setShowClearConfirm,
  onOpenHelpModal
}) => {
  return (
    <div className="columns is-variable is-3 mt-3 is-desktop view-transition-content" style={{ height: 'auto' }}>
      {/* PANEL 1: BALANCE */}
      <div className="column is-7-desktop is-12-tablet is-flex-desktop" style={{ height: 'auto' }}>
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

      {/* PANEL 2: PROPORCIÓN 40-60 */}
      <div className="column is-5-desktop is-12-tablet is-flex-desktop" style={{ height: 'auto' }}>
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
    </div>
  );
};

