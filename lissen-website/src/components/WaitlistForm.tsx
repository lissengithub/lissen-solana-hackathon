"use client"

import { Button } from '@/components/ui/button'
import { cn, isProdEnv } from '@/lib/utils'
import React from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { trpc } from '../lib/trpc'

export default function WaitlistForm({
  placeholder = "Enter your email",
  buttonText = "Join Waitlist",
  className,
}: {
  placeholder?: string,
  buttonText?: string,
  className?: string,
}) {
  const [email, setEmail] = React.useState("")
  
  const mutation = trpc.website.waitlist.add.useMutation({
    onSuccess: () => {
      setEmail("")
      toast.success("Thank you for joining the waitlist!")
    },
    onError: () => {
      toast.error("Sorry, there was an error. Please try again later.")
    }
  })

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (isProdEnv()) {
      mutation.mutate({ email })
    } else {
      toast.info("This feature is only available in the production environment.")
    }
  }, [email, mutation])

  return (
    <form onSubmit={handleSubmit} className={"w-full"}>
      <div className={cn("flex gap-2 border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-zinc-800/90 p-1 rounded-2xl", className)}>
        <input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 p-2 bg-transparent text-sm focus:outline-none placeholder:text-black placeholder:font-light dark:placeholder:text-white/50 dark:placeholder:font-medium"
          required
          disabled={mutation.isPending}
        />
        <Button
          type="submit"
          className="uppercase text-black rounded-xl font-semibold p-2"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </div>
    </form>
  )
}
