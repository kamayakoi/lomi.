import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, ImagePlus, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@/lib/hooks/useUser'

const categories = [
    { value: 'account', label: 'Account Issues' },
    { value: 'billing', label: 'Billing Questions' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'other', label: 'Other' },
]

interface SelectOption {
    value: string
    label: string
}

interface CustomSelectProps {
    value: string
    onChange: (value: string) => void
    options: SelectOption[]
}

const CustomSelect = ({ value, onChange, options }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div ref={selectRef} className="relative">
            <div
                className="bg-white dark:bg-[#121317] text-gray-900 dark:text-gray-100 p-2 rounded-md cursor-pointer border border-gray-300 dark:border-gray-700 text-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                {value ? options.find((opt: SelectOption) => opt.value === value)?.label : 'Select a category'}
            </div>
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-[#121317] border border-gray-300 dark:border-gray-700 rounded-md mt-1 z-10 text-sm">
                    {options.map((option: SelectOption) => (
                        <div
                            key={option.value}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            onClick={() => {
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function SupportForm() {
    const [isOpen, setIsOpen] = useState(false)
    const [category, setCategory] = useState('')
    const [message, setMessage] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const formRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { user } = useUser()

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleSubmit = async () => {
        if (!user) {
            console.error('User not found');
            return;
        }

        let imageUrl: string | null = null;

        if (image) {
            // Sanitize the filename
            const sanitizedFileName = image.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${user.id}/${Date.now()}_${sanitizedFileName}`;

            const { error: uploadError } = await supabase.storage
                .from('support_request_images')
                .upload(fileName, image);

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                return;
            }

            const { data: urlData } = await supabase.storage
                .from('support_request_images')
                .getPublicUrl(fileName);

            imageUrl = urlData.publicUrl;
        }

        const { data: supportRequestData, error: supportRequestError } = await supabase.rpc('create_support_request', {
            p_merchant_id: user.id,
            p_category: category,
            p_message: message,
            p_image_url: imageUrl,
        });

        if (supportRequestError) {
            console.error('Error submitting support request:', supportRequestError);
        } else {
            console.log('Support request submitted:', supportRequestData);
            setIsSubmitted(true);
            setTimeout(() => {
                setCategory('');
                setMessage('');
                setImage(null);
                setIsSubmitted(false);
                setIsOpen(false);
            }, 3000);
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            setImage(file)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            setImage(file)
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50" ref={formRef}>
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Button
                    variant="default"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-full h-10 w-10 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                >
                    <MessageCircle className="h-4 w-4" />
                </Button>
            </motion.div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.5 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                        className="absolute bottom-12 right-0 w-80 bg-white dark:bg-[#121317] rounded-md shadow-lg overflow-hidden"
                        style={{ zIndex: 9999 }}
                    >
                        <div className="p-4 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Support</h3>
                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center space-y-2 py-4"
                                >
                                    <CheckCircle className="h-12 w-12 text-green-500" />
                                    <p className="text-center text-sm font-medium text-green-600">
                                        Thank you for your message!
                                    </p>
                                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                                        A member of our team will reach out to you soon.
                                    </p>
                                </motion.div>
                            ) : (
                                <>
                                    <CustomSelect
                                        value={category}
                                        onChange={setCategory}
                                        options={categories}
                                    />
                                    <div className="relative">
                                        <Textarea
                                            placeholder="How can we help you?"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onDrop={handleDrop}
                                            onDragOver={(e) => e.preventDefault()}
                                            className="min-h-[100px] max-h-[200px] text-sm placeholder:text-sm pr-8 bg-white dark:bg-[#121317] text-gray-900 dark:text-gray-100 resize-y"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute bottom-2 right-2"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <ImagePlus className="h-4 w-4" />
                                        </Button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                    {image && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Image attached: {image.name}
                                        </div>
                                    )}
                                    <Button onClick={handleSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
                                        Submit
                                    </Button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
