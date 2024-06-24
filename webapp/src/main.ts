import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
import VueTelegram from 'vue-tg'

app.use(VueTelegram)
app.use(router)
app.use(createPinia())

app.mount('#app')
