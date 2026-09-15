import type { ColoredDays, LegendColorItem } from '../types/calendar.ts';
import { dateToString } from './dateUtils.ts';

export interface ConflictInfo {
  dateStr: string;
  hasPeriodo: boolean;
  hasMoscoso: boolean;
  hasIndep: boolean;
  message: string;
}

/**
 * Detecta cadenas contiguas de días de ausencia donde se combinan indebidamente
 * "Vacaciones por periodo" y "Asuntos propios / Moscosos" (ya sea de forma directa
 * o mediante días individuales/independientes interpuestos).
 *
 * Normas de contigüidad:
 * - Los fines de semana (Sáb/Dom) NO rompen la unión (Viernes y Lunes se consideran pegados).
 * - Los festivos SÍ rompen la unión.
 * - Los días laborables sin permiso solicitado SÍ rompen la unión.
 */
export const getConsecutiveRuleConflicts = (
  coloredDays: ColoredDays,
  legendColors: LegendColorItem[],
  currentYear: number,
  showNextYearJanuary: boolean = false
): Map<string, ConflictInfo> => {
  const conflicts = new Map<string, ConflictInfo>();

  // Identificadores de tipos de permisos
  const isPeriodoId = (id: string | undefined): boolean => {
    if (!id) return false;
    if (id === '2') return true;
    const c = legendColors.find(item => item.id === id);
    return Boolean(c && c.label.toLowerCase().includes('periodo'));
  };

  const isMoscosoId = (id: string | undefined): boolean => {
    if (!id) return false;
    if (id === '3') return true;
    const c = legendColors.find(item => item.id === id);
    return Boolean(c && (c.label.toLowerCase().includes('asunto') || c.label.toLowerCase().includes('moscoso')));
  };

  const isIndepId = (id: string | undefined): boolean => {
    if (!id) return false;
    if (id === '1') return true;
    const c = legendColors.find(item => item.id === id);
    return Boolean(c && (c.label.toLowerCase().includes('independiente') || c.label.toLowerCase().includes('individual')));
  };

  const isFestivoId = (id: string | undefined): boolean => {
    if (!id) return false;
    if (id === '4') return true;
    const c = legendColors.find(item => item.id === id);
    return Boolean(c && c.label.toLowerCase().includes('festivo'));
  };

  // Rango de fechas a explorar: desde el año actual hasta enero del siguiente si procede,
  // con un margen antes y después para capturar solapes entre años.
  const allDateKeys = Object.keys(coloredDays);
  let startYear = currentYear;
  let endYear = showNextYearJanuary ? currentYear + 1 : currentYear;

  if (allDateKeys.length > 0) {
    for (const k of allDateKeys) {
      const y = parseInt(k.split('-')[0], 10);
      if (!isNaN(y)) {
        if (y < startYear) startYear = y;
        if (y > endYear) endYear = y;
      }
    }
  }

  // Empezar unos días antes del inicio del año (para transiciones de fin de semana)
  const iterDate = new Date(startYear, 0, 1);
  iterDate.setDate(iterDate.getDate() - 7);

  // Terminar unos días después
  const endDate = new Date(endYear, showNextYearJanuary ? 1 : 11, showNextYearJanuary ? 31 : 31);
  endDate.setDate(endDate.getDate() + 7);

  // Estructura de bloque contiguo actual
  interface BlockItem {
    dateStr: string;
    type: 'periodo' | 'moscoso' | 'indep';
  }

  let currentBlock: BlockItem[] = [];

  const evaluateAndFlushBlock = () => {
    if (currentBlock.length > 0) {
      const hasPeriodo = currentBlock.some(b => b.type === 'periodo');
      const hasMoscoso = currentBlock.some(b => b.type === 'moscoso');
      const hasIndep = currentBlock.some(b => b.type === 'indep');

      // Si conviven vacaciones por periodo y moscosos en la misma cadena -> Infracción
      if (hasPeriodo && hasMoscoso) {
        let msg = 'Incompatibilidad de días consecutivos: No se pueden unir vacaciones por periodo y días de asuntos propios (moscosos)';
        if (hasIndep) {
          msg += ', ni directamente ni intercalando días de vacaciones individuales.';
        } else {
          msg += ' de forma directa.';
        }

        for (const item of currentBlock) {
          conflicts.set(item.dateStr, {
            dateStr: item.dateStr,
            hasPeriodo,
            hasMoscoso,
            hasIndep,
            message: msg
          });
        }
      }

      currentBlock = [];
    }
  };

  while (iterDate <= endDate) {
    const dayOfWeek = iterDate.getDay(); // 0 = Domingo, 6 = Sábado
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dateKey = dateToString(iterDate.getFullYear(), iterDate.getMonth(), iterDate.getDate());
    const colorId = coloredDays[dateKey];

    if (isFestivoId(colorId)) {
      // Un día festivo rompe cualquier cadena de días pegados
      evaluateAndFlushBlock();
    } else if (isWeekend) {
      // Los fines de semana no rompen la cadena entre viernes y lunes a menos que sea festivo
      // No hacemos nada, permitimos que continúe el bloque
    } else {
      // Día laborable (Lunes a Viernes)
      if (isPeriodoId(colorId)) {
        currentBlock.push({ dateStr: dateKey, type: 'periodo' });
      } else if (isMoscosoId(colorId)) {
        currentBlock.push({ dateStr: dateKey, type: 'moscoso' });
      } else if (isIndepId(colorId)) {
        currentBlock.push({ dateStr: dateKey, type: 'indep' });
      } else {
        // Día laborable no solicitado (libre o no marcado) o de otro tipo: rompe la cadena
        evaluateAndFlushBlock();
      }
    }

    iterDate.setDate(iterDate.getDate() + 1);
  }

  evaluateAndFlushBlock();

  return conflicts;
};
