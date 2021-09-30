# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
### Changed
### Removed

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
