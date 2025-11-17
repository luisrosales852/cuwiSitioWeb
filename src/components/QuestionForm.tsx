import { useState } from 'react'
import type { QuestionFormData, Chunk } from '../types'

interface QuestionFormProps {
  selectedChunks: Chunk[]
  onSubmit: (data: QuestionFormData) => void
}

function QuestionForm({ selectedChunks, onSubmit }: QuestionFormProps) {
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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuración de Preguntas</h2>

      {/* Educational Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nivel Educativo
        </label>
        <select
          value={formData.educational_level}
          onChange={(e) => setFormData({ ...formData, educational_level: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Question Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Pregunta
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.question_type.includes('Multiple choice')}
              onChange={() => handleQuestionTypeChange('Multiple choice')}
              className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Multiple choice</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.question_type.includes('Open text')}
              onChange={() => handleQuestionTypeChange('Open text')}
              className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Open text</span>
          </label>
        </div>
      </div>

      {/* Selected Chunks Display */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chunks Seleccionados ({selectedChunks.length})
        </label>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 max-h-40 overflow-y-auto">
          {selectedChunks.length > 0 ? (
            <ul className="space-y-1 text-sm text-gray-600">
              {selectedChunks.map((chunk) => (
                <li key={chunk.id} className="flex items-center gap-2">
                  <span className="font-medium">{chunk.id}</span>
                  <span className="text-gray-400">-</span>
                  <span className="text-xs">{chunk.type}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">No hay chunks seleccionados</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={selectedChunks.length === 0 || formData.question_type.length === 0}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          selectedChunks.length === 0 || formData.question_type.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Generar Preguntas
      </button>
    </form>
  )
}

export default QuestionForm
