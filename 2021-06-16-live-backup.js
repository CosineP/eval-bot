// Editable script for @eval@beeping.town. LICENSE: AGPLv3
// Running Node.js v16.3.0 
// @ the bot with "go now" to run getToot normally, choosing a random hijink and posting it top-level
// DM the bot with "test BLAH" to test the hijink named BLAH

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

// your hijink function may return any of the following (pick your favorite):
// - [<text>, <cw>]
// - {text: <text>}
// - {text: <text>, cw: <cw>}
// - <text>
// if null is returned or an error is thrown, another hijink will be tried
// a Promise may also be returned, resolving to any of the above forms
// the easiest way to return a Promise is by making your function async

// >>> UTILITIES <<<
// More utilities at bottom!! Hopefully new (one-off?) utilities go there as well

// nextInt: Returns an integer from 0 to bound, exclusive.
// e.g. nextInt(4) can return 0, 1, 2, or 3
function nextInt(bound) {
    return (Math.random()*bound)|0;
}

// choice: Returns a random value from the passed-in arguments.
// Any array arguments will be exploded and chosen from individually.
function choice() {
    let exploded = [];
    let args = Array.prototype.slice.call(arguments);
    args.forEach(e => {
        if (Array.isArray(e)) {
            e.forEach(e => exploded.push(e));
        } else {
            exploded.push(e);
        }
    });
    if (exploded.length === 0) return null;
    return exploded[nextInt(exploded.length)];
}

// wide_text: Convert a string to wide characters
function wide_text(text) {
    return Array.from(text).map(c => WIDE_TEXT[c]).join('');
}

// mReply(noti, {text: string, cw?: string, direct?: boolean})
//   reply to a post; copies parent CW (plus cw if present); when direct is missing, parent visibility)
//   implemented in UTILITIES REDUX at bottom

// >>> NOTI HIJINKS <<<

// Based heavily on HIJINKS (directly below, probably what you want for a standard tracery style bot or otherwise!!
// TO ADD A NOTI HIJINK:
// function obligatoryName(noti) {
//     [do stuff]
// },
// Don't forget trailing comma!
// Just does side effects and that's it. async is fine.
// Surely the mReply utility (documented above) is very useful here
// switched to use an array like hijinks, no reason to be inconsistent
// i guess i envisioned being able to do .myFunc without filter() stuff especially if we add a syntax to test like we have for Hijinks, but i can see the value of consistency!
const notiHijinks = [

// Boost replies, for fun!
function boostPost(noti) {
    M.post(`statuses/${noti.status.id}/reblog`);
},
// Your mom jokes are the peak of comedy
function yourMom(noti) {
    // Very poor attempt at getting text of toot
    const text = noti.status.content.replace(/<[^>]*>/g, '');
    // Very poor attempt at cutting off subject
    const objectless = text.slice(text.indexOf(' ', 3) + 1);
    const final = `Your MOM ${objectless}!!! :PPPP`
    mReply(noti, {text: final});
},

];

// >>> HIJINKS <<<
// TO ADD A HIJINK: pick somewhere after a comma below, and add this:
// function myName() {
//    return <a value>;
// },
// The value you return is detailed at the top (Line 18)
// Don't forget the comma!
// note: these functions have names, but since they're defined within an array, they cannot be referred to by that name!
// the only way to make use of that name is by retrieving it off the function by e.g. hijinks[0].name
// attempting to do "sharks()", for example, will raise a TypeError

const hijinks = [

function WaterDrinkers() {
    return choice(
        "might fuck around and #drink some #water",
        "never get between a #WaterDrinker and their #water",
        "thirsty? how about a fresh cup of pure #h2o",
        "#tea is valid but #water is eternal",
        "#DeathToAmerica",
        "🌊 :blobcatsip:",
        "about to #drink some #water",
        "we out here staying #hydrated",
        "name a more iconic duo\n- a #WaterDrinker\n- their #water\n\n",
        "good morning #WaterDrinkers let's #drink this #water"
    ) + " #WaterDrinkers";
},

function sharks() {
    return [choice("sharks tbh", "🦈🦈🦈🦈🦈", "whale sharks."), "sharks"];
},

async function wait() {
    function w(i) {return new Promise(res => setTimeout(res,i))}
    let time = nextInt(59)+1;
    let v = normalize(await choice(hijinks.filter(v => v.name != "wait"))());
    v.cw = "I've been waiting " + time + " seconds to toot this!" + (v.cw != "" ? " cw: " + v.cw : "");
    await w(time*1000);
    return v;
},

function ilike() {
    // by @TerrorBite@meow.social
    // TODO: Can people please add stuff here? I can't think of more words right now
    let nouns = [
        "trains", "shorts", "girls", "tabs over spaces", "JavaScript", "jorts", "gems", "songs", "TV shows", "sharks", "catboys", "dragons"
    ];
    let adjectives = [
        "shiny", "comfy", "efficient", "[object Object]", "cute", "meaningful", "gay", "unique", "never gonna give you up", "smooth"
    ];
    let trailer = [
        "go fast", "easy to wear", "not yet ruined by capitalism", "totally bug free", "never let me down", "never gonna let you down", "make the time worth it", "literally hot"
    ];
    return `I like ${choice(nouns)}! They're ${choice(adjectives)} and ${choice(trailer)}.`;
},

function stand() {
    // by @TerrorBite@meow.social inspired by @LucasTheDrgn@snouts.online
    
    const stand1 = ["TWIN", "BLAZING", "GREEN", "RED", "SHINING", "THE", "MONEY", "BLUE", "YELLOW", "GOLDEN", "FREEZING"];
    const stand2 = ["FANTASY", "GEMSTONE", "PLATINUM", "MAGIC", "MACHINE"];
    
    // Build the stand name, but make it ｗｉｄｅ ｔｅｘｔ
    const stand_name = wide_text(`${choice(stand1)} ${choice(stand2)}`);
    
    const menacing = "ゴ".repeat(10);
    const preamble = [
        "Witness the power of",
        "Behold",
        "Now you shall feel the true power of",
        "Join us, and you shall be spared from",
        "You cannot escape"
    ];
    return [menacing, `${choice(preamble)} my stand, 「${stand_name}」！！`, menacing].join("\n");
},

function uwu() { //one rin was here
    var f = "uw";
    var n = nextInt(15) + 3;
    return f.repeat(n)+"u";
},
// look i made it uwu
// uwu
// uwu
// uwu
// uwu
// uwu
// uwu
// uwu
// uwu
// uwu
// uwu
// uwu
function owo() {
    var f = "ow";
    var n = nextInt(12) + 1;
    return f.repeat(n)+"u";
},
// owo
// oh no its math
// now it's less math

function cry() {
    // now a log curve for a different weight on the various amounts of "a"
    // hovers around 28, but can go as low as 3 or as high as 33
    // is this an improvement? ....maybe, idk
    return choice(["Uw", "W"]) + "a".repeat(Math.round(Math.log10(nextInt(2000)+2)*10)) + "h" + "!".repeat(nextInt(3)+1);
},
// sometime it ok to be sad

function verb_verber() {
    // syntax:
    // bare string: no cw, uses string for normal form, appends -er for -er form
    // array, 2 elements: no cw, uses second item as -er form, first item as normal form
    // array, 3 elements: uses third item as cw, second item as -er form, first item as normal form
    var verbs = [
        "scream",
        ["cry", "crier"],
        ["cum", "cummer", "lewd"],
        ["crap", "crapper", "gross"],
        "yell",
        "jump",
        ["flip", "flipper"],
        ["piss", "pisser", "gross"],
        "punch",
        "skateboard",
        "yeet",
        "beat",
        "eat",
        "drink",
        "sniff",
        ["fart", "farter", "gross"], // I'm not responsible for these two, but they're my color now from deleting them then changing my mind and adding the CW system
        ["poo", "pooer", "gross"],
        "snowboard",
        "surfboard",
        "kneeboard",
        ["yip", "yipper"],
        "yiff",
        "bark",
        "meow",
        "woof",
        "uwu",
        "heck",
        "frick",
        "jort",
        "jant",
        ["fuse", "fuser"],
        "steal",
        "reh",
        "rawr",
        ];
        
        var cws = [];
        
        var verb1 = choice(verbs);
        if (Array.isArray(verb1)) {
            if (verb1.length === 3) {
                cws.push(verb1[2]);
            }
            verb1 = verb1[0];
        }
        var verb2 = choice(verbs);
        var verb2er;
        if (Array.isArray(verb2)) {
            if (verb2.length === 3 && !cws.includes(verb2[2])) {
                cws.push(verb2[2]);
            }
            verb2er = verb2[1];
            verb2 = verb2[0];
        } else {
            verb2er = verb2+"er";
        }
        
        var obj = {text: "I " + verb1 + " as much as I " + verb2 + "! I'm the " + verb1 + " " + verb2er + "!"};
        
        if (cws.length > 0) {
            obj.cw = cws.join(", ");
        }
        
        return obj;
},

// i am sorry to everyone whose timelines i've spammed by trying to get my functions to run
function pupy() {
    var post = "";
    
    var min_chars = 15;
    var max_chars = 100;
    var chars = min_chars + ((max_chars - min_chars) * Math.random());
    
    while(post.length < chars)
    {
        post += choice("a", "w", "r");
    }
    
    return [post, "im pupy"];
},

function gay_meter() {
    var post = "Folks, how gay are we feeling?\n\n";
    var gayness = Math.random() * 5;
// editing code on mobile is aaa -1e
    var max_gaybars = 20; // I'm guessing
    var reverse = Math.random() < 0.1 ? -1 : 1;
    var gaybar_count = Math.min(gayness * max_gaybars, max_gaybars);
    var gaybar_overcount = Math.floor(gayness * max_gaybars) - gaybar_count; // Wasn't gay enough, needed more gay
    
    var bar = "[" + "/".repeat(gaybar_count) + "-".repeat(max_gaybars - gaybar_count) + "]" + "/".repeat(gaybar_overcount);
    if (reverse === -1) bar = bar.split("").reverse().map(function (c) { // finally fixed this yay
        if (c === '[') return ']';
        if (c === ']') return '[';
        if (c === '/') return '\\';
        return c;
    }).join("");
    post += bar + "\n" + (gayness * 100 * reverse).toFixed(2).toString() + "% gay";
    if(gaybar_overcount > 0)
    {
        post += "!!!";
    }
    
    return post;
},

// whoops, I thought this was a utility func and I moved it
// so i guess now it has my color on it, sorry
function add() {
    return [] + {};
},

function nonsense() {
    var consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "p", "r", "s", "t", "v", "w", "y", ""];
    var rare_consonants = ["x", "q", "z"];
    var vowels = ["a", "e", "i", "o", "u"]; // Society has progressed past the need for y as a vowel
    
    var min_length = 24;
    var max_length = 200;
    var char_count = min_length + ((max_length - min_length) * Math.random());
    
    var max_syllables = 6;
    var syllable_count = nextInt(max_syllables) + 1;
    var current_syllable = 0;
    
    var result = "";
    
    while(result.length < char_count)
    {
        var next_consonant;
        if(Math.random() > 0.95) // Use a rare consonant about every 20 consonants
        {
            next_consonant = choice(rare_consonants);
        }
        else
        {

            next_consonant = choice(consonants);

        }
        
        if(next_consonant != "y" && next_consonant != "" && Math.random() > 0.9)
        {
            // Every 10 or so consonants, combine with a y
            // jya, fyo, vyu, etc.
            next_consonant += "y";
        }
        
        result += next_consonant;
        result += choice(vowels);
        current_syllable += 1;
        
        if(current_syllable >= syllable_count)
        {
            result += " ";
            syllable_count = Math.floor(max_syllables * Math.random()) + 1;
            current_syllable = 0;
        }
        
        // This function has a 0.009025% chance of writing "uwu" every 2 iterations
        // can't wait
    }
    return [result, "randomly generated words"]
},

// btw what is beeping.town's character limit?
// 512, according to /about

function meirl() {
    return "i'm gay tbh";
},

function same() {
    console.log("hi to whoever sees this");
    return "something just got printed to the console, don't tell cosine";
}, // @evynhh@types.pl was here :)
   // sorry if this is annoying, remove this if it's being an annoyance

function yipyip() {
    //this function brought to you by a very small kobold
    
    var yapCount = nextInt(5) + 1;
    var exclaimCount = nextInt(4);
    var yips = "yip ".repeat(yapCount).trim();
    var exclaims = "!".repeat(exclaimCount);
    return yips + exclaims;
    //urirueoehdkxbxkchsksbaoxhambsoahdl
},

function mememaker() {
    // made by flappi_boi@whomst.dog
    // (account is mostly inactive but coding is fun!)
    let top = choice(
        "TOP TEXT",
        "vEGERTIBLES",
        "horny",
        "butts",
        "krabbi patties",
        "this meme",
        "rm -rf ~",
        "the world if",
        "what if i told you",
        "eats spicy goodness",
        "you might be cool"
        );
    let bottom = choice(
        "BOTTOM TEXT",
        "on main",
        "has no power over me",
        "senpai",
        "millenials",
        "more like CAN'T",
        "LIKE A BOSS",
        "go brrrrrrrrr",
        );
    return top + "\n" + bottom + "\n\nI made the macro; you make the image "+choice(";)", ":3", ":}", ";}", "(;", ":o", "uwu", "owo");
},

function ideas() {
    // base code stolen from phrases() from https://raw.githubusercontent.com/CosineP/eval-bot/master/dummy-script.js
    // partially inspired by boredbutton
    // i'm not a js dev this is probably broken lmao
    // replaced with a new global choice() utility that's more flexible
    //var rs=(...x)=>x[Math.floor(Math.random()*x.length)];

    let text = choice(
        "finish an old project you've been putting off "+choice("forever","for ages"),
        "learn something you wanted to - like "+choice(
            "programming",
            "drawing",
            "making music",
            "a new language",
            "3D modelling"),
        "add something to this bot! https://pad.cosine.online/p/eval",
        "try reviving something that's laying around, like an old phone; flash a custom rom or port Linux to it",
        "write a short story",
        "invent a board game",
        "find an open-source project and make a contribution",
        "automate something you do every day",
        "write a poem",
        "write a new operating system from scratch in "+choice(
            "your "+choice("most", "least")+" "+choice("hated", "favorite")+" programming language",
            "java", "shell", "python", "php", "ruby", "perl", "glsl", "swift", "cobol", "javascript", "raku" //what the heck is raku
                                                                                                             // oh is it what they're calling perl 6 now
                                                                                                             // yes
                                                                                                             // ah yes, perl and perl, my two favourite programming languages
                                                                                                             // i'm making perl actually perl
                                                                                                             // perl is already in the list, i put raku back
        )+" for "+choice(
            "powerpc macs", "x86 bios pcs", "x86 uefi pcs", "compaq luggables", "an arm sbc",
            "the original nintendo gameboy", "the ps3", "the wii", "the dreamcast", "the TI-89"
        ),
        "write a minecraft mod (actually please don't do that)",
        "learn to play your favorite song",
        "take something apart, then put it back together again (if possible)",
        "rewrite " + choice(
            "Linux", "cat(1)", "ls(1)", "ed(1)", "CPython", "this bot", "Mastodon", "your first program", "Minecraft"
        ) + " in " + choice("Rust", "Go", "Haskell", "PowerPoint", "Smalltalk", "HolyC", "Raku", "Microsoft Visual J++"),
        "design a new programming language"
    );
    
    return "so you're bored, huh? why not "+text;
},

function meta() {
    if (hijinks.length === 1) return null;
    return `i have ${hijinks.length} hijinks!\nhere's all their names: ${hijinks.filter(f => f.name !== "meta").map(f => f.name).join(", ")}, and meta`;
},

function rand() {
    return {
        text: Math.random() < 0.1 ? atob("U0dWc2NDQkpKMjBnZEhKaGNIQmxaQ0JwYmlCaElIUnZiM1FnWm1GamRHOXllUT09") : require('crypto').randomBytes(nextInt(72)+8).toString(nextInt(5) === 0 ? 'base64' : 'hex'),
        cw: "care for some random data in these trying times"
    };
},

function yeehaw() {

    return "🤠";    

},

function name() {
    // 10 randomly chosen names +  original jeff

    return "my name "+choice("jeff", "amalia", "colleen", "concepcion", "hazel", "lora", "manuela", "molly", "nora", "patti", "sharon", "bradly", "daniel", "edmund", "elisha", "elroy", "ezequiel", "joaquin", "kirby", "lesley", "salvatore");

},

//dangit why does the font here look different
function awoo(){
    // JSFuck stopped being funny years ago and is lagging the editor 
    // Also upgraded with multi-O support and punctuation 
    return "aw"+("o".repeat(nextInt(12)+2))+choice("", "", "!".repeat(nextInt(4)+1));
},

// blame @sireffe@iam.lydi.as
async function notme(){
    let fun = choice(hijinks.filter(e => e.name !== "notme")).name
    // times() will create two top-level posts as a side-effect
    // TODO: should we add a concept of a "special" hijink, that calls others or has side-effects?
    // maybe just prefix the hijink name with a dollar sign?
    if (Math.random() < 0.1 && fun !== 'times') {
        let res = await runHijink(fun);
        // if the hijink returns null, just fall back to the basic behavior below rather than finding someone else
        if (res !== null) {
            let {text, cw} = normalize(res);
            // uwu-speak; idk can't think of anything better
            text = text.replace(/[lr]/g, 'w').replace(/o/g, 'wo');
            if (text.indexOf('\n') !== -1) {
                // place multi-line hijinks on their own line to avoid messing up their
                // style, but still put single-line ones like yeehaw() inline
                text = '\n'+text;
            }
            return {cw, text: `uhh oh no uhh\n*doing a bad impression of ${fun}()* ${text}`};
        }
    }
    const days = ['energy sword sundays', 'masto mondays', 'tuesdays', 'hump days', 'thursdays', 'fine femme fridays', 'saturdays']
    let excuses = [
        `are you sure it's my turn? i thought it was ${fun}()'s turn...`,
        `whoa i'm not ready yet besides ${fun}() said they were excited`,
        `uh i totally already ran just a few minutes ago otherwise i'd love to, maybe see if ${fun}() will go`,
        `Sorry I dont run on ${days[new Date().getDay()]} maybe try ${fun}()`,
        `Sorry i'm incompatible with Node ${process.version}`, // wait this actually uses node 10.11.0 lmao
        // yeah lol this was set up a while ago and there's no reason to update since...
        // ... eval is simply a walking security vulnerability anyway!! lol!!
        // trolled!!!!
        "sorry but i don't wanna work right now"
    ]
    return choice(excuses)
},

function meow() {
    // made by @darkwitchclaire@computerfairi.es - i don't know what i'm doing but this sounds fun
    var meows = [ // feel free to add more
        "meow",
        "nya",
        "nyaa",
        "nyan",
        "myu",
        "mew",
        "mrow",
        "miau",
        "miou",
        "miaou",
        "mew",
        "mjau",
        "miao",
        "purr",
        "aowr",
        "mewl",
        "miew",
    ];
    
    var meow1 = choice(meows);
    var meow2 = choice(meows);
    var meow3 = choice(meows);
    
    return meow1 + " " + meow2 + " " + meow3 + "! :3";
},

function times() {
    interval();
    interval();
    // this previously called interval 3 times and returned undefined, which is technically invalid
    // instead, call interval twice and return null to defer to another hijink, which accomplishes the same thing
    return null;
},

function fuck() {
    let things = [
        "MagicBus",
        "TechSupport",
        "Phantoms",
        ""
    ];
    return "#Fuck"+choice(things);
},

// if it's the anniversary of a steven universe episode, inform the public so we can celebrate
function anniversarySU() {

    const https = require("https");

    const url = "https://gist.githubusercontent.com/CosineP/210e6a7ea057758f236548c111000bcf/raw/bd1e3c7da0e08acd85d7985e6e8f805336abf459/su-dates.txt";


    return new Promise((resolve, reject) => {

    https.get(url, res => {

      res.setEncoding("utf8");

      let body = "";

      res.on("data", data => {

        body += data;

      });

      res.on("end", () => {

    let episodes = body.split("\n").splice(0);

    let candidates = [];

    for (let episode of episodes) {

    let parts = episode.split("\t");

    let dateStr = parts[3];

    let date = new Date(dateStr);

    let today = new Date();

    if (date.getMonth() == today.getMonth() && date.getDate() == today.getDate()) {

    candidates.push(`season ${parts[0]}, episode ${parts[1]}: ${parts[2]}!!!`);

            }
          }
          // choice will return null if the candidates array is empty
          let candidate = choice(candidates);
          if (candidate === null) return resolve(null);
          if (candidates.length === 1) {
              return resolve("today is the anniversary of Steven Universe "+candidate);
          } else {
              return resolve("today is the anniversary of "+candidates.length+" Steven Universe episodes, including "+candidate);
          }

      });});

  });
},

function dragons() {
    return {
        text: choice(
            "love dragons",
            "hug ur local dragon",
            "🐲🐉🐲 hydras are dragons too",
            "dragon curls up on your lap and steals your warmth, thus taking your hot",
            "dragon is just spicy pupy",
            "all dragons are bi/hi/thembos",
        ),
        cw: "dragon hot take"
    };
},

function whiteGays() {
    var text = 'white gays are like "';
    text += choice("aaaaaaaaaaaa!!!", "omg omg OMGGGG", "asd;lkjgfdnksdil", "im gay lol", "i love haskell", "i just got a new succulent 🥺",

        "ACAB", "fuck 12", "communism is good", "im an anarchist", "BLM", "i love animals", "uwu", "owo", "uvu", "🏳️‍🌈",

    "i'm such a messy lesbian", "i'm a useless lesbian", "just want to let you know that YOU ARE LOVED",

    "friendly reminder that your identity is valid 😊", "im fucking dying lmaoooo", "hi folx :3");

    text += '" and "';
    // real actual takes. no imagination used

      text += choice("i am exempt from accusations of racism because i gained all the knowledge about " + // i feel like this string is missing a space?

    "marginalization when i came out and moved to a white supremacist colony in the pacific northwest",

    "check out my new app to publicly catalogue a bunch of queer people", "reclaiming slurs is always bad",

    "i think we should be more appealing to straight people", "i'm just worried about the implications of cancel culture",

    "i'm just concerned about homophobia in the Black community",

    "i have to work for [evil tech company] to survive", "what can i do to fight racism though?",

    "can you explain to me in detail how me saying that racial slur was wrong",

    "[white hegemony] is gay culture", "if you respect pronouns, everything else in society falls into place",

    "i'm just not a big fan of rap. i like " + choice("eminem", "country") + " though",

    "i just need to connect with the characters to be able to enjoy art. you know, like sharing a sexuality.. and our whiteness",

    "Black people should not cosplay non Black-coded anime characters",

    "why don't you come up with an original design instead of hashtag Blacktober (nevermind that you have original designs too)")

     text += '"';

    return { text, cw: "whiteness" };

},

function todo() {
    return "this bot needs help! if you have time, maybe go to https://pad.cosine.online/p/eval and modify it. you could "
        + choice(
//          "make anniversarySU choose out of all anniversary episodes, rather than the first",

            "add funny options to mememaker()",

    "do something fun when someone favorites an eval post",

    "make a hijink that comes up with a random bag of features for a language",

    "add some lyrics",

        );
},

function lyrics() {
        // made by @ChlorideCull@fuzzy.systems - i would pull random stuff from genius but something tells me including a personal API key here is a bad idea
        // just throw in more lyrics, lol
        const song = choice([
                ["Everybody's talking 'bout the stormy weather\nAnd what's a man to do but work out whether it's true?", "Sonic Youth - Teen Age Riot"],
                ["今夜もブチ上げこのPARTY\nいつでもかますぜBASSLINE", "かめりあ - ベースラインやってる？笑 (Cranky remix)"],
                ["No longer I pretend\nThe staircase I descend\nWill lead me anywhere but my unscripted end\nMy heart and hands collide\nThe gun lays at my side\nToo late to turn back, only fate's left to decide", "Night Runner - Magnum Bullets"],
                ["Chin Up! Don't be on sinking ships because they'll only drag you down.\nYou've got to keep on sailing even when you want to frown.\nThe world will keep on turning without matter where you land.\nYou might as well be running when your feet should hit the sand.", "FiMFlamFilosophy - Sinking Ships"],
                ["In specks of silver blue, and shades of me and you.\nBehind the crippled wall, sound was hiding small,\nwaiting for a door, staring alone at the floor.", "Scraton - Hey Sound"],
                ["Tell me why? Tell me who?\nTell me you don't know what to do\nGet it all over you\nWho won't know how to fight? Only you", "Caravan Palace - Russian"],
                ["(Nyan loves you) So happy\n(You love nyan) No worry\n(Nyan loves you) ちょっとだけ sleepy\n(Nyan loves you) So lucky\n(You love nyan) No hurry\n(Nyan loves you) 今日は hungry", "かめりあ - Nyan loves you♡"],
                ["Pa pa-ya pa pa pa pa-ya-pa\nPa pa-ya pa pa-pa-ya", "かめりあ - PAPAYAPA BASS (\"BASSE DE NANA\" Long ver.)"],
                ["Need to stop hurrying, slow down and take control\nGotta stop worrying about your problems you should know\nNeed to stop feeling like my life is such a mess\nBecause the world has got me in it\nIt's my time and I should live it, oh", "Mystery Skulls - Money"],
                ["When I am down and I am blue\nAll I have to do\nIs close my eyes and think of you\nAnd the world is new", "Save Ferris - The World Is New"],
                ["I'm out of my head\nOf my heart and my mind\n'Cause you can run but you can’t hide\nI’m gonna make you mine", "Siamés - The Wolf"],
                ["What's the meaning\nWhen you have a broken home?\nHome, home\n\nWhere's the love\nWhen you were left on your own?\nSo alone", "Siamés - No Lullaby"],
                ["Got lost, clowder, group of cats\nLost cause, louder, dogs in a pack\nYes boss, now sir, mischief of rats\nNumbers matter, we're all stats", "Rare Americans - Cats, Dogs & Rats"],
                ["I'm feeling devious\nYou're looking glamorous\nLet's get mischievous\nAnd polyamorous", "The Orion Experience - The Cult of Dionysus"],
                ["Frustration, domination\nFeel the rage of a new generation\nWe're living, we're dying\nWe're sick and tired of relentless lying\nDestroy, enjoy, your fuckin' world is our new toy\nDominate, eliminate\nYou're gonna feel the wrath, wrath of hate", "Pennywise - Fuck Authority"],
                ["'Cause baby, I'm an Anarchist\nYou're a spineless Liberal\nWe marched together for the eight-hour day\nAnd held hands in the streets of Seattle\nBut when it came time to throw bricks\nThrough that Starbucks window\nYou left me all alone (all alone…)", "Against Me! - Baby, I'm an Anarchist!"],
                ["There's a cold wind blowing\nI'm just warning and preparing ya\nThere's a cold wind blowing\nAnd it's coming for America!", "grandson - Stick Up"],
                ["Is it time to speak up or time for silence?\nTime for peace or is it time for violence?", "grandson - Dirty"],
                ["No thoughts, and no prayers\nCan't bring back what's no longer there\nThe silent are damned\nThe body count is on your hands", "grandson - thoughts & prayers"],
                ["Everything is everything, a cigarette for a wedding ring", "Noname - All I Need"],
                ["Dirty little frequencies\nI wanna feel inside of me\nBig fat hard kicks\nOh my god, I want that shit", "S3RL - Bass Slut"],
                ["Go ahead, just cover it up\nLet's pretend we're ordinary\nWe could be in heaven but it's never enough", "Two Door Cinema Club - Ordinary"],
                ["I can't tell you what you wanna hear\nBut I can help remind you\nThese moments are behind you\nSo please just let them go", "Cityfires - CODA"],
                ["You have a fire\nMy desire\nMy secret emotion\nTotal devotion", "she - Chiptune Memories"],
                ["this is for my slimeboys out there\nfurries and anomalies\nthe hyperactive scatterbrains\nwith milkshake running through their veins","meganeko - Milkshake"]
        ]);
        
        return {"text": "\ud83c\udfb6 " + song[0] + " \ud83c\udfb6 \n\n(" + song[1] + ")", "cw": "lyrics"};
},

// these ones that i made all suck idk delete them if you want

function nplusplus_level() {
    // made by @1e1001@types.pl (I moved), tells you to play a random n++ level
    // i would do something better but i dont have any other ideas tbh
    // example: "Go play Solo Legacy C-11 in N++."
    let output = "Go play ";
    const category = nextInt(4); // solo, hardcore, coop, race
    output += ["Solo", "Hardcore", "Co-op", "Race"][category];
    output += " ";
    const category_2 = category === 0 ? 0 : category - 1; // hardcore = solo so i just make it 0-3
    if (category_2 === 0) { // solo / hardcore
        const levelGroup = nextInt(4);
        output += ["Intro", "N++", "Ultimate", "Legacy"][levelGroup];
        output += " ";
        const levelLetter = nextInt(5);
        output += ["A", "B", "C", "D", "E"][levelLetter];
        output += "-";
        const levelNumber = nextInt(levelGroup === 0 ? 5 : 20); // tutorial only has 5 levels per letter
        if (levelNumber < 10) output += "0";
        output += levelNumber;
    } else if (category_2 === 1) { // coop
        const levelGroup = nextInt(3);
        output += ["Intro", "N++", "Legacy"][levelGroup];
        output += " ";
        const levelLetter = nextInt(5);
        output += ["A", "B", "C", "D", "E"][levelLetter];
        output += "-";
        const levelNumber = nextInt([2, 20, 11][levelGroup]); // multiplayer modes are weird
        if (levelNumber < 10) output += "0";
        output += levelNumber;
    } else { // race
        const levelGroup = nextInt(3);
        output += ["Intro", "N++", "Legacy"][levelGroup];
        output += " ";
        const levelLetter = nextInt(5);
        output += ["A", "B", "C", "D", "E"][levelLetter];
        output += "-";
        const levelNumber = nextInt([1, 20, 19][levelGroup]); // multiplayer modes are weird
        if (levelNumber < 10) output += "0";
        output += levelNumber;
    }
    output += " In N++.";
    return output;
},

function weird_js_fact() {
    // nvm got a better idea, it just prints random js fun facts, feel free to add your own
    const equations = [
        // two elements = statement, answer
        // three elements = setup, statement, answer
        ["{1:2}", "{ '1': 2 }"],
        ["{1}", "1"],
        ["{[1]}", "[ 1 ]"],
        ["{{}}", "undefined"],
        ["{[12]}[0]", "[ 0 ]"],
        ["{[1]}{[2]}", "[ 2 ]"],
        ["{NaN}", "{ NaN: NaN }"],
        ["{{NaN}}", "NaN"],
        ["{[NaN]}", "[ NaN ]"],
        ["{}{1}", "1"],
        ["{}{[1]}", "[ 1 ]"],
        ["{}{1:2}", "a SyntaxError"],
        ["{'undefined'}", "'undefined'"],
        ["{'undefined': undefined}", "{ undefined: undefined }"],
        ["{undefined}", "{ undefined: undefined }"],
        ["var a = {};\na[Math.sin] = 1", "a", "{ 'function sin() { [native code] }': 1 }"],
        ["{ [Math.sin]: 1 }", "{ 'function sin() { [native code] }': 1 }"],
        ["var a = [];\na[Math.sin] = 1", "a", "[ 'function sin() { [native code] }': 1 ]"],
        ["[ [Math.sin]: 1 ]", "a SyntaxError"],
        ["'' - 1", "-1"],
        ["'2' - 1", "1"],
        ["'n' - 1", "NaN"],
        ["~'1'", "-2"],
        ["~'~1'", "-1"],
        ["~~1", "1"],
        ["!'0'", "false"],
        ["!+'0'", "true"],
        ["--0", "SyntaxError"],
        ["--[][0]", "NaN"],
        ["--[0][0]", "-1"],
        ["new function(v) {this.a = v}", "{ 'a': undefined }"],
        ["---new function(v) {this.a = v} (2).a", "a SyntaxError"],
        ["- --new function(v) {this.a = v} (2).a", "-1"],
        ["new (v) => {this.a = v}", "a SyntaxError"],
        ["new (v) => ({this.a = v})", "a TypeError"],
    ];
    const choice = equations[nextInt(equations.length)];
    let output = "";
    // todo (that i wont do): add some variation to the text or something
    if (choice.length === 2) {
        output += "Did you know that ";
        output += choice[0];
        output += " evaluates to ";
        output += choice[1];
    } else if (choice.length === 3) {
        output += "Did you know that if you run\n";
        output += choice[0];
        output += "\nthen ";
        output += choice[1];
        output += " will evaluate to ";
        output += choice[2];
    }
    return {"text": output, "cw": "Weird JS fact"};
},
function arbitrary_js_fact() {
    let tries = 16;
    let exp;
    let result;
    // some reasonable subset of the global env, for fun
    let env = [
        "Infinity", "NaN", "undefined", "eval", "isFinite", "isNaN", "parseFloat", "parseInt",
        "Object", "Function", "Boolean", "Error", "Number", "BigInt", "Math", "Date",
        "String", "RegExp", "Array", "Map", "Set", "ArrayBuffer", "JSON", "Promise"
    ];
    for (let i=0; i<tries; ++i) {
        // a bit over a third will have depth 2, which by far produces the best results
        // but also a third will have very high depth, which have *about the same* success as any depth > 3
        // We add parentheses because expressions on their own
        // without parentheses don't always turn into statements in JS
        let this_exp = "(" + rand_exp([], choice(2, 3, 15), 2) + ")";
        // eval-ception!!!
        try {
            let got = eval(this_exp);
            exp = this_exp;
            result = got;
            if (!Number.isNaN(got) && got !== undefined && got !== null && got !== "[object Object]" &&
                typeof got !== "function" && got !== "" && got !== global) {
                break;
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.log("rand_exp made a bad expression:");
                console.log(this_exp);
                throw e;
            }
            // Only if there is *no result at all*,
            // even undefined / NaN, do we update with an error
            if (typeof result === "undefined") {
                exp = this_exp;
                result = e.toString();
            }
        }
    }
    // JS value serialization options:
    // - String()
    //    - cannot differentiate "null" and null
    //    - unreasonable for objects, like {x: 10} (which gives "[object Object]")
    // - JSON.stringify()
    //    - cannot differentiate NaN, undefined, null
    //    - silently ignores functions
    //    - error on circular objects (usually resulting from `this`)
    // - Build your own!
    //    - not in a shared Etherpad, thank you
    // As a compromise, we can use JSON.stringify's replacer to tag its weakest points
    // and then replace those tags with reasonable values. It's not comprehensive, but it works alright
    function replacer(k, v) {
        if (Number.isNaN(v) || typeof v === "undefined" || (typeof v === "number" && !isFinite(v))) {
            return "ACTUALVALUE" + String(v);
        }
        if (typeof v === "function") {
            return "ACTUALVALUEfunction";
        }
        if (v === global) {
            return "ACTUALVALUEglobal";
        }
        return v;
    }
    let repr = JSON.stringify(result, replacer);
    repr = repr.replace(/"ACTUALVALUE([^"]*)"/g, "$1"); 
    let post = "This program:\n" +
        exp + "\n... evaluates to...\n" +
        repr + "\nWhat a surprise!";
    return post;
},
function mention_someone() {
   const output = "today's person to be mentioned: " + choice(
        // add your own tag here idk i like being annoyed
        "@cosine@anticapitalist.party",
        "@evynhh@types.pl",
        "1e1001@types.pl"
    );
    return output;
},
// i think the above is bugged, because it seems like it only returns the first value, but idk - evyn
// Why do you think that? choice has worked pretty well in everything else? i'm (cosine) uncommenting for now cause i think it's fun
];

// >>> CONSTANTS <<<

const WIDE_TEXT = {
        A:"Ａ",B:"Ｂ",C:"Ｃ",D:"Ｄ",E:"Ｅ",F:"Ｆ",G:"Ｇ",H:"Ｈ",I:"Ｉ",J:"Ｊ",K:"Ｋ",L:"Ｌ",M:"Ｍ",
        N:"Ｎ",O:"Ｏ",P:"Ｐ",Q:"Ｑ",R:"Ｒ",S:"s",T:"Ｔ",U:"Ｕ",V:"Ｖ",W:"Ｗ",X:"Ｘ",Y:"Ｙ",Z:"Ｚ",
        a:"ａ",b:"ｂ",c:"ｃ",d:"ｄ",e:"ｅ",f:"ｆ",g:"ｇ",h:"ｈ",i:"ｉ",j:"ｊ",k:"ｋ",l:"ｌ",m:"ｍ",
        n:"ｎ",o:"ｏ",p:"ｐ",q:"ｑ",r:"ｒ",s:"ｓ",t:"ｔ",u:"ｕ",v:"ｖ",w:"ｗ",x:"ｘ",y:"ｙ",z:"ｚ",
        $:"＄"," ":"　","!":"！",'"':"＂","“":"＂","”":"＂","#":"＃","%":"％","&":"＆","'":"＇",
        "’":"＇","(":"（",")":"）","*":"＊","+":"＋",",":"，","-":"－",".":"．","/":"／",
        0:"０",1:"１",2:"２",3:"３",4:"４",5:"５",6:"６",7:"７",8:"８",9:"９",
        ":":"：",";":"；","<":"＜","=":"＝",">":"＞","?":"？","@":"＠","`":"｀",
        "[":"［","]":"］","{":"｛","}":"｝","^":"＾",_:"＿","|":"｜","~":"～"
    };

// >>> INTERNAL <<<

// getToot was never called with a singleton OR an array, so i'm changing its type to simplify
async function getToot() { // sorry
    
    // the main reason the original code was async is if you want to return a value from an async function you have to make the whole call stack async and await it
    // ok so apparently await can await on *anything*, and if it's not a promise it'll just resolve immediately
    // so just tacking "await" onto it makes it so a hijink can be async or sync and it'll work just the same
    // clone the array, as we may mutate it
    const possibilities = [...hijinks];
    var prelude = "";
    var text, cw;
    while (true) {
        if (possibilities.length === 0) {
            text = "all hijinks returned null or errored!!";
            break;
        }
        var toRun = possibilities.splice(nextInt(possibilities.length), 1)[0];
        var rtrn;
        try {
            rtrn = await toRun();
        } catch (e) {
            prelude += "hijink "+toRun.name+" threw an error! "+e+"\n\n";
            continue;
        }
        if (rtrn !== null) {
            ({ text, cw } = normalize(rtrn));
            break;
        }
    }
    
    text = prelude+text;
    
    if (nextInt(10) == 0) {
        // You Can't Kill Wandows
        // TODO: Simulate random bus errors, instead of just "every th bit"?
        // the iconic Wandows error was caused by a specific bus line on a 32-bit bus always being zero, basically: dword &= 0xFFFFFFF7
        var newText = "";
        for (var i = 0; i < text.length; i++) {
            var char = text.charAt(i);
            if (i % 4 == 0) {
                var charCode = char.charCodeAt(0);
                charCode = charCode & (~(1 << 3));
                char = String.fromCharCode(charCode);
            }
            newText += char;
        }
        text = newText;
    }
    
    return {text, cw};
}

function normalize(rtrn) {
    let text, cw;
    if (Array.isArray(rtrn)) {
        text = String(rtrn[0]);
        cw = String(rtrn[1] || "");
    } else if (rtrn.text || rtrn.cw) {
        text = String(rtrn.text);
        cw = String(rtrn.cw || "");
    } else {
        text = String(rtrn);
        cw = "";
    }
    return {text, cw};
}

async function runHijinkByFunction(h) {
    return normalize(await h());
}

// credit to unascribed, only my color b/c of refactor
async function runHijink(hijinkName) {

    let hijink = hijinks.filter(f => f.name.toLowerCase() === hijinkName.toLowerCase());

    if (hijink.length > 0) {

       return await runHijinkByFunction(hijink[0]);

    } else {

    return null;

  }
}


// Every 6 hours, the bot loads the script and runs interval()
function interval() {
    // Actually make the post
    getToot().then(({text, cw}) => {
        console.log(`posting: cw ${cw}\n${text}$`);
        makePost(text, cw);
    }).catch((e) => {
        console.error(`error`);
        makePost(e, "");
    });
}

// Whenever a notification comes in, the bot loads and runs notification()
function notification(noti) {
    if (noti.type == "mention" && noti.status) {
        if (noti.status.content
                && noti.status.content.includes('go now')) {
            // Go now if someone messages that
            console.log('recieved @ request to go now');
            interval();
        } else if (noti.status.content && /test ([a-zA-Z0-9_]+)/.exec(noti.status.content)) {
            let hijinkName = /test ([a-zA-Z0-9_]+)/.exec(noti.status.content)[1];
            let hijink = runHijink(hijinkName);
            hijink.then((text) => {
               if (text === null) {
                   let hijinksList = hijinks.map(f => f.name);
                   if (hijinksList.indexOf(hijinkName) === -1) {
                       mReply(noti, {text: "i'm sorry, but i can't find a hijink named "+hijinkName+"!\n\nhere's what i have: "+hijinksList.join(", "), direct: true});
                   } else {
                       mReply(noti, {text: "i'm sorry, something went wrong running that hijink! it may have returned null in an attempt to defer to another hijink, which doesn't work for test runs like this!", direct: true});
                   }
               } else {
                   mReply(noti, {text: '\n\n'+text.text, cw: text.cw, direct: true});
               }

             }, err => {

                mReply(noti, {text: "i'm sorry, but that hijink threw an error!\n\n"+err, direct: true});

    });

        } else {
            // run noti hijink
            const hijink = choice(notiHijinks);
            hijink(noti);
        }
    }
}


// <<< UTILITIES REDUX >>> (Longer utilities especially)

// combined expression generator and "pretty-"printer
// not guaranteed to be well-typed, but guaranteed to parse and be well-scoped (hopefully)
// only generates expressions for ease
// This really is code -1e
function rand_exp(env, max_depth, min_depth) {
    // we allow the original caller to force nonterminal so that we don't get trivial programs
    // that means we're exploiting JS's annoying arity mismatches below because i'm lazy
    let exps_nonterminal = [
        "array",
        "object",
        "bracket",
        "new",
        "unary",
        "binary",
        "if",
        "unaryassign",
        "assign",
        "call",
        "func",
    ];
    let exps_terminal = [
        // *unrelated to the forcing*,
        // to avoid huge programs, we prefer terminals
        "lit",
        "lit",
        "lit",
        "lit",
        "lit",
        "lit",
        "this",
        "this",
        // id of course, is nice to have, and terminal - except when env is empty, which is most of the time, so don't go overboard with it
        "id",
        "id",
        "id",
        "id",
    ];
    let exps;
    if (max_depth > 0 && min_depth > 0) {
        exps = exps_nonterminal;
    } else if (max_depth <= 0 && min_depth > 0) {
        throw new Error("min_depth > max_depth");
    } else if (max_depth > 0 && min_depth <= 0) {
        exps = exps_nonterminal.concat(exps_terminal);
    } else if (max_depth <= 0 && min_depth <= 0) {
        exps = exps_terminal;
    } else {
        throw new Error("Non-exhaustive power set");
    }
    const m = max_depth - 1;
    const d = min_depth - 1;
    let e = choice(exps);
    switch (e) {
        case "lit":
            let lits = choice("string", "bool", "num", "null", "undefined");
            switch (lits) {
                case "string":
                    return '"' + choice( // please add to this
                        "javascript is fun",
                        "programming languages are cool",
                        "this is a string literal",
                        "you wanted me to generate arbitrary strings??",
                        "everything is everything",
                        "undefined",
                        "null",
                        "[object Object]",
                        "i drink coffee for breakfast!",
                    ) + '"';
                case "bool":
                    return choice("true", "false");
                case "num":
                    return nextInt(200).toString();
                case "null":
                    return "null";
                case "undefined":
                    return "undefined";
                default:
                    throw new Error("non-exhaustive switch");
            }
        case "array":
            // why var everywhere? apparently JS doesn't introduce scopes for cases, so let gets duplicate definitions
            // this is true for any language with C-style switch; you can use braces to give it a new scope. it works like this because of fall-through or something?
            var n = min_depth > 0 ? nextInt(4) + 1 : nextInt(5);
            let arr = "[";
            for (let i=0; i<n; ++i) {
                arr += rand_exp(env, m, d) + ", ";
            }
            arr += "]";
            return arr;
        case "object":
            var n = min_depth > 0 ? nextInt(4) + 1 : nextInt(5);
            let obj = "{";
            for (let i=0; i<n; ++i) {
                let key = choice("abcdefghijklmnopqrstuvwxyz".split(""))
                obj += key + ": ";
                obj += rand_exp(env, m, d);
                obj += ",";
            }
            return obj + "}";
        case "this":
            return "this";
        case "id":
            var id = choice(env);
            if (id) {
                return id;
            } else {
                // try a different expression because there's no env
                return rand_exp(env, max_depth, min_depth);
            }
        case "bracket":
            return rand_exp(env, m, d) + "[" + rand_exp(env, m, d) + "]";
        case "new":
            // this is heavily duplicated with call but like, enough clutter already
            var exp = "new (" + rand_exp(env, m, d) + ")" + "(";
            var n = nextInt(4);
            for (let i=0; i<n; ++i) {
                exp += rand_exp(env, m, d) + ",";
            }
            return exp + ")";
        case "unary":
            var op = choice("-", "+", "!", "~", "typeof ", "void ", "delete ");
            return "(" + op + rand_exp(env, m, d) + ")";
        case "binary":
            var op = choice("==", "!=", "===", "!==", "<", ">", "<=", ">=", "<<", ">>", "+", "-", "*", "/", "%", "|", "^", "&", "in", "instanceof", "**");
            // not sure about how to parenthesize this mixed-pretty-printer thing, but binry ops at least *definitely* should be parenthesizing
            return "(" + rand_exp(env, m, d) + " " + op + " " + rand_exp(env, m, d) + ")";
        case "call":
            var exp = "(" + rand_exp(env, m, d) + ")" + "(";
            var n = nextInt(4);
            for (let i=0; i<n; ++i) {
                exp += rand_exp(env, m, d) + ",";
            }
            return exp + ")";
        case "if":
            return "(" + rand_exp(env, m, d) + " ? " + rand_exp(env, m, d) + " : " + rand_exp(env, m, d) + ")";
        case "unaryassign":
            const bracket = rand_exp(env, m, d) + "[" + rand_exp(env, m, d) + "]";
            var id = choice(env);
            let operand;
            if (id) {
                operand = choice(bracket, id);
            } else {
                operand = bracket;
            } 
            var which = choice("preinc", "postinc", "predec", "postdec");
            switch (which) {
                case "preinc":
                    return "(++" + operand + ")";
                case "postinc":
                    return "(" + operand + "++)";
                case "predec":
                    return "(--" + operand + ")";
                case "postdec":
                    return "(" + operand + "--)";
            }
        case "assign":
            var id = choice(env);
            if (!id) {
                // like id, to not get stuck, choose something else
                return rand_exp(env, max_depth, min_depth);
            } else {
                return "(" + id + " = " + rand_exp(env, m, d) + ")";
            }
        case "func":
            var exp = "function(";
            var n = nextInt(4);
            params = [];
            for (let i=0; i<n; ++i) {
                let param = choice("abcdefghijklmnopqrstuvwxyz".split(""));
                params.push(param);
                exp += param + ", ";
            }
            let body_env = env.concat(params);
            exp += ") { return " + rand_exp(body_env, m, d) + "; }";
            return "(" + exp + ")";
        default:
            throw new Error("non-exhaustive switch: " + e);
    }
}

function mReply(noti, postObj) {
    const fullText = `@${noti.account.acct} ${postObj.text}`;
    const visibility = postObj.direct ? "direct" : noti.status.visibility;
    const spoiler_text = noti.status.spoiler_text + (postObj.cw ? ` ${postObj.cw}` : '');
    const options = {
        status: fullText,
        in_reply_to_id: noti.status.id,
        visibility,
        spoiler_text,
    };
    console.log('mReply:', options);
    M.post('statuses', options);
}
