<template>
	<div :class="$style['page-content']">
		<slot />
	</div>
</template>

<style lang="scss" module>
.page-content {
	min-height: 100vh;
	padding-left: 80px;

	@media screen and (max-width: 1100px) {
		padding-left: 0;
	}
}
</style>
