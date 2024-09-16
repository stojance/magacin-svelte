<script>
	import {
		Button,
		Toast,
		Spinner,
		Card,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader
	} from '@sveltestrap/sveltestrap';
	import { MT_loadBarKod, MT_saveDelBarKod } from '../lib/bucim_web_service.js';
	import { fade, blur } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let artikal_id = 0;
	let listaBK = [];
	let isLoading = false;
	let error = '';
	let open = false;
	let barKod = '';

	const toggle = () => {
		open = !open;
		barKod = '';
	};

	export async function loadBK(a_id) {
		listaBK = [];
		barKod = '';
		error = '';
		if (a_id > 0) {
			isLoading = true;
			try {
				const res = await MT_loadBarKod(a_id);
				//console.log(res);
				if (res && res.data) {
					listaBK = res.data.data || [];
				}
			} catch (e) {
				error = e.message;
			} finally {
				isLoading = false;
			}
		}
	}

	async function deleteBK() {
		isLoading = true;
		error = '';
		try {
			const res = await MT_saveDelBarKod(barKod);
			await loadBK(artikal_id);
			open = false;
			barKod = '';
			dispatch('delete');
		} catch (e) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	}

	$: loadBK(artikal_id);
</script>

<div class="container">
	{#if error && !isLoading}
		<div class="text-danger text-center h3">{error}</div>
	{/if}
	{#if isLoading}
		<Spinner type="grow" color="primary" class="text-center" />
	{:else if listaBK && listaBK.length > 0}
		<ul>
			{#each listaBK as item (item.barKod)}
				<li transition:blur>
					<div class="row g-2" style="width: 95%;">
						<div class="col-11 col-sm-11 pl-0 pr-1 pt-0 pb-0">
							<Card body class="text-center">{item.barKod}</Card>
						</div>
						<div class="col-1 col-sm-1 p-0">
							<Button
								class="mt-1 ml-0 mr-2"
								size="lg"
								variant="raised"
								color="danger"
								on:click={() => {
									barKod = item.barKod;
									open = true;
								}}
							>
								<i class="bi bi-trash"></i>
							</Button>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="text-center h5 mt-4 text-gray-400">Нема баркодови за овој артикал</div>
	{/if}

	<Modal isOpen={open} {toggle}>
		<ModalHeader {toggle}>Бришење</ModalHeader>
		<ModalBody>
			<div class="h4">Се брише баркодот:</div>
			<div class="h3 text-center"><b>{barKod}</b></div>
		</ModalBody>
		<ModalFooter>
			<Button color="danger" on:click={() => deleteBK()}>Потврди</Button>
			<Button
				color="secondary"
				on:click={() => {
					barKod = '';
					open = false;
				}}
			>
				Откажи
			</Button>
		</ModalFooter>
	</Modal>
</div>

<style>
	li {
		list-style: none;
		margin-bottom: 5px;
	}
	ul {
		padding: 5px 0;
	}
</style>
