import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export function genererPDF(decisionFinale, nom) {
    const doc = new jsPDF();

    // Fonction pour ajouter du texte avec retour à la ligne automatique
    const addWrappedText = (text, x, y, maxWidth, lineHeight) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * lineHeight);
    };

    // Titre
    doc.setFontSize(22);
    doc.setTextColor(158, 0, 93); // Couleur fuschia
    doc.text(`Fiche d'Orientation Professionnelle de ${nom}`, 105, 20, { align: 'center' });

    let y = 40;

    // Introduction
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    y = addWrappedText(decisionFinale.introduction, 20, y, 170, 7);

    // Profil
    doc.setFontSize(16);
    doc.setTextColor(102, 0, 102); // Couleur violet foncé
    y += 10;
    doc.text('Ton profil', 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    y = addWrappedText(decisionFinale.analyse.profil, 20, y, 170, 7);

    // Points forts et domaines d'intérêt
    y += 10;
    doc.setFontSize(14);
    doc.text('Tes points forts :', 20, y);
    y += 7;
    decisionFinale.analyse.points_forts.forEach(point => {
        y = addWrappedText(`• ${point}`, 25, y, 165, 7);
    });
    y += 10;
    doc.text('Tes domaines d\'intérêt :', 20, y);
    y += 7;
    decisionFinale.analyse.domaines_interet.forEach(domaine => {
        y = addWrappedText(`• ${domaine}`, 25, y, 165, 7);
    });

    // Nouvelle page si nécessaire
    if (y > 250) {
        doc.addPage();
        y = 20;
    }

    // Métier principal recommandé
    y += 10;
    doc.setFontSize(16);
    doc.setTextColor(102, 0, 102);
    doc.text('Métier recommandé', 20, y);
    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(decisionFinale.recommandations.metier_principal.nom, 20, y);
    y += 7;
    doc.setFontSize(12);
    y = addWrappedText(decisionFinale.recommandations.metier_principal.description, 20, y, 170, 7);
    y += 7;
    y = addWrappedText(decisionFinale.recommandations.metier_principal.adequation, 20, y, 170, 7);

    // Nouvelle page si nécessaire
    if (y > 250) {
        doc.addPage();
        y = 20;
    }

    // Métiers alternatifs
    y += 10;
    doc.setFontSize(16);
    doc.setTextColor(102, 0, 102);
    doc.text('Autres métiers à considérer', 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    decisionFinale.recommandations.metiers_alternatifs.forEach(metier => {
        y = addWrappedText(`• ${metier.nom}: ${metier.description}`, 25, y, 165, 7);
    });

    // Nouvelle page si nécessaire
    if (y > 250) {
        doc.addPage();
        y = 20;
    }

    // Filière recommandée
    y += 10;
    doc.setFontSize(16);
    doc.setTextColor(102, 0, 102);
    doc.text('Filière d\'études recommandée', 20, y);
    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(decisionFinale.recommandations.filiere.nom, 20, y);
    y += 7;
    doc.setFontSize(12);
    y = addWrappedText(decisionFinale.recommandations.filiere.description, 20, y, 170, 7);
    y += 7;
    doc.text('Établissements proposant cette filière :', 20, y);
    y += 7;
    decisionFinale.recommandations.filiere.etablissements.forEach(etablissement => {
        y = addWrappedText(`• ${etablissement}`, 25, y, 165, 7);
    });

    // Nouvelle page si nécessaire
    if (y > 250) {
        doc.addPage();
        y = 20;
    }

    // Conseils
    y += 10;
    doc.setFontSize(16);
    doc.setTextColor(102, 0, 102);
    doc.text('Conseils pour réussir', 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    decisionFinale.recommandations.conseils.forEach((conseil, index) => {
        y = addWrappedText(`${index + 1}. ${conseil}`, 25, y, 165, 7);
        y += 5;
    });

    // Conclusion
    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(102, 0, 102);
    y = addWrappedText(decisionFinale.conclusion, 20, y, 170, 7);

    // Pied de page
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Cette fiche d\'orientation est personnalisée pour toi. N\'hésite pas à en discuter avec un conseiller.', 105, 280, { align: 'center' });

    // Sauvegarder le PDF
    doc.save(`fiche-orientation-professionnelle-${nom}.pdf`);
}