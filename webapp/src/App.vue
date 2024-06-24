<script setup lang="ts">
import PageContent from '@/views/PageContent.vue'
import { useWebApp, useWebAppTheme } from 'vue-tg'
import { onMounted, watch } from 'vue'
const { ready } = useWebApp()
const { colorScheme } = useWebAppTheme()

watch(
	colorScheme,
	(scheme) => {
		document.documentElement.setAttribute('data-theme', scheme)
		scheme === 'dark'
			? document.documentElement.classList.add('dark')
			: document.documentElement.classList.remove('dark')
	},
	{
		immediate: true
	}
)

onMounted(() => {
	ready()
})
</script>

<template>
	<div class="w-full">
		<PageContent>
			<router-view v-slot="{ Component }">
				<keep-alive include="NotesView">
					<component :is="Component" />
				</keep-alive>
			</router-view>
		</PageContent>
	</div>
</template>
