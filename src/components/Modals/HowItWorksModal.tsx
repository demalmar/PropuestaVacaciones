import React from 'react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  isDarkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose} />
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
              Si dispones de un régimen con días presenciales y teletrabajo, haciendo clic en los días semanales de la cabecera (<strong>L, M, X, J, V, S, D</strong>) de cualquier mes se seleccionan automáticamente los días como <strong>Presenciales</strong> (señalizados con borde azul y punto indicador). Cada mes se gestiona de manera independiente.
            </p>
            <div className="box p-3 mb-0" style={{ fontSize: 'var(--font-size-modal-note)', border: isDarkMode ? '1px solid #324054' : '1px solid #e8e8e8', backgroundColor: isDarkMode ? '#252e39' : '#f8fafc', boxShadow: 'none' }}>
              <p className="mb-1">
                <strong>• Día semanal en todo el mes:</strong> Marca como presenciales todos los días correspondientes dentro de cada mes (de principio a fin de mes).
              </p>
              <p className="mb-0">
                <strong>• Desde el 1<sup>er</sup> lunes del mes:</strong> El patrón presencial de cada mes entra en vigor a partir de su primer lunes. Los días del mes anteriores a ese primer lunes se rigen por la semana del mes previo.
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
              <span>Marcadores</span>
            </h4>
            <p className="mb-2">
              El panel izquierdo de <strong>Marcadores</strong> contiene las categorías predeterminadas y las que tú añadas:
            </p>
            <ul>
              <li><strong>Vac. días independientes:</strong> Vacaciones disfrutadas por días sueltos.</li>
              <li><strong>Vac. por periodo:</strong> Vacaciones planificadas por temporadas o bloques continuos.</li>
              <li><strong>Asuntos Propios:</strong> Días reservados para trámites y gestiones personales.</li>
              <li><strong>Festivo:</strong> Días no laborales (los fines de semana se pintan automáticamente en este color si no se personalizan).</li>
              <li><strong>Personalizadas:</strong> Puedes crear tus propios marcadores con nombre y color libre.</li>
            </ul>
          </section>

          <section className="mb-4">
            <h4 className="title is-6 has-text-info mb-2 is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
              <span>🖱️</span>
              <span>Cómo interactuar</span>
            </h4>
            <ul>
              <li><strong>Seleccionar marcador activo:</strong> Haz clic en cualquier marcador de la lista para seleccionarlo como color activo de trabajo.</li>
              <li><strong>Pintar días:</strong> Haz clic sobre cualquier día del calendario para aplicarle el marcador activo.</li>
              <li><strong>Quitar marcador:</strong> Vuelve a hacer clic sobre un día ya coloreado con el mismo marcador activo para desmarcarlo.</li>
              <li><strong>Marcar días presenciales por columna:</strong> Haz clic en la cabecera de cualquier día (L, M, X, J, V, S, D) de un mes para marcar o desmarcar todos los días de esa columna en dicho mes como días presenciales.</li>
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
          className="modal-card-foot is-justify-content-flex-end py-3 px-5" 
          style={{ 
            backgroundColor: isDarkMode ? '#252e39' : '#f8fafc', 
            borderTop: isDarkMode ? '1px solid #324054' : '1px solid #e2e8f0',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px'
          }}
        >
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
    </div>
  );
};

