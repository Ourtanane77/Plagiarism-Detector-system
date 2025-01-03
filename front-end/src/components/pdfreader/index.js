import React from "react";
import {
  Link as LinkIcon,
  AlertTriangle,
  DownloadIcon,
  RefreshCwIcon,
  FileText,
  User,
  Tag,
  Hash,
  BookOpen,
  Type,
  BarChart2,
  AlignJustify,
  Info,
  BookDashed,
  Music,
} from "lucide-react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { jsPDF } from "jspdf";

const PDFReader = ({ data, onTryAgain }) => {
  const { metadata, statistics, plagiarism_results, overal } = data;

  const score = Math.round((overal.overal_score_pdf || 0) * 100);
  const uniqueScore = Math.round((overal.overal_unique_score_pdf || 0) * 100);
  const jaccardScore = Math.round((overal.jaccard_score || 0) * 100);
  const model_score = Math.round((overal.model_score || 0) * 100);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;
  
    // Helper function to add new page if needed
    const checkPageBreak = (height = 10) => {
      if (yPosition + height >= pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };
  
    // Helper function to process paragraph text similar to highlightPlagiarizedText
    const processParagraphText = (paragraph) => {
      if (!paragraph.results || paragraph.results.length === 0) {
        return [{
          text: paragraph.paragraph_content,
          type: "normal"
        }];
      }
  
      let content = paragraph.paragraph_content;
      let segments = [];
      let lastIndex = 0;
  
      // Sort plagiarized sections by their position in the text
      const allSections = paragraph.results.flatMap((result) =>
        result.plagiarized_sections_in_both.map((section) => ({
          ...section,
          url: result.url,
        }))
      );
  
      allSections.forEach((section) => {
        const startIndex = content.indexOf(section.Paragraphe_pdf_Content);
        if (startIndex === -1) return;
  
        // Add non-plagiarized text before this section
        if (startIndex > lastIndex) {
          segments.push({
            text: content.slice(lastIndex, startIndex),
            type: "normal"
          });
        }
  
        // Add plagiarized section
        segments.push({
          text: section.Paragraphe_pdf_Content,
          type: "plagiarized",
          color: section.color,
          url: section.url
        });
  
        lastIndex = startIndex + section.Paragraphe_pdf_Content.length;
      });
  
      // Add any remaining text
      if (lastIndex < content.length) {
        segments.push({
          text: content.slice(lastIndex),
          type: "normal"
        });
      }
  
      return segments;
    };
  
    // Add header
    doc.setFillColor(249, 250, 251);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setFontSize(24);
    doc.setTextColor(31, 41, 55);
    doc.text("Plagiarism Analysis Report", pageWidth / 2, 30, { align: "center" });
    yPosition = 50;
  
    // Add scores section
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text("Analysis Scores", margin, yPosition);
    yPosition += 10;
  
    // Add score boxes
    const scores = [
      { label: "Overall Score", value: score },
      { label: "Unique Content", value: uniqueScore },
      { label: "Jaccard Score", value: jaccardScore },
      { label: "Model Score", value: model_score }
    ];
  
    doc.setFontSize(12);
    scores.forEach((scoreItem, index) => {
      const xPos = margin + (index * (contentWidth / 4));
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(xPos, yPosition, (contentWidth / 4) - 10, 40, 3, 3, 'F');
      doc.setTextColor(107, 114, 128);
      doc.text(scoreItem.label, xPos + 5, yPosition + 15);
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(16);
      doc.text(`${scoreItem.value}%`, xPos + 5, yPosition + 30);
      doc.setFontSize(12);
    });
    yPosition += 50;
  
    // Document Information Section
    checkPageBreak(60);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, yPosition, contentWidth, 60, 3, 3, 'F');
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text("Document Information", margin + 5, yPosition + 10);
  
    // Metadata grid
    doc.setFontSize(11);
    const metadataGrid = [
      [`Title: ${metadata.title}`, `Words: ${statistics.words}`],
      [`Author: ${metadata.author}`, `Characters: ${statistics.characters}`],
      [`Subject: ${metadata.subject}`, `Paragraphs: ${statistics.paragraphs}`],
      [`Keywords: ${metadata.keywords}`, `Syllables: ${statistics.syllables}`]
    ];
  
    metadataGrid.forEach((row, index) => {
      const rowY = yPosition + 20 + (index * 10);
      doc.setTextColor(107, 114, 128);
      doc.text(row[0], margin + 5, rowY);
      doc.text(row[1], margin + contentWidth/2, rowY);
    });
    yPosition += 70;
  
    // Content Analysis Section
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    checkPageBreak();
    doc.text("Content Analysis", margin, yPosition);
    yPosition += 15;
  
    // Process paragraphs
    plagiarism_results.forEach((paragraph, index) => {
      checkPageBreak();
      doc.setFontSize(12);
      // doc.text(`Paragraph ${index + 1}:`, margin, yPosition);
      yPosition += 10;
  
      const segments = processParagraphText(paragraph);
      
      segments.forEach((segment) => {
        checkPageBreak();
  
        if (segment.type === "normal") {
          // Normal text
          doc.setTextColor(31, 41, 55);
          const textLines = doc.splitTextToSize(segment.text, contentWidth - 10);
          textLines.forEach((line) => {
            checkPageBreak();
            doc.text(line, margin, yPosition);
            yPosition += 7;
          });
        } else {
          // Plagiarized text with background
          const colorMap = {
            red: [254, 226, 226],    // bg-red-100
            orange: [255, 237, 213], // bg-orange-100
            yellow: [254, 249, 195]  // bg-yellow-100
          };
          const bgColor = colorMap[segment.color] || [255, 255, 255];
          
          const textLines = doc.splitTextToSize(segment.text, contentWidth - 10);
          const blockHeight = (textLines.length * 7) + 6;
          
          // Add background
          doc.setFillColor(...bgColor);
          doc.roundedRect(margin - 2, yPosition - 2, contentWidth + 4, blockHeight, 2, 2, 'F');
          
          // Add text
          doc.setTextColor(31, 41, 55);
          textLines.forEach((line) => {
            checkPageBreak();
            doc.text(line, margin, yPosition);
            yPosition += 7;
          });
          
          // Add source URL
          doc.setTextColor(59, 130, 246);
          doc.setFontSize(9);
          doc.text(`Source: ${segment.url}`, margin, yPosition + 2);
          doc.setFontSize(12);
          yPosition += 12;
        }
      });
      
      yPosition += 10; // Space between paragraphs
    });
  
    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }
  
    doc.save("plagiarism-report.pdf");
  };

  const highlightPlagiarizedText = (paragraph) => {
    if (!paragraph.results || paragraph.results.length === 0) {
      return (
        <span className="text-gray-800">{paragraph.paragraph_content}</span>
      );
    }

    let content = paragraph.paragraph_content;
    let segments = [];
    let lastIndex = 0;

    // Sort plagiarized sections by their position in the text
    const allSections = paragraph.results.flatMap((result) =>
      result.plagiarized_sections_in_both.map((section) => ({
        ...section,
        url: result.url,
      }))
    );

    allSections.forEach((section) => {
      const startIndex = content.indexOf(section.Paragraphe_pdf_Content);
      if (startIndex === -1) return;

      // Add non-plagiarized text before this section
      if (startIndex > lastIndex) {
        segments.push({
          text: content.slice(lastIndex, startIndex),
          type: "normal",
        });
      }

      // Add plagiarized section
      segments.push({
        text: section.Paragraphe_pdf_Content,
        type: "plagiarized",
        color: section.color,
        url: section.url,
      });

      lastIndex = startIndex + section.Paragraphe_pdf_Content.length;
    });

    // Add any remaining text
    if (lastIndex < content.length) {
      segments.push({
        text: content.slice(lastIndex),
        type: "normal",
      });
    }

    return (
      <>
        {segments.map((segment, index) => (
          <React.Fragment key={index}>
            {segment.type === "normal" ? (
              <span className="text-gray-800">{segment.text}</span>
            ) : (
              <>
                <span
                  className={`${
                    segment.color === "red"
                      ? "bg-red-200"
                      : segment.color === "yellow"
                      ? "bg-yellow-200"
                      : "bg-green-100"
                  } px-1 rounded`}
                >
                  {segment.text}
                </span>
                <a
                  href={segment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 ml-1"
                >
                  <LinkIcon className="w-6 h-6 inline" />
                </a>
              </>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="p-4 max-w-[1200px] mx-auto">
      <div className="flex flex-col gap-6">
        {/* Top Section with Scores */}
        <div className="flex gap-6">
          <div className="space-y-1">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="w-48 h-48 mx-auto">
                <CircularProgressbar
                  value={score}
                  text={`${score}%`}
                  styles={buildStyles({
                    textSize: "20px",
                    pathColor: `rgba(62, 152, 199, ${score / 100})`,
                    textColor: "#1a1a1a",
                    trailColor: "#d6d6d6",
                  })}
                />
              </div>
              <p className="text-center mt-4 text-gray-600">Plagiarism Score</p>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Info className="w-7 h-7" />
              Document Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-gray-500" />
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium">{metadata.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-6 h-6 text-gray-500" />
                  <span className="text-gray-600">Author:</span>
                  <span className="font-medium">{metadata.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookDashed className="w-6 h-6 text-gray-500" />
                  <span className="text-gray-600">Keywords:</span>
                  <span className="font-medium">{metadata.keywords}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-gray-500" />
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">{metadata.subject}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="w-6 h-6 text-gray-500" />
                  <span className="text-gray-600">Words:</span>
                  <span className="font-medium">{statistics.words}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-6 h-6 text-gray-500" />
                  <span className="text-gray-600">Characters:</span>
                  <span className="font-medium">{statistics.characters}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlignJustify className="w-6 h-6 text-gray-500" />
                  <span className="text-gray-600">Paragraphs:</span>
                  <span className="font-medium">{statistics.paragraphs}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Music className="w-6 h-6 text-gray-500" />
                  <span className="text-gray-600">Syllables:</span>
                  <span className="font-medium">{statistics.syllables}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-white rounded-xl shadow-lg p-6 justify-center">
            <button
              onClick={onTryAgain}
              className="flex items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <RefreshCwIcon className="w-5 h-5" />
              <span>Try Another File</span>
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
            <BarChart2 className="w-11 h-11" />
            Analysis Results
          </h2>

          {score === 0 && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <span className="text-green-600">
                No plagiarism detected. The content is original!
              </span>
            </div>
          )}

          {score > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-blue-500" />
                <span className="text-blue-600 font-medium">
                  Similarity Analysis
                </span>
              </div>
              <div className="text-sm text-blue-600">
                <p>Overall Similarity Score: {score}%</p>
                <p>Unique Content Score: {uniqueScore}%</p>
                <p>Jaccard Score : {jaccardScore}%</p>
                <p>Our Model Score : {model_score}%</p>
                <p>Total Sources Found: {data.total_sources_found}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {plagiarism_results.map((paragraph, paragraphIndex) => (
              <div key={paragraphIndex} className="space-y-2 pb-2">
                <div className="text-justify">
                  {highlightPlagiarizedText(paragraph)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReader;
