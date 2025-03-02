import { useState, useEffect, useRef } from 'react'
import { Search, ArrowLeft, Command } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/actions/utils"

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const endpoints = [
        { name: "List Products", method: "GET", path: "/v1/products/" },
        { name: "Create Product", method: "POST", path: "/v1/products/" },
        { name: "Get Product", method: "GET", path: "/v1/products/{id}" },
        { name: "Update Product", method: "PATCH", path: "/v1/products/{id}" },
        { name: "Update Product Benefits", method: "POST", path: "/v1/products/{id}/benefits" },
    ]

    const filteredEndpoints = endpoints.filter(endpoint =>
        endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.path.toLowerCase().includes(searchQuery.toLowerCase())
    )

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setIsOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus()
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-sm sm:pr-12 md:w-32 lg:w-48"
                >
                    <Search className="mr-2 h-4 w-4" />
                    Documentation
                    <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <Command className="h-3 w-3" />K
                    </kbd>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0">
                <div className="flex flex-col h-[600px]">
                    <div className="flex items-center gap-2 p-4 border-b">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                            <Input
                                ref={inputRef}
                                placeholder="Search for commands, APIs & documentation..."
                                className="border-none shadow-none focus-visible:ring-0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-1 overflow-hidden">
                        <ScrollArea className="w-1/3 border-r">
                            {filteredEndpoints.map((endpoint) => (
                                <Button
                                    key={`${endpoint.method}-${endpoint.path}`}
                                    variant="ghost"
                                    className="w-full justify-start p-4 h-auto"
                                >
                                    <div className="flex flex-col items-start gap-1">
                                        <div className="font-medium">{endpoint.name}</div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "px-2 py-0.5 text-xs rounded-md font-mono",
                                                endpoint.method === "GET" && "bg-blue-100 text-blue-700",
                                                endpoint.method === "POST" && "bg-green-100 text-green-700",
                                                endpoint.method === "PATCH" && "bg-yellow-100 text-yellow-700"
                                            )}>
                                                {endpoint.method}
                                            </span>
                                            <span className="text-sm text-muted-foreground font-mono">
                                                {endpoint.path}
                                            </span>
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </ScrollArea>
                        <div className="flex-1 p-4 overflow-hidden">
                            <Tabs defaultValue="curl">
                                <TabsList>
                                    <TabsTrigger value="curl">cURL</TabsTrigger>
                                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                                    <TabsTrigger value="python">Python</TabsTrigger>
                                </TabsList>
                                <TabsContent value="curl" className="mt-4">
                                    <ScrollArea className="h-[400px]">
                                        <pre className="p-4 rounded-lg bg-muted font-mono text-sm whitespace-pre-wrap">
                                            {`curl -X GET \\
  'https://api.polar.sh/v1/products/' \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer <token>"`}
                                        </pre>
                                    </ScrollArea>
                                </TabsContent>
                                <TabsContent value="javascript" className="mt-4">
                                    <ScrollArea className="h-[400px]">
                                        <pre className="p-4 rounded-lg bg-muted font-mono text-sm whitespace-pre-wrap">
                                            {`const response = await fetch('https://api.polar.sh/v1/products/', {
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer <token>'
  }
});

const data = await response.json();`}
                                        </pre>
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}