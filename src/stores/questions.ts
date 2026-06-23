import { ref } from 'vue'

import { questions as questionSeed } from '@/data/mockData'

import { readStorage, writeStorage } from './persistence'

const QUESTION_STORAGE_KEY = 'threeapp-questions'

export const questionState = ref(readStorage(QUESTION_STORAGE_KEY, questionSeed))

function persistQuestions() {
  writeStorage(QUESTION_STORAGE_KEY, questionState.value)
}

export function getStoredQuestionById(id: string) {
  return questionState.value.find((question) => question.id === id)
}

export function replyToStoredQuestion(id: string, reply: string) {
  questionState.value = questionState.value.map((question) => {
    if (question.id !== id) return question
    return {
      ...question,
      reply,
      status: 'replied',
    }
  })
  persistQuestions()
}

export function getPendingQuestionCount() {
  return questionState.value.filter((question) => question.status === 'pending').length
}
