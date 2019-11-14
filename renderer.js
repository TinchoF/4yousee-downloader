const remote = require('electron').remote;
const app = remote.app;
const appPath = app.getAppPath();
const fs = require('fs');
let path = appPath.replace("resources\\app.asar", '') //Windows
//let path = appPath.replace("resources/app", '') //linux
console.log(path)
let download = require('download-file');

async function downloadAd(ad){
	console.log(ad)
	let f = decodeURIComponent(ad.creatives[0].url).split('/')
	let ops = {
		directory: path+"/downloads/",
		filename: f[f.length-1]
	}
	const createFile = function(){
		return new Promise((resolve,reject)=>{
			download(ad.creatives[0].url, ops, async function(){});
		});
	}
	let file = await createFile();
	console.log(file)
}

async function clean(adsFiles){
	const read = function(){
		return new Promise((resolve,reject)=>{
			fs.readdir(path+"/downloads/", function (err, files) {
				if (err) {reject (err)} 
				resolve (files)
			});
		});
	}
	let files = await read()
	for (let i=0; i<files.length; i++){
		if (!adsFiles.includes(files[i])){ //si el archivo no está en las ads
			fs.unlink(path+"/downloads/"+files[i],function(error){if (error) console.log(error);}); //borra archivo
			console.log(path+"/downloads/"+files[i]+' deleted');
		}
	}
}

async function downloadContent(){
	let adsFiles = []
	let camp = JSON.parse(await fetch("http://test.outcondigital.com:8048/campaigns/available?publisher=5d794f57306ea430587143d2")//Publisher Otima
	//let camp = JSON.parse(await fetch("http://test.outcondigital.com:8048/campaigns/available?publisher=5d5d66f2306ea4114a37c7c2")//Publisher Outcon test

	.then(function(response) {
		return response.text();
	})
	.then(function(data) {
		return data;
	})
	.catch(function(err) {
		return err;
	}));

	for (let i=0; i<camp.length; i++){
		for (let adi = 0; adi<camp[i].ads.length; adi++){
			downloadAd(camp[i].ads[adi]);
			let f = decodeURIComponent(camp[i].ads[adi].creatives[0].url).split('/')
			adsFiles.push(f[f.length-1]);
		}
	}
	clean(adsFiles);
}
downloadContent()
setInterval(function(){
	downloadContent()
}, 3600000 );
