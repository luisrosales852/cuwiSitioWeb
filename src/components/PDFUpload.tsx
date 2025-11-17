import { useState } from 'react'
import Snackbar from './Snackbar'
import ChunkCard from './ChunkCard'
import QuestionForm from './QuestionForm'
import QuizView from './QuizView'
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
  const [questionsGenerated, setQuestionsGenerated] = useState(false)
  const [showQuizView, setShowQuizView] = useState(false)
  const [currentFormData, setCurrentFormData] = useState<QuestionFormData | null>(null)

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
      setCurrentFormData(data)
      setQuestionsGenerated(true)
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

  const handleGoToQuiz = () => {
    setShowQuizView(true)
  }

  const handleBackFromQuiz = () => {
    setShowQuizView(false)
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
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Subir PDF</h2>

          {/* File Upload Input */}
          <div className="mb-4">
            <label
              htmlFor="pdf-upload"
              className="block w-full cursor-pointer"
            >
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
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
                <p className="mt-3 text-base text-gray-600">
                  <span className="font-bold text-blue-600">Haz clic para seleccionar</span> o arrastra un archivo
                </p>
                <p className="text-sm text-gray-500 mt-2">PDF (máx. 10MB)</p>
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
            <div className="mb-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <svg
                      className="h-10 w-10 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-800 truncate max-w-[300px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemove}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-100 p-2 rounded-lg transition-all duration-200"
                  aria-label="Remover archivo"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
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
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-md ${
              !selectedFile || isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-[1.02]'
            }`}
          >
            {isProcessing ? 'Procesando...' : 'Procesar contenido'}
          </button>
        </div>

        {/* Quiz View */}
        {showQuizView && generatedQuestions && currentFormData && (
          <QuizView
            questions={generatedQuestions}
            formData={currentFormData}
            onBack={handleBackFromQuiz}
          />
        )}

        {/* Chunks Display and Form */}
        {!showQuizView && showForm && chunks.length > 0 && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Fragmentos del PDF ({chunks.length})
              </h2>
              <p className="text-sm text-gray-600 mb-6">
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
              onGoToQuiz={handleGoToQuiz}
              questionsGenerated={questionsGenerated}
            />
          </>
        )}
      </div>
    </>
  )
}

export default PDFUpload
