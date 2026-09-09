import React, { useState } from 'react';
import { Sun, Moon, Trash2, Plus } from 'lucide-react';
import { LegendColorItem } from '../../types/calendar.ts';
import './ColorPalette.css';

interface ColorPaletteProps {
  legendColors: LegendColorItem[];
  activeColorId: string;
  setActiveColorId: (id: string) => void;
  onDeleteColor: (id: string) => void;
  onAddColor: (label: string, color: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  legendColors,
  activeColorId,
  setActiveColorId,
  onDeleteColor,
  onAddColor,
  isDarkMode,
  toggleDarkMode,
  className = 'column is-3-desktop is-4-tablet',
  style
}) => {
  const [newLabel, setNewLabel] = useState('');
  const [newColorHex, setNewColorHex] = useState('#cbd5e1');

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    onAddColor(newLabel.trim(), newColorHex);
    setNewLabel('');
  };

  return (
    <div className={className} style={style}>
      {/* Contenedor del Título Propuesta Vacaciones con switch vertical integrado a la derecha */}
      <div 
        className="box mb-3 p-0 is-flex is-align-items-stretch is-justify-content-space-between" 
        style={{ 
          border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', 
          borderRadius: '12px', 
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          boxShadow: isDarkMode ? 'none' : '0 4px 16px -2px rgba(30, 41, 59, 0.05)',
          overflow: 'hidden',
          minHeight: '52px'
        }}
      >
        {/* Lado izquierdo: Título y subtítulo */}
        <div className="py-2 px-3 is-flex is-flex-direction-column is-justify-content-center" style={{ minWidth: 0, flex: 1 }}>
          <h1 
            className="title mb-0" 
            style={{ 
              color: isDarkMode ? '#f8fafc' : '#0f172a', 
              fontWeight: 800, 
              fontSize: 'var(--font-size-title-app)', 
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              lineHeight: 1.2
            }}
          >
            Propuesta Vacaciones
          </h1>
          <span 
            style={{ 
              color: isDarkMode ? '#94a3b8' : '#64748b', 
              fontSize: 'var(--font-size-subtext)', 
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.3,
              marginTop: '3px'
            }}
          >
            Organiza y planifica tu calendario laboral
          </span>
        </div>

        {/* Lado derecho: Switch vertical (alto total, 2 mitades: arriba Sol/Día, abajo Luna/Noche) */}
        <div 
          className="is-flex is-flex-direction-column"
          style={{
            width: '38px',
            borderLeft: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            backgroundColor: isDarkMode ? '#17202e' : '#f8fafc',
            flexShrink: 0
          }}
        >
          {/* Mitad superior: Sol / Día */}
          <div 
            onClick={() => isDarkMode && toggleDarkMode()}
            className="is-flex is-align-items-center is-justify-content-center"
            style={{
              flex: 1,
              cursor: 'pointer',
              backgroundColor: !isDarkMode ? '#e0f2fe' : 'transparent',
              borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
              transition: 'all 0.15s ease'
            }}
            title="Activar modo diurno"
          >
            <Sun 
              size={14} 
              color={!isDarkMode ? '#0284c7' : '#64748b'} 
              fill={!isDarkMode ? '#38bdf8' : 'none'} 
              strokeWidth={!isDarkMode ? 2.5 : 2}
            />
          </div>

          {/* Mitad inferior: Luna / Noche */}
          <div 
            onClick={() => !isDarkMode && toggleDarkMode()}
            className="is-flex is-align-items-center is-justify-content-center"
            style={{
              flex: 1,
              cursor: 'pointer',
              backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              transition: 'all 0.15s ease'
            }}
            title="Activar modo nocturno"
          >
            <Moon 
              size={13} 
              color={isDarkMode ? '#a5b4fc' : '#94a3b8'} 
              fill={isDarkMode ? '#818cf8' : 'none'} 
              strokeWidth={isDarkMode ? 2.5 : 2}
            />
          </div>
        </div>
      </div>

      <div 
        className="box p-3 is-flex is-flex-direction-column" 
        style={{ 
          border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
          borderRadius: '14px', 
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          boxShadow: isDarkMode ? 'none' : '0 4px 20px -2px rgba(30, 41, 59, 0.05)'
        }}
      >
        {/* Cabecera Colores */}
        <div className="pb-2 mb-2" style={{ borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #edf2f7' }}>
          <h3 className="is-uppercase has-text-weight-bold" style={{ color: isDarkMode ? '#94a3b8' : '#475569', letterSpacing: '0.05em', fontSize: 'var(--font-size-header-table)' }}>
            🖍️ Marcadores
          </h3>
        </div>

        {/* Lista compacta de colores */}
        <div className="custom-scrollbar pr-1 mb-2.5" style={{ maxHeight: '380px', overflowY: 'auto' }}>
          {legendColors.map((item) => {
            const isCustom = !['1', '2', '3', '4'].includes(item.id);
            const isActive = activeColorId === item.id;
            const itemBorder = isActive 
              ? (isDarkMode ? '2px solid #2dd4bf' : '2px solid #0f766e')
              : (isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0');
            const itemBg = isActive
              ? (isDarkMode ? 'rgba(15, 118, 110, 0.22)' : '#f0fdfa')
              : (isDarkMode ? '#151e2b' : '#ffffff');

            return (
              <div 
                key={item.id} 
                onClick={() => setActiveColorId(item.id)}
                className="box mb-1 is-flex is-align-items-center is-justify-content-space-between"
                style={{ 
                  cursor: 'pointer', 
                  border: itemBorder, 
                  backgroundColor: itemBg, 
                  boxShadow: isActive ? '0 0 0 1.5px rgba(15, 118, 110, 0.2)' : 'none',
                  borderRadius: '8px',
                  padding: '5px 8px',
                  minHeight: '36px',
                  transition: 'all 0.12s ease',
                  gap: '0.4rem'
                }}
              >
                {/* Izquierda: Muestra de color + Nombre en una sola línea */}
                <div className="is-flex is-align-items-center is-flex-grow-1 is-clipped" style={{ gap: '0.5rem', minWidth: 0 }}>
                  <span 
                    style={{ 
                      width: '18px', 
                      height: '18px', 
                      borderRadius: '5px', 
                      backgroundColor: item.color, 
                      border: '1px solid rgba(0,0,0,0.18)', 
                      display: 'inline-block', 
                      flexShrink: 0 
                    }} 
                  />
                  <span 
                    className="has-text-weight-bold is-clipped" 
                    title={item.fullName || item.label}
                    style={{ 
                      color: isDarkMode ? '#f1f5f9' : '#1e293b', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      fontSize: 'var(--font-size-label)' 
                    }}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Derecha: Papelera para eliminar personalizadas */}
                {isCustom && (
                  <div className="is-flex is-align-items-center" style={{ gap: '0.25rem', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onDeleteColor(item.id)}
                      className="button is-small is-ghost p-1"
                      style={{ height: '24px', width: '24px', color: '#e11d48', border: 'none' }}
                      title="Eliminar este color"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Añadir nuevo color - Integrado con el mismo ancho que el resto de etiquetas */}
          <div 
            className="box mt-1.5 mb-1" 
            style={{ 
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
              boxShadow: 'none', 
              backgroundColor: isDarkMode ? '#141d2b' : '#f8fafc',
              borderRadius: '8px',
              padding: '4px 6px',
              minHeight: '36px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div className="field has-addons mb-0" style={{ width: '100%' }}>
              <div className="control">
                <input 
                  type="color" 
                  value={newColorHex} 
                  onChange={(e) => setNewColorHex(e.target.value)} 
                  className="input is-small" 
                  style={{ 
                    width: '32px', 
                    height: '28px', 
                    padding: '2px', 
                    cursor: 'pointer', 
                    borderRadius: '6px 0 0 6px',
                    border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1',
                    borderRight: 'none'
                  }} 
                  title="Seleccionar color" 
                />
              </div>
              <div className="control is-expanded">
                <input 
                  type="text" 
                  value={newLabel} 
                  onChange={(e) => setNewLabel(e.target.value)} 
                  placeholder="Añadir marcador..." 
                  className="input is-small" 
                  style={{ 
                    height: '28px', 
                    borderRadius: 0, 
                    fontSize: 'var(--font-size-subtext)',
                    borderColor: isDarkMode ? '#334155' : '#cbd5e1'
                  }} 
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()} 
                />
              </div>
              <div className="control">
                <button 
                  onClick={handleAdd} 
                  className="button is-small" 
                  style={{ 
                    height: '28px', 
                    background: 'linear-gradient(135deg, #0e7490, #0f766e)', 
                    color: '#ffffff', 
                    border: 'none', 
                    borderRadius: '0 6px 6px 0',
                    padding: '0 10px'
                  }}
                  title="Añadir marcador"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
