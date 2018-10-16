const Mastodon = require('mastodon')
const request = require('request')
const cfg = require('./config.json')
const Etherpad = require('etherpad-lite-client')

etherpad = Etherpad.connect({
	host: 'pad.cosine.online',
	apikey: cfg.etherpad_token,
	port: 443,
	ssl: true,
})

const M = new Mastodon({
	access_token: cfg.access_token,
	api_url: 'https://beeping.town/api/v1/'
})

var ownAccount;
M.get('accounts/verify_credentials', function(err, data) {
	if (error) {
		throw error
	}
	ownAccount = data.acct
});

function makePost(text) {
	if (!cfg.debug) {
		M.post('statuses', { status: text })
	}
}

function getProgram() {
	return new Promise((resolve, reject) => {
		let args = {
			padID: 'eval',
		}
		etherpad.getText(args, function(error, data) {
			if (error) {
				reject(error)
			}
			resolve(data.text)
		})
	})
}

function run() {
	getProgram().then((program) => {
		let toToot
		try {
			toToot = eval(program)
		} catch (e) {
			console.log('Error:')
			let stack = e.stack
			// parse the stack to get the actual error line. this removes the
			// garbage about the metaprogram and just gives the program
			let re = /<anonymous>:([0-9]+):([0-9]+)/
			let result = re.exec(stack)
			if (result) {
				let line = result[1]
				let col = result[2]
				toToot = `error at line ${line} col ${col}:
	${e.message}`
			} else {
				toToot = `error: ${stack}`
			}
		}
		if (toToot) {
			console.log('Tooting:\n', toToot, '$')
			makePost(toToot)
		}
	})
}

function checkNotis() {
	M.get('notifications', function(error, data) {
		if (error) {
			throw error
		}
		for (noti of data) {
			if (noti.account.acct !== ownAcct
			    && noti.status
			    && noti.status.content
			    && noti.status.content.includes('go now')) {
				console.log('recieved @ request to go now')
				run()
			}
			// This prevents us from reading the same noti over and over
			M.post('notifications/dismiss', {id: noti.id})
		}
	})
}

let interval =
	1000 * // seconds
	60 * // minutes
	60 * // hours
	3 * // 3 hours
	1 // end
setInterval(run, interval)
interval =
	1000 * // seconds
	60 * // 60 seconds
	1 // end
setInterval(checkNotis, interval)
if (cfg.debug) {
	run()
}
