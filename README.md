eval
====

> evaluate arbitrary javascript and post the result on the fediverse!

the bot: [@eval@beeping.town](https://beeping.town/users/328)  
the script: 
[https://pad.cosine.online/p/eval](https://pad.cosine.online/p/eval?useMonospaceFont=true)

the script
----------

the bot's script is on a text pad at
[https://pad.cosine.online/p/eval](https://pad.cosine.online/p/eval?useMonospaceFont=true).
(it's an [etherpad](https://github.com/ether/etherpad-lite) - you can
collaborate live with folks!)

the LAST expression in the script is what will be tooted

so for example

    "string one"
	"string two"

will toot `string two`. [details](https://stackoverflow.com/a/7399078/1556332)

any nodejs 10 javascript is legit!

behavior
--------

the bot evaluates and toots the result **every 3 hours** at this time

if there's an error, the bot will toot the error message

to make the toot evaluate it now (ie to admire your handiwork), @mention it
with a toot containing `go now`)

