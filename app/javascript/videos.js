// Simple video functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log("Videos.js loaded");
  
  // Video cards hover effect
  const videoCards = document.querySelectorAll('.video-thumbnail');
  console.log(`Found ${videoCards.length} video thumbnails`);
  
  videoCards.forEach(card => {
    const video = card.querySelector('video');
    const poster = card.querySelector('.poster-image');
    
    if (!video || !poster) {
      console.log("Card missing video or poster element", card);
      return;
    }
    
    // Set up duration display
    video.addEventListener('loadedmetadata', function() {
      const durationElement = card.querySelector('.duration');
      if (durationElement && !isNaN(video.duration)) {
        const duration = Math.round(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        durationElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    });
    
    // Mouse enter - play video
    card.addEventListener('mouseenter', function() {
      video.style.opacity = '1';
      poster.style.opacity = '0';
      
      video.play().catch(error => {
        console.error('Error playing video:', error);
      });
    });
    
    // Mouse leave - pause and reset video
    card.addEventListener('mouseleave', function() {
      video.style.opacity = '0';
      poster.style.opacity = '1';
      
      video.pause();
      video.currentTime = 0;
    });
  });
  
  // Simple modal functionality
  const videoItems = document.querySelectorAll('.card[data-video-url]');
  const modal = document.getElementById('videoModal');
  
  if (!modal) {
    console.warn("Video modal element not found - modal functionality disabled");
    return;
  }
  
  console.log("Modal found, setting up modal functionality");
  const modalBody = modal.querySelector('.modal-body');
  
  // Set up click handlers for video items
  videoItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      const videoUrl = this.dataset.videoUrl;
      if (!videoUrl) {
        console.error("No video URL provided");
        return;
      }
      
      console.log("Opening modal with video:", videoUrl);
      
      // Add video to modal
      modalBody.innerHTML = `
        <video controls autoplay>
          <source src="${videoUrl}" type="video/mp4">
          Your browser does not support HTML5 video.
        </video>
      `;
      
      // Show modal
      modal.style.display = 'block';
    });
  });
  
  // Set up close button
  const closeBtn = modal.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
      modalBody.innerHTML = '';
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      modalBody.innerHTML = '';
    }
  });
  
  // Close modal with Escape key
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      modalBody.innerHTML = '';
    }
  });
});