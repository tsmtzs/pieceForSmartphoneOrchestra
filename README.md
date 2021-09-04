# Piece for Smartphone Orchestra

## About

*Piece for Smartphone Orchestra* is a musical work of indeterminate duration for any number of players.
It expands on the notion of a *system* to produce a dynamic musical structure. According to the
[Merriam-Webster](https://www.merriam-webster.com/dictionary/system) online dictionary, a *system* is
"*a regularly interacting or interdependent group of items forming a unified whole*".
In *Piece for Smartphone Orchestra* the performers form the interacting group of items.
They are distibuted among the audience and act according to a [~text score~]().
The piece can be regarded as a potential aural game on
[*beat tones*](https://en.wikipedia.org/wiki/Beat_(acoustics)) and
[*otoacoustic emission effects*](https://en.wikipedia.org/wiki/Otoacoustic_emission).

Players use the smartphone to control a specially designed musical instrument. This is a software
synthesizer that can play three sine tones at `1244.507 Hz`, `2489.014 Hz` and `3733.521 Hz`
(an E flat in three octaves). The synth is developed using web technologies. In particular, it is
a [PWA](https://en.wikipedia.org/wiki/Progressive_web_application) that players can add to their
home screen and use offline. Sound is produced using the
[Web Audio API](https://webaudio.github.io/web-audio-api/).
Players can start/stop a tone by pressing a button. By rotating the device they control
the amplitude and frequency deviation of a playing tone.

**link to _DISCUSSION.md_**
The `SuperCollider` document [pieceSimulation.scd]() can produce an approximate of the resulting sound.

## Software

The software synthesizer of *Piece for Smartphone Orchestra* is a
[progressive web app]((https://en.wikipedia.org/wiki/Progressive_web_application)). The homepage offers
a brief description of the piece along with a reduction of the instrument. Two links direct the player
to the *text score* and the *instrument*.

The web server is developed on the [`node.js`](https://nodejs.org/en/) runtime environment
with the [`express.js`](https://expressjs.com/) web framework. Web content is distributed over
a `TLS` network. Locally trusted certificates for this are generated with
[`mkcert`](https://github.com/FiloSottile/mkcert).

For more details on the application, please read the [SOFTWARE_SETUP_GUIDE.md]()

With all the required software installed, use a terminal to run

```bash
npm run build
```

from within the *Piece for Smartphone Orchestra* directory. Then start the server with

```bash
npm start
```

(add a TODO.org doc?)

## Prepare a performance

* Χώρος παρουσίασης (αιθουσα συναυλιών - εξωτερικός χώρος) (όχι? μην τα αναφαίρεις αυτά?)
* αριθμός εκτελεστών, κατανομή στο χώρο, κίνηση εκτελεστών, ερμηνεία της παρτιτούρας,
	τρόπος που γίνονται οι πρόβες, όχι διευθυντής ορχήστρας,

## License

CC -- MIT

*Piece for Smartphone Orchestra* is distributed under the terms of CC license except the code
which is distributed under the terms of the MIT license.
