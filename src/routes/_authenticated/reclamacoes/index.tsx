import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { stages } from '@/features/ra/complaints'
import { ComplaintQueue } from '@/features/ra/queue'

export const Route = createFileRoute('/_authenticated/reclamacoes/')({
  validateSearch: z.object({
    page: z.number().int().positive().optional().catch(undefined),
    pageSize: z
      .number()
      .refine((size) => [10, 20, 30, 40, 50].includes(size))
      .optional()
      .catch(undefined),
    filter: z.string().optional().catch(undefined),
    etapa: z
      .enum([...stages, 'open', 'overdue'])
      .optional()
      .catch(undefined),
  }),
  component: ComplaintQueue,
})
