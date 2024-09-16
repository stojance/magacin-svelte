<script>
	import Filter from './Filter.svelte';
	import { createEventDispatcher } from 'svelte';
	import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from '@sveltestrap/sveltestrap';

	const dispatch = createEventDispatcher();
	export let open = false;
	export let fullscreen = undefined;
	export let selectedItem = null;

	const toggle = () => {
		fullscreen = undefined;
		open = !open;
	};

	const handleSelect = (event) => {
		selectedItem = event.detail.item;
	};

	const OK = () => {
		dispatch('select', { item: selectedItem });
		fullscreen = undefined;
		open = false;
	};

	const Cancel = () => {
		selectedItem = null;
		OK();
	};
</script>

<Modal isOpen={open} {toggle} {fullscreen}>
	<ModalHeader {toggle}>Артикли{selectedItem ? ` (${selectedItem.sifraID})` : ''}</ModalHeader>
	<ModalBody>
		<Filter on:select={handleSelect} />
	</ModalBody>
	<ModalFooter>
		<Button color="primary" on:click={OK}>Потврди</Button>
		<Button color="secondary" on:click={Cancel}>Откажи</Button>
	</ModalFooter>
</Modal>
