import React from 'react'
import { cn } from '@/lib/utils'
import DownloadAppButton from './DownloadAppButton'
import WaitlistForm from './WaitlistForm'

export default function MainCTA({
  className,    
}: {
  className?: string,
}) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center gap-2 md:gap-4", className)}>
      <DownloadAppButton />
      <p className="text-lg md:text-xl font-normal text-center text-zinc-300">
        or
      </p>
      <WaitlistForm />
    </div>
  )
}
