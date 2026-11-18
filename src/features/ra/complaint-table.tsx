import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  type Complaint,
  type Stage,
  displayDate,
  isOverdue,
  stageLabels,
  stages,
  useComplaints,
} from './complaints'

const stageColors: Record<Stage, string> = {
  received: 'bg-muted text-muted-foreground',
  contact: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200',
  'awaiting-ies':
    'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  closed: 'bg-secondary text-secondary-foreground',
}

function ComplaintDetail({ complaint }: { complaint: Complaint }) {
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState(complaint.stage)
  const updateStage = useComplaints((state) => state.updateStage)
  const fields = [
    ['Instituição', complaint.institution],
    ['Responsável', complaint.owner],
    ['Abertura', displayDate(complaint.openedAt)],
    ['Prazo', displayDate(complaint.dueAt)],
  ]

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setStage(complaint.stage)
        setOpen(nextOpen)
      }}
    >
      <SheetTrigger asChild>
        <button className='inline-flex items-center gap-2 text-start font-semibold hover:text-primary hover:underline'>
          {complaint.title}
          <ArrowUpRight
            aria-hidden='true'
            className='size-3 shrink-0 text-muted-foreground'
          />
        </button>
      </SheetTrigger>
      <SheetContent className='w-full overflow-y-auto sm:max-w-md'>
        <SheetHeader>
          <SheetDescription>{complaint.id} · Dados fictícios</SheetDescription>
          <SheetTitle>{complaint.title}</SheetTitle>
        </SheetHeader>
        <dl className='grid grid-cols-2 gap-4 px-4'>
          {fields.map(([label, value]) => (
            <div key={label} className='rounded-lg border bg-card p-3'>
              <dt className='text-sm text-muted-foreground'>{label}</dt>
              <dd className='font-semibold'>{value}</dd>
            </div>
          ))}
        </dl>
        <form
          className='grid gap-3 px-4'
          onSubmit={(event) => {
            event.preventDefault()
            updateStage(complaint.id, stage)
            setOpen(false)
          }}
        >
          <label className='text-sm font-medium' htmlFor='complaint-stage'>
            Etapa do atendimento
          </label>
          <Select
            value={stage}
            onValueChange={(value: Stage) => setStage(value)}
          >
            <SelectTrigger id='complaint-stage' className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stages.map((item) => (
                <SelectItem key={item} value={item}>
                  {stageLabels[item]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type='submit' disabled={stage === complaint.stage}>
            Salvar etapa
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export function ComplaintTable({ complaints }: { complaints: Complaint[] }) {
  if (!complaints.length) {
    return (
      <p className='px-5 py-12 text-center text-sm text-muted-foreground'>
        Nenhuma reclamação para os filtros selecionados.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className='bg-muted/60'>
          <TableHead className='ps-5'>Reclamação</TableHead>
          <TableHead>Instituição</TableHead>
          <TableHead>Etapa</TableHead>
          <TableHead>Responsável</TableHead>
          <TableHead className='pe-5'>Prazo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {complaints.map((complaint) => (
          <TableRow key={complaint.id}>
            <TableCell className='py-3 ps-5'>
              <ComplaintDetail complaint={complaint} />
              <span className='block text-xs text-muted-foreground'>
                {complaint.id}
              </span>
            </TableCell>
            <TableCell>{complaint.institution}</TableCell>
            <TableCell>
              <Badge variant='outline' className={stageColors[complaint.stage]}>
                {stageLabels[complaint.stage]}
              </Badge>
            </TableCell>
            <TableCell>{complaint.owner}</TableCell>
            <TableCell className='pe-5'>
              {isOverdue(complaint) ? (
                <Badge variant='destructive'>
                  {displayDate(complaint.dueAt)} · Em atraso
                </Badge>
              ) : (
                displayDate(complaint.dueAt)
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
