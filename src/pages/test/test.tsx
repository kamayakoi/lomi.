import { Outlet } from 'react-router-dom'

export default function Test() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Test Pages</h1>
            <div className="space-y-6">
                <Outlet />
            </div>
        </div>
    )
}
