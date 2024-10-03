import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import Tracker from "@/components/custom/Tracker";
import { AnimatedSubscribeButton } from "@/components/ui/animated-subscribe-button";
import Icon from "/icon.png";

const components = [
    { name: "API Gateway", uptime: 29.82 },
    { name: "Auth", uptime: 100 },
    { name: "Connection Pooler", uptime: 100 },
    { name: "Website", uptime: 100 },
    { name: "Payment Partners Services", uptime: 100 },
];

export default function StatusPage() {
    return (
        <div className="container mx-auto p-4">
            <header className="flex justify-between items-center mb-8">
                <a href="/" className="flex items-center gap-2">
                    <img src={Icon} alt="lomi. icon" className="w-9 h-9 border-radius-8px" />
                    <h1 className="text-2xl font-bold">lomi.</h1>
                </a>
                <AnimatedSubscribeButton
                    buttonColor="#000000"
                    buttonTextColor="#FFFFFF"
                    subscribeStatus={false}
                    initialText="Subscribe to updates"
                    changeText="Unsubscribe"
                />
            </header>

            {components.map((component) => (
                <Card key={component.name} className="mb-4">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{component.name}</span>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipContent>
                                            <p>Information about {component.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <span className={component.uptime === 100 ? "text-green-500" : "text-red-500"}>
                                {component.uptime === 100 ? "Operational" : "Disruption"}
                            </span>
                        </div>
                        <Tracker />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}