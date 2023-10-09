const initMiniApp = async (initData) => {
	const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/initMiniApp', {
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

export { initMiniApp, getMe }