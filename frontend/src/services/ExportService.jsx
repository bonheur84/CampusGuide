class ExportService {
  // Exporter en CSV
  exportToCSV(data, filename, fields = null, customHeaders = null) {
    if (!data || data.length === 0) {
      console.error('Aucune donnée à exporter');
      return;
    }

    // Utiliser les champs personnalisés si fournis, sinon toutes les clés
    const headers = fields || Object.keys(data[0]);
    
    // Utiliser les en-têtes personnalisés si fournis, sinon formater automatiquement
    const formattedHeaders = customHeaders || headers.map(header => {
      return header
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    });

    const csvContent = [
      formattedHeaders.map(h => `"${h}"`).join(';'),
      ...data.map(row => headers.map(header => {
        let value = row[header];

        // Formater les dates si c'est un objet Date ou une chaîne de date
        if (value instanceof Date) {
          value = value.toLocaleDateString('fr-FR');
        } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
          try {
            value = new Date(value).toLocaleDateString('fr-FR');
          } catch (e) {
            // Garder la valeur originale si le parsing échoue
          }
        }

        // Convertir en chaîne et gérer les valeurs nulles/vides
        const stringValue = String(value ?? '');

        // Échapper les guillemets et mettre entre guillemets si nécessaire
        if (stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes(';')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(';'))
    ].join('\n');

    // Ajouter un BOM pour une meilleure compatibilité avec Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Ajouter un timestamp au nom du fichier
    const timestamp = new Date().toISOString().split('T')[0];
    const formattedFilename = `${filename}_${timestamp}`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${formattedFilename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  // Exporter en PDF (simplifié sans jspdf pour éviter les dépendances lourdes)
  exportToPDF(data, filename, title = 'Rapport') {
    if (!data || data.length === 0) {
      console.error('Aucune donnée à exporter');
      return;
    }

    // Créer une version HTML imprimable
    const headers = Object.keys(data[0]);
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #3AB0FF; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #3AB0FF; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Exporté le ${new Date().toLocaleDateString('fr-FR')}</p>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          CampusGuide - Université Nouveaux Horizons
        </div>
      </body>
      </html>
    `;

    // Ouvrir dans une nouvelle fenêtre pour impression
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Attendre que le contenu soit chargé puis imprimer
    printWindow.onload = () => {
      printWindow.print();
    };
  }

  // Exporter le calendrier en PDF
  exportCalendrierToPDF(evenements, filename = 'calendrier') {
    if (!evenements || evenements.length === 0) {
      console.error('Aucun événement à exporter');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Calendrier des Événements</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #3AB0FF; text-align: center; }
          .event { margin: 15px 0; padding: 15px; border-left: 4px solid #3AB0FF; background: #f9f9f9; }
          .event-date { font-weight: bold; color: #3AB0FF; }
          .event-title { font-size: 18px; margin: 5px 0; }
          .event-desc { color: #666; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Calendrier des Événements</h1>
        <p>Exporté le ${new Date().toLocaleDateString('fr-FR')}</p>
        ${evenements.map(ev => `
          <div class="event">
            <div class="event-date">${ev.date} à ${ev.heure}</div>
            <div class="event-title">${ev.titre}</div>
            <div class="event-desc">${ev.description || ev.lieu || ''}</div>
          </div>
        `).join('')}
        <div class="footer">
          CampusGuide - Université Nouveaux Horizons
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

export default new ExportService();
