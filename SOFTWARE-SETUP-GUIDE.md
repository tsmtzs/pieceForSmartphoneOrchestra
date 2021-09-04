# Software setup

**Table of Contents**

- [Install the required software](#install-the-required-software)
- [Clone the `humanSoundSculpture` repository](#clone-the-humansoundsculpture-repository)
- [Install `node.js` packages](#install-node.js-packages)
- [Work on a separate `git branch`](#work-on-a-separate-git-branch)
- [Configuration](#configuration)
- [Preparing a performance](#preparing-a-performance)
- [After a performance](#after-a-performance)

## Install the required software

1. `Linux`

	*Piece for Smartphone Orchestra* is developed on a `Linux` environment. In
	particular, scripts from [package.json]() employ 
	[`bash`](https://www.gnu.org/software/bash/) commands. Normally, `bash` should
	be part of any `Linux` distribution.
	
2. [`node.js`](https://nodejs.org/en/) (version `16.7.0`)

	`node.js` is a `JavaScript` runtime environment. Prebuild binaries should be found
	in software repositories of the most common `Linux` distributions. On
	[`Debian`](https://www.debian.org/) based systems, install it with
	
	```bash
	sudo apt-get install nodejs
	```

3. [`npm`](https://docs.npmjs.com/cli/v7/commands/npm) (version `7.21.0`)

	`npm` is a package manager for `node.js`. Install it from the package repository
	of your `Linux` distribution.

4. [`mkcert`](https://github.com/FiloSottile/mkcert) (version `1.4.3`)

	The web server of *Piece for Smartphone Orchestra* distributes content on a TLS network.
	`mkcert` is an easy to use program that produces TLS certificates for local networks.
	To install it follow the directions in
	[mkcert-installation](https://github.com/FiloSottile/mkcert#installation).

### Optional

	
