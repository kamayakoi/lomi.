import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastProgressBar,
} from "@/components/ui/toast"
import { useToast } from "@/lib/hooks/use-toast"
import { CheckCircle2, XCircle, AlertCircle, InfoIcon, Key } from "lucide-react"
import { cn } from "@/lib/actions/utils"

const styles = `
@keyframes iconSlideIn {
  0% {
    transform: translateX(-10px) scale(0.9);
    opacity: 0;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}
`

type ToastVariant = "default" | "destructive" | "info" | "notice" | "success" | "api";

function getToastIcon(variant: ToastVariant) {
  switch (variant) {
    case 'destructive':
      return <XCircle className={cn(
        "h-5 w-5 text-red-950 dark:text-red-400",
        "animate-[iconSlideIn_0.3s_ease-in-out]"
      )} />
    case 'info':
      return <AlertCircle className={cn(
        "h-5 w-5 text-yellow-950 dark:text-yellow-400",
        "animate-[iconSlideIn_0.3s_ease-in-out]"
      )} />
    case 'notice':
      return <InfoIcon className={cn(
        "h-5 w-5 text-blue-950 dark:text-blue-400",
        "animate-[iconSlideIn_0.3s_ease-in-out]"
      )} />
    case "api":
      return <Key className={cn(
        "h-5 w-5 text-cyan-950 dark:text-cyan-400",
        "animate-[iconSlideIn_0.3s_ease-in-out]"
      )} />
    default:
      return <CheckCircle2 className={cn(
        "h-5 w-5 text-emerald-950 dark:text-emerald-400",
        "animate-[iconSlideIn_0.3s_ease-in-out]"
      )} />
  }
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      <style>{styles}</style>
      {toasts.map(function ({ id, title, description, action, variant = "default", ...props }) {
        return (
          <Toast key={id} {...props} variant={variant as ToastVariant}>
            <div className="flex items-start gap-3 min-h-[2rem] z-9999 w-fit">
              <div className="flex-shrink-0 flex items-center self-stretch pl-1">
                {getToastIcon(variant as ToastVariant)}
              </div>
              <div className="grid gap-1 py-2 min-w-[200px] max-w-[320px]">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
            <ToastProgressBar variant={variant as ToastVariant} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
