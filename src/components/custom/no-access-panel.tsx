import { UserNav } from '@/components/dashboard/no-access-user-nav';

export default function Component() {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-4xl overflow-hidden rounded-3xl shadow-xl relative">
                {/* Add UserNav and Notifications */}
                <div className="absolute top-4 right-4 flex items-center space-x-4 z-10">
                    <UserNav />
                </div>
                <div
                    className="relative h-64 sm:h-80"
                    style={{
                        background: `
              linear-gradient(135deg, 
                rgba(100, 143, 255, 1) 0%,
                rgba(50, 176, 255, 1) 25%,
                rgba(120, 199, 255, 1) 50%,
                rgba(255, 99, 71, 1) 75%,
                rgba(255, 69, 0, 1) 100%)
            `,
                        backgroundSize: '400% 400%',
                        animation: 'gradient 15s ease infinite'
                    }}
                >
                    <style>{`
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">No Access</h1>
                        <p className="text-white text-sm sm:text-base max-w-md">
                            Your organization has not been given access yet.<br />
                            <span className="whitespace-nowrap">
                                To gain access, you can{' '}
                                <a
                                    href="mailto:hello@lomi.africa?subject=[Activation]%20—%20Contact%20sales"
                                    className="text-primary text-white hover:underline"
                                >
                                    email us
                                </a>{' '}
                                or go through the Activation process.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}