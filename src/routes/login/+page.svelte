<script>
	import { user } from '../../lib/user_store.js';
	import { login } from '../../lib/auth_service.js';
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { Button, Input, FormGroup, Spinner } from '@sveltestrap/sveltestrap';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let pin = field('pin', '', [required()]);
	let pinElement = undefined;
	//$pin.value = '';
	const myForm = form(pin);

	let error = '';
	let isLoading = false;

	const handleLogin = async () => {
		if (!$myForm.valid || !$pin.value) {
			if (pinElement) {
				pinElement.focus();
			}
			return;
		}
		try {
			error = '';
			isLoading = true;
			const res = await login($pin.value);
			if (res && res.data && res.data.token != null) {
				//console.log(res);
				//user = res.data;
				user.login(res.data);
				if ($page.url.searchParams.has('returnUrl')) {
					goto($page.url.searchParams.get('returnUrl'));
				} else {
					goto('/');
				}
			} else {
				error = 'Invalid PIN';
			}
		} catch (e) {
			//error = e.message;
			error = 'Invalid PIN';
		} finally {
			isLoading = false;
			if(error){
				if (pinElement) {
					pinElement.focus();
					pinElement.select(); // select the entire input field when an error occurs.  This is only done once.  If the input field is already selected, this will do nothing.  If you want to always select the input field, you could remove this condition.  But for this example, I want to showcase the selection functionality.  If you want to select the input field on page load, you would remove the condition.  Selection is a browser-specific feature and may not
				}
			}
		}
	};
	const handleReset = () => {
		$pin.value = '';
		error = '';
		if (pinElement) {
			pinElement.focus(); // focus on input field when page loads for the first time.  This is only done once.  If the input field is already focused, this will do nothing.  If you want to always focus on the input field, you could remove this condition.  But for this example, I want to showcase the focus functionality.  If you want to focus on the input field on page load, you would remove the condition.  Focus is a browser-specific feature and may not work in all browsers.  For a more robust solution, you might want to use a library like `svelte-use-focus` or `svelte-input-focus`.  They both provide hooks for focusing on input fields.  They also provide other useful features like preventing form submission on enter.  Please note that the focus functionality here is just to showcase how to focus on the input field.  If you want to focus on the input field on page load
		}
	};

	onMount(() => {
		if (pinElement) {
			pinElement.focus(); // focus on input field when page loads for the first time.  This is only done once.  If the input field is already focused, this will do nothing.  If you want to always focus on the input field, you could remove this condition.  But for this example, I want to showcase the focus functionality.  If you want to focus on the input field on page load, you would remove the condition.  Focus is a browser-specific feature and may not work in all browsers.  For a more robust solution, you might want to use a library like `svelte-use-focus` or `svelte-input-focus`.  They both provide hooks for focusing on input fields.  They also provide other useful features like preventing form submission on enter.  Please note that the focus functionality here is just to showcase how to focus on the input field.  If you want to focus on the input field on page load
		}
	});
</script>

<svelte:head>
	<title>Најава</title>
</svelte:head>
<div class="center bg-white" style="margin-top: 150px;">
	<h3 style="margin-bottom: 15px;" class="text-center">Најава</h3>
	<form on:submit|preventDefault={handleLogin}>
		<FormGroup floating label="PIN">
			<Input
				class="text-center"
				type="password"
				bind:value={$pin.value}
				bind:inner={pinElement}
				placeholder="PIN"
				invalid={$myForm.hasError('pin.required')}
			/>
			<!--<p class={$myForm.hasError('username.required') ? 'invalid' : 'hidden'}>*</p>-->
		</FormGroup>

		<FormGroup style="margin-top:20px;">
			<Button color="primary" disabled={!$myForm.valid} type="submit">Најава</Button>
			<Button type="reset" on:click={handleReset} color="secondary" style="float: right;">Откажи</Button>
		</FormGroup>
	</form>
</div>
<br />
{#if isLoading}
	<p class="text-center"><Spinner type="grow" color="primary" /></p>
{/if}
{#if error}
	<p class="text-center text-danger h3">{error}</p>
{/if}

<style>
	.center {
		display: flex;
		flex-direction: column;
		margin: auto;
		width: 300px;
		border: 1px solid lightgray;
		padding: 20px;
		margin-top: 30px;
		box-shadow: 1px 1px lightgrey;
	}
</style>
