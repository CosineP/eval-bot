eval
====

> give an authenticated fediverse client to arbitrary javascript

the bot: [@eval@beeping.town](https://beeping.town/users/328)  
the script: 
[https://pad.cosine.online/p/eval](https://pad.cosine.online/p/eval?useMonospaceFont=true)

behavior
--------

let's call this repository the 'runner.' it is surprisingly (and increasingly)
minimal

**every 4 hours**\* the script is evaluated, and in the returned context,
`interval()` is called with no arguments

**every time a notification is received** the script is evaluated, and in the
returned context, `notification(noti)` is called, where noti is the
[received notification](https://docs.joinmastodon.org/entities/notification/)

*in either case*, **if an error is thrown** either while evaluating the
script or while calling the relevant function, the error and stack trace are
normalized, stringified, and posted as a public status by the account

\* excluding times between 1am and 7:59am Eastern Time

script context
--------------

the following identifiers (and some irrelevant ones) are provided to the
script's evaluation context:

- M: the megalodon authenticated client: <https://github.com/h3poteto/megalodon/tree/2.1.1>
- request: npm module: <https://github.com/request/request/tree/v2.88.0>
- Etherpad: npm module: <https://github.com/tomassedovic/etherpad-lite-client-js/tree/v0.9.0>
- makePost: simple post. (text: string, spoiler_text: string) => void
- getProgram: get the contents of the etherpad. () => Promise<string>


etherpad
--------

the bot's script is on a text pad at
[https://pad.cosine.online/p/eval](https://pad.cosine.online/p/eval?useMonospaceFont=true)

this is one document on an instance of
[etherpad lite](https://github.com/ether/etherpad-lite) hosted on my server,
which allows you to collaborate live with folks!

the instance
------------

the actual runner, and therefore script, is running Node, v16.3.0

as of this writing, the script follows a general design strategy of placing
functions that return text (hijinks) into an array/object, out of which one is
selected at random, and has its result posted. this has proven effective for
collaboration
