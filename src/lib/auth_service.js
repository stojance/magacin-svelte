import axios from 'axios';
import config from './config.js';

const URL_LOGIN = `${config.IP}/${config.APP_NAME}/api/users/authenticatewithpin`;
console.log(URL_LOGIN);
export async function login(pin) {
    //console.log('pin',pin);
	return await axios.post(URL_LOGIN, { 'Pin': pin });
}

