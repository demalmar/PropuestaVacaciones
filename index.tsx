import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Download, Trash2 } from 'lucide-react';

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

  // Cargar librería para exportar a PNG dinámicamente
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
  
  // Estado para los días coloreados y selecciones L-V (Con Local Storage)
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
    setActiveColorId(newId); // Selecciona el nuevo color automáticamente
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
      
      // Comprobar límites si es un color especial
      if (['2', '3', '4'].includes(activeColorId) && limits[activeColorId]?.enabled) {
         const currentUsage = Object.values(prev).filter(id => id === activeColorId).length;
         if (currentUsage >= limits[activeColorId].max) {
             return prev; // Límite alcanzado, no se añade el color
         }
      }
      
      newColoredDays[dateStr] = activeColorId;
      return newColoredDays;
    });
  };

  const handleHeaderDayClick = (year, month, dayIndex) => {
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
    
    // Generar los días justos y necesarios (28, 35 o 42 según el mes)
    for (let i = 0; i < totalDaysToRender; i++) {
        const currentLoopDate = new Date(gridStartDate);
        currentLoopDate.setDate(gridStartDate.getDate() + i);
        
        const cYear = currentLoopDate.getFullYear();
        const cMonth = currentLoopDate.getMonth();
        const cDay = currentLoopDate.getDate();
        const dateStr = dateToString(cYear, cMonth, cDay);
        const dayIndex = i % 7; // 0=Lunes, 6=Domingo
        
        // --- LA LÓGICA CLAVE ---
        // Buscamos a qué mes pertenece el LUNES de esta semana. 
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
    const selectedHeaderDays = weeklySelections[monthKey] || {};
    
    // Filtrar días y columnas si los findes están ocultos
    const visibleDays = showWeekends ? days : days.filter(d => d.dayIndex < 5);
    const cols = showWeekends ? 7 : 5;

    return (
      <div className={`flex-1 ${showWeekends ? 'min-w-[300px]' : 'min-w-[220px]'} border border-blue-400 bg-white transition-all duration-300 rounded-lg overflow-hidden`}>
        {/* Cabecera del Mes */}
        <div className="text-center py-2 font-bold text-blue-800 bg-blue-50 border-b border-blue-400">
          {MONTHS[targetMonth]} {targetYear}
        </div>
        
        {/* Días de la semana (Cabecera interactiva) */}
        <div className={`grid ${showWeekends ? 'grid-cols-7' : 'grid-cols-5'} border-b border-blue-400 bg-gray-50`}>
          {DAYS_OF_WEEK.map((day, index) => {
            if (!showWeekends && index >= 5) return null;
            return (
                <div 
                    key={day} 
                    onClick={!isExport ? () => handleHeaderDayClick(targetYear, targetMonth, index) : undefined}
                    className={`
                        text-center py-1.5 font-bold transition-colors select-none
                        ${!isExport ? 'cursor-pointer hover:bg-gray-200' : ''}
                        ${index >= 5 ? 'text-red-600' : 'text-blue-600'} 
                        ${selectedHeaderDays[index] ? 'bg-blue-100' : ''}
                        border-r border-blue-400 last:border-r-0
                    `}
                    title={`Seleccionar todos los ${day} de este mes`}
                >
                  {day}
                </div>
            );
          })}
        </div>
        
        {/* Cuadrícula de días */}
        <div className={`grid ${showWeekends ? 'grid-cols-7' : 'grid-cols-5'}`}>
          {visibleDays.map((dayData, index) => {
            
            // --- DETERMINAR COLOR DE FONDO ---
            const colorId = coloredDays[dayData.dateStr];
            const assignedColor = legendColors.find(c => c.id === colorId)?.color;
            let finalBgColor = assignedColor;
            
            // Si es fin de semana del mes actual y no tiene color manual, hereda el color de "Festivo" (ID '1')
            if (!assignedColor && dayData.dayIndex >= 5 && dayData.isCurrentMonth) {
                finalBgColor = legendColors.find(c => c.id === '1')?.color;
            }

            let bgColorStyle = finalBgColor ? { backgroundColor: finalBgColor } : {};
            
            // Estilos del texto
            let textClass = 'text-blue-800';
            if (dayData.dayIndex >= 5 && dayData.isCurrentMonth && !assignedColor) textClass = 'text-red-600 font-bold'; 
            if (!dayData.isCurrentMonth) textClass = 'text-gray-300'; 

            // --- LÓGICA DE SELECCIÓN POR COLUMNA ---
            const isColumnSelected = weeklySelections[dayData.owningMonthKey]?.[dayData.dayIndex];
            
            // Determinar clases de borde para el efecto "bloque"
            let borderClasses = "border-r border-b border-blue-200"; // Borde por defecto de la celda
            
            if (isColumnSelected) {
                borderClasses += " ring-[1.5px] ring-inset ring-blue-400 z-10 bg-blue-50/30"; 
            }
            
            // Ajustar bordes extremos del calendario para que no queden gruesos

            return (
              <div 
                key={`${targetYear}-${targetMonth}-${index}`}
                onClick={!isExport ? () => handleDayClick(dayData.dateStr.split('-')[0], parseInt(dayData.dateStr.split('-')[1])-1, parseInt(dayData.dateStr.split('-')[2])) : undefined}
                className={`
                    relative h-12 flex items-center justify-center font-semibold cursor-pointer 
                    transition-all hover:opacity-80 select-none
                    ${textClass}
                    ${borderClasses}
                `}
                style={bgColorStyle}
              >
                {/* Indicadores visuales refinados para "Días Presenciales" */}
                {isColumnSelected && (
                    <>
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-sm"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 opacity-20"></div>
                    </>
                )}
                
                <span className="relative z-0">{dayData.day}</span>
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
  const hasWeeklySelections = Object.values(weeklySelections).some(monthObj => 
    Object.values(monthObj).some(isSelected => isSelected)
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-start md:items-center overflow-x-auto relative">
      
      {/* Barra superior con Título y Botón */}
      <div className="w-full max-w-min flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200 min-w-max gap-12">
        <h1 className="text-2xl font-bold text-slate-800">Propuesta Vacaciones</h1>
        <button 
            onClick={handleExportPNG}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all font-semibold hover:shadow-md"
        >
            <Download size={20} />
            Descargar PNG
        </button>
      </div>

      {/* Contenedor interactivo (Ya no se exporta este directamente) */}
      <div className="flex flex-row gap-6 p-8 bg-slate-50 w-max rounded-xl border border-slate-200 shadow-sm">
        
      {/* Panel Izquierdo: Leyenda y Controles */}
      <div className="w-72 bg-white p-6 rounded-xl shadow-md flex-shrink-0 h-fit border border-slate-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Herramientas</h2>
        
        {/* Controles de Navegación */}
        <div className="flex justify-between items-center mb-6 bg-slate-100 p-2 rounded-lg">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-md transition-colors shadow-sm text-slate-700"><ChevronLeft size={20} /></button>
            <span className="font-semibold text-slate-700">Meses</span>
            <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-md transition-colors shadow-sm text-slate-700"><ChevronRight size={20} /></button>
        </div>

        {/* Opciones de Vista (Ocultar/Mostrar Findes) */}
        <div 
            className="mb-8 flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" 
            onClick={() => setShowWeekends(!showWeekends)}
        >
            <input 
                type="checkbox" 
                checked={showWeekends} 
                onChange={(e) => setShowWeekends(e.target.checked)}
                className="w-5 h-5 cursor-pointer accent-blue-600 rounded"
                onClick={(e) => e.stopPropagation()} 
            />
            <span className="font-semibold text-slate-700 select-none">Mostrar fin de semana</span>
        </div>

        {/* Leyenda de Colores */}
        <div className="mb-6">
          <h3 className="font-semibold text-slate-700 mb-3 uppercase text-sm tracking-wider">Leyenda de Colores</h3>
          <div className="flex flex-col gap-1">
            {legendColors.map((item) => {
              const isSpecial = ['2', '3', '4'].includes(item.id);
              const limitConfig = limits[item.id];
              const usage = Object.values(coloredDays).filter(id => id === item.id).length;
              const remaining = (limitConfig?.max || 0) - usage;
              
              return (
              <div key={item.id} className={`flex flex-col mb-1.5 rounded-xl border transition-all duration-200 ${activeColorId === item.id ? 'bg-slate-50/80 border-slate-300 shadow-sm ring-1 ring-slate-100' : 'border-transparent hover:bg-slate-50/50'}`}>
                
                {/* Etiqueta Principal */}
                <div 
                  title={item.fullName || item.label}
                  onClick={() => setActiveColorId(item.id)}
                  className="flex items-center gap-3 p-2.5 cursor-pointer"
                >
                  <div 
                    className="w-6 h-6 rounded-md shadow-sm border border-black/10 shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-semibold text-slate-700 truncate">{item.label}</span>
                </div>
                
                {/* Controles de Límite para Especiales */}
                {isSpecial && (
                    <div className="px-3 pb-2.5 flex items-center justify-between text-xs mt-0.5 border-t border-slate-200/50 pt-2.5 mx-1">
                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 hover:text-slate-800 transition-colors font-medium">
                            <input 
                                type="checkbox" 
                                checked={limitConfig?.enabled || false}
                                onChange={(e) => handleLimitToggle(item.id, e.target.checked)}
                                className="rounded w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                            />
                            Limitar
                        </label>
                        {limitConfig?.enabled && (
                            <div className="flex items-center gap-1.5">
                                <input 
                                    type="number" 
                                    min="0"
                                    value={limitConfig.max}
                                    onChange={(e) => handleLimitChange(item.id, parseInt(e.target.value) || 0)}
                                    className="w-12 border border-slate-300 rounded text-xs px-1.5 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm"
                                    title="Límite máximo de días"
                                />
                                <span className={`font-bold px-2 py-1 rounded text-[11px] shadow-sm ${remaining <= 0 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-white border border-slate-200 text-slate-600'}`} title="Días restantes">
                                    {remaining} rest.
                                </span>
                            </div>
                        )}
                    </div>
                )}
              </div>
            )})}
          </div>
        </div>

        {/* Formulario para añadir colores personalizados */}
        <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden w-full">
            <h4 className="font-semibold text-sm text-slate-600">Añadir Nueva Etiqueta</h4>
            <div className="flex items-center gap-2 w-full">
                <input 
                    type="color" 
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-6 h-6 shrink-0 rounded cursor-pointer p-0 border-0 bg-transparent"
                    title="Seleccionar color"
                />
                <input 
                    type="text" 
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Nombre..."
                    className="flex-1 min-w-0 px-2 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddColor()}
                />
                <button 
                    onClick={handleAddColor}
                    className="p-1.5 shrink-0 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                    title="Añadir etiqueta"
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
        
        {/* Botón Limpiar Todo */}
        <div className="mt-6 pt-6 border-t border-slate-200">
            {showClearConfirm ? (
                <div className="flex flex-col gap-2">
                    <span className="text-sm text-red-600 font-semibold text-center mb-1">¿Borrar todo el calendario?</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => { 
                                setColoredDays({}); 
                                setWeeklySelections({}); 
                                setShowClearConfirm(false); 
                            }} 
                            className="flex-1 bg-red-500 text-white py-1.5 rounded-md text-sm font-bold hover:bg-red-600 transition-colors shadow-sm"
                        >
                            Sí, borrar
                        </button>
                        <button 
                            onClick={() => setShowClearConfirm(false)} 
                            className="flex-1 bg-slate-200 text-slate-700 py-1.5 rounded-md text-sm font-bold hover:bg-slate-300 transition-colors shadow-sm"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => setShowClearConfirm(true)} 
                    className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors font-semibold shadow-sm"
                >
                    <Trash2 size={18} /> Limpiar calendario
                </button>
            )}
        </div>
      </div>

      {/* Panel Derecho: Calendarios (Lo que se ve e interactúa) */}
      <div className="flex flex-row gap-8 pb-4 items-start bg-slate-50 rounded-xl">
        {renderMonth(leftYear, leftMonth)}
        {renderMonth(rightYear, rightMonth)}
      </div>
      
      </div>

      {/* Contenedor Oculto Formateado Específicamente para la Exportación (PNG) */}
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: -10, opacity: 0, pointerEvents: 'none' }}>
        <div ref={exportRef} className="p-8 bg-white w-max flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold text-slate-800">Propuesta Vacaciones</h1>
          
          <div className="flex flex-row gap-8 items-start">
            {renderMonth(leftYear, leftMonth, true)}
            {renderMonth(rightYear, rightMonth, true)}
          </div>
          
          {(usedLegends.length > 0 || hasWeeklySelections) && (
            <div className="mt-4 pt-6 border-t border-slate-200 w-full flex flex-col items-center gap-4">
              <h3 className="text-lg font-bold text-slate-700 uppercase tracking-wider">Leyenda</h3>
              <div className="flex flex-row gap-6 flex-wrap justify-center">
                {usedLegends.map(color => (
                  <div key={color.id} className="flex items-center gap-2 text-slate-800 font-semibold">
                    <div className="w-6 h-6 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: color.color }}></div>
                    <span>{color.fullName || color.label}</span>
                  </div>
                ))}
                
                {hasWeeklySelections && (
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <div className="relative w-6 h-6 rounded-md border border-blue-200 bg-blue-50/50 ring-2 ring-inset ring-blue-400">
                         <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                         <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 opacity-20"></div>
                    </div>
                    <span>Días presenciales</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default CalendarApp;