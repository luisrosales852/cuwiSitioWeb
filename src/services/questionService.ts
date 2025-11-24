import type { Chunk, QuestionFormData, GeneratedQuestionsResponse } from '../types'

/**
 * Mock function to simulate question generation from chunks
 * Simulates API call with 2.5s delay
 * Now respects formData parameters: number_of_questions and question_type
 */
export async function generateQuestionsMock(
  _chunks: Chunk[],
  formData: QuestionFormData
): Promise<GeneratedQuestionsResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2500))

  // Pool of all available mock questions
  const allQuestions = [
    // Multiple choice questions
    {
      question: '¿Cuál es el planeta más grande del sistema solar?',
      options: [
        {
          id: 1,
          description: 'Tierra',
          explanation: 'La Tierra es el tercer planeta, no el más grande'
        },
        {
          id: 2,
          description: 'Júpiter',
          explanation: 'Correcto, Júpiter es el planeta más grande del sistema solar'
        },
        {
          id: 3,
          description: 'Saturno',
          explanation: 'Saturno es grande pero es el segundo más grande'
        },
        {
          id: 4,
          description: 'Marte',
          explanation: 'Marte es uno de los planetas más pequeños'
        }
      ],
      answer: 2,
      configuration: {
        open: false,
        numerical: false,
        case_sensitive: false
      },
      type: 'Multiple choice'
    },
    {
      question: '¿En qué año se promulgó la Constitución Mexicana actual?',
      options: [
        {
          id: 1,
          description: '1810',
          explanation: 'Este fue el año del inicio de la Independencia'
        },
        {
          id: 2,
          description: '1857',
          explanation: 'Esta fue una constitución anterior'
        },
        {
          id: 3,
          description: '1917',
          explanation: 'Correcto, la Constitución vigente fue promulgada en 1917'
        },
        {
          id: 4,
          description: '1910',
          explanation: 'Este fue el año del inicio de la Revolución Mexicana'
        }
      ],
      answer: 3,
      configuration: {
        open: false,
        numerical: false,
        case_sensitive: false
      },
      type: 'Multiple choice'
    },
    {
      question: '¿Cuál de los siguientes estados de la materia tiene volumen definido pero forma variable?',
      options: [
        {
          id: 1,
          description: 'Sólido',
          explanation: 'Los sólidos tienen forma y volumen definidos'
        },
        {
          id: 2,
          description: 'Líquido',
          explanation: 'Correcto, los líquidos tienen volumen definido pero adoptan la forma del recipiente'
        },
        {
          id: 3,
          description: 'Gas',
          explanation: 'Los gases no tienen ni forma ni volumen definidos'
        },
        {
          id: 4,
          description: 'Plasma',
          explanation: 'El plasma no tiene forma ni volumen definidos'
        }
      ],
      answer: 2,
      configuration: {
        open: false,
        numerical: false,
        case_sensitive: false
      },
      type: 'Multiple choice'
    },
    {
      question: '¿La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar en energía química?',
      options: [
        {
          id: 1,
          description: 'Verdadero',
          explanation: 'Correcto, la fotosíntesis es el proceso por el cual las plantas usan luz solar, agua y CO₂ para producir glucosa y oxígeno'
        },
        {
          id: 2,
          description: 'Falso',
          explanation: 'Incorrecto, la fotosíntesis sí es el proceso de conversión de luz solar en energía química'
        }
      ],
      answer: 1,
      configuration: {
        open: false,
        numerical: false,
        true_false: true,
        case_sensitive: false
      },
      type: 'Multiple choice'
    },
    {
      question: '¿Cuántos planetas tiene el sistema solar?',
      options: [
        {
          id: 1,
          description: '7',
          explanation: 'Incorrecto, hay más planetas'
        },
        {
          id: 2,
          description: '8',
          explanation: 'Correcto, el sistema solar tiene 8 planetas'
        },
        {
          id: 3,
          description: '9',
          explanation: 'Plutón ya no es considerado un planeta'
        },
        {
          id: 4,
          description: '10',
          explanation: 'Hay menos planetas'
        }
      ],
      answer: 2,
      configuration: {
        open: false,
        numerical: false,
        case_sensitive: false
      },
      type: 'Multiple choice'
    },
    // Open text questions
    {
      question: 'Explica el proceso de fotosíntesis y su importancia para los seres vivos',
      options: [],
      answer: 0,
      configuration: {
        open: true,
        numerical: false,
        case_sensitive: false
      },
      type: 'Open text'
    },
    {
      question: 'Describe las características principales de los tres estados de la materia',
      options: [],
      answer: 0,
      configuration: {
        open: true,
        numerical: false,
        case_sensitive: false
      },
      type: 'Open text'
    },
    {
      question: '¿Por qué es importante la Constitución de 1917 en la historia de México?',
      options: [],
      answer: 0,
      configuration: {
        open: true,
        numerical: false,
        case_sensitive: false
      },
      type: 'Open text'
    },
    {
      question: 'Explica qué es el sistema solar y nombra sus componentes principales',
      options: [],
      answer: 0,
      configuration: {
        open: true,
        numerical: false,
        case_sensitive: false
      },
      type: 'Open text'
    },
    {
      question: '¿A qué temperatura (en °C) hierve el agua a nivel del mar?',
      options: [],
      answer: 100,
      configuration: {
        open: false,
        numerical: true,
        error_range: 2,
        case_sensitive: false
      },
      type: 'Open text'
    }
  ]

  // Filter questions based on selected question types
  let filteredQuestions = allQuestions.filter(q =>
    formData.question_type.includes(q.type)
  )

  // If no questions match the filter, return all questions (fallback)
  //if (filteredQuestions.length === 0) {
    //filteredQuestions = allQuestions
  //}

  // Limit to the requested number of questions
  const selectedQuestions = filteredQuestions.slice(0, formData.number_of_questions)

  // Remove the 'type' property before returning (not part of Question interface)
  const questions = selectedQuestions.map(({ type: _, ...question }) => question)

  return {
    questions
  }
}
