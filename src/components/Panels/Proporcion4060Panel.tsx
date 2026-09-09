import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Table4060Data, CalendarStats } from '../../types/calendar.ts';

interface Proporcion4060PanelProps {
  table4060: Table4060Data;
  calendarStats: CalendarStats;
  isDarkMode: boolean;
  isExport?: boolean;
  onUpdatePastPresenc: (val: number) => void;
  onUpdatePastTT: (val: number) => void;
  onOpenHelpModal: () => void;
}

export const Proporcion4060Panel: React.FC<Proporcion4060PanelProps> = ({
  table4060,
  calendarStats,
  isDarkMode,
  isExport = false,
  onUpdatePastPresenc,
  onUpdatePastTT,
  onOpenHelpModal
}) => {
  const cantPeriodo = table4060.cant?.periodo ?? 0;
  const cantIndep = table4060.cant?.independientes ?? 0;

  // El 100% de las vacaciones para la regla 40-60 es el total de días por periodo + individuales
  const totalVacaciones4060 = cantPeriodo + cantIndep;
  const targetPresencDays = Math.round(totalVacaciones4060 * 0.4);
  const targetTTDays = totalVacaciones4060 - targetPresencDays;

  // Presenc y TT se calculan a partir de los días previos configurados + los marcados dinámicamente en el calendario
  const pastPresenc = table4060.pastPresenc || 0;
  const pastTT = table4060.pastTT || 0;

  const presencDays = pastPresenc + calendarStats.presencial;
  const ttDays = pastTT + calendarStats.tt;

  const totalModalityDays = presencDays + ttDays;
  const baseTotal = totalModalityDays > 0 ? totalModalityDays : (totalVacaciones4060 > 0 ? totalVacaciones4060 : 0);
  const presencPctVal = baseTotal > 0 ? (presencDays / baseTotal) * 100 : 0;
  const ttPctVal = baseTotal > 0 ? (ttDays / baseTotal) * 100 : 0;

  const presencPctStr = `${presencPctVal.toFixed(1).replace('.', ',')}%`;
  const ttPctStr = `${ttPctVal.toFixed(1).replace('.', ',')}%`;

  const presencBarWidth = totalModalityDays > 0 ? Math.min(100, Math.max(0, presencPctVal)) : 0;
  const ttBarWidth = totalModalityDays > 0 ? Math.min(100, Math.max(0, 100 - presencBarWidth)) : 0;

  const presencRemainingGoal = Math.max(0, targetPresencDays - presencDays);
  const ttRemainingGoal = Math.max(0, targetTTDays - ttDays);

  const useDark = isDarkMode && !isExport;

  // Paleta de alto contraste para 40-60:
  // Presencial: Azul Bulma oficial #3273dc
  const presencColor = useDark ? '#60a5fa' : '#3273dc';
  const presencBarColor = '#3273dc';
  const presencBgTint = useDark ? 'rgba(50, 115, 220, 0.18)' : 'rgba(50, 115, 220, 0.08)';
  const presencTagBg = useDark ? 'rgba(50, 115, 220, 0.22)' : 'rgba(50, 115, 220, 0.1)';
  const presencTagColor = useDark ? '#93c5fd' : '#3273dc';

  // Teletrabajo: Verde esmeralda luminoso de alto contraste (sin componente azul)
  const ttColor = useDark ? '#4ade80' : '#15803d';
  const ttBarColor = useDark ? '#22c55e' : '#16a34a';
  const ttBgTint = useDark ? 'rgba(34, 197, 94, 0.16)' : 'rgba(22, 163, 74, 0.08)';
  const ttTagBg = useDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(22, 163, 74, 0.1)';
  const ttTagColor = useDark ? '#4ade80' : '#15803d';

  return (
    <div 
      className="box p-4 is-flex is-flex-direction-column is-flex-grow-1 mb-0"
      style={{
        border: useDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1',
        borderRadius: '14px',
        backgroundColor: useDark ? '#17202e' : '#ffffff',
        boxShadow: useDark ? 'none' : '0 4px 20px -2px rgba(15, 118, 110, 0.08)',
        width: '100%',
        height: 'auto',
        minHeight: 'auto'
      }}
    >
      {/* Cabecera del Panel Proporción 40-60 */}
      <div className="is-flex is-align-items-center is-justify-content-space-between mb-3 pb-2" style={{ borderBottom: useDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
        <div className="is-flex is-align-items-center" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '20px' }}>⚖️</span>
          <h3 className="title is-6 mb-0 panel-title" style={{ color: useDark ? '#f8fafc' : '#0f172a', fontWeight: 'var(--font-weight-extrabold)', fontSize: 'var(--font-size-title-panel)' }}>
            Proporción 40-60
          </h3>
        </div>
        {!isExport && (
          <button
            type="button"
            onClick={onOpenHelpModal}
            className="button is-small is-ghost px-2 py-0"
            style={{
              fontSize: 'var(--font-size-note)',
              height: '26px',
              color: useDark ? '#5eead4' : '#0f766e',
              textDecoration: 'underline',
              fontWeight: 'var(--font-weight-semibold)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer'
            }}
            title="Información sobre la regla 40-60 y contexto normativo"
          >
            <HelpCircle size={14} />
            <span>¿Qué es esto?</span>
          </button>
        )}
      </div>

      <div 
        className="p-3 is-flex is-flex-direction-column is-justify-content-space-between is-flex-grow-1" 
        style={{ 
          backgroundColor: useDark ? '#1e293b' : '#f8fafc',
          borderRadius: '12px',
          border: useDark ? '1px solid #334155' : '1px solid #e2e8f0',
          height: 'auto',
          gap: '0.5rem'
        }}
      >
        <div>
          {/* Tabla de Presencial vs TT */}
          <table 
            className="table is-bordered is-fullwidth is-narrow mb-2 has-text-centered" 
            style={{ 
              backgroundColor: 'transparent',
              color: useDark ? '#e2e8f0' : '#1e293b',
              fontSize: 'var(--font-size-table-cell)'
            }}
          >
            <thead>
              <tr style={{ backgroundColor: useDark ? '#141d2b' : '#f1f5f9' }}>
                <th className="has-text-centered table-header" style={{ width: '50%', color: presencColor, fontWeight: 'var(--font-weight-extrabold)', fontSize: 'var(--font-size-header-section)' }}>
                  🏢 Presencial
                </th>
                <th className="has-text-centered table-header" style={{ width: '50%', color: ttColor, fontWeight: 'var(--font-weight-extrabold)', fontSize: 'var(--font-size-header-section)' }}>
                  💻 Teletrabajo
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Fila Días Previos */}
              <tr style={{ backgroundColor: useDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff' }}>
                <td style={{ verticalAlign: 'middle', padding: '6px 8px' }}>
                  <div className="is-flex is-align-items-center is-justify-content-center" style={{ gap: '0.45rem' }}>
                    <span style={{ fontSize: 'var(--font-size-note)', fontWeight: 'var(--font-weight-bold)', color: useDark ? '#94a3b8' : '#64748b' }}>
                      Previos:
                    </span>
                    {!isExport ? (
                      <input 
                        type="number" 
                        min="0"
                        value={pastPresenc}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value) || 0);
                          onUpdatePastPresenc(val);
                        }}
                        className="input is-small has-text-centered has-text-weight-bold" 
                        style={{ width: '52px', height: '28px', padding: '2px', borderRadius: '5px', fontSize: 'var(--font-size-input)' }}
                        title="Días presenciales disfrutados previamente fuera de este calendario"
                      />
                    ) : (
                      <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-header-table)' }}>{pastPresenc}</span>
                    )}
                  </div>
                </td>
                <td style={{ verticalAlign: 'middle', padding: '6px 8px' }}>
                  <div className="is-flex is-align-items-center is-justify-content-center" style={{ gap: '0.45rem' }}>
                    <span style={{ fontSize: 'var(--font-size-note)', fontWeight: 'var(--font-weight-bold)', color: useDark ? '#94a3b8' : '#64748b' }}>
                      Previos:
                    </span>
                    {!isExport ? (
                      <input 
                        type="number" 
                        min="0"
                        value={pastTT}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value) || 0);
                          onUpdatePastTT(val);
                        }}
                        className="input is-small has-text-centered has-text-weight-bold" 
                        style={{ width: '52px', height: '28px', padding: '2px', borderRadius: '5px', fontSize: 'var(--font-size-input)' }}
                        title="Días en teletrabajo disfrutados previamente fuera de este calendario"
                      />
                    ) : (
                      <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-header-table)' }}>{pastTT}</span>
                    )}
                  </div>
                </td>
              </tr>

              {/* Fila Total Días (Previos + Calendario) */}
              <tr>
                <td style={{ verticalAlign: 'middle', padding: '8px 8px', backgroundColor: presencBgTint }}>
                  <span className="kpi-large" style={{ fontSize: 'var(--font-size-kpi-large)', fontWeight: 'var(--font-weight-black)', color: presencColor }}>
                    {presencDays}
                  </span>
                  <div className="subtext-helper" style={{ fontSize: 'var(--font-size-subtext)', fontWeight: 'var(--font-weight-semibold)', color: presencColor, marginTop: '-2px' }}>
                    ({pastPresenc} prev. + {calendarStats.presencial} cal.)
                  </div>
                </td>
                <td style={{ verticalAlign: 'middle', padding: '8px 8px', backgroundColor: ttBgTint }}>
                  <span className="kpi-large" style={{ fontSize: 'var(--font-size-kpi-large)', fontWeight: 'var(--font-weight-black)', color: ttColor }}>
                    {ttDays}
                  </span>
                  <div className="subtext-helper" style={{ fontSize: 'var(--font-size-subtext)', fontWeight: 'var(--font-weight-semibold)', color: ttColor, marginTop: '-2px' }}>
                    ({pastTT} prev. + {calendarStats.tt} cal.)
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Bloque unificado: Proporciones 40/60 y Barra con Meta */}
          <div 
            className="p-3 my-2" 
            style={{ 
              backgroundColor: useDark ? '#141d2b' : '#ffffff',
              borderRadius: '10px',
              border: useDark ? '1px solid #334155' : '1px solid #cbd5e1',
              boxShadow: useDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            {/* Números grandes de un vistazo y metas */}
            <div className="is-flex is-justify-content-space-between is-align-items-flex-start mb-2">
              {/* Presencial */}
              <div>
                <div className="is-flex is-align-items-center" style={{ gap: '0.4rem' }}>
                  <span style={{ fontSize: '15px' }}>🏢</span>
                  <span className="kpi-huge" style={{ fontSize: 'var(--font-size-kpi-huge)', fontWeight: 'var(--font-weight-black)', color: presencColor, lineHeight: 1 }}>
                    {presencPctStr}
                  </span>
                </div>
                <div className="mt-1">
                  <span 
                    className="tag py-0 px-2" 
                    style={{ 
                      fontSize: 'var(--font-size-badge)', 
                      height: '22px', 
                      fontWeight: 'var(--font-weight-bold)', 
                      borderRadius: '4px',
                      backgroundColor: presencTagBg,
                      color: presencTagColor,
                      border: `1px solid ${useDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(50, 115, 220, 0.25)'}`
                    }}
                  >
                    Meta: 40%
                  </span>
                </div>
              </div>

              {/* Teletrabajo */}
              <div className="has-text-right">
                <div className="is-flex is-align-items-center is-justify-content-flex-end" style={{ gap: '0.4rem' }}>
                  <span className="kpi-huge" style={{ fontSize: 'var(--font-size-kpi-huge)', fontWeight: 'var(--font-weight-black)', color: ttColor, lineHeight: 1 }}>
                    {ttPctStr}
                  </span>
                  <span style={{ fontSize: '15px' }}>💻</span>
                </div>
                <div className="mt-1 is-flex is-justify-content-flex-end">
                  <span 
                    className="tag py-0 px-2" 
                    style={{ 
                      fontSize: 'var(--font-size-badge)', 
                      height: '22px', 
                      fontWeight: 'var(--font-weight-bold)', 
                      borderRadius: '4px',
                      backgroundColor: ttTagBg,
                      color: ttTagColor,
                      border: `1px solid ${useDark ? 'rgba(74, 222, 128, 0.3)' : 'rgba(22, 163, 74, 0.25)'}`
                    }}
                  >
                    Meta: 60%
                  </span>
                </div>
              </div>
            </div>

            {/* Barra de distribución de color */}
            <div 
              style={{ 
                width: '100%', 
                height: '14px', 
                backgroundColor: useDark ? '#334155' : '#e2e8f0', 
                borderRadius: '9999px', 
                overflow: 'hidden',
                display: 'flex',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                marginTop: '6px'
              }}
            >
              <div 
                style={{ 
                  width: `${presencBarWidth}%`, 
                  backgroundColor: presencBarColor, 
                  transition: 'width 0.25s ease' 
                }} 
                title={`Presencial: ${presencPctStr}`}
              />
              <div 
                style={{ 
                  width: `${ttBarWidth}%`, 
                  backgroundColor: ttBarColor, 
                  transition: 'width 0.25s ease' 
                }} 
                title={`Teletrabajo: ${ttPctStr}`}
              />
            </div>
          </div>
        </div>

        {/* Sugerencia para cumplir la regla */}
        <div 
          className="p-2.5 mt-2"
          style={{
            backgroundColor: useDark ? '#141d2b' : '#ffffff',
            borderRadius: '8px',
            fontSize: 'var(--font-size-note)',
            border: useDark ? '1px solid #334155' : '1px solid #cbd5e1',
            color: useDark ? '#cbd5e1' : '#475569',
            lineHeight: 1.45
          }}
        >
          {totalVacaciones4060 === 0 ? (
            <span>Establece los días de vacaciones en la tabla de Balance para calcular la proporción 40/60.</span>
          ) : (
            <span>
              Del total de <strong>{totalVacaciones4060}</strong> días de vacaciones, <strong>{cantIndep}</strong> individuales y <strong>{cantPeriodo}</strong> por periodo, para alcanzar la meta 40/60 restan <strong>{presencRemainingGoal}</strong> días presenciales y <strong>{ttRemainingGoal}</strong> días en teletrabajo.
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

