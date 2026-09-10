import { useState, useRef, useEffect, useMemo } from 'react';
import {
  LegendColorItem,
  Table4060Data,
  LimitsData,
  PlanningMode,
  ViewMode,
  ColoredDays,
  WeeklySelections,
  FixedWeeklySelections,
  CalendarStats
} from '../types/calendar.ts';
import { INITIAL_LEGEND_COLORS } from '../constants/calendar.ts';
import { dateToString } from '../utils/dateUtils.ts';
import { exportToPNG, exportToJSON } from '../utils/exportUtils.ts';

export interface UseCalendarAppReturn {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  exportRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  calendarAreaRef: React.RefObject<HTMLDivElement | null>;
  calendarHeight: number | undefined;

  showImportConfirm: boolean;
  setShowImportConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  pendingImportData: any;
  setPendingImportData: React.Dispatch<React.SetStateAction<any>>;
  showClearConfirm: boolean;
  setShowClearConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  showClearTableConfirm: boolean;
  setShowClearTableConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  showHowItWorks: boolean;
  setShowHowItWorks: React.Dispatch<React.SetStateAction<boolean>>;
  howItWorksTarget: string | null;
  setHowItWorksTarget: React.Dispatch<React.SetStateAction<string | null>>;
  handleOpenHowItWorks: (targetId?: string) => void;
  showWhatIs4060Modal: boolean;
  setShowWhatIs4060Modal: React.Dispatch<React.SetStateAction<boolean>>;
  colorSettingsItem: LegendColorItem | null;
  setColorSettingsItem: React.Dispatch<React.SetStateAction<LegendColorItem | null>>;
  showAddColorModal: boolean;
  setShowAddColorModal: React.Dispatch<React.SetStateAction<boolean>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;

  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  showWeekends: boolean;
  setShowWeekends: React.Dispatch<React.SetStateAction<boolean>>;
  showNextYearJanuary: boolean;
  setShowNextYearJanuary: React.Dispatch<React.SetStateAction<boolean>>;

  legendColors: LegendColorItem[];
  setLegendColors: React.Dispatch<React.SetStateAction<LegendColorItem[]>>;
  activeColorId: string;
  setActiveColorId: React.Dispatch<React.SetStateAction<string>>;
  coloredDays: ColoredDays;
  setColoredDays: React.Dispatch<React.SetStateAction<ColoredDays>>;
  weeklySelections: WeeklySelections;
  setWeeklySelections: React.Dispatch<React.SetStateAction<WeeklySelections>>;
  presencialFirstMonday: boolean;
  setPresencialFirstMonday: React.Dispatch<React.SetStateAction<boolean>>;
  fixedWeeklySelections: FixedWeeklySelections;
  setFixedWeeklySelections: React.Dispatch<React.SetStateAction<FixedWeeklySelections>>;
  limits: LimitsData;
  setLimits: React.Dispatch<React.SetStateAction<LimitsData>>;

  planningMode: PlanningMode;
  setPlanningMode: React.Dispatch<React.SetStateAction<PlanningMode>>;
  show4060: boolean;
  setShow4060: (show: boolean) => void;

  showExportModal: boolean;
  setShowExportModal: React.Dispatch<React.SetStateAction<boolean>>;
  exportIncludeBalance: boolean;
  setExportIncludeBalance: React.Dispatch<React.SetStateAction<boolean>>;
  exportInclude4060: boolean;
  setExportInclude4060: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmExportPNG: () => void;

  table4060: Table4060Data;
  setTable4060: React.Dispatch<React.SetStateAction<Table4060Data>>;
  calendarStats: CalendarStats;

  currentYear: number;
  leftYear: number;
  leftMonth: number;
  rightYear: number;
  rightMonth: number;

  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handlePrevYear: () => void;
  handleNextYear: () => void;
  handleSetYear: (year: number) => void;
  handleDayClick: (year: number, month: number, day: number) => void;
  handleHeaderDayClick: (year: number, month: number, dayIndex: number) => void;
  handlePresencialFirstMondayToggle: (val: boolean) => void;

  handleAddColor: (label: string, color: string) => void;
  handleDeleteColor: (idToDelete: string) => void;
  handleUpdateItemColor: (id: string, newColor: string) => void;

  handleUpdateCant: (key: 'periodo' | 'independientes' | 'asuntos', value: number) => void;
  handleUpdatePastDisfrutadas: (key: 'periodo' | 'independientes' | 'asuntos', val: number) => void;
  handleUpdatePastPresenc: (val: number) => void;
  handleUpdatePastTT: (val: number) => void;
  handleClearTable4060: () => void;
  handleClearCalendar: () => void;

  handleExportPNG: () => void;
  handleExportData: () => void;
  handleTriggerImport: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmImport: () => void;
  handleCancelImport: () => void;
}

export const useCalendarApp = (): UseCalendarAppReturn => {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  
  const exportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modales
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<any>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showClearTableConfirm, setShowClearTableConfirm] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [howItWorksTarget, setHowItWorksTarget] = useState<string | null>(null);

  const handleOpenHowItWorks = (targetId?: string) => {
    setHowItWorksTarget(targetId || null);
    setShowHowItWorks(true);
  };
  const [showWhatIs4060Modal, setShowWhatIs4060Modal] = useState(false);
  const [colorSettingsItem, setColorSettingsItem] = useState<LegendColorItem | null>(null);
  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modo de visualización
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem('vacationApp_viewMode');
      if (saved === 'bimestral' || saved === 'anual') return saved;
      if (saved === 'semestral') return 'bimestral';
    } catch (e) {}
    return 'anual';
  });

  useEffect(() => {
    try {
      localStorage.setItem('vacationApp_viewMode', viewMode);
    } catch (e) {}
  }, [viewMode]);

  // Altura reactiva animada
  const calendarAreaRef = useRef<HTMLDivElement>(null);

  // Modo nocturno
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
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

  useEffect(() => {
    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const [showWeekends, setShowWeekends] = useState(true);

  const [showNextYearJanuary, setShowNextYearJanuary] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vacationApp_showNextYearJanuary');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem('vacationApp_showNextYearJanuary', JSON.stringify(showNextYearJanuary));
    } catch (e) {}
  }, [showNextYearJanuary]);

  // Colores de leyenda
  const [legendColors, setLegendColors] = useState<LegendColorItem[]>(() => {
    try {
      const saved = localStorage.getItem('vacationApp_legendColors');
      if (saved) {
        const parsed = JSON.parse(saved);
        const isOldOrder = parsed.some((c: any) => c.id === '1' && c.label && c.label.toLowerCase().includes('festivo'));
        if (!isOldOrder) {
          return parsed.map((c: any) => {
            if ((c.id === '4' || c.label?.toLowerCase().includes('festivo')) && (c.color === '#fca5a5' || c.color === '#f87171')) {
              return { ...c, color: '#ef4444' };
            }
            return c;
          });
        }
      }
    } catch (e) {
      console.error('Error cargando colores', e);
    }
    return INITIAL_LEGEND_COLORS;
  });

  const [activeColorId, setActiveColorId] = useState('1');

  const [coloredDays, setColoredDays] = useState<ColoredDays>(() => {
    try {
      const saved = localStorage.getItem('vacationApp_coloredDays');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const [weeklySelections, setWeeklySelections] = useState<WeeklySelections>(() => {
    try {
      const saved = localStorage.getItem('vacationApp_weeklySelections');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const [presencialFirstMonday, setPresencialFirstMonday] = useState<boolean>(() => {
    try {
      const match = document.cookie.match(/(?:^|; )vacationApp_presencialFirstMonday=([^;]*)/);
      if (match) return JSON.parse(decodeURIComponent(match[1]));
      const saved = localStorage.getItem('vacationApp_presencialFirstMonday');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return false;
  });

  const [fixedWeeklySelections, setFixedWeeklySelections] = useState<FixedWeeklySelections>(() => {
    try {
      const saved = localStorage.getItem('vacationApp_fixedWeeklySelections');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  // Persistir cambios
  useEffect(() => { localStorage.setItem('vacationApp_coloredDays', JSON.stringify(coloredDays)); }, [coloredDays]);
  useEffect(() => { localStorage.setItem('vacationApp_weeklySelections', JSON.stringify(weeklySelections)); }, [weeklySelections]);
  useEffect(() => { localStorage.setItem('vacationApp_fixedWeeklySelections', JSON.stringify(fixedWeeklySelections)); }, [fixedWeeklySelections]);
  useEffect(() => {
    try {
      localStorage.setItem('vacationApp_presencialFirstMonday', JSON.stringify(presencialFirstMonday));
      document.cookie = `vacationApp_presencialFirstMonday=${encodeURIComponent(JSON.stringify(presencialFirstMonday))}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {}
  }, [presencialFirstMonday]);

  const [limits, setLimits] = useState<LimitsData>(() => {
    try {
      const saved = localStorage.getItem('vacationApp_limits');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      '1': { enabled: false, max: 0 },
      '2': { enabled: false, max: 0 },
      '3': { enabled: false, max: 0 },
    };
  });

  useEffect(() => { localStorage.setItem('vacationApp_legendColors', JSON.stringify(legendColors)); }, [legendColors]);
  useEffect(() => { localStorage.setItem('vacationApp_coloredDays', JSON.stringify(coloredDays)); }, [coloredDays]);
  useEffect(() => { localStorage.setItem('vacationApp_weeklySelections', JSON.stringify(weeklySelections)); }, [weeklySelections]);
  useEffect(() => { localStorage.setItem('vacationApp_fixedWeeklySelections', JSON.stringify(fixedWeeklySelections)); }, [fixedWeeklySelections]);
  useEffect(() => { localStorage.setItem('vacationApp_presencialFirstMonday', JSON.stringify(presencialFirstMonday)); }, [presencialFirstMonday]);
  useEffect(() => { localStorage.setItem('vacationApp_limits', JSON.stringify(limits)); }, [limits]);

  const [planningMode, setPlanningMode] = useState<PlanningMode>(() => {
    try {
      const saved = localStorage.getItem('vacationApp_planningMode');
      if (saved === 'libre' || saved === 'balance') return saved;
      const oldShow4060 = localStorage.getItem('vacationApp_show4060');
      if (oldShow4060 !== null && JSON.parse(oldShow4060) === true) return 'balance';
    } catch (e) {}
    return 'balance';
  });

  // Panel 40-60 (Funcionarios AEAT) desactivado por defecto
  const [show4060, setShow4060] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vacationApp_show4060');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem('vacationApp_show4060', JSON.stringify(show4060));
    } catch (e) {}
  }, [show4060]);

  // Estados para el mini-modal de exportación y opciones de captura
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportIncludeBalance, setExportIncludeBalance] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vacationApp_exportIncludeBalance');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return true;
  });
  const [exportInclude4060, setExportInclude4060] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vacationApp_exportInclude4060');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return true;
  });

  useEffect(() => {
    try {
      localStorage.setItem('vacationApp_exportIncludeBalance', JSON.stringify(exportIncludeBalance));
    } catch (e) {}
  }, [exportIncludeBalance]);

  useEffect(() => {
    try {
      localStorage.setItem('vacationApp_exportInclude4060', JSON.stringify(exportInclude4060));
    } catch (e) {}
  }, [exportInclude4060]);

  const [table4060, setTable4060] = useState<Table4060Data>(() => {
    try {
      let saved = localStorage.getItem('vacationApp_table4060');
      if (!saved && typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|; )vacationApp_table4060=([^;]*)/);
        if (match) saved = decodeURIComponent(match[1]);
      }
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          cant: {
            periodo: parsed.cant?.periodo ?? 0,
            independientes: parsed.cant?.independientes ?? 0,
            asuntos: parsed.cant?.asuntos ?? 0,
          },
          pastDisfrutadas: {
            periodo: parsed.pastDisfrutadas?.periodo ?? 0,
            independientes: parsed.pastDisfrutadas?.independientes ?? 0,
            asuntos: parsed.pastDisfrutadas?.asuntos ?? 0,
          },
          pastPresenc: parsed.pastPresenc ?? 0,
          pastTT: parsed.pastTT ?? 0
        };
      }
    } catch (e) {}
    return {
      cant: { periodo: 0, independientes: 0, asuntos: 0 },
      pastDisfrutadas: { periodo: 0, independientes: 0, asuntos: 0 },
      pastPresenc: 0,
      pastTT: 0
    };
  });

  useEffect(() => { 
    try {
      const str = JSON.stringify(table4060);
      localStorage.setItem('vacationApp_table4060', str);
      document.cookie = `vacationApp_table4060=${encodeURIComponent(str)}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {}
  }, [table4060]);

  const calendarStats = useMemo(() => {
    let periodo = 0;
    let independientes = 0;
    let asuntos = 0;
    let presencial = 0;
    let tt = 0;

    Object.entries(coloredDays).forEach(([dateStr, colorId]) => {
      if (!['1', '2', '3'].includes(colorId as string)) return;

      if (colorId === '2') periodo++;
      else if (colorId === '1') independientes++;
      else if (colorId === '3') asuntos++;

      if (colorId !== '1' && colorId !== '2') return;

      const parts = (dateStr as string).split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        const dateObj = new Date(y, m, d);
        const dayIndex = dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1;

        if (dayIndex < 5) {
          let isPres = false;
          if (presencialFirstMonday) {
            const monDate = new Date(dateObj);
            monDate.setDate(dateObj.getDate() - dayIndex);
            const owningKey = `${monDate.getFullYear()}-${monDate.getMonth()}`;
            isPres = Boolean(weeklySelections[owningKey]?.[dayIndex]);
          } else {
            const currentMonthKey = `${y}-${m}`;
            isPres = Boolean(weeklySelections[currentMonthKey]?.[dayIndex]);
          }

          if (isPres) presencial++;
          else tt++;
        }
      }
    });

    return { periodo, independientes, asuntos, presencial, tt };
  }, [coloredDays, weeklySelections, presencialFirstMonday]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handlePrevYear = () => {
    setCurrentDate(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
  };

  const handleNextYear = () => {
    setCurrentDate(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
  };

  const handleSetYear = (year: number) => {
    if (isNaN(year) || year < 1900 || year > 2100) return;
    setCurrentDate(prev => new Date(year, prev.getMonth(), 1));
  };

  const handleDayClick = (year: number, month: number, day: number) => {
    const dateStr = dateToString(year, month, day);
    setColoredDays(prev => {
      const newColoredDays = { ...prev };
      if (newColoredDays[dateStr] === activeColorId) {
        delete newColoredDays[dateStr];
        return newColoredDays;
      }
      newColoredDays[dateStr] = activeColorId;
      return newColoredDays;
    });
  };

  const handleHeaderDayClick = (year: number, month: number, dayIndex: number) => {
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

  const handlePresencialFirstMondayToggle = (val: boolean) => {
    setPresencialFirstMonday(val);
  };

  const handleAddColor = (label: string, color: string) => {
    const newId = Date.now().toString();
    setLegendColors(prev => [...prev, { id: newId, label, color }]);
    setActiveColorId(newId);
  };

  const handleDeleteColor = (idToDelete: string) => {
    setLegendColors(prev => prev.filter(c => c.id !== idToDelete));
    setColoredDays(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(dateStr => {
        if (updated[dateStr] === idToDelete) {
          delete updated[dateStr];
        }
      });
      return updated;
    });
    if (activeColorId === idToDelete) {
      setActiveColorId('1');
    }
  };

  const handleUpdateItemColor = (id: string, newColor: string) => {
    setLegendColors(prev => prev.map(c => c.id === id ? { ...c, color: newColor } : c));
    setColorSettingsItem(prev => prev ? { ...prev, color: newColor } : null);
  };

  const handleUpdateCant = (key: 'periodo' | 'independientes' | 'asuntos', value: number) => {
    const val = Math.max(0, value);
    setTable4060(prev => ({
      ...prev,
      cant: { ...prev.cant, [key]: val }
    }));
  };

  const handleUpdatePastDisfrutadas = (key: 'periodo' | 'independientes' | 'asuntos', val: number) => {
    const catStats = key === 'periodo' ? calendarStats.periodo : key === 'independientes' ? calendarStats.independientes : calendarStats.asuntos;
    const newPast = Math.max(0, val - catStats);
    setTable4060(prev => ({
      ...prev,
      pastDisfrutadas: { ...prev.pastDisfrutadas, [key]: newPast }
    }));
  };

  const handleUpdatePastPresenc = (val: number) => {
    setTable4060(prev => ({ ...prev, pastPresenc: val }));
  };

  const handleUpdatePastTT = (val: number) => {
    setTable4060(prev => ({ ...prev, pastTT: val }));
  };

  const handleClearTable4060 = () => {
    setTable4060({
      cant: { periodo: 0, independientes: 0, asuntos: 0 },
      pastDisfrutadas: { periodo: 0, independientes: 0, asuntos: 0 },
      pastPresenc: 0,
      pastTT: 0
    });
  };

  const handleClearCalendar = () => {
    setColoredDays({});
    setWeeklySelections({});
    setFixedWeeklySelections({});
  };

  const handleExportPNG = () => {
    setShowExportModal(true);
  };

  const handleConfirmExportPNG = () => {
    setShowExportModal(false);
    setTimeout(() => {
      exportToPNG(exportRef.current);
    }, 100);
  };

  const handleExportData = () => {
    const exportPayload = {
      app: 'PropuestaVacaciones',
      version: 1,
      exportDate: new Date().toISOString(),
      data: {
        coloredDays,
        weeklySelections,
        fixedWeeklySelections,
        presencialFirstMonday,
        legendColors,
        limits,
        table4060,
        showWeekends,
        showNextYearJanuary,
        show4060,
        planningMode,
        viewMode
      }
    };
    exportToJSON(exportPayload);
  };

  const handleTriggerImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const data = parsed.data || parsed;

        if (!data || typeof data !== 'object') {
          alert('El archivo seleccionado no contiene un formato de datos válido.');
          return;
        }

        const hasKnownProps = Boolean(
          data.coloredDays || 
          data.weeklySelections || 
          data.table4060 || 
          data.legendColors || 
          data.limits ||
          typeof data.presencialFirstMonday === 'boolean'
        );

        if (!hasKnownProps) {
          alert('El archivo seleccionado no contiene datos reconocibles de la aplicación.');
          return;
        }

        setPendingImportData(data);
        setShowImportConfirm(true);
      } catch (err) {
        console.error('Error al leer archivo JSON:', err);
        alert('No se pudo procesar el archivo. Asegúrese de que sea un archivo JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!pendingImportData) {
      setShowImportConfirm(false);
      return;
    }

    try {
      const d = pendingImportData;

      if (d.coloredDays && typeof d.coloredDays === 'object') {
        setColoredDays(d.coloredDays);
        try { localStorage.setItem('vacationApp_coloredDays', JSON.stringify(d.coloredDays)); } catch (e) {}
      }
      if (d.weeklySelections && typeof d.weeklySelections === 'object') {
        setWeeklySelections(d.weeklySelections);
        try { localStorage.setItem('vacationApp_weeklySelections', JSON.stringify(d.weeklySelections)); } catch (e) {}
      }
      if (d.fixedWeeklySelections && typeof d.fixedWeeklySelections === 'object') {
        setFixedWeeklySelections(d.fixedWeeklySelections);
        try { localStorage.setItem('vacationApp_fixedWeeklySelections', JSON.stringify(d.fixedWeeklySelections)); } catch (e) {}
      }
      if (typeof d.presencialFirstMonday === 'boolean') {
        setPresencialFirstMonday(d.presencialFirstMonday);
        try {
          localStorage.setItem('vacationApp_presencialFirstMonday', JSON.stringify(d.presencialFirstMonday));
          document.cookie = `vacationApp_presencialFirstMonday=${encodeURIComponent(JSON.stringify(d.presencialFirstMonday))}; path=/; max-age=31536000; SameSite=Lax`;
        } catch (e) {}
      }
      if (Array.isArray(d.legendColors) && d.legendColors.length > 0) {
        setLegendColors(d.legendColors);
        try { localStorage.setItem('vacationApp_legendColors', JSON.stringify(d.legendColors)); } catch (e) {}
      }
      if (d.limits && typeof d.limits === 'object') {
        setLimits(d.limits);
        try { localStorage.setItem('vacationApp_limits', JSON.stringify(d.limits)); } catch (e) {}
      }
      if (d.table4060 && typeof d.table4060 === 'object') {
        setTable4060(d.table4060);
        try {
          const str = JSON.stringify(d.table4060);
          localStorage.setItem('vacationApp_table4060', str);
          document.cookie = `vacationApp_table4060=${encodeURIComponent(str)}; path=/; max-age=31536000; SameSite=Lax`;
        } catch (e) {}
      }
      if (typeof d.show4060 === 'boolean') {
        setShow4060(d.show4060);
        try { localStorage.setItem('vacationApp_show4060', JSON.stringify(d.show4060)); } catch (e) {}
      }
      if (typeof d.showNextYearJanuary === 'boolean') {
        setShowNextYearJanuary(d.showNextYearJanuary);
        try { localStorage.setItem('vacationApp_showNextYearJanuary', JSON.stringify(d.showNextYearJanuary)); } catch (e) {}
      }
      if (d.planningMode === 'libre' || d.planningMode === 'balance') {
        setPlanningMode(d.planningMode);
        try { localStorage.setItem('vacationApp_planningMode', d.planningMode); } catch (e) {}
      }
      if (d.viewMode === 'bimestral' || d.viewMode === 'anual') {
        setViewMode(d.viewMode);
        try { localStorage.setItem('vacationApp_viewMode', d.viewMode); } catch (e) {}
      } else if (d.viewMode === 'semestral') {
        setViewMode('bimestral');
        try { localStorage.setItem('vacationApp_viewMode', 'bimestral'); } catch (e) {}
      }
    } catch (e) {
      console.error('Error al aplicar datos importados:', e);
    } finally {
      setShowImportConfirm(false);
      setPendingImportData(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCancelImport = () => {
    setShowImportConfirm(false);
    setPendingImportData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const currentYear = currentDate.getFullYear();
  const leftYear = currentDate.getFullYear();
  const leftMonth = currentDate.getMonth();
  const rightDate = new Date(leftYear, leftMonth + 1, 1);
  const rightYear = rightDate.getFullYear();
  const rightMonth = rightDate.getMonth();

  // Altura reactiva animada del calendario
  const [calendarHeight, setCalendarHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = calendarAreaRef.current;
    if (!el) return;

    // Medición inmediata del contenedor para ajustar la altura sin retraso
    const initialH = el.offsetHeight || el.scrollHeight;
    if (initialH > 0) {
      setCalendarHeight(Math.round(initialH));
    }

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = Math.round(entry.contentRect.height || (entry.target as HTMLElement).offsetHeight);
        if (h > 0) {
          setCalendarHeight(h);
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewMode, showWeekends, showNextYearJanuary, currentDate, currentYear]);

  return {
    currentDate,
    setCurrentDate,
    exportRef,
    fileInputRef,
    calendarAreaRef,
    calendarHeight,

    showImportConfirm,
    setShowImportConfirm,
    pendingImportData,
    setPendingImportData,
    showClearConfirm,
    setShowClearConfirm,
    showClearTableConfirm,
    setShowClearTableConfirm,
    showHowItWorks,
    setShowHowItWorks,
    howItWorksTarget,
    setHowItWorksTarget,
    handleOpenHowItWorks,
    showWhatIs4060Modal,
    setShowWhatIs4060Modal,
    colorSettingsItem,
    setColorSettingsItem,
    showAddColorModal,
    setShowAddColorModal,
    mobileMenuOpen,
    setMobileMenuOpen,

    viewMode,
    setViewMode,
    isDarkMode,
    toggleDarkMode,
    showWeekends,
    setShowWeekends,
    showNextYearJanuary,
    setShowNextYearJanuary,

    legendColors,
    setLegendColors,
    activeColorId,
    setActiveColorId,
    coloredDays,
    setColoredDays,
    weeklySelections,
    setWeeklySelections,
    presencialFirstMonday,
    setPresencialFirstMonday,
    fixedWeeklySelections,
    setFixedWeeklySelections,
    limits,
    setLimits,

    planningMode,
    setPlanningMode,
    show4060,
    setShow4060,

    table4060,
    setTable4060,
    calendarStats,

    currentYear,
    leftYear,
    leftMonth,
    rightYear,
    rightMonth,

    handlePrevMonth,
    handleNextMonth,
    handlePrevYear,
    handleNextYear,
    handleSetYear,
    handleDayClick,
    handleHeaderDayClick,
    handlePresencialFirstMondayToggle,

    handleAddColor,
    handleDeleteColor,
    handleUpdateItemColor,

    handleUpdateCant,
    handleUpdatePastDisfrutadas,
    handleUpdatePastPresenc,
    handleUpdatePastTT,
    handleClearTable4060,
    handleClearCalendar,

    handleExportPNG,
    handleConfirmExportPNG,
    showExportModal,
    setShowExportModal,
    exportIncludeBalance,
    setExportIncludeBalance,
    exportInclude4060,
    setExportInclude4060,
    handleExportData,
    handleTriggerImport,
    handleFileChange,
    handleConfirmImport,
    handleCancelImport
  };
};

