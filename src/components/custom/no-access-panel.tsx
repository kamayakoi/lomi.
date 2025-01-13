import { UserNav } from '@/components/portal/no-access-user-nav';

export default function Component() {
    return (
        <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
            <div className="w-full max-w-4xl overflow-hidden rounded-3xl shadow-xl relative">
                {/* Add UserNav and Notifications */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center space-x-4 z-10">
                    <UserNav />
                </div>
                <div
                    className="relative h-72 sm:h-80"
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
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-10">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">No Access</h1>
                        <p className="text-white text-sm sm:text-base max-w-md break-words">
                            Your organization has not been given access yet.
                        </p>
                        <p className="text-white text-sm sm:text-base max-w-md mt-2">
                            <span className="sm:whitespace-nowrap break-words sm:break-normal">
                                To gain access, you can{' '}
                                <a
                                    href="mailto:hello@lomi.africa?subject=[Activation]%20—%20Contact%20sales"
                                    className="text-primary text-white hover:underline inline-block"
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