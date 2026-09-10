import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';
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
  const [showPreviosInfo, setShowPreviosInfo] = useState(false);
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

  const isZeroModality = totalModalityDays === 0;
  const presencBarWidth = isZeroModality ? 40 : Math.min(100, Math.max(0, presencPctVal));
  const ttBarWidth = isZeroModality ? 60 : Math.min(100, Math.max(0, 100 - presencBarWidth));

  const presencRemainingGoal = Math.max(0, targetPresencDays - presencDays);
  const ttRemainingGoal = Math.max(0, targetTTDays - ttDays);

  const useDark = isDarkMode && !isExport;

  // Paleta de alto contraste para 40-60:
  // Presencial: Azul Bulma oficial #3273dc
  const presencColor = useDark ? '#60a5fa' : '#3273dc';
  const presencBarColor = '#3273dc';
  const presencBgTint = useDark ? 'rgba(50, 115, 220, 0.18)' : 'rgba(50, 115, 220, 0.08)';

  // Teletrabajo: Verde esmeralda luminoso de alto contraste (sin componente azul)
  const ttColor = useDark ? '#4ade80' : '#15803d';
  const ttBarColor = useDark ? '#22c55e' : '#16a34a';
  const ttBgTint = useDark ? 'rgba(34, 197, 94, 0.16)' : 'rgba(22, 163, 74, 0.08)';

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
        minHeight: 'auto',
        paddingBottom: '1.25rem'
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
        className="is-flex is-flex-direction-column is-flex-grow-1" 
        style={{ 
          backgroundColor: useDark ? '#1e293b' : '#f8fafc',
          borderRadius: '12px',
          border: useDark ? '1px solid #334155' : '1px solid #e2e8f0',
          padding: '12px',
          boxSizing: 'border-box',
          height: 'auto'
        }}
      >
        <div>
          {/* Tabla de Presencial vs TT */}
          <table 
            className="table is-bordered is-fullwidth is-narrow mb-0 has-text-centered" 
            style={{ 
              backgroundColor: 'transparent',
              color: useDark ? '#e2e8f0' : '#1e293b',
              fontSize: 'var(--font-size-table-cell)'
            }}
          >
            <thead>
              <tr style={{ backgroundColor: useDark ? '#1e293b' : '#f1f5f9' }}>
                <th 
                  colSpan={2} 
                  className="has-text-centered table-header py-1" 
                  style={{ 
                    color: useDark ? '#cbd5e1' : '#334155', 
                    fontWeight: 800, 
                    fontSize: 'var(--font-size-header-table)',
                    letterSpacing: '0.01em'
                  }}
                >
                  Días de vacaciones tomados en...
                </th>
              </tr>
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
              {/* Fila Días Previos (opción secundaria compacta) */}
              {!isExport && (
                <tr style={{ backgroundColor: useDark ? 'rgba(255, 255, 255, 0.015)' : '#fafafa' }}>
                  <td style={{ verticalAlign: 'middle', padding: '3px 6px', position: 'relative' }}>
                    <div className="is-flex is-align-items-center is-justify-content-center" style={{ gap: '0.35rem' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: useDark ? '#64748b' : '#94a3b8', letterSpacing: '0.01em' }}>
                        Previos:
                      </span>
                      <input 
                        type="number" 
                        min="0"
                        value={pastPresenc}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value) || 0);
                          onUpdatePastPresenc(val);
                        }}
                        className="input is-small has-text-centered" 
                        style={{ 
                          width: '36px', 
                          height: '22px', 
                          padding: '0 2px', 
                          borderRadius: '4px', 
                          fontSize: '11px',
                          fontWeight: 600,
                          border: useDark ? '1px solid #334155' : '1px solid #cbd5e1'
                        }}
                        title="Días presenciales disfrutados previamente fuera de este calendario"
                      />
                    </div>

                    {/* Icono info entre los dos Previos con cuadro flotante contextual */}
                    <div 
                      style={{ 
                        position: 'absolute', 
                        right: '-9px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        zIndex: 30 
                      }}
                      onMouseEnter={() => setShowPreviosInfo(true)}
                      onMouseLeave={() => setShowPreviosInfo(false)}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPreviosInfo(prev => !prev);
                        }}
                        onFocus={() => setShowPreviosInfo(true)}
                        onBlur={() => setShowPreviosInfo(false)}
                        className="button is-ghost p-0 is-flex is-align-items-center is-justify-content-center"
                        style={{ 
                          width: '18px', 
                          height: '18px', 
                          borderRadius: '50%', 
                          backgroundColor: useDark ? '#1e293b' : '#ffffff',
                          border: showPreviosInfo 
                            ? (useDark ? '1.5px solid #38bdf8' : '1.5px solid #0284c7') 
                            : (useDark ? '1px solid #475569' : '1px solid #cbd5e1'),
                          color: showPreviosInfo ? (useDark ? '#38bdf8' : '#0284c7') : (useDark ? '#94a3b8' : '#64748b'),
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          transition: 'all 0.15s ease'
                        }}
                        title="Información sobre los días previos"
                        aria-label="Información sobre los días previos"
                      >
                        <Info size={10} strokeWidth={2.5} />
                      </button>

                      {/* Cuadro flotante contextual (tooltip) */}
                      {showPreviosInfo && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '50%',
                            bottom: 'calc(100% + 8px)',
                            transform: 'translateX(-50%)',
                            width: '235px',
                            backgroundColor: useDark ? '#1e293b' : '#ffffff',
                            color: useDark ? '#e2e8f0' : '#1e293b',
                            border: useDark ? '1.5px solid #38bdf8' : '1.5px solid #0284c7',
                            borderRadius: '8px',
                            padding: '8px 10px',
                            boxShadow: useDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.15)',
                            fontSize: '11px',
                            lineHeight: 1.45,
                            zIndex: 100,
                            textAlign: 'left',
                            pointerEvents: 'none'
                          }}
                        >
                          <div className="is-flex is-align-items-flex-start" style={{ gap: '0.45rem' }}>
                            <Info size={14} style={{ color: useDark ? '#38bdf8' : '#0284c7', flexShrink: 0, marginTop: '2px' }} />
                            <span>
                              Si ya has disfrutado de días anteriormente (o no los tienes a mano en el calendario pero sabes cuántos fueron), puedes contarlos directamente en estas casillas para comprobar la proporción 40-60 que te queda.
                            </span>
                          </div>
                          {/* Flecha inferior apuntando al botón */}
                          <div 
                            style={{
                              position: 'absolute',
                              bottom: '-5px',
                              left: '50%',
                              transform: 'translateX(-50%) rotate(45deg)',
                              width: '8px',
                              height: '8px',
                              backgroundColor: useDark ? '#1e293b' : '#ffffff',
                              borderRight: useDark ? '1.5px solid #38bdf8' : '1.5px solid #0284c7',
                              borderBottom: useDark ? '1.5px solid #38bdf8' : '1.5px solid #0284c7'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ verticalAlign: 'middle', padding: '3px 6px' }}>
                    <div className="is-flex is-align-items-center is-justify-content-center" style={{ gap: '0.35rem' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: useDark ? '#64748b' : '#94a3b8', letterSpacing: '0.01em' }}>
                        Previos:
                      </span>
                      <input 
                        type="number" 
                        min="0"
                        value={pastTT}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value) || 0);
                          onUpdatePastTT(val);
                        }}
                        className="input is-small has-text-centered" 
                        style={{ 
                          width: '36px', 
                          height: '22px', 
                          padding: '0 2px', 
                          borderRadius: '4px', 
                          fontSize: '11px',
                          fontWeight: 600,
                          border: useDark ? '1px solid #334155' : '1px solid #cbd5e1'
                        }}
                        title="Días en teletrabajo disfrutados previamente fuera de este calendario"
                      />
                    </div>
                  </td>
                </tr>
              )}

              {/* Fila Total Días (Previos + Calendario) */}
              <tr>
                <td style={{ verticalAlign: 'middle', padding: isExport ? '10px 8px' : '8px 8px', backgroundColor: presencBgTint }}>
                  <span className="kpi-large" style={{ fontSize: 'var(--font-size-kpi-large)', fontWeight: 'var(--font-weight-black)', color: presencColor }}>
                    {presencDays}
                  </span>
                  {!isExport && pastPresenc > 0 && (
                    <div className="subtext-helper" style={{ fontSize: '8px',  color: presencColor, marginTop: '-2px' }}>
                      ({pastPresenc} previos + {calendarStats.presencial} calendario)
                    </div>
                  )}
                </td>
                <td style={{ verticalAlign: 'middle', padding: isExport ? '10px 8px' : '8px 8px', backgroundColor: ttBgTint }}>
                  <span className="kpi-large" style={{ fontSize: 'var(--font-size-kpi-large)', fontWeight: 'var(--font-weight-black)', color: ttColor }}>
                    {ttDays}
                  </span>
                  {!isExport && pastTT > 0 && (
                    <div className="subtext-helper" style={{ fontSize: '8px', color: ttColor, marginTop: '-2px' }}>
                      ({pastTT} previos. + {calendarStats.tt} calendario)
                    </div>
                  )}
                </td>
              </tr>

              {/* Fila de Proporción y Barra integrada en la tabla */}
              <tr style={{ backgroundColor: useDark ? '#141d2b' : '#ffffff' }}>
                <td 
                  colSpan={2} 
                  style={{ 
                    paddingTop: '9px',
                    paddingBottom: '9px',
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    verticalAlign: 'middle'
                  }}
                >
                  {/* Barra de distribución de color con valores KPI dentro */}
                  <div 
                    style={{ 
                      position: 'relative',
                      width: '100%', 
                      height: '40px', 
                      backgroundColor: useDark ? '#334155' : '#e2e8f0', 
                      borderRadius: '25px', 
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)'
                    }}
                    title={`Presencial: ${presencPctStr} (Meta: 40%) | Teletrabajo: ${ttPctStr} (Meta: 60%)`}
                  >
                    {/* Capa de barras de color de fondo */}
                    <div 
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        display: 'flex',
                        opacity: isZeroModality ? 0.45 : 1,
                        transition: 'opacity 0.25s ease'
                      }}
                    >
                      <div 
                        style={{ 
                          width: `${presencBarWidth}%`, 
                          backgroundColor: presencBarColor, 
                          transition: 'width 0.3s ease' 
                        }} 
                      />
                      <div 
                        style={{ 
                          width: `${ttBarWidth}%`, 
                          backgroundColor: ttBarColor, 
                          transition: 'width 0.3s ease' 
                        }} 
                      />
                    </div>

                    {/* Contenido dentro de la barra: {presencPctStr} a la izquierda y {ttPctStr} a la derecha */}
                    <div 
                      style={{ 
                        position: 'relative', 
                        zIndex: 1, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        height: '100%', 
                        padding: '0 12px',
                        pointerEvents: 'none',
                        userSelect: 'none'
                      }}
                    >
                      {/* Presencial */}
                      <div className="is-flex is-align-items-center">
                        <span 
                          className="kpi-large" 
                          style={{ 
                            fontSize: 'var(--font-size-kpi-large)', 
                            fontWeight: 'var(--font-weight-black)', 
                            color: '#ffffff', 
                            lineHeight: 1,
                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          {presencPctStr}
                        </span>
                      </div>

                      {/* Teletrabajo */}
                      <div className="is-flex is-align-items-center is-justify-content-flex-end">
                        <span 
                          className="kpi-large" 
                          style={{ 
                            fontSize: 'var(--font-size-kpi-large)', 
                            fontWeight: 'var(--font-weight-black)', 
                            color: '#ffffff', 
                            lineHeight: 1,
                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          {ttPctStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Debajo de la barra: Metas de referencia muy pequeñas */}
                  <div 
                    className="is-flex is-justify-content-space-between is-align-items-center" 
                    style={{ 
                      padding: '0 6px', 
                      marginTop: '5px',
                      lineHeight: 1
                    }}
                  >
                    <span 
                      style={{ 
                        fontSize: '10px', 
                        fontWeight: 600, 
                        color: presencColor,
                        letterSpacing: '0.01em',
                        lineHeight: 1
                      }}
                    >
                      Meta: 40%
                    </span>
                    <span 
                      style={{ 
                        fontSize: '10px', 
                        fontWeight: 600, 
                        color: ttColor,
                        letterSpacing: '0.01em',
                        lineHeight: 1
                      }}
                    >
                      Meta: 60%
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sugerencia para cumplir la regla */}
        <div 
          style={{
            marginTop: 'auto',
            paddingTop: '12px'
          }}
        >
          <div 
            style={{
              backgroundColor: useDark ? '#141d2b' : '#ffffff',
              borderRadius: '8px',
              fontSize: 'var(--font-size-note)',
              border: useDark ? '1px solid #334155' : '1px solid #cbd5e1',
              color: useDark ? '#cbd5e1' : '#475569',
              lineHeight: 1.55,
              padding: '11px 14px',
              boxSizing: 'border-box'
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
    </div>
  );
};

