// Import and register all your controllers from the importmap via controllers/**/*_controller

import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"
eagerLoadControllersFrom("controllers", application)


// Import and register controllers with Stimulus
import { application } from "./application"

// Import and register controllers
import VideoPreviewController from "./video_preview_controller"
import VideoModalController from "./video_modal_controller"
import VideoGridController from "./video_grid_controller"
import DirectUploadController from "./direct_upload_controller"
import AnimateGridController from "./animate_grid_controller"
import LazyLoadController from "./lazy_load_controller"

// Register each controller
application.register("video-preview", VideoPreviewController)
application.register("video-modal", VideoModalController)
application.register("video-grid", VideoGridController)
application.register("direct-upload", DirectUploadController)
application.register("animate-grid", AnimateGridController)
application.register("lazy-load", LazyLoadController)

// Import stimulus modules from @hotwired/stimulus-loading if needed
// import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"
// eagerLoadControllersFrom("controllers", application)