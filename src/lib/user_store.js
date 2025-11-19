import { writable } from 'svelte/store';
import { goto } from '$app/navigation';

let obj = {
	id: 0,
	firstName: '',
	token: ''
};

obj = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : obj;

let _user = writable(obj);

function login(u) {
	_user.set(u);
	localStorage.setItem('user', JSON.stringify(u));
	//console.log('user_store:', u);
}

function logout() {
	_user.set({
		id: 0,
		firstName: '',
		token: ''
	});
	localStorage.removeItem('user');
	goto('/login');
}

export const user = {
	subscribe: _user.subscribe,
	login,
	logout
};
