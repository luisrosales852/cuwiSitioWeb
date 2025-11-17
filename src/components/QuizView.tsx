import { useState } from 'react'
import type { Question, QuestionFormData } from '../types'
import QuestionDisplay from './QuestionDisplay'
import { generateExamPDF } from '../services/pdfService'

interface QuizViewProps {
  questions: Question[]
  formData: QuestionFormData
  onBack: () => void
}

function QuizView({ questions, formData, onBack }: QuizViewProps) {
  const [showAnswers, setShowAnswers] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string | number>>({})

  const handleDownloadPDF = () => {
    generateExamPDF(questions, formData)
  }

  const getQuestionTypeLabel = (question: Question): string => {
    if (question.configuration.open) return 'Pregunta Abierta'
    if (question.configuration.numerical) return 'Pregunta Numérica'
    if (question.configuration.true_false) return 'Verdadero/Falso'
    return 'Opción Múltiple'
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Examen - {formData.educational_level}</h1>
        <p className="text-blue-100 text-sm">
          {new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <div className="mt-4 pt-4 border-t border-blue-500">
          <p className="text-sm text-blue-100">
            Total de preguntas: <span className="font-semibold text-white">{questions.length}</span>
          </p>
        </div>
      </div>

      {/* Questions Display */}
      {!showAnswers ? (
        <div className="space-y-6 mb-8">
          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200"
            >
              {/* Question Number and Type */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-600 text-white font-bold text-lg rounded-full w-8 h-8 flex items-center justify-center">
                    {index + 1}
                  </span>
                  {question.configuration.true_false ? (
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                      <button
                        onClick={() => setAnswers({ ...answers, [index]: 'verdadero' })}
                        className={`px-4 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          answers[index] === 'verdadero'
                            ? 'bg-green-500 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Verdadero
                      </button>
                      <button
                        onClick={() => setAnswers({ ...answers, [index]: 'falso' })}
                        className={`px-4 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          answers[index] === 'falso'
                            ? 'bg-red-500 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Falso
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {getQuestionTypeLabel(question)}
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <p className="text-lg text-gray-800 font-medium mb-4 leading-relaxed">
                {question.question}
              </p>

              {/* Answer Space Based on Type */}
              {question.configuration.open && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">Respuesta:</p>
                  <textarea
                    value={answers[index] !== undefined ? String(answers[index]) : ''}
                    onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                    rows={4}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                    placeholder="Escribe tu respuesta aquí..."
                  />
                </div>
              )}

              {question.configuration.numerical && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Respuesta:</p>
                  <input
                    type="number"
                    value={answers[index] !== undefined ? String(answers[index]) : ''}
                    onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                    className="w-32 h-10 border-2 border-gray-300 rounded-lg px-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Respuesta"
                  />
                </div>
              )}

              {question.options && question.options.length > 0 && (
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => {
                    const label = ['A', 'B', 'C', 'D', 'E', 'F'][optIndex] || String(optIndex + 1)
                    const isSelected = answers[index] === option.id
                    return (
                      <label
                        key={option.id}
                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-50 border-2 border-blue-400'
                            : 'border-2 border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option.id}
                          checked={isSelected}
                          onChange={() => setAnswers({ ...answers, [index]: option.id })}
                          className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-gray-700">
                          <span className="font-semibold">{label})</span> {option.description}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-8">
          <QuestionDisplay questions={questions} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center items-center pb-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          ← Volver
        </button>

        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          {showAnswers ? '← Ocultar Respuestas' : 'Ver Respuestas →'}
        </button>

        <button
          onClick={handleDownloadPDF}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Descarga Lista
        </button>
      </div>
    </div>
  )
}

export default QuizView
