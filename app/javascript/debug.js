// Add this as debug.js in your application

// Function to check if ActiveStorage is working properly
function checkActiveStorage() {
    if (typeof ActiveStorage === 'undefined') {
      console.error("❌ ActiveStorage is not defined");
      return false;
    }
    
    if (typeof ActiveStorage.start !== 'function') {
      console.error("❌ ActiveStorage.start is not a function");
      return false;
    }
    
    console.log("✅ ActiveStorage is properly loaded");
    return true;
  }
  
  // Function to check if Stimulus is working properly
  function checkStimulus() {
    if (typeof window.Stimulus === 'undefined') {
      console.error("❌ Stimulus application is not defined in window");
      return false;
    }
    
    const controllerNames = [
      "video-preview",
      "video-modal",
      "video-grid",
      "direct-upload",
      "animate-grid",
      "lazy-load"
    ];
    
    const missingControllers = [];
    
    controllerNames.forEach(name => {
      // Check if controller is registered
      const isRegistered = window.Stimulus.controllers.some(
        controller => controller.identifier === name
      );
      
      if (!isRegistered) {
        missingControllers.push(name);
      }
    });
    
    if (missingControllers.length > 0) {
      console.error(`❌ Missing controllers: ${missingControllers.join(', ')}`);
      return false;
    }
    
    console.log("✅ All Stimulus controllers are properly registered");
    return true;
  }
  
  // Function to check video elements
  function checkVideoElements() {
    const videoElements = document.querySelectorAll('video');
    console.log(`Found ${videoElements.length} video elements on the page`);
    
    if (videoElements.length === 0) {
      console.warn("⚠️ No video elements found on the page");
      return false;
    }
    
    videoElements.forEach((video, index) => {
      console.log(`Video #${index + 1}:`);
      console.log(`- Source: ${video.querySelector('source')?.src || 'No source'}`);
      console.log(`- Type: ${video.querySelector('source')?.type || 'No type'}`);
      console.log(`- Preload: ${video.preload}`);
      console.log(`- Style opacity: ${video.style.opacity}`);
      console.log(`- Display: ${getComputedStyle(video).display}`);
      console.log(`- Is visible: ${isElementVisible(video)}`);
      
      // Check for video errors
      if (video.error) {
        console.error(`❌ Video error: ${getVideoErrorMessage(video.error.code)}`);
      } else {
        console.log("✅ No video errors detected");
      }
    });
    
    return true;
  }
  
  // Helper function to check if an element is visible
  function isElementVisible(element) {
    const style = getComputedStyle(element);
    
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetWidth > 0 &&
           element.offsetHeight > 0;
  }
  
  // Helper function to get video error message
  function getVideoErrorMessage(errorCode) {
    switch(errorCode) {
      case 1: return "MEDIA_ERR_ABORTED: The fetching process was aborted by the user";
      case 2: return "MEDIA_ERR_NETWORK: A network error occurred while fetching the media";
      case 3: return "MEDIA_ERR_DECODE: A decoding error occurred";
      case 4: return "MEDIA_ERR_SRC_NOT_SUPPORTED: The media format is not supported";
      default: return "Unknown error";
    }
  }
  
  // Run diagnostics when the page is fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    console.log("Running video diagnostics...");
    
    setTimeout(() => {
      checkActiveStorage();
      checkStimulus();
      checkVideoElements();
      
      console.log("Diagnostics completed. Check console for results.");
    }, 1000); // Wait 1 second for everything to initialize
  });
  
  // Export functions for direct use in console
  window.videoDebug = {
    checkActiveStorage,
    checkStimulus,
    checkVideoElements,
    isElementVisible
  };
  
  console.log("Debug helper loaded. Use window.videoDebug methods to run diagnostics manually.");