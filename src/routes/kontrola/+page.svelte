<script>
	import Dokument from '../../components/Dokument.svelte';
	import ListaDokumenti from '../../components/ListaDokumenti.svelte';
	import { auth_guard } from '../../lib/auth_guard.js';

	auth_guard('/kontrola');
	let dokument = null;
	let magacin_id = 0;
	function handleDokumentSelect(event) {
		dokument = event.detail.item;
		//alert(JSON.stringify(dokument, null, 2));
	}
</script>

<svelte:head>
	<title>Контрола</title>
	<meta name="description" content="контрола на документи" />
</svelte:head>
{#if dokument}
	<Dokument {dokument} on:click={() => (dokument = null)} />
{:else}
	<ListaDokumenti bind:magacin_id={magacin_id} on:click={(evt) => handleDokumentSelect(evt)} />
{/if}
