const mstdn = require('megalodon')
const request = require('request')
const cfg = require('./config.json')
const Etherpad = require('etherpad-lite-client')
if (cfg.debug) {
	var fs = require('fs');
}

etherpad = Etherpad.connect({
	host: 'pad.cosine.online',
	apikey: cfg.etherpad_token,
	port: 443,
	ssl: true,
})
// don't need this being stolen
delete cfg.etherpad_token

const BASE_URL = "beeping.town"
const WS = new mstdn.default(
	cfg.access_token,
	`wss://${BASE_URL}/api/v1/`
)
const M = new mstdn.default(
	cfg.access_token,
	`https://${BASE_URL}/api/v1/`
)
delete cfg.access_token

function makePost(text, spoiler_text) {
	if (!cfg.debug) {
		try {
			M.post('statuses', { status: text, spoiler_text })
		} catch (e) {
			console.error("couldn't post")
		}
	}
}

function getProgram() {
	return new Promise((resolve, reject) => {
		if (cfg.debug) {
			fs.readFile('dummy-script.js', 'utf8', function(err, contents) {
				resolve(contents);
			});
		} else {
			let args = {
				padID: 'eval',
			}
			etherpad.getText(args, function(error, data) {
				if (error) {
					reject(error)
				}
				if (!data) {
					reject("Etherpad didn't error, but also didn't present data");
				}
				resolve(data.text)
			})
		}
	})
}

// Returns {interval, notification}
async function getEvaluated(then) {
	let program = await getProgram();
	try {
		eval(program)
	} catch (e) {
		evalError(e);
	}
	if (typeof interval == 'undefined' || typeof notification == 'undefined') {
		let errorMessage = 'required functions `interval` or `notification` not defined';
		console.error('Error:\n', errorMessage, '$')
		makePost(errorMessage)
	}
	return {interval, notification}
}

function evalError(e) {
	console.error('Error:')
	let stack = e.stack
	// parse the stack to get the actual error line. this removes the
	// garbage about the metaprogram and just gives the program
	let re = /<anonymous>:([0-9]+):([0-9]+)/
	let result = re.exec(stack)
	let errorMessage
	if (result) {
		let line = result[1]
		let col = result[2]
		errorMessage = `error at line ${line} col ${col}:
${e.message}`
	} else {
		errorMessage = stack
	}
	console.error('Error:\n', errorMessage, '$')
	makePost(errorMessage)
}

function update(noti) {
	getEvaluated().then(ev => {
		try {
			ev.notification(noti)
		} catch (e) {
			evalError(e)
		}
	})
}

let postInterval =
	1000 * // seconds
	60 * // minutes
	60 * // hours
	4 // how many hours
setInterval(() => {
	let time = new Date().getHours();
	if (time >= 8 || time == 0) {
		getEvaluated().then(ev => {
			try {
				ev.interval()
			} catch (e) {
				evalError(e)
			}
		})
	}
}, postInterval)
const listener = M.socket('streaming', 'user');
listener.on('notification', update);
listener.on('error', err => console.error(err));
// Run immediately if in debug mode
if (cfg.debug) {
	getEvaluated().then(ev => {
		try {
			ev.interval()
		} catch (e) {
			evalError(e)
		}
	})
}

