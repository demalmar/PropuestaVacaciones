import React from 'react';
import { Info, Download, Upload, Trash2 } from 'lucide-react';
import { ViewMode, PlanningMode } from '../../types/calendar.ts';

interface OptionsSidebarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showWeekends: boolean;
  setShowWeekends: (show: boolean) => void;
  presencialFirstMonday: boolean;
  onPresencialFirstMondayToggle: (val: boolean) => void;
  planningMode: PlanningMode;
  setPlanningMode: (mode: PlanningMode) => void;
  onOpenHowItWorks: () => void;
  onExportData: () => void;
  onTriggerImport: () => void;
  onExportPNG: () => void;
  onClearCalendar: () => void;
  showClearConfirm: boolean;
  setShowClearConfirm: (show: boolean) => void;
  isDarkMode: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const OptionsSidebar: React.FC<OptionsSidebarProps> = ({
  viewMode,
  setViewMode,
  showWeekends,
  setShowWeekends,
  presencialFirstMonday,
  onPresencialFirstMondayToggle,
  planningMode,
  setPlanningMode,
  onOpenHowItWorks,
  onExportData,
  onTriggerImport,
  onExportPNG,
  onClearCalendar,
  showClearConfirm,
  setShowClearConfirm,
  isDarkMode,
  fileInputRef,
  onFileChange,
  className = 'column is-narrow is-flex is-flex-direction-column',
  style
}) => {
  return (
    <div className={className} style={{ width: 'var(--sidebar-width)', minWidth: 'var(--sidebar-width)', ...style }}>
      <div className="is-flex is-flex-direction-column is-flex-grow-1" style={{ gap: '0.65rem', transform: 'translateZ(0)', willChange: 'transform', height: '100%' }}>
        
        {/* 1. ¿Cómo funciona? como primera opción */}
        <button 
          onClick={onOpenHowItWorks}
          className="button is-fullwidth is-small mb-0"
          style={{ 
            fontWeight: 700,
            fontSize: 'var(--font-size-label)',
            borderRadius: '10px',
            border: isDarkMode ? '1px solid #0d9488' : '1px solid #99f6e4',
            backgroundColor: isDarkMode ? 'rgba(15, 118, 110, 0.18)' : '#f0fdfa',
            color: isDarkMode ? '#5eead4' : '#0f766e',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
          title="Ver instrucciones y ayuda de uso"
        >
          <span className="icon is-small"><Info size={16} /></span>
          <span>¿Cómo funciona?</span>
        </button>

        {/* 2. Selector de Modo de Vista (Anual / Bimestral) debajo de ¿Cómo funciona? */}
        <div 
          className="box p-2 mb-0" 
          style={{ 
            border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', 
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
            boxShadow: 'none',
            borderRadius: '10px'
          }}
        >
          <div className="is-flex is-align-items-center mb-1.5" style={{ gap: '0.35rem' }}>
            <span style={{ fontSize: '14px' }}>👁️</span>
            <span className="has-text-weight-bold" style={{ fontSize: 'var(--font-size-header-section)', color: isDarkMode ? '#e2e8f0' : '#334155' }}>
              Modo de Vista
            </span>
          </div>
          <div 
            className="is-flex" 
            style={{ 
              backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', 
              borderRadius: '8px', 
              padding: '3px',
              gap: '3px'
            }}
          >
            {/* 1. Botón Anual (por defecto y primero) */}
            <button
              type="button"
              onClick={() => setViewMode('anual')}
              className="button is-small is-flex-grow-1"
              style={{
                border: 'none',
                borderRadius: '6px',
                height: '32px',
                fontSize: 'var(--font-size-button)',
                fontWeight: viewMode === 'anual' ? 800 : 600,
                backgroundColor: viewMode === 'anual' 
                  ? (isDarkMode ? '#0d9488' : '#0f766e') 
                  : 'transparent',
                color: viewMode === 'anual' ? '#ffffff' : (isDarkMode ? '#94a3b8' : '#64748b'),
                boxShadow: viewMode === 'anual' ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                padding: '0 6px'
              }}
              title="Vista anual: los 12 meses en cuadrícula 4x3 con desplazamiento anual"
            >
              Anual
            </button>

            {/* 2. Botón Bimestral (segundo) */}
            <button
              type="button"
              onClick={() => setViewMode('bimestral')}
              className="button is-small is-flex-grow-1"
              style={{
                border: 'none',
                borderRadius: '6px',
                height: '32px',
                fontSize: 'var(--font-size-button)',
                fontWeight: (viewMode === 'bimestral' || viewMode === 'semestral') ? 800 : 600,
                backgroundColor: (viewMode === 'bimestral' || viewMode === 'semestral') 
                  ? (isDarkMode ? '#0d9488' : '#0f766e') 
                  : 'transparent',
                color: (viewMode === 'bimestral' || viewMode === 'semestral') ? '#ffffff' : (isDarkMode ? '#94a3b8' : '#64748b'),
                boxShadow: (viewMode === 'bimestral' || viewMode === 'semestral') ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                padding: '0 6px'
              }}
              title="Vista bimestral: 2 meses consecutivos con desplazamiento mensual"
            >
              Bimestral
            </button>
          </div>
        </div>

        {/* 3. Mostrar fines de semana */}
        <label 
          className="checkbox box p-2.5 is-flex is-align-items-center mb-0" 
          style={{ 
            gap: '0.5rem', 
            border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', 
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
            boxShadow: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          <input 
            type="checkbox" 
            checked={showWeekends} 
            onChange={(e) => setShowWeekends(e.target.checked)} 
            style={{ cursor: 'pointer' }}
          />
          <span className="has-text-weight-bold" style={{ fontSize: 'var(--font-size-label)', color: isDarkMode ? '#e2e8f0' : '#334155' }}>
            Mostrar fines de semana
          </span>
        </label>

        {/* 4. Presencial por mes (cambia primer lunes) */}
        <label 
          className="checkbox box p-2.5 is-flex is-align-items-start mb-0" 
          style={{ 
            gap: '0.5rem', 
            border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', 
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
            boxShadow: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }} 
          title="Marcado: permite configurar días presenciales distintos cada mes a partir de su primer lunes. Desmarcado: aplica los mismos días fijos a todo el año."
        >
          <input 
            type="checkbox" 
            checked={presencialFirstMonday} 
            className="mt-1"
            style={{ cursor: 'pointer' }}
            onChange={(e) => onPresencialFirstMondayToggle(e.target.checked)} 
          />
          <div className="is-flex is-flex-direction-column" style={{ minWidth: 0 }}>
            <span className="has-text-weight-bold" style={{ fontSize: 'var(--font-size-label)', color: isDarkMode ? '#e2e8f0' : '#334155', lineHeight: 1.25 }}>
              Presencial por mes
            </span>
            <span style={{ fontSize: 'var(--font-size-subtext)', fontWeight: 500, color: isDarkMode ? '#94a3b8' : '#64748b', marginTop: '2px', lineHeight: 1.25 }}>
              Cambia a partir del 1.ᵉʳ lunes
            </span>
            <span style={{ fontSize: 'var(--font-size-subtext)', color: isDarkMode ? '#7dd3fc' : '#0369a1', lineHeight: 1.25, marginTop: '2px', fontWeight: 600 }}>
              Desmarcado: fijo todo el año
            </span>
          </div>
        </label>

        {/* 5. Selector de Modo: Selección libre o Balance (Radio) */}
        <div 
          className="box p-2.5 mb-0" 
          style={{ 
            border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', 
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
            boxShadow: 'none',
            borderRadius: '10px'
          }}
        >
          <div className="is-flex is-align-items-center mb-1.5" style={{ gap: '0.35rem' }}>
            <span style={{ fontSize: '15px' }}>⚖️</span>
            <span className="has-text-weight-bold" style={{ fontSize: 'var(--font-size-header-section)', color: isDarkMode ? '#e2e8f0' : '#334155' }}>
              Modo de Selección
            </span>
          </div>
          <div className="is-flex is-flex-direction-column" style={{ gap: '0.25rem' }}>
            <label 
              className="radio is-flex is-align-items-center mb-0 px-2 py-1.5" 
              style={{ 
                cursor: 'pointer',
                borderRadius: '6px',
                backgroundColor: planningMode === 'libre' 
                  ? (isDarkMode ? 'rgba(15, 118, 110, 0.2)' : '#f0fdfa') 
                  : 'transparent',
                border: planningMode === 'libre'
                  ? (isDarkMode ? '1px solid #0d9488' : '1px solid #99f6e4')
                  : '1px solid transparent',
                transition: 'all 0.15s ease',
                gap: '0.45rem'
              }}
              title="Selección libre: no importa cuántas marque"
            >
              <input 
                type="radio" 
                name="planningMode_desktop" 
                value="libre" 
                checked={planningMode === 'libre'} 
                onChange={() => setPlanningMode('libre')} 
                style={{ margin: 0, cursor: 'pointer' }}
              />
              <div className="is-flex is-flex-direction-column" style={{ minWidth: 0, lineHeight: 1.25 }}>
                <span className="has-text-weight-bold" style={{ fontSize: 'var(--font-size-label)', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                  Selección libre
                </span>
                <span style={{ fontSize: 'var(--font-size-subtext)', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Selecciona días ilimitados
                </span>
              </div>
            </label>

            <label 
              className="radio is-flex is-align-items-center mb-0 px-2 py-1.5" 
              style={{ 
                cursor: 'pointer',
                borderRadius: '6px',
                backgroundColor: planningMode === 'balance' 
                  ? (isDarkMode ? 'rgba(15, 118, 110, 0.2)' : '#f0fdfa') 
                  : 'transparent',
                border: planningMode === 'balance'
                  ? (isDarkMode ? '1px solid #0d9488' : '1px solid #99f6e4')
                  : '1px solid transparent',
                transition: 'all 0.15s ease',
                gap: '0.45rem'
              }}
              title="Balance: control de días y proporción 40-60"
            >
              <input 
                type="radio" 
                name="planningMode_desktop" 
                value="balance" 
                checked={planningMode === 'balance'} 
                onChange={() => setPlanningMode('balance')} 
                style={{ margin: 0, cursor: 'pointer' }}
              />
              <div className="is-flex is-flex-direction-column" style={{ minWidth: 0, lineHeight: 1.25 }}>
                <span className="has-text-weight-bold" style={{ fontSize: 'var(--font-size-label)', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                  Balance
                </span>
                <span style={{ fontSize: 'var(--font-size-subtext)', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.3 }}>
                  Establece días totales
                  <br />
                  Regla 40-60
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 6. Exportar e Importar datos */}
        <div className="is-flex" style={{ gap: '0.45rem', width: '100%' }}>
          <button 
            type="button"
            onClick={onExportData}
            className="button"
            style={{ 
              flex: 1,
              minWidth: 0,
              height: '58px',
              maxHeight: '58px',
              minHeight: '58px',
              borderRadius: '10px', 
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
              border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', 
              color: isDarkMode ? '#e2e8f0' : '#334155', 
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              padding: '0.35rem 0.2rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Exportar todos los calendarios y datos a un archivo JSON"
          >
            <Download size={20} strokeWidth={2.2} style={{ color: isDarkMode ? '#38bdf8' : '#0284c7' }} />
            <span style={{ fontSize: 'var(--font-size-subtext)', fontWeight: 700, lineHeight: 1.15, textAlign: 'center' }}>
              Exportar datos
            </span>
          </button>

          <button 
            type="button"
            onClick={onTriggerImport}
            className="button"
            style={{ 
              flex: 1,
              minWidth: 0,
              height: '58px',
              maxHeight: '58px',
              minHeight: '58px',
              borderRadius: '10px', 
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
              border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', 
              color: isDarkMode ? '#e2e8f0' : '#334155', 
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              padding: '0.35rem 0.2rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Importar calendarios y datos desde un archivo JSON"
          >
            <Upload size={20} strokeWidth={2.2} style={{ color: isDarkMode ? '#34d399' : '#059669' }} />
            <span style={{ fontSize: 'var(--font-size-subtext)', fontWeight: 700, lineHeight: 1.15, textAlign: 'center' }}>
              Importar datos
            </span>
          </button>
        </div>

        {/* Input oculto para cargar archivos JSON */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          accept=".json,application/json" 
          style={{ display: 'none' }} 
        />

        {/* 7. Limpiar calendario */}
        <div>
          {showClearConfirm ? (
            <div className="notification is-danger is-light p-3 mb-0" style={{ border: '1px solid #f87171', borderRadius: '10px' }}>
              <p className="has-text-weight-bold has-text-centered mb-2" style={{ fontSize: 'var(--font-size-button)' }}>¿Borrar todo lo marcado?</p>
              <div className="buttons are-small mb-0 is-flex">
                <button 
                  onClick={onClearCalendar} 
                  className="button is-danger is-fullwidth"
                  style={{ borderRadius: '6px', fontSize: 'var(--font-size-note)', fontWeight: 700 }}
                >
                  Sí, borrar
                </button>
                <button 
                  onClick={() => setShowClearConfirm(false)} 
                  className="button is-light is-fullwidth"
                  style={{ borderRadius: '6px', fontSize: 'var(--font-size-note)' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowClearConfirm(true)} 
              className="button is-fullwidth is-small"
              style={{ 
                borderRadius: '8px', 
                border: '1px solid #fecdd3', 
                color: '#e11d48', 
                backgroundColor: isDarkMode ? 'rgba(225, 29, 72, 0.12)' : '#fff1f2', 
                fontWeight: 700,
                fontSize: 'var(--font-size-button)',
                height: '36px',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
              title="Limpiar todas las selecciones del calendario"
            >
              <span className="icon is-small"><Trash2 size={16} /></span>
              <span>Limpiar calendario</span>
            </button>
          )}
        </div>

        {/* 8. Botón Descargar PNG */}
        <button 
          onClick={onExportPNG}
          className="button is-fullwidth"
          style={{ 
            height: '48px',
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #0e7490 0%, #0f766e 100%)', 
            color: '#ffffff', 
            border: 'none', 
            boxShadow: '0 4px 14px rgba(15, 118, 110, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginTop: 'auto',
            padding: '4px 8px'
          }}
          title={planningMode === 'balance' ? "Descargar imagen PNG (incluye calendario, leyenda y balance)" : "Descargar imagen PNG (solo calendario y leyenda)"}
        >
          <div className="is-flex is-align-items-center" style={{ gap: '0.45rem' }}>
            <Download size={18} strokeWidth={2.4} />
            <span style={{ fontSize: 'var(--font-size-label)', fontWeight: 800, lineHeight: 1.2 }}>Descargar PNG</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.88, lineHeight: 1, marginTop: '2px' }}>
            {planningMode === 'balance' ? '• Con Balance y 40-60' : '• Solo Calendario'}
          </span>
        </button>
      </div>
    </div>
  );
};
