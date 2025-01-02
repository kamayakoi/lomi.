import { useState, useEffect } from 'react';
import { Key, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { supabase } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ApiKeysSection() {
    const { organizationId } = useOrganization();
    const [apiKey, setApiKey] = useState('');

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

    return (
        <div className="w-full h-full mt-1">
            <Card className="rounded-none h-full border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                <CardContent className="pt-6 h-full flex flex-col relative">
                    <div className="absolute inset-0 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800" />
                    <div className="relative z-10">
                        <Key className="h-10 w-10 text-pink-600 dark:text-pink-400 mb-4" />
                        <h3 className="font-semibold mb-2">API Key</h3>
                        <div className="relative mb-4">
                            <Input
                                type="text"
                                value={apiKey ? `${apiKey.slice(0, 8)}...` : 'Key not available'}
                                readOnly
                                className="rounded-none pr-10 font-mono text-xs"
                            />
                            <a href="/portal/settings/developers/api-keys">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-none absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                    <span className="sr-only">Generate New Key</span>
                                </Button>
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
