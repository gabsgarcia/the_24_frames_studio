import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["video"]
  
  connect() {
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver()
    } else {
      // Fallback for older browsers
      this.videoTargets.forEach(video => {
        this.loadVideo(video)
      })
    }
  }
  
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    }
    
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadVideo(entry.target)
          observer.unobserve(entry.target)
        }
      })
    }, options)
    
    this.videoTargets.forEach(video => {
      this.observer.observe(video)
    })
  }
  
  loadVideo(videoElement) {
    const source = videoElement.querySelector('source')
    if (source && source.dataset.src) {
      source.src = source.dataset.src
      videoElement.load()
    }
  }
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}