import { execSP } from './base_web_service';
import { user } from './user_store';
import { get } from 'svelte/store';

const DB_NAME = 'Bucim';

export async function MT_loadBarKod(artikal_id, barKod = '') {
	return await execSP(`Maticni_${DB_NAME}..MT_loadBarKod`, {
		'@Artikal_ID': artikal_id,
		'@Barkod': barKod
	});
}

export async function MT_saveInsBarKod(barKod, artikal_id) {
	return await execSP(`Maticni_${DB_NAME}..MT_saveInsBarKod`, {
		'@BarKod': barKod,
		'@Artikal_ID': artikal_id,
		'@KolicinaKonvertirana': 0,
		'@KolicinaKom': 0,
		'@kolicina': 0,
		'@Status': 0
	});
}

export async function MT_saveDelBarKod(barKod) {
	return await execSP(`Maticni_${DB_NAME}..MT_saveDelBarKod`, {
		'@BarKod': barKod
	});
}

export async function MT_loadArtikalBarKod(barKod) {
	return await execSP(`Maticni_${DB_NAME}..Web_loadArtikalBarKod`, {
		'@BarKod': barKod
	},{
        "@Artikal_IDout": 0
    });
}

export async function MT_loadArtikli(artikal_id = 0) {
	return await execSP(`Maticni_${DB_NAME}..MT_loadArtikli`, {
		'@Artikal_ID': artikal_id
	});
}

export async function Web_loadArtikli() {
	return await execSP(`Maticni_${DB_NAME}..Web_loadArtikli`);
}

export async function MT_loadMagacini(magacin_id = 0, komisioni=-1) {
	return await execSP(`Maticni_${DB_NAME}..MT_loadMagacini`, {
		'@Magacin_ID': magacin_id,
		'@Komisioni': komisioni
	});
}

export async function MT_LoadIzleziNeKontrolirani(magacin_id, vd, brDok, godina = 0) {
	if(godina==0){
		godina = new Date().getFullYear();
	}
	return await execSP(`Mat${godina}_${DB_NAME}..MT_LoadIzleziNeKontrolirani`, {
		'@Magacin_ID': magacin_id,
		'@Vd': vd,
		'@BrDok': brDok
	});
}

export async function MT_saveInsIzlezKontrola(magacin_id, vd, brDok, barCode, godina= 0) {
	if(godina==0){
		godina = new Date().getFullYear();
	}
	const userValue = get(user);
	return await execSP(`Mat${godina}_${DB_NAME}..MT_saveInsIzlezKontrola`, {
		'@Magacin_ID': magacin_id,
		'@Vd': vd,
		'@BrDok': brDok,
		'@BarCode': barCode,
		'@Korisnik': userValue?.username || 'webUser'
	});
}

export async function PL_saveInsIzlezKontrola(magacin_id, vd, brDok, barCode) {
	const userValue = get(user);
	return await execSP(`Plan_${DB_NAME}..PL_saveInsIzlezKontrola`, {
		'@Magacin_ID': magacin_id,
		'@Vd': vd,
		'@BrDok': brDok,
		'@BarCode': barCode,
		'@Korisnik': userValue?.username || 'webUser'
	});
}