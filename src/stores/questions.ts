import { ref } from 'vue'

import type { BusinessType } from '@/types/comment'
import { readStorage, writeStorage } from './persistence'
import { getPreviewQuestions, isPreviewSessionActive } from './preview'
import { getErrorMessage, requestData } from '@/utils/request'

export interface QuestionRecord {
  id: string
  businessType: BusinessType
  subject: string
  contactName: string
  contactPhone: string
  content: string
  status: 'pending' | 'replied'
  createdAt: string
  reply?: string
}

interface InquiryApiItem {
  id?: string
  title?: string
  content?: string
  contactName?: string
  contactPhone?: string
  statusKey?: 'pending' | 'processing' | 'replied' | 'closed'
  replyContent?: string
  createdAt?: string
  businessType?: BusinessType
}

const QUESTION_STORAGE_KEY = 'threeapp-questions'

export const questionState = ref<QuestionRecord[]>(readStorage<QuestionRecord[]>(QUESTION_STORAGE_KEY, []))
export const questionLoading = ref(false)
export const questionError = ref('')

function persistQuestions() {
  writeStorage(QUESTION_STORAGE_KEY, questionState.value)
}

function applyPreviewQuestions(message?: string) {
  questionState.value = getPreviewQuestions()
  persistQuestions()
  if (message) {
    questionError.value = message
  }
}

function toBusinessType(value: unknown): BusinessType {
  return value === 'specialty' || value === 'cold-storage' ? value : 'wine'
}

function toQuestionStatus(value: InquiryApiItem['statusKey']): QuestionRecord['status'] {
  return value === 'replied' ? 'replied' : 'pending'
}

function mapQuestion(item: InquiryApiItem): QuestionRecord {
  return {
    id: String(item.id ?? ''),
    businessType: toBusinessType(item.businessType),
    subject: item.title?.trim() || 'null',
    contactName: item.contactName?.trim() || 'null',
    contactPhone: item.contactPhone?.trim() || 'null',
    content: item.content?.trim() || 'null',
    status: toQuestionStatus(item.statusKey),
    createdAt: item.createdAt?.trim() || 'null',
    reply: item.replyContent?.trim() || '',
  }
}

export async function fetchQuestions() {
  questionLoading.value = true
  questionError.value = ''

  if (isPreviewSessionActive()) {
    applyPreviewQuestions()
    questionLoading.value = false
    return
  }

  try {
    const data = await requestData<{ items: InquiryApiItem[]; total: number }>('/api/admin/inquiries')
    questionState.value = Array.isArray(data.items) ? data.items.map(mapQuestion) : []
    persistQuestions()
  } catch (error) {
    const message = getErrorMessage(error, '问答数据读取失败，已展示本地预览内容。')
    if (questionState.value.length) {
      questionError.value = message
    } else {
      applyPreviewQuestions(message)
    }
  } finally {
    questionLoading.value = false
  }
}

export function getStoredQuestionById(id: string) {
  return questionState.value.find((question) => question.id === id)
}

export async function replyToStoredQuestion(id: string, reply: string) {
  if (isPreviewSessionActive()) {
    const nextQuestion = questionState.value.find((question) => question.id === id)
    if (!nextQuestion) {
      throw new Error('未找到当前问答。')
    }

    const updatedQuestion = {
      ...nextQuestion,
      reply,
      status: 'replied' as const,
    }
    questionState.value = questionState.value.map((question) => (question.id === id ? updatedQuestion : question))
    persistQuestions()
    return updatedQuestion
  }

  const data = await requestData<InquiryApiItem>(`/api/admin/inquiries/${id}/reply`, {
    method: 'PATCH',
    body: JSON.stringify({ replyContent: reply }),
  })

  const nextQuestion = mapQuestion(data)
  questionState.value = questionState.value.map((question) => (question.id === id ? nextQuestion : question))
  persistQuestions()
  return nextQuestion
}

export function getPendingQuestionCount() {
  return questionState.value.filter((question) => question.status === 'pending').length
}
