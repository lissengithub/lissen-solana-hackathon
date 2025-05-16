import { useCallback } from 'react'
import { Minus, Plus } from 'lucide-react'

export default function Counter({ 
  value,
  onChange
}: { 
  value: number 
  onChange: (value: number) => void
}) {
  const handleChange = useCallback((newValue: number) => {
    if (newValue < 1) return;
    onChange(newValue);
  }, [onChange]);
  
  return (
    <div className="flex items-center gap-2 bg-zinc-900 rounded-full p-1 w-fit border border-white/10">
      <button 
        onClick={() => handleChange(value - 1)}
        className="w-8 h-8 rounded-full bg-neutral-950 flex items-center justify-center"
      >
        <Minus size={16} />
      </button>
      <span className="w-6 text-base font-medium text-center">{value}</span>
      <button 
        onClick={() => handleChange(value + 1)}
        className="w-8 h-8 rounded-full bg-neutral-950 flex items-center justify-center"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
