import React, { useState } from 'react';

interface AddColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColor: (label: string, color: string) => void;
  isDarkMode: boolean;
}

export const AddColorModal: React.FC<AddColorModalProps> = ({
  isOpen,
  onClose,
  onAddColor,
  isDarkMode
}) => {
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#cbd5e1');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!label.trim()) return;
    onAddColor(label.trim(), color);
    setLabel('');
    setColor('#cbd5e1');
    onClose();
  };

  return (
    <div className="modal is-active" style={{ zIndex: 1150 }}>
      <div className="modal-background" onClick={onClose} />
      <div className="modal-card" style={{ maxWidth: '330px', width: '92%', margin: 'auto' }}>
        <div 
          className="modal-card-body" 
          style={{ 
            borderRadius: '14px', 
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            border: isDarkMode ? '1.5px solid #334155' : '1.5px solid #cbd5e1',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            padding: '12px 16px'
          }}
        >
          {/* Cabecera */}
          <div className="is-flex is-align-items-center is-justify-content-space-between pb-2 mb-2" style={{ borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0' }}>
            <div className="is-flex is-align-items-center" style={{ gap: '0.45rem' }}>
              <span style={{ fontSize: '16px' }}>🖍️</span>
              <h6 className="title is-6 mb-0" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800, fontSize: '14px' }}>
                Añadir marcador
              </h6>
            </div>
            <button 
              onClick={onClose} 
              className="delete is-small"
              aria-label="Cerrar"
            />
          </div>

          {/* Formulario */}
          <div className="is-flex is-flex-direction-column" style={{ gap: '0.65rem' }}>
            <div>
              <label className="label is-size-7 mb-1" style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontSize: '12px' }}>
                Nombre del marcador:
              </label>
              <input 
                type="text" 
                value={label} 
                onChange={(e) => setLabel(e.target.value)} 
                placeholder="Ej: Formación, Guardia..." 
                className="input is-small" 
                style={{ height: '30px', borderRadius: '6px', fontSize: '13px' }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }} 
              />
            </div>

            <div>
              <label className="label is-size-7 mb-1" style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontSize: '12px' }}>
                Color del marcador:
              </label>
              <div className="is-flex is-align-items-center" style={{ gap: '0.6rem' }}>
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  style={{ width: '42px', height: '28px', padding: '1px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  title="Seleccionar color" 
                />
                <span className="font-monospace" style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: '12px' }}>
                  {color.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="buttons is-flex is-justify-content-flex-end mt-1 mb-0" style={{ gap: '0.45rem' }}>
              <button 
                onClick={onClose}
                className="button is-small is-light"
                style={{ borderRadius: '6px', height: '28px', fontSize: '12.5px', padding: '0 12px' }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={!label.trim()}
                className="button is-small" 
                style={{ 
                  background: 'linear-gradient(135deg, #0e7490, #0f766e)', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '6px',
                  fontWeight: 700,
                  padding: '0 14px',
                  height: '28px',
                  fontSize: '12.5px'
                }}
              >
                Crear etiqueta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

