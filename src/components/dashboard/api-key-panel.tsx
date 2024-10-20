import { useState, useEffect } from 'react';
import { Copy, Key, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { supabase } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ApiKeysSection() {
    const { organizationId } = useOrganization();
    const [apiKey, setApiKey] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchApiKey = async () => {
            if (organizationId) {
                const { data, error } = await supabase.rpc('fetch_api_keys', {
                    p_organization_id: organizationId,
                });

                if (error) {
                    console.error('Error fetching API key:', error);
                } else if (data && data.length > 0) {
                    setApiKey(data[0].api_key);
                }
            }
        };

        fetchApiKey();
    }, [organizationId]);

    const copyApiKey = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <a href="/portal/settings/developers/api-keys" className="block group">
            <div className="w-64 p-1">
                <Card className={`h-full border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200 ${copied ? 'bg-pink-100 dark:bg-pink-900' : ''}`}>
                    <CardContent className="pt-6 h-full flex flex-col relative">
                        <div className={`absolute inset-0 transition-colors duration-200 ${copied ? 'bg-pink-100 dark:bg-pink-900' : 'group-hover:bg-gray-100 dark:group-hover:bg-gray-800'}`} />
                        <div className="relative z-10">
                            <Key className="h-10 w-10 text-pink-600 dark:text-pink-400 mb-4" />
                            <h3 className="font-semibold mb-2">API Key</h3>
                            <div className="relative mb-4">
                                <Input
                                    type="text"
                                    value={apiKey ? `${apiKey.slice(0, 8)}...` : 'Key not available'}
                                    readOnly
                                    className="pr-10 font-mono text-xs"
                                    onClick={copyApiKey}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
                                    onClick={copyApiKey}
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </a>
    );
}
