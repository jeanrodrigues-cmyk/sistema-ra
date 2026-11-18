import { useEffect } from 'react'
import { getRouteApi, Link } from '@tanstack/react-router'
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowLeft, Search } from 'lucide-react'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTablePagination } from '@/components/data-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ComplaintTable } from './complaint-table'
import {
  type Complaint,
  type QueueFilter,
  matchesFilter,
  stages,
  stageLabels,
  useComplaints,
} from './complaints'

const route = getRouteApi('/_authenticated/reclamacoes/')
const columns: ColumnDef<Complaint>[] = [{ accessorKey: 'title' }]

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR')
}

export function ComplaintQueue() {
  const complaints = useComplaints((state) => state.complaints)
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { etapa: filter } = search
  const {
    globalFilter,
    onGlobalFilterChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    globalFilter: { enabled: true, trim: false },
  })
  const data = complaints
    .filter((item) => matchesFilter(item, filter))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getRowId: (item) => item.id,
    state: { globalFilter, pagination },
    onGlobalFilterChange,
    onPaginationChange,
    globalFilterFn: ({ original }, _columnId, value) =>
      normalize(
        [
          original.id,
          original.title,
          original.institution,
          original.owner,
        ].join(' ')
      ).includes(normalize(String(value).trim())),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  })
  const total = table.getFilteredRowModel().rows.length
  const pageCount = table.getPageCount()
  useEffect(() => {
    ensurePageInRange(Math.max(1, pageCount))
  }, [ensurePageInRange, pageCount])

  return (
    <>
      <Header className='border-b bg-card'>
        <span className='text-sm font-medium'>Reclamações</span>
        <span className='ms-auto text-xs text-muted-foreground'>
          Dados fictícios
        </span>
      </Header>
      <Main className='w-full max-w-7xl space-y-5 px-4 md:px-7'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Fila de reclamações
            </h1>
            <p className='mt-2 text-sm text-muted-foreground'>
              Consulte os casos, acompanhe prazos e atualize a etapa do
              atendimento.
            </p>
          </div>
          <Button variant='outline' asChild>
            <Link to='/'>
              <ArrowLeft /> Visão geral
            </Link>
          </Button>
        </div>
        <Card className='min-w-0 gap-4 overflow-hidden'>
          <CardHeader className='space-y-3'>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <CardTitle>Casos</CardTitle>
              <span role='status' className='text-sm text-muted-foreground'>
                {total} {total === 1 ? 'reclamação' : 'reclamações'}
              </span>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <div className='relative w-full sm:max-w-xs'>
                <Search
                  aria-hidden='true'
                  className='absolute start-3 top-2.5 size-4 text-muted-foreground'
                />
                <Input
                  type='search'
                  className='ps-9'
                  placeholder='Buscar por ID, assunto ou IES'
                  aria-label='Buscar reclamação'
                  value={globalFilter ?? ''}
                  onChange={(event) =>
                    table.setGlobalFilter(event.target.value)
                  }
                />
              </div>
              <Select
                value={filter ?? 'all'}
                onValueChange={(value: QueueFilter | 'all') =>
                  navigate({
                    search: (previous) => ({
                      ...previous,
                      etapa: value === 'all' ? undefined : value,
                      page: undefined,
                    }),
                    replace: true,
                  })
                }
              >
                <SelectTrigger aria-label='Filtrar reclamações'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todos os casos</SelectItem>
                  <SelectItem value='open'>Em aberto</SelectItem>
                  <SelectItem value='overdue'>Fora do prazo</SelectItem>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stageLabels[stage]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <ComplaintTable
            complaints={table.getRowModel().rows.map((row) => row.original)}
          />
          {total > 0 && <DataTablePagination table={table} className='px-5' />}
        </Card>
      </Main>
    </>
  )
}
