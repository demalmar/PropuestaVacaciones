import React from 'react';
import { Trash2 } from 'lucide-react';
import { Table4060Data, CalendarStats, LegendColorItem } from '../../types/calendar.ts';

interface BalancePanelProps {
  table4060: Table4060Data;
  calendarStats: CalendarStats;
  legendColors: LegendColorItem[];
  isDarkMode: boolean;
  isExport?: boolean;
  onUpdateCant: (key: 'periodo' | 'independientes' | 'asuntos', value: number) => void;
  onUpdatePastDisfrutadas: (key: 'periodo' | 'independientes' | 'asuntos', value: number) => void;
  onClearTable: () => void;
  showClearConfirm: boolean;
  setShowClearConfirm: (show: boolean) => void;
}

export const BalancePanel: React.FC<BalancePanelProps> = ({
  table4060,
  calendarStats,
  legendColors,
  isDarkMode,
  isExport = false,
  onUpdateCant,
  onUpdatePastDisfrutadas,
  onClearTable,
  showClearConfirm,
  setShowClearConfirm
}) => {
  const cantPeriodo = table4060.cant?.periodo ?? 0;
  const cantIndep = table4060.cant?.independientes ?? 0;
  const cantAsuntos = table4060.cant?.asuntos ?? 0;
  const totalCant = cantPeriodo + cantIndep + cantAsuntos;

  const pastPeriodo = table4060.pastDisfrutadas?.periodo || 0;
  const pastIndep = table4060.pastDisfrutadas?.independientes || 0;
  const pastAsuntos = table4060.pastDisfrutadas?.asuntos || 0;

  const disfPeriodo = pastPeriodo + calendarStats.periodo;
  const disfIndep = pastIndep + calendarStats.independientes;
  const disfAsuntos = pastAsuntos + calendarStats.asuntos;
  const totalDisfrutadas = disfPeriodo + disfIndep + disfAsuntos;

  const quedanPeriodo = cantPeriodo - disfPeriodo;
  const quedanIndep = cantIndep - disfIndep;
  const quedanAsuntos = cantAsuntos - disfAsuntos;
  const totalQuedan = totalCant - totalDisfrutadas;

  const colorPeriodo = legendColors.find(c => c.id === '2')?.color || '#fef08a';
  const colorIndep = legendColors.find(c => c.id === '1')?.color || '#bbf7d0';
  const colorAsuntos = legendColors.find(c => c.id === '3')?.color || '#bae6fd';

  const useDark = isDarkMode && !isExport;
  const hasCategoryExcess = 
    (cantPeriodo > 0 && quedanPeriodo < 0) || 
    (cantIndep > 0 && quedanIndep < 0) || 
    (cantAsuntos > 0 && quedanAsuntos < 0);
  const hasAnyExcess = totalCant > 0 && (totalQuedan < 0 || hasCategoryExcess);
  const totalExcessDays = Math.max(0, -totalQuedan);

  const renderBoxes = (total: number, enjoyed: number, color: string) => {
    if (total === 0) {
      return <span style={{ color: useDark ? '#64748b' : '#94a3b8', fontSize: 'var(--font-size-subtext)' }}>-</span>;
    }

    const safeTotal = Math.max(0, Math.min(total, 45));
    const excess = Math.max(0, enjoyed - safeTotal);
    const allDaysCount = safeTotal + Math.min(excess, 20);

    if (allDaysCount === 0) {
      return <span style={{ color: useDark ? '#64748b' : '#94a3b8', fontSize: 'var(--font-size-subtext)' }}>-</span>;
    }

    const rows: React.ReactNode[] = [];
    const boxSize = '13px';
    const totalRows = Math.ceil(allDaysCount / 5);

    for (let r = 0; r < totalRows; r++) {
      const rowBoxes = [];
      const startIndex = r * 5;
      const endIndex = Math.min(startIndex + 5, allDaysCount);
      const rowLength = endIndex - startIndex;

      for (let col = 0; col < rowLength; col++) {
        const dayIndex = startIndex + col;
        const isExcess = dayIndex >= safeTotal;
        const isFilled = isExcess ? false : dayIndex < enjoyed;

        if (isExcess) {
          rowBoxes.push(
            <span
              key={`day-${dayIndex}`}
              style={{
                width: boxSize,
                height: boxSize,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1.5px dashed #ef4444',
                borderRadius: '2px',
                display: 'inline-block',
                boxShadow: '0 1px 3px rgba(239, 68, 68, 0.15)',
                flexShrink: 0
              }}
              title={`Día ${dayIndex + 1} (Exceso sobre el cupo permitido)`}
            />
          );
        } else {
          rowBoxes.push(
            <span
              key={`day-${dayIndex}`}
              style={{
                width: boxSize,
                height: boxSize,
                backgroundColor: isFilled ? color : 'transparent',
                border: isFilled 
                  ? '1px solid rgba(0, 0, 0, 0.35)' 
                  : (useDark ? '1px dashed #475569' : '1px solid #cbd5e1'),
                borderRadius: '2px',
                display: 'inline-block',
                boxShadow: isFilled ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                flexShrink: 0
              }}
              title={isFilled ? `Día ${dayIndex + 1} disfrutado` : `Día ${dayIndex + 1} pendiente`}
            />
          );
        }
      }

      rows.push(
        <div 
          key={`row-${r}`} 
          className="is-flex is-align-items-center"
          style={{ gap: '3px' }}
        >
          {rowBoxes}
        </div>
      );
    }

    return (
      <div className="is-flex is-flex-direction-column is-align-items-flex-start" style={{ gap: '3px', width: 'fit-content' }}>
        {rows}
        {excess > 0 && (
          <span 
            className="tag is-danger is-light mt-1 py-0 px-2" 
            style={{ fontSize: 'var(--font-size-badge)', height: '20px', fontWeight: 800, borderRadius: '4px' }}
            title={`Has superado en ${excess} días esta categoría`}
          >
            +{excess} exceso
          </span>
        )}
      </div>
    );
  };

  return (
    <div 
      className="box p-4 is-flex is-flex-direction-column is-flex-grow-1 mb-0"
      style={{
        border: useDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1',
        borderRadius: '14px',
        backgroundColor: useDark ? '#17202e' : '#ffffff',
        boxShadow: useDark ? 'none' : '0 4px 20px -2px rgba(15, 118, 110, 0.08)',
        width: '100%'
      }}
    >
      {/* Cabecera del Panel Balance */}
      <div className="is-flex is-align-items-center is-justify-content-space-between mb-3 pb-2" style={{ borderBottom: useDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
        <div className="is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
          <span style={{ fontSize: '20px' }}>📊</span>
          <h3 className="title is-6 mb-0" style={{ color: useDark ? '#f8fafc' : '#0f172a', fontWeight: 800, fontSize: 'var(--font-size-title-panel)' }}>
            Balance
          </h3>
        </div>
        {!isExport && (
          <div className="is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
            {showClearConfirm ? (
              <div className="is-flex is-align-items-center" style={{ gap: '0.35rem' }}>
                <span style={{ fontSize: 'var(--font-size-note)', fontWeight: 600, color: useDark ? '#fca5a5' : '#dc2626' }}>
                  ¿Limpiar tabla?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClearTable();
                    setShowClearConfirm(false);
                  }}
                  className="button is-small is-danger py-0 px-2"
                  style={{ height: '26px', fontSize: 'var(--font-size-subtext)', borderRadius: '6px', fontWeight: 700 }}
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="button is-small is-light py-0 px-2"
                  style={{ height: '26px', fontSize: 'var(--font-size-subtext)', borderRadius: '6px' }}
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="button is-small is-light"
                style={{
                  borderRadius: '8px',
                  height: '28px',
                  gap: '0.4rem',
                  fontWeight: 600,
                  fontSize: 'var(--font-size-note)',
                  color: useDark ? '#fca5a5' : '#e11d48',
                  border: useDark ? '1px solid #475569' : '1px solid #cbd5e1'
                }}
                title="Pone a 0 las cantidades y días disfrutados de esta tabla (no borra los días del calendario)"
              >
                <Trash2 size={13} />
                <span>Limpiar todo</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Banner de aviso cuando se supera el cupo de días */}
      {hasAnyExcess && (
        <div 
          className="notification is-danger is-light p-3 mb-3" 
          style={{ 
            borderRadius: '10px', 
            border: isDarkMode ? '1px solid #7f1d1d' : '1px solid #fecdd3',
            backgroundColor: isDarkMode ? '#2d1217' : '#fff1f2',
            fontSize: 'var(--font-size-header-table)',
            lineHeight: 1.45
          }}
        >
          <div className="is-flex is-align-items-start" style={{ gap: '0.5rem' }}>
            <span style={{ fontSize: '16px', lineHeight: 1 }}>⚠️</span>
            <div>
              <strong style={{ color: isDarkMode ? '#f87171' : '#be123c', fontSize: 'var(--font-size-header-section)' }}>
                {totalExcessDays > 0 
                  ? `Has marcado ${totalExcessDays} ${totalExcessDays === 1 ? 'día' : 'días'} más de los permitidos en el balance total.`
                  : 'Has superado el cupo disponible en alguna de las categorías.'}
              </strong>
              <div className="mt-1" style={{ color: isDarkMode ? '#fecdd3' : '#9f1239', fontSize: 'var(--font-size-subtext)' }}>
                Haz clic en el calendario sobre los días que desees descartar o aumenta la casilla <strong>"Cant."</strong> si dispones de días adicionales por antigüedad o trienios.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABLA DE BALANCE */}
      <div style={{ overflowX: 'auto', flexGrow: 1 }}>
        <table 
          className="table is-bordered is-fullwidth is-narrow mb-0" 
          style={{ 
            backgroundColor: 'transparent',
            color: useDark ? '#e2e8f0' : '#1e293b',
            fontSize: 'var(--font-size-table-cell)'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: useDark ? '#1e293b' : '#f1f5f9' }}>
              <th style={{ color: useDark ? '#cbd5e1' : '#334155', fontWeight: 800, fontSize: 'var(--font-size-header-table)' }}>Tipo de día libre</th>
              <th className="has-text-centered" style={{ width: '64px', color: useDark ? '#cbd5e1' : '#334155', fontWeight: 800, fontSize: 'var(--font-size-header-table)' }}>Cant.</th>
              {!isExport && (
                <th className="has-text-left" style={{ width: '96px', paddingLeft: '10px', color: useDark ? '#cbd5e1' : '#334155', fontWeight: 800, fontSize: 'var(--font-size-header-table)' }}>Progreso</th>
              )}
              <th className="has-text-centered" style={{ width: '70px', color: useDark ? '#cbd5e1' : '#334155', fontWeight: 800, fontSize: 'var(--font-size-header-table)' }}>Disfrutadas</th>
              <th className="has-text-centered" style={{ width: '66px', color: useDark ? '#cbd5e1' : '#334155', fontWeight: 800, fontSize: 'var(--font-size-header-table)' }}>Quedan</th>
            </tr>
          </thead>
          <tbody>
            {/* Fila 1: Independientes (individuales primero, como las etiquetas) */}
            <tr>
              <td 
                style={{ 
                  backgroundColor: useDark ? 'rgba(187, 247, 208, 0.15)' : '#dcfce7', 
                  verticalAlign: 'middle',
                  padding: '6px 8px'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 'var(--font-size-table-cell)', color: useDark ? '#f8fafc' : '#0f172a' }}>
                  Vac. Independientes
                </div>
              </td>
              <td className="has-text-centered p-1" style={{ verticalAlign: 'middle' }}>
                {!isExport ? (
                  <input 
                    type="number" 
                    min="0"
                    value={cantIndep} 
                    onChange={(e) => onUpdateCant('independientes', parseInt(e.target.value) || 0)}
                    className="input is-small has-text-centered has-text-weight-bold" 
                    style={{ width: '54px', height: '30px', padding: '2px', borderRadius: '5px', fontSize: 'var(--font-size-input)' }}
                  />
                ) : (
                  <span style={{ fontWeight: 700, fontSize: 'var(--font-size-table-cell)' }}>{cantIndep}</span>
                )}
              </td>
              {!isExport && (
                <td className="p-1" style={{ verticalAlign: 'middle', paddingLeft: '10px' }}>
                  {renderBoxes(cantIndep, disfIndep, colorIndep)}
                </td>
              )}
              <td className="has-text-centered p-1" style={{ verticalAlign: 'middle' }}>
                {!isExport ? (
                  <input 
                    type="number" 
                    min="0"
                    value={disfIndep} 
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      onUpdatePastDisfrutadas('independientes', val);
                    }}
                    className="input is-small has-text-centered has-text-weight-bold" 
                    style={{ width: '54px', height: '30px', padding: '2px', borderRadius: '5px', fontSize: 'var(--font-size-input)' }}
                    title="Días disfrutados (sumando los del calendario y previos no marcados)"
                  />
                ) : (
                  <span style={{ fontWeight: 700, color: '#0f766e', fontSize: 'var(--font-size-table-cell)' }}>{disfIndep}</span>
                )}
              </td>
              <td className="has-text-centered p-1" style={{ verticalAlign: 'middle' }}>
                <span 
                  style={{ 
                    fontWeight: 800, 
                    fontSize: 'var(--font-size-kpi-medium)',
                    color: (cantIndep > 0 && quedanIndep < 0) ? '#ef4444' : (useDark ? '#f8fafc' : '#0f172a') 
                  }}
                >
                  {quedanIndep}
                </span>
              </td>
            </tr>

            {/* Fila 2: Por periodo / anuales (grupo) */}
            <tr>
              <td 
                style={{ 
                  backgroundColor: useDark ? 'rgba(254, 240, 138, 0.15)' : '#fef9c3', 
                  verticalAlign: 'middle',
                  padding: '6px 8px'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 'var(--font-size-table-cell)', color: useDark ? '#f8fafc' : '#0f172a', lineHeight: 1.25 }}>
                  Vac. por periodo / anuales
                </div>
                <div 
                  style={{ 
                    fontSize: 'var(--font-size-subtext)', 
                    fontWeight: 500, 
                    color: useDark ? '#94a3b8' : '#475569', 
                    marginTop: '2px',
                    lineHeight: 1.2
                  }}
                >
                  (5 mínimo)
                </div>
              </td>
              <td className="has-text-centered p-1" style={{ verticalAlign: 'middle' }}>
                {!isExport ? (
                  <input 
                    type="number" 
                    min="0"
                    value={cantPeriodo} 
                    onChange={(e) => onUpdateCant('periodo', parseInt(e.target.value) || 0)}
                    className="input is-small has-text-centered has-text-weight-bold" 
                    style={{ width: '54px', height: '30px', padding: '2px', borderRadius: '5px', fontSize: 'var(--font-size-input)' }}
                  />
                ) : (
                  <span style={{ fontWeight: 700, fontSize: 'var(--font-size-table-cell)' }}>{cantPeriodo}</span>
                )}
              </td>
              {!isExport && (
                <td className="p-1" style={{ verticalAlign: 'middle', paddingLeft: '10px' }}>
                  {renderBoxes(cantPeriodo, disfPeriodo, colorPeriodo)}
                </td>
              )}
              <td className="has-text-centered p-1" style={{ verticalAlign: 'middle' }}>
                {!isExport ? (
                  <input 
                    type="number" 
                    min="0"
                    value={disfPeriodo} 
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      onUpdatePastDisfrutadas('periodo', val);
                    }}
                    className="input is-small has-text-centered has-text-weight-bold" 
                    style={{ width: '54px', height: '30px', padding: '2px', borderRadius: '5px', fontSize: 'var(--font-size-input)' }}
                    title="Días disfrutados (sumando los del calendario y previos no marcados)"
                  />
                ) : (
                  <span style={{ fontWeight: 700, color: '#0f766e', fontSize: 'var(--font-size-table-cell)' }}>{disfPeriodo}</span>
                )}
              </td>
              <td className="has-text-centered p-1" style={{ verticalAlign: 'middle' }}>
                <span 
                  style={{ 
                    fontWeight: 800, 
                    fontSize: 'var(--font-size-kpi-medium)',
                    color: (cantPeriodo > 0 && quedanPeriodo < 0) ? '#ef4444' : (useDark ? '#f8fafc' : '#0f172a') 
                  }}
                >
                  {quedanPeriodo}
                </span>
              </td>
            </tr>

            {/* Fila 3: Asuntos Particulares / Moscosos */}
            <tr>
              <td 
                style={{ 
                  backgroundColor: useDark ? 'rgba(186, 230, 253, 0.15)' : '#e0f2fe', 
                  verticalAlign: 'middle',
                  padding: '6px 8px'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 'var(--font-size-table-cell)', color: useDark ? '#f8fafc' : '#0f172a', lineHeight: 1.25 }}>
                  Asuntos Particulares
                </div>
                <div 
                  style={{ 
                    fontSize: 'var(--font-size-subtext)', 
                    fontWeight: 500, 
                    color: useDark ? '#94a3b8' : '#475569', 
                    marginTop: '2px',
                    lineHeight: 1.2
                  }}
                >
                  Moscosos
                </div>
              </td>
              <td className="has-text-centered p-1" style={{ verticalAlign: 'middle' }}>
                {!isExport ? (
                  <input 
                    type="number" 
                    min="0"
                    value={cantAsuntos} 
                    onChange={(e) => onUpdateCant('asuntos', parseInt(e.target.value) || 0)}
                    className="input is-small has-text-centered has-text-weight-bold" 
                    style={{ width: '54px', height: '30px', padding: '2px', borderRadius: '5px', fontSize: 'var(--font-size-input)' }}
                  />
                ) : (
                  <span style={{ fontWeight: 700, fontSize: 'var(--font-size-table-cell)' }}>{cantAsuntos}</span>
                )}
              </td>
              {!isExport && (
                <td className="p-1" style={{ verticalAlign: 'middle', paddingLeft: '10px' }}>
                  {renderBoxes(cantAsuntos, disfAsuntos, colorAsuntos)}
                </td>
              )}
              <td className="has-text-centered p-1" style={{ verticalAlign: 'middle' }}>
                {!isExport ? (
                  <input 
                    type="number" 
                    min="0"
                    value={disfAsuntos} 
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      onUpdatePastDisfrutadas('asuntos', val);
                    }}
                    className="input is-small has-text-centered has-text-weight-bold" 
                    style={{ width: '54px', height: '30px', padding: '2px', borderRadius: '5px', fontSize: 'var(--font-size-input)' }}
                    title="Días disfrutados (sumando los del calendario y previos no marcados)"
                  />
                ) : (
                  <span style={{ fontWeight: 700, color: '#0f766e', fontSize: 'var(--font-size-table-cell)' }}>{disfAsuntos}</span>
                )}
              </td>
              <td className="has-text-centered p-1" style={{ verticalAlign: 'middle' }}>
                <span 
                  style={{ 
                    fontWeight: 800, 
                    fontSize: 'var(--font-size-kpi-medium)',
                    color: (cantAsuntos > 0 && quedanAsuntos < 0) ? '#ef4444' : (useDark ? '#f8fafc' : '#0f172a') 
                  }}
                >
                  {quedanAsuntos}
                </span>
              </td>
            </tr>

            {/* Fila Total */}
            <tr style={{ backgroundColor: useDark ? '#1e293b' : '#f8fafc', fontWeight: 800 }}>
              <td style={{ verticalAlign: 'middle', padding: '6px 8px', fontSize: 'var(--font-size-label)' }}>Total</td>
              <td className="has-text-centered" style={{ verticalAlign: 'middle', fontSize: 'var(--font-size-header-section)' }}>{totalCant}</td>
              {!isExport && (
                <td className="p-1 has-text-centered" style={{ verticalAlign: 'middle' }}>
                  <span className="has-text-weight-bold font-monospace" style={{ fontSize: 'var(--font-size-header-table)', color: useDark ? '#94a3b8' : '#64748b' }}>
                    {totalDisfrutadas} / {totalCant}
                  </span>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: useDark ? '#94a3b8' : '#64748b' }}>
                    ({totalCant > 0 ? Math.round((totalDisfrutadas / totalCant) * 100) : 0}%)
                  </div>
                </td>
              )}
              <td className="has-text-centered" style={{ verticalAlign: 'middle', fontSize: 'var(--font-size-header-section)', color: useDark ? '#5eead4' : '#0f766e' }}>{totalDisfrutadas}</td>
              <td className="has-text-centered" style={{ verticalAlign: 'middle', fontSize: 'var(--font-size-header-section)', color: (totalCant > 0 && totalQuedan < 0) ? '#ef4444' : (useDark ? '#f8fafc' : '#0f172a') }}>{totalQuedan}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

