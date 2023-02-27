import React, { useEffect, useState } from 'react'

interface CountdownProps {
  date: string
  place: string
}

interface CountdownState {
  days: string | number
  hours: string | number
  minutes: string | number
  seconds: string | number
}

const styles = `
.text-gradient {
  background-image: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 400%;
  background-position: 0%;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 10px;
}

.countdown-item-value {
  font-size: 3rem;
  font-weight: 700;
}

.countdown-item-label {
  font-size: 1.5rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .countdown-item {
    padding: 0 5px;
  }
}

@media (max-width: 480px) {
  .countdown-item {
    padding: 0 2px;
  }
}

@media (max-width: 320px) {
  .countdown-item {
    padding: 0 1px;
  }
}
`

export const CountdownReact = () => {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: '0',
    hours: '0',
    minutes: '0',
    seconds: '0',
  })
  const [isCountdownExpired, setIsCountdownExpired] = useState(false)
  const [countdownDate, setCountdownDate] = useState({
    date: 0,
    place: '',
  })

  useEffect(() => {
    const countDownDate = new Date(countdownDate.date).getTime()
    console.log('countDownDate -->', countDownDate)
    if (countDownDate === 0) {
      return
    }
    const x = setInterval(() => {
      const now = new Date().getTime()
      const distance = Number(countDownDate) - Number(now)
      console.log(distance)

      let days: string | number = Math.floor(distance / (1000 * 60 * 60 * 24))
      let hours: string | number = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      let minutes: string | number = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      )
      let seconds: string | number = Math.floor((distance % (1000 * 60)) / 1000)

      let addZeroToDays =
        days < 10 ? days.toString().padStart(2, '0') : days.toString()
      let addZeroToHours =
        hours < 10 ? hours.toString().padStart(2, '0') : hours.toString()
      let addZeroToMinutes =
        minutes < 10 ? minutes.toString().padStart(2, '0') : minutes.toString()
      let addZeroToSeconds =
        seconds < 10 ? seconds.toString().padStart(2, '0') : seconds.toString()
      setCountdown({
        days: addZeroToDays,
        hours: addZeroToHours,
        minutes: addZeroToMinutes,
        seconds: addZeroToSeconds,
      })

      if (distance < 0 && countDownDate !== 0) {
        clearInterval(x)
        setIsCountdownExpired(true)
      }
    }, 1000)
  }, [countdownDate.date])

  const [loading, setLoading] = useState(true)
  const [hasDate, setHasDate] = useState(false)

  useEffect(() => {
    const countdownDate = localStorage.getItem('countdownDate')
    setLoading(true)
    if (countdownDate) {
      setCountdownDate(JSON.parse(countdownDate))
      setHasDate(true)
    }
    setLoading(false)
  }, [])

  const handleValidateDate = () => {
    if (countdownDate.date && countdownDate.place) {
      // save the countdownDate in the localStorage
      localStorage.setItem('countdownDate', JSON.stringify(countdownDate))
      setHasDate(true)
    } else {
      alert('Please fill all fields')
    }
  }

  return hasDate ? (
    !loading ? (
      <div className='flex flex-col min-h-screen items-center justify-center py-2 text-zinc-50'>
        <h2 className='text-center font-sans font-bold text-5xl mb-8 mt-8 pt-3 pb-3 text-gradient'>
          Viaje a {countdownDate.place}
        </h2>
        {!isCountdownExpired ? (
          <section id='countdown-container'>
            <div id='countdown' className='flex'>
              <div className='countdown-item'>
                <div id='countdown-item-days' className='countdown-item-value'>
                  {countdown.days}
                </div>

                <div className='countdown-item-label'>Days</div>
              </div>

              <div className='countdown-item'>
                <div id='countdown-item-hour' className='countdown-item-value'>
                  {countdown.hours}
                </div>

                <div className='countdown-item-label'>Hours</div>
              </div>

              <div className='countdown-item'>
                <div
                  id='countdown-item-minute'
                  className='countdown-item-value'
                >
                  {countdown.minutes}
                </div>

                <div className='countdown-item-label'>Minutes</div>
              </div>

              <div className='countdown-item'>
                <div
                  id='countdown-item-second'
                  className='countdown-item-value'
                >
                  {countdown.seconds}
                </div>

                <div className='countdown-item-label'>Seconds</div>
              </div>
            </div>
            <style>{styles}</style>
          </section>
        ) : (
          <div className='text-center font-sans font-bold text-5xl mb-8 mt-8 pt-3 pb-3 text-gradient'>
            <h2>El viaje ya ha comenzado</h2>
            <div id='tsparticles'></div>
          </div>
        )}
      </div>
    ) : (
      <div className='text-center font-sans font-bold text-5xl mb-8 mt-8 pt-3 pb-3 text-gradient'>
        <h2>Loading...</h2>
      </div>
    )
  ) : (
    <div className='flex flex-col justify-center items-center font-sans font-bold pt-3 pb-3 min-h-screen'>
      <h2 className='text-gradient pt-3 pb-3 text-5xl'>
        Cuando y a donde te vas?
      </h2>
      <div className='mt-4 flex flex-col justify-center items-center h-full'>
        <input
          type='datetime-local'
          className='rounded-2xl border-2 border-fuchsia-500 px-10 py-3 font-sans font-bold text-2xl w-96'
          onBlur={(e) => {
            const formattedDate = new Date(e.target.value).getTime()
            // copy the countdownDate state and update the date
            const newCountdownDate = { ...countdownDate, date: formattedDate }
            setCountdownDate(newCountdownDate)
          }}
        />
        <input
          type='text'
          placeholder='A donde viajas?...'
          className='rounded-2xl border-2 border-fuchsia-500 px-10 py-3 mt-4 font-sans font-bold text-2xl w-96 placeholder-slate-500'
          onChange={(e) => {
            const newCountdownDate = { ...countdownDate, place: e.target.value }
            setCountdownDate(newCountdownDate)
          }}
        />
        <button
          className='rounded-2xl bg-fuchsia-500 px-10 py-3 mt-4 font-sans font-bold text-2xl w-96 text-white'
          onClick={handleValidateDate}
        >
          Guardar
        </button>
      </div>
      <style>{styles}</style>
    </div>
  )
}
