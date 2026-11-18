import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Building2,
  CircleAlert,
  Headphones,
  Inbox,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ComplaintTable } from './complaint-table'
import {
  type QueueFilter,
  displayDate,
  isOverdue,
  matchesFilter,
  useComplaints,
} from './complaints'

const metrics = [
  { label: 'Em aberto', key: 'open', icon: Inbox },
  { label: 'Em contato', key: 'contact', icon: Headphones },
  { label: 'Aguardando IES', key: 'awaiting-ies', icon: Building2 },
  { label: 'Fora do prazo', key: 'overdue', icon: CircleAlert },
] satisfies { label: string; key: QueueFilter; icon: typeof Inbox }[]

const chartDates = [
  '2026-11-12',
  '2026-11-13',
  '2026-11-14',
  '2026-11-15',
  '2026-11-16',
  '2026-11-17',
  '2026-11-18',
]

export function RaDashboard() {
  const complaints = useComplaints((state) => state.complaints)
  const chart = chartDates.map((date) => ({
    date: displayDate(date),
    count: complaints.filter((item) => item.openedAt === date).length,
  }))
  const priorities = complaints
    .filter(isOverdue)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))

  return (
    <>
      <Header className='border-b bg-card'>
        <span className='text-sm font-medium'>Visão geral</span>
        <span className='ms-auto text-xs text-muted-foreground'>
          Dados fictícios
        </span>
      </Header>
      <Main className='w-full max-w-7xl space-y-5 px-4 md:px-7'>
        <section className='flex flex-wrap items-end justify-between gap-5 rounded-2xl bg-[#084431] p-5 text-white sm:p-7'>
          <div>
            <p className='mb-2 text-sm font-semibold text-[#c9ed93]'>
              Central de operações · Quero Bolsa
            </p>
            <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Painel Reclame AQUI
            </h1>
            <p className='mt-2 text-sm text-white/85'>
              Acompanhe reclamações, prazos e retornos das instituições.
            </p>
          </div>
          <Button
            asChild
            className='bg-[#c9ed93] text-[#123b29] hover:bg-[#dcf6b1]'
          >
            <Link to='/reclamacoes'>
              Abrir fila <ArrowRight />
            </Link>
          </Button>
        </section>
        <section
          aria-label='Indicadores da operação'
          className='grid grid-cols-2 gap-3 xl:grid-cols-4'
        >
          {metrics.map(({ label, key, icon: Icon }) => (
            <Link
              key={key}
              to='/reclamacoes'
              search={{ etapa: key }}
              className='group rounded-xl border bg-card p-4 shadow-xs hover:border-primary/50 hover:bg-accent/50'
            >
              <div className='flex items-start justify-between gap-2'>
                <span className='text-sm font-medium text-muted-foreground'>
                  {label}
                </span>
                <Icon
                  aria-hidden='true'
                  className={
                    key === 'overdue'
                      ? 'size-4 text-destructive'
                      : 'size-4 text-primary'
                  }
                />
              </div>
              <strong className='mt-3 block text-3xl tracking-tight tabular-nums'>
                {complaints.filter((item) => matchesFilter(item, key)).length}
              </strong>
            </Link>
          ))}
        </section>
        <div className='grid min-w-0 gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'>
          <Card className='min-w-0 gap-4'>
            <CardHeader className='flex flex-wrap items-center justify-between gap-2'>
              <div>
                <CardTitle>Prioridades da fila</CardTitle>
                <CardDescription>Reclamações com prazo vencido</CardDescription>
              </div>
              <Button variant='outline' size='sm' asChild>
                <Link to='/reclamacoes' search={{ etapa: 'overdue' }}>
                  Ver atrasos <ArrowRight />
                </Link>
              </Button>
            </CardHeader>
            <ComplaintTable complaints={priorities.slice(0, 5)} />
          </Card>
          <Card className='min-w-0 gap-4'>
            <CardHeader>
              <CardTitle>Reclamações recebidas</CardTitle>
              <CardDescription>12 a 18 de novembro de 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className='h-48 min-w-0'
                role='img'
                aria-label={chart
                  .map(({ date, count }) => `${date}: ${count}`)
                  .join(', ')}
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={chart} margin={{ left: -20, right: 2 }}>
                    <CartesianGrid vertical={false} stroke='var(--border)' />
                    <XAxis
                      dataKey='date'
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      stroke='var(--muted-foreground)'
                    />
                    <YAxis
                      allowDecimals={false}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      stroke='var(--muted-foreground)'
                    />
                    <Tooltip
                      cursor={{ fill: 'var(--muted)' }}
                      contentStyle={{
                        background: 'var(--card)',
                        borderColor: 'var(--border)',
                      }}
                    />
                    <Bar
                      name='Recebidas'
                      dataKey='count'
                      fill='var(--chart-1)'
                      radius={[5, 5, 0, 0]}
                      maxBarSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
