import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ButtonLoading({ type, text, loading, onClick,className, ...props }) {
  return (
    <Button
      type={type}
      disabled={loading}
      className={cn('',className)}
      onClick={onClick}
      {...props}
    >
      {loading &&
        <Loader2Icon className="animate-spin" />
      }
      {text}
    </Button>
  )
}

