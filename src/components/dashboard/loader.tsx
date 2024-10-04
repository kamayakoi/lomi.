import { Loader2 } from "lucide-react"

export default function LoadingButton() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-2 text-gray-700">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading</span>
      </div>
    </div>
  )
}