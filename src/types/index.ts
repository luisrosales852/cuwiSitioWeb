export interface Chunk {
  id: string
  type: string
  text: string
}

export interface QuestionFormData {
  educational_level: string
  context: string
  number_of_questions: number
  bloom: string
  dok: number
  question_type: string[]
  selectedChunks: string[]
}

export interface QuestionOption {
  id: number
  description: string
  explanation?: string
}

export interface QuestionConfiguration {
  open: boolean
  numerical: boolean
  true_false?: boolean
  error_range?: number
  case_sensitive: boolean
}

export interface Question {
  question: string
  options: QuestionOption[]
  answer: number
  configuration: QuestionConfiguration
}

export interface GeneratedQuestionsResponse {
  questions: Question[]
}
