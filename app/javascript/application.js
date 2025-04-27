// Entry point for the build script
import "@hotwired/turbo-rails"
import * as ActiveStorage from "@rails/activestorage"
import "bootstrap"

// Import our simple videos.js file
import "./videos"

// Start ActiveStorage
ActiveStorage.start()

console.log("Application JS loaded")