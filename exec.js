const Mastodon = require('mastodon')
const request = require('request')
const cfg = require('./config.json')
const Etherpad = require('etherpad-lite-client')

etherpad = Etherpad.connect({
	host: '173.199.118.103',
	apikey: cfg.etherpad_token,
	port: 9001,
	ssl: false,
})

const M = new Mastodon({
	access_token: cfg.access_token,
	api_url: 'https://beeping.town/api/v1/'
})

function makePost(text) {
	M.post('statuses', { status: text });
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
		let executed = eval(program)
		console.log(executed)
		makePost(executed)
	})
}

let interval =
	1000 * // seconds
	60 * // minutes
	60 * // hours
	3 * // 3 hours
	1 // end
setInterval(run, interval)

