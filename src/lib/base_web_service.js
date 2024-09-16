import axios from 'axios';
import { user } from './user_store';
import { get } from 'svelte/store';
import config from './config';
//const IP = 'http://192.168.222.73';
//const APP_NAME = 'Bucim';
const URL_SQL_EXEC = `${config.IP}/${config.APP_NAME}/api/sql/exec`;
console.log(URL_SQL_EXEC);
function getAuthConfig() {
	const userValue = get(user);
	//console.log('auth_guard:', userValue);
	if (userValue.token) {
		return { headers: { Authorization: `Bearer ${userValue.token}` } };
	}
	return null;
}

export function postWithAuth(url, data) {
	return axios.post(url, data, getAuthConfig());
}

export function getWithAuth(url) {
	return axios.get(url, getAuthConfig());
}

export async function execSql(sql) {
	const execSqlModel = {
		isStoredProcedure: false,
		returnType: 2,
		sqlForExec: sql,
		parametars: {},
		outParametars: {}
	};
	//console.log("exexSqlModel", execSqlModel);
	try {
		const rez = await postWithAuth(URL_SQL_EXEC, execSqlModel);
		return rez.data;
	} catch (e) {
		console.error(e);
		throw e;
	}
}
export async function execSP(sp_name, parametars = {}, outParametars = {}) {
	const execSqlModel = {
		isStoredProcedure: true,
		returnType: 2,
		sqlForExec: sp_name,
		parametars,
		outParametars
	};
	//console.log("exexSqlModel", execSqlModel);
	try {
		const rez = await postWithAuth(URL_SQL_EXEC, execSqlModel);
		return rez;
	} catch (e) {
		console.error(e);
		throw e;
	}
}
