const initMiniApp = async (initData) => {
	const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/miniApp/init', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(
			{ initData: initData }
		),
	})
	if (!response.ok) {
		throw new Error(`Bot error: ${response.status} ${response.statusText}}`)
	}
	return response.json()
}

const getMe = async (token) => {
	const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/miniApp/me', {
		method: 'GET',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
	})
	if (!response.ok) {
		throw new Error(`Bot error: ${response.status} ${response.statusText}}`)
	}
	return response.json()
}

const getCalendarByRef = async (token, ref) => {
	const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/miniApp/calendar/${ref}`, {
		method: 'GET',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
	});
	if (!response.ok) {
		throw new Error(`Bot error: ${response.status} ${response.statusText}}`)
	}
	return response.json()
}

const sendDates = async(token, dates) => {
	const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/miniApp/dates', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify(
			{ dates: dates }
		),
	})
	if (!response.ok) {
		throw new Error(`Bot error: ${response.status} ${response.statusText}}`)
	}
	return response.json()
}

export { initMiniApp, getMe, sendDates, getCalendarByRef }