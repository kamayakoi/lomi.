import { Clock } from 'lucide-react'

const Progress: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
);

const ActivationStep5: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="text-center py-12">
                <Clock className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold">Verification in Progress</h2>
                <p className="text-muted-foreground">
                    We are reviewing your information. This process may take 1-3 business days.
                </p>
            </div>
            <div className="space-y-2">
                <Progress value={33} />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Day 1</span>
                    <span>Day 2</span>
                    <span>Day 3</span>
                </div>
            </div>
        </div>
    )
}

export default ActivationStep5;