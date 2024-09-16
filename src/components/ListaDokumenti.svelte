<script>
	import { Spinner, Card } from '@sveltestrap/sveltestrap';
	import { MT_LoadIzleziNeKontrolirani, MT_loadMagacini } from '../lib/bucim_web_service.js';
	import { blur } from 'svelte/transition';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();
	export let magacin_id = 0;
	let listaDokumenti = [];
	let listaMagacini = [];
	let isLoading = false;
	let error = '';

	export async function loadDokumenti(m_id) {
		listaDokumenti = [];
		error = '';
		isLoading = true;
		try {
			const res = await MT_LoadIzleziNeKontrolirani(m_id, 0, 0);
			//console.log(res);
			if (res && res.data) {
				listaDokumenti = res.data.data || [];
			}
		} catch (e) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	}

	async function loadMagacini() {
		listaMagacini = [];
		error = '';
		isLoading = true;
		try {
			const res = await MT_loadMagacini();
			//console.log(res);
			if (res && res.data) {
				listaMagacini = res.data.data || [];
			}
		} catch (e) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	}

	function handleClick(item) {
		dispatch('click', { item });
	}

	onMount(async () => {
		await loadMagacini();
		await loadDokumenti(magacin_id);
	});
</script>

<div class="main">
	<div class="header text-center form-floating">
		<select
			class="form-select text-center mt-2"
			id="selectMagacin"
			bind:value={magacin_id}
			on:change={async () => await loadDokumenti(magacin_id)}
			disabled={isLoading}
		>
			<option value="0"></option>
			{#if listaMagacini && listaMagacini.length > 0}
				{#each listaMagacini as item (item)}
					<option value={item.magacin_id}>{item.magacinNaziv}</option>
				{/each}
			{/if}
		</select>
		<label for="selectMagacin">Магацин</label>
	</div>
	<div class="stavki container">
		{#if error && !isLoading}
			<div class="row-col-12 text-danger text-center h3">{error}</div>
		{/if}
		{#if isLoading}
			<div class="row-col-12 text-center mt-5">
				<Spinner type="grow" color="primary" />
			</div>
		{:else if listaDokumenti && listaDokumenti.length > 0}
			<ul>
				{#each listaDokumenti as item (item)}
					<li transition:blur>
						<div class="row g-2">
							<div class="col-12 col-sm-12">
								<Card body on:click={() => handleClick(item)} style="cursor: pointer; padding: 5px;">
									<div class="row g-0">
										<div class="col-12 col-sm-12"><b>{item.magacinNaziv}</b></div>

										<div class="col-7 col-sm-7"><b>{item.vdNaziv}</b>, број: <b>{item.brDok}</b></div>
										<!--<div class="col-3 col-sm-3 text-end"><b>{item.brDok}</b></div>-->
										<div class="col-5 col-sm-5 text-end"><b>{item.datumPrikaz}</b></div>

										<div class="col-7 col-sm-7" style="font-size: small;">{item.firmaNaziv}</div>
										<div class="col-5 col-sm-5 text-end" style="font-size: small;">
											{item.korisnik}
										</div>
									</div>
								</Card>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="text-center h5 mt-4 text-gray-400">Нема документи за контрола</div>
		{/if}
	</div>
</div>

<style>
	li {
		list-style: none;
		margin-bottom: 5px;
	}
	ul {
		padding: 5px 0;
	}
	div.main {
		height: 90vh;
	}
	div.header {
		height: 65px;
	}
	div.stavki {
		height: 85%;
		overflow-y: auto;
		font-size: smaller;
		margin: 0;
		padding: 5px;
	}
	b {
		color: darkblue !important;
	}
</style>
