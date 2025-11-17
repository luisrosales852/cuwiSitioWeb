import { useState } from 'react'
import Snackbar from './Snackbar'
import ChunkCard from './ChunkCard'
import QuestionForm from './QuestionForm'
import QuestionDisplay from './QuestionDisplay'
import type { Chunk, QuestionFormData, Question } from '../types'
import chunksData from '../mock/chunks.json'
import { generateQuestionsMock } from '../services/questionService'

interface Notification {
  message: string
  type: 'success' | 'info' | 'processing'
  isVisible: boolean
}

function PDFUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [notification, setNotification] = useState<Notification>({
    message: '',
    type: 'info',
    isVisible: false,
  })
  const [chunks, setChunks] = useState<Chunk[]>([])
  const [selectedChunkIds, setSelectedChunkIds] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const showNotification = (message: string, type: 'success' | 'info' | 'processing') => {
    setNotification({ message, type, isVisible: true })
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }))
    }, 3000)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
      showNotification('Archivo recibido', 'success')
    } else if (file) {
      showNotification('Por favor selecciona un archivo PDF válido', 'info')
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    // Reset the file input
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleProcess = () => {
    if (!selectedFile) return

    setIsProcessing(true)
    showNotification('Procesando...', 'processing')

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      // Load chunks from mock data
      const loadedChunks = chunksData.chunks as Chunk[]
      setChunks(loadedChunks)
      // Select all chunks by default
      setSelectedChunkIds(loadedChunks.map(c => c.id))
      setShowForm(true)
      showNotification('Procesado exitosamente', 'success')
    }, 2500)
  }

  const handleChunkToggle = (id: string) => {
    setSelectedChunkIds(prev =>
      prev.includes(id)
        ? prev.filter(chunkId => chunkId !== id)
        : [...prev, id]
    )
  }

  const handleFormSubmit = async (data: QuestionFormData) => {
    setIsGenerating(true)
    showNotification('Generando preguntas...', 'processing')

    try {
      const response = await generateQuestionsMock(selectedChunks, data)
      setGeneratedQuestions(response.questions)
      setShowForm(false)
      showNotification(
        `${response.questions.length} preguntas generadas exitosamente`,
        'success'
      )
    } catch (error) {
      showNotification('Error al generar preguntas', 'info')
      console.error('Error generating questions:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setGeneratedQuestions(null)
    setShowForm(true)
  }

  const selectedChunks = chunks.filter(chunk => selectedChunkIds.includes(chunk.id))

  return (
    <>
      <Snackbar
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
      />

      <div className="w-full max-w-4xl space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Subir PDF</h2>

          {/* File Upload Input */}
          <div className="mb-4">
            <label
              htmlFor="pdf-upload"
              className="block w-full cursor-pointer"
            >
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold text-blue-500">Haz clic para seleccionar</span> o arrastra un archivo
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF (máx. 10MB)</p>
              </div>
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-8 w-8 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemove}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remover archivo"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Process Button */}
          <button
            onClick={handleProcess}
            disabled={!selectedFile || isProcessing}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              !selectedFile || isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isProcessing ? 'Procesando...' : 'Procesar contenido'}
          </button>
        </div>

        {/* Generated Questions Display */}
        {generatedQuestions && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <QuestionDisplay questions={generatedQuestions} />
            </div>
            <button
              onClick={handleReset}
              className="w-full py-3 px-4 rounded-lg font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              Generar nuevas preguntas
            </button>
          </div>
        )}

        {/* Chunks Display */}
        {!generatedQuestions && showForm && chunks.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Fragmentos del PDF ({chunks.length})
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Selecciona los fragmentos que deseas incluir en la generación de preguntas
              </p>
              <div className="grid grid-cols-1 gap-3">
                {chunks.map((chunk) => (
                  <ChunkCard
                    key={chunk.id}
                    chunk={chunk}
                    isSelected={selectedChunkIds.includes(chunk.id)}
                    onToggle={handleChunkToggle}
                  />
                ))}
              </div>
            </div>

            {/* Question Form */}
            <QuestionForm
              selectedChunks={selectedChunks}
              onSubmit={handleFormSubmit}
              isGenerating={isGenerating}
            />
          </>
        )}
      </div>
    </>
  )
}

export default PDFUpload
