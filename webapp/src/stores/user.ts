import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWebApp, useWebAppPopup } from 'vue-tg'

export const userUserStore = defineStore('user', () => {
	const userId = useWebApp().initDataUnsafe.user?.id
	if (!userId) {
		useWebAppPopup().showAlert('Error: Missing user ID', useWebApp().close)
		throw Error('Missing user ID')
	}

	const balance = ref(0)

	function increment() {
		balance.value++
	}

	return { userId, balance, increment }
})
