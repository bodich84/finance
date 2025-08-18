import {createContext, useContext, useState, useMemo, useEffect} from 'react'
import dayjs from 'dayjs'

const DateRangeContext = createContext(null)
export const useDateRange = () => useContext(DateRangeContext)

/** Зберігаємо dayjs об’єкти: [start, end] або [] */
export const DateRangeProvider = ({children}) => {
  const [range, setRange] = useState(() => {
    try {
      const raw = localStorage.getItem('dateRange')
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed[0] && parsed[1]) {
        return [dayjs(parsed[0]), dayjs(parsed[1])]
      }
    } catch (e) {
      // ignore
    }
    return []
  }) // [dayjs(), dayjs()] | []

  useEffect(() => {
    if (Array.isArray(range) && range[0] && range[1]) {
      localStorage.setItem(
        'dateRange',
        JSON.stringify(range.map((d) => d?.toISOString?.()))
      )
    } else {
      localStorage.removeItem('dateRange')
    }
  }, [range])

  const value = useMemo(
    () => ({
      range,
      setRange,
      // зручні деривативи
      hasRange: Array.isArray(range) && range[0] && range[1],
      start: range?.[0] || null,
      end: range?.[1] || null,
      // хелпери у вигляді Date
      startDate: range?.[0]?.startOf('day').toDate?.() || null,
      endDate: range?.[1]?.endOf('day').toDate?.() || null,
    }),
    [range]
  )

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  )
}
