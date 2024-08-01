import { jsPDF } from "jspdf";

export function saveChatToPdf(messages) {
    const doc = new jsPDF();

    let yOffset = 10;
    doc.setFontSize(16);
    doc.text('Historique de la décision', 105, yOffset, { align: 'center' });
    yOffset += 10;

    doc.setFontSize(12);
    messages.forEach((message) => {
        const prefix = message.isUser ? 'Vous : ' : 'IA : ';
        const text = prefix + message.content;

        const lines = doc.splitTextToSize(text, 180);

        if (yOffset + lines.length * 7 > 280) {
            doc.addPage();
            yOffset = 10;
        }

        doc.text(lines, 15, yOffset);
        yOffset += lines.length * 7 + 5;
    });

    doc.save('decision-chat.pdf');
}