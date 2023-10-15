import { useState } from 'react'
import 'react-day-picker/dist/style.css';
import {  sendDates } from './api'
import { MainButton, useWebApp } from '@vkruglikov/react-telegram-web-app'
import { useMutation } from '@tanstack/react-query'
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';

function Home(props) {
	const { token } = props;
	const { backgroundColor } = useWebApp()

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
		mainButton = <MainButton text="Select dates" progress={dateMutation.isLoading} onClick={async () => { dateMutation.mutate(selectedDates) }} />;
	}

	if (sendingError) {
		return <div>Error! Please close the window and try creating the calendar again</div>
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
				weekStartsOn={1}
				min={1}
				max={5}
				selected={selectedDates}
				onSelect={setSelected}
				footer={footer}
				disabled={ dateMutation.isLoading }
				/>
			</div>
			{mainButton}
		</div>
	)
}

export default Home
