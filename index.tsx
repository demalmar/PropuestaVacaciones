import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Download, Trash2, Info, X } from 'lucide-react';

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
  
  // Estado para confirmacin de limpieza
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Estado para mostrar/ocultar modal "Cmo funciona"
  const [showHowItWorks, setShowHowItWorks] = useState(false);

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
    
    // Calcular el ltimo da del mes para saber exactamente cuntas semanas dibujar
    const endDate = new Date(targetYear, targetMonth + 1, 0);
    const endDayIndex = endDate.getDay() === 0 ? 6 : endDate.getDay() - 1; 
    const totalDaysToRender = startDayIndex + endDate.getDate() + (6 - endDayIndex);

    // Retroceder al Lunes de la primera semana para empezar a dibujar
    const gridStartDate = new Date(startDate);
    gridStartDate.setDate(startDate.getDate() - startDayIndex);
    
    let days = [];
    
    // Generar los das justos y necesarios (28, 35 o 42 segn el mes)
    for (let i = 0; i < totalDaysToRender; i++) {
        const currentLoopDate = new Date(gridStartDate);
        currentLoopDate.setDate(gridStartDate.getDate() + i);
        
        const cYear = currentLoopDate.getFullYear();
        const cMonth = currentLoopDate.getMonth();
        const cDay = currentLoopDate.getDate();
        const dateStr = dateToString(cYear, cMonth, cDay);
        const dayIndex = i % 7; // 0=Lunes, 6=Domingo
        
        // --- LA LGICA CLAVE ---
        // Buscamos a qu mes pertenece el LUNES de esta semana. 
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

    return (
      <div className={`w-full flex-1 ${showWeekends ? 'min-w-[220px]' : 'min-w-[170px]'} border border-blue-400 bg-white transition-all duration-300 rounded-lg overflow-hidden`}>
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
                        ${isHeaderDaySelected(index) ? 'bg-blue-100' : ''}
                        border-r border-blue-400 last:border-r-0
                    `}
                    title={presencialFirstMonday ? `Seleccionar todos los ${day} de este mes` : `Seleccionar todos los ${day} del calendario`}
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
            
            // --- LÓGICA DE SELECCIÓN POR COLUMNA (PRESENCIAL) ---
            const isColumnSelected = presencialFirstMonday
              ? weeklySelections[dayData.owningMonthKey]?.[dayData.dayIndex]
              : Boolean(fixedWeeklySelections[dayData.dayIndex]);
            
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
                    relative h-10 sm:h-11 flex items-center justify-center font-semibold cursor-pointer 
                    transition-all hover:opacity-80 select-none text-xs sm:text-sm
                    ${textClass}
                    ${borderClasses}
                `}
                style={bgColorStyle}
              >
                {/* Indicadores visuales refinados para "Das Presenciales" */}
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
  const hasWeeklySelections = presencialFirstMonday
    ? Object.values(weeklySelections).some(monthObj => 
        Object.values(monthObj).some(isSelected => isSelected)
      )
    : Object.values(fixedWeeklySelections).some(isSelected => isSelected);

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-4 md:p-6 flex flex-col items-center overflow-x-auto relative">
      
      {/* Contenedor principal */}
      <div className="w-full max-w-[1280px] flex flex-col gap-4">

        {/* Barra superior con Título y Botones */}
        <div className="w-full flex justify-between items-center bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Propuesta Vacaciones</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
                onClick={() => setShowHowItWorks(true)}
                className="flex items-center gap-1.5 sm:gap-2 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 sm:px-4 py-2 rounded-lg shadow-sm transition-all font-semibold text-xs sm:text-sm"
                title="Ver instrucciones"
            >
                <Info size={18} />
                Cómo funciona
            </button>
            <button 
                onClick={handleExportPNG}
                className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-sm transition-all font-semibold hover:shadow-md text-xs sm:text-sm"
            >
                <Download size={18} />
                Descargar PNG
            </button>
          </div>
        </div>

        {/* Fila Principal: Panel Leyenda a la izquierda | Panel Calendarios en el centro con Acciones a su derecha */}
        <div className="w-full flex flex-col lg:flex-row items-start gap-4">

          {/* 1. Contenedor Propio Izquierdo: Leyenda de Colores + Añadir Etiqueta */}
          <div className="w-full lg:w-64 xl:w-72 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 shrink-0">
            <div className="border-b pb-2 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider">Leyenda de Colores</h3>
              <span className="text-[10px] text-slate-400 font-semibold">{legendColors.length} tipos</span>
            </div>

            {/* Contenedor con scroll interno para la lista de etiquetas */}
            <div className="flex-1 overflow-y-auto max-h-[340px] flex flex-col gap-2 pr-1">
              {legendColors.map((item) => {
                const isSpecial = ['2', '3', '4'].includes(item.id);
                const limitConfig = limits[item.id];
                const usage = Object.values(coloredDays).filter(id => id === item.id).length;
                const remaining = (limitConfig?.max || 0) - usage;

                return (
                  <div 
                    key={item.id} 
                    className={`rounded-lg border transition-all duration-200 p-2 ${activeColorId === item.id ? 'bg-blue-50/60 border-blue-300 shadow-sm ring-1 ring-blue-200' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div 
                      title={item.fullName || item.label} 
                      onClick={() => setActiveColorId(item.id)} 
                      className="flex items-center gap-2 cursor-pointer mb-1"
                    >
                      <div className="w-4 h-4 rounded shadow-sm border border-black/10 shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-semibold text-slate-700 truncate flex-1">{item.label}</span>
                    </div>
                    {isSpecial && (
                      <div className="flex items-center gap-2 text-xs px-0.5 pt-1 border-t border-slate-100">
                        <label className="flex items-center gap-1 cursor-pointer text-slate-500 hover:text-slate-800 transition-colors font-medium">
                          <input 
                            type="checkbox" 
                            checked={limitConfig?.enabled || false} 
                            onChange={(e) => handleLimitToggle(item.id, e.target.checked)} 
                            className="rounded w-3 h-3 accent-blue-600 cursor-pointer" 
                          />
                          <span className="text-[10px]">Limitar</span>
                        </label>
                        {limitConfig?.enabled && (
                          <div className="flex items-center gap-1 ml-auto">
                            <input 
                              type="number" 
                              min="0" 
                              value={limitConfig.max} 
                              onChange={(e) => handleLimitChange(item.id, parseInt(e.target.value) || 0)} 
                              className="w-9 border border-slate-300 rounded text-[11px] px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white shadow-sm" 
                              title="Límite máximo de días" 
                            />
                            <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap ${remaining <= 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`} title="Días restantes">
                              {remaining}R
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Añadir Etiqueta */}
            <div className="flex flex-col gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 w-full mt-auto">
              <h4 className="font-semibold text-[11px] text-slate-600 uppercase tracking-wider">Añadir Etiqueta</h4>
              <div className="flex items-center gap-2 w-full">
                <input 
                  type="color" 
                  value={newColorHex} 
                  onChange={(e) => setNewColorHex(e.target.value)} 
                  className="w-5 h-5 shrink-0 rounded cursor-pointer p-0 border-0 bg-transparent" 
                  title="Seleccionar color" 
                />
                <input 
                  type="text" 
                  value={newLabel} 
                  onChange={(e) => setNewLabel(e.target.value)} 
                  placeholder="Nombre..." 
                  className="flex-1 min-w-0 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-xs" 
                  onKeyDown={(e) => e.key === 'Enter' && handleAddColor()} 
                />
                <button 
                  onClick={handleAddColor} 
                  className="p-1.5 shrink-0 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors" 
                  title="Añadir etiqueta"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Contenedor de Calendarios + Acciones a la derecha */}
          <div className="flex-1 min-w-0 bg-slate-50 p-4 md:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">

            {/* Selector de meses encima */}
            <div className="w-full flex items-center justify-center gap-4">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-md transition-colors shadow-sm text-slate-700"><ChevronLeft size={20} /></button>
              <div className="text-center">
                <div className="font-bold text-lg md:text-xl text-slate-800 flex items-center gap-6">
                  <span>{MONTHS[leftMonth]} {leftYear}</span>
                  <span>{MONTHS[rightMonth]} {rightYear}</span>
                </div>
              </div>
              <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-md transition-colors shadow-sm text-slate-700"><ChevronRight size={20} /></button>
            </div>

            {/* Meses + Columna derecha de acciones */}
            <div className="w-full flex flex-col md:flex-row gap-4 items-start justify-center">
              <div className="flex-1 min-w-0 flex justify-center w-full">{renderMonth(leftYear, leftMonth)}</div>
              <div className="flex-1 min-w-0 flex justify-center w-full">{renderMonth(rightYear, rightMonth)}</div>

              {/* 3. Columna derecha estrecha: Mostrar fin de semana, Presencial cambia primer lunes, Limpiar calendario, Guardar imagen */}
              <div className="w-full md:w-48 lg:w-52 flex flex-col gap-2.5 shrink-0">
                {/* Mostrar fin de semana */}
                <label className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={showWeekends} 
                    onChange={(e) => setShowWeekends(e.target.checked)} 
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0" 
                  />
                  <span className="text-xs font-semibold text-slate-700 select-none leading-tight">Mostrar fin de semana</span>
                </label>

                {/* Presencial cambia primer lunes del mes */}
                <label className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors" title="Si está marcado, los días presenciales cambian a partir del primer lunes del mes. Si se desmarca, se seleccionan siempre esas columnas en todo el calendario.">
                  <input 
                    type="checkbox" 
                    checked={presencialFirstMonday} 
                    onChange={(e) => {
                      const val = e.target.checked;
                      setPresencialFirstMonday(val);
                      if (!val && Object.keys(fixedWeeklySelections).length === 0) {
                        const current = weeklySelections[`${leftYear}-${leftMonth}`];
                        if (current) setFixedWeeklySelections(current);
                      }
                    }} 
                    className="w-4 h-4 mt-0.5 accent-blue-600 rounded cursor-pointer shrink-0" 
                  />
                  <span className="text-xs font-semibold text-slate-700 select-none leading-tight">Presencial cambia primer lunes del mes</span>
                </label>

                {/* Limpiar calendario */}
                <div className="w-full">
                  {showClearConfirm ? (
                    <div className="flex flex-col gap-2 p-2.5 bg-white rounded-lg border border-red-200 shadow-sm">
                      <span className="text-xs text-red-600 font-semibold text-center leading-tight">¿Borrar todo lo marcado?</span>
                      <div className="flex flex-col gap-1.5">
                        <button 
                          onClick={() => { setColoredDays({}); setWeeklySelections({}); setFixedWeeklySelections({}); setShowClearConfirm(false); }} 
                          className="w-full bg-red-500 text-white py-1.5 rounded-md text-xs font-bold hover:bg-red-600 transition-colors shadow-sm"
                        >
                          Sí, borrar
                        </button>
                        <button 
                          onClick={() => setShowClearConfirm(false)} 
                          className="w-full bg-slate-200 text-slate-700 py-1.5 rounded-md text-xs font-bold hover:bg-slate-300 transition-colors shadow-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowClearConfirm(true)} 
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-2.5 bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-semibold shadow-sm"
                      title="Limpiar todas las selecciones del calendario"
                    >
                      <Trash2 size={16} /> 
                      <span>Limpiar calendario</span>
                    </button>
                  )}
                </div>

                {/* Guardar imagen */}
                <button 
                  onClick={handleExportPNG}
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-2.5 rounded-lg shadow-sm transition-all font-semibold hover:shadow-md text-xs"
                  title="Descargar imagen de la propuesta en PNG"
                >
                  <Download size={16} /> 
                  <span>Guardar imagen</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Contenedor Oculto Formateado Especficamente para la Exportacin (PNG) */}
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

      {/* Modal "¿Cómo funciona?" */}
      {showHowItWorks && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span>💡</span>
                <span>¿Cómo funciona?</span>
              </h2>
              <button onClick={() => setShowHowItWorks(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Cerrar ventana">
                <X size={24} className="text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
                  <span>📌</span>
                  <span>¿Qué es?</span>
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Es una pantalla que te permite jugar con tus días de vacaciones, organizarlos y ver cómo quedarían. Además, puedes descargar una imagen para presentar a tu superior en caso de necesitarlo.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
                  <span>🏢</span>
                  <span>Días presenciales y teletrabajo</span>
                </h3>
                <p className="text-slate-700 mb-3 leading-relaxed">
                  Si dispones de un régimen con días presenciales y teletrabajo, haciendo clic en los días semanales de la cabecera (<strong>L, M, X, J, V, S, D</strong>) se emplazan automáticamente los días de cada semana como <strong>Presenciales</strong> (señalizados con borde azul y punto indicador).
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2">
                  <p>
                    <strong>• Presencial cambia primer lunes del mes (marcado por defecto):</strong> El patrón presencial se adapta al mes y cambia a partir del primer lunes del mes.
                  </p>
                  <p>
                    <strong>• Si se desmarca esta opción:</strong> Se seleccionarán siempre esas columnas de forma continua en todos los meses. Por ejemplo, si seleccionas <strong>L</strong> y <strong>M</strong> (martes), quedarán siempre seleccionados todos los lunes y martes del calendario.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
                  <span>📅</span>
                  <span>Navegación de calendarios</span>
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Se muestran dos meses consecutivos en pantalla. Utiliza los botones de flecha (<strong>‹</strong> y <strong>›</strong>) situados en la parte superior para avanzar o retroceder de mes.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
                  <span>🎨</span>
                  <span>Leyenda de colores</span>
                </h3>
                <p className="text-slate-700 mb-2 leading-relaxed">
                  El panel izquierdo contiene las categorías predeterminadas y las que tú añadas:
                </p>
                <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                  <li><strong>Festivo:</strong> Días no laborales (los fines de semana se pintan automáticamente en este color si no se personalizan).</li>
                  <li><strong>Vac. por periodo:</strong> Vacaciones planificadas por temporadas o bloques continuos.</li>
                  <li><strong>Asuntos Propios:</strong> Días reservados para trámites y gestiones personales.</li>
                  <li><strong>Vac. días independientes:</strong> Vacaciones disfrutadas por días sueltos.</li>
                  <li><strong>Personalizadas:</strong> Puedes crear tus propias categorías con nombre y color libre.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
                  <span>🖱️</span>
                  <span>Cómo interactuar</span>
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 shrink-0">•</span>
                    <span><strong>Seleccionar categoría activa:</strong> Haz clic en cualquier etiqueta de la leyenda para seleccionarla como color activo de trabajo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 shrink-0">•</span>
                    <span><strong>Pintar días:</strong> Haz clic sobre cualquier día del calendario para aplicarle la categoría activa.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 shrink-0">•</span>
                    <span><strong>Quitar color:</strong> Vuelve a hacer clic sobre un día ya coloreado con la misma categoría activa para desmarcarlo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 shrink-0">•</span>
                    <span><strong>Marcar días presenciales por columna:</strong> Haz clic en la cabecera de cualquier día (L, M, X, J, V, S, D) para marcar o desmarcar todos los días de esa columna en el mes como días presenciales.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
                  <span>⏱️</span>
                  <span>Control de límites</span>
                </h3>
                <p className="text-slate-700 mb-2 leading-relaxed">
                  Puedes establecer un límite máximo de días en las categorías configurables:
                </p>
                <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                  <li>Activa la casilla <strong>"Limitar"</strong> en la etiqueta deseada.</li>
                  <li>Introduce el número máximo de días permitidos.</li>
                  <li>El contador <strong>"Restantes" (R)</strong> indicará cuántos días te quedan disponibles (se resaltará en rojo si alcanzas o superas el tope).</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
                  <span>➕</span>
                  <span>Añadir etiquetas</span>
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  En el formulario <strong>"Añadir Etiqueta"</strong> del panel izquierdo puedes crear nuevas categorías personalizadas: selecciona un color con la paleta, escribe su nombre y pulsa el botón <strong>+</strong> (o la tecla Enter).
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
                  <span>👁️</span>
                  <span>Mostrar u ocultar fines de semana</span>
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Marca o desmarca la opción <strong>"Mostrar fin de semana"</strong> en la columna derecha para alternar entre ver solo la semana laboral (Lunes a Viernes) o la semana completa (Lunes a Domingo).
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
                  <span>📥</span>
                  <span>Guardar imagen (PNG)</span>
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Pulsa el botón <strong>"Guardar imagen"</strong> o <strong>"Descargar PNG"</strong> para exportar un archivo PNG de alta resolución con los dos meses y la leyenda de categorías empleadas, listo para adjuntar, compartir o imprimir.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
                  <span>🗑️</span>
                  <span>Limpiar calendario</span>
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  El botón <strong>"Limpiar calendario"</strong> borra de golpe todos los días coloreados y selecciones presenciales para reiniciar tu propuesta. ¡Requiere confirmación previa para evitar borrados por error!
                </p>
              </section>

              <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-slate-700 text-sm leading-relaxed">
                  <strong>Nota:</strong> Todos tus datos (colores, selecciones, límites y etiquetas) se guardan automáticamente en tu navegador (Local Storage), por lo que no perderás tu planificación aunque recargues o cierres la página.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CalendarApp;
