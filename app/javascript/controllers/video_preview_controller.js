// app/javascript/controllers/video_preview_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["video"]

  connect() {
    this.videoTarget.preload = "metadata"
  }

  mouseEnter() {
    this.videoTarget.currentTime = 0
    this.videoTarget.play()
  }

  mouseLeave() {
    this.videoTarget.pause()
    this.videoTarget.currentTime = 0
  }
}
connect() {
  this.videoTarget.preload = "metadata"
  this.videoTarget.addEventListener('loadedmetadata', () => {
    const duration = Math.round(this.videoTarget.duration)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    this.element.querySelector('.duration').textContent =
      `${minutes}:${seconds.toString().padStart(2, '0')}`
  })
}
