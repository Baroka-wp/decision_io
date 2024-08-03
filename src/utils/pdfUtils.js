import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialisation des polices
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export function genererPDF(decisionFinale, nom) {
    const docDefinition = {
        content: [
            { text: `Fiche d'Orientation Professionnelle de ${nom}`, style: 'header' },
            { text: decisionFinale.introduction, style: 'introduction' },
            { text: 'Ton profil', style: 'subheader' },
            { text: decisionFinale.analyse.profil },
            { text: 'Tes points forts :', style: 'listHeader' },
            {
                ul: decisionFinale.analyse.points_forts
            },
            { text: 'Tes domaines d\'intérêt :', style: 'listHeader' },
            {
                ul: decisionFinale.analyse.domaines_interet
            },
            { text: 'Métier recommandé', style: 'subheader' },
            { text: decisionFinale.recommandations.metier_principal.nom, style: 'jobTitle' },
            { text: decisionFinale.recommandations.metier_principal.description },
            { text: decisionFinale.recommandations.metier_principal.adequation, style: 'italic' },
            { text: 'Autres métiers à considérer', style: 'subheader' },
            {
                ul: decisionFinale.recommandations.metiers_alternatifs.map(metier => `${metier.nom}: ${metier.description}`)
            },
            { text: 'Filière d\'études recommandée', style: 'subheader' },
            { text: decisionFinale.recommandations.filiere.nom, style: 'jobTitle' },
            { text: decisionFinale.recommandations.filiere.description },
            { text: 'Établissements proposant cette filière :', style: 'listHeader' },
            {
                ul: decisionFinale.recommandations.filiere.etablissements
            },
            { text: 'Conseils pour réussir', style: 'subheader' },
            {
                ol: decisionFinale.recommandations.conseils
            },
            { text: decisionFinale.conclusion, style: 'conclusion' },
        ],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                color: '#9E005D',
                alignment: 'center',
                margin: [0, 0, 0, 20]
            },
            introduction: {
                fontSize: 14,
                italics: true,
                margin: [0, 0, 0, 20]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                color: '#660066',
                margin: [0, 20, 0, 10]
            },
            listHeader: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            jobTitle: {
                fontSize: 14,
                bold: true,
                margin: [0, 0, 0, 5]
            },
            italic: {
                italics: true,
                margin: [0, 5, 0, 10]
            },
            conclusion: {
                fontSize: 14,
                italics: true,
                alignment: 'center',
                margin: [0, 20, 0, 0]
            }
        },
        footer: function (currentPage, pageCount) {
            return {
                text: 'Cette fiche d\'orientation est personnalisée pour toi. N\'hésite pas à en discuter avec un conseiller.',
                alignment: 'center',
                fontSize: 10,
                margin: [0, 10, 0, 0]
            };
        },
        pageBreakBefore: function (currentNode, followingNodesOnPage) {
            return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
        }
    };

    pdfMake.createPdf(docDefinition).download(`fiche-orientation-professionnelle-${nom}.pdf`);
}