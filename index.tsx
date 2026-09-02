import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Download, Trash2, Info, X, Moon, Sun } from 'lucide-react';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS_OF_WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// Funciones de ayuda
const getFirstDayOfMonth = (year, month) => {
  let day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Convertir a formato donde 0=Lunes, 6=Domingo
};

const dateToString = (year, month, day) => `${year}-${month + 1}-${day}`;

const CalendarApp = () => {
  // Estado para la fecha actual (mes izquierdo)
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  
  const exportRef = useRef(null);
  
  // Estado para confirmación de limpieza
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Estado para mostrar/ocultar modal "¿Cómo funciona?"
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Estado para el modo nocturno (con Local Storage)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('vacationApp_darkMode');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return false;
  });

  useEffect(() => {
    localStorage.setItem('vacationApp_darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Cargar librera para exportar a PNG dinmicamente
  useEffect(() => {
    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleExportPNG = async () => {
    if (!exportRef.current) return;
    if (!window.html2canvas) {
      alert("La herramienta para exportar está cargando. Inténtalo en un momento.");
      return;
    }
    
    try {
        // Capturar el contenedor limpio en alta resolución (el que está oculto)
        const canvas = await window.html2canvas(exportRef.current, { 
            backgroundColor: '#ffffff', 
            scale: 2 
        });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'Propuesta Vacaciones.png';
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error("Error al exportar PNG:", error);
    }
  };

  // Estado para mostrar fines de semana
  const [showWeekends, setShowWeekends] = useState(true);
  
  // Estado para los colores de leyenda definidos por el usuario (Con Local Storage)
  const [legendColors, setLegendColors] = useState(() => {
    try {
        const saved = localStorage.getItem('vacationApp_legendColors');
        if (saved) return JSON.parse(saved);
    } catch (e) { console.error("Error cargando colores"); }
    return [
      { id: '1', label: 'Festivo', fullName: 'Festivo', color: '#fca5a5' },
      { id: '2', label: 'Vac. por periodo', fullName: 'Vacaciones por periodo', color: '#fef08a' }, 
      { id: '3', label: 'Asuntos Propios', fullName: 'Asuntos Propios', color: '#bae6fd' }, 
      { id: '4', label: 'Vac. días independientes', fullName: 'Vacaciones días independientes', color: '#bbf7d0' }, 
    ];
  });
  
  const [activeColorId, setActiveColorId] = useState('1');
  
  // Estado para los das coloreados y selecciones L-V (Con Local Storage)
  const [coloredDays, setColoredDays] = useState(() => {
    try {
        const saved = localStorage.getItem('vacationApp_coloredDays');
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });
  
  const [weeklySelections, setWeeklySelections] = useState(() => {
    try {
        const saved = localStorage.getItem('vacationApp_weeklySelections');
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  // Estado para definir si el presencial cambia el primer lunes del mes o es fijo
  const [presencialFirstMonday, setPresencialFirstMonday] = useState(() => {
    try {
      const saved = localStorage.getItem('vacationApp_presencialFirstMonday');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return true; // Por defecto activo (como estaba originalmente)
  });

  // Estado para selecciones fijas de presencial (cuando presencialFirstMonday es false)
  const [fixedWeeklySelections, setFixedWeeklySelections] = useState(() => {
    try {
      const saved = localStorage.getItem('vacationApp_fixedWeeklySelections');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  // Estado para los límites (Con Local Storage)
  const [limits, setLimits] = useState(() => {
    try {
        const saved = localStorage.getItem('vacationApp_limits');
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      '2': { enabled: false, max: 0 },
      '3': { enabled: false, max: 0 },
      '4': { enabled: false, max: 0 },
    };
  });

  // Efectos para guardar en Local Storage cada vez que cambien los datos
  useEffect(() => { localStorage.setItem('vacationApp_legendColors', JSON.stringify(legendColors)); }, [legendColors]);
  useEffect(() => { localStorage.setItem('vacationApp_coloredDays', JSON.stringify(coloredDays)); }, [coloredDays]);
  useEffect(() => { localStorage.setItem('vacationApp_weeklySelections', JSON.stringify(weeklySelections)); }, [weeklySelections]);
  useEffect(() => { localStorage.setItem('vacationApp_fixedWeeklySelections', JSON.stringify(fixedWeeklySelections)); }, [fixedWeeklySelections]);
  useEffect(() => { localStorage.setItem('vacationApp_presencialFirstMonday', JSON.stringify(presencialFirstMonday)); }, [presencialFirstMonday]);
  useEffect(() => { localStorage.setItem('vacationApp_limits', JSON.stringify(limits)); }, [limits]);

  const handleLimitToggle = (id, enabled) => {
    setLimits(prev => ({ ...prev, [id]: { ...prev[id], enabled } }));
  };

  const handleLimitChange = (id, max) => {
    setLimits(prev => ({ ...prev, [id]: { ...prev[id], max } }));
  };

  const [newLabel, setNewLabel] = useState('');
  const [newColorHex, setNewColorHex] = useState('#cbd5e1');

  const handleAddColor = () => {
    if (!newLabel.trim()) return;
    const newId = Date.now().toString();
    setLegendColors(prev => [...prev, { id: newId, label: newLabel, color: newColorHex }]);
    setNewLabel('');
    setActiveColorId(newId); // Selecciona el nuevo color automticamente
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (year, month, day) => {
    const dateStr = dateToString(year, month, day);
    setColoredDays(prev => {
      const newColoredDays = { ...prev };
      // Si ya tiene el color activo, lo quitamos (toggle)
      if (newColoredDays[dateStr] === activeColorId) {
        delete newColoredDays[dateStr];
        return newColoredDays;
      } 
      
      // Comprobar lmites si es un color especial
      if (['2', '3', '4'].includes(activeColorId) && limits[activeColorId]?.enabled) {
         const currentUsage = Object.values(prev).filter(id => id === activeColorId).length;
         if (currentUsage >= limits[activeColorId].max) {
             return prev; // Lmite alcanzado, no se aade el color
         }
      }
      
      newColoredDays[dateStr] = activeColorId;
      return newColoredDays;
    });
  };

  const handleHeaderDayClick = (year, month, dayIndex) => {
    if (presencialFirstMonday) {
      const monthKey = `${year}-${month}`;
      setWeeklySelections(prev => {
        const currentMonthSelections = prev[monthKey] || {};
        const isCurrentlySelected = currentMonthSelections[dayIndex];
        return {
          ...prev,
          [monthKey]: {
            ...currentMonthSelections,
            [dayIndex]: !isCurrentlySelected
          }
        };
      });
    } else {
      // Modo fijo: se seleccionan siempre esas columnas en todo el calendario
      setFixedWeeklySelections(prev => {
        const isCurrentlySelected = prev[dayIndex];
        return {
          ...prev,
          [dayIndex]: !isCurrentlySelected
        };
      });
    }
  };

  const renderMonth = (targetYear, targetMonth, isExport = false) => {
    const startDate = new Date(targetYear, targetMonth, 1);
    const startDayIndex = getFirstDayOfMonth(targetYear, targetMonth); // 0=Lunes
    
    // Calcular el último día del mes para saber exactamente cuántas semanas dibujar
    const endDate = new Date(targetYear, targetMonth + 1, 0);
    const endDayIndex = endDate.getDay() === 0 ? 6 : endDate.getDay() - 1; 
    const totalDaysToRender = startDayIndex + endDate.getDate() + (6 - endDayIndex);

    // Retroceder al Lunes de la primera semana para empezar a dibujar
    const gridStartDate = new Date(startDate);
    gridStartDate.setDate(startDate.getDate() - startDayIndex);
    
    let days = [];
    
    // Generar los días
    for (let i = 0; i < totalDaysToRender; i++) {
        const currentLoopDate = new Date(gridStartDate);
        currentLoopDate.setDate(gridStartDate.getDate() + i);
        
        const cYear = currentLoopDate.getFullYear();
        const cMonth = currentLoopDate.getMonth();
        const cDay = currentLoopDate.getDate();
        const dateStr = dateToString(cYear, cMonth, cDay);
        const dayIndex = i % 7; // 0=Lunes, 6=Domingo
        
        // Buscamos a qué mes pertenece el LUNES de esta semana
        const mondayDate = new Date(currentLoopDate);
        mondayDate.setDate(currentLoopDate.getDate() - dayIndex);
        const owningMonthKey = `${mondayDate.getFullYear()}-${mondayDate.getMonth()}`;
        
        days.push({
            day: cDay,
            isCurrentMonth: cMonth === targetMonth && cYear === targetYear,
            dateStr: dateStr,
            dayIndex: dayIndex,
            owningMonthKey: owningMonthKey
        });
    }

    const monthKey = `${targetYear}-${targetMonth}`;
    const isHeaderDaySelected = (dayIdx) => {
      return presencialFirstMonday 
        ? Boolean(weeklySelections[monthKey]?.[dayIdx])
        : Boolean(fixedWeeklySelections[dayIdx]);
    };
    
    // Filtrar días y columnas si los findes están ocultos
    const visibleDays = showWeekends ? days : days.filter(d => d.dayIndex < 5);
    const cols = showWeekends ? 7 : 5;

    // En exportación siempre forzamos tema diurno claro para descarga PNG impecable
    const useDarkMode = isDarkMode && !isExport;

    return (
      <div 
        className="box p-0 mb-0" 
        style={{ 
          border: useDarkMode ? '1px solid #334155' : '1px solid #93c5fd', 
          borderRadius: '12px', 
          overflow: 'hidden', 
          minWidth: showWeekends ? '220px' : '170px',
          width: '100%',
          backgroundColor: useDarkMode ? '#17202e' : '#ffffff',
          boxShadow: useDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 20px -2px rgba(37,99,235,0.08)'
        }}
      >
        {/* Cabecera del Mes */}
        <div 
          className="has-text-weight-bold has-text-centered py-2.5 is-size-6" 
          style={{ 
            borderBottom: useDarkMode ? '1px solid #334155' : '1px solid #bfdbfe',
            background: useDarkMode 
              ? 'linear-gradient(135deg, #1e293b 0%, #293548 100%)' 
              : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            color: useDarkMode ? '#93c5fd' : '#1e40af',
            letterSpacing: '0.02em'
          }}
        >
          {MONTHS[targetMonth]} {targetYear}
        </div>
        
        {/* Días de la semana (Cabecera interactiva) */}
        <div 
          className={`calendar-grid-${cols}`} 
          style={{ 
            borderBottom: useDarkMode ? '1px solid #334155' : '1px solid #bfdbfe', 
            backgroundColor: useDarkMode ? '#131b26' : '#f8fafc' 
          }}
        >
          {DAYS_OF_WEEK.map((day, index) => {
            if (!showWeekends && index >= 5) return null;
            const isSelected = isHeaderDaySelected(index);
            const isWeekend = index >= 5;
            
            let headerBg = 'transparent';
            if (isSelected) {
              headerBg = useDarkMode ? 'rgba(59, 130, 246, 0.28)' : '#bfdbfe';
            }

            let headerColor = isWeekend 
              ? (useDarkMode ? '#fb7185' : '#e11d48') 
              : (useDarkMode ? '#93c5fd' : '#2563eb');

            return (
                <div 
                    key={day} 
                    onClick={!isExport ? () => handleHeaderDayClick(targetYear, targetMonth, index) : undefined}
                    className="has-text-centered py-1.5 is-size-7 has-text-weight-bold"
                    style={{ 
                      borderRight: index === cols - 1 ? 'none' : (useDarkMode ? '1px solid #293548' : '1px solid #e2e8f0'),
                      cursor: !isExport ? 'pointer' : 'default',
                      userSelect: 'none',
                      backgroundColor: headerBg,
                      color: headerColor,
                      transition: 'background-color 0.15s ease'
                    }}
                    title={presencialFirstMonday ? `Seleccionar todos los ${day} de este mes` : `Seleccionar todos los ${day} del calendario`}
                >
                  {day}
                </div>
            );
          })}
        </div>
        
        {/* Cuadrícula de días */}
        <div className={`calendar-grid-${cols}`} style={{ backgroundColor: useDarkMode ? '#131b26' : '#f8fafc' }}>
          {visibleDays.map((dayData, index) => {
            
            // Si es un día fuera del mes (sobrantes antes del 1 o después del 30/31), casilla vacía / inexistente
            if (!dayData.isCurrentMonth) {
              return (
                <div 
                  key={`${targetYear}-${targetMonth}-${index}`}
                  className="calendar-day-cell is-empty"
                  style={{
                    backgroundColor: useDarkMode ? '#111620' : '#f1f5f9',
                    borderColor: useDarkMode ? '#1e2837' : '#e2e8f0',
                    borderRightWidth: (index % cols === cols - 1) ? '0' : '1px',
                    borderRightStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomStyle: 'solid',
                    cursor: 'default',
                    opacity: 0.3
                  }}
                />
              );
            }

            // --- DETERMINAR COLOR DE FONDO ---
            const colorId = coloredDays[dayData.dateStr];
            const assignedColor = legendColors.find(c => c.id === colorId)?.color;
            let finalBgColor = assignedColor;
            
            // Si es fin de semana del mes actual y no tiene color manual, hereda el color de "Festivo" (ID '1')
            if (!assignedColor && dayData.dayIndex >= 5 && dayData.isCurrentMonth) {
                finalBgColor = legendColors.find(c => c.id === '1')?.color;
            }

            // Color de fondo: en modo nocturno si no tiene color es oscuro (#1c2635), en diurno es blanco (#ffffff)
            let cellBg = finalBgColor ? finalBgColor : (useDarkMode ? '#1c2635' : '#ffffff');
            
            // Color del texto
            let textColor = '#1e293b';
            if (finalBgColor) {
              textColor = '#0f172a'; // Oscuro legible sobre colores pastel
            } else if (useDarkMode) {
              textColor = dayData.dayIndex >= 5 ? '#fda4af' : '#e2e8f0';
            } else {
              textColor = dayData.dayIndex >= 5 ? '#e11d48' : '#1e293b';
            }
            
            // --- LÓGICA DE SELECCIÓN POR COLUMNA (PRESENCIAL) ---
            const isColumnSelected = presencialFirstMonday
              ? weeklySelections[dayData.owningMonthKey]?.[dayData.dayIndex]
              : Boolean(fixedWeeklySelections[dayData.dayIndex]);

            return (
              <div 
                key={`${targetYear}-${targetMonth}-${index}`}
                onClick={!isExport ? () => handleDayClick(dayData.dateStr.split('-')[0], parseInt(dayData.dateStr.split('-')[1])-1, parseInt(dayData.dateStr.split('-')[2])) : undefined}
                className={`calendar-day-cell ${isColumnSelected ? 'is-presencial' : ''}`}
                style={{
                  backgroundColor: cellBg,
                  color: textColor,
                  fontWeight: (dayData.dayIndex >= 5 || finalBgColor) ? 700 : 600,
                  borderColor: useDarkMode ? '#283445' : '#e2e8f0',
                  borderRightWidth: (index % cols === cols - 1) ? '0' : '1px',
                  borderRightStyle: 'solid',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                }}
              >
                {/* Indicadores visuales para "Días Presenciales" */}
                {isColumnSelected && (
                    <>
                        <span className="presencial-dot" style={{ backgroundColor: useDarkMode ? '#60a5fa' : '#2563eb' }} />
                        <span className="presencial-bar" style={{ backgroundColor: useDarkMode ? '#60a5fa' : '#2563eb' }} />
                    </>
                )}
                
                <span style={{ position: 'relative', zIndex: 1, fontSize: '0.84rem' }}>{dayData.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const leftYear = currentDate.getFullYear();
  const leftMonth = currentDate.getMonth();
  
  // Calcular el mes siguiente para el calendario de la derecha
  const rightDate = new Date(leftYear, leftMonth + 1, 1);
  const rightYear = rightDate.getFullYear();
  const rightMonth = rightDate.getMonth();

  // Calcular elementos para la leyenda exportable (Solo colores/selecciones usados)
  const usedColorIds = new Set(Object.values(coloredDays));
  const usedLegends = legendColors.filter(color => usedColorIds.has(color.id));
  const hasWeeklySelections = presencialFirstMonday
    ? Object.values(weeklySelections).some(monthObj => 
        Object.values(monthObj).some(isSelected => isSelected)
      )
    : Object.values(fixedWeeklySelections).some(isSelected => isSelected);

  return (
    <section className="section py-4 px-3" style={{ minHeight: '100vh', backgroundColor: isDarkMode ? '#0b0f17' : '#f8fafc', transition: 'background-color 0.25s ease' }}>
      
      {/* Contenedor relativo para posicionar el switch de modo nocturno pegado a la derecha sin alterar el centrado */}
      <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto' }}>

        {/* Widget Modo Nocturno (Switch Sol / Luna) pegado a la derecha del contenedor sin desplazar el centro */}
        <div className="dark-mode-widget-container">
          <div 
            className="box p-2.5 is-flex is-flex-direction-column is-align-items-center" 
            style={{ 
              borderRadius: '16px', 
              border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1',
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 8px 24px -4px rgba(30, 41, 59, 0.12)',
              minWidth: '76px'
            }}
          >
            {/* Toggle Switch Sol / Luna */}
            <button
              onClick={toggleDarkMode}
              type="button"
              aria-label={isDarkMode ? 'Cambiar a modo diurno' : 'Cambiar a modo nocturno'}
              title={isDarkMode ? 'Cambiar a modo diurno' : 'Cambiar a modo nocturno'}
              style={{
                position: 'relative',
                width: '56px',
                height: '30px',
                borderRadius: '9999px',
                padding: '3px',
                border: 'none',
                cursor: 'pointer',
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' 
                  : 'linear-gradient(135deg, #38bdf8 0%, #f59e0b 100%)',
                boxShadow: isDarkMode 
                  ? 'inset 0 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(99, 102, 241, 0.25)' 
                  : 'inset 0 2px 4px rgba(0,0,0,0.15), 0 0 10px rgba(245, 158, 11, 0.25)',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Knob con icono Sol / Luna */}
              <div
                className="theme-switch-knob"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isDarkMode ? 'translateX(26px)' : 'translateX(0px)'
                }}
              >
                {isDarkMode ? (
                  <Moon size={14} color="#f59e0b" fill="#f59e0b" />
                ) : (
                  <Sun size={14} color="#ea580c" fill="#f59e0b" />
                )}
              </div>
            </button>
            <span 
              className="is-size-7 has-text-weight-bold mt-1.5 select-none" 
              style={{ fontSize: '10px', letterSpacing: '0.04em', color: isDarkMode ? '#94a3b8' : '#475569' }}
            >
              {isDarkMode ? 'NOCHE' : 'DÍA'}
            </span>
          </div>
        </div>

        {/* Contenedor principal de Propuesta Vacaciones (permanece exactamente centrado) */}
        <div className="container" style={{ maxWidth: '1280px' }}>

          {/* Barra superior con Título y Botones */}
          <div 
            className="box is-flex is-justify-content-space-between is-align-items-center mb-4 px-5 py-3.5" 
            style={{ 
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
              borderRadius: '14px', 
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              boxShadow: isDarkMode ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 20px -2px rgba(30, 41, 59, 0.06)'
            }}
          >
            <div className="is-flex is-align-items-center" style={{ gap: '0.75rem' }}>
              <div 
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '10px', 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '18px', 
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  color: '#ffffff'
                }}
              >
                🏖️
              </div>
              <div>
                <h1 className="title is-4 mb-0" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  Propuesta Vacaciones
                </h1>
                <span className="is-size-7" style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '11.5px', fontWeight: 500 }}>
                  Organiza y planifica tu calendario laboral
                </span>
              </div>
            </div>

            <div className="buttons mb-0">
              <button 
                  onClick={() => setShowHowItWorks(true)}
                  className="button is-small"
                  style={{ 
                    fontWeight: 600,
                    borderRadius: '8px',
                    border: isDarkMode ? '1px solid #3b82f6' : '1px solid #bae6fd',
                    backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#e0f2fe',
                    color: isDarkMode ? '#93c5fd' : '#0284c7'
                  }}
                  title="Ver instrucciones"
              >
                  <span className="icon is-small"><Info size={16} /></span>
                  <span>¿Cómo funciona?</span>
              </button>
              <button 
                  onClick={handleExportPNG}
                  className="button is-small"
                  style={{ 
                    fontWeight: 600,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                    color: '#ffffff',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                  }}
              >
                  <span className="icon is-small"><Download size={16} /></span>
                  <span>Descargar PNG</span>
              </button>
            </div>
          </div>

          {/* Fila Principal: Panel Leyenda a la izquierda | Panel Calendarios en el centro con Acciones a su derecha */}
          <div className="columns is-variable is-3 is-desktop">

            {/* 1. Contenedor Propio Izquierdo: Leyenda de Colores + Añadir nuevo color */}
            <div className="column is-3-desktop is-4-tablet">
              <div 
                className="box p-4 is-flex is-flex-direction-column" 
                style={{ 
                  border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
                  borderRadius: '14px', 
                  height: '100%', 
                  backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                  boxShadow: isDarkMode ? 'none' : '0 4px 20px -2px rgba(30, 41, 59, 0.05)'
                }}
              >
                <div className="is-flex is-justify-content-space-between is-align-items-center pb-2.5 mb-3" style={{ borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #edf2f7' }}>
                  <h3 className="is-size-7 is-uppercase has-text-weight-bold" style={{ color: isDarkMode ? '#94a3b8' : '#475569', letterSpacing: '0.05em' }}>
                    🎨 Leyenda de Colores
                  </h3>
                  <span className="tag is-rounded is-small" style={{ backgroundColor: isDarkMode ? '#334155' : '#e0f2fe', color: isDarkMode ? '#93c5fd' : '#0369a1', fontWeight: 700 }}>
                    {legendColors.length} tipos
                  </span>
                </div>

                {/* Contenedor con scroll interno para la lista de etiquetas */}
                <div className="custom-scrollbar pr-1 mb-3" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {legendColors.map((item) => {
                    const isSpecial = ['2', '3', '4'].includes(item.id);
                    const limitConfig = limits[item.id];
                    const usage = Object.values(coloredDays).filter(id => id === item.id).length;
                    const remaining = (limitConfig?.max || 0) - usage;

                    const isActive = activeColorId === item.id;
                    const itemBorder = isActive 
                      ? (isDarkMode ? '2px solid #60a5fa' : '2px solid #2563eb')
                      : (isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0');
                    const itemBg = isActive
                      ? (isDarkMode ? 'rgba(59, 130, 246, 0.18)' : '#eff6ff')
                      : (isDarkMode ? '#151e2b' : '#ffffff');

                    return (
                      <div 
                        key={item.id} 
                        className="box p-2.5 mb-2"
                        style={{ 
                          cursor: 'pointer', 
                          border: itemBorder, 
                          backgroundColor: itemBg, 
                          boxShadow: isActive ? '0 0 0 2px rgba(37,99,235,0.15)' : 'none',
                          borderRadius: '10px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div 
                          title={item.fullName || item.label} 
                          onClick={() => setActiveColorId(item.id)} 
                          className="is-flex is-align-items-center mb-1"
                          style={{ gap: '0.6rem' }}
                        >
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
                          <span className="is-size-7 has-text-weight-bold is-flex-grow-1 is-clipped" style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                            {item.label}
                          </span>
                        </div>
                        {isSpecial && (
                          <div className="is-flex is-align-items-center is-justify-content-space-between pt-1.5 mt-1" style={{ borderTop: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9' }}>
                            <label className="checkbox is-size-7 has-text-grey is-flex is-align-items-center" style={{ gap: '0.35rem' }}>
                              <input 
                                type="checkbox" 
                                checked={limitConfig?.enabled || false} 
                                onChange={(e) => handleLimitToggle(item.id, e.target.checked)} 
                              />
                              <span style={{ fontSize: '11px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>Limitar</span>
                            </label>
                            {limitConfig?.enabled && (
                              <div className="is-flex is-align-items-center" style={{ gap: '0.25rem' }}>
                                <input 
                                  type="number" 
                                  min="0" 
                                  value={limitConfig.max} 
                                  onChange={(e) => handleLimitChange(item.id, parseInt(e.target.value) || 0)} 
                                  className="input is-small has-text-centered py-0 px-1"
                                  style={{ width: '42px', height: '22px', fontSize: '11px', borderRadius: '5px' }}
                                  title="Límite máximo de días" 
                                />
                                <span 
                                  className="tag is-small" 
                                  style={{ 
                                    fontSize: '10px', 
                                    height: '20px', 
                                    padding: '0 6px', 
                                    fontWeight: 700,
                                    borderRadius: '5px',
                                    backgroundColor: remaining <= 0 ? '#ffe4e6' : '#dcfce7',
                                    color: remaining <= 0 ? '#e11d48' : '#15803d'
                                  }}
                                >
                                  Restan {remaining}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Añadir nuevo color */}
                <div 
                  className="box p-3 mt-auto" 
                  style={{ 
                    border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
                    boxShadow: 'none', 
                    backgroundColor: isDarkMode ? '#141d2b' : '#f8fafc',
                    borderRadius: '10px'
                  }}
                >
                  <label className="label is-size-7 is-uppercase mb-2" style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '11px', letterSpacing: '0.04em' }}>
                    Añadir nuevo color
                  </label>
                  <div className="field has-addons mb-0">
                    <div className="control">
                      <input 
                        type="color" 
                        value={newColorHex} 
                        onChange={(e) => setNewColorHex(e.target.value)} 
                        className="input is-small" 
                        style={{ width: '38px', height: '30px', padding: '2px', cursor: 'pointer', borderRadius: '6px 0 0 6px' }}
                        title="Seleccionar color" 
                      />
                    </div>
                    <div className="control is-expanded">
                      <input 
                        type="text" 
                        value={newLabel} 
                        onChange={(e) => setNewLabel(e.target.value)} 
                        placeholder="Nombre..." 
                        className="input is-small" 
                        style={{ height: '30px', borderRadius: 0 }}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddColor()} 
                      />
                    </div>
                    <div className="control">
                      <button 
                        onClick={handleAddColor} 
                        className="button is-small" 
                        style={{ 
                          height: '30px', 
                          background: 'linear-gradient(135deg, #2563eb, #3b82f6)', 
                          color: '#ffffff', 
                          border: 'none',
                          borderRadius: '0 6px 6px 0'
                        }}
                        title="Añadir nuevo color"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Contenedor de Calendarios + Acciones a la derecha */}
            <div className="column is-9-desktop is-8-tablet">
              <div 
                className="box p-4" 
                style={{ 
                  border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', 
                  borderRadius: '14px', 
                  backgroundColor: isDarkMode ? '#182230' : '#f8fafc',
                  boxShadow: isDarkMode ? 'none' : '0 4px 24px -4px rgba(30, 41, 59, 0.06)'
                }}
              >

                <div className="columns is-variable is-3 is-desktop">
                  {/* Bloque de los dos calendarios con su cabecera centrada exactamente sobre los dos calendarios */}
                  <div className="column is-10-desktop is-12-tablet">
                    {/* Selector de meses centrado exactamente con los dos calendarios */}
                    <div className="is-flex is-align-items-center is-justify-content-center mb-3.5" style={{ gap: '1rem' }}>
                      <button 
                        onClick={handlePrevMonth} 
                        className="button is-rounded shadow-sm" 
                        style={{ 
                          width: '34px', 
                          height: '34px', 
                          borderRadius: '50%',
                          border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1',
                          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                          color: isDarkMode ? '#93c5fd' : '#1d4ed8'
                        }}
                        title="Mes anterior"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <h2 className="title is-4 mb-0 has-text-weight-bold is-flex is-align-items-center" style={{ gap: '0.65rem' }}>
                        <span 
                          className="tag is-medium" 
                          style={{ 
                            background: isDarkMode ? '#1e293b' : '#ffffff', 
                            color: isDarkMode ? '#93c5fd' : '#1e40af', 
                            border: isDarkMode ? '1px solid #334155' : '1px solid #bfdbfe', 
                            fontWeight: 700, 
                            borderRadius: '8px',
                            boxShadow: isDarkMode ? 'none' : '0 2px 6px rgba(30,41,59,0.06)'
                          }}
                        >
                          {MONTHS[leftMonth]} {leftYear}
                        </span>
                        <span 
                          className="tag is-medium" 
                          style={{ 
                            background: isDarkMode ? '#1e293b' : '#ffffff', 
                            color: isDarkMode ? '#93c5fd' : '#1e40af', 
                            border: isDarkMode ? '1px solid #334155' : '1px solid #bfdbfe', 
                            fontWeight: 700, 
                            borderRadius: '8px',
                            boxShadow: isDarkMode ? 'none' : '0 2px 6px rgba(30,41,59,0.06)'
                          }}
                        >
                          {MONTHS[rightMonth]} {rightYear}
                        </span>
                      </h2>

                      <button 
                        onClick={handleNextMonth} 
                        className="button is-rounded shadow-sm" 
                        style={{ 
                          width: '34px', 
                          height: '34px', 
                          borderRadius: '50%',
                          border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1',
                          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                          color: isDarkMode ? '#93c5fd' : '#1d4ed8'
                        }}
                        title="Mes siguiente"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    {/* Los dos calendarios lado a lado */}
                    <div className="columns is-variable is-3 is-mobile">
                      <div className="column is-6 is-flex is-justify-content-center">
                        {renderMonth(leftYear, leftMonth)}
                      </div>
                      <div className="column is-6 is-flex is-justify-content-center">
                        {renderMonth(rightYear, rightMonth)}
                      </div>
                    </div>
                  </div>

                  {/* 3. Columna derecha estrecha: Mostrar fin de semana, Presencial cambia primer lunes, Limpiar calendario, Guardar imagen */}
                  <div className="column is-2-desktop is-12-tablet">
                    {/* Espaciador en desktop para alinear las acciones con el inicio de los calendarios */}
                    <div className="is-hidden-touch mb-3" style={{ height: '40px' }} />
                    
                    <div className="is-flex is-flex-direction-column" style={{ gap: '0.65rem' }}>
                      {/* Mostrar fin de semana */}
                      <label 
                        className="checkbox box p-3 is-flex is-align-items-center mb-0" 
                        style={{ 
                          gap: '0.5rem', 
                          border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
                          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
                          boxShadow: 'none',
                          borderRadius: '10px'
                        }}
                      >
                        <input 
                          type="checkbox" 
                          checked={showWeekends} 
                          onChange={(e) => setShowWeekends(e.target.checked)} 
                        />
                        <span className="is-size-7 has-text-weight-bold" style={{ color: isDarkMode ? '#e2e8f0' : '#334155' }}>Mostrar fin de semana</span>
                      </label>

                      {/* Presencial cambia primer lunes del mes */}
                      <label 
                        className="checkbox box p-3 is-flex is-align-items-start mb-0" 
                        style={{ 
                          gap: '0.5rem', 
                          border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
                          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
                          boxShadow: 'none',
                          borderRadius: '10px'
                        }} 
                        title="Si está marcado, los días presenciales cambian a partir del primer lunes del mes. Si se desmarca, se seleccionan siempre esas columnas en todo el calendario."
                      >
                        <input 
                          type="checkbox" 
                          checked={presencialFirstMonday} 
                          className="mt-1"
                          onChange={(e) => {
                            const val = e.target.checked;
                            setPresencialFirstMonday(val);
                            if (!val && Object.keys(fixedWeeklySelections).length === 0) {
                              const current = weeklySelections[`${leftYear}-${leftMonth}`];
                              if (current) setFixedWeeklySelections(current);
                            }
                          }} 
                        />
                        <span className="is-size-7 has-text-weight-bold" style={{ color: isDarkMode ? '#e2e8f0' : '#334155', lineHeight: 1.35 }}>Presencial cambia primer lunes</span>
                      </label>

                      {/* Limpiar calendario */}
                      <div>
                        {showClearConfirm ? (
                          <div className="notification is-danger is-light p-3 mb-0" style={{ border: '1px solid #f87171', borderRadius: '10px' }}>
                            <p className="is-size-7 has-text-weight-bold has-text-centered mb-2">¿Borrar todo lo marcado?</p>
                            <div className="buttons are-small mb-0 is-flex">
                              <button 
                                onClick={() => { setColoredDays({}); setWeeklySelections({}); setFixedWeeklySelections({}); setShowClearConfirm(false); }} 
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
                            className="button is-fullwidth is-small"
                            style={{ 
                              borderRadius: '8px', 
                              border: '1px solid #fecdd3', 
                              color: '#e11d48', 
                              backgroundColor: isDarkMode ? 'rgba(225, 29, 72, 0.12)' : '#fff1f2', 
                              fontWeight: 600 
                            }}
                            title="Limpiar todas las selecciones del calendario"
                          >
                            <span className="icon is-small"><Trash2 size={15} /></span>
                            <span>Limpiar calendario</span>
                          </button>
                        )}
                      </div>

                      {/* Guardar imagen */}
                      <button 
                        onClick={handleExportPNG}
                        className="button is-fullwidth is-small"
                        style={{ 
                          borderRadius: '8px', 
                          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
                          color: '#ffffff', 
                          border: 'none', 
                          fontWeight: 700, 
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' 
                        }}
                        title="Descargar imagen de la propuesta en PNG"
                      >
                        <span className="icon is-small"><Download size={15} /></span>
                        <span>Guardar imagen</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Contenedor Oculto Formateado Específicamente para la Exportación (PNG) */}
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: -10, opacity: 0, pointerEvents: 'none' }}>
        <div ref={exportRef} className="p-8 bg-white is-flex is-flex-direction-column is-align-items-center" style={{ width: 'max-content', gap: '1.5rem', backgroundColor: '#ffffff' }}>
          <h1 className="title is-3 has-text-grey-darker mb-0">Propuesta Vacaciones</h1>
          
          <div className="is-flex" style={{ gap: '2rem', alignItems: 'flex-start' }}>
            {renderMonth(leftYear, leftMonth, true)}
            {renderMonth(rightYear, rightMonth, true)}
          </div>
          
          {(usedLegends.length > 0 || hasWeeklySelections) && (
            <div className="mt-3 pt-4 is-flex is-flex-direction-column is-align-items-center" style={{ borderTop: '1px solid #dbdbdb', width: '100%', gap: '1rem' }}>
              <h3 className="is-size-7 is-uppercase has-text-weight-bold has-text-grey">Leyenda</h3>
              <div className="is-flex is-flex-wrap-wrap is-justify-content-center" style={{ gap: '1.5rem' }}>
                {usedLegends.map(color => (
                  <div key={color.id} className="is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: color.color, border: '1px solid rgba(0,0,0,0.15)', display: 'inline-block' }} />
                    <span className="is-size-7 has-text-weight-bold has-text-grey-darker">{color.fullName || color.label}</span>
                  </div>
                ))}
                
                {hasWeeklySelections && (
                  <div className="is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                    <div style={{ position: 'relative', width: '20px', height: '20px', borderRadius: '4px', border: '1px solid #bce8f1', backgroundColor: '#ebf3fe', boxShadow: 'inset 0 0 0 1.5px #3273dc' }}>
                         <div style={{ position: 'absolute', top: '3px', right: '3px', width: '5px', height: '5px', backgroundColor: '#3273dc', borderRadius: '50%' }}></div>
                         <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: '#3273dc', opacity: 0.25 }}></div>
                    </div>
                    <span className="is-size-7 has-text-weight-bold has-text-grey-darker">Días presenciales</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal "¿Cómo funciona?" con diseño Bulma Modal limpio y sin franjas oscuras */}
      {showHowItWorks && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowHowItWorks(false)} />
          <div 
            className="modal-card" 
            style={{ 
              maxWidth: '720px', 
              width: '92%', 
              maxHeight: '90vh', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              backgroundColor: isDarkMode ? '#1e242c' : '#ffffff',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <header 
              className="modal-card-head py-3 px-5" 
              style={{ 
                backgroundColor: isDarkMode ? '#252e39' : '#f8fafc', 
                borderBottom: isDarkMode ? '1px solid #324054' : '1px solid #e2e8f0',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
              }}
            >
              <p className="modal-card-title is-size-5 has-text-weight-bold mb-0 is-flex is-align-items-center" style={{ gap: '0.5rem', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                <span>💡</span>
                <span>¿Cómo funciona?</span>
              </p>
              <button 
                className="delete is-medium" 
                aria-label="close" 
                onClick={() => setShowHowItWorks(false)} 
                title="Cerrar ventana"
              />
            </header>
            
            <section className="modal-card-body content p-5" style={{ overflowY: 'auto', backgroundColor: isDarkMode ? '#1e242c' : '#ffffff', color: isDarkMode ? '#cbd5e1' : '#334155', flexGrow: 1 }}>
              <section className="mb-4">
                <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                  <span>📌</span>
                  <span>¿Qué es?</span>
                </h4>
                <p>
                  Es una pantalla que te permite jugar con tus días de vacaciones, organizarlos y ver cómo quedarían. Además, puedes descargar una imagen para presentar a tu superior en caso de necesitarlo.
                </p>
              </section>

              <section className="mb-4">
                <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                  <span>🏢</span>
                  <span>Días presenciales y teletrabajo</span>
                </h4>
                <p className="mb-2">
                  Si dispones de un régimen con días presenciales y teletrabajo, haciendo clic en los días semanales de la cabecera (<strong>L, M, X, J, V, S, D</strong>) se emplazan automáticamente los días de cada semana como <strong>Presenciales</strong> (señalizados con borde azul y punto indicador).
                </p>
                <div className="box p-3 mb-0" style={{ fontSize: '0.82rem', border: isDarkMode ? '1px solid #324054' : '1px solid #e8e8e8', backgroundColor: isDarkMode ? '#252e39' : '#f8fafc', boxShadow: 'none' }}>
                  <p className="mb-1">
                    <strong>• Presencial cambia primer lunes del mes (marcado por defecto):</strong> El patrón presencial se adapta al mes y cambia a partir del primer lunes del mes.
                  </p>
                  <p className="mb-0">
                    <strong>• Si se desmarca esta opción:</strong> Se seleccionarán siempre esas columnas de forma continua en todos los meses. Por ejemplo, si seleccionas <strong>L</strong> y <strong>M</strong> (martes), quedarán siempre seleccionados todos los lunes y martes del calendario.
                  </p>
                </div>
              </section>

              <section className="mb-4">
                <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                  <span>📅</span>
                  <span>Navegación de calendarios</span>
                </h4>
                <p>
                  Se muestran dos meses consecutivos en pantalla. Utiliza los botones de flecha (<strong>‹</strong> y <strong>›</strong>) situados en la parte superior para avanzar o retroceder de mes.
                </p>
              </section>

              <section className="mb-4">
                <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                  <span>🎨</span>
                  <span>Leyenda de colores</span>
                </h4>
                <p className="mb-2">
                  El panel izquierdo contiene las categorías predeterminadas y las que tú añadas:
                </p>
                <ul>
                  <li><strong>Festivo:</strong> Días no laborales (los fines de semana se pintan automáticamente en este color si no se personalizan).</li>
                  <li><strong>Vac. por periodo:</strong> Vacaciones planificadas por temporadas o bloques continuos.</li>
                  <li><strong>Asuntos Propios:</strong> Días reservados para trámites y gestiones personales.</li>
                  <li><strong>Vac. días independientes:</strong> Vacaciones disfrutadas por días sueltos.</li>
                  <li><strong>Personalizadas:</strong> Puedes crear tus propias categorías con nombre y color libre.</li>
                </ul>
              </section>

              <section className="mb-4">
                <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                  <span>🖱️</span>
                  <span>Cómo interactuar</span>
                </h4>
                <ul>
                  <li><strong>Seleccionar categoría activa:</strong> Haz clic en cualquier etiqueta de la leyenda para seleccionarla como color activo de trabajo.</li>
                  <li><strong>Pintar días:</strong> Haz clic sobre cualquier día del calendario para aplicarle la categoría activa.</li>
                  <li><strong>Quitar color:</strong> Vuelve a hacer clic sobre un día ya coloreado con la misma categoría activa para desmarcarlo.</li>
                  <li><strong>Marcar días presenciales por columna:</strong> Haz clic en la cabecera de cualquier día (L, M, X, J, V, S, D) para marcar o desmarcar todos los días de esa columna en el mes como días presenciales.</li>
                </ul>
              </section>

              <section className="mb-4">
                <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                  <span>⏱️</span>
                  <span>Control de límites</span>
                </h4>
                <p className="mb-2">
                  Puedes establecer un límite máximo de días en las categorías configurables:
                </p>
                <ul>
                  <li>Activa la casilla <strong>"Limitar"</strong> en la etiqueta deseada.</li>
                  <li>Introduce el número máximo de días permitidos.</li>
                  <li>El contador <strong>"Restan x"</strong> indicará cuántos días te quedan disponibles (se resaltará en rojo si alcanzas o superas el tope).</li>
                </ul>
              </section>

              <section className="mb-4">
                <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                  <span>➕</span>
                  <span>Añadir nuevo color</span>
                </h4>
                <p>
                  En el formulario <strong>"Añadir nuevo color"</strong> del panel izquierdo puedes crear nuevas categorías personalizadas: selecciona un color con la paleta, escribe su nombre y pulsa el botón <strong>+</strong> (o la tecla Enter).
                </p>
              </section>

              <section className="mb-4">
                <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                  <span>👁️</span>
                  <span>Mostrar u ocultar fines de semana</span>
                </h4>
                <p>
                  Marca o desmarca la opción <strong>"Mostrar fin de semana"</strong> en la columna derecha para alternar entre ver solo la semana laboral (Lunes a Viernes) o la semana completa (Lunes a Domingo).
                </p>
              </section>

              <section className="mb-4">
                <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                  <span>📥</span>
                  <span>Guardar imagen (PNG)</span>
                </h4>
                <p>
                  Pulsa el botón <strong>"Guardar imagen"</strong> o <strong>"Descargar PNG"</strong> para exportar un archivo PNG de alta resolución con los dos meses y la leyenda de categorías empleadas, listo para adjuntar, compartir o imprimir.
                </p>
              </section>

              <section className="mb-4">
                <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                  <span>🗑️</span>
                  <span>Limpiar calendario</span>
                </h4>
                <p>
                  El botón <strong>"Limpiar calendario"</strong> borra de golpe todos los días coloreados y selecciones presenciales para reiniciar tu propuesta. ¡Requiere confirmación previa para evitar borrados por error!
                </p>
              </section>

              <article className="message is-info is-small mb-0">
                <div className="message-body">
                  <strong>Nota:</strong> Todos tus datos (colores, selecciones, límites y etiquetas) se guardan automáticamente en tu navegador (Local Storage), por lo que no perderás tu planificación aunque recargues o cierres la página.
                </div>
              </article>
            </section>

            <footer 
              className="modal-card-foot is-justify-content-flex-end py-3 px-5" 
              style={{ 
                backgroundColor: isDarkMode ? '#252e39' : '#f8fafc', 
                borderTop: isDarkMode ? '1px solid #324054' : '1px solid #e2e8f0',
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px'
              }}
            >
              <button onClick={() => setShowHowItWorks(false)} className="button is-info is-small">
                Entendido
              </button>
            </footer>
          </div>
        </div>
      )}

    </section>
  );
};

export default CalendarApp;
