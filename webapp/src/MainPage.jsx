import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import PopupMainButton from './PopupMainButton'
import { useWebApp } from '@vkruglikov/react-telegram-web-app'
import {
  useQuery
} from '@tanstack/react-query'

function MainPage() {
  const [count, setCount] = useState(0)

  const { initDataUnsafe, initData, backgroundColor } = useWebApp()

  const result = useQuery({
    queryKey: ['initData'],
    queryFn: async () => {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL+'/initMiniApp', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {initData: initData}
          ),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  });

  return (
    <div
    style={{
      backgroundColor
    }}>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}<br/>
          you are {initDataUnsafe?.user?.first_name}<br/>
          backend is {import.meta.env.VITE_BACKEND_URL}
        </button>
        <p>
        {result.data?.result}
        </p>
      </div>
      <PopupMainButton />
    </div>
  )
}

export default MainPage
