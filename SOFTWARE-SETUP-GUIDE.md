# Software setup

**Table of Contents**

- [Install the required software](#install-the-required-software)
- [Clone repository](#clone-repository)
- [Install `node.js` packages](#install-node.js-packages)
- [Work on a separate `git branch`](#work-on-a-separate-git-branch)
- [Configuration](#configuration)
- [Preparing a performance](#preparing-a-performance)
- [After a performance](#after-a-performance)

## Install the required software

1. `Linux`

	*Piece for Smartphone Orchestra* is developed on a `Linux` environment. In
	particular, scripts from [package.json]() employ 
	[`bash`](https://www.gnu.org/software/bash/) commands. Normally, the `bash` shell should
	be part of any `Linux` distribution.
	
2. [`node.js`](https://nodejs.org/en/) (version `16.7.0`)

	`node.js` is a `JavaScript` runtime environment. Prebuild binaries should be found
	in software repositories of the most common `Linux` distributions.
	On [`Debian`](https://www.debian.org/) based systems, install it with
	
	```bash
	sudo apt-get install nodejs
	```

3. [`npm`](https://docs.npmjs.com/cli/v7/commands/npm) (version `7.21.0`)

	`npm` is a package manager for `node.js`. Install it from the package repository
	of your `Linux` distribution.

4. [`mkcert`](https://github.com/FiloSottile/mkcert) (version `1.4.3`)

	The web server of *Piece for Smartphone Orchestra* distributes content over a TLS network.
	`mkcert` is an easy to use program that produces TLS certificates for local networks.
	To install it follow the directions in
	[mkcert-installation](https://github.com/FiloSottile/mkcert#installation).
	
5. [`git`](https://git-scm.com/) (version `2.33.0`)

	`git` is a version control system. Install it from the package repository of your `Linux`
	distribution.

### Optional

- [`SuperCollider`](https://supercollider.github.io/) (version `3.12.0`) is an environment
	and programming language for audio synthesis and algorithmic composition. Install it
	if you would like to hear a crude approximation of the piece. In such a case, use the
	`SuperCollider` document [pieceSimulation.scd](supercollider/pieceSimulation.scd).
- [`TeX Live`](https://www.tug.org/texlive/) is `TeX` distribution. It is used with the
	documents [pieceForSmartphoneOrchestra.tex](score/pieceForSmartphoneOrchestra.tex)
	and [pieceForSmartphoneOrchestraIcon.tex](tikz/pieceForSmartphoneOrchestraIcon.tex)
	to produce the [text score](score/pieceForSmartphoneOrchestra.pdf) and the PWA
	[icon](src/icons/smartphoneOrchestraIcon_192x192.png), respectively. Both
	`TeX` documents use the `tikz` package for graphics.

## Clone repository

Open a `bash` shell and change directory to an appropriate place. Run

```bash
git clone ???
```

to download the `pieceForSmartphoneOrchestra` repository. Now, change directory
to `pieceForSmartphoneOrchestra`

```bash
cd pieceForSmartphoneOrchestra
```
## Install `node.js` packages

The web application of the piece is developed on [`node.js`](https://nodejs.org/en/) with
 the [`express`](https://expressjs.com/) framework. [`minimist`](https://github.com/substack/minimist)
is used for parsing command line arguments. The application is bundled with
[`parcel`](https://parceljs.org/). A manifest for the PWA service worker is generated with
[`parcel-config-precache-manifest`](https://github.com/101arrowz/precache-manifest/tree/master/packages/parcel-config-precache-manifest).
	
To install all the required `node.js` packages run

```bash
npm install
```

## Work on a separate `git branch`

For a performance it is convenient to fork off the `master` `git` branch. First, switch to branch `master`

```bash
git switch master
```

Then create a new branch and switch to it

```bash
git checkout -b performance@MonsAgnes
```

## Configuration
