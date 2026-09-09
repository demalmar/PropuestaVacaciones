import React, { useState, useEffect } from 'react';
import { ColorPalette } from '../Sidebar/ColorPalette.tsx';
import { OptionsSidebar } from '../Sidebar/OptionsSidebar.tsx';
import { SemestralView } from '../Calendar/SemestralView.tsx';
import { AnnualView } from '../Calendar/AnnualView.tsx';
import { BalancePanelsWrapper } from '../Panels/BalancePanelsWrapper.tsx';
import { UseCalendarAppReturn } from '../../hooks/useCalendarApp.ts';

interface DesktopViewProps {
  app: UseCalendarAppReturn;
}

export const DesktopView: React.FC<DesktopViewProps> = ({ app }) => {
  const [viewportWidth, setViewportWidth] = useState<number>(() => {
    if (typeof document !== 'undefined' && document.documentElement.clientWidth) {
      return document.documentElement.clientWidth;
    }
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1920;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = (document.documentElement && document.documentElement.clientWidth) || window.innerWidth;
      setViewportWidth(width);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ancho constante del contenedor del calendario (960px): la vista bimestral respeta el ancho de la anual
  const calendarTargetWidth = 960;
  const menuWidth = 264;
  const sidebarWidth = 287; // Ampliado +1/3 (de 215px a 287px)
  const gap = 24; // 1.5rem de separación entre bloques
  const minMargin = 16; // Margen de seguridad respecto al borde de la pantalla
  const requiredLeftSpace = menuWidth + gap + minMargin; // 304px
  const requiredRightSpace = sidebarWidth + gap + minMargin; // 327px
  const availableSpace = (viewportWidth - calendarTargetWidth) / 2;
  const canCenterCalendar = availableSpace >= Math.max(requiredLeftSpace, requiredRightSpace);

  // Renderiza exclusivamente el bloque del calendario (bimestral o anual) con animación de altura
  const renderCalendarOnly = () => (
    <div 
      style={{ 
        height: app.calendarHeight !== undefined ? `${app.calendarHeight}px` : 'auto',
        transition: 'height 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}
    >
      <div ref={app.calendarAreaRef}>
        {(app.viewMode === 'bimestral' || app.viewMode === 'semestral') ? (
          <SemestralView
            currentDate={app.currentDate}
            onPrevMonth={app.handlePrevMonth}
            onNextMonth={app.handleNextMonth}
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
        ) : (
          <AnnualView
            currentYear={app.currentYear}
            onPrevYear={app.handlePrevYear}
            onNextYear={app.handleNextYear}
            onYearChange={app.handleSetYear}
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
        )}
      </div>
    </div>
  );

  // Renderiza la barra lateral de opciones y acciones
  const renderOptionsSidebar = (className?: string) => (
    <OptionsSidebar
      viewMode={app.viewMode}
      setViewMode={app.setViewMode}
      showWeekends={app.showWeekends}
      setShowWeekends={app.setShowWeekends}
      show4060={app.show4060}
      setShow4060={app.setShow4060}
      presencialFirstMonday={app.presencialFirstMonday}
      onPresencialFirstMondayToggle={app.handlePresencialFirstMondayToggle}
      onOpenHowItWorks={() => app.setShowHowItWorks(true)}
      onExportData={app.handleExportData}
      onTriggerImport={app.handleTriggerImport}
      onExportPNG={app.handleExportPNG}
      onClearCalendar={() => {
        app.handleClearCalendar();
        app.setShowClearConfirm(false);
      }}
      showClearConfirm={app.showClearConfirm}
      setShowClearConfirm={app.setShowClearConfirm}
      isDarkMode={app.isDarkMode}
      fileInputRef={app.fileInputRef}
      onFileChange={app.handleFileChange}
      className={className}
    />
  );

  // Renderiza los paneles de balance y proporción 40-60
  const renderBalancePanels = () => (
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
  );

  return (
    <div className="is-hidden-mobile" style={{ width: '100%' }}>
      {canCenterCalendar ? (
        /* Modo 1: El centro se calcula exclusivamente desde el div del calendario */
        <div 
          style={{ 
            position: 'relative', 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center' 
          }}
        >
          {/* Contenedor central: su centro es exactamente el centro del calendario y de la pantalla */}
          <div 
            style={{ 
              position: 'relative', 
              width: `${calendarTargetWidth}px`, 
              maxWidth: '100%',
              transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* 1. Elemento a la izquierda: Menú de etiquetas de color */}
            <div 
              style={{ 
                position: 'absolute', 
                right: `calc(100% + ${gap}px)`, 
                top: 0, 
                width: `${menuWidth}px` 
              }}
            >
              <ColorPalette
                legendColors={app.legendColors}
                activeColorId={app.activeColorId}
                setActiveColorId={app.setActiveColorId}
                onDeleteColor={app.handleDeleteColor}
                onAddColor={app.handleAddColor}
                isDarkMode={app.isDarkMode}
                toggleDarkMode={app.toggleDarkMode}
                className=""
              />
            </div>

            {/* 2. Centro: Contenedor que encierra EXCLUSIVAMENTE el calendario */}
            <div 
              className="box p-4" 
              style={{ 
                border: app.isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', 
                borderRadius: '14px', 
                backgroundColor: app.isDarkMode ? '#182230' : '#f8fafc',
                boxShadow: app.isDarkMode ? 'none' : '0 4px 24px -4px rgba(30, 41, 59, 0.06)',
                marginBottom: '1.5rem'
              }}
            >
              {renderCalendarOnly()}
            </div>

            {/* 3. Elemento a la derecha: Opciones del calendario */}
            <div 
              style={{ 
                position: 'absolute', 
                left: `calc(100% + ${gap}px)`, 
                top: 0, 
                width: `${sidebarWidth}px` 
              }}
            >
              {renderOptionsSidebar('is-flex is-flex-direction-column')}
            </div>

            {/* 4. Paneles de balance debajo del calendario centrado */}
            {renderBalancePanels()}
          </div>
        </div>
      ) : (
        /* Modo 2 (Fallback): Espacio insuficiente a la izquierda -> todo centrado como bloque unificado */
        <div 
          className="columns is-variable is-3 is-desktop" 
          style={{ 
            width: '100%', 
            maxWidth: '1440px', 
            margin: '0 auto' 
          }}
        >
          {/* 1. Columna Izquierda: Título + Paleta de Colores */}
          <ColorPalette
            legendColors={app.legendColors}
            activeColorId={app.activeColorId}
            setActiveColorId={app.setActiveColorId}
            onDeleteColor={app.handleDeleteColor}
            onAddColor={app.handleAddColor}
            isDarkMode={app.isDarkMode}
            toggleDarkMode={app.toggleDarkMode}
          />

          {/* 2. Columna Derecha: Calendario + Opciones + Paneles */}
          <div className="column is-9-desktop is-8-tablet">
            <div className="columns is-variable is-3 is-desktop" style={{ alignItems: 'flex-start' }}>
              <div className="column is-flex-grow-1" style={{ minWidth: 0 }}>
                <div 
                  className="box p-4" 
                  style={{ 
                    border: app.isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', 
                    borderRadius: '14px', 
                    backgroundColor: app.isDarkMode ? '#182230' : '#f8fafc',
                    boxShadow: app.isDarkMode ? 'none' : '0 4px 24px -4px rgba(30, 41, 59, 0.06)',
                    marginBottom: '1.5rem'
                  }}
                >
                  {renderCalendarOnly()}
                </div>
              </div>
              {renderOptionsSidebar()}
            </div>

            {renderBalancePanels()}
          </div>
        </div>
      )}
    </div>
  );
};

