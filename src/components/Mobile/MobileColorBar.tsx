import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { LegendColorItem } from '../../types/calendar.ts';
import './MobileColorBar.css';

interface MobileColorBarProps {
  legendColors: LegendColorItem[];
  activeColorId: string;
  setActiveColorId: (id: string) => void;
  onOpenColorSettings: (item: LegendColorItem) => void;
  onOpenAddColorModal: () => void;
  isDarkMode: boolean;
}

export const MobileColorBar: React.FC<MobileColorBarProps> = ({
  legendColors,
  activeColorId,
  setActiveColorId,
  onOpenColorSettings,
  onOpenAddColorModal,
  isDarkMode
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const longPressTimerRef = useRef<any>(null);
  const isLongPressRef = useRef(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  };

  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 120);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [legendColors]);

  const scrollByDirection = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 320);
    }
  };

  const handleTouchStart = (item: LegendColorItem) => {
    isLongPressRef.current = false;
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      onOpenColorSettings(item);
    }, 450);
  };

  const handleTouchEnd = (item: LegendColorItem) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (!isLongPressRef.current) {
      setActiveColorId(item.id);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleSquareClick = (item: LegendColorItem) => {
    if (isLongPressRef.current) return;
    setActiveColorId(item.id);
  };

  return (
    <div 
      className="box p-3 mb-0"
      style={{
        border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1',
        borderRadius: '14px',
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        width: '100%'
      }}
    >
      <div className="is-flex is-align-items-center is-justify-content-space-between mb-2.5">
        <h3 
          className="is-uppercase has-text-weight-bold table-header" 
          style={{ color: isDarkMode ? '#94a3b8' : '#475569', letterSpacing: '0.05em', fontSize: 'var(--font-size-header-table)' }}
        >
          🎨 Colores y Etiquetas
        </h3>
        <span className="subtext-helper" style={{ fontSize: 'var(--font-size-subtext)', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
          mantén pulsado para opciones
        </span>
      </div>

      {/* Fila fija de botones: Track scrolleable con fondo diferenciado + 4º botón "+" fijo al final */}
      <div 
        className="is-flex is-align-items-stretch"
        style={{ 
          gap: '8px', 
          width: '100%',
          position: 'relative'
        }}
      >
        {/* Pista / Carril scrolleable con fondo diferenciado y sombreado */}
        <div 
          style={{ 
            flex: 1, 
            minWidth: 0, 
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9',
            borderRadius: '14px',
            padding: '5px',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            boxShadow: isDarkMode ? 'inset 0 2px 4px rgba(0,0,0,0.5)' : 'inset 0 1px 3px rgba(0,0,0,0.06)'
          }}
        >
          {/* Botón izquierdo */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); scrollByDirection('left'); }}
              onTouchStart={(e) => { e.stopPropagation(); }}
              onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); scrollByDirection('left'); }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '32px',
                background: isDarkMode 
                  ? 'linear-gradient(to left, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.85) 35%, #0f172a 100%)' 
                  : 'linear-gradient(to left, rgba(241, 245, 249, 0) 0%, rgba(241, 245, 249, 0.9) 35%, #f1f5f9 100%)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '4px',
                zIndex: 20,
                color: isDarkMode ? '#5eead4' : '#0f766e',
                cursor: 'pointer',
                borderRadius: '12px 0 0 12px',
                boxShadow: isDarkMode ? '4px 0 10px rgba(0,0,0,0.4)' : '3px 0 8px rgba(0,0,0,0.06)'
              }}
              aria-label="Ver etiquetas anteriores"
              title="Ver etiquetas anteriores"
            >
              <div 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}
              >
                <ChevronLeft size={16} strokeWidth={3} />
              </div>
            </button>
          )}

          {/* Botón derecho */}
          {canScrollRight && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); scrollByDirection('right'); }}
              onTouchStart={(e) => { e.stopPropagation(); }}
              onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); scrollByDirection('right'); }}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '32px',
                background: isDarkMode 
                  ? 'linear-gradient(to right, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.85) 35%, #0f172a 100%)' 
                  : 'linear-gradient(to right, rgba(241, 245, 249, 0) 0%, rgba(241, 245, 249, 0.9) 35%, #f1f5f9 100%)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '4px',
                zIndex: 20,
                color: isDarkMode ? '#5eead4' : '#0f766e',
                cursor: 'pointer',
                borderRadius: '0 12px 12px 0',
                boxShadow: isDarkMode ? '-4px 0 10px rgba(0,0,0,0.4)' : '-3px 0 8px rgba(0,0,0,0.06)'
              }}
              aria-label="Ver más etiquetas"
              title="Ver más etiquetas"
            >
              <div 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}
              >
                <ChevronRight size={16} strokeWidth={3} />
              </div>
            </button>
          )}

          {/* Área desplazable horizontalmente */}
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="mobile-color-scroll"
            style={{ width: '100%', padding: 0 }}
          >
            {legendColors.map((item) => {
              const isActive = activeColorId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSquareClick(item)}
                  onTouchStart={() => handleTouchStart(item)}
                  onTouchEnd={() => handleTouchEnd(item)}
                  onTouchMove={handleTouchMove}
                  onContextMenu={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation();
                    onOpenColorSettings(item); 
                  }}
                  className="mobile-color-square"
                  style={{
                    flex: '0 0 calc((100% - 16px) / 3)',
                    width: 'calc((100% - 16px) / 3)',
                    backgroundColor: isActive 
                      ? (isDarkMode ? 'rgba(15, 118, 110, 0.3)' : '#ffffff') 
                      : (isDarkMode ? '#151e2b' : '#ffffff'),
                    border: isActive
                      ? (isDarkMode ? '2.5px solid #2dd4bf' : '2.5px solid #0f766e')
                      : (isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1'),
                    boxShadow: isActive 
                      ? '0 0 0 2px rgba(15, 118, 110, 0.25)' 
                      : '0 1px 3px rgba(0,0,0,0.06)'
                  }}
                  title={`${item.fullName || item.label} (Mantén pulsado para opciones)`}
                >
                  {/* Muestra de color */}
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      backgroundColor: item.color,
                      border: '1.5px solid rgba(0,0,0,0.2)',
                      display: 'block',
                      marginBottom: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  
                  {/* Nombre de la etiqueta */}
                  <span
                    className="subtext-helper"
                    style={{
                      fontSize: 'var(--font-size-subtext)',
                      fontWeight: isActive ? 'var(--font-weight-extrabold)' : 'var(--font-weight-semibold)',
                      color: isDarkMode ? '#e2e8f0' : '#1e293b',
                      lineHeight: 1.2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-word'
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4º posición: Botón "+" fijo fuera del scroll horizontal */}
        <div
          onClick={onOpenAddColorModal}
          className="mobile-color-square"
          style={{
            flex: '0 0 calc((100% - 24px) / 4)',
            width: 'calc((100% - 24px) / 4)',
            backgroundColor: isDarkMode ? '#151e2b' : '#ffffff',
            border: isDarkMode ? '1.5px dashed #475569' : '1.5px dashed #94a3b8',
            borderRadius: '14px',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Añadir nueva etiqueta"
        >
          <div 
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: isDarkMode ? 'rgba(15, 118, 110, 0.25)' : '#e0f2fe',
              color: isDarkMode ? '#5eead4' : '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '3px'
            }}
          >
            <Plus size={16} strokeWidth={2.6} />
          </div>
          <span
            className="subtext-helper"
            style={{
              fontSize: 'var(--font-size-subtext)',
              fontWeight: 'var(--font-weight-bold)',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              lineHeight: 1.15
            }}
          >
            Añadir
          </span>
        </div>

      </div>
    </div>
  );
};

