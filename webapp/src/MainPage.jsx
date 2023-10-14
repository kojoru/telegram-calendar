import { useEffect, useState } from 'react'
import 'react-day-picker/dist/style.css';
import { initMiniApp, sendDates } from './api'
import { MainButton, useWebApp } from '@vkruglikov/react-telegram-web-app'
import { useQuery, useMutation } from '@tanstack/react-query'
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';

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

	const token = initResult?.data?.token;

	let sendingError = false;
	// send selected dates to backend:
	const dateMutation = useMutation({
		mutationKey: ['sendDate', token],
		mutationFn: async (dates) => {
			const result = await sendDates(token, dates.map(date => format(date, 'yyyy-MM-dd')));
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

	if (initResult.isError || sendingError) {
		return <div>Error! Try reloading the app</div>
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
				disabled={initResult.isLoading || dateMutation.isLoading}
				/>
			</div>
			{mainButton}
		</div>
	)
}

export default MainPage
