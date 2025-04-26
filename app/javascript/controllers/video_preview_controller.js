// import { Controller } from "@hotwired/stimulus"

// export default class extends Controller {
//   static targets = ["video"]

//   connect() {
//     this.videoTarget.preload = "metadata"
//     // Add the duration calculation functionality
//     this.videoTarget.addEventListener('loadedmetadata', () => {
//       // Check if the duration element exists before trying to set it
//       const durationElement = this.element.querySelector('.duration')
//       if (durationElement && this.videoTarget.duration) {
//         const duration = Math.round(this.videoTarget.duration)
//         const minutes = Math.floor(duration / 60)
//         const seconds = duration % 60
//         durationElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`
//       }
//     })
//   }

//   mouseEnter() {
//     // Make sure we can access the video element
//     if (this.hasVideoTarget) {
//       // Hide play overlay
//       const overlay = this.element.querySelector('.play-overlay');
//       if (overlay) overlay.style.opacity = '0';
      
//       this.videoTarget.play().catch(e => {
//         console.error("Error playing video:", e)
//       });
//     }
//   }
  
//   mouseLeave() {
//     // Make sure we can access the video element
//     if (this.hasVideoTarget) {
//       // Show play overlay again
//       const overlay = this.element.querySelector('.play-overlay');
//       if (overlay) overlay.style.opacity = '0.7';
      
//       this.videoTarget.pause();
//       this.videoTarget.currentTime = 0;
//     }
//   }
// }
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["video", "poster"]
  
  connect() {
    console.log("Video preview controller connected")
  }

  mouseEnter() {
    console.log("Mouse entered")
    if (this.hasPosterTarget && this.hasVideoTarget) {
      // Hide poster, show video
      this.posterTarget.style.opacity = "0"
      this.videoTarget.style.opacity = "1"
      
      // Try to play the video
      this.videoTarget.play().catch(e => {
        if (e.name !== 'AbortError') {
          console.error("Error playing video:", e)
        }
      })
    }
  }

  mouseLeave() {
    console.log("Mouse left")
    if (this.hasPosterTarget && this.hasVideoTarget) {
      // Show poster, hide video
      this.posterTarget.style.opacity = "1"
      this.videoTarget.style.opacity = "0"
      
      // Pause the video
      this.videoTarget.pause()
      this.videoTarget.currentTime = 0
    }
  }
}