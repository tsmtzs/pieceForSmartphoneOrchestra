# Software setup guide

**Table of Contents**

- [Install the required software](#install-the-required-software)
- [Clone the repository](#clone-the-repository)
- [Install `node.js` packages](#install-node.js-packages)
- [Work on a separate `git branch`](#work-on-a-separate-git-branch)
- [Configuration](#configuration)
- [Build the app](#build-the-app)
- [Start the web server](#start-the-web-server)
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

## Configuration

The *Piece for Smartphone Orchestra* web application uses four environment variables. These are

- `httpPort`: The port number for the non encrypted `HTTP` requests. Default value: `8080`.
- `httpsPort`: Port number for the TLS encrypted `HTTP` requests. Default value: `8443`.
- `serverIP`: The IP of the web server. Default value: `192.168.10.2`.
- `domainName`: The domain name of the application. Default value: `""` (empty string).

These are defined and set in [package.json](package.json) under the `config` key.

## Build the app

At this step we assume that you are inside the `pieceForSmartphoneOrchestra` directory, have
installed the necessary `node.js` packages and switched to a newly created `git` branch named
`performance@MonsAgnes` on top of `master`. Environment variables hold their default values.

Open a terminal and run the `npm` script `build`:

```bash
npm run build
```

This will:

- create the directory `certs`,
- call `mkcert` to create the certificates `certs/smartphoneOrchestra-crt.pem` and
	`certs/smartphoneOrchestra-key.pem` valid for `localhost`, `serverIP` and `domainName`.
- create the directory `build`,
- call `parcel` to bundle the web app and save production files under `build`,
- copy `mkcert`'s root certificate `rootCA.pem` under `build`.

## Start the web server

Start the server with

```bash
npm start
```

Players can, now, open the browser and navigate to `http://serverIP:httpPort`,
`https://serverIP:httpsPort` or `http://domainName:httpPort`. In this guide these
should be `http://192.168.10.2:8080` etc. Upon first visit, a warning like *Your connection is not private*
or *Your connection is not secure* might appear. This happens because the browser can't recognize the
TLS certificates generated with `mkcert`. Bypass the warning by clicking `Advanced` and then
`Proceed to https://192.168.10.2:8443`.

Users can download the app and use it offline. For this to work they should, first, install `mkcert`'s
root certificate to their device trust store. To download the certificate navigate to
`https://192.168.10.2:8443/rootCA.pem`. Installation to the trust store is device depended.
In some cases, a message for installation will appear after the download is complete. In other cases
the user should manually install it from the `Settings` menu of his/hers device. After the certificate
is installed,
users can visit `https://192.168.10.2:8443` and select `Add to home screen` from browser's menu.

## After a performance

Checkout the branch `master` and delete the branch of the performance
```bash
git checkout master
git branch -D performance@MonsAgnes
```

Assist performers to

- delete the *Piece for Smartphone Orchestra* app,
- delete the root certificate from their device trust store.
