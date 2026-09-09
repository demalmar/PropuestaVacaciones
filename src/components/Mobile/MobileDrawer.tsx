import React, { useState } from 'react';
import { X, Moon, Sun, Info, Download, Upload, Trash2, SlidersHorizontal } from 'lucide-react';
import './MobileDrawer.css';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenHowItWorks: () => void;
  showWeekends: boolean;
  setShowWeekends: (show: boolean) => void;
  show4060: boolean;
  setShow4060: (show: boolean) => void;
  presencialFirstMonday: boolean;
  onPresencialFirstMondayToggle: (val: boolean) => void;
  onExportData: () => void;
  onTriggerImport: () => void;
  onClearCalendar: () => void;
  showClearConfirm: boolean;
  setShowClearConfirm: (show: boolean) => void;
  onExportPNG: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  toggleDarkMode,
  onOpenHowItWorks,
  showWeekends,
  setShowWeekends,
  show4060,
  setShow4060,
  presencialFirstMonday,
  onPresencialFirstMondayToggle,
  onExportData,
  onTriggerImport,
  onClearCalendar,
  showClearConfirm,
  setShowClearConfirm,
  onExportPNG
}) => {
  const [isMenuClosing, setIsMenuClosing] = useState(false);

  if (!isOpen && !isMenuClosing) return null;

  const handleClose = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      onClose();
      setIsMenuClosing(false);
    }, 210);
  };

  return (
    <>
      <div 
        className={`mobile-drawer-overlay ${isMenuClosing ? 'is-closing' : ''}`}
        onClick={handleClose} 
      />
      <div className={`mobile-drawer p-4 ${isMenuClosing ? 'is-closing' : ''}`} style={{ backgroundColor: isDarkMode ? '#151e2b' : '#ffffff' }}>
        {/* Cabecera del Drawer */}
        <div className="is-flex is-align-items-center is-justify-content-space-between pb-3 mb-3" style={{ borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0' }}>
          <div className="is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
            <span style={{ fontSize: '20px' }}>⚙️</span>
            <h2 className="title is-6 mb-0 panel-title" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 'var(--font-weight-extrabold)', fontSize: 'var(--font-size-title-panel)' }}>
              Menú de Opciones
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="button is-small"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isDarkMode ? '#334155' : '#f1f5f9',
              color: isDarkMode ? '#e2e8f0' : '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.15s ease'
            }}
            aria-label="Cerrar menú"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Opciones del menú lateral */}
        <div className="is-flex is-flex-direction-column" style={{ gap: '0.85rem' }}>
          
          {/* 1. Selector Modo Día / Modo Noche */}
          <div 
            onClick={toggleDarkMode}
            className="is-flex is-align-items-center is-justify-content-space-between p-3 mb-0" 
            style={{ 
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
              backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
              borderRadius: '12px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            title="Alternar entre modo día y modo noche"
          >
            <div className="is-flex is-align-items-center" style={{ gap: '0.65rem' }}>
              {isDarkMode ? (
                <Moon size={18} color="#a5b4fc" fill="#818cf8" />
              ) : (
                <Sun size={18} color="#0284c7" fill="#38bdf8" />
              )}
              <span className="has-text-weight-bold" style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontSize: 'var(--font-size-label)' }}>
                {isDarkMode ? 'Modo noche activo' : 'Modo día activo'}
              </span>
            </div>

            {/* Switch deslizante al final */}
            <div 
              style={{
                width: '44px',
                height: '24px',
                borderRadius: '9999px',
                backgroundColor: isDarkMode ? '#0f766e' : '#cbd5e1',
                position: 'relative',
                transition: 'background-color 0.2s ease',
                flexShrink: 0
              }}
            >
              <div 
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: isDarkMode ? '23px' : '3px',
                  transition: 'left 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)'
                }}
              />
            </div>
          </div>

          {/* 2. ¿Cómo funciona? */}
          <button 
            onClick={() => { onOpenHowItWorks(); handleClose(); }}
            className="button is-fullwidth mb-0"
            style={{ 
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-button)',
              borderRadius: '10px',
              border: isDarkMode ? '1px solid #0d9488' : '1px solid #99f6e4',
              backgroundColor: isDarkMode ? 'rgba(15, 118, 110, 0.18)' : '#f0fdfa',
              color: isDarkMode ? '#5eead4' : '#0f766e',
              height: '44px'
            }}
          >
            <span className="icon is-small"><Info size={16} /></span>
            <span>¿Cómo funciona?</span>
          </button>

          {/* Panel Unificado: Opciones */}
          <div 
            className="box p-3 mb-0" 
            style={{ 
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
              boxShadow: 'none',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            {/* Cabecera del Panel Opciones */}
            <div className="is-flex is-align-items-center" style={{ gap: '0.5rem', borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              <SlidersHorizontal size={16} style={{ color: isDarkMode ? '#0d9488' : '#0f766e' }} strokeWidth={2.4} />
              <span className="has-text-weight-bold section-header" style={{ color: isDarkMode ? '#e2e8f0' : '#334155', fontSize: 'var(--font-size-header-section)' }}>
                Opciones
              </span>
            </div>

            {/* 1. Mostrar fines de semana */}
            <label 
              className="checkbox is-flex is-align-items-center mb-0" 
              style={{ gap: '0.65rem', cursor: 'pointer' }}
            >
              <input 
                type="checkbox" 
                checked={showWeekends} 
                onChange={(e) => setShowWeekends(e.target.checked)} 
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0f766e' }}
              />
              <span className="has-text-weight-bold" style={{ color: isDarkMode ? '#e2e8f0' : '#334155', fontSize: 'var(--font-size-label)' }}>
                Mostrar fines de semana
              </span>
            </label>

            <hr style={{ margin: '0.1rem 0', backgroundColor: isDarkMode ? '#334155' : '#f1f5f9', height: '1px' }} />

            {/* 2. Checkbox Mostrar panel 40-60 */}
            <label 
              className="checkbox is-flex is-align-items-start mb-0" 
              style={{ gap: '0.65rem', cursor: 'pointer' }}
            >
              <input 
                type="checkbox" 
                checked={show4060} 
                className="mt-1"
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0f766e' }}
                onChange={(e) => setShow4060(e.target.checked)} 
              />
              <div>
                <span className="has-text-weight-bold is-block section-header" style={{ color: isDarkMode ? '#e2e8f0' : '#334155', lineHeight: 1.25, fontSize: 'var(--font-size-header-section)' }}>
                  Mostrar panel 40-60
                </span>
                <span className="is-block subtext-helper" style={{ fontSize: 'var(--font-size-subtext)', fontWeight: 'var(--font-weight-medium)', color: isDarkMode ? '#94a3b8' : '#64748b', marginTop: '2px', lineHeight: 1.25 }}>
                  (Funcionarios AEAT)
                </span>
              </div>
            </label>

            <hr style={{ margin: '0.1rem 0', backgroundColor: isDarkMode ? '#334155' : '#f1f5f9', height: '1px' }} />

            {/* 3. Comportamiento Presenciales */}
            <div>
              <div className="mb-2">
                <span className="has-text-weight-bold is-block section-header" style={{ color: isDarkMode ? '#e2e8f0' : '#334155', lineHeight: 1.25, fontSize: 'var(--font-size-header-section)' }}>
                  Comportamiento Presenciales
                </span>
              </div>
              <div className="is-flex is-flex-direction-column" style={{ gap: '0.45rem' }}>
                <label 
                  className="radio is-flex is-align-items-center mb-0 px-2 py-2" 
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
                    gap: '0.65rem'
                  }}
                >
                  <input 
                    type="radio" 
                    name="presencialMode_mobile" 
                    checked={!presencialFirstMonday} 
                    onChange={() => onPresencialFirstMondayToggle(false)} 
                    style={{ margin: 0, width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0f766e' }}
                  />
                  <span className="section-header" style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', fontSize: 'var(--font-size-header-section)', fontWeight: !presencialFirstMonday ? 600 : 500 }}>
                    Siempre día seleccionado
                  </span>
                </label>

                <label 
                  className="radio is-flex is-align-items-center mb-0 px-2 py-2" 
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
                    gap: '0.65rem'
                  }}
                >
                  <input 
                    type="radio" 
                    name="presencialMode_mobile" 
                    checked={presencialFirstMonday} 
                    onChange={() => onPresencialFirstMondayToggle(true)} 
                    style={{ margin: 0, width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0f766e' }}
                  />
                  <span className="section-header" style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', fontSize: 'var(--font-size-header-section)', fontWeight: presencialFirstMonday ? 600 : 500 }}>
                    Desde el 1<sup>er</sup> lunes del mes
                  </span>
                </label>
              </div>
            </div>
          </div>


          <hr style={{ margin: '0.5rem 0', backgroundColor: isDarkMode ? '#334155' : '#e2e8f0' }} />

          {/* Botones de Exportar e Importar datos */}
          <div className="is-flex mb-2" style={{ gap: '0.45rem', width: '100%' }}>
            <button 
              type="button"
              onClick={() => { onExportData(); handleClose(); }}
              className="button"
              style={{ 
                flex: 1,
                minWidth: 0,
                height: '56px',
                maxHeight: '56px',
                minHeight: '56px',
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
                cursor: 'pointer'
              }}
              title="Exportar todos los calendarios y datos a un archivo JSON"
            >
              <Download size={19} strokeWidth={2.2} style={{ color: isDarkMode ? '#38bdf8' : '#0284c7' }} />
              <span className="subtext-helper" style={{ fontSize: 'var(--font-size-subtext)', fontWeight: 'var(--font-weight-bold)', lineHeight: 1.15, textAlign: 'center' }}>
                Exportar datos
              </span>
            </button>

            <button 
              type="button"
              onClick={() => { handleClose(); setTimeout(() => onTriggerImport(), 220); }}
              className="button"
              style={{ 
                flex: 1,
                minWidth: 0,
                height: '56px',
                maxHeight: '56px',
                minHeight: '56px',
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
                cursor: 'pointer'
              }}
              title="Importar calendarios y datos desde un archivo JSON"
            >
              <Upload size={19} strokeWidth={2.2} style={{ color: isDarkMode ? '#34d399' : '#059669' }} />
              <span className="subtext-helper" style={{ fontSize: 'var(--font-size-subtext)', fontWeight: 'var(--font-weight-bold)', lineHeight: 1.15, textAlign: 'center' }}>
                Importar datos
              </span>
            </button>
          </div>

          {/* 6. Limpiar calendario */}
          <div>
            {showClearConfirm ? (
              <div className="notification is-danger is-light p-3 mb-0" style={{ border: '1px solid #f87171', borderRadius: '10px' }}>
                <p className="is-size-7 has-text-weight-bold has-text-centered mb-2">¿Borrar todo lo marcado?</p>
                <div className="buttons are-small mb-0 is-flex">
                  <button 
                    onClick={() => { onClearCalendar(); setShowClearConfirm(false); handleClose(); }} 
                    className="button is-danger is-fullwidth"
                    style={{ borderRadius: '6px' }}
                  >
                    Sí, borrar
                  </button>
                  <button 
                    onClick={() => setShowClearConfirm(false)} 
                    className="button is-light is-fullwidth"
                    style={{ borderRadius: '6px' }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowClearConfirm(true)} 
                className="button is-fullwidth"
                style={{ 
                  borderRadius: '10px', 
                  border: '1px solid #fecdd3', 
                  color: '#e11d48', 
                  backgroundColor: isDarkMode ? 'rgba(225, 29, 72, 0.12)' : '#fff1f2', 
                  fontWeight: 600,
                  height: '42px'
                }}
              >
                <span className="icon is-small"><Trash2 size={16} /></span>
                <span>Limpiar calendario</span>
              </button>
            )}
          </div>

          {/* 7. Botón Guardar PNG */}
          <button 
            onClick={() => { onExportPNG(); handleClose(); }}
            className="button is-fullwidth"
            style={{ 
              height: '44px',
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #0e7490 0%, #0f766e 100%)', 
              color: '#ffffff', 
              border: 'none', 
              boxShadow: '0 4px 14px rgba(15, 118, 110, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '0.25rem',
              gap: '0.5rem',
              padding: '4px 8px'
            }}
            title="Guardar imagen PNG"
          >
            <Download size={18} strokeWidth={2.3} />
            <span style={{ fontWeight: 800 }}>Guardar PNG</span>
          </button>

        </div>
      </div>
    </>
  );
};

