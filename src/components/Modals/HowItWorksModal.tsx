import React, { useState, useRef, useEffect } from 'react';
import { Info, GitFork, ExternalLink, Link2 } from 'lucide-react';
import fromDemalmarImg from '../../from_demalmar.png';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  targetSection?: string | null;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  targetSection
}) => {
  const presencialesSectionRef = useRef<HTMLElement | null>(null);
  const [isPresencialesHighlighted, setIsPresencialesHighlighted] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    if (isOpen && targetSection === 'help-comportamiento-presenciales') {
      const timer = setTimeout(() => {
        if (presencialesSectionRef.current) {
          presencialesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setIsPresencialesHighlighted(true);
          const offTimer = setTimeout(() => {
            setIsPresencialesHighlighted(false);
          }, 2500);
          return () => clearTimeout(offTimer);
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen, targetSection]);

  if (!isOpen) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose} />
      <div 
        className="modal-card" 
        style={{ 
          maxWidth: '740px', 
          width: '94%', 
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
          className="modal-card-head py-3 px-5 is-flex is-align-items-center is-justify-content-space-between" 
          style={{ 
            backgroundColor: isDarkMode ? '#252e39' : '#f8fafc', 
            borderBottom: isDarkMode ? '1px solid #324054' : '1px solid #e2e8f0',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}
        >
          <p className="modal-card-title is-size-5 has-text-weight-bold mb-0 is-flex is-align-items-center" style={{ gap: '0.55rem', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
            <Info size={22} className="has-text-info" strokeWidth={2.5} />
            <span>¿Cómo funciona?</span>
          </p>
          <button 
            className="delete is-medium" 
            aria-label="close" 
            onClick={onClose} 
            title="Cerrar ventana"
          />
        </header>
        
        <section className="modal-card-body content p-5" style={{ overflowY: 'auto', backgroundColor: isDarkMode ? '#1e242c' : '#ffffff', color: isDarkMode ? '#cbd5e1' : '#334155', flexGrow: 1, fontSize: 'var(--font-size-modal-body)', lineHeight: '1.65' }}>
          <section className="mb-4">
            <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem', fontSize: 'var(--font-size-title-panel)' }}>
              <span>📌</span>
              <span>¿Qué es?</span>
            </h4>
            <p>
              Es una pantalla que te permite jugar con tus días de vacaciones, organizarlos y ver cómo quedarían. Además, puedes descargar una imagen para presentar a tu superior en caso de necesitarlo.
            </p>
          </section>

          <section className="mb-4">
            <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem', fontSize: 'var(--font-size-title-panel)' }}>
              <span>🏢</span>
              <span>Días presenciales y teletrabajo</span>
            </h4>
            <p className="mb-2">
              Si dispones de un régimen con días presenciales y teletrabajo, haciendo clic en los días semanales de la cabecera (<strong>L, M, X, J, V, S, D</strong>) de cualquier mes se seleccionan automáticamente los días como <strong>Presenciales</strong> (señalizados con borde azul y punto indicador). Cada mes se gestiona de manera independiente tanto en vista bimestral como anual.
            </p>
          </section>

          <section 
            id="help-comportamiento-presenciales"
            ref={presencialesSectionRef}
            className="mb-5"
            style={{
              borderRadius: '14px',
              padding: isPresencialesHighlighted ? '1rem' : '0rem',
              backgroundColor: isPresencialesHighlighted ? (isDarkMode ? 'rgba(56, 189, 248, 0.12)' : 'rgba(37, 99, 235, 0.07)') : 'transparent',
              boxShadow: isPresencialesHighlighted ? (isDarkMode ? '0 0 0 2px #38bdf8, 0 6px 20px rgba(56,189,248,0.2)' : '0 0 0 2px #2563eb, 0 6px 20px rgba(37,99,235,0.18)') : 'none',
              transition: 'all 0.35s ease'
            }}
          >
            <h4 className="title is-6 has-text-info mb-3 is-flex is-align-items-center" style={{ gap: '0.5rem', fontSize: 'var(--font-size-title-panel)' }}>
              <span>⚙️</span>
              <span>Comportamiento Presenciales</span>
            </h4>
            <p className="mb-3" style={{ lineHeight: 1.6 }}>
              En el panel <strong>Opciones</strong> puedes configurar cómo interactúan los días presenciales cuando un mes no empieza en lunes (semanas compartidas entre dos meses):
            </p>

            <div className="is-flex is-flex-direction-column" style={{ gap: '1.25rem' }}>
              {/* Opción 1: Siempre día seleccionado */}
              <div 
                style={{ 
                  borderRadius: '12px', 
                  border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', 
                  backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                  padding: '1.25rem 1.4rem'
                }}
              >
                <div className="is-flex is-align-items-center mb-2" style={{ gap: '0.6rem' }}>
                  <span className="tag is-primary is-light has-text-weight-bold" style={{color: isDarkMode ? '#f1f5f9' : '#0f172a', fontSize: '0.98rem', padding: '0.2rem 0.55rem' }}><strong>1. Siempre día seleccionado</strong></span>
                </div>
                <p className="mb-3" style={{ fontSize: '0.9rem', lineHeight: 1.6, color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                  Aplica la selección a <strong>todos los días correspondientes dentro del mes natural</strong> (del día 1 al último), independientemente del día de la semana en que comience el mes.
                </p>
                <div 
                  style={{ 
                    borderRadius: '10px', 
                    backgroundColor: isDarkMode ? '#151e2b' : '#ffffff', 
                    border: isDarkMode ? '1px solid #283445' : '1px solid #e2e8f0',
                    padding: '1.1rem 1.25rem'
                  }}
                >
                  <span className="is-block mb-3 has-text-weight-semibold" style={{ fontSize: '0.84rem', color: isDarkMode ? '#94a3b8' : '#334155' }}>
                    📌 <em>Ejemplo: Octubre empieza en Jueves 1 y seleccionas los <strong>Jueves</strong> como presenciales:</em>
                  </span>
                  
                  {/* Mini Calendario 2 Filas */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', maxWidth: '340px' }}>
                    {/* Cabecera L M X J V */}
                    <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '11px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>L</div>
                    <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '11px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>M</div>
                    <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '11px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>X</div>
                    <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '11px', color: '#2563eb' }}>J</div>
                    <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '11px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>V</div>

                    {/* Fila 1: Semana de cambio de mes */}
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', backgroundColor: isDarkMode ? '#1a2230' : '#f8fafc', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: '#64748b', fontSize: '12px' }}>28</span>
                      <span style={{ fontSize: '9px', color: '#94a3b8' }}>Sep</span>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', backgroundColor: isDarkMode ? '#1a2230' : '#f8fafc', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: '#64748b', fontSize: '12px' }}>29</span>
                      <span style={{ fontSize: '9px', color: '#94a3b8' }}>Sep</span>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', backgroundColor: isDarkMode ? '#1a2230' : '#f8fafc', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: '#64748b', fontSize: '12px' }}>30</span>
                      <span style={{ fontSize: '9px', color: '#94a3b8' }}>Sep</span>
                    </div>
                    {/* JUEVES 1 OCT - PRESENCIAL */}
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: '2px solid #2563eb', backgroundColor: isDarkMode ? 'rgba(37,99,235,0.22)' : '#eff6ff', fontSize: '11px', position: 'relative', boxShadow: '0 1px 4px rgba(37,99,235,0.2)' }}>
                      <span style={{ display: 'block', fontWeight: 800, color: '#2563eb', fontSize: '12px' }}>1</span>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#2563eb' }}>Oct</span>
                      <span style={{ position: 'absolute', top: '3px', right: '3px', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', backgroundColor: isDarkMode ? '#17202e' : '#ffffff', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#334155', fontSize: '12px' }}>2</span>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>Oct</span>
                    </div>

                    {/* Fila 2: Semana completa */}
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1.5px solid #0d9488' : '1.5px solid #0f766e', backgroundColor: isDarkMode ? 'rgba(13,148,136,0.15)' : '#f0fdfa', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 800, color: isDarkMode ? '#2dd4bf' : '#0f766e', fontSize: '12px' }}>5</span>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: isDarkMode ? '#2dd4bf' : '#0f766e' }}>1.ᵉʳ lun</span>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', backgroundColor: isDarkMode ? '#17202e' : '#ffffff', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#334155', fontSize: '12px' }}>6</span>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>Oct</span>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', backgroundColor: isDarkMode ? '#17202e' : '#ffffff', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#334155', fontSize: '12px' }}>7</span>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>Oct</span>
                    </div>
                    {/* JUEVES 8 OCT - PRESENCIAL */}
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: '2px solid #2563eb', backgroundColor: isDarkMode ? 'rgba(37,99,235,0.22)' : '#eff6ff', fontSize: '11px', position: 'relative', boxShadow: '0 1px 4px rgba(37,99,235,0.2)' }}>
                      <span style={{ display: 'block', fontWeight: 800, color: '#2563eb', fontSize: '12px' }}>8</span>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#2563eb' }}>Oct</span>
                      <span style={{ position: 'absolute', top: '3px', right: '3px', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', backgroundColor: isDarkMode ? '#17202e' : '#ffffff', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#334155', fontSize: '12px' }}>9</span>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>Oct</span>
                    </div>
                  </div>

                  <span className="is-block mt-3" style={{ fontSize: '0.84rem', color: isDarkMode ? '#4ade80' : '#16a34a', fontWeight: 600, lineHeight: 1.5 }}>
                    ✔ Todos los jueves de Octubre (en este ejemplo, tanto el día 1 como el día 8) quedan marcados como presenciales desde el primer día del mes.
                  </span>
                </div>
              </div>

              {/* Opción 2: Desde el 1er lunes del mes */}
              <div 
                style={{ 
                  borderRadius: '12px', 
                  border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', 
                  backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                  padding: '1.25rem 1.4rem'
                }}
              >
                <div className="is-flex is-align-items-center mb-2" style={{ gap: '0.6rem' }}>
                  <span className="tag is-info is-light has-text-weight-bold" style={{ fontSize: '0.98rem', padding: '0.2rem 0.55rem',color: isDarkMode ? '#f1f5f9' : '#0f172a' }}><strong>2. Desde el 1<sup>er</sup> lunes del mes</strong></span>
                </div>
                <p className="mb-3" style={{ fontSize: '0.9rem', lineHeight: 1.6, color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                  El nuevo patrón presencial del mes entra en vigor <strong>a partir de su primer lunes</strong>. Los días previos al primer lunes se consideran parte de la semana del mes anterior y se rigen por la configuración de dicho mes previo.
                </p>
                <div 
                  style={{ 
                    borderRadius: '10px', 
                    backgroundColor: isDarkMode ? '#151e2b' : '#ffffff', 
                    border: isDarkMode ? '1px solid #283445' : '1px solid #e2e8f0',
                    padding: '1.1rem 1.25rem'
                  }}
                >
                  <span className="is-block mb-3 has-text-weight-semibold" style={{ fontSize: '0.84rem', color: isDarkMode ? '#94a3b8' : '#334155' }}>
                    📌 <em>Ejemplo: Septiembre tenía presenciales los <strong>Martes</strong> y Octubre los <strong>Jueves</strong>:</em>
                  </span>

                  {/* Mini Calendario 2 Filas */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', maxWidth: '340px' }}>
                    {/* Cabecera L M X J V */}
                    <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '11px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>L</div>
                    <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '11px', color: '#2563eb' }}>M</div>
                    <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '11px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>X</div>
                    <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '11px', color: '#2563eb' }}>J</div>
                    <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '11px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>V</div>

                    {/* Fila 1: Semana regida por Septiembre (Martes presencial) */}
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', backgroundColor: isDarkMode ? '#1a2230' : '#f8fafc', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: '#64748b', fontSize: '12px' }}>28</span>
                      <span style={{ fontSize: '9px', color: '#94a3b8' }}>Sep</span>
                    </div>
                    {/* MARTES 29 SEP - PRESENCIAL */}
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: '2px solid #2563eb', backgroundColor: isDarkMode ? 'rgba(37,99,235,0.22)' : '#eff6ff', fontSize: '11px', position: 'relative', boxShadow: '0 1px 4px rgba(37,99,235,0.2)' }}>
                      <span style={{ display: 'block', fontWeight: 800, color: '#2563eb', fontSize: '12px' }}>29</span>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#2563eb' }}>Sep</span>
                      <span style={{ position: 'absolute', top: '3px', right: '3px', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', backgroundColor: isDarkMode ? '#1a2230' : '#f8fafc', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: '#64748b', fontSize: '12px' }}>30</span>
                      <span style={{ fontSize: '9px', color: '#94a3b8' }}>Sep</span>
                    </div>
                    {/* JUEVES 1 OCT - NO ES PRESENCIAL (pertenece a la semana de Sep) */}
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1.5px dashed #64748b' : '1.5px dashed #94a3b8', backgroundColor: isDarkMode ? '#1a2230' : '#f1f5f9', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: '#64748b', fontSize: '12px' }}>1</span>
                      <span style={{ fontSize: '9px', color: '#94a3b8' }}>Oct</span>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', backgroundColor: isDarkMode ? '#17202e' : '#ffffff', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#334155', fontSize: '12px' }}>2</span>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>Oct</span>
                    </div>

                    {/* Fila 2: Semana que arranca con el 1er lunes de Octubre (Jueves presencial) */}
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1.5px solid #0d9488' : '1.5px solid #0f766e', backgroundColor: isDarkMode ? 'rgba(13,148,136,0.15)' : '#f0fdfa', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 800, color: isDarkMode ? '#2dd4bf' : '#0f766e', fontSize: '12px' }}>5</span>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: isDarkMode ? '#2dd4bf' : '#0f766e' }}>1.ᵉʳ lun</span>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', backgroundColor: isDarkMode ? '#17202e' : '#ffffff', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#334155', fontSize: '12px' }}>6</span>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>Oct</span>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', backgroundColor: isDarkMode ? '#17202e' : '#ffffff', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#334155', fontSize: '12px' }}>7</span>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>Oct</span>
                    </div>
                    {/* JUEVES 8 OCT - PRESENCIAL */}
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: '2px solid #2563eb', backgroundColor: isDarkMode ? 'rgba(37,99,235,0.22)' : '#eff6ff', fontSize: '11px', position: 'relative', boxShadow: '0 1px 4px rgba(37,99,235,0.2)' }}>
                      <span style={{ display: 'block', fontWeight: 800, color: '#2563eb', fontSize: '12px' }}>8</span>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#2563eb' }}>Oct</span>
                      <span style={{ position: 'absolute', top: '3px', right: '3px', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 2px', borderRadius: '7px', border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', backgroundColor: isDarkMode ? '#17202e' : '#ffffff', fontSize: '11px' }}>
                      <span style={{ display: 'block', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#334155', fontSize: '12px' }}>9</span>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>Oct</span>
                    </div>
                  </div>

                  <span className="is-block mt-3" style={{ fontSize: '0.84rem', color: isDarkMode ? '#7dd3fc' : '#0284c7', fontWeight: 600, lineHeight: 1.5 }}>
                    El Jueves 1 de Octubre NO es presencial (la semana aún pertenece a Septiembre con martes presencial). El nuevo patrón entra en vigor el lunes 5, marcando como primer jueves presencial el día 8 de Octubre.
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
              <span>🖍️</span>
              <span>Marcadores</span>
            </h4>
            <p className="mb-2">
              El panel izquierdo de <strong>Marcadores</strong> contiene las categorías predeterminadas y las que tú añadas:
            </p>
            <ul>
              <li><strong>Vac. días independientes:</strong> Vacaciones disfrutadas por días sueltos.</li>
              <li><strong>Vac. por periodo:</strong> Vacaciones planificadas por bloques continuos mínimos de 5 días.</li>
              <li><strong>Asuntos Propios:</strong> Días reservados para trámites y gestiones personales.</li>
              <li><strong>Festivo:</strong> Días no laborales.</li>
              <li><strong>Personalizadas:</strong> Puedes crear tus propios marcadores con nombre y color libre.</li>
            </ul>
          </section>

          <section className="mb-4">
            <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
              <span>➕</span>
              <span>Añadir marcador</span>
            </h4>
            <p>
              En el formulario <strong>"Añadir marcador..."</strong> del panel izquierdo puedes crear nuevos marcadores personalizados: selecciona un color con la paleta, escribe su nombre y pulsa el botón <strong>+</strong> (o la tecla Enter).
            </p>
          </section>

          <section className="mb-4">
            <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
              <span>👁️</span>
              <span>Mostrar u ocultar fines de semana</span>
            </h4>
            <p>
              Marca o desmarca la opción <strong>"Mostrar fines de semana"</strong> en la columna derecha para alternar entre ver solo la semana laboral (Lunes a Viernes) o la semana completa (Lunes a Domingo).
            </p>
          </section>

          <section className="mb-4">
            <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
              <span>🗓️</span>
              <span>Modo de Vista: Anual y Bimestral</span>
            </h4>
            <p>
              En ordenadores y tablets, puedes alternar en el selector <strong>"Modo de Vista"</strong> entre la <strong>Vista Anual</strong> (los 12 meses organizados en una cuadrícula compacta de 4 columnas por 3 filas con navegación año a año) y la <strong>Vista Bimestral</strong> (los 2 meses consecutivos tradicionales con desplazamiento mensual). En dispositivos móviles se mantiene la vista bimestral para una experiencia táctil óptima.
            </p>
          </section>

          <section className="mb-4">
            <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
              <span>📥</span>
              <span>Guardar PNG</span>
            </h4>
            <p>
              Pulsa el botón <strong>"Guardar PNG"</strong> para exportar una imagen de alta resolución. Una ventana modal te permite elegir qué partes capturar: el Calendario (marcado siempre), el panel de Balance y la Proporción 40-60.
            </p>
          </section>


          <section className="mb-4">
            <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
              <span>💾</span>
              <span>Exportar e Importar datos</span>
            </h4>
            <p className="mb-2">
              Si no quieres depender de que tus cambios se guarden en el navegador, puedes crear copias de seguridad de toda tu planificación para conservarla o transferirla entre diferentes dispositivos o navegadores:
            </p>
            <ul>
              <li><strong>Exportar datos:</strong> Descarga un archivo en formato <code>.json</code> con todas tus selecciones, días coloreados, modalidades de teletrabajo/presencial, etiquetas personalizadas y la tabla 40-60.</li>
              <li><strong>Importar datos:</strong> Selecciona un archivo <code>.json</code> previamente guardado para restaurar tu planificación. Te advertirá para confirmar antes de sustituir los datos actuales guardados en el navegador.</li>
            </ul>
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
            <div className="message-body" style={{ fontSize: '0.92rem', lineHeight: 1.5 }}>
              <strong>Nota:</strong> Todos tus datos (marcadores, selecciones y opciones) se guardan automáticamente en tu navegador (Local Storage), por lo que no perderás tu planificación aunque recargues o cierres la página.
            </div>
          </article>
        </section>

        <footer 
          className="modal-card-foot is-justify-content-space-between is-align-items-center py-3 px-5" 
          style={{ 
            backgroundColor: isDarkMode ? '#252e39' : '#f8fafc', 
            borderTop: isDarkMode ? '1px solid #324054' : '1px solid #e2e8f0',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            display: 'flex'
          }}
        >
          <a
            role="button"
            onClick={() => setShowCredits(true)}
            style={{
              cursor: 'pointer',
              color: isDarkMode ? '#38bdf8' : '#0284c7',
              fontWeight: 700,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              userSelect: 'none'
            }}
            title="Ver información de autoría y licencia"
          >
            <Link2 size={15} />
            <span>Autoría y Licencia</span>
          </a>

          <button 
            onClick={onClose} 
            className="button is-small"
            style={{ 
              background: 'linear-gradient(135deg, #0e7490 0%, #0f766e 100%)', 
              color: '#ffffff', 
              border: 'none', 
              fontWeight: 700, 
              borderRadius: '8px',
              height: '36px',
              fontSize: '13.5px',
              padding: '0 18px'
            }}
          >
            Entendido
          </button>
        </footer>
      </div>

      {/* Modal Popup de Autoría y Licencia */}
      {showCredits && (
        <div 
          className="modal is-active" 
          style={{ zIndex: 1050 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="modal-background" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(3px)' }} 
            onClick={() => setShowCredits(false)} 
          />
          <div 
            className="modal-card" 
            style={{ 
              maxWidth: '520px', 
              width: '92%', 
              borderRadius: '16px', 
              overflow: 'hidden',
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'
            }}
          >
            <header 
              className="modal-card-head py-3 px-5 is-flex is-align-items-center is-justify-content-space-between"
              style={{
                backgroundColor: isDarkMode ? '#252e39' : '#f8fafc',
                borderBottom: isDarkMode ? '1px solid #324054' : '1px solid #e2e8f0'
              }}
            >
              <p className="modal-card-title is-size-6 has-text-weight-bold mb-0" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>
                Autoría y Licencia
              </p>
              <button 
                className="delete is-small" 
                aria-label="close" 
                onClick={() => setShowCredits(false)} 
                title="Cerrar ventana de autoría"
              />
            </header>

            <section className="modal-card-body p-5" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#cbd5e1' : '#334155', maxHeight: '80vh', overflowY: 'auto' }}>
              {/* Logo from_demalmar.png */}
              <div className="has-text-centered mb-3 py-1">
                <img 
                  src={fromDemalmarImg} 
                  alt="from Demalmar" 
                  style={{ 
                    maxHeight: '48px', 
                    width: 'auto',
                    filter: isDarkMode ? 'brightness(0) invert(1)' : 'none'
                  }} 
                />
              </div>

              {/* Texto de origen y motivación */}
              <div 
                className="font-caveat"
                style={{ 
                  fontFamily: '"Caveat", cursive',
                  fontSize: '1.24rem', 
                  lineHeight: '1.35', 
                  color: isDarkMode ? '#e2e8f0' : '#1e293b',
                  marginBottom: '1.5rem'
                }}
              >
                <p className="mb-2">
                  Este proyecto nace en agosto de 2026 y se crea con la intención de organizar y presentar un calendario de vacaciones para la aprobación por parte del superior.
                </p>
                <p className="mb-0">
                  Mi voluntad es que el código sea de libre disposición.<br/>Por lo tanto, se informa de que este proyecto es de dominio público.
                </p>
              </div>

              {/* Bloque unificado: Título y condiciones (2 celdas verticales) */}
              <div
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1',
                  marginBottom: '1.25rem',
                  boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                {/* Celda superior: Título de la Licencia */}
                <div 
                  className="has-text-centered"
                  style={{
                    padding: '1.15rem 1.4rem',
                    backgroundColor: isDarkMode ? 'rgba(15, 118, 110, 0.22)' : '#f0fdf4',
                    borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1'
                  }}
                >
                  <span className="tag is-success is-light has-text-weight-bold mb-1.5" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                    Dominio Público
                  </span>
                  <h5 className="title is-6 mb-1.5" style={{ color: isDarkMode ? '#5eead4' : '#15803d', fontWeight: 800 }}>
                    Creative Commons Zero (CC0 1.0 Universal)
                  </h5>
                  <p className="is-size-7 mb-0" style={{ color: isDarkMode ? '#99f6e4' : '#166534', lineHeight: 1.45 }}>
                    Dedicación universal al Dominio Público • Sin derechos reservados
                  </p>
                </div>

                {/* Celda inferior: Texto explicativo y condiciones */}
                <div 
                  style={{ 
                    padding: '1.35rem 1.5rem',
                    backgroundColor: isDarkMode ? '#151e2b' : '#f8fafc', 
                    fontSize: '0.9rem', 
                    lineHeight: '1.65' 
                  }}
                >
                  <div className="is-flex is-flex-direction-column" style={{ gap: '0.95rem' }}>
                    <div className="is-flex is-align-items-flex-start" style={{ gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.1rem', lineHeight: 1.3, flexShrink: 0 }}>🍴</span>
                      <span style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                        <strong style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Libertad total para Fork:</strong> Puedes clonar, hacer fork del repositorio en GitHub, adaptarlo a tus necesidades y crear tus propias versiones derivadas sin ninguna restricción.
                      </span>
                    </div>
                    <div className="is-flex is-align-items-flex-start" style={{ gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.1rem', lineHeight: 1.3, flexShrink: 0 }}>🔓</span>
                      <span style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                        <strong style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Reutilización libre sin citar:</strong> Eres totalmente libre de reutilizar cualquier parte del código para uso personal, educativo o comercial sin obligación de nombrar a la autoría ni pedir autorización previa.
                      </span>
                    </div>
                    <div className="is-flex is-align-items-flex-start" style={{ gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.1rem', lineHeight: 1.3, flexShrink: 0 }}>📜</span>
                      <span style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                        <strong style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Resumen legal CC0:</strong> <em>«Puede copiar, modificar, distribuir e interpretar la obra, incluso para propósitos comerciales, sin pedir permiso ni requerir atribución.»</em>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enlace y botón a GitHub */}
              <div className="has-text-centered mt-4">
                <a 
                  href="https://github.com/demalmar/PropuestaVacaciones" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="button is-small is-info is-outlined is-rounded has-text-weight-bold"
                  style={{ gap: '0.45rem' }}
                >
                  <GitFork size={15} />
                  <span>Ver repositorio o hacer Fork en GitHub</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

