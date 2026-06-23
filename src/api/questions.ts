import { questionState } from '@/stores/questions'

export function getQuestions() {
  return questionState.value
}
