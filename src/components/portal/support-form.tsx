import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, ImagePlus, CheckCircle, FileIcon, X } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import { useTranslation } from 'react-i18next'

const categories = [
    { value: 'account', label: 'portal.support_form.category.account' },
    { value: 'billing', label: 'portal.support_form.category.billing' },
    { value: 'technical', label: 'portal.support_form.category.technical' },
    { value: 'other', label: 'portal.support_form.category.other' },
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
    const { t } = useTranslation()

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
                className="bg-white dark:bg-[#121317] text-gray-900 dark:text-gray-100 p-2 cursor-pointer border border-gray-300 dark:border-gray-700 text-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                {value ? t(options.find((opt: SelectOption) => opt.value === value)?.label || '') : t('portal.support_form.category.label')}
            </div>
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-[#121317] border border-gray-300 dark:border-gray-700 mt-1 z-10 text-sm">
                    {options.map((option: SelectOption) => (
                        <div
                            key={option.value}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            onClick={() => {
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                        >
                            {t(option.label)}
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
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const formRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { user } = useUser()
    const { t } = useTranslation()

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
            setIsUploading(true)
            setUploadProgress(0)

            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        setIsUploading(false)
                        return 100
                    }
                    return Math.min(prev + 10, 100)
                })
            }, 200)
        }
    }

    return (
        <div className="fixed bottom-4 right-[calc(1rem+18px)] z-50" ref={formRef}>
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Button
                    variant="default"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-[40px] w-[40px] rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                >
                    <MessageCircle className="h-5 w-5" />
                </Button>
            </motion.div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 right-0 w-80 bg-white dark:bg-[#121317] rounded-none shadow-lg z-50"
                    >
                        <div className="p-4 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('portal.support_form.title')}</h3>
                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center space-y-2 py-4"
                                >
                                    <CheckCircle className="h-12 w-12 text-green-500" />
                                    <p className="text-center text-sm font-medium text-green-600">
                                        {t('portal.support_form.success.title')}
                                    </p>
                                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                                        {t('portal.support_form.success.description')}
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
                                            placeholder={t('portal.support_form.message.placeholder')}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onDrop={handleDrop}
                                            onDragOver={(e) => e.preventDefault()}
                                            className="min-h-[100px] max-h-[200px] text-sm placeholder:text-sm pr-8 bg-white dark:bg-[#121317] text-gray-900 dark:text-gray-100 resize-y rounded-none"
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
                                        <div className="border rounded-none p-2 relative">
                                            <div className="flex items-center space-x-2">
                                                <div className={`p-1.5 rounded-none ${image.type.includes('png') ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'}`}>
                                                    <FileIcon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium truncate">
                                                        {image.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(image.size / 1024).toFixed(0)} KB
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setImage(null)
                                                        setUploadProgress(0)
                                                        setIsUploading(false)
                                                    }}
                                                    className="text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                            {isUploading && (
                                                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 h-1">
                                                    <div
                                                        className="bg-blue-500 h-1 transition-all duration-300 ease-out"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <Button onClick={handleSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 rounded-none">
                                        {t('portal.support_form.submit')}
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
