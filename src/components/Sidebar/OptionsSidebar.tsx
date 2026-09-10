import React from 'react';
import { Info, Download, Upload, Trash2, SlidersHorizontal } from 'lucide-react';
import { ViewMode } from '../../types/calendar.ts';

interface OptionsSidebarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showWeekends: boolean;
  setShowWeekends: (show: boolean) => void;
  show4060: boolean;
  setShow4060: (show: boolean) => void;
  presencialFirstMonday: boolean;
  onPresencialFirstMondayToggle: (val: boolean) => void;
  onOpenHowItWorks: (targetSection?: string) => void;
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
  show4060,
  setShow4060,
  presencialFirstMonday,
  onPresencialFirstMondayToggle,
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

        {/* Panel Unificado: Opciones */}
        <div 
          className="box p-3 mb-0" 
          style={{ 
            border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', 
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
            boxShadow: 'none',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          {/* Cabecera del Panel Opciones */}
          <div className="is-flex is-align-items-center" style={{ gap: '0.45rem', borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9', paddingBottom: '0.45rem' }}>
            <SlidersHorizontal size={15} style={{ color: isDarkMode ? '#0d9488' : '#0f766e' }} strokeWidth={2.4} />
            <span className="has-text-weight-bold" style={{ fontSize: 'var(--font-size-header-section)', color: isDarkMode ? '#e2e8f0' : '#334155' }}>
              Opciones
            </span>
          </div>

          {/* 1. Modo de Vista */}
          <div>
            <div className="mb-1">
              <span style={{ fontSize: 'var(--font-size-subtext)', fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
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
              {/* Botón Anual */}
              <button
                type="button"
                onClick={() => setViewMode('anual')}
                className="button is-small is-flex-grow-1"
                style={{
                  border: 'none',
                  borderRadius: '6px',
                  height: '30px',
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

              {/* Botón Bimestral */}
              <button
                type="button"
                onClick={() => setViewMode('bimestral')}
                className="button is-small is-flex-grow-1"
                style={{
                  border: 'none',
                  borderRadius: '6px',
                  height: '30px',
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

          <hr style={{ margin: '0.1rem 0', backgroundColor: isDarkMode ? '#334155' : '#f1f5f9', height: '1px' }} />

          {/* 2. Mostrar fines de semana */}
          <label 
            className="checkbox is-flex is-align-items-center mb-0" 
            style={{ 
              gap: '0.6rem', 
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <input 
              type="checkbox" 
              checked={showWeekends} 
              onChange={(e) => setShowWeekends(e.target.checked)} 
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#0f766e' }}
            />
            <span style={{ fontSize: 'var(--font-size-label)', fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#334155' }}>
              Mostrar fines de semana
            </span>
          </label>

          <hr style={{ margin: '0.1rem 0', backgroundColor: isDarkMode ? '#334155' : '#f1f5f9', height: '1px' }} />

          {/* 3. Mostrar panel 40-60 (Funcionarios AEAT) */}
          <label 
            className="checkbox is-flex is-align-items-start mb-0" 
            style={{ 
              gap: '0.6rem', 
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <input 
              type="checkbox" 
              checked={show4060} 
              className="mt-1"
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#0f766e' }}
              onChange={(e) => setShow4060(e.target.checked)} 
            />
            <div className="is-flex is-flex-direction-column" style={{ minWidth: 0, lineHeight: 1.25 }}>
              <span style={{ fontSize: 'var(--font-size-label)', fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#334155' }}>
                Mostrar panel 40-60
              </span>
              <span style={{ fontSize: 'var(--font-size-subtext)', color: isDarkMode ? '#94a3b8' : '#64748b', marginTop: '1px', fontWeight: 500 }}>
                (Funcionarios AEAT)
              </span>
            </div>
          </label>

          <hr style={{ margin: '0.1rem 0', backgroundColor: isDarkMode ? '#334155' : '#f1f5f9', height: '1px' }} />

          {/* 4. Comportamiento Presenciales */}
          <div>
            <div className="mb-1.5 is-flex is-align-items-center" style={{ gap: '0.45rem' }}>
              <span style={{ fontSize: 'var(--font-size-subtext)', fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                Comportamiento Presenciales
              </span>
              <button
                type="button"
                className="button is-ghost is-small p-0 is-flex is-align-items-center"
                onClick={() => onOpenHowItWorks('help-comportamiento-presenciales')}
                title="Ver explicación en la Ayuda"
                style={{ 
                  height: 'auto', 
                  color: isDarkMode ? '#38bdf8' : '#0284c7', 
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none'
                }}
              >
                <Info size={14} />
              </button>
            </div>
            <div className="is-flex is-flex-direction-column" style={{ gap: '0.3rem' }}>
              <label 
                className="radio is-flex is-align-items-center mb-0 px-2 py-1.5" 
                style={{ 
                  cursor: 'pointer',
                  borderRadius: '6px',
                  backgroundColor: !presencialFirstMonday 
                    ? (isDarkMode ? 'rgba(15, 118, 110, 0.2)' : '#f0fdfa') 
                    : 'transparent',
                  border: !presencialFirstMonday
                    ? (isDarkMode ? '1px solid #0d9488' : '1px solid #99f6e4')
                    : '1px solid transparent',
                  transition: 'all 0.15s ease',
                  gap: '0.45rem'
                }}
                title="Aplica a todos los días correspondientes dentro de cada mes"
              >
                <input 
                  type="radio" 
                  name="presencialMode_desktop" 
                  checked={!presencialFirstMonday} 
                  onChange={() => onPresencialFirstMondayToggle(false)} 
                  style={{ margin: 0, cursor: 'pointer', accentColor: '#0f766e' }}
                />
                <span style={{ fontSize: 'var(--font-size-label)', color: isDarkMode ? '#f1f5f9' : '#1e293b', fontWeight: !presencialFirstMonday ? 600 : 500 }}>
                  Siempre día seleccionado
                </span>
              </label>

              <label 
                className="radio is-flex is-align-items-center mb-0 px-2 py-1.5" 
                style={{ 
                  cursor: 'pointer',
                  borderRadius: '6px',
                  backgroundColor: presencialFirstMonday 
                    ? (isDarkMode ? 'rgba(15, 118, 110, 0.2)' : '#f0fdfa') 
                    : 'transparent',
                  border: presencialFirstMonday
                    ? (isDarkMode ? '1px solid #0d9488' : '1px solid #99f6e4')
                    : '1px solid transparent',
                  transition: 'all 0.15s ease',
                  gap: '0.45rem'
                }}
                title="El patrón presencial entra en vigor a partir del primer lunes del mes"
              >
                <input 
                  type="radio" 
                  name="presencialMode_desktop" 
                  checked={presencialFirstMonday} 
                  onChange={() => onPresencialFirstMondayToggle(true)} 
                  style={{ margin: 0, cursor: 'pointer', accentColor: '#0f766e' }}
                />
                <span style={{ fontSize: 'var(--font-size-label)', color: isDarkMode ? '#f1f5f9' : '#1e293b', fontWeight: presencialFirstMonday ? 600 : 500 }}>
                  Desde el 1<sup>er</sup> lunes del mes
                </span>
              </label>
            </div>
          </div>
        </div>


        {/* 5. Exportar e Importar datos */}
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

        {/* 7. Acciones finales: Limpiar calendario (20%, min-width = alto) y Guardar PNG (resto) */}
        {showClearConfirm ? (
          <div 
            className="notification is-danger is-light p-2 mb-0" 
            style={{ 
              width: '100%', 
              border: '1px solid #f87171', 
              borderRadius: '10px',
              marginTop: 'auto'
            }}
          >
            <p className="has-text-weight-bold has-text-centered mb-1.5" style={{ fontSize: '11.5px', lineHeight: 1.2 }}>
              ¿Borrar todo el calendario?
            </p>
            <div className="buttons are-small mb-0 is-flex" style={{ gap: '6px' }}>
              <button 
                type="button"
                onClick={onClearCalendar} 
                className="button is-danger is-fullwidth mb-0"
                style={{ borderRadius: '6px', fontSize: '11px', fontWeight: 700, height: '28px' }}
              >
                Sí, borrar
              </button>
              <button 
                type="button"
                onClick={() => setShowClearConfirm(false)} 
                className="button is-light is-fullwidth mb-0"
                style={{ borderRadius: '6px', fontSize: '11px', height: '28px' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="is-flex is-align-items-center" style={{ gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
            <button 
              type="button"
              onClick={() => setShowClearConfirm(true)} 
              className="button"
              style={{ 
                width: '20%',
                minWidth: '42px',
                height: '42px',
                borderRadius: '10px', 
                border: isDarkMode ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid #fecdd3', 
                color: '#e11d48', 
                backgroundColor: isDarkMode ? 'rgba(225, 29, 72, 0.14)' : '#fff1f2', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
              title="Limpiar calendario (borrar todas las selecciones)"
            >
              <Trash2 size={18} strokeWidth={2.2} />
            </button>

            <button 
              type="button"
              onClick={onExportPNG}
              className="button"
              style={{ 
                flex: 1,
                minWidth: 0,
                height: '42px',
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, #0e7490 0%, #0f766e 100%)', 
                color: '#ffffff', 
                border: 'none', 
                boxShadow: '0 4px 14px rgba(15, 118, 110, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                gap: '0.45rem',
                padding: '4px 8px',
                transition: 'all 0.15s ease'
              }}
              title="Guardar imagen PNG"
            >
              <Download size={18} strokeWidth={2.4} />
              <span style={{ fontSize: 'var(--font-size-label)', fontWeight: 800, lineHeight: 1.2 }}>Guardar PNG</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
