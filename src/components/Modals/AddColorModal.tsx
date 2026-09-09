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
          {/* Cabecera */}
          <div className="is-flex is-align-items-center is-justify-content-space-between pb-3 mb-3" style={{ borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0' }}>
            <div className="is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
              <span style={{ fontSize: '18px' }}>🎨</span>
              <h3 className="title is-6 mb-0" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>
                Añadir nuevo color
              </h3>
            </div>
            <button 
              onClick={onClose} 
              className="delete is-medium"
              aria-label="Cerrar"
            />
          </div>

          {/* Formulario */}
          <div className="is-flex is-flex-direction-column" style={{ gap: '1rem' }}>
            <div>
              <label className="label is-size-7 mb-1.5" style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
                Nombre de la etiqueta:
              </label>
              <input 
                type="text" 
                value={label} 
                onChange={(e) => setLabel(e.target.value)} 
                placeholder="Ej: Formación, Guardia..." 
                className="input is-small" 
                style={{ height: '38px', borderRadius: '8px', fontSize: '13.5px' }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }} 
              />
            </div>

            <div>
              <label className="label is-size-7 mb-1.5" style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
                Color de la etiqueta:
              </label>
              <div className="is-flex is-align-items-center" style={{ gap: '0.75rem' }}>
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  style={{ width: '48px', height: '36px', padding: '2px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  title="Seleccionar color" 
                />
                <span className="font-monospace" style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: '13px' }}>
                  {color.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="buttons is-flex is-justify-content-flex-end mt-2 mb-0" style={{ gap: '0.5rem' }}>
              <button 
                onClick={onClose}
                className="button is-small is-light"
                style={{ borderRadius: '8px', height: '36px', fontSize: '13px' }}
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
                  borderRadius: '8px',
                  fontWeight: 700,
                  padding: '0 16px',
                  height: '36px',
                  fontSize: '13.5px'
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

