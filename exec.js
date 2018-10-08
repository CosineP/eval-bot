const Mastodon = require('mastodon')
const request = require('request')
const cfg = require('./config.json')
const Etherpad = require('etherpad-lite-client')

etherpad = Etherpad.connect({
	host: 'pad.cosine.online',
	apikey: cfg.etherpad_token,
	port: 80,
	ssl: true,
})

const M = new Mastodon({
	access_token: cfg.access_token,
	api_url: 'https://beeping.town/api/v1/'
})

function makePost(text) {
	M.post('statuses', { status: text })
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
			toToot = e.message
		}
		console.log('Tooting:\n', toToot, '$')
		makePost(toToot)
	})
}

function checkNotis() {
	M.get('notifications', function(error, data) {
		if (error) {
			throw error
		}
		for (noti of data) {
			if (noti.status
					&& noti.status.content
					&& noti.status.content.includes('go now')) {
				console.log('recieved @ request to go now')
				run()
			}
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
checkNotis(); // This should be done immediately either way

