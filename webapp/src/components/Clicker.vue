<script setup lang="ts">
import { userUserStore } from '@/stores/user'

const user_store: ReturnType<typeof userUserStore> = userUserStore()
</script>

<template>
	<div>
		<p><b>User ID:</b> {{ user_store.userId }}</p>
		<p><b>Balance:</b> {{ user_store.balance }}</p>
		<button @click="user_store.increment()">Click</button>
	</div>
</template>
