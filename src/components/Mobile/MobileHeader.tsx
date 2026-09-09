import React from 'react';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  onOpenMenu: () => void;
  isDarkMode: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onOpenMenu,
  isDarkMode
}) => {
  return (
    <div 
      className="box mb-0 p-3 is-flex is-align-items-center is-justify-content-space-between"
      style={{
        border: isDarkMode ? '1.5px solid #334155' : '1.5px solid #cbd5e1',
        borderRadius: '12px',
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.04)'
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <h1 
          className="title mb-0 app-title" 
          style={{ 
            color: isDarkMode ? '#f8fafc' : '#0f172a', 
            fontWeight: 'var(--font-weight-extrabold)', 
            fontSize: 'var(--font-size-title-app)', 
            letterSpacing: '-0.01em',
            lineHeight: 1.2
          }}
        >
          Propuesta Vacaciones
        </h1>
        <p 
          style={{ 
            color: isDarkMode ? '#94a3b8' : '#64748b', 
            fontSize: 'var(--font-size-note)', 
            fontWeight: 'var(--font-weight-medium)',
            margin: '3px 0 0 0',
            lineHeight: 1.3
          }}
        >
          Organiza y planifica tu calendario laboral
        </p>
      </div>

      {/* Botón de Menú Lateral (Hamburguesa) */}
      <button
        onClick={onOpenMenu}
        className="button is-small ml-2"
        style={{
          borderRadius: '10px',
          border: isDarkMode ? '1.5px solid #0d9488' : '1.5px solid #0f766e',
          backgroundColor: isDarkMode ? 'rgba(15, 118, 110, 0.25)' : '#f0fdfa',
          color: isDarkMode ? '#5eead4' : '#0f766e',
          width: '40px',
          height: '40px',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        title="Abrir menú de opciones"
      >
        <Menu size={22} strokeWidth={2.4} />
      </button>
    </div>
  );
};

