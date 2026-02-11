import jsPDF from "jspdf";

/**
 * Converts a markdown string into a styled PDF and triggers download.
 */
export function downloadMarkdownAsPdf(markdown: string, filename = "resource.pdf") {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addPageIfNeeded = (requiredSpace: number) => {
    if (y + requiredSpace > doc.internal.pageSize.getHeight() - 15) {
      doc.addPage();
      y = 20;
    }
  };

  const lines = markdown.split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Heading levels
    if (line.startsWith("### ")) {
      addPageIfNeeded(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(line.replace(/^###\s*/, ""), margin, y);
      y += 7;
    } else if (line.startsWith("## ")) {
      addPageIfNeeded(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text(line.replace(/^##\s*/, ""), margin, y);
      y += 9;
    } else if (line.startsWith("# ")) {
      addPageIfNeeded(14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(line.replace(/^#\s*/, ""), margin, y);
      y += 11;
    } else if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ")) {
      // Bullet point
      addPageIfNeeded(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const text = line.replace(/^[-*•]\s*/, "").replace(/\*\*/g, "");
      const wrapped = doc.splitTextToSize(`•  ${text}`, contentWidth - 5);
      doc.text(wrapped, margin + 4, y);
      y += wrapped.length * 5.5;
    } else if (/^\d+[.)]\s/.test(line)) {
      // Numbered step
      addPageIfNeeded(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      const match = line.match(/^(\d+[.)]\s*)(.*)/);
      if (match) {
        const num = match[1];
        const rest = match[2].replace(/\*\*/g, "");
        const wrapped = doc.splitTextToSize(`${num}${rest}`, contentWidth - 5);
        doc.text(wrapped, margin + 2, y);
        y += wrapped.length * 6;
      }
    } else if (line.trim() === "") {
      y += 3;
    } else {
      // Normal paragraph
      addPageIfNeeded(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const clean = line.replace(/\*\*/g, "");
      const wrapped = doc.splitTextToSize(clean, contentWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 5.5;
    }
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`YUSR — Visual Recipe Resource  |  Page ${p} of ${pageCount}`, margin, doc.internal.pageSize.getHeight() - 8);
    doc.setTextColor(0);
  }

  doc.save(filename);
}
