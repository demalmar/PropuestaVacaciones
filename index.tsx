import React from 'react';
import { useCalendarApp } from './src/hooks/useCalendarApp.ts';
import { DesktopView } from './src/components/Desktop/DesktopView.tsx';
import { MobileView } from './src/components/Mobile/MobileView.tsx';
import { AppModals } from './src/components/Modals/AppModals.tsx';
import { ExportCanvas } from './src/components/Export/ExportCanvas.tsx';

const CalendarApp: React.FC = () => {
  const app = useCalendarApp();

  return (
    <section 
      className="section px-4" 
      style={{ 
        minHeight: '100vh', 
        paddingTop: '2.25rem', 
        paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 24px))', 
        backgroundColor: app.isDarkMode ? '#0b0f17' : '#f8fafc', 
        transition: 'background-color 0.25s ease' 
      }}
    >
      <div style={{ width: '100%' }}>
        {/* Vista de escritorio (>= 769px) */}
        <DesktopView app={app} />

        {/* Vista móvil (< 769px) */}
        <div className="container" style={{ maxWidth: '640px' }}>
          <MobileView app={app} />
        </div>
      </div>

      {/* Ventanas modales y cajón lateral */}
      <AppModals app={app} />

      {/* Contenedor oculto formateado para exportación PNG */}
      <ExportCanvas
        exportRef={app.exportRef}
        viewMode={app.viewMode}
        currentYear={app.currentYear}
        leftYear={app.leftYear}
        leftMonth={app.leftMonth}
        rightYear={app.rightYear}
        rightMonth={app.rightMonth}
        showWeekends={app.showWeekends}
        showNextYearJanuary={app.showNextYearJanuary}
        coloredDays={app.coloredDays}
        legendColors={app.legendColors}
        presencialFirstMonday={app.presencialFirstMonday}
        weeklySelections={app.weeklySelections}
        fixedWeeklySelections={app.fixedWeeklySelections}
        show4060={app.show4060}
        exportIncludeBalance={app.exportIncludeBalance}
        exportInclude4060={app.exportInclude4060}
        table4060={app.table4060}
        calendarStats={app.calendarStats}
      />
    </section>
  );
};

export default CalendarApp;
