import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface DropdownOption {
  value: string
  label: string
}

interface CustomDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className = ""
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(option => option.value === value)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-400/20 focus:border-zinc-500/60"
      >
        <span className={selectedOption ? 'text-zinc-200' : 'text-zinc-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
            >
              <span className={value === option.value ? 'text-zinc-200 font-medium' : 'text-zinc-300'}>
                {option.label}
              </span>
              {value === option.value && (
                <Check size={16} className="text-emerald-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}