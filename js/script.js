document.addEventListener('DOMContentLoaded', function() {
    // Make all sections visible for scrolling
    const sections = document.querySelectorAll('.terminal-section');
    sections.forEach(section => {
        section.style.display = 'block';
    });
    
    // Add visible class to home section immediately
    document.getElementById('home').classList.add('visible');
    
    // Navigation functionality - now for smooth scrolling to sections
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the section id from data attribute
            const sectionId = this.getAttribute('data-section');
            
            // Scroll to the section
            document.getElementById(sectionId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Enhanced zoom effect focused on the window area
    const video = document.getElementById('bgVideo');
    const videoContainer = document.querySelector('.video-background');
    
    if (video && videoContainer) {
        // Target coordinates for the window (x=880, y=403)
        const targetX = 880;
        const targetY = 403;
        
        // Get video dimensions once loaded
        video.addEventListener('loadedmetadata', function() {
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            
            // Calculate target point as percentage of video dimensions
            const targetXPercent = targetX / videoWidth;
            const targetYPercent = targetY / videoHeight;
            
            // Initial position and scale
            let scale = 1.05;
            let currentX = -50;
            let currentY = -50;
            let zoomPhase = 0;
            
            // Function to update the transform
            function updateTransform() {
                video.style.transform = `translate(${currentX}%, ${currentY}%) scale(${scale})`;
            }
            
            // Set initial transform
            updateTransform();
            
            // Continuous zoom animation focused on the window
            setInterval(() => {
                // Update zoom phase (0 to 2π)
                zoomPhase += 0.005;
                if (zoomPhase >= Math.PI * 2) zoomPhase = 0;
                
                // Calculate scale with sinusoidal oscillation
                scale = 1.05 + 0.03 * Math.sin(zoomPhase);
                
                // Calculate position adjustments to keep the window area more centered during zoom
                // This creates a subtle drift toward the window as we zoom in
                const xAdjust = (targetXPercent - 0.5) * 2 * Math.sin(zoomPhase) * 5;
                const yAdjust = (targetYPercent - 0.5) * 2 * Math.sin(zoomPhase) * 5;
                
                currentX = -50 + xAdjust;
                currentY = -50 + yAdjust;
                
                // Apply the transform
                updateTransform();
            }, 50);
            
            // Very subtle movement on mouse move
            document.addEventListener('mousemove', function(e) {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                // Calculate the movement amount (very subtle effect)
                const moveX = (mouseX - 0.5) * 3;
                const moveY = (mouseY - 0.5) * 3;
                
                // Apply the transform with the current scale and position
                video.style.transform = `translate(${currentX + moveX}%, ${currentY + moveY}%) scale(${scale})`;
            });
        });
    }
    
    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let scrollTimeout;
    let isLastSection = false;
    let userHasScrolled = false;
    
    // Show scroll indicator after 10 seconds of inactivity if not at the last section
    function showScrollIndicator() {
        if (!isLastSection) {
            scrollIndicator.classList.add('visible');
        }
    }
    
    // Hide scroll indicator when user scrolls
    function hideScrollIndicator() {
        scrollIndicator.classList.remove('visible');
        clearTimeout(scrollTimeout);
        
        // Set timeout to show indicator again after 10 seconds of inactivity
        if (!isLastSection) {
            scrollTimeout = setTimeout(showScrollIndicator, 10000);
        }
    }
    
    // Initial timeout to show scroll indicator
    scrollTimeout = setTimeout(showScrollIndicator, 10000);
    
    // Handle scroll events
    window.addEventListener('scroll', function() {
        userHasScrolled = true;
        hideScrollIndicator();
        
        // Check if we're at the last section
        const lastSection = sections[sections.length - 1];
        const lastSectionTop = lastSection.offsetTop;
        const windowBottom = window.scrollY + window.innerHeight;
        
        if (windowBottom >= document.body.offsetHeight - 100) {
            isLastSection = true;
            hideScrollIndicator();
        } else {
            isLastSection = false;
        }
        
        // Update active nav link based on scroll position
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
                
                // Make section visible when scrolled into view
                section.classList.add('visible');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
        
        // Handle animations for elements that come into view
        handleScrollAnimations();
    });
    
    // Function to handle animations on scroll
    function handleScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Animate skill items when they come into view
    function animateSkillItems() {
        const skillItems = document.querySelectorAll('.skill-list li');
        
        skillItems.forEach((skill, index) => {
            skill.style.opacity = '0';
            skill.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                skill.style.opacity = '1';
                skill.style.transform = 'translateY(0)';
                skill.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }, index * 50);
        });
    }
    
    // Add animation classes to elements
    document.querySelectorAll('.skill-category').forEach(category => {
        category.classList.add('animate-on-scroll');
    });
    
    document.querySelectorAll('.project-card').forEach(card => {
        card.classList.add('animate-on-scroll');
    });
    
    document.querySelectorAll('.certification-item').forEach(item => {
        item.classList.add('animate-on-scroll');
    });
    
    // Handle animations when sections come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.id === 'skills') {
                    animateSkillItems();
                }
                
                // Add more section-specific animations here if needed
                entry.target.querySelectorAll('.animate-on-scroll').forEach(element => {
                    element.classList.add('visible');
                });
            }
        });
    }, { threshold: 0.2 });
    
    // Observe sections for animation triggers
    document.querySelectorAll('.terminal-section').forEach(section => {
        observer.observe(section);
    });
    
    // Terminal cursor blinking effect
    setInterval(() => {
        const cursor = document.querySelector('.cursor-blink');
        if (cursor) {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }
    }, 500);
    
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }, 500);
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // EmailJS initialization
    (function() {
        emailjs.init("uLJUtDVWzvtli6U3T");
    })();
    
    // Form submission with EmailJS
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const fromName = document.getElementById('from_name').value;
            const replyTo = document.getElementById('reply_to').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!fromName || !replyTo || !message) {
                formStatus.textContent = 'Please fill in all fields';
                formStatus.className = 'form-status error';
                return;
            }
            
            // Prepare for submission
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            formStatus.textContent = '';
            
            // Send email using EmailJS
            const templateParams = {
                from_name: fromName,
                reply_to: replyTo,
                message: message
            };
            
            emailjs.send('service_pv41xsr', 'template_zubhacn', templateParams)
                .then(function(response) {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }, function(error) {
                    formStatus.textContent = 'Failed to send message. Please try again.';
                    formStatus.className = 'form-status error';
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                    console.error('EmailJS error:', error);
                });
        });
    }
});   
 // Navigation bar visibility control
    document.addEventListener('mousemove', function(e) {
        const windowHeight = window.innerHeight;
        const mouseY = e.clientY;
        const threshold = windowHeight - 100; // Show nav when mouse is within 100px of bottom
        
        if (mouseY > threshold) {
            document.body.classList.add('nav-visible');
        } else {
            document.body.classList.remove('nav-visible');
        }
    });
    
    // For touch devices, show navigation bar on scroll down and hide on scroll up
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop) {
            // Scrolling down
            document.body.classList.remove('nav-visible');
        } else {
            // Scrolling up
            document.body.classList.add('nav-visible');
        }
        lastScrollTop = st <= 0 ? 0 : st; // For mobile or negative scrolling
    }, false);