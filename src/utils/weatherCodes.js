/**
 * Maps Open-Meteo WMO weather codes to readable labels and icons.
 * @see https://open-meteo.com/en/docs
 */

/** @typedef {'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog'} WeatherCategory */

/**
 * @typedef {Object} MappedWeather
 * @property {string} label
 * @property {string} icon
 * @property {WeatherCategory} category
 */

/** @type {Record<number, MappedWeather>} */
const WMO_CODE_MAP = {
  0: { label: 'Clear', icon: '☀️', category: 'clear' },
  1: { label: 'Mostly clear', icon: '🌤️', category: 'clear' },
  2: { label: 'Partly cloudy', icon: '⛅', category: 'cloudy' },
  3: { label: 'Overcast', icon: '☁️', category: 'cloudy' },
  45: { label: 'Fog', icon: '🌫️', category: 'fog' },
  48: { label: 'Fog', icon: '🌫️', category: 'fog' },
  51: { label: 'Light drizzle', icon: '🌦️', category: 'rain' },
  53: { label: 'Drizzle', icon: '🌦️', category: 'rain' },
  55: { label: 'Heavy drizzle', icon: '🌧️', category: 'rain' },
  56: { label: 'Freezing drizzle', icon: '🌧️', category: 'rain' },
  57: { label: 'Freezing drizzle', icon: '🌧️', category: 'rain' },
  61: { label: 'Light rain', icon: '🌦️', category: 'rain' },
  63: { label: 'Rain', icon: '🌧️', category: 'rain' },
  65: { label: 'Heavy rain', icon: '🌧️', category: 'rain' },
  66: { label: 'Freezing rain', icon: '🌧️', category: 'rain' },
  67: { label: 'Freezing rain', icon: '🌧️', category: 'rain' },
  71: { label: 'Light snow', icon: '🌨️', category: 'snow' },
  73: { label: 'Snow', icon: '❄️', category: 'snow' },
  75: { label: 'Heavy snow', icon: '❄️', category: 'snow' },
  77: { label: 'Snow grains', icon: '❄️', category: 'snow' },
  80: { label: 'Rain showers', icon: '🌦️', category: 'rain' },
  81: { label: 'Rain showers', icon: '🌧️', category: 'rain' },
  82: { label: 'Heavy showers', icon: '🌧️', category: 'rain' },
  85: { label: 'Snow showers', icon: '🌨️', category: 'snow' },
  86: { label: 'Heavy snow showers', icon: '❄️', category: 'snow' },
  95: { label: 'Thunderstorm', icon: '⛈️', category: 'storm' },
  96: { label: 'Thunderstorm & hail', icon: '⛈️', category: 'storm' },
  99: { label: 'Thunderstorm & hail', icon: '⛈️', category: 'storm' },
}

const FALLBACK = { label: 'Unknown', icon: '🌡️', category: 'cloudy' }

/**
 * @param {number | null | undefined} code
 * @returns {MappedWeather}
 */
export function mapWeatherCode(code) {
  if (code == null || !(code in WMO_CODE_MAP)) return FALLBACK
  return WMO_CODE_MAP[code]
}
