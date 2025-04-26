import { Controller } from "@hotwired/stimulus"
import { DirectUpload } from "@rails/activestorage"

export default class extends Controller {
    static targets = ["input", "progress", "preview", "status", "form"]
  
    connect() {
        this.inputTarget.addEventListener('change', this.handleFileSelect.bind(this))
    }
  
    handleFileSelect(event) {
        const file = event.target.files[0]
        if (file) {
            this.createVideoPreview(file)
            this.statusTarget.textContent = "File selected, preparing upload..."
        
        // Check if we're in development (using local storage) or production (using Cloudinary)
            if (this.element.dataset.useCloudinary === 'true') {
            this.setupCloudinaryUpload(file)
            } else {
            this.setupDirectUpload(file)
            }
        }
    }
  
    // This function is for Active Storage direct uploads
    setupDirectUpload(file) {
        const url = this.inputTarget.dataset.directUploadUrl
        const upload = new DirectUpload(file, url, this)
    
        upload.create((error, blob) => {
            if (error) {
                this.statusTarget.textContent = `Error: ${error}`
            } else {
                // Create hidden input with blob signed ID
                const hiddenField = document.createElement('input')
                hiddenField.setAttribute("type", "hidden")
                hiddenField.setAttribute("name", this.inputTarget.getAttribute("name"))
                hiddenField.setAttribute("value", blob.signed_id)
                this.element.appendChild(hiddenField)
                
                // Update status
                this.statusTarget.textContent = "Upload complete!"
            }
        })
    }
  
    // DirectUpload delegate methods
    directUploadWillStoreFileWithXHR(xhr) {
        xhr.upload.addEventListener("progress", event => {
            const progress = event.loaded / event.total * 100
            this.progressTarget.style.width = `${progress}%`
            this.progressTarget.textContent = `${Math.round(progress)}%`
        })
    }
  
    createVideoPreview(file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const video = document.createElement('video')
            video.src = e.target.result
            video.controls = true
            video.setAttribute('class', 'img-fluid mt-2')
            this.previewTarget.innerHTML = ''
            this.previewTarget.appendChild(video)
        }
        reader.readAsDataURL(file)
    }
}