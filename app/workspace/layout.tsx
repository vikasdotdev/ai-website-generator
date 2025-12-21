import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/AppSidebar';
import AppHeader from './_components/AppHeader';
import { Toaster } from 'sonner';

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className='w-full'>
        <AppSidebar />
        <AppHeader />
        {children}
        <Toaster/>
      </div>
    </SidebarProvider>
  )
}

export default WorkspaceLayout