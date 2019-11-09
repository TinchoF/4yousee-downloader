const remote = require('electron').remote;
const app = remote.app;
const appPath = app.getAppPath();
let path = appPath.replace("resources\\app.asar", '')
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
async function downloadContent(){
	let camp = JSON.parse(await fetch("http://test.outcondigital.com:8048/campaigns/available?demo=true")
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
		}
	}
}
downloadContent()