import React from 'react';

interface ImportConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

export const ImportConfirmModal: React.FC<ImportConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isDarkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal is-active" style={{ zIndex: 1050 }}>
      <div className="modal-background" onClick={onCancel} style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }} />
      <div 
        className="modal-card" 
        style={{ 
          maxWidth: '460px', 
          width: '92%', 
          borderRadius: '14px', 
          overflow: 'hidden', 
          boxShadow: '0 10px 35px rgba(0, 0, 0, 0.35)' 
        }}
      >
        <header 
          className="modal-card-head py-3 px-4" 
          style={{ 
            backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', 
            borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0' 
          }}
        >
          <p className="modal-card-title has-text-weight-bold mb-0 is-flex is-align-items-center" style={{ gap: '0.5rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontSize: '1.1rem' }}>
            <span className="icon" style={{ color: '#f59e0b' }}>⚠️</span>
            <span>Importar datos</span>
          </p>
          <button 
            type="button" 
            className="delete is-medium" 
            aria-label="close" 
            onClick={onCancel} 
          />
        </header>

        <section 
          className="modal-card-body p-4" 
          style={{ 
            backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
            color: isDarkMode ? '#e2e8f0' : '#334155' 
          }}
        >
          <div 
            className="box p-3 mb-0" 
            style={{ 
              backgroundColor: isDarkMode ? '#1e293b' : '#fffbeb', 
              border: isDarkMode ? '1px solid #475569' : '1px solid #fde68a',
              borderRadius: '10px'
            }}
          >
            <p className="mb-0" style={{ fontSize: '1rem', lineHeight: 1.5, color: isDarkMode ? '#fde68a' : '#92400e', fontWeight: 500 }}>
              Los últimos cambios guardados en el navegador se sustituirán por los datos a cargar, ¿está seguro?
            </p>
          </div>
        </section>

        <footer 
          className="modal-card-foot is-justify-content-flex-end py-3 px-4" 
          style={{ 
            backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', 
            borderTop: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            gap: '0.5rem'
          }}
        >
          <button 
            type="button" 
            className="button is-small" 
            onClick={onCancel}
            style={{ borderRadius: '8px', fontWeight: 600, height: '36px', fontSize: '13.5px' }}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className="button is-small" 
            onClick={onConfirm}
            style={{ 
              borderRadius: '8px', 
              fontWeight: 700,
              height: '36px',
              fontSize: '13.5px',
              background: 'linear-gradient(135deg, #0e7490 0%, #0f766e 100%)',
              color: '#ffffff',
              border: 'none',
              boxShadow: '0 2px 6px rgba(15, 118, 110, 0.3)'
            }}
          >
            Sí, importar
          </button>
        </footer>
      </div>
    </div>
  );
};

