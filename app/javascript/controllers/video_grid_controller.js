import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["grid", "filter"]

  connect() {
    this.initializeHoverEffects()
  }

  filter(event) {
    event.preventDefault()
    const category = event.currentTarget.dataset.category

    this.gridTarget.querySelectorAll('.grid-item').forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = 'block'
      } else {
        item.style.display = 'none'
      }
    })
  }

  initializeHoverEffects() {
    this.gridTarget.querySelectorAll('video').forEach(video => {
      video.parentElement.addEventListener('mouseenter', () => {
        video.play()
      })

      video.parentElement.addEventListener('mouseleave', () => {
        video.pause()
        video.currentTime = 0
      })
    })
  }

  handleScroll() {
    // Implement infinite scroll if needed
  }
}
