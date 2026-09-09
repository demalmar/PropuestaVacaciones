/**
 * Exporta un elemento HTML a imagen PNG en alta resolución usando html2canvas
 */
export const exportToPNG = async (element: HTMLElement | null, fileName = 'Propuesta Vacaciones.png'): Promise<void> => {
  if (!element) return;
  if (!window.html2canvas) {
    alert('La herramienta para exportar está cargando. Inténtalo en un momento.');
    return;
  }

  try {
    const canvas = await window.html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2
    });
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error al exportar PNG:', error);
  }
};

/**
 * Exporta un objeto de datos a archivo JSON descargable
 */
export const exportToJSON = (payload: any, fileName?: string): void => {
  try {
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    if (!fileName) {
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      link.download = `propuesta_vacaciones_${dateStr}.json`;
    } else {
      link.download = fileName;
    }

    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al exportar datos:', error);
    alert('Ocurrió un error al intentar exportar los datos.');
  }
};

