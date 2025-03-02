import * as React from "react"
import { cn } from "@/lib/actions/utils"
import { useAIComplete } from "@/lib/hooks/use-ai-complete"
import { AlertCircle, Loader2, Sparkles } from "lucide-react"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "./input"

export interface AIInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    variant?: "default" | "filled";
    aiEnabled?: boolean;
    aiEndpoint?: string;
    aiPlaceholder?: string;
    onAiComplete?: (completion: string) => void;
    onAiError?: (error: string) => void;
    aiTrigger?: 'auto' | 'manual';
    maxSuggestions?: number;
    anthropicApiKey?: string;
    model?: 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240307';
    temperature?: number;
    maxTokens?: number;
    minInputLength?: number;
}

const AIInput = React.forwardRef<HTMLInputElement, AIInputProps>(
    ({
        className,
        error,
        variant = "default",
        aiEnabled = false,
        aiEndpoint = "https://mdswvokxrnfggrujsfjd.functions.supabase.co/ai-complete",
        aiPlaceholder = "Type to get AI suggestions...",
        onAiComplete,
        onAiError,
        aiTrigger = 'auto',
        maxSuggestions = 3,
        anthropicApiKey,
        model = 'claude-3-sonnet-20240229',
        temperature = 0.7,
        maxTokens = 150,
        minInputLength = 3,
        ...props
    }, ref) => {
        const [inputValue, setInputValue] = React.useState("");
        const debouncedValue = useDebounce(inputValue, 500);
        const [suggestions, setSuggestions] = React.useState<string[]>([]);
        const [lastRequestTime, setLastRequestTime] = React.useState(0);
        const inputRef = React.useRef<HTMLInputElement>(null);

        const {
            complete,
            isLoading,
            error: aiError
        } = useAIComplete({
            endpoint: aiEndpoint,
            anthropicApiKey,
            model,
            temperature,
            maxTokens,
        });

        // Handle AI suggestions based on input with rate limiting
        React.useEffect(() => {
            const now = Date.now();
            const timeSinceLastRequest = now - lastRequestTime;
            const minRequestInterval = 1000; // Minimum time between requests in ms

            if (
                aiEnabled &&
                aiTrigger === 'auto' &&
                debouncedValue.length >= minInputLength &&
                timeSinceLastRequest >= minRequestInterval
            ) {
                setLastRequestTime(now);
                complete(debouncedValue).then((response) => {
                    if (Array.isArray(response.suggestions)) {
                        setSuggestions(response.suggestions.slice(0, maxSuggestions));
                    }
                });
            }

            // Clear suggestions if input is too short
            if (debouncedValue.length < minInputLength) {
                setSuggestions([]);
            }
        }, [debouncedValue, aiEnabled, aiTrigger, complete, lastRequestTime, minInputLength, maxSuggestions]);

        // Handle AI errors
        React.useEffect(() => {
            if (aiError && onAiError) {
                onAiError(aiError);
            }
        }, [aiError, onAiError]);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setInputValue(value);
            props.onChange?.(e);
        };

        const applySuggestion = (suggestion: string) => {
            setInputValue(suggestion);
            setSuggestions([]);
            if (inputRef.current) {
                const event = new Event('input', { bubbles: true });
                Object.defineProperty(event, 'target', { value: inputRef.current });
                inputRef.current.value = suggestion;
                inputRef.current.dispatchEvent(event);
            }
            onAiComplete?.(suggestion);
        };

        return (
            <div className="relative group">
                <div className="relative">
                    <Input
                        ref={ref}
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={aiEnabled ? aiPlaceholder : props.placeholder}
                        error={error || !!aiError}
                        variant={variant}
                        className={cn(
                            // AI Enabled state
                            aiEnabled && "pr-10",
                            className
                        )}
                        {...props}
                    />

                    {/* AI Status Indicator */}
                    {aiEnabled && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground/70" />
                            ) : aiError ? (
                                <AlertCircle className="w-4 h-4 text-destructive/70" />
                            ) : (
                                <Sparkles className="w-4 h-4 text-primary/50" />
                            )}
                        </div>
                    )}
                </div>

                {/* AI Suggestions Dropdown */}
                <AnimatePresence>
                    {suggestions.length > 0 && !aiError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-1 bg-popover/95 backdrop-blur-sm shadow-lg border border-border/50 rounded-md overflow-hidden"
                        >
                            <div className="py-1">
                                {suggestions.map((suggestion, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={cn(
                                            "w-full px-4 py-2 text-left text-sm",
                                            "hover:bg-muted/50 focus:bg-muted/50",
                                            "focus:outline-none transition-colors",
                                            "flex items-center space-x-2"
                                        )}
                                        onClick={() => applySuggestion(suggestion)}
                                    >
                                        <Sparkles className="w-3 h-3 text-primary/50" />
                                        <span>{suggestion}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }
)
AIInput.displayName = "AIInput"

export { AIInput } 