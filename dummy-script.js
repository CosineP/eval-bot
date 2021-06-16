// Editable script for @eval@beeping.town. LICENSE: AGPLv3
// Running Node.js v16.3.0

// Bot runner source: https://github.com/CosineP/eval-bot
// Identifiers inherited from runner:
// M: the megalodon authenticated client: https://github.com/h3poteto/megalodon/tree/2.1.1
// request: npm module: https://github.com/request/request/tree/v2.88.0
// Etherpad: npm module: https://github.com/tomassedovic/etherpad-lite-client-js/tree/v0.9.0
// makePost: simple post. (text: string, spoiler_text: string) => void
// getProgram: contents of this document. () => Promise<string>

// Runner expects:
// interval: called regularly. () => void
// notification: called on notification received. (noti: Masto.Notification) => void
// noti has this type: https://docs.joinmastodon.org/entities/notification/

// every 4 hours the script is evaluated, and in the returned context,
// `interval()` is called with no arguments
function interval() {
    makePost('this is an example script', 'open for explanation');
}

// every time a notification is received the script is evaluated, and in the
// returned context, `notification(noti)` is called, where noti is the received
// notification (https://docs.joinmastodon.org/entities/notification/)
function notification(noti) {
    makePost(`this is an example script, ${noti.account.acct}`, 'this is a content warning');
}
