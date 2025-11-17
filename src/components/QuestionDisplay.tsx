import type { Question } from '../types'

interface QuestionDisplayProps {
  questions: Question[]
}

function QuestionDisplay({ questions }: QuestionDisplayProps) {
  const getQuestionType = (question: Question): string => {
    if (question.configuration.open) return 'Pregunta Abierta'
    if (question.configuration.numerical) return 'Pregunta Numérica'
    if (question.configuration.true_false) return 'Verdadero/Falso'
    return 'Opción Múltiple'
  }

  const getQuestionTypeColor = (question: Question): string => {
    if (question.configuration.open) return 'bg-green-100 text-green-800'
    if (question.configuration.numerical) return 'bg-purple-100 text-purple-800'
    if (question.configuration.true_false) return 'bg-amber-100 text-amber-800'
    return 'bg-blue-100 text-blue-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Preguntas Generadas
        </h2>
        <span className="text-sm text-gray-600">
          Total: {questions.length} {questions.length === 1 ? 'pregunta' : 'preguntas'}
        </span>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            {/* Question Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-gray-700">
                    Pregunta {index + 1}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getQuestionTypeColor(question)}`}
                  >
                    {getQuestionType(question)}
                  </span>
                </div>
                <p className="text-lg text-gray-900 font-medium">
                  {question.question}
                </p>
              </div>
            </div>

            {/* Question Content */}
            <div className="mt-4">
              {/* True/False */}
              {question.configuration.true_false && (
                <div className="space-y-3">
                  {question.options.map((option) => {
                    const isCorrect = option.id === question.answer
                    return (
                      <div
                        key={option.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isCorrect
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-6 h-6 mt-0.5">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                isCorrect
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-400'
                              }`}
                            >
                              {isCorrect && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                isCorrect ? 'text-green-900' : 'text-gray-700'
                              }`}
                            >
                              {option.description}
                            </p>
                            {option.explanation && (
                              <p className="text-sm text-gray-600 mt-1">
                                {option.explanation}
                              </p>
                            )}
                          </div>
                          {isCorrect && (
                            <span className="text-green-600 font-semibold text-sm">
                              ✓ Correcta
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Multiple Choice */}
              {!question.configuration.open && !question.configuration.numerical && !question.configuration.true_false && (
                <div className="space-y-3">
                  {question.options.map((option) => {
                    const isCorrect = option.id === question.answer
                    return (
                      <div
                        key={option.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isCorrect
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-6 h-6 mt-0.5">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                isCorrect
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-400'
                              }`}
                            >
                              {isCorrect && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                isCorrect ? 'text-green-900' : 'text-gray-700'
                              }`}
                            >
                              {option.description}
                            </p>
                            {option.explanation && (
                              <p className="text-sm text-gray-600 mt-1">
                                {option.explanation}
                              </p>
                            )}
                          </div>
                          {isCorrect && (
                            <span className="text-green-600 font-semibold text-sm">
                              ✓ Correcta
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Open Question */}
              {question.configuration.open && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Respuesta del estudiante:
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 resize-none"
                    rows={4}
                    placeholder="El estudiante escribirá su respuesta aquí..."
                    disabled
                  />
                  <p className="text-xs text-gray-500">
                    {question.configuration.case_sensitive
                      ? 'Evaluación sensible a mayúsculas/minúsculas'
                      : 'Evaluación no sensible a mayúsculas/minúsculas'}
                  </p>
                </div>
              )}

              {/* Numerical Question */}
              {question.configuration.numerical && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Respuesta numérica:
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      className="w-40 p-3 border border-gray-300 rounded-lg bg-gray-50"
                      placeholder="0"
                      disabled
                    />
                    <div className="flex-1 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">Respuesta correcta:</span>{' '}
                        {question.answer}
                        {question.configuration.error_range && (
                          <span className="ml-2 text-green-700">
                            (±{question.configuration.error_range} margen de error)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionDisplay
