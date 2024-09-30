import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'

export default function AppShell() {
  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <Sidebar />
      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 md:ml-64 h-full`}
      >
        <Outlet />
      </main>
    </div>
  )
}