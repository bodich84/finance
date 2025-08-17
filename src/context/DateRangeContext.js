import {createContext, useContext, useState, useMemo} from 'react'

const DateRangeContext = createContext(null)
export const useDateRange = () => useContext(DateRangeContext)

/** Зберігаємо dayjs об’єкти: [start, end] або [] */
export const DateRangeProvider = ({children}) => {
  const [range, setRange] = useState([]) // [dayjs(), dayjs()] | []

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
