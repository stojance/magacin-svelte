<script>
	import {
		Button,
		Spinner,
		Card,
		Badge,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader
	} from '@sveltestrap/sveltestrap';
	import {
		MT_loadArtikalBarKod,
		MT_LoadIzleziNeKontrolirani,
		MT_saveInsIzlezKontrola
	} from '../lib/bucim_web_service.js';
	import { blur } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let dokument = null;
	let listaStavki = [];
	let isLoading = false;
	let error = '';
	let bkElement;
	let barKod = '';
	let stavka = null;
	let open = false;
	let elementButtonProdolzi;
	let kbModeNone = true;

	const toggle = () => {
		open = !open;
		barKod = '';
	};

	export async function loadStavki(dokument) {
		listaStavki = [];
		error = '';
		isLoading = true;
		try {
			const res = await MT_LoadIzleziNeKontrolirani(
				dokument.magacin_ID,
				dokument.vd,
				dokument.brDok
			);
			//console.log(res);
			if (res && res.data) {
				listaStavki = res.data.data || [];
			}
		} catch (e) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	}

	async function kontroliraj(bk) {
		try {
			isLoading = true;
			error = '';
			open = false;
			barKod = bk;
			if (barKod && barKod.length > 0) {
				await MT_saveInsIzlezKontrola(dokument.magacin_ID, dokument.vd, dokument.brDok, barKod);
				barKod = '';
				stavka = null;
			}
			await loadStavki(dokument);
		} catch (e) {
			error = e.message;
		} finally {
			isLoading = false;
			bkElement?.focus();
			bkElement?.select();
		}
	}

	async function handleBKChange(event) {
		barKod = event.target.value;
		stavka = null;
		let artikal_id = 0;
		error = '';
		try {
			isLoading = true;
			if (barKod && barKod.length > 0) {
				const res = await MT_loadArtikalBarKod(barKod);
				if (res && res.data) {
					artikal_id = parseInt(res.data.outParametars['@Artikal_IDout']);
					if (artikal_id == 0) {
						error = 'Артикал со таков баркод не постои !';
						bkElement?.select();
						setTimeout(() => elementButtonProdolzi?.focus(), 200);
					} else {
						stavka = listaStavki.filter((iterator) => iterator.artikal_ID == artikal_id)[0] || null;
						if (!stavka) {
							error = 'Артикал не е најден во документот !';
							artikal_id = 0;
							barKod = '';
							stavka = null;
							setTimeout(() => elementButtonProdolzi?.focus(), 200);
						}
					}
				}
			}
			if (artikal_id > 0) {
				open = true;
			}
		} catch (e) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		bkElement?.focus();
	});

	$: loadStavki(dokument);
	$: brojNaStavki = listaStavki?.length || 0;
	$: brojKontroliarani =
		listaStavki?.length > 0
			? listaStavki?.filter((iterator) => iterator.statusKontrola > 0)?.length
			: 0;
	$: color = brojKontroliarani == brojNaStavki ? 'success' : 'danger';
</script>

{#if dokument}
	<div class="main">
		<div class="header">
			<Card body on:click style="cursor: pointer; padding: 5px;">
				<div class="row g-0">
					<div class="col-10 col-sm-10"><b>{dokument.magacinNaziv}</b></div>
					<div class="col-2 col-sm-2 h5 text-end">
						<Badge pill {color}>{brojKontroliarani}/{brojNaStavki}</Badge>
					</div>
					<div class="col-7 col-sm-7"><b>{dokument.vdNaziv}</b>, број: <b>{dokument.brDok}</b></div>
					<!--<div class="col-3 col-sm-3 text-end"><b>{dokument.brDok}</b></div>-->
					<div class="col-5 col-sm-5 text-end"><b>{dokument.datumPrikaz}</b></div>

					<div class="col-7 col-sm-7" style="font-size: small;">{dokument.firmaNaziv}</div>
					<div class="col-5 col-sm-5 text-end" style="font-size: small;">{dokument.korisnik}</div>
				</div>
			</Card>
		</div>
		<div class="barKod input-group">
			<button
				class="btn input-group-text"
				class:btn-info={kbModeNone}
				class:btn-success={!kbModeNone}
				on:click={() => {
					kbModeNone = !kbModeNone;
					bkElement?.focus();
				}}
			>
				<i class="bi bi-keyboard"></i>
			</button>
			<input
				type="text"
				class="form-control text-center"
				bind:this={bkElement}
				placeholder="скенирај баркод"
				value={barKod}
				on:change={handleBKChange}
				inputmode={kbModeNone ? 'none' : null}
				required
			/>
		</div>
		<div class="stavki container">
			{#if error && !isLoading}
				<div class="row-col-12 text-danger text-center h4 mt-0">
					{error}
					<br />
					<Button
						color="info"
						bind:inner={elementButtonProdolzi}
						on:click={() => {
							error = '';
							isLoading = false;
							barKod = '';
							setTimeout(() => bkElement?.focus(), 200);
						}}
					>
						Продолжи
					</Button>
				</div>
			{:else if isLoading}
				<div class="row-col-12 text-center mt-5">
					<Spinner type="grow" color="primary" />
				</div>
			{:else if listaStavki && listaStavki.length > 0}
				<ul>
					{#each listaStavki as item, index (item)}
						<li transition:blur>
							<div class="row g-2">
								<div class="col-12 col-sm-12">
									<Card
										body
										style="background-color:{item.statusKontrola > 0
											? 'lightgreen'
											: 'whitesmoke'}; padding: 5px;"
										on:click={() => bkElement?.focus()}
									>
										<div class="row g-0">
											<div class="col-12 col-sm-12">
												{item.artikal_ID}
												{#if item.pcode.length > 1}
													&nbsp;&nbsp;(<b>{item.pcode}</b>)
												{/if}
											</div>
											<div class="col-8 col-sm-8"><b>{item.artikalNaziv}</b></div>
											<div class="col-4 col-sm-4 text-end">Кол: <b>{item.kolicina}</b></div>
										</div>
									</Card>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			{:else}
				<div class="text-center h5 mt-4 text-gray-400">Нема ставки за контрола</div>
			{/if}
		</div>
	</div>
{/if}
<Modal isOpen={open} {toggle}>
	<ModalHeader {toggle}>Потврди за артикал</ModalHeader>
	<ModalBody>
		<div class="container">
			<div class="row g-1">
				<div class="col-12 col-sm-12 h4">
					{stavka.artikal_ID}
					{#if stavka.pcode.length > 1}
						(<b>{stavka.pcode}</b>)
					{/if}
				</div>
				<div class="col-8 col-sm-8 h4"><b>{stavka.artikalNaziv}</b></div>
				<div class="col-4 col-sm-4 h4 text-end">Кол: <b>{stavka.kolicina}</b></div>
			</div>
		</div>
	</ModalBody>
	<ModalFooter>
		<Button color="success" on:click={() => kontroliraj(barKod)}>Потврди</Button>
		<Button
			color="secondary"
			on:click={() => {
				error = '';
				barKod = '';
				stavka = null;
				open = false;
			}}
		>
			Откажи
		</Button>
	</ModalFooter>
</Modal>

<style>
	li {
		list-style: none;
		margin-bottom: 5px;
	}
	ul {
		padding: 5px 0;
	}
	div.main {
		height: 85vh;
	}
	div.header {
		margin-top: 4px;
		height: 100px;
		overflow-y: auto;
		font-size: small;
	}
	div.barKod {
		height: 45px;
		margin-bottom: 2px;
		margin-top: 2px;
		padding: 2px;
	}

	div.stavki {
		height: 70%;
		overflow-y: auto;
		font-size: small;
		margin: 0;
		padding: 5px;
	}

	input:focus {
		background-color: yellow !important;
	}
	b {
		color: darkblue !important;
	}
</style>
