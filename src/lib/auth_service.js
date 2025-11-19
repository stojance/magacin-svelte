import axios from 'axios';
import { env } from '$env/dynamic/public';
//import config from './config.js';

//const URL_LOGIN = `${config.IP}/${config.APP_NAME}/api/users/authenticatewithpin`;
const URL_LOGIN = `${env.PUBLIC_API_IP}/${env.PUBLIC_API_NAME}/api/users/authenticatewithpin`;
console.log(URL_LOGIN);

export async function login(pin) {
    //console.log('pin',pin);
	return await axios.post(URL_LOGIN, { 'Pin': pin });
}
