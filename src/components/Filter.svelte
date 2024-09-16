<script>
	import { Web_loadArtikli } from '../lib/bucim_web_service.js';
	import { createEventDispatcher, onMount } from 'svelte';
	import {
		Button,
		Input,
		InputGroup,
		InputGroupText,
		Spinner,
		Card
	} from '@sveltestrap/sveltestrap';
	import VirtualScroll from 'svelte-virtual-scroll-list';

	const dispatch = createEventDispatcher();
	let dataList = [];
	let filteretList = [];
	let isLoading = false;
	let error = '';
	let filterText = '';
	let id = 0;
	let filterElement;
	let virtualListElement;

	function handleFilter() {
		filteretList =
			dataList?.filter(
				(item) =>
					item.naziv.toLowerCase().includes(filterText.toLowerCase()) ||
					item.pcode.toLowerCase().includes(filterText.toLowerCase()) ||
					item.sifraID.toString().toLowerCase().includes(filterText.toLowerCase())
			) || [];
		//console.log('filteretList',filteretList?.length);
		virtualListElement?.scrollToIndex(0);
	}

	async function loadData() {
		error = '';
		dataList = null;
		isLoading = true;
		try {
			const res = await Web_loadArtikli();
			//console.log(res);
			dataList = res?.data?.data;
			//console.log(dataList);
			filteretList = [...dataList];
		} catch (e) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	}

	function handleSelectItem(item) {
		id = item.sifraID;
		dispatch('select', { item });
	}

	onMount(async () => {
		await loadData();
	});
</script>

<div class="filter-header">
	<InputGroup>
		<Input
			placeholder="Барај..."
			bind:value={filterText}
			on:input={handleFilter}
			bind:inner={filterElement}
		/>
		<InputGroupText style="cursor:pointer; padding:0;">
			<Button
				color="light"
				size="sm"
				style="height: 100%; width: 40px;"
				on:click={() => {
					id = 0;
					filterText = '';
					filterElement?.focus();
					filteretList = [...dataList];
					virtualListElement?.scrollToIndex(0);
					dispatch('selected', { item: {} });
				}}
			>
				X
			</Button>
		</InputGroupText>
	</InputGroup>
</div>
<div class="filter-stavki">
	{#if isLoading}
		<p class="text-center"><Spinner type="grow" color="primary" /></p>
	{/if}
	{#if error}
		<p class="text-center text-danger h5">{error}</p>
	{/if}
	{#if filteretList}
		<VirtualScroll data={filteretList} let:data={item} key="sifraID" bind:this={virtualListElement}>
			<Card
				body
				on:click={() => handleSelectItem(item)}
				style="cursor: pointer; margin-bottom: 2px; padding: 5px; {id === item.sifraID
					? 'border: 2px solid black;'
					: null}"
			>
				<div class="row g-0" style="font-size: small;">
					<div class="col-12 col-sm-12 ">
						{item.sifraID}
						{#if item.pcode.length > 1}
							&nbsp;&nbsp;(<b>{item.pcode}</b>)
						{/if}
					</div>
					<div class="col-12 col-sm-12"><b>{item.naziv}</b></div>
				</div>
			</Card>
		</VirtualScroll>
	{/if}
</div>

<style>
	.filter-header {
		margin-top: 0px;
		margin-bottom: 5px;
	}
	.filter-stavki {
		min-height: 250px;
		height: 55vh;/*calc(100vh - 18em);*/
		overflow-y: auto;
		width: 100%;
	}
</style>
