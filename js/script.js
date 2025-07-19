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
    
    // Parallax effect for video background
    const video = document.getElementById('bgVideo');
    const videoContainer = document.querySelector('.video-background');
    
    document.addEventListener('mousemove', function(e) {
        if (video && videoContainer) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            // Calculate the movement amount (subtle effect)
            const moveX = (mouseX - 0.5) * 30;
            const moveY = (mouseY - 0.5) * 30;
            
            // Apply the transform to the video with a larger scale to ensure full coverage
            video.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) translate(-50%, -50%) scale(1.2)`;
        }
    });
    
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