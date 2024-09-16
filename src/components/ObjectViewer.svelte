<script>
	import { fade, blur, fly, slide, scale } from 'svelte/transition';
	export let obj = {};
	$: keys = Object.keys(obj);
</script>

<table class="table table-responsive-md">
	<thead class="table-primary">
		<tr>
			<th>Key</th>
			<th>Value</th>
		</tr>
	</thead>
	<tbody>
		{#each keys as key}
			<tr transition:fade={{ duration: 300 }}>
				<td>{key}</td>
				{#if typeof obj[key] === 'object' && obj[key] !== null}
					<td><svelte:self obj={obj[key]} /></td>
				{:else}
					<td>{obj[key]}</td>
				{/if}
			</tr>
		{/each}
	</tbody>
</table>
