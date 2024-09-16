<script>
	import { user } from '../lib/user_store.js';
    import {Button, NavLink} from '@sveltestrap/sveltestrap';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleLogout() {
		user.logout();
        dispatch('click');
    }

</script>

{#if $user.token == ''}
	<NavLink href="/login" on:click>Login</NavLink>
{:else}
	<Button color="light" on:click={handleLogout}>{$user.firstName}</Button>
{/if}
