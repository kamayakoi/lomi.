import { Loader2 } from "lucide-react"

export default function LoadingButton() {
  return (
    <div className="flex h-screen items-start justify-end bg-white dark:bg-gray-900 pt-20 pr-8">
      <div className="flex items-center gap-2 text-gray-700 dark:text-white ml-auto">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading</span>
      </div>
    </div>
  )
}