import { useState } from "react";

export default function Component() {
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl shadow-xl">
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
                            Your organization have not been given access yet.<br />
                            Please reach out to hello@lomi.africa or <a href="#" onClick={(e) => { e.preventDefault(); setIsFormOpen(true); }} className="underline hover:text-sky-200 transition-colors">submit this form</a>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Airtable form modal */}
            {isFormOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                    onClick={() => setIsFormOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-3 w-full max-w-3xl mx-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <iframe
                            className="airtable-embed"
                            src="https://airtable.com/embed/appFQadFIGVMYNnHq/pagphA6Lt1pPzWMhX/form"
                            frameBorder="0"
                            width="100%"
                            height="800"
                            style={{ background: 'transparent', border: '1px solid #ccc' }}
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    )
}