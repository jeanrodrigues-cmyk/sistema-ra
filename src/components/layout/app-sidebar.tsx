import { Link } from '@tanstack/react-router'
import { LayoutDashboard, ListTodo, MessageSquare } from 'lucide-react'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavGroup } from './nav-group'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { setOpenMobile } = useSidebar()
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader className='px-2 pt-4'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size='lg' tooltip='Sistema RA'>
              <Link to='/' onClick={() => setOpenMobile(false)}>
                <div className='grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <MessageSquare className='size-4' aria-hidden='true' />
                </div>
                <div className='grid text-start leading-tight'>
                  <span className='truncate font-bold'>Sistema RA</span>
                  <span className='truncate text-xs'>Quero Bolsa</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup
          title='Operação'
          items={[
            { title: 'Visão geral', url: '/', icon: LayoutDashboard },
            { title: 'Reclamações', url: '/reclamacoes', icon: ListTodo },
          ]}
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
