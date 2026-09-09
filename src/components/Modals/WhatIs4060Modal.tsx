import React from 'react';

interface WhatIs4060ModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const WhatIs4060Modal: React.FC<WhatIs4060ModalProps> = ({
  isOpen,
  onClose,
  isDarkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal is-active" style={{ zIndex: 1050 }}>
      <div className="modal-background" onClick={onClose} />
      <div 
        className="modal-card" 
        style={{ 
          maxWidth: '760px', 
          width: '92%', 
          maxHeight: '90vh', 
          borderRadius: '12px', 
          overflow: 'hidden', 
          backgroundColor: isDarkMode ? '#1e242c' : '#ffffff',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
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
            <span>⚖️</span>
            <span>Contexto: La regla del 40-60 y su encaje normativo</span>
          </p>
          <button 
            className="delete is-medium" 
            aria-label="close" 
            onClick={onClose} 
            title="Cerrar ventana"
          />
        </header>

        <section 
          className="modal-card-body content p-5" 
          style={{ 
            overflowY: 'auto', 
            backgroundColor: isDarkMode ? '#1e242c' : '#ffffff', 
            color: isDarkMode ? '#cbd5e1' : '#334155', 
            flexGrow: 1,
            fontSize: 'var(--font-size-modal-body)',
            lineHeight: '1.65'
          }}
        >
          {/* Sección 1: En qué consiste la práctica */}
          <section className="mb-4">
            <h4 className="title is-6 mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem', color: isDarkMode ? '#38bdf8' : '#0284c7', fontSize: 'var(--font-size-title-panel)' }}>
              <span>📌</span>
              <span>Origen y naturaleza de la regla 40-60</span>
            </h4>
            <p>
              Esta regla responde a una <strong>directriz o práctica oficiosa no escrita</strong> que se viene aplicando en diversas oficinas y delegaciones de la <strong>Agencia Estatal de Administración Tributaria (AEAT)</strong>. Según esta consigna interna transmitida verbalmente, los empleados públicos acogidos al régimen de teletrabajo deben planificar y consumir sus días de vacaciones guardando una proporción matemática estricta: un <strong>40% en jornadas de carácter presencial</strong> y un <strong>60% en jornadas de teletrabajo</strong>.
            </p>
            <div 
              className="box p-3 mb-2" 
              style={{ 
                fontSize: 'var(--font-size-modal-note)', 
                border: isDarkMode ? '1px solid #475569' : '1px solid #fed7aa', 
                backgroundColor: isDarkMode ? '#2d251d' : '#fffbeb',
                borderRadius: '8px'
              }}
            >
              <span style={{ color: isDarkMode ? '#fcd34d' : '#b45309', fontWeight: 700 }}>⚠️ Falta de soporte documental:</span>
              <span style={{ color: isDarkMode ? '#fef3c7' : '#78350f', marginLeft: '0.35rem' }}>
                Dicha exigencia no consta formalizada en ninguna circular publicada, resolución administrativa oficial en el BOE ni acuerdo firmado en la Mesa General de Negociación, tratándose de una directriz práctica trasladada sin cobertura formal.
              </span>
            </div>
          </section>

          {/* Sección 2: Marco legal del TREBEP */}
          <section className="mb-4">
            <h4 className="title is-6 mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem', color: isDarkMode ? '#38bdf8' : '#0284c7' }}>
              <span>📖</span>
              <span>Qué establece el TREBEP (RDL 5/2015)</span>
            </h4>
            <p className="mb-2">
              El régimen estatutario de los empleados públicos se rige con rango legal por el <strong>Texto Refundido de la Ley del Estatuto Básico del Empleado Público (TREBEP)</strong>:
            </p>
            <ul className="mt-0 mb-3" style={{ paddingLeft: '1.25rem' }}>
              <li className="mb-2">
                <strong>Artículo 50 (Vacaciones de los funcionarios públicos):</strong> Garantiza el derecho de los empleados a disfrutar de al menos <em>22 días hábiles de vacaciones retribuidas</em> por año natural de servicios (o la parte proporcional correspondiente). Aunque el precepto autoriza a ordenar la planificación temporal de los periodos vacacionales por necesidades del servicio, <strong>en ningún punto habilita a segmentar o condicionar los días de descanso en función de la modalidad de trabajo presencial o no presencial</strong> asignada a cada día.
              </li>
              <li className="mb-0">
                <strong>Artículo 47 bis (Teletrabajo):</strong> Define el teletrabajo como una modalidad organizativa de <em>prestación activa de servicios</em> y consagra el principio de igualdad: el personal que teletrabaje disfrutará de los <strong>mismos derechos y deberes</strong> que quienes presten servicio de forma presencial, sin menoscabo en sus condiciones retributivas, jornada ni descanso. Jurídicamente, las vacaciones son un <em>periodo de suspensión de la prestación laboral por descanso legítimo</em>, por lo que no constituyen jornadas activas de trabajo a las que sea aplicable un porcentaje de presencialidad.
              </li>
            </ul>
          </section>

          {/* Sección 3: Por qué suscita dudas fundadas de ilegalidad */}
          <section className="mb-4">
            <h4 className="title is-6 mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem', color: isDarkMode ? '#f87171' : '#dc2626' }}>
              <span>⚖️</span>
              <span>Fundamentos objetivos de su posible ilegalidad</span>
            </h4>
            <p className="mb-2">
              Atendiendo estrictamente a los principios del Derecho Administrativo y Laboral, existen argumentos jurídicos consolidados que cuestionan la legalidad de esta práctica:
            </p>
            
            <div className="content" style={{ fontSize: '0.94rem' }}>
              <ol style={{ paddingLeft: '1.25rem' }}>
                <li className="mb-2">
                  <strong>Vulneración del principio de seguridad jurídica (Art. 9.3 CE) y falta de procedimiento:</strong> Toda limitación restrictiva sobre un derecho estatutario consolidado (el derecho fundamental al descanso y vacaciones anuales) debe plasmarse mediante una norma reglamentaria con habilitación legal suficiente o a través de negociación colectiva reglada. Imponer cuotas numéricas de forma verbal carece de respaldo procedimental válido.
                </li>
                <li className="mb-2">
                  <strong>Doble limitación acumulativa que anula la autonomía del empleado:</strong>
                  <div className="mt-1" style={{ color: isDarkMode ? '#e2e8f0' : '#475569' }}>
                    La Administración ya ejerce de por sí una prerrogativa imperativa muy intensa sobre el calendario: <strong>fija obligatoriamente que al menos la mitad de las vacaciones del trabajador deban disfrutarse durante los meses de verano</strong> para garantizar los servicios mínimos.
                    <br className="mb-1" />
                    Si sobre esa primera restricción imperativa se añade además la obligación de cuadrar los días en una proporción semanal matemática (40% presencial y 60% teletrabajo), la capacidad real del empleado de elegir cuándo descansar o conciliar su vida familiar y laboral queda reducida a un margen prácticamente nulo. La ley no autoriza a duplicar restricciones sobre el descanso sin causa tasada debidamente motivada.
                  </div>
                </li>
                <li className="mb-0">
                  <strong>Confusión entre jornada efectiva y derecho al descanso:</strong> Los porcentajes 40/60 (o 2/3 días semanales) tienen la finalidad de regular cómo se reparte el trabajo efectivo frente a la Administración. En un día de vacaciones, el empleado <em>no está teletrabajando ni está en modalidad presencial</em>: está legalmente de descanso retribuido, por lo que trasladar el ratio de presencialidad a los días no trabajados supone una distorsión jurídica del concepto de descanso.
                </li>
              </ol>
            </div>
          </section>

          {/* Cuadro resumen de utilidad de la herramienta */}
          <article 
            className="message is-small mb-0" 
            style={{ 
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
              backgroundColor: isDarkMode ? '#252e39' : '#f8fafc',
              borderRadius: '8px'
            }}
          >
            <div className="message-body" style={{ color: isDarkMode ? '#cbd5e1' : '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>
              <strong>Propósito de este panel en la aplicación:</strong> Aunque su base jurídica sea altamente controvertida, la regla 40-60 continúa exigiéndose en la práctica diaria de muchos departamentos. Esta calculadora proporciona a los compañeros una herramienta visual y objetiva para monitorizar sus días y anticipar cualquier discrepancia o requerimiento interno antes de presentar su propuesta formal.
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
          <button 
            type="button" 
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
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
};

