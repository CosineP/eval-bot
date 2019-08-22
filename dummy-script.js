// Editable script for @eval@beeping.town. LICENSE: AGPLv3
// @ the bot with "go now" to run your stuff
// To test: F12, copy+paste all the code
// M is the mastodon-api instance
// Full source and more docs: https://github.com/CosineP/eval-bot

// Why haven't you added YOUR SSH key yet?
//this is cool ilu
// do images work? :blobcatsurprised:
// like uploading them? probly, you've got the whole API

// Everything is in an async function so you can do `await`s without it tooting prematurely
async function getToot() {
  
    hijinks = [
        lottery,
        fib,
        favColor,
        phrases,
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

    // To just add text every time, just add it to toot

    toot += `edit me at https://pad.cosine.online/p/eval`;

    return [toot, cw];

}

// hijinks
// i put most stuff in here, separately so they can be composed later
// each one should return [toot_text, cw] or a promise

function lottery() {
    return new Promise((resolve, reject) => {
        let options = {'local': true}
        M.get('timelines/public', options, function(err, data) {
            if (err) reject(err)
            let status;
            for (let i=0; i<100; i++) {
                if (Math.random() < 0.2) {
                    status = data[i];
                    break;
                }
            }
            let acct = status.account.acct //why is this always cubeglobe?
            let string = `\ntoday's bot of the day is @${acct}!\ncongrats!\n`
            resolve([string, ''])
        })
    })
}

function fib() {
    fib = (n) => {
        var [a, b] = [1, 1];
        for (let i = 1; i < n; i++) {
            [a, b] = [b, a+b]
        }
        return a
    }
    return [`fibbonacci sequence at 100 = ${fib(101)}\n`, '']
}

function favColor() {
    return ["tell me about your favorite color", '']
}

function phrases() {
    // oh my lord i adore this
    // this feels a bit raw for uncwed?
    var rs=(...x)=>x[Math.floor(Math.random()*x.length)];

    let text = rs(
    "Please, "+rs("let me die","I can't live anymore","I don't want to live anymore","just end my life already")+".",
    "I'm "+rs("scared","afraid","frightened","sad"+rs(""," and lonely"),"crying","starving","tired","in tears","all alone")+".",
    "What if "+rs("they're going to","they'll soon")+" kill me?",
    "What if "+rs("it never gets better","it's only a matter of time","we're all alone")+"?",
    rs("Where will I","I wonder where "+rs("I'll","will I","would I"))+" be"+rs(" in the future?","?"),
    rs("Do I have a purpose in","Is there a meaning to","What is","Why am I here in this","Why is there")+" life?",
    "Who's reading this?"+rs(""," Stop it."," Quit it now!")+rs("",""," ... Baka."),
    "Do you "+rs("like","love","want"+rs(""," to "+rs("shoot","kill","punch")))+" me?",
    rs("You","Do you")+" think I'm funny"+rs(""," or something"," and hilarious")+"?",
    "Could you "+rs("help","please help","hug","save")+" me?",
    rs("Are you","Is someone","Are they","Who's","Why are you","Who'd be")+" watching me?",
    "Am I "+rs("under surveillance","a bad person","a mistake","a worthless individual","completely pointless","disgusting","drowning","falling in love")+"?",
    "Would you "+rs(
    rs("burn my house down","set my house on fire"),
    "watch me die",
    "torture me",
    "hang me",
    rs("record me",rs("set a camera","record me")+" in the "+rs("toilet room","bathroom")),
    rs("rip","gouge")+" my eyes out",
    "throw away my mobile phone"+rs(""," in the "+rs("toilet","trash"),"out of the window"),"dox me","stab me with a knife"+rs(""," "+rs("several","multiple")+" times","more than once"),
    "take away "+rs("","all of ")+"my "+rs("clothes","things"),
    "lock me inside a room",
    "call me "+rs("a loser","an idiot","ignorant","stupid","ugly"),
    "erase my memories"
    )+"?"
    );

    return [text, "dark"]
}

// --- the required functions ---

// Every 6 hours, the bot loads the script and runs interval()
function interval() {
    // Actually make the post
    // Note the entire API from the bot is available
    // makePost comes from there
    // https://github.com/CosineP/eval-bot/blob/master/exec.js
    getToot().then((text) => {
        console.log(text[1], text[0])
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
            // Boost replies, for fun!
            M.post(`statuses/${noti.status.id}/reblog`);
        }
    }
}

