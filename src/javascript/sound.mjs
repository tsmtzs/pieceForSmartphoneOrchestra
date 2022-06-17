/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Sound object.
// //////////////////////////////////////////////////
class Oscillator {
  #freq
  #amp
  #detune
  #fadeIn
  #fadeOut
  #type
  #isPlaying
  #source
  #gain

  static of ({ freq = 440, amp = 0.1, detune = 0.0, fadeIn = 0.1, fadeOut = 0.1, type = 'sine' } = {}) {
    return new Oscillator({ freq, amp, detune, fadeIn, fadeOut, type })
  }

  constructor ({ freq = 440, amp = 0.1, detune = 0.0, fadeIn = 0.1, fadeOut = 0.1, type = 'sine' } = {}) {
    this.#freq = freq
    this.#amp = amp
    this.#detune = detune
    this.#fadeIn = fadeIn
    this.#fadeOut = fadeOut
    this.#type = type
    this.#isPlaying = false
  }

  start ({ out, freq, amp, detune, fadeIn, type, time = 0.0 } = {}) {
    if (!this.#isPlaying) {
      this.#source = Sound.context.createOscillator()
      this.#source.type = type ?? this.#type ?? 'sine'
      this.#source.frequency.value = freq ?? this.#freq ?? 440
      this.#source.detune.value = detune ?? this.#detune ?? 0.0

      const startTime = Sound.context.currentTime + time
      const amplitude = amp ?? this.#amp ?? 0.1
      this.#gain = Sound.context.createGain()
      this.#gain.gain.value = 0.0
      this.#gain.gain.linearRampToValueAtTime(amplitude, startTime + (fadeIn ?? this.#fadeIn ?? 0.1))

      this.#source.connect(this.#gain)
      this.#gain.connect(out ?? Sound.destination)

      this.#source.start(startTime)

      this.#switchIsPlaying()
    }
  }

  #switchIsPlaying () {
    this.#isPlaying = !this.#isPlaying
  }

  stop ({ fadeOut, time = 0.0 } = {}) {
    if (this.#isPlaying) {
      const fadeTime = fadeOut ?? this.#fadeOut ?? 0.1
      const t0 = Sound.context.currentTime + time
      const t1 = Sound.context.currentTime + time + fadeTime

      this.#gain.gain.cancelScheduledValues(t0)
      this.#gain.gain.setValueAtTime(this.#gain.gain.value, t0)
      this.#gain.gain.exponentialRampToValueAtTime(1e-8, t1)
      this.#source.stop(t1)

      setTimeout(this.disconnect.bind(this), (time + fadeTime + 0.01) * 1000)
      this.#switchIsPlaying()
    }
  }

  disconnect () {
    if (this.#isPlaying) {
      this.#gain.disconnect()
      this.#source.disconnect()

      this.#switchIsPlaying()
    }
  }

  setAmp ({ time = 0.0, amp = 0.1, dt = 0.0001 } = {}) {
    if (this.#isPlaying) {
      const t0 = Sound.context.currentTime + time

      this.#amp = amp

      this.#gain.gain.cancelScheduledValues(t0)
      this.#gain.gain.setValueAtTime(this.#gain.gain.value, t0)
      this.#gain.gain.linearRampToValueAtTime(amp, t0 + dt)
    }

    return this
  }

  setFreq ({ time = 0.0, freq = 440, dt = 0.001 } = {}) {
    if (this.#isPlaying) {
      const t0 = Sound.context.currentTime + time

      this.#freq = freq

      this.#source.frequency.cancelScheduledValues(t0)
      this.#source.frequency.setValueAtTime(this.#source.frequency.value, t0)
      this.#source.frequency.exponentialRampToValueAtTime(freq, t0 + dt)
    }

    return this
  }

  setDetune ({ time = 0.0, detune = 0.1, dt = 0.0001 } = {}) {
    if (this.#isPlaying) {
      const t0 = Sound.context.currentTime + time

      this.#detune = detune

      this.#source.detune.cancelScheduledValues(t0)
      this.#source.detune.setValueAtTime(this.#source.detune.value, t0)
      this.#source.detune.linearRampToValueAtTime(detune, t0 + dt)
    }

    return this
  }
}

// Sound initializes the Web Audio API.
// Acts as container for.allStates sound objects of the piece.
class Sound {
  // 'objectPool' holds instances of Sound.
  // key: A user supplied name for a synth
  // value: An instance of Sound which holds a synth.
  // key-value pairs are added in 'soundObject' whenever
  // the user provides a 'name' key in Sound.of argument
  // object.
  // E.x: Sound.of({ type: Oscillator, name: 'synth1', params: { freq: 400 } })
  static #objectPool = new Map()
  // Each key of 'types' is the name for a synth.
  // The value points to a synth object (Oscillator, FmSynth...)
  static #types = new Map()

  #soundObject

  // --------------------------------------------------
  // Class methods
  // --------------------------------------------------
  static init () {
    if (!this.context) {
      this.context = new AudioContext()
      this.destination = this.context.destination
    }
  }

  static of ({ type, name, params = {} } = {}) {
    // CAUTION This may cause an error if 'type' does not exist.
    const object = new Sound({ type, params })

    this.#objectPool.set(name, object)

    return object
  }

  // Get.allStates synth types from 'types' Map.
  static get types () {
    return Array.from(this.#types.keys())
  }

  // Return.allStates sound object names from 'objectPool'.
  static objectNames () {
    return Array.from(this.#objectPool.keys())
  }

  // Delete the sound object with the supplied name.
  static delete (name, params = {}) {
    this.#objectPool.get(name)?.stop(params)
    this.#objectPool.delete(name)
  }

  // Delete.allStates sound objects from objectPool
  static deleteAll (params = {}) {
    this.#objectPool.forEach(object => object.stop(params))
    this.#objectPool.clear()
  }

  static start (name, params = {}) {
    this.#objectPool.get(name)?.start(params)
  }

  static stop (name, params = {}) {
    this.#objectPool.get(name)?.stop(params)
  }

  static perform (name, params = {}) {
    this.#objectPool.get(name)?.perform(params)
  }

  static get (name) {
    return this.#objectPool.get(name)
  }

  static getType (type) {
    return this.#types.get(type)
  }

  static setType (type, synth) {
    this.#types.set(type, synth)
  }

  constructor ({ type, params } = {}) {
    this.#soundObject = Sound.getType(type)?.of(params)
  }

  start (params = {}) {
    this.#soundObject?.start(params)

    return this
  }

  stop (params = {}) {
    this.#soundObject?.stop(params)

    return this
  }

  // method: A string. Method name of the soundObj.
  // params: A parameter object to be passed to soundObj[method]
  perform (method, params = {}) {
    // CAUTION Error when soundObj[method] doesn't accept an object as
    // argument
    this.#soundObject[method]?.(params)

    return this
  }
}

Sound.setType('Oscillator', Oscillator)

export {
  Sound
}
