import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download } from 'lucide-react';

export default function PdfDownloader({ transactions, account }) {
    if (!transactions || transactions.length === 0) return null;

    const generatePdf = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.setTextColor(99, 102, 241);
        doc.text("Axiom Bank", 14, 20);

        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text("Account Statement", 14, 30);
        
        doc.setFontSize(10);
        doc.text(`Account Number: ${account?.accountNumber || 'N/A'}`, 14, 40);
        doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 45);

        const tableColumn = ["Ref", "Date", "Type", "Amount", "Status"];
        const tableRows = [];

        transactions.forEach(tx => {
            const txData = [
                tx.referenceNumber,
                new Date(tx.timestamp).toLocaleString(),
                tx.type,
                `$${tx.amount}`,
                tx.status
            ];
            tableRows.push(txData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 55,
            theme: 'striped',
            styles: { fontSize: 9 },
            headStyles: { fillColor: [99, 102, 241] }
        });

        doc.save(`axiom_statement_${account?.accountNumber || 'acc'}.pdf`);
    };

    return (
        <button className="btn" onClick={generatePdf} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
            <Download size={16} />
            Export Statement
        </button>
    );
}

