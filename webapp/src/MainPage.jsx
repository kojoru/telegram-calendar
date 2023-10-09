import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import PopupMainButton from './PopupMainButton'
import { initMiniApp, getMe } from './api'
import { useWebApp } from '@vkruglikov/react-telegram-web-app'
import {
  useQuery
} from '@tanstack/react-query'

function MainPage() {
  const [count, setCount] = useState(0)

  const { initDataUnsafe, initData, backgroundColor } = useWebApp()

  const initResult = useQuery({
    queryKey: ['initData'],
    queryFn: async () => {
      const result = await initMiniApp(initData);
      return result;
    }
  });

  const token = initResult?.data?.token;
  const me = useQuery({
    queryKey: ['me', token],
    queryFn: async () => {
      const result = await getMe(token);
      return result;
    },
    enabled: !!token,
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
        </button>
        {/* <code>{JSON.stringify(initResult)}</code> */}
        <p>
        we thing you are {initDataUnsafe?.user?.first_name}<br/>
        backend thinks you are {me?.data?.user?.firstName}<br/>
        backend is {import.meta.env.VITE_BACKEND_URL}
        </p>
      </div>
      <PopupMainButton />
    </div>
  )
}

export default MainPage
