import 'react-day-picker/dist/style.css';
import { getCalendarByRef } from './api'
import { useQuery } from '@tanstack/react-query'
import { DayPicker } from 'react-day-picker';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useState } from 'react';

function Calendar(params) {
	const { backgroundColor } = useWebApp();
	const [selectedDates, setSelected] = useState();
	const { token, apiRef } = params;
	const initResult = useQuery({
		queryKey: ['calendar', apiRef],
		queryFn: async () => {
			const result = await getCalendarByRef(token, apiRef);
			return result;
		}
	});
	let disabledMatcher = () => false;
	if(initResult.data) {
		disabledMatcher = date => {
			const dateStr = date.toISOString().split('T')[0];
			return !initResult.data.calendar.dates.includes(dateStr);
		}
	}
	
	return (
		<div
		style={{
			backgroundColor
		}}>
			<h2>Pick out of proposed dates</h2>
			<div>
			<DayPicker
				mode="multiple"
				weekStartsOn={1}
				min={0}
				selected={selectedDates}
				onSelect={setSelected}
				disabled={initResult.isLoading || disabledMatcher}
				/>
			</div>
		</div>
	)
}

export default Calendar
