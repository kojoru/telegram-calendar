import { useState } from 'react'
import 'react-day-picker/dist/style.css';
import { initMiniApp, getMe, sendDates } from './api'
import { MainButton, useWebApp } from '@vkruglikov/react-telegram-web-app'
import { useQuery, useMutation } from '@tanstack/react-query'
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';


const handleClick = () =>
showPopup({
	message: 'Hello, I am popup',
});


function MainPage() {
	const [count, setCount] = useState(0)

	const { unsafeInitData, initData, backgroundColor } = useWebApp()

	console.log(initData);

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

	let sendingError = false;
	// send selected dates to backend:
	const dateMutation = useMutation({
		mutationKey: ['sendDate', token],
		mutationFn: async (dates) => {
			const result = await sendDates(token, dates);
			return result;
		},
		onSuccess: () => {
			window.Telegram.WebApp.close();
		},
		onError: () => {
			sendingError = true;
		},
	});


	const [selectedDates, setSelected] = useState();

	let footer = <p>Please pick the days you propose for the meetup.</p>;
	let mainButton = "";

	if (selectedDates) {
		footer = (
			<p>
			You picked {selectedDates.length}{' '}
			{selectedDates.length > 1 ? 'dates' : 'date'}: {' '}
			{selectedDates.map((date, index) => (
				<span key={date.getTime()}>
				{index ? ', ' : ''}
				{format(date, 'PP')}
				</span>
			))}
			</p>
		);
		mainButton = <MainButton text="Select dates" onClick={async () => { dateMutation.mutate(selectedDates) }} />;
	}

	if (initResult.isError || me.isError || sendingError) {
		return <div>Error! Try reloading the app</div>
	}
	if(initResult.isLoading || me.isLoading) {
		return <div>loading...</div>
	}
	return (
		<div
		style={{
			backgroundColor
		}}>
			<h2>Pick proposed dates</h2>
			<div>
			<DayPicker
				mode="multiple"
				min={1}
				max={5}
				selected={selectedDates}
				onSelect={setSelected}
				footer={footer}
				/>
			</div>
			{/*<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}<br/>
				</button>
				 {<code>{JSON.stringify(initResult)}</code>}
				<p>
				we think you are {initDataUnsafe?.user?.first_name}<br/>
				backend thinks you are {me?.data?.user?.firstName}<br/>
				backend is {import.meta.env.VITE_BACKEND_URL}
				</p> 
			</div>*/}
			{mainButton}
		</div>
	)
}

export default MainPage
