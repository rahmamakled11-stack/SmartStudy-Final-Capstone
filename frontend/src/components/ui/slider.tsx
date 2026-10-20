import * as React from 'react'
import { cn } from '@/lib/utils'

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number[]
  max?: number
  step?: number
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value = [0], max = 100, step = 1, ...props }, ref) => (
    <div ref={ref} className={cn('relative flex w-full touch-none select-none items-center', className)} {...props}>
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute h-full bg-primary"
          style={{ width: `${(value[0] / max) * 100}%` }}
        />
      </div>
    </div>
  )
)
Slider.displayName = 'Slider'

export { Slider }
