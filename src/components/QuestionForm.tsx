import { useState } from 'react'
import type { QuestionFormData, Chunk } from '../types'

interface QuestionFormProps {
  selectedChunks: Chunk[]
  onSubmit: (data: QuestionFormData) => void
  isGenerating?: boolean
  onGoToQuiz?: () => void
  questionsGenerated?: boolean
}

function QuestionForm({
  selectedChunks,
  onSubmit,
  isGenerating = false,
  onGoToQuiz,
  questionsGenerated = false
}: QuestionFormProps) {
  const [formData, setFormData] = useState<QuestionFormData>({
    educational_level: 'Middle School',
    context: '',
    number_of_questions: 5,
    bloom: 'Understand',
    dok: 2,
    question_type: [],
    selectedChunks: selectedChunks.map(c => c.id)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      selectedChunks: selectedChunks.map(c => c.id)
    })
  }

  const handleQuestionTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      question_type: prev.question_type.includes(type)
        ? prev.question_type.filter(t => t !== type)
        : [...prev.question_type, type]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración de Preguntas</h2>

      {/* Educational Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nivel Educativo
        </label>
        <select
          value={formData.educational_level}
          onChange={(e) => setFormData({ ...formData, educational_level: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        >
          <option value="Elementary School">Elementary School</option>
          <option value="Middle School">Middle School</option>
          <option value="High School">High School</option>
        </select>
      </div>

      {/* Context */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contexto / Enfoque Didáctico
        </label>
        <textarea
          value={formData.context}
          onChange={(e) => setFormData({ ...formData, context: e.target.value })}
          placeholder="Describe el enfoque o tipo de clase..."
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
        />
      </div>

      {/* Number of Questions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de Preguntas
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={formData.number_of_questions}
          onChange={(e) => setFormData({ ...formData, number_of_questions: parseInt(e.target.value) || 1 })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Bloom's Taxonomy */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nivel de Bloom
        </label>
        <select
          value={formData.bloom}
          onChange={(e) => setFormData({ ...formData, bloom: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        >
          <option value="Remember">Remember</option>
          <option value="Understand">Understand</option>
          <option value="Apply">Apply</option>
        </select>
      </div>

      {/* DOK Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profundidad del Conocimiento (DOK)
        </label>
        <input
          type="number"
          min="1"
          max="3"
          value={formData.dok}
          onChange={(e) => setFormData({ ...formData, dok: parseInt(e.target.value) || 1 })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Question Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Pregunta
        </label>
        <div className="space-y-3">
          <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={formData.question_type.includes('Multiple choice')}
              onChange={() => handleQuestionTypeChange('Multiple choice')}
              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">Multiple choice</span>
          </label>
          <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={formData.question_type.includes('Open text')}
              onChange={() => handleQuestionTypeChange('Open text')}
              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">Open text</span>
          </label>
        </div>
      </div>

      {/* Selected Chunks Display */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chunks Seleccionados ({selectedChunks.length})
        </label>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 max-h-40 overflow-y-auto">
          {selectedChunks.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {selectedChunks.map((chunk) => (
                <li key={chunk.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-md">
                  <span className="font-semibold text-blue-600">{chunk.id}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded uppercase font-medium text-gray-600">{chunk.type}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic text-center">No hay chunks seleccionados</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={selectedChunks.length === 0 || formData.question_type.length === 0 || isGenerating}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            selectedChunks.length === 0 || formData.question_type.length === 0 || isGenerating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          {isGenerating ? 'Generando preguntas...' : 'Generar Preguntas'}
        </button>
        <button
          type="button"
          onClick={onGoToQuiz}
          disabled={!questionsGenerated}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
            questionsGenerated
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
          }`}
        >
          {questionsGenerated ? 'Pasar a Quiz →' : 'Pasar a Quiz'}
        </button>
      </div>
    </form>
  )
}

export default QuestionForm
