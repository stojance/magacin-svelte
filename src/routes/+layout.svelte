<script>
	import { page } from '$app/stores';
	import MyNavbar from '../components/MyNavbar.svelte';
	import { Container } from '@sveltestrap/sveltestrap';
	import '../app.css';
</script>

<div class="app">
	{#if $page.url.pathname != '/login'}
		<MyNavbar />
	{/if}
	<main>
		<Container md>
			<slot />
		</Container>
	</main>
</div>

<style>
</style>
