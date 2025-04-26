import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["item"]
  
  connect() {
    this.animateItems()
  }
  
  animateItems() {
    // Stagger animation of grid items
    this.itemTargets.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('is-visible')
      }, 100 * index)
    })
  }
}