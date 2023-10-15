import { useEffect } from 'react'
import 'react-day-picker/dist/style.css';
import { initMiniApp } from './api'
import { useWebApp } from '@vkruglikov/react-telegram-web-app'
import { useQuery } from '@tanstack/react-query'
import { DayPicker } from 'react-day-picker';
import Calendar from './Calendar';
import Home from './Home';

function MainPage() {
	const { ready, initData, backgroundColor } = useWebApp()

	useEffect(() => {
		ready();
	});

	const initResult = useQuery({
		queryKey: ['initData'],
		queryFn: async () => {
			const result = await initMiniApp(initData);
			return result;
		}
	});

	const {token, startParam } = initResult?.data || {};


	if (initResult.isLoading) {
		return (
			<div
			style={{
				backgroundColor
			}}>
				<div>
				<DayPicker
					mode="single"
					disabled={true}
					/>
				</div>
			</div>
		)
	}
	if (initResult.isError ) {
		return <div>Error! Try reloading the app</div>
	}
	if (initResult?.data?.startPage === 'calendar') {
		return <Calendar token={token} apiRef={startParam}/>
	}
	return <Home token={token} />

}

export default MainPage
