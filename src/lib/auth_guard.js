import { user } from "./user_store";
import { goto } from "$app/navigation";
import { get } from 'svelte/store';

export function auth_guard(returnUrl) {
    const userValue = get(user);
    //console.log('auth_guard:', userValue);
    if (!userValue.token) {
        if(returnUrl){
            goto(`/login?returnUrl=${returnUrl}`);
        }else{
            goto('/login');
        }
    }
};  