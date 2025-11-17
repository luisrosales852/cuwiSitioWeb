import jsPDF from 'jspdf'
import type { Question, QuestionFormData } from '../types'

export function generateExamPDF(
  questions: Question[],
  formData: QuestionFormData
): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin
  let yPosition = margin

  // Helper function to add text with word wrap
  const addText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 11
  ): number => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + lines.length * (fontSize * 0.5) // Approximate line height
  }

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number): void => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
    }
  }

  // Header
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  const title = `Examen - ${formData.educational_level}`
  doc.text(title, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  // Date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const date = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  doc.text(`Fecha: ${date}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Divider line
  doc.setLineWidth(0.5)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 10

  // Questions
  questions.forEach((question, index) => {
    checkPageBreak(40) // Ensure minimum space for question

    // Question number and text
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    const questionNumber = `${index + 1}. `
    const questionTextX = margin + 8

    doc.text(questionNumber, margin, yPosition)
    doc.setFont('helvetica', 'normal')
    yPosition = addText(question.question, questionTextX, yPosition, maxWidth - 8, 11)
    yPosition += 5

    // Question type indicator (subtle)
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    let typeText = ''
    if (question.configuration.open) {
      typeText = '(Pregunta Abierta)'
    } else if (question.configuration.numerical) {
      typeText = '(Pregunta Numérica)'
    } else if (question.configuration.true_false) {
      typeText = '(Verdadero/Falso)'
    } else {
      typeText = '(Opción Múltiple)'
    }
    doc.text(typeText, questionTextX, yPosition)
    yPosition += 6
    doc.setTextColor(0, 0, 0) // Reset color

    // Options or answer space based on question type
    if (question.configuration.open) {
      // Open text - add lines for writing
      doc.setFontSize(10)
      doc.text('Respuesta:', questionTextX, yPosition)
      yPosition += 5
      for (let i = 0; i < 4; i++) {
        checkPageBreak(10)
        doc.setLineWidth(0.3)
        doc.line(questionTextX, yPosition, pageWidth - margin, yPosition)
        yPosition += 7
      }
    } else if (question.configuration.numerical) {
      // Numerical - add a box for the answer
      doc.setFontSize(10)
      doc.text('Respuesta:', questionTextX, yPosition)
      yPosition += 5
      checkPageBreak(10)
      doc.setLineWidth(0.3)
      doc.rect(questionTextX, yPosition - 4, 40, 8)
      yPosition += 8
    } else if (question.configuration.true_false) {
      // True/False options
      doc.setFontSize(10)
      checkPageBreak(15)
      doc.text('Verdadero', questionTextX + 5, yPosition)
      yPosition += 6
      doc.text('Falso', questionTextX + 5, yPosition)
      yPosition += 6
    } else if (question.options && question.options.length > 0) {
      // Multiple choice options
      doc.setFontSize(10)
      const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F']
      question.options.forEach((option, optIndex) => {
        checkPageBreak(8)
        const label = optionLabels[optIndex] || String(optIndex + 1)
        const optionText = `${label}) ${option.description}`
        yPosition = addText(optionText, questionTextX + 5, yPosition, maxWidth - 13, 10)
        yPosition += 4
      })
    }

    yPosition += 8 // Space between questions
  })

  // Footer on last page
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // Save the PDF
  const fileName = `examen_${formData.educational_level.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`
  doc.save(fileName)
}
