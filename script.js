// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  // Add image error handling for all movie posters
  const movieImages = document.querySelectorAll('.poster img');
  movieImages.forEach(img => {
    img.addEventListener('error', function() {
      // Try alternative TMDb URL first
      if (!this.dataset.retried) {
        this.dataset.retried = 'true';
        const originalSrc = this.src;
        // Try w342 instead of w500
        if (originalSrc.includes('w500')) {
          this.src = originalSrc.replace('w500', 'w342');
          return;
        }
        // If still fails, use placeholder
        const movieTitle = this.alt || 'Movie';
        this.src = `https://via.placeholder.com/500x750/1e2130/ffffff?text=${encodeURIComponent(movieTitle)}`;
      }
    });
    
    // Preload images to detect errors early
    if (img.src && !img.complete) {
      const testImg = new Image();
      testImg.onload = function() {
        // Image loads successfully
      };
      testImg.onerror = function() {
        // Trigger error handler
        img.dispatchEvent(new Event('error'));
      };
      testImg.src = img.src;
    }
  });

  // Add smooth page load animation
  document.body.classList.add('loading');

  setTimeout(() => {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');

    // Start ticket banner animation after page loads - only for desktop
    if (window.innerWidth >= 768) {
      animateTicketBanner();
    }
  }, 300);

  // Function to animate ticket banner
  function animateTicketBanner() {
    const ticketBanner = document.querySelector('.ticket-pricing-banner');
    if (!ticketBanner) return;

    // Create overlay with reduced opacity
    const overlay = document.createElement('div');
    overlay.className = 'ticket-banner-overlay';
    overlay.style.background = 'rgba(0, 0, 0, 0.3)'; // Reduce opacity from 0.7 to 0.3
    document.body.appendChild(overlay);

    // Force reflow
    void overlay.offsetWidth;

    // Set initial styles for the banner to ensure it's visible and not blurred
    ticketBanner.style.opacity = '1';  
    ticketBanner.style.zIndex = '99999'; // Set extremely high z-index
    ticketBanner.style.backdropFilter = 'none';
    ticketBanner.style.webkitBackdropFilter = 'none';
    ticketBanner.style.background = 'rgb(30, 33, 48)'; // Solid background color
    ticketBanner.style.position = 'fixed'; // Ensure fixed position

    // Show overlay
    overlay.classList.add('visible');

    // Initial state: center of screen
    ticketBanner.classList.add('popup-initial');

    // Wait a bit then make banner fully visible
    setTimeout(() => {
      ticketBanner.classList.add('popup-visible');

      // After 2 seconds, start minimizing to sidebar
      setTimeout(() => {
        overlay.classList.add('fading');
        ticketBanner.classList.remove('popup-visible');
        ticketBanner.classList.add('minimizing');

        // Once minimized, move to final position
        setTimeout(() => {
          // Remove overlay
          overlay.remove();

          // Reset banner to normal position in sidebar
          ticketBanner.classList.remove('popup-initial', 'minimizing');
          ticketBanner.classList.add('final-position');

          // After animation completes, remove all animation classes
          setTimeout(() => {
            ticketBanner.classList.remove('final-position');
            ticketBanner.removeAttribute('style');
          }, 500);
        }, 800);
      }, 2000);
    }, 300);
  }

  // Location chooser functionality for both mobile and desktop
  const mobileLocation = document.querySelector('.mobile-location');
  const desktopLocation = document.querySelector('.desktop-location');

  // Function to initialize location button
  function initLocationButton(locationButton) {
    if (locationButton) {
      // Load saved location from localStorage if available
      const savedCity = localStorage.getItem('selectedCity');
      const savedTheater = localStorage.getItem('selectedTheater');

      if (savedCity && savedTheater) {
        locationButton.dataset.selectedCity = savedCity;
        locationButton.dataset.selectedTheater = savedTheater;
        locationButton.querySelector('span').textContent = `${savedCity} - ${savedTheater}`;
      }

      locationButton.addEventListener('click', function(e) {
        // If this click is from a dropdown item, don't open the popup
        if (e.target.closest('.choose-city-dropdown') ||
          e.target.closest('.choose-theatre-dropdown') ||
          e.target.closest('.city-option') ||
          e.target.closest('.theatre-option')) {
          return;
        }

        // Create new modern popup - works identically for both mobile and desktop
        createLocationPopup();
      });
    }
  }

  // Function to initialize location buttons with proper event handling
  function initLocationButton(locationButton) {
    if (locationButton) {
      // Load saved location from localStorage if available
      const savedCity = localStorage.getItem('selectedCity');
      const savedTheater = localStorage.getItem('selectedTheater');

      if (savedCity && savedTheater) {
        locationButton.dataset.selectedCity = savedCity;
        locationButton.dataset.selectedTheater = savedTheater;
        locationButton.querySelector('span').textContent = `${savedCity} - ${savedTheater}`;
      }
    }
  }

  // Initialize all location buttons with saved data
  initLocationButton(mobileLocation);
  // Removing desktopLocation init
  //initLocationButton(desktopLocation);

  // Sidebar location button completely removed

  // Clear any existing event listeners and set up new ones
  // For mobile location button
  if (mobileLocation) {
    const newMobileBtn = mobileLocation.cloneNode(true);
    mobileLocation.parentNode.replaceChild(newMobileBtn, mobileLocation);

    newMobileBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Mobile location clicked");
      createLocationPopup();
    });
  }

  // For desktop sidebar location button
  const desktopSidebarLocation = document.querySelector('.desktop-sidebar-location');
  if (desktopSidebarLocation) {
    // Load saved location data
    const savedCity = localStorage.getItem('selectedCity');
    const savedTheater = localStorage.getItem('selectedTheater');

    // Update button text if saved data exists
    if (savedCity && savedTheater) {
      desktopSidebarLocation.querySelector('span').textContent = `${savedCity} - ${savedTheater}`;
    }

    // Add click handler
    desktopSidebarLocation.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Desktop sidebar location clicked");
      createDesktopSidebarLocationPopup();
    });
  }

  // Function to create desktop sidebar location popup
  function createDesktopSidebarLocationPopup() {
    console.log("Opening desktop sidebar location popup");

    // Remove any existing popups
    const existingPopup = document.querySelector('.location-popup, .desktop-location-popup, .sidebar-location-popup');
    const existingOverlay = document.querySelector('.location-overlay');

    if (existingPopup) {
      existingPopup.remove();
    }

    if (existingOverlay) {
      existingOverlay.remove();
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'location-overlay';
    document.body.appendChild(overlay);

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'sidebar-location-popup';

    // Cities and theaters data
    const cities = [
      "Mumbai", "Delhi-NCR", "Bengaluru", "Hyderabad",
      "Chennai", "Kolkata", "Pune", "Ahmedabad",
      "Jaipur", "Kochi"
    ];

    const theaters = [
      "PVR Cinemas", "INOX", "Cinepolis", "Carnival Cinemas",
      "SPI Cinemas", "Movietime Cinemas", "Wave Cinemas", "Miraj Cinemas"
    ];

    // Get current selections
    const currentCity = localStorage.getItem('selectedCity') || '';
    const currentTheater = localStorage.getItem('selectedTheater') || '';

    // Create popup content with a distinctive style
    popup.innerHTML = `
      <div class="sidebar-popup-content">
        <div class="sidebar-popup-header">
          <h2><i class="fas fa-map-marker-alt"></i> Select Your Location</h2>
          <button class="close-btn"><i class="fas fa-times"></i></button>
        </div>

        <div class="sidebar-popup-body">
          <div class="location-option-group">
            <label for="sidebar-city-select">City</label>
            <div class="city-select-wrapper">
              <select id="sidebar-city-select" class="sidebar-select">
                <option value="">Choose your city</option>
                ${cities.map(city => `<option value="${city}" ${currentCity === city ? 'selected' : ''}>${city}</option>`).join('')}
                <option value="custom">+ Add Custom City</option>
              </select>
            </div>
            <div id="sidebar-custom-city-container" class="custom-input-container" style="display: none;">
              <input type="text" id="sidebar-custom-city-input" class="sidebar-custom-input" placeholder="Enter your city name">
            </div>
          </div>

          <div class="location-option-group">
            <label for="sidebar-theater-select">Theater</label>
            <div class="theater-select-wrapper">
              <select id="sidebar-theater-select" class="sidebar-select">
                <option value="">Choose your theater</option>
                ${theaters.map(theater => `<option value="${theater}" ${currentTheater === theater ? 'selected' : ''}>${theater}</option>`).join('')}
                <option value="custom">+ Add Custom Theatre</option>
              </select>
            </div>
            <div id="sidebar-custom-theater-container" class="custom-input-container" style="display: none;">
              <input type="text" id="sidebar-custom-theater-input" class="sidebar-custom-input" placeholder="Enter your theatre name">
            </div>
          </div>

          <button id="sidebar-confirm-location" class="sidebar-confirm-btn" ${(!currentCity || !currentTheater) ? 'disabled' : ''}>
            <i class="fas fa-check-circle"></i> Confirm Location
          </button>
        </div>
      </div>
    `;

    // Append popup to body
    document.body.appendChild(popup);

    // Center popup
    const popupRect = popup.getBoundingClientRect();
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';

    // Add popup animation
    popup.style.opacity = '0';
    popup.style.transform = 'translate(-50%, -55%)';

    // Trigger entrance animation after a tiny delay
    setTimeout(() => {
      popup.style.opacity = '1';
      popup.style.transform = 'translate(-50%, -50%)';
    }, 50);

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';

    // Get elements
    const citySelect = popup.querySelector('#sidebar-city-select');
    const theaterSelect = popup.querySelector('#sidebar-theater-select');
    const confirmBtn = popup.querySelector('#sidebar-confirm-location');
    const closeBtn = popup.querySelector('.close-btn');

    // Get custom input elements
    const customCityContainer = popup.querySelector('#sidebar-custom-city-container');
    const customCityInput = popup.querySelector('#sidebar-custom-city-input');
    const customTheaterContainer = popup.querySelector('#sidebar-custom-theater-container');
    const customTheaterInput = popup.querySelector('#sidebar-custom-theater-input');

    // Track custom values
    let selectedCity = currentCity;
    let selectedTheater = currentTheater;

    // Add event listeners
    citySelect.addEventListener('change', function() {
      const value = this.value;

      // Handle custom city input
      if (value === 'custom') {
        customCityContainer.style.display = 'block';
        customCityInput.focus();
        selectedCity = ''; // Clear selected city until custom input is provided
      } else {
        customCityContainer.style.display = 'none';
        selectedCity = value; // Update selected city
      }

      updateConfirmButtonState();
    });

    // Custom city input change event
    customCityInput.addEventListener('input', function() {
      const value = this.value.trim();

      // Update selected city if custom input has value
      selectedCity = value ? value : '';
      updateConfirmButtonState();
    });

    theaterSelect.addEventListener('change', function() {
      const value = this.value;

      // Handle custom theater input
      if (value === 'custom') {
        customTheaterContainer.style.display = 'block';
        customTheaterInput.focus();
        selectedTheater = ''; // Clear selected theater until custom input is provided
      } else {
        customTheaterContainer.style.display = 'none';
        selectedTheater = value; // Update selected theater
      }

      updateConfirmButtonState();
    });

    // Custom theater input change event
    customTheaterInput.addEventListener('input', function() {
      const value = this.value.trim();

      // Update selected theater if custom input has value
      selectedTheater = value ? value : '';
      updateConfirmButtonState();
    });

    // Helper to update confirm button state
    function updateConfirmButtonState() {
      confirmBtn.disabled = !selectedCity || !selectedTheater;

      if (confirmBtn.disabled) {
        confirmBtn.classList.add('disabled');
      } else {
        confirmBtn.classList.remove('disabled');
      }
    }

    // Confirm button click
    confirmBtn.addEventListener('click', function() {
      if (selectedCity && selectedTheater) {
        // Update desktop sidebar location button
        const desktopSidebarLocation = document.querySelector('.desktop-sidebar-location');
        if (desktopSidebarLocation) {
          desktopSidebarLocation.querySelector('span').textContent = `${selectedCity} - ${selectedTheater}`;
        }

        // Update mobile location button
        const mobileLocation = document.querySelector('.mobile-location');
        if (mobileLocation) {
          mobileLocation.querySelector('span').textContent = `${selectedCity} - ${selectedTheater}`;
        }

        // Save to localStorage
        localStorage.setItem('selectedCity', selectedCity);
        localStorage.setItem('selectedTheater', selectedTheater);

        // Show success notification
        setTimeout(() => {
          showNotification('Location updated successfully!');
        }, 300);

        // Close popup
        closeSidebarLocationPopup(popup, overlay);
      }
    });

    // Close button click
    closeBtn.addEventListener('click', function() {
      closeSidebarLocationPopup(popup, overlay);
    });

    // Close on overlay click
    overlay.addEventListener('click', function() {
      closeSidebarLocationPopup(popup, overlay);
    });
  }

  // Function to close the sidebar location popup
  function closeSidebarLocationPopup(popup, overlay) {
    // Add closing animation
    popup.style.opacity = '0';
    popup.style.transform = 'translate(-50%, -45%)';

    // Remove after animation completes
    setTimeout(() => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }

      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }

      document.body.style.overflow = '';
    }, 300);
  }

  // Function to create the location popup
  function createLocationPopup() {
    console.log("Opening location popup");

    // Remove any existing popups to prevent duplicates
    const existingPopup = document.querySelector('.location-popup');
    const existingOverlay = document.querySelector('.location-overlay');

    // Debug info to verify function is being called
    console.log("Creating location popup - existing popup:", existingPopup);

    if (existingPopup) {
      existingPopup.remove();
    }

    if (existingOverlay) {
      existingOverlay.remove();
    }

    // Create overlay first
    const overlay = document.createElement('div');
    overlay.className = 'location-overlay';
    document.body.appendChild(overlay);

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'location-popup';

    // Cities and theaters data
    const cities = [
      "Mumbai", "Delhi-NCR", "Bengaluru", "Hyderabad",
      "Chennai", "Kolkata", "Pune", "Ahmedabad",
      "Jaipur", "Kochi"
    ];

    const theaters = [
      "PVR Cinemas", "INOX", "Cinepolis", "Carnival Cinemas",
      "SPI Cinemas", "Movietime Cinemas", "Wave Cinemas", "Miraj Cinemas"
    ];

    // Get current selections from dataset or localStorage
    const mobileLocation = document.querySelector('.mobile-location');
    const currentCity = mobileLocation.dataset.selectedCity || localStorage.getItem('selectedCity') || '';
    const currentTheater = mobileLocation.dataset.selectedTheater || localStorage.getItem('selectedTheater') || '';

    // Create popup content
    popup.innerHTML = `
      <div class="location-popup-header">
        <span class="location-popup-title">Choose Location</span>
        <button class="close-btn"><i class="fas fa-times"></i></button>
      </div>

      <div class="location-options-container">
        <div class="location-selection-row">
          <div class="dropdown-group">
            <label class="location-selection-label" for="city-dropdown">Select City</label>
            <select id="city-dropdown" class="simple-dropdown">
              <option value="">Select a city</option>
              ${cities.map(city => `<option value="${city}" ${currentCity === city ? 'selected' : ''}>${city}</option>`).join('')}
              <option value="custom">+ Add Custom City</option>
            </select>
            <div id="custom-city-container" class="custom-input-container" style="display: none;">
              <input type="text" id="custom-city-input" class="custom-location-input" placeholder="Enter your city name">
            </div>
          </div>

          <div class="dropdown-group">
            <label class="location-selection-label" for="theater-dropdown">Select Theatre</label>
            <select id="theater-dropdown" class="simple-dropdown">
              <option value="">Select a theatre</option>
              ${theaters.map(theater => `<option value="${theater}" ${currentTheater === theater ? 'selected' : ''}>${theater}</option>`).join('')}
              <option value="custom">+ Add Custom Theatre</option>
            </select>
            <div id="custom-theater-container" class="custom-input-container" style="display: none;">
              <input type="text" id="custom-theater-input" class="custom-location-input" placeholder="Enter your theatre name">
            </div>
          </div>
        </div>

        <button class="location-confirm-btn" ${(!currentCity || !currentTheater) ? 'disabled' : ''}>
          Confirm Selection
        </button>
      </div>
    `;

    // Add popup to body
    document.body.appendChild(popup);

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';

    // Get elements
    const cityDropdown = popup.querySelector('#city-dropdown');
    const theaterDropdown = popup.querySelector('#theater-dropdown');
    const confirmBtn = popup.querySelector('.location-confirm-btn');
    const closeBtn = popup.querySelector('.close-btn');

    // Get custom input elements
    const customCityContainer = popup.querySelector('#custom-city-container');
    const customCityInput = popup.querySelector('#custom-city-input');
    const customTheaterContainer = popup.querySelector('#custom-theater-container');
    const customTheaterInput = popup.querySelector('#custom-theater-input');

    // City dropdown change event
    cityDropdown.addEventListener('change', function() {
      const value = this.value;

      // Handle custom city input
      if (value === 'custom') {
        customCityContainer.style.display = 'block';
        customCityInput.focus();
        // Don't set the selectedCity yet, wait for custom input
        delete mobileLocation.dataset.selectedCity;
      } else {
        customCityContainer.style.display = 'none';

        // Update selected city
        if (value) {
          mobileLocation.dataset.selectedCity = value;
        } else {
          delete mobileLocation.dataset.selectedCity;
        }
      }

      // Update confirm button
      confirmBtn.disabled = !mobileLocation.dataset.selectedCity || !mobileLocation.dataset.selectedTheater;
    });

    // Custom city input change event
    customCityInput.addEventListener('input', function() {
      const value = this.value.trim();

      // Update selected city if custom input has value
      if (value) {
        mobileLocation.dataset.selectedCity = value;
      } else {
        delete mobileLocation.dataset.selectedCity;
      }

      // Update confirm button
      confirmBtn.disabled = !mobileLocation.dataset.selectedCity || !mobileLocation.dataset.selectedTheater;
    });

    // Theater dropdown change event
    theaterDropdown.addEventListener('change', function() {
      const value = this.value;

      // Handle custom theater input
      if (value === 'custom') {
        customTheaterContainer.style.display = 'block';
        customTheaterInput.focus();
        // Don't set the selectedTheater yet, wait for custom input
        delete mobileLocation.dataset.selectedTheater;
      } else {
        customTheaterContainer.style.display = 'none';

        // Update selected theater
        if (value) {
          mobileLocation.dataset.selectedTheater = value;
        } else {
          delete mobileLocation.dataset.selectedTheater;
        }
      }

      // Update confirm button
      confirmBtn.disabled = !mobileLocation.dataset.selectedCity || !mobileLocation.dataset.selectedTheater;
    });

    // Custom theater input change event
    customTheaterInput.addEventListener('input', function() {
      const value = this.value.trim();

      // Update selected theater if custom input has value
      if (value) {
        mobileLocation.dataset.selectedTheater = value;
      } else {
        delete mobileLocation.dataset.selectedTheater;
      }

      // Update confirm button
      confirmBtn.disabled = !mobileLocation.dataset.selectedCity || !mobileLocation.dataset.selectedTheater;
    });

    // Confirm button
    confirmBtn.addEventListener('click', function() {
      if (mobileLocation.dataset.selectedCity && mobileLocation.dataset.selectedTheater) {
        // Update location display on both mobile and desktop
        const selectedCity = mobileLocation.dataset.selectedCity;
        const selectedTheater = mobileLocation.dataset.selectedTheater;

        // Update mobile location display
        mobileLocation.querySelector('span').textContent =
          `${selectedCity} - ${selectedTheater}`;

        // Desktop location update removed

        // Save to localStorage for persistence
        localStorage.setItem('selectedCity', selectedCity);
        localStorage.setItem('selectedTheater', selectedTheater);

        // Show success notification
        setTimeout(() => {
          showNotification('Location updated successfully!');
        }, 300);

        // Close popup
        closeLocationPopup(popup, overlay);
      }
    });

    // Close button
    closeBtn.addEventListener('click', function() {
      closeLocationPopup(popup, overlay);
    });

    // Close on overlay click
    overlay.addEventListener('click', function() {
      closeLocationPopup(popup, overlay);
    });
  }

  // Function to close location popup
  function closeLocationPopup(popup, overlay) {
    popup.classList.add('closing');

    setTimeout(() => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }

      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }

      document.body.style.overflow = '';
    }, 300);
  }

  // Helper function to close location popup
  function closeLocationPopup(popup, overlay) {
    popup.classList.add('closing');

    setTimeout(() => {
      popup.remove();
      overlay.remove();
      document.body.style.overflow = '';
    }, 300);
  }
  // Hamburger menu functionality
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const sidebar = document.querySelector('.sidebar');
  const hamburgerIcon = document.querySelector('.hamburger-icon');

  hamburgerMenu.addEventListener('click', function() {
    // Toggle active classes
    sidebar.classList.toggle('active');
    hamburgerIcon.classList.toggle('active');

    // Create or remove overlay when toggling menu
    if (sidebar.classList.contains('active')) {
      // Create overlay if it doesn't exist
      if (!document.querySelector('.mobile-menu-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);

        // Add active class after a small delay for smooth transition
        setTimeout(() => {
          overlay.classList.add('active');
        }, 10);

        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
      }
    } else {
      // Remove overlay with animation
      const overlay = document.querySelector('.mobile-menu-overlay');
      if (overlay) {
        overlay.classList.remove('active');

        // Remove overlay element after animation completes
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, 300);

        // Re-enable body scrolling

        // Function to scroll movie grids horizontally
        function scrollMovieGrid(container, direction) {
          const movieGrid = container.querySelector('.movie-grid');
          const scrollAmount = movieGrid.clientWidth * 0.8 * direction;
          movieGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }

        document.body.style.overflow = '';
      }
    }
  });

  // Close sidebar when clicking outside
  document.addEventListener('click', function(e) {
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (overlay &&
      overlay.classList.contains('active') &&
      !sidebar.contains(e.target) &&
      !hamburgerMenu.contains(e.target)) {
      // Trigger hamburger menu click to close the sidebar
      hamburgerMenu.click();
    }
  });

  // Handle mobile nav link clicks (close menu on click)
  document.querySelectorAll('.nav-categories a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
        // Close the menu when a link is clicked on mobile
        setTimeout(() => {
          hamburgerMenu.click();
        }, 100);
      }
    });
  });

  // Feature image slideshow functionality
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const featuredMovie = document.querySelector('.featured-movie');

  // Movie data for the hero section carousel
  const movieData = [
    {
      title: "Avengers: Endgame",
      year: "2019",
      releaseDate: "26th April, Friday",
      description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
      backgroundImage: "https://image.tmdb.org/t/p/original/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg"
    },
    {
      title: "Dune: Part Two",
      year: "2024",
      releaseDate: "1st March, Friday",
      description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, and must prevent a terrible future only he can foresee.",
      backgroundImage: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg"
    },
    {
      title: "Interstellar",
      year: "2014",
      releaseDate: "7th November, Friday",
      description: "When Earth becomes uninhabitable, a farmer and ex-NASA pilot leads a mission through a wormhole to find a new home for humanity, transcending the limitations of human space travel.",
      backgroundImage: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg"
    },
    {
      title: "The Batman",
      year: "2022",
      releaseDate: "4th March, Friday",
      description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
      backgroundImage: "https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg"
    },
    {
      title: "Inception",
      year: "2010",
      releaseDate: "16th July, Friday",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      backgroundImage: "https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
    }
  ];

  // Extract background images array for transitions
  const backgroundImages = movieData.map(movie => movie.backgroundImage);

  // Preload all background images when the page loads
  backgroundImages.forEach(imageUrl => {
    const img = new Image();
    img.src = imageUrl;
  });

  let currentBgIndex = 0;
  let autoScrollInterval;
  let isManualNavigation = false;
  let pauseTimeout;

  function updateBackground(index) {
    // Mark the hero section as changing to trigger animations
    featuredMovie.classList.add('changing');

    // Get current movie data
    const currentMovie = movieData[index];
    const movieTitle = document.querySelector('.featured-info h1');
    const releaseDate = document.querySelector('.release-date');
    const description = document.querySelector('.description');
    const actionButtons = document.querySelector('.action-buttons');

    // Preload the image before creating the transition
    const imagePreloader = new Image();
    imagePreloader.src = currentMovie.backgroundImage;

    // Create blur overlay for quick transition
    const blurOverlay = document.createElement('div');
    blurOverlay.className = 'blur-transition-overlay';
    blurOverlay.style.position = 'absolute';
    blurOverlay.style.top = '0';
    blurOverlay.style.left = '0';
    blurOverlay.style.width = '100%';
    blurOverlay.style.height = '100%';
    blurOverlay.style.borderRadius = '16px';
    blurOverlay.style.backdropFilter = 'blur(8px)';
    blurOverlay.style.webkitBackdropFilter = 'blur(8px)';
    blurOverlay.style.background = 'rgba(23, 26, 35, 0.4)';
    blurOverlay.style.zIndex = '4';
    blurOverlay.style.transition = 'all 0.4s ease-out';
    featuredMovie.appendChild(blurOverlay);

    // Hide content immediately (all at once)
    movieTitle.style.opacity = '0';
    releaseDate.style.opacity = '0';
    description.style.opacity = '0';
    if (actionButtons) actionButtons.style.opacity = '0';

    // Update the text content immediately
    movieTitle.textContent = currentMovie.title;
    releaseDate.textContent = `${currentMovie.releaseDate} • In ${currentMovie.year}`;
    description.textContent = currentMovie.description;

    // Quick transition - update background after a short delay
    setTimeout(() => {
      // Update background directly
      featuredMovie.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(30, 33, 48, 0.9)), url('${currentMovie.backgroundImage}')`;

      // Remove blur effect
      blurOverlay.style.backdropFilter = 'blur(0px)';
      blurOverlay.style.webkitBackdropFilter = 'blur(0px)';
      blurOverlay.style.background = 'rgba(23, 26, 35, 0)';

      // Show all content at once
      movieTitle.style.opacity = '1';
      releaseDate.style.opacity = '1';
      description.style.opacity = '1';
      if (actionButtons) actionButtons.style.opacity = '1';

      // Clean up
      setTimeout(() => {
        if (featuredMovie.contains(blurOverlay)) {
          featuredMovie.removeChild(blurOverlay);
        }
        featuredMovie.classList.remove('changing');
      }, 400);
    }, 400);
  }

  // Function to create particle effects during transition
  function createParticles(container) {
    const particleCount = 30;
    const colors = [
      'rgba(157, 108, 249, 0.8)', // Purple
      'rgba(255, 138, 154, 0.8)', // Pink
      'rgba(255, 87, 34, 0.8)',   // Orange
      'rgba(255, 152, 0, 0.8)'    // Amber
    ];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      // Random properties
      const size = Math.random() * 8 + 2;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const opacity = Math.random() * 0.7 + 0.2;
      const duration = Math.random() * 2.5 + 1;
      const delay = Math.random() * 0.8;
      const colorIndex = Math.floor(Math.random() * colors.length);
      const floatX = Math.random() * 2 - 1; // -1 to 1
      const floatY = Math.random() * 2 - 1; // -1 to 1
      const isGlowing = Math.random() > 0.7;

      // Particle styling
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.opacity = opacity;

      // Use either solid color or gradient
      if (Math.random() > 0.5) {
        particle.style.background = colors[colorIndex];
      } else {
        const secondColorIndex = (colorIndex + 1) % colors.length;
        particle.style.background =`linear-gradient(45deg, ${colors[colorIndex]}, ${colors[secondColorIndex]})`;
      }

      // Shape variation - some squares, some circles
      particle.style.borderRadius = Math.random() > 0.3 ? '50%' : `${Math.random() * 30 + 10}%`;
      particle.style.zIndex = '3';

      // Add glow effect to some particles
      if (isGlowing) {
        particle.style.boxShadow = `0 0 ${Math.random() * 12 + 8}px ${colors[colorIndex]}`;
      }

      // Set custom properties for the animation
      particle.style.setProperty('--float-x', floatX);
      particle.style.setProperty('--float-y', floatY);

      // Set animation
      particle.style.animation = `float-particle ${duration}s cubic-bezier(0.19, 1, 0.22, 1) ${delay}s forwards`;

      // Add to container
      container.appendChild(particle);
    }
  }

  // Clean implementation - no shimmer or particles for a simplified approach

  function startAutoScroll() {
    // Clear any existing interval to prevent multiple intervals
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
    }

    autoScrollInterval = setInterval(() => {
      if (!isManualNavigation) {
        // Add changing class for content animation
        featuredMovie.classList.add('changing');

        // Change to next background
        currentBgIndex = (currentBgIndex + 1) % backgroundImages.length;
        updateBackground(currentBgIndex);

        // Remove changing class after animation completes
        setTimeout(() => {
          featuredMovie.classList.remove('changing');
        }, 1500);
      }
    }, 6000); // Change slide every 6 seconds to allow transition to complete
  }

  // Start auto-scrolling when page loads
  startAutoScroll();

  // Handle manual navigation
  nextBtn.addEventListener('click', () => {
    isManualNavigation = true;
    currentBgIndex = (currentBgIndex + 1) % backgroundImages.length;
    updateBackground(currentBgIndex);

    // Clear existing timeout if there is one
    if (pauseTimeout) {
      clearTimeout(pauseTimeout);
    }

    // Resume auto-scrolling after 10 seconds of inactivity
    pauseTimeout = setTimeout(() => {
      isManualNavigation = false;
    }, 10000);
  });

  prevBtn.addEventListener('click', () => {
    isManualNavigation = true;
    currentBgIndex = (currentBgIndex - 1 + backgroundImages.length) % backgroundImages.length;
    updateBackground(currentBgIndex);

    // Clear existing timeout if there is one
    if (pauseTimeout) {
      clearTimeout(pauseTimeout);
    }

    // Resume auto-scrolling after 10 seconds of inactivity
    pauseTimeout = setTimeout(() => {
      isManualNavigation = false;
    }, 10000);
  });

  // Restart auto-scrolling when user focuses back on the tab
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      startAutoScroll();
    }
  });

  // Movie cards - with hover effects removed
  const movieCards = document.querySelectorAll('.movie-card');

  movieCards.forEach(card => {
    // No movement effects on hover - completely removed

    // Add click handler to the movie card itself
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking on buttons
      if (e.target.closest('.card-btn')) return;

      const title = card.querySelector('h3').textContent;
      console.log(`Selected movie: ${title}`);

      // Add click effect with ripple
      const ripple = document.createElement('div');
      ripple.className = 'ripple-effect';
      card.appendChild(ripple);

      setTimeout(() => {
        card.removeChild(ripple);
      }, 800);
    });

    // Add click handlers for the buttons
    const bookBtn = card.querySelector('.book-card-btn');
    const detailsBtn = card.querySelector('.details-card-btn');

    if (bookBtn) {
      bookBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        const title = card.querySelector('h3').textContent;
        console.log(`Booking seats for: ${title}`);

        // Minimal button feedback
        e.currentTarget.style.transform = 'scale(0.95)';
        setTimeout(() => {
          e.currentTarget.style.transform = '';
        }, 100);
      });
    }

    if (detailsBtn) {
      detailsBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        const title = card.querySelector('h3').textContent;
        console.log(`Viewing details for: ${title}`);

        // Minimal button feedback
        e.currentTarget.style.transform = 'scale(0.95)';
        setTimeout(() => {
          e.currentTarget.style.transform = '';
        }, 100);
      });
    }
  });

  // Search functionality
  const searchInput = document.querySelector('.search-bar input');
  const searchButton = document.querySelector('.search-bar button');

  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm.length > 0) {
      console.log(`Searching for: ${searchTerm}`);
      // Implement search functionality here
    }
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchButton.click();
    }
  });

  // Action buttons functionality
  const bookBtn = document.querySelector('.book-btn');
  const trailerBtn = document.querySelector('.trailer-btn');

  bookBtn.addEventListener('click', () => {
    console.log('Book Seats button clicked');
    // Implement booking functionality
  });

  trailerBtn.addEventListener('click', () => {
    console.log('Watch Trailer button clicked');
    // Implement trailer functionality
  });

  // Ticket pricing banner functionality
  const bookNowButtons = document.querySelectorAll('.book-now-btn');

  bookNowButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const pricingCard = e.target.closest('.pricing-card');
      const seatType = pricingCard.querySelector('.seat-type').textContent;
      const price = pricingCard.querySelector('.price').textContent;

      console.log(`Booking ${seatType} at ${price}`);

      // Minimal button feedback
      e.currentTarget.style.transform = 'scale(0.95)';
      setTimeout(() => {
        e.currentTarget.style.transform = '';
      }, 100);

      // Show notification
      showNotification(`${seatType} booking initiated!`);
    });
  });



  // Category navigation
  const navLinks = document.querySelectorAll('.nav-categories a');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove active class from all links
      navLinks.forEach(navLink => {
        navLink.classList.remove('active');
      });

      // Add active class to clicked link
      link.classList.add('active');

      const category = link.textContent;
      console.log(`Category selected: ${category}`);
      // Implement category filtering
    });
  });

  // Add intersection observer for genre sections
  const genreSections = document.querySelectorAll('.genre-section');

  // Only use intersection observer on desktop for better mobile performance
  if (window.innerWidth >= 769) {
    const genreObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          genreObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '100px' });

    genreSections.forEach((section, index) => {
      // Add delay based on index
      section.style.transitionDelay = `${index * 0.05}s`;
      genreObserver.observe(section);
    });
  } else {
    // On mobile, immediately show all sections without animation
    genreSections.forEach(section => {
      section.classList.add('in-view');
    });
  }

  // View All buttons for genre sections with enhanced effect
  const viewAllButtons = document.querySelectorAll('.view-all');
  viewAllButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const genreTitle = e.target.closest('.genre-header').querySelector('h2').textContent;
      console.log(`View all ${genreTitle} movies clicked`);

      // Minimal button feedback
      e.currentTarget.style.transform = 'scale(0.95)';
      setTimeout(() => {
        e.currentTarget.style.transform = '';
      }, 100);

      // Implement view all functionality
    });
  });

  // Navigation for movie grids
  const movieGridContainers = document.querySelectorAll('.movie-grid-container');
  movieGridContainers.forEach(container => {
    const grid = container.querySelector('.movie-grid');
    const prevBtn = container.querySelector('.movie-grid-prev');
    const nextBtn = container.querySelector('.movie-grid-next');

    // Calculate the scroll distance (approximately 2 cards + gap)
    const scrollDistance = 260; // 2 cards (120px each) + gaps

    nextBtn?.addEventListener('click', () => {
      grid.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
      });
    });

    prevBtn?.addEventListener('click', () => {
      grid.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
      });
    });
  });

  // Special effect for coming soon movies
  const comingSoonTags = document.querySelectorAll('.genre-tag.coming-soon');
  comingSoonTags.forEach(tag => {
    // Add pulse animation effect
    setInterval(() => {
      tag.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.1)', opacity: 0.9 },
        { transform: 'scale(1)', opacity: 1 }
      ], {
        duration: 2000,
        iterations: 1
      });
    }, 5000);
  });

  // Apply animations to all movie cards in genre sections
  const allMovieCards = document.querySelectorAll('.movie-card');
  allMovieCards.forEach((card, index) => {
    // Set index for staggered animation
    card.style.setProperty('--card-index', index % 5);

    // Only add intersection observer animations on desktop for better mobile performance
    if (window.innerWidth >= 769) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            card.classList.add('in-view');
            observer.unobserve(card);
          }
        });
      }, { threshold: 0.1, rootMargin: '50px' });

      observer.observe(card);
    } else {
      // On mobile, immediately show all cards without animation
      card.classList.add('in-view');
    }

    // All hover movement effects completely removed

    // No hover transform effects applied

    card.addEventListener('mouseleave', () => {
      // Only reset non-movement styles
      const poster = card.querySelector('.poster img');
      if (poster) {
        poster.style.filter = '';
      }

      // Reset genre tag styling
      const genreTag = card.querySelector('.genre-tag');
      if (genreTag) {
        genreTag.style.opacity = '';
        genreTag.style.transform = '';
      }
    });

    // Add click handler for movie cards
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking on buttons
      if (e.target.closest('.card-btn')) return;

      const title = card.querySelector('h3').textContent;
      console.log(`Selected movie: ${title}`);

      // Add click effect with ripple
      const ripple = document.createElement('div');
      ripple.className = 'ripple-effect';
      card.appendChild(ripple); setTimeout(() => {
        card.removeChild(ripple);
      }, 800);
    });

    // Add click handlers for the buttons
    const bookBtn = card.querySelector('.book-card-btn');
    const detailsBtn = card.querySelector('.details-card-btn');

    if (bookBtn) {
      bookBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        const title = card.querySelector('h3').textContent;
        console.log(`Booking seats for: ${title}`);

        // Minimal button feedback
        e.currentTarget.style.transform = 'scale(0.95)';
        setTimeout(() => {
          e.currentTarget.style.transform = '';
        }, 100);
      });
    }

    if (detailsBtn) {
      detailsBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        const title = card.querySelector('h3').textContent;
        console.log(`Viewing details for: ${title}`);

        // Minimal button feedback
        e.currentTarget.style.transform = 'scale(0.95)';
        setTimeout(() => {
          e.currentTarget.style.transform = '';
        }, 100);
      });
    }
  });
});

function scrollMovieGrid(container, direction) {
  const movieGrid = container.querySelector('.movie-grid');

  // Calculate scroll amount based on visible width and card width
  const cardWidth = 200; // Width of a single card
  const gap = 24; // Gap between cards (1.5rem)
  const cardsToScroll = 2; // Number of cards to scroll by
  const scrollAmount = direction * ((cardWidth + gap) * cardsToScroll);

  // Get current scroll position
  const currentScroll = movieGrid.scrollLeft;

  // Create ripple effect on button if event exists
  if (typeof event !== 'undefined' && event.currentTarget) {
    const button = event.currentTarget;

    // Remove any existing ripples
    const existingRipples = button.querySelectorAll('.button-ripple');
    existingRipples.forEach(ripple => ripple.remove());

    // Create new ripple
    const ripple = document.createElement('span');
    ripple.classList.add('button-ripple');
    button.appendChild(ripple);

    // Animate and remove ripple
    setTimeout(() => {
      if (button.contains(ripple)) {
        ripple.remove();
      }
    }, 600);

    // Add active state class
    button.classList.add('active');
    setTimeout(() => {
      button.classList.remove('active');
    }, 300);
  }

  // Smooth scroll with animation
  movieGrid.scrollTo({
    left: currentScroll + scrollAmount,
    behavior: 'smooth'
  });

  // Subtle animation of cards during scroll
  const cards = movieGrid.querySelectorAll('.movie-card');
  cards.forEach((card, index) => {
    // Calculate delay based on card position
    const delay = Math.abs(index - Math.floor(cards.length / 2)) * 30;

    // Apply subtle animation
    card.style.transition = `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`;
    card.style.transform = 'scale(0.97)';

    setTimeout(() => {
      card.style.transform = '';
    }, 500 + delay);
  });
}

// Function to display selection messages
function showSelectionMessage(popup, message) {
  // Check if message element already exists
  let messageElement = popup.querySelector('.selection-message');
  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.className = 'selection-message';
    popup.appendChild(messageElement);
  }

  // Set the message text
  messageElement.textContent = message;

  // Add animation to make it visible and then fade out
  messageElement.style.opacity = '1';
  setTimeout(() => {
    messageElement.style.transition = 'opacity 0.5s ease-out';
    messageElement.style.opacity = '0';

    // Remove the element after the fade-out
    setTimeout(() => {
      if (messageElement && messageElement.parentNode === popup) {
        popup.removeChild(messageElement);
      }
    }, 500);
  }, 2000);
}

// Location Section Functionality
function setupLocationSection() {
  // Add logo hover animation and refresh functionality
  const logoContainer = document.querySelector('.logo-container');
  if (logoContainer) {
    logoContainer.addEventListener('mouseenter', function() {
      // The animation takes 2.5s to complete as defined in CSS
      setTimeout(() => {
        // Refresh the page after animation completes
        window.location.reload();
      }, 2500); // Match this with the rotate-square animation duration
    });
  }

  // Add a "Location" link to the nav-categories
  const navCategories = document.querySelector('.nav-categories');
  if (navCategories) {
    const locationLink = document.createElement('a');
    locationLink.href = "#";
    locationLink.innerHTML = '<i class="fas fa-map-marker-alt"></i> Location';
    navCategories.appendChild(locationLink);

    // Add event listener to show location section
    locationLink.addEventListener('click', (e) => {
      e.preventDefault();
      showLocationSection();
    });
  }

  // Add mobile location event to open the standalone location section
  const mobileLocation = document.querySelector('.mobile-location');
  if (mobileLocation) {
    mobileLocation.addEventListener('click', function(e) {
      // If we're already using the location popup, don't interfere
      if (e.target.closest('.choose-city-dropdown') ||
        e.target.closest('.choose-theatre-dropdown') ||
        e.target.closest('.city-option') ||
        e.target.closest('.theatre-option')) {
        return;
      }

      // Show the location section
      showLocationSection();
    });
  }

  // Setup city selection
  const cityItems = document.querySelectorAll('.city-item');
  let selectedCity = null;

  cityItems.forEach(city => {
    city.addEventListener('click', function() {
      // Remove selected class from all cities
      cityItems.forEach(c => c.classList.remove('selected'));

      // Add selected class to this city
      this.classList.add('selected');
      selectedCity = this.dataset.city;

      updateLocationSelection();
    });
  });

  // Setup theatre selection
  const theatreItems = document.querySelectorAll('.theatre-item');
  let selectedTheatre = null;

  theatreItems.forEach(theatre => {
    theatre.addEventListener('click', function() {
      // Remove selected class from all theatres
      theatreItems.forEach(t => t.classList.remove('selected'));

      // Add selected class to this theatre
      this.classList.add('selected');
      selectedTheatre = this.dataset.theatre;

      updateLocationSelection();
    });
  });

  // Update selection display
  function updateLocationSelection() {
    const selectedLocationElement = document.getElementById('selected-location');

    if (selectedCity && selectedTheatre) {
      selectedLocationElement.textContent = `${selectedCity} - ${selectedTheatre}`;
    } else if (selectedCity) {
      selectedLocationElement.textContent = `${selectedCity} (Please select a theatre)`;
    } else if (selectedTheatre) {
      selectedLocationElement.textContent = `(Please select a city) - ${selectedTheatre}`;
    } else {
      selectedLocationElement.textContent = 'Not selected';
    }
  }

  // Save location button
  const saveLocationBtn = document.getElementById('save-location-btn');
  if (saveLocationBtn) {
    saveLocationBtn.addEventListener('click', function() {
      if (!selectedCity || !selectedTheatre) {
        alert('Please select both a city and a theatre before saving');
        return;
      }

      // Update mobile location display
      const mobileLocation = document.querySelector('.mobile-location');
      if (mobileLocation) {
        mobileLocation.querySelector('span').textContent = `${selectedCity} - ${selectedTheatre}`;
        mobileLocation.dataset.selectedCity = selectedCity;
        mobileLocation.dataset.selectedTheatre = selectedTheatre;
      }

      // Hide location section
      hideLocationSection();

      // Show success notification
      showNotification('Location saved successfully!');
    });
  }
}

// Function to show the location section
function showLocationSection() {
  // Hide other main content sections if needed
  const mainContentSections = document.querySelectorAll('.main-content > div:not(.location-section)');
  mainContentSections.forEach(section => {
    if (section.style.display !== 'none') {
      section.dataset.previousDisplay = section.style.display;
      section.style.display = 'none';
    }
  });

  // Show location section
  const locationSection = document.querySelector('.location-section');
  if (locationSection) {
    locationSection.classList.add('active');

    // Scroll to location section
    locationSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Function to hide the location section
function hideLocationSection() {
  // Hide location section
  const locationSection = document.querySelector('.location-section');
  if (locationSection) {
    locationSection.classList.remove('active');
  }

  // Show previously visible sections
  const mainContentSections = document.querySelectorAll('.main-content > div:not(.location-section)');
  mainContentSections.forEach(section => {
    if (section.dataset.previousDisplay) {
      section.style.display = section.dataset.previousDisplay;
    } else {
      section.style.display = '';
    }
  });
}

// Function to show a notification - kept for backward compatibility but simplified
function showNotification(message) {
  // Use toast notification instead of bottom notification
  showToastNotification(message);
}

// Enhanced toast notification function for genre selections
function showToastNotification(message) {
  // Remove any existing toast notifications
  const existingToasts = document.querySelectorAll('.toast-notification');
  existingToasts.forEach(toast => toast.remove());

  // Create toast notification element
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  
  // Create toast content
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-check-circle toast-icon"></i>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;

  // Add to body
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Auto remove after delay
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }
  }, 4000);
}

// Add event listeners for clickable language and genre tags in the sidebar
document.addEventListener('DOMContentLoaded', function() {
  // Handle language and genre tag clicks
  const clickableTags = document.querySelectorAll('.clickable-tag');

  // Track active filters
  const activeFilters = {
    genres: [],
    languages: []
  };

  // Function to filter movie cards based on selections
  function filterMovieCards() {
    // Only filter on desktop
    if (window.innerWidth < 769) return;

    const movieCards = document.querySelectorAll('.movie-card');

    // If no filters are active, show all cards
    if (activeFilters.genres.length === 0 && activeFilters.languages.length === 0) {
      movieCards.forEach(card => {
        card.style.display = '';

        // Reset any transition/animation effects
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = '';
        }, 50);
      });
      return;
    }

    // Filter cards based on active filters
    movieCards.forEach(card => {
      // Get genre from card
      const genreTag = card.querySelector('.genre-tag');
      const cardGenre = genreTag ? genreTag.textContent.trim() : '';

      // Default to not showing the card
      let shouldShow = false;

      // If we have genre filters active, check against them
      if (activeFilters.genres.length > 0) {
        shouldShow = activeFilters.genres.includes(cardGenre);
      } else {
        // If no genre filters, consider this a match
        shouldShow = true;
      }

      // Note: Language filtering would require adding language data to cards
      // For now, we're only filtering by genre since cards have genre tags

      // Show or hide the card with animation
      if (shouldShow) {
        card.style.display = '';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });

    // Check if any cards are visible in each section
    const genreSections = document.querySelectorAll('.genre-section');
    genreSections.forEach(section => {
      const visibleCards = section.querySelectorAll('.movie-card[style="display: none;"]');
      const totalCards = section.querySelectorAll('.movie-card').length;

      // If all cards in a section are hidden, hide the section
      if (visibleCards.length === totalCards) {
        section.style.display = 'none';
      } else {
        section.style.display = '';
      }
    });
  }

  clickableTags.forEach(tag => {
    tag.addEventListener('click', function(e) {
      // Only apply filtering on desktop
      if (window.innerWidth < 769) return;

      // Create ripple effect
      const ripple = document.createElement('span');
      ripple.className = 'tag-ripple';
      this.appendChild(ripple);

      // Remove ripple after animation completes
      setTimeout(() => {
        if (ripple.parentNode === this) {
          this.removeChild(ripple);
        }
      }, 600);

      // Toggle active state
      this.classList.toggle('active');

      // Determine if it's a language or genre
      const isLanguage = this.closest('.languages') !== null;
      const tagType = isLanguage ? 'language' : 'genre';
      const tagName = this.textContent.trim();

      // Update active filters
      if (isLanguage) {
        if (this.classList.contains('active')) {
          // Add to active languages
          if (!activeFilters.languages.includes(tagName)) {
            activeFilters.languages.push(tagName);
          }
        } else {
          // Remove from active languages
          activeFilters.languages = activeFilters.languages.filter(lang => lang !== tagName);
        }
      } else {
        if (this.classList.contains('active')) {
          // Add to active genres
          if (!activeFilters.genres.includes(tagName)) {
            activeFilters.genres.push(tagName);
          }
        } else {
          // Remove from active genres
          activeFilters.genres = activeFilters.genres.filter(genre => genre !== tagName);
        }
      }

      // Show toast notification with selected/deselected message
      const isActive = this.classList.contains('active');
      const actionText = isActive ? 'Selected' : 'Deselected';
      showToastNotification(`${actionText} ${tagType}: ${tagName}`);

      // Apply filters
      filterMovieCards();
    });
  });

  // Add reset filters button to the sidebar (desktop only)
  if (window.innerWidth >= 769) {
    const detailsContent = document.querySelector('.details-content');
    if (detailsContent) {
      const resetButton = document.createElement('button');
      resetButton.className = 'reset-filters-btn';
      resetButton.innerHTML = '<i class="fas fa-sync-alt"></i> Reset Filters';

      // Insert after genres section
      const genresSection = detailsContent.querySelector('.genres');
      if (genresSection) {
        genresSection.parentNode.insertBefore(resetButton, genresSection.nextSibling);
      }

      // Add click handler for reset button
      resetButton.addEventListener('click', function() {
        // Clear active filters
        activeFilters.genres = [];
        activeFilters.languages = [];

        // Reset all tag buttons
        document.querySelectorAll('.clickable-tag.active').forEach(tag => {
          tag.classList.remove('active');
        });

        // Reset all cards
        filterMovieCards();

        // Show toast notification
        showToastNotification('All filters reset');
      });
    }
  }

  // Handle window resize to disable filtering on mobile
  window.addEventListener('resize', function() {
    if (window.innerWidth < 769) {
      // On mobile, make sure all cards are visible
      document.querySelectorAll('.movie-card').forEach(card => {
        card.style.display = '';
        card.style.opacity = '1';
        card.style.transform = '';
      });

      // Make all sections visible
      document.querySelectorAll('.genre-section').forEach(section => {
        section.style.display = '';
      });
    } else {
      // Reapply filters on desktop
      filterMovieCards();
    }
  });
});

// Function to create desktop-specific location popup with enhanced design
function createDesktopLocationPopup() {
  console.log("Opening desktop location popup");

  // Remove any existing popups to prevent duplicates
  const existingPopup = document.querySelector('.location-popup, .desktop-location-popup');
  const existingOverlay = document.querySelector('.location-overlay, .desktop-overlay');

  // Debug info
  console.log("Creating desktop location popup - existing popup:", existingPopup);

  if (existingPopup) {
    existingPopup.remove();
  }

  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Create overlay first with beautiful blur effect
  const overlay = document.createElement('div');
  overlay.className = 'desktop-overlay';
  document.body.appendChild(overlay);

  // Create popup with enhanced styling
  const popup = document.createElement('div');
  popup.className = 'desktop-location-popup';

  // Add a subtle entrance animation
  popup.style.opacity = '0';
  popup.style.transform = 'translate(-50%, -55%)';
  document.body.appendChild(popup);

  // Trigger entrance animation after a tiny delay
  setTimeout(() => {
    popup.style.opacity = '1';
    popup.style.transform = 'translate(-50%, -50%)';
  }, 50);

  // Create shimmering particles for a premium effect
  createPopupParticles(popup);

  // Cities and theaters data
  const cities = [
    "Mumbai", "Delhi-NCR", "Bengaluru", "Hyderabad",
    "Chennai", "Kolkata", "Pune", "Ahmedabad",
    "Jaipur", "Kochi"
  ];

  const theaters = [
    "PVR Cinemas", "INOX", "Cinepolis", "Carnival Cinemas",
    "SPI Cinemas", "Movietime Cinemas", "Wave Cinemas", "Miraj Cinemas"
  ];

  // Get current selections from localStorage
  const currentCity = localStorage.getItem('selectedCity') || '';
  const currentTheater = localStorage.getItem('selectedTheater') || '';

  // Create popup content matching the design in the image
  popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-header">
          <h2>Choose Location</h2>
          <button class="close-button">×</button>
        </div>
        <div class="popup-body">
          <div class="form-group">
            <label>Select City</label>
            <select id="city-select" class="location-select">
              <option value="">Select a city</option>
              ${cities.map(city => `<option value="${city}" ${currentCity === city ? 'selected' : ''}>${city}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Select Theatre</label>
            <select id="theatre-select" class="location-select">
              <option value="">Select a theatre</option>
              ${theaters.map(theater => `<option value="${theater}" ${currentTheater === theater ? 'selected' : ''}>${theater}</option>`).join('')}
            </select>
          </div>
          <button id="confirm-location" class="confirm-button">Confirm Selection</button>
        </div>
      </div>
    `;

  // Prevent body scrolling
  document.body.style.overflow = 'hidden';

  // Get elements
  const citySelect = popup.querySelector('#city-select');
  const theatreSelect = popup.querySelector('#theatre-select');
  const confirmBtn = popup.querySelector('#confirm-location');
  const closeBtn = popup.querySelector('.close-button');

  // City dropdown change event
  citySelect.addEventListener('change', function() {
    // Update button state
    updateConfirmButton();
  });

  // Theatre dropdown change event
  theatreSelect.addEventListener('change', function() {
    // Update button state
    updateConfirmButton();
  });

  // Helper to update confirm button state
  function updateConfirmButton() {
    confirmBtn.disabled = !citySelect.value || !theatreSelect.value;

    if (confirmBtn.disabled) {
      confirmBtn.classList.add('disabled');
    } else {
      confirmBtn.classList.remove('disabled');
    }
  }

  // Initial button state
  updateConfirmButton();

  // Confirm button
  confirmBtn.addEventListener('click', function() {
    if (citySelect.value && theatreSelect.value) {
      // Update mobile location display
      const mobileLocation = document.querySelector('.mobile-location');
      if (mobileLocation) {
        mobileLocation.dataset.selectedCity = citySelect.value;
        mobileLocation.dataset.selectedTheater = theatreSelect.value;
        mobileLocation.querySelector('span').textContent = `${citySelect.value} - ${theatreSelect.value}`;
      }

      // Desktop location update removed

      // Save to localStorage for persistence
      localStorage.setItem('selectedCity', citySelect.value);
      localStorage.setItem('selectedTheater', theatreSelect.value);

      // Show success notification
      setTimeout(() => {
        showNotification('Location updated successfully!');
      }, 300);

      // Close popup
      closeDesktopLocationPopup(popup, overlay);
    }
  });

  // Close button
  closeBtn.addEventListener('click', function() {
    closeDesktopLocationPopup(popup, overlay);
  });

  // Close on overlay click
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeDesktopLocationPopup(popup, overlay);
    }
  });

  // Log popup visibility
  console.log("Popup created with styles:", {
    zIndex: popup.style.zIndex,
    opacity: popup.style.opacity,
    position: popup.style.position
  });
}

// Function to close desktop location popup
function closeDesktopLocationPopup(popup, overlay) {
  console.log("Closing popup");

  // Fade out animation
  popup.style.opacity = '0';
  overlay.style.opacity = '0';

  // Wait for animation to complete before removing elements
  setTimeout(() => {
    if (document.body.contains(popup)) {
      document.body.removeChild(popup);
    }

    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }

    document.body.style.overflow = '';
  }, 300);
}

// Function to create shimmering particles for the location popup
function createPopupParticles(container) {
  const particleCount = 15;
  const colors = [
    'rgba(157, 108, 249, 0.4)', // Purple
    'rgba(255, 138, 154, 0.4)', // Pink
    'rgba(255, 87, 34, 0.3)',   // Orange
    'rgba(255, 152, 0, 0.3)'    // Amber
  ];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'popup-particle';

    // Random properties
    const size = Math.random() * 6 + 2;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const opacity = Math.random() * 0.5 + 0.2;
    const duration = Math.random() * 8 + 4;
    const delay = Math.random() * 2;
    const colorIndex = Math.floor(Math.random() * colors.length);
    const isGlowing = Math.random() > 0.7;

    // Particle styling
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.opacity = opacity;
    particle.style.background = colors[colorIndex];
    particle.style.borderRadius = '50%';
    particle.style.zIndex = '0';
    particle.style.pointerEvents = 'none';

    // Add glow effect to some particles
    if (isGlowing) {
      particle.style.boxShadow = `0 0 ${Math.random() * 8 + 2}px ${colors[colorIndex]}`;
    }

    // Add animation
    particle.style.animation = `float-popup-particle ${duration}s ease-in-out ${delay}s infinite alternate`;

    // Add to container
    container.appendChild(particle);
  }

  // Add the animation keyframes
  if (!document.querySelector('#popup-particle-keyframes')) {
    const style = document.createElement('style');
    style.id = 'popup-particle-keyframes';
    style.innerHTML = `
      @keyframes float-popup-particle {
        0% {
          transform: translateY(0) translateX(0);
          opacity: 0.2;
        }
        100% {
          transform: translateY(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 20 + 10}px) 
                    translateX(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 20 + 10}px);
          opacity: 0.8;
        }
      }
    `;
    document.head.appendChild(style);
  }
}
//Desktop location button completely removed