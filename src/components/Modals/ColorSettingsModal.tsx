import React from 'react';
import { Trash2 } from 'lucide-react';
import { LegendColorItem } from '../../types/calendar.ts';

interface ColorSettingsModalProps {
  item: LegendColorItem | null;
  onClose: () => void;
  onUpdateColor: (id: string, color: string) => void;
  onDeleteColor: (id: string) => void;
  isDarkMode: boolean;
}

export const ColorSettingsModal: React.FC<ColorSettingsModalProps> = ({
  item,
  onClose,
  onUpdateColor,
  onDeleteColor,
  isDarkMode
}) => {
  if (!item) return null;

  const isBuiltIn = ['1', '2', '3', '4'].includes(item.id);

  return (
    <div className="modal is-active" style={{ zIndex: 1100 }}>
      <div className="modal-background" onClick={onClose} />
      <div className="modal-card" style={{ maxWidth: '340px', width: '92%', margin: 'auto' }}>
        <div 
          className="modal-card-body p-4" 
          style={{ 
            borderRadius: '16px', 
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            border: isDarkMode ? '1.5px solid #334155' : '1.5px solid #cbd5e1',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}
        >
          {/* Cabecera del modal */}
          <div className="is-flex is-align-items-center is-justify-content-space-between pb-3 mb-3" style={{ borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0' }}>
            <div className="is-flex is-align-items-center" style={{ gap: '0.65rem' }}>
              <span 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '6px', 
                  backgroundColor: item.color, 
                  border: '1.5px solid rgba(0,0,0,0.2)', 
                  display: 'inline-block' 
                }} 
              />
              <h3 className="title is-6 mb-0" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800, fontSize: '1.05rem' }}>
                {item.fullName || item.label}
              </h3>
            </div>
            <button 
              onClick={onClose} 
              className="delete is-medium"
              aria-label="Cerrar"
            />
          </div>

          {/* Opciones según tipo de etiqueta */}
          <div className="is-flex is-flex-direction-column" style={{ gap: '1rem' }}>
            
            {/* 1. Selector de color editable para cualquier etiqueta */}
            <div 
              className="p-3" 
              style={{ 
                backgroundColor: isDarkMode ? '#141d2b' : '#f8fafc',
                borderRadius: '12px',
                border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'
              }}
            >
              <div className="is-flex is-align-items-center is-justify-content-space-between">
                <div>
                  <span className="has-text-weight-bold is-block" style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontSize: '13.5px' }}>
                    Color de la etiqueta
                  </span>
                  <span style={{ fontSize: '12.5px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    Pulsa para cambiar de color
                  </span>
                </div>

                <div className="is-flex is-align-items-center" style={{ gap: '0.65rem' }}>
                  <input 
                    type="color" 
                    value={item.color} 
                    onChange={(e) => onUpdateColor(item.id, e.target.value)}
                    style={{ 
                      width: '44px', 
                      height: '34px', 
                      padding: '2px', 
                      cursor: 'pointer', 
                      borderRadius: '8px', 
                      border: isDarkMode ? '1px solid #475569' : '1px solid #cbd5e1' 
                    }}
                    title="Cambiar color" 
                  />
                  <span className="font-monospace" style={{ fontWeight: 700, fontSize: '13px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    {item.color.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Nota para etiqueta de Festivos ('4') */}
            {item.id === '4' && (
              <p className="mb-0 has-text-centered" style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '13px' }}>
                Esta es la etiqueta oficial de días festivos.
              </p>
            )}

            {/* 2. Si es una etiqueta personalizada (!['1', '2', '3', '4']) */}
            {!isBuiltIn && (
              <div 
                className="p-3" 
                style={{ 
                  backgroundColor: isDarkMode ? '#141d2b' : '#fff1f2',
                  borderRadius: '12px',
                  border: isDarkMode ? '1px solid #7f1d1d' : '1px solid #fecdd3'
                }}
              >
                <p className="mb-3" style={{ color: isDarkMode ? '#fda4af' : '#991b1b', fontSize: '13px', lineHeight: 1.4 }}>
                  Esta es una etiqueta creada por ti. Al eliminarla se desmarcarán todos sus días del calendario.
                </p>
                <button 
                  onClick={() => {
                    onDeleteColor(item.id);
                    onClose();
                  }}
                  className="button is-danger is-small is-fullwidth"
                  style={{ borderRadius: '8px', fontWeight: 700, gap: '0.4rem', height: '34px', fontSize: '13px' }}
                >
                  <Trash2 size={14} />
                  <span>Eliminar etiqueta</span>
                </button>
              </div>
            )}

            {/* Botón Aceptar / Cerrar */}
            <button 
              onClick={onClose}
              className="button is-fullwidth"
              style={{ 
                borderRadius: '10px',
                backgroundColor: isDarkMode ? '#0d9488' : '#0f766e',
                color: '#ffffff',
                fontWeight: 700,
                border: 'none',
                height: '40px',
                fontSize: '14px'
              }}
            >
              Listo
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

