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
  #context

  static of ({ freq = 440, amp = 0.1, detune = 0.0, fadeIn = 0.1, fadeOut = 0.1, type = 'sine', context } = {}) {
    return new Oscillator({ freq, amp, detune, fadeIn, fadeOut, type, context })
  }

  constructor ({ freq = 440, amp = 0.1, detune = 0.0, fadeIn = 0.1, fadeOut = 0.1, type = 'sine', context } = {}) {
    this.#freq = freq
    this.#amp = amp
    this.#detune = detune
    this.#fadeIn = fadeIn
    this.#fadeOut = fadeOut
    this.#type = type
    this.#isPlaying = false
    this.#context = context
  }

  start ({ out, freq, amp, detune, fadeIn, type, time = 0.0 } = {}) {
    if (!this.#isPlaying) {
      this.#context.resume()
      this.#source = this.#context.createOscillator()
      this.#source.type = type ?? this.#type ?? 'sine'
      this.#source.frequency.value = freq ?? this.#freq ?? 440
      this.#source.detune.value = detune ?? this.#detune ?? 0.0

      const startTime = this.#context.currentTime + time
      const amplitude = amp ?? this.#amp ?? 0.1
      this.#gain = this.#context.createGain()
      this.#gain.gain.value = 0.0
      this.#gain.gain.linearRampToValueAtTime(amplitude, startTime + (fadeIn ?? this.#fadeIn ?? 0.1))

      this.#source.connect(this.#gain)
      this.#gain.connect(out ?? this.#context.destination)

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
      const t0 = this.#context.currentTime + time
      const t1 = this.#context.currentTime + time + fadeTime

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
      const t0 = this.#context.currentTime + time

      this.#amp = amp

      this.#gain.gain.cancelScheduledValues(t0)
      this.#gain.gain.setValueAtTime(this.#gain.gain.value, t0)
      this.#gain.gain.linearRampToValueAtTime(amp, t0 + dt)
    }

    return this
  }

  setFreq ({ time = 0.0, freq = 440, dt = 0.001 } = {}) {
    if (this.#isPlaying) {
      const t0 = this.#context.currentTime + time

      this.#freq = freq

      this.#source.frequency.cancelScheduledValues(t0)
      this.#source.frequency.setValueAtTime(this.#source.frequency.value, t0)
      this.#source.frequency.exponentialRampToValueAtTime(freq, t0 + dt)
    }

    return this
  }

  setDetune ({ time = 0.0, detune = 0.1, dt = 0.0001 } = {}) {
    if (this.#isPlaying) {
      const t0 = this.#context.currentTime + time

      this.#detune = detune

      this.#source.detune.cancelScheduledValues(t0)
      this.#source.detune.setValueAtTime(this.#source.detune.value, t0)
      this.#source.detune.linearRampToValueAtTime(detune, t0 + dt)
    }

    return this
  }
}

export {
  Oscillator
}
