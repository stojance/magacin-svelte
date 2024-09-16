<script>
	import ListaBKZaArtikal from '../../components/ListaBKZaArtikal.svelte';
	import FilterDialog from '../../components/FilterDialog.svelte';
	import {
		MT_loadBarKod,
		MT_loadArtikalBarKod,
		MT_loadArtikli,
		MT_saveInsBarKod
	} from '../../lib/bucim_web_service.js';
	import { Spinner, Toast } from '@sveltestrap/sveltestrap';
	import { auth_guard } from '../../lib/auth_guard.js';

	auth_guard('/artikli');
	let modal = false;
	let item = {};
	let elementArtikal;
	let elementBarKod;
	let barKodZaArtikalCtrl;
	let baran_artikal_id = '';
	let baran_artikal = null;
	let artikal_id = 0;
	let barKod = '';
	let isOpen = false;
	let kbModeNone = true;
	let isLoading = false;
	let error = '';
	let elementButtonProdolzi;

	const handleModal = async (event) => {
		item = event.detail.item;
		modal = false;
		if (item?.sifraID > 0) {
			const id = parseInt(item?.sifraID);
			baran_artikal_id = '';
			const res2 = await MT_loadArtikli(id);
			if (res2 && res2.data && res2.data?.data.length > 0) {
				baran_artikal = res2.data.data[0];
				//console.log(baran_artikal);
				artikal_id = id;
				setTimeout(() => {
					elementBarKod?.focus();
				}, 200);
			}
		}
	};

	const handleArtikalChange = async (event) => {
		try {
			error = '';
			baran_artikal_id = event.target.value;
			baran_artikal = null;
			artikal_id = 0;
			isLoading = true;
			const res = await MT_loadArtikalBarKod(baran_artikal_id);
			if (res && res.data) {
				//console.log(res.data);
				const id = parseInt(res.data.outParametars['@Artikal_IDout']);
				baran_artikal_id = '';
				if (id > 0) {
					const res2 = await MT_loadArtikli(id);
					if (res2 && res2.data && res2.data?.data.length > 0) {
						baran_artikal = res2.data.data[0];
						console.log(baran_artikal);
						artikal_id = id;
						setTimeout(() => {
							elementBarKod?.focus();
						}, 200);
					}
				} else {
					error = 'Не пронајден артикал !';
					setTimeout(() => elementButtonProdolzi?.focus(), 200);
				}
			}
		} catch (e) {
			console.error('Error:', e);
			error = e.message;
			baran_artikal_id = '';
			baran_artikal = null;
			artikal_id = 0;
			elementButtonProdolzi?.focus();
		} finally {
			isLoading = false;
		}
	};

	const handleBarKodChange = async (event) => {
		try {
			error = '';
			barKod = event.target.value;
			isLoading = true;
			if (barKod && artikal_id > 0) {
				const res = await MT_loadBarKod(0, barKod);
				console.log(res?.data);
				if (res && res.data && res.data.data?.length > 0) {
					elementBarKod?.focus();
					elementBarKod?.select();
					//alert(`Баркодот '${barKod}' веќе се користи!`);
					isLoading = false;
					isOpen = true;
					return;
				}
				await MT_saveInsBarKod(barKod, artikal_id);
				barKod = '';
				barKodZaArtikalCtrl.loadBK(artikal_id);
			}
		} catch (e) {
			console.error('Error:', e);
			error = e.message;
			barKod = '';
			elementButtonProdolzi?.focus();
		} finally {
			isLoading = false;
		}
	};

	setTimeout(() => {
		elementArtikal?.focus();
	}, 200);
	//$: artikal_id = (item && item.sifraID) || 0;
</script>

<svelte:head>
	<title>Артикли</title>
	<meta name="description" content="артикли" />
</svelte:head>

<button
	class="btn btn-light"
	style="width: 100%;"
	on:click={() => {
		artikal_id = 0;
		baran_artikal_id = '';
		baran_artikal = null;
		setTimeout(() => {
			elementArtikal?.focus();
		}, 200);
	}}
>
	{#if baran_artikal != null}
		<h5>{baran_artikal.artikaL_ID} ({baran_artikal.pcode})</h5>
		<h4>{baran_artikal.naziv}</h4>
	{:else}
		<h5>Баркодови за артикал</h5>
	{/if}
</button>

<div class="row g-1">
	{#if artikal_id == 0}
		<div class="col-12 col-sm-12 input-group">
			<button
				class="btn input-group-text"
				class:btn-info={kbModeNone}
				class:btn-success={!kbModeNone}
				on:click={() => {
					kbModeNone = !kbModeNone;
					elementArtikal?.focus();
				}}
			>
				<i class="bi bi-keyboard"></i>
			</button>
			<input
				type="text"
				class="form-control text-center"
				placeholder="Барај артикал"
				bind:this={elementArtikal}
				value={baran_artikal_id}
				on:change={handleArtikalChange}
				inputmode={kbModeNone ? 'none' : null}
			/>
			<button class="btn btn-info input-group-text" on:click={() => (modal = !modal)}>
				<i class="bi bi-search"></i>
			</button>
		</div>
	{:else}
		<div class="col-12 col-sm-12 mb-1">
			<div class="input-group">
				<button
					class="btn input-group-text"
					class:btn-info={kbModeNone}
					class:btn-success={!kbModeNone}
					on:click={() => {
						kbModeNone = !kbModeNone;
						elementBarKod?.focus();
					}}
				>
					<i class="bi bi-keyboard"></i>
				</button>
				<input
					type="text"
					class="form-control text-center"
					placeholder="нов баркод"
					bind:this={elementBarKod}
					value={barKod}
					on:change={handleBarKodChange}
					inputmode={kbModeNone ? 'none' : null}
				/>
			</div>

			<div class="div-toast">
				<Toast
					theme="dark"
					autohide
					delay={3000}
					body
					header="Баркод"
					{isOpen}
					on:close={() => {
						isOpen = false;
						barKod = '';
					}}
					style="margin-left: auto; margin-right: auto; text-align: center;--bs-toast-color: #fff;"
				>
					Баркодот <b>{barKod}</b> веќе се користи !
				</Toast>
			</div>
		</div>
	{/if}
</div>
{#if error && !isLoading}
	<div class="row-col-12 text-danger text-center h4 mt-0">
		{error}
		<br />
		<button
			class="btn btn-info btn-lg"
			bind:this={elementButtonProdolzi}
			on:click={() => {
				error = '';
				isLoading = false;
				artikal_id = 0;
				barKod = '';
				baran_artikal_id = '';
				setTimeout(() => elementArtikal?.focus(), 200);
			}}
		>
			Продолжи
		</button>
	</div>
{:else if isLoading}
	<div class="row-col-12 text-center mt-5">
		<Spinner type="grow" color="primary" />
	</div>
{/if}
{#if artikal_id && artikal_id > 0}
	<div style="height: 65vh; overflow-y: auto;">
		<ListaBKZaArtikal
			{artikal_id}
			bind:this={barKodZaArtikalCtrl}
			on:delete={() => {
				setTimeout(() => {
					elementBarKod?.focus();
				}, 200);
			}}
		/>
	</div>
{/if}
<FilterDialog bind:open={modal} on:select={handleModal} />

<!--
	<pre>
    {JSON.stringify(item, null, 2)}
</pre>
-->
<style>
	input:focus {
		background-color: yellow !important;
	}
	.div-toast {
		width: 100%;
		top: 100;
		left: 0;
		position: absolute;
		z-index: 100000;
	}
</style>
