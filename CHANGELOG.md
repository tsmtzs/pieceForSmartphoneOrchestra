# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
### Changed
### Removed

## [2.1.0] - 2022-06-19
### Added
- File `backend/app.mjs`.
- Files `src/javascript/functions.mjs` and `src/javascript/mathFunctions.mjs`.
- File `src/javascript/parameters.mjs`: Constants `BTN_BORDER`, `SCREEN_UP_VECTOR`, `DISPLAY_TOP_VECTOR`.
- File `src/views/index.html`: `p` element with class `named` added.
- File `src/stylesheet.css`: Selector `#name` added.
- [`mocha`](https://mochajs.org/) tests added:
	- New files under `test/client`: `eventDispatcher-spec.mjs`, `functions-spec.mjs`, `mathFunctions-spec.mjs`, `state-spec.mjs`.
### Changed
- File `server.js` moved to `backend/server.mjs`. The `express` app is imported from `backend/app.mjs`.
- Private fields and methods used in classes for JavaScript files under `src/javascript`.
- File `src/javascript/index.js`: The file now only registers the service worker.
- File `src/javascript/instrument.js`:
  - The file imports objects from `functions.mjs`, `parameters.mjs`, `sounds.mjs` and `state.mjs`.
  - Constant `sensor` holds an instance of `RelativeOrientationSensor`.
- File `src/javascript/parameters.mjs`: All constants renamed. Capital letters were used.
- File `src/javascript/functions.mjs`:
	- Function `createSoundObjectsForState`: Key `freq` changes to `(2 ** aStateIndex) * BASE_FREQ`.
- Files `src/views/index.html`, `src/views/directions.html`, `src/views/instrument.html`: Bug corrected in the element `meta name=viewport`.
### Removed
- From file `src/javascript/eventDispatchers`: class `OneShotEventDispatcher`.
- Files `src/javascript/functionsForPiece.mjs` and `src/javascript/generalFunctions.mjs`.
- In the file `src/javascript/parameters.mjs`: Constant `refToneAmp`.
- In the file `src/stylesheet.css`: Selectors `main h2.otherH2`, `button.switch`, `button.switch span`, `[role-switch][aria-checked]`, `label.switch`.
- In the file `src/views/index.html`: Section under the `h2` header element with `class=otherH2`.

## [2.0.0] - 2021-09-30
### Added
- The [`parcel`](https://parceljs.org/) application bundler is used.
- Directory `src` with prebuild files for `parcel`.
- File `src/javascript/parameters.mjs`.
- File `supercollider/otoacousticEmissionTests.scd`.
### Changed
- File `server.js`:
	- The `minimist` `npm` package is used.
	- The `setUncaughtExceptionCaptureCallback` is set.
	- Server response sets the header `Service-Worker-Allowed`.
- Directories `views`, `public/javascript`, `public/icons` moved under `src`.
- Files `public/smartphoneOrchestra.webmanifest`, `public/stylesheet.css` moved under `src`.
- File `public/sw.js` moved to `src/serviceWorker.js`. The
[`parcel-config-precache-manifest`](https://github.com/101arrowz/precache-manifest/tree/master/packages/parcel-config-precache-manifest) `npm` package is used to set the property `self.__precacheManifest`.
- File `instument.html`: new `div` element with `ID` `bar` added.
- File `functionsForPiece.js`: new functions added. Updates in `index.js` and `instrument.js`.
- Modifications in the [score](score/pieceForSmartphoneOrchestra.tex).
- File `supercollider/pieceASimulation.scd` renamed as `supercollider/pieceSimulation.scd`.

## [1.0.0] - 2021-08-13
### Added
- File `server.js`.
- Directory `views`.
- Files `directions.html`, `index.html`, `instrument.html` under `views`.
- Directory `public`.
- Files `smartphoneOrchestra.webmanifest`, `sw.js`, `stylesheet.css` under `public`.
- Directories `icons`, `javascript` under `public`.
- Files `smartphoneOrchestraIcon_192x192.png`, `smartphoneOrchestraIcon_512x512.png` under `public/icons`.
- Files `directions.js`, `eventDispatchers.mjs`, `functionsForPiece.mjs`, `generalFunctions.mjs`, `hnl.mobileConsole.js`, `index.js`, `instrument.js`, `state.mjs`, `synth.mjs` under `public/javascript`.
- Directory `score`.
- File `pieceForSmartphoneOrchestra.tex` under `score`.
- Directory `tikz`.
- File `pieceForSmartphoneOrchestraIcon.tex` under `tikz`.
- Directory `supercollider`.
- File `pieceASimulation.scd` under `supercollider`.
