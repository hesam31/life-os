'use client'
import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getQueryClient } from '@/lib/query-client'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { ToastContainer } from '@/components/feedback/ToastContainer'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-6">
              <div className="max-w-6xl mx-auto">{children}</div>
            </main>
          </div>
        </div>
        <ToastContainer />
        <ConfirmDialog />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
