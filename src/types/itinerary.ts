export type ActivityType = 'activity' | 'accommodation'

export interface Activity {
  id: string
  dayNumber: number
  title: string
  time?: string
  notes?: string
  type?: ActivityType
  linkedReservationId?: string
}

export interface NewActivity {
  title: string
  time?: string
  notes?: string
  type?: ActivityType
  linkedReservationId?: string
}
