import { useState, useEffect } from 'react';
import { Key, ArrowRight, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabase } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { motion } from "framer-motion";
import { useToast } from "@/lib/hooks/use-toast";

export default function ApiKeysSection() {
    const { organizationId } = useOrganization();
    const [apiKey, setApiKey] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchApiKey = async () => {
            if (organizationId) {
                const { data, error } = await supabase.rpc('fetch_api_keys', {
                    p_organization_id: organizationId,
                });

                if (error) {
                    console.error('Error fetching API key:', error);
                } else if (data && data.length > 0) {
                    setApiKey(data[0]?.api_key || '');
                }
            }
        };

        fetchApiKey();
    }, [organizationId]);

    const handleCopyApiKey = async () => {
        try {
            await navigator.clipboard.writeText(apiKey);
            setIsCopied(true);
            toast({
                variant: "api",
                description: "API key copied to clipboard",
                duration: 2000,
            });
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (error) {
            console.error('Failed to copy API key:', error);
            toast({
                variant: "destructive",
                description: "Failed to copy API key",
                duration: 2000,
            });
        }
    };

    return (
        <div className="w-56 p-1">
            <Card className="rounded-none h-full border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                <CardContent className="pt-6 pb-5">
                    <div className="relative z-10">
                        <Key className="h-8 w-8 text-pink-600 dark:text-pink-400 mb-3" />
                        <h3 className="font-medium text-sm mb-8">API Key</h3>
                        <div className="relative flex items-center min-h-[1.75rem]">
                            <div className="relative w-full group">
                                <div className="flex items-center w-full">
                                    <Input
                                        type="text"
                                        value={apiKey ? `${apiKey.slice(0, 6)}...` : 'No key'}
                                        readOnly
                                        className="rounded-none pr-16 font-mono text-xs h-7 bg-transparent border-gray-200 dark:border-gray-700 focus:ring-0 focus:ring-offset-0 group-hover:border-pink-200 dark:group-hover:border-pink-800 transition-colors flex items-center"
                                    />
                                </div>
                                <div className="absolute right-7 inset-y-0 flex items-center border-l border-r border-gray-200 dark:border-gray-700 group-hover:border-pink-200 dark:group-hover:border-pink-800 transition-colors">
                                    <button
                                        type="button"
                                        onClick={handleCopyApiKey}
                                        className="relative h-full w-7 flex items-center justify-center hover:text-pink-600 dark:hover:text-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!apiKey}
                                    >
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ opacity: 1, scale: 1 }}
                                            animate={{ opacity: isCopied ? 0 : 1, scale: isCopied ? 0 : 1 }}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </motion.div>
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center text-emerald-500 dark:text-emerald-400"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: isCopied ? 1 : 0, scale: isCopied ? 1 : 0 }}
                                        >
                                            <Check className="h-3 w-3" />
                                        </motion.div>
                                    </button>
                                </div>
                                <div className="absolute right-0 inset-y-0 flex items-center">
                                    <a
                                        href="/portal/settings/developers/api-keys"
                                        className="h-full w-7 flex items-center justify-center hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                                    >
                                        <ArrowRight className="h-3 w-3" />
                                        <span className="sr-only">Generate New Key</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
