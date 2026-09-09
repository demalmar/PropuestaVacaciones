import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MobileHeader } from './MobileHeader.tsx';
import { MobileColorBar } from './MobileColorBar.tsx';
import { MonthGrid } from '../Calendar/MonthGrid.tsx';
import { BalancePanelsWrapper } from '../Panels/BalancePanelsWrapper.tsx';
import { UseCalendarAppReturn } from '../../hooks/useCalendarApp.ts';
import './MobileView.css';

interface MobileViewProps {
  app: UseCalendarAppReturn;
}

export const MobileView: React.FC<MobileViewProps> = ({ app }) => {
  return (
    <div 
      className="is-hidden-tablet is-flex is-flex-direction-column" 
      style={{ 
        gap: '1.25rem', 
        width: '100%',
        height: 'auto',
        minHeight: 'auto',
        paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom, 20px))'
      }}
    >
      
      {/* 1. Cabecera móvil con botón de menú */}
      <MobileHeader
        onOpenMenu={() => app.setMobileMenuOpen(true)}
        isDarkMode={app.isDarkMode}
      />

      {/* 2. Barra horizontal de colores */}
      <MobileColorBar
        legendColors={app.legendColors}
        activeColorId={app.activeColorId}
        setActiveColorId={app.setActiveColorId}
        onOpenColorSettings={(item) => app.setColorSettingsItem(item)}
        onOpenAddColorModal={() => app.setShowAddColorModal(true)}
        isDarkMode={app.isDarkMode}
      />

      {/* 3. Primer Mes (Calendario Superior) */}
      <div style={{ width: '100%' }}>
        <MonthGrid
          targetYear={app.leftYear}
          targetMonth={app.leftMonth}
          showWeekends={app.showWeekends}
          isDarkMode={app.isDarkMode}
          coloredDays={app.coloredDays}
          legendColors={app.legendColors}
          presencialFirstMonday={app.presencialFirstMonday}
          weeklySelections={app.weeklySelections}
          fixedWeeklySelections={app.fixedWeeklySelections}
          onDayClick={app.handleDayClick}
          onHeaderDayClick={app.handleHeaderDayClick}
        />
      </div>

      {/* 4. Barra de navegación de meses en móvil */}
      <div 
        className="mobile-nav-bar"
        style={{
          backgroundColor: app.isDarkMode ? '#0d9488' : '#0f766e',
          border: app.isDarkMode ? '1.5px solid #14b8a6' : '1.5px solid #115e59'
        }}
      >
        <button
          onClick={app.handlePrevMonth}
          className="button is-small"
          style={{
            flex: 1,
            height: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            borderRight: '1.5px solid rgba(255, 255, 255, 0.35)',
            color: '#ffffff',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-button)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            borderRadius: 0,
            cursor: 'pointer'
          }}
          title="Mes anterior"
        >
          <ChevronLeft size={19} strokeWidth={2.8} />
          <span>Mes anterior</span>
        </button>

        <button
          onClick={app.handleNextMonth}
          className="button is-small"
          style={{
            flex: 1,
            height: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-button)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            borderRadius: 0,
            cursor: 'pointer'
          }}
          title="Mes siguiente"
        >
          <span>Mes siguiente</span>
          <ChevronRight size={19} strokeWidth={2.8} />
        </button>
      </div>

      {/* 5. Segundo Mes (Calendario Inferior) */}
      <div style={{ width: '100%' }}>
        <MonthGrid
          targetYear={app.rightYear}
          targetMonth={app.rightMonth}
          showWeekends={app.showWeekends}
          isDarkMode={app.isDarkMode}
          coloredDays={app.coloredDays}
          legendColors={app.legendColors}
          presencialFirstMonday={app.presencialFirstMonday}
          weeklySelections={app.weeklySelections}
          fixedWeeklySelections={app.fixedWeeklySelections}
          onDayClick={app.handleDayClick}
          onHeaderDayClick={app.handleHeaderDayClick}
        />
      </div>

      {/* 6. Panel de Balance y Proporción 40-60 en Móvil */}
      <div style={{ width: '100%' }}>
        <BalancePanelsWrapper
          includeBalance={true}
          include4060={app.show4060}
          table4060={app.table4060}
          calendarStats={app.calendarStats}
          legendColors={app.legendColors}
          isDarkMode={app.isDarkMode}
          onUpdateCant={app.handleUpdateCant}
          onUpdatePastDisfrutadas={app.handleUpdatePastDisfrutadas}
          onUpdatePastPresenc={app.handleUpdatePastPresenc}
          onUpdatePastTT={app.handleUpdatePastTT}
          onClearTable={app.handleClearTable4060}
          showClearConfirm={app.showClearTableConfirm}
          setShowClearConfirm={app.setShowClearTableConfirm}
          onOpenHelpModal={() => app.setShowWhatIs4060Modal(true)}
        />
      </div>

    </div>
  );
};

