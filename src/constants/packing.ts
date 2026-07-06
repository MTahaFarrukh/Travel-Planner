import type {
  PackingActivity,
  PackingCategory,
  PackingTripType,
  PackingWeather,
  TravelMonth,
} from '../types/packing'
import type { SelectOption } from './aiTrip'

export const MONTH_OPTIONS: SelectOption<TravelMonth>[] = [
  { id: 'january', label: 'Jan', description: 'January' },
  { id: 'february', label: 'Feb', description: 'February' },
  { id: 'march', label: 'Mar', description: 'March' },
  { id: 'april', label: 'Apr', description: 'April' },
  { id: 'may', label: 'May', description: 'May' },
  { id: 'june', label: 'Jun', description: 'June' },
  { id: 'july', label: 'Jul', description: 'July' },
  { id: 'august', label: 'Aug', description: 'August' },
  { id: 'september', label: 'Sep', description: 'September' },
  { id: 'october', label: 'Oct', description: 'October' },
  { id: 'november', label: 'Nov', description: 'November' },
  { id: 'december', label: 'Dec', description: 'December' },
]

export const WEATHER_OPTIONS: SelectOption<PackingWeather>[] = [
  { id: 'sunny', label: 'Sunny', description: 'Clear skies and warm sun' },
  { id: 'rainy', label: 'Rainy', description: 'Frequent showers' },
  { id: 'cold', label: 'Cold', description: 'Low temperatures' },
  { id: 'hot', label: 'Hot', description: 'High heat and humidity' },
  { id: 'mixed', label: 'Mixed', description: 'Variable conditions' },
]

export const TRIP_TYPE_OPTIONS: SelectOption<PackingTripType>[] = [
  { id: 'leisure', label: 'Leisure', description: 'Relaxed sightseeing' },
  { id: 'business', label: 'Business', description: 'Meetings and work travel' },
  { id: 'adventure', label: 'Adventure', description: 'Active outdoor trips' },
  { id: 'backpacking', label: 'Backpacking', description: 'Light and mobile' },
  { id: 'family', label: 'Family', description: 'Travelling with kids' },
]

export const PACKING_ACTIVITY_OPTIONS: SelectOption<PackingActivity>[] = [
  { id: 'hiking', label: 'Hiking', description: 'Trails and treks' },
  { id: 'beach', label: 'Beach', description: 'Swimming and coast time' },
  { id: 'dining', label: 'Dining', description: 'Restaurants and food tours' },
  { id: 'nightlife', label: 'Nightlife', description: 'Evenings out' },
  { id: 'sightseeing', label: 'Sightseeing', description: 'Landmarks and museums' },
  { id: 'skiing', label: 'Skiing', description: 'Snow sports' },
  { id: 'photography', label: 'Photography', description: 'Scenic shoots' },
]

export const DEFAULT_PACKING_REQUEST = {
  destination: '',
  travelMonth: null as TravelMonth | null,
  weather: null as PackingWeather | null,
  tripType: null as PackingTripType | null,
  activities: [] as PackingActivity[],
}

export interface PackingCategoryMeta {
  id: PackingCategory
  label: string
  description: string
  accent: 'brass' | 'rust' | 'teal'
  icon: 'documents' | 'clothing' | 'electronics' | 'medicine' | 'accessories' | 'essentials'
}

export const PACKING_CATEGORY_META: PackingCategoryMeta[] = [
  {
    id: 'documents',
    label: 'Documents',
    description: 'IDs, visas, and travel paperwork',
    accent: 'brass',
    icon: 'documents',
  },
  {
    id: 'clothing',
    label: 'Clothing',
    description: 'Layers and outfits for your climate',
    accent: 'rust',
    icon: 'clothing',
  },
  {
    id: 'electronics',
    label: 'Electronics',
    description: 'Devices, chargers, and adapters',
    accent: 'teal',
    icon: 'electronics',
  },
  {
    id: 'medicine',
    label: 'Medicine',
    description: 'Health essentials and first aid',
    accent: 'teal',
    icon: 'medicine',
  },
  {
    id: 'accessories',
    label: 'Accessories',
    description: 'Bags, gear, and extras',
    accent: 'brass',
    icon: 'accessories',
  },
  {
    id: 'essentials',
    label: 'Essentials',
    description: 'Daily must-haves for the road',
    accent: 'rust',
    icon: 'essentials',
  },
]
