// 4YouSee player controller v1.0.0  -  Sep 5nd, 2019
const request = require('request');

async function getSchedule() {
	const getSetings = function(data){
		return new Promise((resolve,reject)=>{
			request(data, function (error, response, body) {
				if (!error) {
					resolve(body);
				} else {
					reject(error);
				}
			}); 
		});
	}
	let settings = JSON.parse(await getSetings({
		//url: 'http://test.outcondigital.com:8048/getSetings4YouSee?pod='+pod,
		//http://localhost:8050/checkUploadsAds?token=1b176eb863b763a816adb42f459f763f
		url: 'http://localhost:8048/getSetings4YouSee?pod='+pod,
		method: 'GET'
	})).fourYouSeeScheduling;

	console.log(settings);
	let schedule = {
		monday:[],
		tuesday: [],
		wednesday: [],
		thursday: [],
		friday: [],
		saturday: [],
		sunday: []
	}
	for (i=0; i<settings.length; i++){
		let interval = Math.round((Math.abs(parseInt(settings[i].since) - parseInt(settings[i].until))*60)/settings[i].times);
		let since = Math.min(parseInt(settings[i].since), parseInt(settings[i].until))*60;
		for (c=0; c<settings[i].times; c++){
			schedule[settings[i].day.toLowerCase()].push(since+(interval*c));
		}
	}
	return (schedule);
}

async function play(){
	schedule = await getSchedule();
	let days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
	let date = new Date();
	let currentDay = days[ date.getDay() ];
	let now = 0;
	setInterval(function(){
		let date = new Date();
		now = (date.getHours()*60)+date.getMinutes();
		console.log('check at '+date.getHours()+':'+date.getMinutes())
		if (schedule[currentDay].indexOf(now) != -1) {
			console.log('*********** show ad ***********');
			//pedir ad
			//mostrarla
			//track
		}
	}, 60000);
}

play();
