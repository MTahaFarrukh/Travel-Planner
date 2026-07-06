import { describe, expect, it } from 'vitest'
import { mapWeatherCode } from './weatherCodes.js'

describe('mapWeatherCode', () => {
  it('maps clear sky (code 0)', () => {
    expect(mapWeatherCode(0)).toEqual({
      label: 'Clear',
      icon: '☀️',
      category: 'clear',
    })
  })

  it('maps partly cloudy (code 2)', () => {
    expect(mapWeatherCode(2)).toEqual({
      label: 'Partly cloudy',
      icon: '⛅',
      category: 'cloudy',
    })
  })

  it('maps fog (code 45)', () => {
    expect(mapWeatherCode(45)).toEqual({
      label: 'Fog',
      icon: '🌫️',
      category: 'fog',
    })
  })

  it('maps drizzle (code 51)', () => {
    expect(mapWeatherCode(51)).toEqual({
      label: 'Light drizzle',
      icon: '🌦️',
      category: 'rain',
    })
  })

  it('maps rain (code 63)', () => {
    expect(mapWeatherCode(63)).toEqual({
      label: 'Rain',
      icon: '🌧️',
      category: 'rain',
    })
  })

  it('maps snow (code 73)', () => {
    expect(mapWeatherCode(73)).toEqual({
      label: 'Snow',
      icon: '❄️',
      category: 'snow',
    })
  })

  it('maps thunderstorm (code 95)', () => {
    expect(mapWeatherCode(95)).toEqual({
      label: 'Thunderstorm',
      icon: '⛈️',
      category: 'storm',
    })
  })

  it('returns fallback for an unmapped code', () => {
    expect(mapWeatherCode(404)).toEqual({
      label: 'Unknown',
      icon: '🌡️',
      category: 'cloudy',
    })
  })

  it('returns fallback for null', () => {
    expect(mapWeatherCode(null)).toEqual({
      label: 'Unknown',
      icon: '🌡️',
      category: 'cloudy',
    })
  })
})
