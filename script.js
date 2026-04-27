// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollIndicator = document.querySelector('.scroll-indicator');
const musicToggle = document.getElementById('music-toggle');
const rsvpForm = document.getElementById('rsvp-form');
const formMessage = document.getElementById('form-message');
const invitationLoader = document.getElementById('invitation-loader');
const enterButton = document.getElementById('enter-button');

// Music State
let isMusicPlaying = false;
let youtubePlayer = null;
let playerReady = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeInvitation();
    initializeAnimations();
    initializeNavigation();
    initializeMusic();
    initializeRSVP();
    initializeCalendar();
    initializeTimeline();
});

// Invitation Loader
function initializeInvitation() {
    if (enterButton) {
        enterButton.addEventListener('click', enterWeddingSite);
    }
    
    // Auto-enter after 10 seconds if user doesn't click
    setTimeout(() => {
        if (invitationLoader && !invitationLoader.classList.contains('hidden')) {
            enterWeddingSite();
        }
    }, 10000);
}

function enterWeddingSite() {
    if (invitationLoader) {
        // Fade out invitation
        invitationLoader.classList.add('hidden');
        
        // Remove from DOM after animation
        setTimeout(() => {
            invitationLoader.style.display = 'none';
        }, 1000);
        
        // Start main site animations
        setTimeout(() => {
            startMainSiteAnimations();
        }, 500);
    }
}

function startMainSiteAnimations() {
    // Trigger main site animations
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2');
    fadeElements.forEach(element => {
        element.classList.add('visible');
    });
}

// Navigation
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll indicator click
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('#story');
            if (nextSection) {
                const offsetTop = nextSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Scroll Animations with Intersection Observer
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special handling for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    animateTimelineItem(entry.target);
                }
                
                // Special handling for gallery items
                if (entry.target.classList.contains('gallery-item')) {
                    animateGalleryItem(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(item);
    });

    // Observe gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe detail cards
    const detailCards = document.querySelectorAll('.detail-card');
    detailCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// Timeline Animation
function initializeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Add hover effects
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const dot = item.querySelector('.timeline-dot');
            if (dot) {
                dot.style.transform = 'translateX(-50%) scale(1.5)';
                dot.style.background = '#9d2235';
            }
        });

        item.addEventListener('mouseleave', () => {
            const dot = item.querySelector('.timeline-dot');
            if (dot) {
                dot.style.transform = 'translateX(-50%) scale(1)';
                dot.style.background = '#800020';
            }
        });
    });
}

function animateTimelineItem(item) {
    const dot = item.querySelector('.timeline-dot');
    const content = item.querySelector('.timeline-content');
    
    if (dot) {
        dot.style.animation = 'pulse 2s ease-in-out infinite';
    }
    
    if (content) {
        content.style.animation = 'slideIn 0.6s ease-out';
    }
}

// Gallery Animation
function animateGalleryItem(item) {
    item.style.animation = 'fadeInScale 0.8s ease-out';
}

// Music Toggle
function initializeMusic() {
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
}

function toggleMusic() {
    if (!playerReady) {
        console.log('YouTube player not ready yet');
        return;
    }

    if (isMusicPlaying) {
        // Pause music
        youtubePlayer.pauseVideo();
        musicToggle.classList.remove('playing');
        musicToggle.querySelector('.music-icon').textContent = '🎵';
    } else {
        // Play music
        youtubePlayer.playVideo();
        youtubePlayer.setVolume(30); // Set volume to 30%
        musicToggle.classList.add('playing');
        musicToggle.querySelector('.music-icon').textContent = '🔇';
    }
    
    isMusicPlaying = !isMusicPlaying;
}

// YouTube API callback
function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('youtube-player', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    playerReady = true;
    console.log('YouTube player ready');
    // Set initial volume
    event.target.setVolume(30);
    // Auto-start music
    event.target.playVideo();
    isMusicPlaying = true;
    musicToggle.classList.add('playing');
    musicToggle.querySelector('.music-icon').textContent = '🔇';
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        // Loop the video
        event.target.playVideo();
    }
}

// RSVP Form
function initializeRSVP() {
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', handleRSVPSubmit);
    }
}

function handleRSVPSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(rsvpForm);
    const name = formData.get('name');
    const attendance = formData.get('attendance');
    
    if (!name || !attendance) {
        showFormMessage('እባክዎ እንዲሁን ይሙሉ', 'error');
        return;
    }
    
    // Simulate form submission
    showFormMessage('አመሰግናለን! መገኘትዎን ተቀበልናል።', 'success');
    
    // Reset form
    rsvpForm.reset();
    
    // Log the RSVP (in a real application, you would send this to a server)
    console.log('RSVP:', { name, attendance, timestamp: new Date().toISOString() });
}

function showFormMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Calendar Interaction
function initializeCalendar() {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)');
    const weddingDate = document.querySelector('.wedding-date');
    
    calendarDays.forEach(day => {
        day.addEventListener('click', () => {
            // Remove previous selection
            calendarDays.forEach(d => d.classList.remove('selected'));
            
            // Add selection to clicked day
            day.classList.add('selected');
            
            // Special effect for wedding date
            if (day.classList.contains('wedding-date')) {
                celebrateWeddingDate();
            }
        });
        
        day.addEventListener('mouseenter', () => {
            if (!day.classList.contains('wedding-date')) {
                day.style.background = 'rgba(255, 255, 255, 0.3)';
            }
        });
        
        day.addEventListener('mouseleave', () => {
            if (!day.classList.contains('selected') && !day.classList.contains('wedding-date')) {
                day.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
}

function celebrateWeddingDate() {
    const weddingDate = document.querySelector('.wedding-date');
    if (weddingDate) {
        weddingDate.style.animation = 'celebrate 1s ease-in-out';
        setTimeout(() => {
            weddingDate.style.animation = 'glow 2s ease-in-out infinite alternate';
        }, 1000);
    }
}

// Parallax Effect for Hero Section
function initializeParallax() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = hero.style.backgroundPosition;
        
        if (hero) {
            hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
        }
    });
}

// Floating Animation for Elements
function addFloatingAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.2); }
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes celebrate {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.3) rotate(180deg); }
            100% { transform: scale(1) rotate(360deg); }
        }
        
        .calendar-day.selected {
            background: rgba(255, 255, 255, 0.4) !important;
            transform: scale(1.2);
        }
        
        .music-toggle.playing {
            animation: musicPulse 2s ease-in-out infinite;
        }
        
        @keyframes musicPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize all animations and effects
addFloatingAnimation();
initializeParallax();

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Add touch gestures for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndY < touchStartY - 50) {
        // Swipe up - could be used for navigation
        console.log('Swipe up detected');
    }
    
    if (touchEndY > touchStartY + 50) {
        // Swipe down - could be used for navigation
        console.log('Swipe down detected');
    }
}

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    // Scroll-related operations
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Add print styles for wedding invitation
function addPrintStyles() {
    const printStyle = document.createElement('style');
    printStyle.textContent = `
        @media print {
            .navbar, .music-toggle, .scroll-indicator {
                display: none !important;
            }
            
            .hero {
                height: auto !important;
                min-height: 100vh !important;
            }
            
            section {
                page-break-inside: avoid;
                break-inside: avoid;
            }
        }
    `;
    document.head.appendChild(printStyle);
}

addPrintStyles();

// Console welcome message
console.log('%cበርሳቤህ አንተነህ & ብርሃኔ መስቀል ኪዳኔ', 'color: #800020; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to our wedding invitation website!', 'color: #666; font-size: 14px;');
