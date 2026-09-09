import React from 'react';
import { MobileDrawer } from '../Mobile/MobileDrawer.tsx';
import { ColorSettingsModal } from './ColorSettingsModal.tsx';
import { AddColorModal } from './AddColorModal.tsx';
import { HowItWorksModal } from './HowItWorksModal.tsx';
import { WhatIs4060Modal } from './WhatIs4060Modal.tsx';
import { ImportConfirmModal } from './ImportConfirmModal.tsx';
import { UseCalendarAppReturn } from '../../hooks/useCalendarApp.ts';

interface AppModalsProps {
  app: UseCalendarAppReturn;
}

export const AppModals: React.FC<AppModalsProps> = ({ app }) => {
  return (
    <>
      {/* Menú Lateral Off-Canvas Móvil */}
      <MobileDrawer
        isOpen={app.mobileMenuOpen}
        onClose={() => app.setMobileMenuOpen(false)}
        isDarkMode={app.isDarkMode}
        toggleDarkMode={app.toggleDarkMode}
        onOpenHowItWorks={() => app.setShowHowItWorks(true)}
        showWeekends={app.showWeekends}
        setShowWeekends={app.setShowWeekends}
        presencialFirstMonday={app.presencialFirstMonday}
        onPresencialFirstMondayToggle={app.handlePresencialFirstMondayToggle}
        planningMode={app.planningMode}
        setPlanningMode={app.setPlanningMode}
        onExportData={app.handleExportData}
        onTriggerImport={app.handleTriggerImport}
        onClearCalendar={() => {
          app.handleClearCalendar();
          app.setShowClearConfirm(false);
        }}
        showClearConfirm={app.showClearConfirm}
        setShowClearConfirm={app.setShowClearConfirm}
        onExportPNG={app.handleExportPNG}
      />

      {/* Modal de Ajustes de Color */}
      <ColorSettingsModal
        item={app.colorSettingsItem}
        onClose={() => app.setColorSettingsItem(null)}
        onUpdateColor={app.handleUpdateItemColor}
        onDeleteColor={app.handleDeleteColor}
        isDarkMode={app.isDarkMode}
      />

      {/* Modal para Añadir Color */}
      <AddColorModal
        isOpen={app.showAddColorModal}
        onClose={() => app.setShowAddColorModal(false)}
        onAddColor={app.handleAddColor}
        isDarkMode={app.isDarkMode}
      />

      {/* Modal ¿Cómo funciona? */}
      <HowItWorksModal
        isOpen={app.showHowItWorks}
        onClose={() => app.setShowHowItWorks(false)}
        isDarkMode={app.isDarkMode}
      />

      {/* Modal ¿Qué es esto? (Regla 40-60) */}
      <WhatIs4060Modal
        isOpen={app.showWhatIs4060Modal}
        onClose={() => app.setShowWhatIs4060Modal(false)}
        isDarkMode={app.isDarkMode}
      />

      {/* Modal Confirmación de Importación */}
      <ImportConfirmModal
        isOpen={app.showImportConfirm}
        onConfirm={app.handleConfirmImport}
        onCancel={app.handleCancelImport}
        isDarkMode={app.isDarkMode}
      />
    </>
  );
};

