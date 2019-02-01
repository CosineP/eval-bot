eval
====

> execute arbitrary javascript and post the result on the fediverse!

the bot: [@eval@beeping.town](https://beeping.town/users/328)  
the script: 
[https://pad.cosine.online/p/eval](https://pad.cosine.online/p/eval?useMonospaceFont=true)

the script
----------

the bot's script is on a text pad at
[https://pad.cosine.online/p/eval](https://pad.cosine.online/p/eval?useMonospaceFont=true).
(it's an [etherpad](https://github.com/ether/etherpad-lite) - you can
collaborate live with folks!)

all code in the script will be executed.
in order to actually toot, the makePost function has to be called somehow.
it is recommended to make an async function that returns a toot (let's call it `getToot`), then do
`getToot().then(makePost)` at the end of the script.

any nodejs 10 javascript is legit!

if there's an error, the bot will toot the error message

behavior
--------

the bot executes **every 6 hours** at this time

to make the toot evaluate it **now** (ie to admire your handiwork), @mention it
with a toot containing `go now`)

