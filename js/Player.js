class Player {
  constructor() {
    this.initialize()
  }

  initialize() {
    this.bindUI()
    this.createContext()
    this.bindEvents()
  }

  bindUI() {
    // canvas
    this.canvas = document.createElement('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    document.body.append(this.canvas)

    // dom
    this.player = document.querySelector('.js-player')
    this.playerButton = this.player.querySelector('.js-player-button')
    this.ctx = this.canvas.getContext("2d")
    this.audioElement = this.player.querySelector(".js-player-source")
    this.progress = this.player.querySelector('.js-player-progress')
    this.isPlaying = false
    this.currentTime = 0

    // ctx
    this.audioCtx = null
    this.analyser = null
    this.source = null
    this.data = null

    if (this.player == void 0) { return }
  }

  bindEvents() {
    this.playerButton.addEventListener('click', this.onClick.bind(this))
    this.audioElement.addEventListener('ended', this.resetPlayer.bind(this))
    // this.audioElement.addEventListener('canplaythrough', this.createContext.bind(this))
    window.addEventListener('resize', this.resize.bind(this))
  }

  resetPlayer() {
    this.isPlaying = false
    this.currentTime = 0
  }

  getDataFromAudio() {
    //analyser.fftSize = 2048;
    var freqByteData = new Uint8Array(this.analyser.fftSize/2);
    var timeByteData = new Uint8Array(this.analyser.fftSize/2);
    this.analyser.getByteFrequencyData(freqByteData);
    this.analyser.getByteTimeDomainData(timeByteData);
    return {f:freqByteData, t:timeByteData}; // array of all 1024 levels
  }

  createContext() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)
    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.fftSize = 2048
    this.source = this.audioCtx.createMediaElementSource(this.audioElement)
    this.source.connect(this.analyser)
    this.source.connect(this.audioCtx.destination)
    requestAnimationFrame(this.loop.bind(this))
  }

  loop() {
    requestAnimationFrame(this.loop.bind(this))
    this.draw()
  }

  draw(data) {
    data = this.getDataFromAudio()
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
    let space = this.canvas.width / data.length

    for (let i = 0; i < data.t.length; i++) {
      this.ctx.fillStyle="red"
      this.ctx.fillRect(i*2, data.t[i], 1, 1)
    }
  }

  onClick(e) {
    let target = e.target
    let title = target.parentNode.dataset.title
    let author = target.parentNode.dataset.author

    this.togglePlayPause()
  }

  togglePlayPause() {
    return this.audioElement.paused ? this.play() : this.pause()
  }

  play() {
    this.audioElement.play()
    this.audioCtx.resume().then(() => {
      this.playerButton.textContent = 'Pause'
      this.isPlaying = true
    })
  }

  pause() {
    this.audioElement.pause()
    this.audioCtx.suspend().then(() => {
      this.playerButton.textContent = 'Play'
      this.isPlaying = false
    })
  }

  resize() {
    let width = this.canvas.clientWidth
    let height = this.canvas.clientHeight

    const needResize = this.canvas.width  !== width || this.canvas.height !== height
    
    if (needResize) {
      this.canvas.width  = width
      this.canvas.height = height
    }

    return needResize;
  }
}

export default Player