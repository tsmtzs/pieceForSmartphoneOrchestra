# Piece for Smartphone Orchestra

## About

*Piece for Smartphone Orchestra* is a musical work of indeterminate duration for any number of players.
It expands on the idea of a *system* to produce a dynamic musical structure. According to the
[Merriam-Webster](https://www.merriam-webster.com/dictionary/system) online dictionary, a *system* is
"*a regularly interacting or interdependent group of items forming a unified whole*".
In *Piece for Smartphone Orchestra* the performers form the interacting group of items.
They are distibuted among the audience and act according to a
[text score](score/pieceForSmartphoneOrchestra.pdf).
The piece can be regarded as a potential aural game on
[*beat tones*](https://en.wikipedia.org/wiki/Beat_(acoustics)) and
[*otoacoustic emission effects*](https://en.wikipedia.org/wiki/Otoacoustic_emission).
The document [DISCUSSION.md](DISCUSSION.md) offers a more detailed account on the relationship
between *Piece for Smartphone Orchestra* and systems.

Players use the smartphone to control a specially designed musical instrument. This is a software
synthesizer that can play three sine tones at `1244.507 Hz`, `2489.014 Hz` and `3733.521 Hz`.
The synth is developed using web technologies. In particular, it is
a [progressive web app](https://en.wikipedia.org/wiki/Progressive_web_application) that players
can add to their home screen and use offline. Sound is produced using the
[Web Audio API](https://webaudio.github.io/web-audio-api/).
Players can start/stop a tone by pressing a button. By rotating the device they control
the amplitude and frequency deviation of a playing tone.
The `SuperCollider` document [pieceSimulation.scd](supercollider/pieceSimulation.scd) can
generate an approximation of the resulting sound.

## Software

The software synthesizer of *Piece for Smartphone Orchestra* is a
[PWA](https://en.wikipedia.org/wiki/Progressive_web_application). In particular, it is a three page website.
The homepage offers
a brief description of the piece. Two links direct the player
to the *text score* and *instrument* pages.

The web server is developed on the [`node.js`](https://nodejs.org/en/) runtime environment
with the [`express.js`](https://expressjs.com/) web framework. Web content is distributed over
a `TLS` network.

For more details about the application, please read the [SOFTWARE-SETUP-GUIDE.md](SOFTWARE-SETUP-GUIDE.md).

With all the required software installed, use a terminal to run

```bash
npm run build
```

from within the *Piece for Smartphone Orchestra* directory. Then start the server with

```bash
npm start
```
## License
[![License: CC BY-SA 4.0](https://licensebuttons.net/l/by-sa/4.0/80x15.png)](https://creativecommons.org/licenses/by-sa/4.0/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Piece for Smartphone Orchestra* is distributed under the terms of the
[Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/legalcode)
except the code which is distributed under the terms of the [MIT license](LICENSE).
