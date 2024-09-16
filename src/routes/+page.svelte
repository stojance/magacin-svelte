<script>
	import { goto } from "$app/navigation";
	import { auth_guard } from "../lib/auth_guard.js";

	auth_guard('/');
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="row g-2 m-3">
	<button type="button" class="btn btn-lg btn-outline-primary w-100 m-2 col" on:click={()=>goto('/artikli')}>Баркодови за артикал</button>
	<button type="button" class="btn btn-lg btn-outline-primary w-100 m-2 col" on:click={()=>goto('/kontrola')}>Контрола на документи</button>
</div>

<style>
	button {
		margin-top: 20px;
		padding: 30px;
		border-radius: 200px;
	}
</style>
