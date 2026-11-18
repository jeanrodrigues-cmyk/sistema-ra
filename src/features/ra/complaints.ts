import { create } from 'zustand'

export const stages = ['received', 'contact', 'awaiting-ies', 'closed'] as const
export type Stage = (typeof stages)[number]
export type QueueFilter = Stage | 'open' | 'overdue'

export const stageLabels: Record<Stage, string> = {
  received: 'Recebida',
  contact: 'Em contato',
  'awaiting-ies': 'Aguardando IES',
  closed: 'Finalizada',
}

export type Complaint = {
  id: string
  title: string
  institution: string
  owner: string
  stage: Stage
  openedAt: string
  dueAt: string
}

export const demoDate = '2026-11-18'

const demoComplaints: Complaint[] = [
  {
    id: 'RA-1048',
    title: 'Bolsa não aplicada',
    institution: 'Horizonte',
    owner: 'Larissa',
    stage: 'awaiting-ies',
    openedAt: '2026-11-16',
    dueAt: '2026-11-17',
  },
  {
    id: 'RA-1047',
    title: 'Atraso no reembolso',
    institution: 'Nova Jornada',
    owner: 'Julio',
    stage: 'contact',
    openedAt: '2026-11-17',
    dueAt: '2026-11-18',
  },
  {
    id: 'RA-1046',
    title: 'Dúvida sobre matrícula',
    institution: 'Vale Norte',
    owner: 'Larissa',
    stage: 'received',
    openedAt: '2026-11-18',
    dueAt: '2026-11-19',
  },
  {
    id: 'RA-1045',
    title: 'Cobrança após cancelamento',
    institution: 'Horizonte',
    owner: 'Julio',
    stage: 'contact',
    openedAt: '2026-11-15',
    dueAt: '2026-11-17',
  },
  {
    id: 'RA-1044',
    title: 'Divergência de mensalidade',
    institution: 'Nova Jornada',
    owner: 'Larissa',
    stage: 'awaiting-ies',
    openedAt: '2026-11-16',
    dueAt: '2026-11-19',
  },
  {
    id: 'RA-1043',
    title: 'Validação da matrícula',
    institution: 'Vale Norte',
    owner: 'Julio',
    stage: 'awaiting-ies',
    openedAt: '2026-11-15',
    dueAt: '2026-11-20',
  },
  {
    id: 'RA-1042',
    title: 'Cancelamento da bolsa',
    institution: 'Horizonte',
    owner: 'Larissa',
    stage: 'received',
    openedAt: '2026-11-18',
    dueAt: '2026-11-20',
  },
  {
    id: 'RA-1041',
    title: 'Oferta indisponível no campus',
    institution: 'Vale Norte',
    owner: 'Julio',
    stage: 'closed',
    openedAt: '2026-11-14',
    dueAt: '2026-11-16',
  },
  {
    id: 'RA-1040',
    title: 'Ajuste de valor da bolsa',
    institution: 'Nova Jornada',
    owner: 'Larissa',
    stage: 'closed',
    openedAt: '2026-11-13',
    dueAt: '2026-11-16',
  },
  {
    id: 'RA-1039',
    title: 'Dúvida sobre documentos',
    institution: 'Horizonte',
    owner: 'Julio',
    stage: 'closed',
    openedAt: '2026-11-12',
    dueAt: '2026-11-16',
  },
]

export const useComplaints = create<{
  complaints: Complaint[]
  updateStage: (id: string, stage: Stage) => void
}>((set) => ({
  complaints: demoComplaints,
  updateStage: (id, stage) =>
    set(({ complaints }) => ({
      complaints: complaints.map((complaint) =>
        complaint.id === id ? { ...complaint, stage } : complaint
      ),
    })),
}))

export function isOverdue(complaint: Complaint) {
  return complaint.stage !== 'closed' && complaint.dueAt < demoDate
}

export function matchesFilter(complaint: Complaint, filter?: QueueFilter) {
  if (filter === 'open') return complaint.stage !== 'closed'
  if (filter === 'overdue') return isOverdue(complaint)
  return !filter || complaint.stage === filter
}

export function displayDate(date: string) {
  const [, month, day] = date.split('-')
  return `${day}/${month}`
}
