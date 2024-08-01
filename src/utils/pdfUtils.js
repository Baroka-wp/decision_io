import { jsPDF } from "jspdf";

export function genererPDF(reponses, decisionFinale, nom) {
    const doc = new jsPDF();

    const addWrappedText = (text, x, y, maxWidth, lineHeight) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * lineHeight);
    };

    const addNewPageIfNeeded = (yOffset, neededSpace) => {
        if (yOffset + neededSpace > 280) {
            doc.addPage();
            return 20;
        }
        return yOffset;
    };

    // Titre
    doc.setFontSize(22);
    doc.setTextColor(158, 0, 93); // Couleur fuschia
    doc.text(`Fiche d'Orientation Professionnelle de ${nom}`, 105, 20, { align: 'center' });

    let yOffset = 40;

    // Introduction
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    yOffset = addWrappedText(decisionFinale.introduction, 20, yOffset, 170, 7);
    yOffset = addNewPageIfNeeded(yOffset, 20);

    // Profil
    doc.setFontSize(16);
    doc.setTextColor(102, 0, 102); // Couleur violet foncé
    doc.text('Ton profil', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    yOffset = addWrappedText(decisionFinale.analyse.profil, 20, yOffset, 170, 7);
    yOffset = addNewPageIfNeeded(yOffset, 30);

    // Points forts et domaines d'intérêt
    doc.setFontSize(14);
    doc.text('Tes points forts :', 20, yOffset);
    yOffset += 7;
    decisionFinale.analyse.points_forts.forEach(point => {
        yOffset = addWrappedText(`• ${point}`, 25, yOffset, 165, 7);
    });
    yOffset = addNewPageIfNeeded(yOffset, 20);
    doc.text('Tes domaines d\'intérêt :', 20, yOffset);
    yOffset += 7;
    decisionFinale.analyse.domaines_interet.forEach(domaine => {
        yOffset = addWrappedText(`• ${domaine}`, 25, yOffset, 165, 7);
    });
    yOffset = addNewPageIfNeeded(yOffset, 20);

    // Métier principal recommandé
    doc.setFontSize(16);
    doc.setTextColor(102, 0, 102);
    doc.text('Métier recommandé', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(decisionFinale.recommandations.metier_principal.nom, 20, yOffset);
    yOffset += 7;
    doc.setFontSize(12);
    yOffset = addWrappedText(decisionFinale.recommandations.metier_principal.description, 20, yOffset, 170, 7);
    yOffset += 7;
    yOffset = addWrappedText(decisionFinale.recommandations.metier_principal.adequation, 20, yOffset, 170, 7);
    yOffset = addNewPageIfNeeded(yOffset, 20);

    // Métiers alternatifs
    doc.setFontSize(16);
    doc.setTextColor(102, 0, 102);
    doc.text('Autres métiers à considérer', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    decisionFinale.recommandations.metiers_alternatifs.forEach(metier => {
        yOffset = addWrappedText(`• ${metier.nom}: ${metier.description}`, 25, yOffset, 165, 7);
    });
    yOffset = addNewPageIfNeeded(yOffset, 20);

    // Filière recommandée
    doc.setFontSize(16);
    doc.setTextColor(102, 0, 102);
    doc.text('Filière d\'études recommandée', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(decisionFinale.recommandations.filiere.nom, 20, yOffset);
    yOffset += 7;
    doc.setFontSize(12);
    yOffset = addWrappedText(decisionFinale.recommandations.filiere.description, 20, yOffset, 170, 7);
    yOffset += 7;
    doc.text('Établissements proposant cette filière :', 20, yOffset);
    yOffset += 7;
    decisionFinale.recommandations.filiere.etablissements.forEach(etablissement => {
        yOffset = addWrappedText(`• ${etablissement}`, 25, yOffset, 165, 7);
    });
    yOffset = addNewPageIfNeeded(yOffset, 20);

    // Conseils
    doc.setFontSize(16);
    doc.setTextColor(102, 0, 102);
    doc.text('Conseils pour réussir', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    decisionFinale.recommandations.conseils.forEach((conseil, index) => {
        yOffset = addWrappedText(`${index + 1}. ${conseil}`, 25, yOffset, 165, 7);
        yOffset += 5;
    });
    yOffset = addNewPageIfNeeded(yOffset, 20);

    // Conclusion
    doc.setFontSize(14);
    doc.setTextColor(102, 0, 102);
    yOffset = addWrappedText(decisionFinale.conclusion, 20, yOffset, 170, 7);

    // Pied de page
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Cette fiche d\'orientation est personnalisée pour toi. N\'hésite pas à en discuter avec un conseiller.', 105, 280, { align: 'center' });

    doc.save(`fiche-orientation-professionnelle-${nom}.pdf`);
}