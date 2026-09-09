import React from 'react';
import { Download } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  includeBalance: boolean;
  setIncludeBalance: (val: boolean) => void;
  include4060: boolean;
  setInclude4060: (val: boolean) => void;
  isDarkMode: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  includeBalance,
  setIncludeBalance,
  include4060,
  setInclude4060,
  isDarkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal is-active" style={{ zIndex: 1150 }}>
      <div className="modal-background" onClick={onClose} />
      <div className="modal-card" style={{ maxWidth: '340px', width: '92%', margin: 'auto' }}>
        <div 
          className="modal-card-body" 
          style={{ 
            borderRadius: '14px', 
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            border: isDarkMode ? '1.5px solid #334155' : '1.5px solid #cbd5e1',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            padding: '16px 18px'
          }}
        >
          {/* Cabecera */}
          <div className="is-flex is-align-items-center is-justify-content-space-between pb-2 mb-3" style={{ borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0' }}>
            <div className="is-flex is-align-items-center" style={{ gap: '0.45rem' }}>
              <Download size={17} style={{ color: isDarkMode ? '#5eead4' : '#0f766e' }} />
              <h6 className="title is-6 mb-0" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800, fontSize: '15px' }}>
                Guardar PNG
              </h6>
            </div>
            <button 
              onClick={onClose} 
              className="delete is-small"
              aria-label="Cerrar"
            />
          </div>

          {/* Pregunta */}
          <p className="mb-2.5" style={{ fontSize: 'var(--font-size-note)', fontWeight: 600, color: isDarkMode ? '#cbd5e1' : '#334155' }}>
            ¿Qué quieres capturar?
          </p>

          {/* Opciones */}
          <div 
            className="mb-4" 
            style={{ 
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            {/* 1. Calendario (marcado siempre) */}
            <div 
              style={{
                backgroundColor: isDarkMode ? '#141d2b' : '#f8fafc',
                padding: '10px 12px',
                borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                opacity: 0.9
              }}
            >
              <label className="checkbox is-flex is-align-items-center" style={{ gap: '0.6rem', cursor: 'default', width: '100%' }}>
                <input 
                  type="checkbox" 
                  checked={true} 
                  disabled 
                  style={{ width: '16px', height: '16px', accentColor: '#0f766e', cursor: 'not-allowed', flexShrink: 0 }}
                />
                <div className="is-flex is-align-items-center is-justify-content-space-between is-flex-grow-1">
                  <span className="has-text-weight-bold" style={{ fontSize: 'var(--font-size-label)', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                    Calendario
                  </span>
                  <span style={{ fontSize: '11px', color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                    
                  </span>
                </div>
              </label>
            </div>

            {/* 2. Balance (opcional, marcado por defecto) */}
            <div 
              onClick={() => setIncludeBalance(!includeBalance)}
              style={{
                backgroundColor: includeBalance 
                  ? (isDarkMode ? 'rgba(15, 118, 110, 0.15)' : '#f0fdfa')
                  : (isDarkMode ? '#141d2b' : '#ffffff'),
                padding: '10px 12px',
                borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
            >
              <label className="checkbox is-flex is-align-items-center" style={{ gap: '0.6rem', cursor: 'pointer', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  checked={includeBalance} 
                  onChange={(e) => setIncludeBalance(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#0f766e', cursor: 'pointer', flexShrink: 0 }}
                />
                <div className="is-flex is-align-items-center is-justify-content-space-between is-flex-grow-1" onClick={() => setIncludeBalance(!includeBalance)}>
                  <span className="has-text-weight-bold" style={{ fontSize: 'var(--font-size-label)', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                    Balance
                  </span>
                  <span style={{ fontSize: '11px', color: includeBalance ? (isDarkMode ? '#5eead4' : '#0f766e') : (isDarkMode ? '#94a3b8' : '#64748b'), fontWeight: 600 }}>
                    {includeBalance ? 'Incluido' : 'Omitido'}
                  </span>
                </div>
              </label>
            </div>

            {/* 3. Proporción 40-60 (opcional, marcado por defecto) */}
            <div 
              onClick={() => setInclude4060(!include4060)}
              style={{
                backgroundColor: include4060 
                  ? (isDarkMode ? 'rgba(15, 118, 110, 0.15)' : '#f0fdfa')
                  : (isDarkMode ? '#141d2b' : '#ffffff'),
                padding: '10px 12px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
            >
              <label className="checkbox is-flex is-align-items-center" style={{ gap: '0.6rem', cursor: 'pointer', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  checked={include4060} 
                  onChange={(e) => setInclude4060(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#0f766e', cursor: 'pointer', flexShrink: 0 }}
                />
                <div className="is-flex is-align-items-center is-justify-content-space-between is-flex-grow-1" onClick={() => setInclude4060(!include4060)}>
                  <span className="has-text-weight-bold" style={{ fontSize: 'var(--font-size-label)', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                    40-60
                  </span>
                  <span style={{ fontSize: '11px', color: include4060 ? (isDarkMode ? '#5eead4' : '#0f766e') : (isDarkMode ? '#94a3b8' : '#64748b'), fontWeight: 600 }}>
                    {include4060 ? 'Incluido' : 'Omitido'}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="buttons is-flex is-justify-content-flex-end mt-1 mb-0" style={{ gap: '0.45rem' }}>
            <button 
              onClick={onClose}
              className="button is-small is-light"
              style={{ borderRadius: '6px', height: '30px', fontSize: '12.5px', padding: '0 12px' }}
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm} 
              className="button is-small" 
              style={{ 
                background: 'linear-gradient(135deg, #0e7490, #0f766e)', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '6px',
                fontWeight: 700,
                padding: '0 14px',
                height: '30px',
                fontSize: '12.5px'
              }}
            >
              Descargar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
