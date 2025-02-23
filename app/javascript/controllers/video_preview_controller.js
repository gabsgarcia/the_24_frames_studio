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
