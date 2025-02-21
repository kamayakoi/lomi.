import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ContributionDay = {
    date: string
    productOrders: number
    subscriptionOrders: number
}

type ContributionData = {
    [date: string]: ContributionDay
}

export default function ContributionGraph() {
    const [year, setYear] = useState(2025)

    // This function would be replaced with actual data from Supabase
    const generateSampleData = (): ContributionData => {
        const data: ContributionData = {}
        const startDate = new Date(year, 0, 1)
        for (let i = 0; i < 365; i++) {
            const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
            const dateString = currentDate.toISOString().split("T")[0]
            if (dateString) {
                data[dateString] = {
                    date: dateString,
                    productOrders: Math.floor(Math.random() * 10),
                    subscriptionOrders: Math.floor(Math.random() * 5),
                }
            }
        }
        return data
    }

    const contributionData = generateSampleData()

    const getContributionLevel = (day: ContributionDay): number => {
        const total = day.productOrders + day.subscriptionOrders
        if (total === 0) return 0
        if (total <= 3) return 1
        if (total <= 6) return 2
        return 3
    }

    const getContributionColor = (level: number): string => {
        const colors = ["#161b22", "#0e4429", "#006d32", "#26a641"]
        return colors[level] || "#161b22"
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const days = ["Mon", "", "Wed", "", "Fri", "", ""]

    const weeks = Object.values(contributionData).reduce(
        (acc, day) => {
            const weekNumber = Math.floor(
                (new Date(day.date).getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000),
            )
            if (!acc[weekNumber]) acc[weekNumber] = []
            acc[weekNumber].push(day)
            return acc
        },
        {} as { [week: number]: ContributionDay[] },
    )

    return (
        <div className="w-full max-w-5xl p-4 rounded-lg bg-[#0d1117] text-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">1,337 contributions in the last year</h2>
                <div className="flex gap-2 items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-gray-400 hover:text-gray-200">
                                Contribution settings <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#161b22] border-[#30363d]">
                            <DropdownMenuItem>Activity overview</DropdownMenuItem>
                            <DropdownMenuItem>Activity types</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex items-center bg-[#161b22] rounded-md">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-gray-200"
                            onClick={() => setYear((prev) => prev - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-2">{year}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-gray-200"
                            onClick={() => setYear((prev) => prev + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="flex text-xs text-gray-400 ml-[22px] mb-1">
                    {months.map((month, i) => (
                        <div key={i} className="flex-1 text-center">
                            {month}
                        </div>
                    ))}
                </div>

                <div className="flex">
                    <div className="flex flex-col text-xs text-gray-400 mt-[-4px] mr-2">
                        {days.map((day, i) => (
                            <div key={i} className="h-[15px] leading-[15px]">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 grid grid-cols-[repeat(52,1fr)] gap-[2px]">
                        {Object.values(weeks).map((week, weekIndex) => (
                            <div key={weekIndex} className="grid grid-rows-7 gap-[2px]">
                                {week.map((day, dayIndex) => {
                                    const level = getContributionLevel(day)
                                    return (
                                        <div
                                            key={`${weekIndex}-${dayIndex}`}
                                            className="w-[10px] h-[10px] rounded-sm"
                                            style={{ backgroundColor: getContributionColor(level) }}
                                            title={`${day.date}: ${day.productOrders} product orders, ${day.subscriptionOrders} subscription orders`}
                                        />
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-end mt-2 text-xs text-gray-400">
                    <span className="mr-2">Less</span>
                    <div className="flex gap-1">
                        {[0, 1, 2, 3].map((level) => (
                            <div
                                key={level}
                                className="w-[10px] h-[10px] rounded-sm"
                                style={{ backgroundColor: getContributionColor(level) }}
                            />
                        ))}
                    </div>
                    <span className="ml-2">More</span>
                </div>
            </div>
        </div>
    )
}

