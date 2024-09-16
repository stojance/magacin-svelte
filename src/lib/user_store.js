import { writable } from 'svelte/store';
import { goto } from '$app/navigation';

const obj = {
	id: 0,
	firstName: '',
	token: ''
};

let _user = writable(obj);

function login(u) {
	_user.set(u);
	//console.log('user_store:', u);
}

function logout() {
	_user.set(obj);
	goto('/login');
}

export const user = {
	subscribe: _user.subscribe,
	login,
	logout
};
