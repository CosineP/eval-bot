// This is the template program replaced when cleared

// Editable script for @eval@beeping.town. LICENSE: AGPLv3
// If you wanna toot some text, add a function that returns [text, cw]
// and add its name to the hijinks list in getToot
// @ the bot with "go now" to run your stuff
// To test: F12, copy+paste all the code
// M is the mastodon-api instance
// Full source and more docs: https://github.com/CosineP/eval-bot

// Everything is in an async function so you can do `await`s without it tooting prematurely
async function getToot() {
  
    hijinks = [
        // To add a function with a random chance of running, add it here
    ];
    let toot = '';
    let cw = '';
    // Select 1 or 2 random hijinks
    for (let i=0; i<1+Math.floor(Math.random()*2); i++) {
        let f = hijinks.splice(Math.floor(Math.random()*hijinks.length), 1)[0];
        let [toot_plus, cw_plus] = await f();
        toot += toot_plus + '\n\n';
        cw += cw_plus;
    }
    toot += "program cleared!!\n\n"

    // To just add text every time, just add it to toot

    toot += `edit me at https://pad.cosine.online/p/eval`;

    return [toot, cw];

}

// hijinks
// i put most stuff in here, separately so they can be composed later
// each one should return [toot_text, cw] or a promise

// --- the required functions ---
// api is simply:
// - interval() is called every 6 hours
// - notification(noti) is called on notis, noti = masto api native noti

// Every 6 hours, the bot loads the script and runs interval()
function interval() {
    // Actually make the post
    // Note the entire API from the bot is available
    // makePost comes from there
    // https://github.com/CosineP/eval-bot/blob/master/exec.js
    getToot().then((text) => {
        console.log(`posting: cw ${text[1]}\n${text[0]}$`)
        makePost(text[0], text[1])
    })
}

// Whenever a notification comes in, the bot loads and runs notification()
function notification(noti) {
    if (noti.type == "mention" && noti.status) {
        if (noti.status.content
                && noti.status.content.includes('go now')) {
            // Go now if someone messages that
            console.log('recieved @ request to go now')
            interval()
        } else {
            // other stuff to do with notifications?
        }
    }
}

