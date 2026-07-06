import { useEffect, useState } from 'react'
import type { BookingDateRange, Hotel } from '../types/hotel'
import { formatCurrency } from '../utils/formatCurrency'
import { focusRingOnParchment } from '../utils/a11y'
import DateRangePicker from './DateRangePicker'

interface HotelCardProps {
  hotel: Hotel
  isBooked: boolean
  defaultDateRange: BookingDateRange
  onBook: (hotel: Hotel, dateRange: BookingDateRange) => boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 font-mono text-sm text-brass"
      aria-label={`Rating ${rating} out of 5`}
    >
      <svg
        className="size-4 fill-brass"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span aria-hidden="true">{rating.toFixed(1)}</span>
    </span>
  )
}

function addDays(dateString: string, days: number) {
  const date = new Date(`${dateString}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

function nightsBetween(checkIn: string, checkOut: string) {
  const inDate = new Date(`${checkIn}T12:00:00`)
  const outDate = new Date(`${checkOut}T12:00:00`)
  const diff = outDate.getTime() - inDate.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

export default function HotelCard({
  hotel,
  isBooked,
  defaultDateRange,
  onBook,
}: HotelCardProps) {
  const [justBooked, setJustBooked] = useState(false)
  const [checkIn, setCheckIn] = useState(defaultDateRange.checkIn)
  const [checkOut, setCheckOut] = useState(defaultDateRange.checkOut)
  const [showDateForm, setShowDateForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nights = nightsBetween(checkIn, checkOut)
  const stayTotal = hotel.pricePerNight * Math.max(0, nights)

  useEffect(() => {
    if (!justBooked) return
    const timer = window.setTimeout(() => setJustBooked(false), 2000)
    return () => window.clearTimeout(timer)
  }, [justBooked])

  useEffect(() => {
    setCheckIn(defaultDateRange.checkIn)
    setCheckOut(defaultDateRange.checkOut)
    setError(null)
    setShowDateForm(false)
  }, [defaultDateRange.checkIn, defaultDateRange.checkOut, hotel.id])

  function handleBook() {
    if (isBooked) return

    if (!showDateForm) {
      setShowDateForm(true)
      return
    }

    if (!checkIn || !checkOut) {
      setError('Choose both check-in and check-out dates.')
      return
    }

    if (nights < 1) {
      setError('Check-out must be at least one night after check-in.')
      return
    }

    const booked = onBook(hotel, { checkIn, checkOut })
    if (!booked) {
      setError('This hotel is already booked for this trip.')
      return
    }

    setError(null)
    setShowDateForm(false)
    setJustBooked(true)
  }

  return (
    <article className="animate-card-in group relative flex flex-col overflow-hidden rounded-2xl bg-parchment text-ink shadow-md motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl">
      <div className="relative h-40 overflow-hidden sm:h-44">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          width={640}
          height={400}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div className="absolute right-3 top-3 rounded-full bg-ink/55 px-2.5 py-1 backdrop-blur-sm">
          <StarRating rating={hotel.rating} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-display text-lg font-semibold leading-tight sm:text-xl">
          {hotel.name}
        </h3>

        <p className="mt-2 font-mono text-lg font-medium text-teal">
          {formatCurrency(hotel.pricePerNight)}
          <span className="text-sm font-normal text-ink/60"> / night</span>
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {hotel.amenities.map((amenity) => (
            <li
              key={amenity}
              className="rounded-full bg-ink/8 px-2.5 py-0.5 font-mono text-xs text-ink/75"
            >
              {amenity}
            </li>
          ))}
        </ul>

        {showDateForm && !isBooked && (
          <DateRangePicker
            checkIn={checkIn}
            checkOut={checkOut}
            minCheckOut={addDays(checkIn, 1)}
            onCheckInChange={(value) => {
              setCheckIn(value)
              if (checkOut && value && checkOut <= value) {
                setCheckOut(addDays(value, 1))
              }
              setError(null)
            }}
            onCheckOutChange={(value) => {
              setCheckOut(value)
              setError(null)
            }}
            error={error}
          />
        )}

        <p className="mt-3 font-mono text-xs text-ink/65">
          {formatCurrency(hotel.pricePerNight)} ×{' '}
          {Math.max(0, nights)} {Math.max(0, nights) === 1 ? 'night' : 'nights'} ={' '}
          <span className="text-rust">{formatCurrency(stayTotal)}</span>
        </p>

        <button
          type="button"
          onClick={handleBook}
          disabled={isBooked}
          aria-label={
            isBooked
              ? `${hotel.name} already booked`
              : showDateForm
                ? `Confirm booking for ${hotel.name}`
                : `Book ${hotel.name}`
          }
          className={`mt-4 w-full rounded-xl px-4 py-3 font-mono text-sm uppercase tracking-wide transition-colors ${focusRingOnParchment} ${
            isBooked
              ? 'cursor-default bg-teal/20 text-teal'
              : 'bg-rust text-parchment hover:bg-rust/90'
          }`}
        >
          {isBooked ? '✓ Booked' : showDateForm ? 'Confirm stay' : 'Book now'}
        </button>
      </div>

      {justBooked && (
        <div
          className="animate-booking-overlay absolute inset-0 flex flex-col items-center justify-center bg-teal/95 text-parchment"
          aria-live="polite"
          role="status"
        >
          <div className="animate-check-pop flex flex-col items-center px-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-parchment/20 sm:size-16">
              <svg
                className="size-8 text-parchment sm:size-9"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  className="animate-check-draw"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="mt-3 font-display text-lg font-semibold sm:text-xl">
              Reservation confirmed!
            </p>
            <p className="mt-1 font-mono text-xs text-parchment/80">
              Added to your itinerary
            </p>
          </div>
        </div>
      )}
    </article>
  )
}
