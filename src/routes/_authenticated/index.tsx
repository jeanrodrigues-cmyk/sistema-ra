import { createFileRoute } from '@tanstack/react-router'
import { RaDashboard } from '@/features/ra/dashboard'

export const Route = createFileRoute('/_authenticated/')({
  component: RaDashboard,
})
