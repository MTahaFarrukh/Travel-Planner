import { focusRingOnInk } from '../utils/a11y'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search by destination or country…',
}: SearchInputProps) {
  return (
    <label className="relative block w-full">
      <span className="sr-only">Search destinations</span>
      <svg
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-parchment/60"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-parchment/15 bg-ink/40 py-3 pl-11 pr-4 text-parchment placeholder:text-parchment/55 motion-safe:transition-[border-color,box-shadow] focus-visible:border-brass/60 ${focusRingOnInk}`}
      />
    </label>
  )
}
