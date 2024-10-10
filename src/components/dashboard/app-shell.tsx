import React from 'react';
import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'

export default function AppShell() {
  const MemoizedSidebar = React.memo(Sidebar);

  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <MemoizedSidebar />
      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 md:ml-64 h-full`}
      >
        <React.Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </React.Suspense>
      </main>
    </div>
  )
}