# Software setup guide

**Table of Contents**

- [Install the required software](#install-the-required-software)
- [Clone the repository](#clone-the-repository)
- [Install `node.js` packages](#install-node.js-packages)
- [Work on a separate `git branch`](#work-on-a-separate-git-branch)
- [Build the app](#build-the-app)
- [Run localy in development mode](#run-localy-in-development-mode)
- [After a performance](#after-a-performance)

## Install the required software

1. `Linux`

	*Piece for Smartphone Orchestra* is developed on a `Linux` environment. In
	particular, scripts from [package.json](package.json) employ
	[`bash`](https://www.gnu.org/software/bash/) commands. Normally, the `bash` shell should
	be part of any `Linux` distribution.

2. [`node.js`](https://nodejs.org/en/) (version `21.6.0`)

	`node.js` is a `JavaScript` runtime environment. Prebuild binaries should be found
	in package repositories of the most common `Linux` distributions.

3. [`npm`](https://docs.npmjs.com/cli/v7/commands/npm) (version `10.3.0`)

	`npm` is a package manager for `node.js`. Install it from the package repository
	of your `Linux` distribution.

5. [`git`](https://git-scm.com/) (version `2.43.0`)

	`git` is a version control system. Install it from the package repository of your `Linux`
	distribution.

### Optional

- [`SuperCollider`](https://supercollider.github.io/) (version `3.13.0`) is an environment
	and programming language for audio synthesis and algorithmic composition. Install it
	if you would like to hear a crude approximation of the piece. In such a case, use the
	`SuperCollider` document [pieceSimulation.scd](supercollider/pieceSimulation.scd).
	The document [otoacousticEmissionTests.scd](supercollider/otoacousticEmissionTests.scd)
	offers some simple tests on *auditory distortion products*.
- [`TeX Live`](https://www.tug.org/texlive/) is a `TeX` distribution. Use `XeLaTeX` (part of `TeX Live`)
	to render the
	documents [pieceForSmartphoneOrchestra.tex](score/pieceForSmartphoneOrchestra.tex)
	and [pieceForSmartphoneOrchestraIcon.tex](tikz/pieceForSmartphoneOrchestraIcon.tex).
	The output of the first will be the [text score](score/pieceForSmartphoneOrchestra.pdf).
	The second one will produce the PWA
	[icon](src/icons/smartphoneOrchestra_192x192.png) of the website. Both
	`TeX` documents use the `tikz` package for graphics.

## Clone the repository

Open a `bash` shell and change directory to an appropriate place. Run

```bash
git clone https://github.com/tsmtzs/pieceForSmartphoneOrchestra.git
```

to download the `pieceForSmartphoneOrchestra` repository. Change directory
to `pieceForSmartphoneOrchestra`

```bash
cd pieceForSmartphoneOrchestra
```

## Install `node.js` packages

The web application of the piece is developed with the [`Astro`](https://astro.build/) web framework.
To install all the required packages run

```bash
npm install
```

## Work on a separate `git branch`

For a performance it is convenient to fork off the `master` `git` branch. First, switch to `master`

```bash
git switch master
```

Then create a new branch and switch to it

```bash
git checkout -b performance@MonsAgnes
```

## Build the app

At this step we assume that you are inside the `pieceForSmartphoneOrchestra` directory, have
installed the necessary `node.js` packages and switched to a newly created `git` branch named
`performance@MonsAgnes` on top of `master`.

Open a terminal and run the `npm` script `build`:

```bash
npm run build
```

This will create the directory `dist`. You can now deploy the app by following the [`deployment guide`](https://docs.astro.build/en/guides/deploy/)
from `Astro`.

## Run localy in development mode

With the command

```bash
npm run dev
```

you can run the app on a local network. The output will contain a URL of the form `https://<IP>:<PORT>` just after
the word `Network`. Players can, now, open the browser and navigate to `https://<IP>:<PORT>`.
Upon first visit, a warning like *Your connection is not private*
or *Your connection is not secure* might appear. Bypass the warning by clicking `Advanced` and then
`Proceed to https://<IP>:<PORT>`.

## After a performance

Checkout the branch `master` and delete the branch of the performance
```bash
git checkout master
git branch -D performance@MonsAgnes
```
