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
