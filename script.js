// Search Feature
class SearchSystem {
    constructor() {
        this.searchContainer = null;
        this.searchInput = null;
        this.searchResults = null;
        this.searchData = [];
        this.init();
    }

    init() {
        this.createSearchUI();
        this.gatherSearchData();
        this.addEventListeners();
    }

    createSearchUI() {
        const container = document.createElement('div');
        container.className = 'search-container';
        container.innerHTML = `
            <div class="search-box">
                <input type="text" class="search-input" placeholder="Search for services, treatments, or information...">
                <div class="search-close">×</div>
            </div>
            <div class="search-results"></div>
        `;
        document.body.appendChild(container);

        this.searchContainer = container;
        this.searchInput = container.querySelector('.search-input');
        this.searchResults = container.querySelector('.search-results');
    }

    gatherSearchData() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const title = section.querySelector('h2')?.textContent;
            const content = section.textContent;
            const link = `#${section.id}`;
            
            if (title) {
                this.searchData.push({
                    title,
                    content: content.substring(0, 200) + '...',
                    link
                });
            }
        });
    }

    addEventListeners() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
        });

        this.searchContainer.querySelector('.search-close').addEventListener('click', () => {
            this.closeSearch();
        });

        this.searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        this.searchContainer.addEventListener('click', (e) => {
            if (e.target === this.searchContainer) {
                this.closeSearch();
            }
        });
    }

    openSearch() {
        this.searchContainer.classList.add('active');
        this.searchInput.focus();
    }

    closeSearch() {
        this.searchContainer.classList.remove('active');
        this.searchInput.value = '';
        this.searchResults.innerHTML = '';
    }

    performSearch(query) {
        if (!query) {
            this.searchResults.innerHTML = '';
            return;
        }

        const results = this.searchData.filter(item => {
            const searchText = (item.title + item.content).toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        this.displayResults(results);
    }

    displayResults(results) {
        this.searchResults.innerHTML = results.length ? results.map(result => `
            <div class="search-result-item" data-link="${result.link}">
                <h3>${result.title}</h3>
                <p>${result.content}</p>
            </div>
        `).join('') : '<div class="search-result-item">No results found</div>';

        this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const link = item.dataset.link;
                if (link) {
                    this.closeSearch();
                    document.querySelector(link).scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
        // Toggle body scroll
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    nav.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    nav.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) { // Swipe left
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        if (window.innerWidth > 768) {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Testimonial Slider
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        
        testimonialSlides[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    // Auto slide testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Staggered animation for services and team cards
    const staggeredElements = document.querySelectorAll('.staggered > *');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'fadeIn 0.5s ease forwards';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    staggeredElements.forEach(element => {
        observer.observe(element);
    });
    
    // Form submission handling
    const appointmentForm = document.getElementById('appointment-form');
    const contactForm = document.getElementById('contact-form');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(appointmentForm)) {
                // Show loading state
                const submitBtn = appointmentForm.querySelector('.submit-btn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    alert('Appointment request submitted successfully! We will contact you shortly.');
                    appointmentForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Book Appointment';
                }, 1500);
            }
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(contactForm)) {
                // Show loading state
                const submitBtn = contactForm.querySelector('.submit-btn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    alert('Message sent successfully! We will get back to you soon.');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message';
                }, 1500);
            }
        });
    }
    
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Update icon
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Prevent double-tap zoom on mobile
    document.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.target.click();
    }, { passive: false });

    // Handle mobile form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Prevent form submission if offline
            if (!navigator.onLine) {
                e.preventDefault();
                alert('You are currently offline. Please check your internet connection.');
                return;
            }
        });
    });

    // Add pull-to-refresh functionality
    let touchStartY = 0;
    let touchEndY = 0;
    const pullThreshold = 100;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        touchEndY = e.touches[0].clientY;
        const pullDistance = touchEndY - touchStartY;

        if (window.scrollY === 0 && pullDistance > 0) {
            e.preventDefault();
            document.body.style.transform = `translateY(${Math.min(pullDistance / 2, pullThreshold)}px)`;
        }
    }, { passive: false });

    document.addEventListener('touchend', function() {
        if (window.scrollY === 0 && touchEndY - touchStartY > pullThreshold) {
            window.location.reload();
        }
        document.body.style.transform = '';
    });

    // Optimize images for mobile and handle loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading="lazy" for better performance
        img.loading = 'lazy';
        
        // Add error handling
        img.onerror = function() {
            this.src = '/path/to/fallback-image.jpg';
            this.alt = 'Image failed to load';
        };

        // Handle image loading animation
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });

    // Handle mobile keyboard
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Scroll to input when focused
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });

    // Add touch feedback
    const touchElements = document.querySelectorAll('.btn, .nav-link, .social-icon');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        }, { passive: true });

        element.addEventListener('touchend', function() {
            this.style.opacity = '1';
        }, { passive: true });
    });

    // Handle mobile orientation changes
    window.addEventListener('orientationchange', function() {
        // Reset any transforms
        document.body.style.transform = '';
        
        // Adjust layout if needed
        if (window.innerWidth > window.innerHeight) {
            // Landscape mode
            document.querySelectorAll('.section').forEach(section => {
                section.style.minHeight = 'auto';
            });
        } else {
            // Portrait mode
            document.querySelectorAll('.section').forEach(section => {
                section.style.minHeight = '';
            });
        }
    });

    // Cookie Consent Management
    class CookieConsent {
        constructor() {
            this.cookieName = 'cookieConsent';
            this.cookieExpiry = 365; // days
            this.consentBanner = null;
            this.init();
        }

        init() {
            // Create and append cookie consent banner
            this.createBanner();
            
            // Check if consent was already given
            if (!this.getCookie(this.cookieName)) {
                this.showBanner();
            }
        }

        createBanner() {
            const banner = document.createElement('div');
            banner.className = 'cookie-consent';
            banner.innerHTML = `
                <div class="cookie-content">
                    <div class="cookie-text">
                        <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                    </div>
                    <div class="cookie-buttons">
                        <button class="cookie-btn accept-cookies">Accept</button>
                        <button class="cookie-btn decline-cookies">Decline</button>
                    </div>
                </div>
            `;

            document.body.appendChild(banner);
            this.consentBanner = banner;

            // Add event listeners
            banner.querySelector('.accept-cookies').addEventListener('click', () => this.acceptCookies());
            banner.querySelector('.decline-cookies').addEventListener('click', () => this.declineCookies());
        }

        showBanner() {
            this.consentBanner.classList.add('show');
        }

        hideBanner() {
            this.consentBanner.classList.remove('show');
        }

        acceptCookies() {
            this.setCookie(this.cookieName, 'accepted', this.cookieExpiry);
            this.hideBanner();
            // Enable analytics and other cookies here
        }

        declineCookies() {
            this.setCookie(this.cookieName, 'declined', this.cookieExpiry);
            this.hideBanner();
            // Disable analytics and other cookies here
        }

        setCookie(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = `expires=${date.toUTCString()}`;
            document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
        }

        getCookie(name) {
            const nameEQ = `${name}=`;
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }
    }

    // Initialize cookie consent
    new CookieConsent();

    // Loading Progress Bar
    class LoadingProgress {
        constructor() {
            this.progressBar = null;
            this.init();
        }

        init() {
            // Create progress bar
            this.createProgressBar();
            
            // Add event listeners
            this.addEventListeners();
        }

        createProgressBar() {
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            document.body.appendChild(progressBar);
            this.progressBar = progressBar;
        }

        addEventListeners() {
            // Show progress bar on navigation
            window.addEventListener('beforeunload', () => {
                this.startLoading();
            });

            // Hide progress bar when page is loaded
            window.addEventListener('load', () => {
                this.completeLoading();
            });

            // Show progress bar on AJAX requests
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (link && !link.target && !e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey) {
                    this.startLoading();
                }
            });
        }

        startLoading() {
            this.progressBar.classList.add('loading');
        }

        completeLoading() {
            this.progressBar.classList.remove('loading');
            this.progressBar.style.transform = 'scaleX(1)';
            setTimeout(() => {
                this.progressBar.style.transform = 'scaleX(0)';
            }, 200);
        }
    }

    // Initialize loading progress
    new LoadingProgress();

    // Initialize features
    new SearchSystem();

    // Add online appointment scheduling system
    class AppointmentSystem {
        constructor() {
            this.appointments = [];
            this.availableSlots = this.generateAvailableSlots();
        }
        
        generateAvailableSlots() {
            // Generate available slots for the next 30 days
            const slots = [];
            const now = new Date();
            
            for (let day = 0; day < 30; day++) {
                const currentDate = new Date(now);
                currentDate.setDate(now.getDate() + day);
                
                // Skip weekends
                if (currentDate.getDay() === 0) continue; // Sunday
                
                const dateString = this.formatDate(currentDate);
                
                // Add time slots (9 AM to 5 PM, 1-hour intervals)
                const startHour = currentDate.getDay() === 6 ? 9 : 8; // Saturday starts at 9 AM
                const endHour = currentDate.getDay() === 6 ? 17 : 20; // Saturday ends at 5 PM
                
                for (let hour = startHour; hour < endHour; hour++) {
                    slots.push({
                        date: dateString,
                        time: `${hour}:00`,
                        available: true
                    });
                }
            }
            
            return slots;
        }
        
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        
        checkAvailability(date) {
            return this.availableSlots.filter(slot => slot.date === date && slot.available);
        }
        
        bookAppointment(appointmentData) {
            // Check if slot is available
            const slotIndex = this.availableSlots.findIndex(
                slot => slot.date === appointmentData.date && 
                      slot.time === appointmentData.time &&
                      slot.available
            );
            
            if (slotIndex === -1) {
                return {
                    success: false,
                    message: 'The selected slot is no longer available.'
                };
            }
            
            // Mark slot as unavailable
            this.availableSlots[slotIndex].available = false;
            
            // Add appointment
            this.appointments.push({
                id: Date.now(), // Simple ID generation
                ...appointmentData,
                status: 'Confirmed'
            });
            
            return {
                success: true,
                message: 'Appointment confirmed successfully!',
                appointment: this.appointments[this.appointments.length - 1]
            };
        }
        
        cancelAppointment(appointmentId) {
            const appointmentIndex = this.appointments.findIndex(app => app.id === appointmentId);
            
            if (appointmentIndex === -1) {
                return {
                    success: false,
                    message: 'Appointment not found.'
                };
            }
            
            const appointment = this.appointments[appointmentIndex];
            
            // Find slot and mark it as available again
            const slotIndex = this.availableSlots.findIndex(
                slot => slot.date === appointment.date && slot.time === appointment.time
            );
            
            if (slotIndex !== -1) {
                this.availableSlots[slotIndex].available = true;
            }
            
            // Remove appointment
            this.appointments.splice(appointmentIndex, 1);
            
            return {
                success: true,
                message: 'Appointment cancelled successfully.'
            };
        }
    }

    // Initialize appointment system
    const clinicAppointments = new AppointmentSystem();

    // Medical Records System (simplified)
    class MedicalRecordSystem {
        constructor() {
            this.patients = [];
            this.records = [];
        }
        
        addPatient(patientData) {
            const patientId = Date.now();
            const newPatient = {
                id: patientId,
                ...patientData,
                registrationDate: new Date().toISOString()
            };
            
            this.patients.push(newPatient);
            return newPatient;
        }
        
        findPatient(identifier) {
            // Search by ID, email or phone
            return this.patients.find(
                patient => patient.id === identifier || 
                        patient.email === identifier ||
                        patient.phone === identifier
            );
        }
        
        addMedicalRecord(patientId, recordData) {
            const patient = this.findPatient(patientId);
            
            if (!patient) {
                return {
                    success: false,
                    message: 'Patient not found.'
                };
            }
            
            const newRecord = {
                id: Date.now(),
                patientId: patient.id,
                ...recordData,
                createdAt: new Date().toISOString()
            };
            
            this.records.push(newRecord);
            
            return {
                success: true,
                message: 'Medical record added successfully.',
                record: newRecord
            };
        }
        
        getPatientRecords(patientId) {
            return this.records.filter(record => record.patientId === patientId);
        }
    }

    // Initialize medical record system
    const medicalRecords = new MedicalRecordSystem();

    // Form validation
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                // Add error message if it doesn't exist
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'This field is required';
                    input.parentNode.insertBefore(errorMessage, input.nextSibling);
                }
            } else {
                input.classList.remove('error');
                const errorMessage = input.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            }

            // Email validation
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                        const errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'Please enter a valid email address';
                        input.parentNode.insertBefore(errorMessage, input.nextSibling);
                    }
                }
            }
        });

        return isValid;
    }

    // Form submission handler
    document.getElementById('appointment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const department = document.getElementById('department').value;
        const message = document.getElementById('message').value;

        // Format the message for WhatsApp
        const whatsappMessage = `*New Appointment Request*%0A%0A` +
            `*Name:* ${firstName} ${lastName}%0A` +
            `*Email:* ${email}%0A` +
            `*Phone:* ${phone}%0A` +
            `*Date:* ${date}%0A` +
            `*Time:* ${time}%0A` +
            `*Department:* ${department}%0A` +
            `*Additional Message:* ${message}`;

        // Doctor's WhatsApp number (replace with actual number)
        const doctorWhatsApp = '233247097712';

        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${doctorWhatsApp}?text=${whatsappMessage}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');

        // Show success message
        alert('Your appointment request has been sent to the doctor via WhatsApp. Please wait for confirmation.');
        
        // Reset form
        this.reset();
    });

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Testimonial slider
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Auto slide every 5 seconds
    setInterval(() => showSlide(currentSlide + 1), 5000);
});

// Add online appointment scheduling system
class AppointmentSystem {
    constructor() {
        this.appointments = [];
        this.availableSlots = this.generateAvailableSlots();
    }
    
    generateAvailableSlots() {
        // Generate available slots for the next 30 days
        const slots = [];
        const now = new Date();
        
        for (let day = 0; day < 30; day++) {
            const currentDate = new Date(now);
            currentDate.setDate(now.getDate() + day);
            
            // Skip weekends
            if (currentDate.getDay() === 0) continue; // Sunday
            
            const dateString = this.formatDate(currentDate);
            
            // Add time slots (9 AM to 5 PM, 1-hour intervals)
            const startHour = currentDate.getDay() === 6 ? 9 : 8; // Saturday starts at 9 AM
            const endHour = currentDate.getDay() === 6 ? 17 : 20; // Saturday ends at 5 PM
            
            for (let hour = startHour; hour < endHour; hour++) {
                slots.push({
                    date: dateString,
                    time: `${hour}:00`,
                    available: true
                });
            }
        }
        
        return slots;
    }
    
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    checkAvailability(date) {
        return this.availableSlots.filter(slot => slot.date === date && slot.available);
    }
    
    bookAppointment(appointmentData) {
        // Check if slot is available
        const slotIndex = this.availableSlots.findIndex(
            slot => slot.date === appointmentData.date && 
                  slot.time === appointmentData.time &&
                  slot.available
        );
        
        if (slotIndex === -1) {
            return {
                success: false,
                message: 'The selected slot is no longer available.'
            };
        }
        
        // Mark slot as unavailable
        this.availableSlots[slotIndex].available = false;
        
        // Add appointment
        this.appointments.push({
            id: Date.now(), // Simple ID generation
            ...appointmentData,
            status: 'Confirmed'
        });
        
        return {
            success: true,
            message: 'Appointment confirmed successfully!',
            appointment: this.appointments[this.appointments.length - 1]
        };
    }
    
    cancelAppointment(appointmentId) {
        const appointmentIndex = this.appointments.findIndex(app => app.id === appointmentId);
        
        if (appointmentIndex === -1) {
            return {
                success: false,
                message: 'Appointment not found.'
            };
        }
        
        const appointment = this.appointments[appointmentIndex];
        
        // Find slot and mark it as available again
        const slotIndex = this.availableSlots.findIndex(
            slot => slot.date === appointment.date && slot.time === appointment.time
        );
        
        if (slotIndex !== -1) {
            this.availableSlots[slotIndex].available = true;
        }
        
        // Remove appointment
        this.appointments.splice(appointmentIndex, 1);
        
        return {
            success: true,
            message: 'Appointment cancelled successfully.'
        };
    }
}

// Initialize appointment system
const clinicAppointments = new AppointmentSystem();

// Medical Records System (simplified)
class MedicalRecordSystem {
    constructor() {
        this.patients = [];
        this.records = [];
    }
    
    addPatient(patientData) {
        const patientId = Date.now();
        const newPatient = {
            id: patientId,
            ...patientData,
            registrationDate: new Date().toISOString()
        };
        
        this.patients.push(newPatient);
        return newPatient;
    }
    
    findPatient(identifier) {
        // Search by ID, email or phone
        return this.patients.find(
            patient => patient.id === identifier || 
                    patient.email === identifier ||
                    patient.phone === identifier
        );
    }
    
    addMedicalRecord(patientId, recordData) {
        const patient = this.findPatient(patientId);
        
        if (!patient) {
            return {
                success: false,
                message: 'Patient not found.'
            };
        }
        
        const newRecord = {
            id: Date.now(),
            patientId: patient.id,
            ...recordData,
            createdAt: new Date().toISOString()
        };
        
        this.records.push(newRecord);
        
        return {
            success: true,
            message: 'Medical record added successfully.',
            record: newRecord
        };
    }
    
    getPatientRecords(patientId) {
        return this.records.filter(record => record.patientId === patientId);
    }
}

// Initialize medical record system
const medicalRecords = new MedicalRecordSystem();

// Form validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            // Add error message if it doesn't exist
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'This field is required';
                input.parentNode.insertBefore(errorMessage, input.nextSibling);
            }
        } else {
            input.classList.remove('error');
            const errorMessage = input.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.remove();
            }
        }

        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Please enter a valid email address';
                    input.parentNode.insertBefore(errorMessage, input.nextSibling);
                }
            }
        }
    });

    return isValid;
}

// Form submission handler
document.getElementById('appointment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const department = document.getElementById('department').value;
    const message = document.getElementById('message').value;

    // Format the message for WhatsApp
    const whatsappMessage = `*New Appointment Request*%0A%0A` +
        `*Name:* ${firstName} ${lastName}%0A` +
        `*Email:* ${email}%0A` +
        `*Phone:* ${phone}%0A` +
        `*Date:* ${date}%0A` +
        `*Time:* ${time}%0A` +
        `*Department:* ${department}%0A` +
        `*Additional Message:* ${message}`;

    // Doctor's WhatsApp number (replace with actual number)
    const doctorWhatsApp = '233247097712';

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${doctorWhatsApp}?text=${whatsappMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Show success message
    alert('Your appointment request has been sent to the doctor via WhatsApp. Please wait for confirmation.');
    
    // Reset form
    this.reset();
});

// Back to top button
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Testimonial slider
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.testimonial-dot');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// Auto slide every 5 seconds
setInterval(() => showSlide(currentSlide + 1), 5000); 