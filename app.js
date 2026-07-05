/* ==========================================================================
   THREE.JS 3D BACKGROUND SYSTEM
   ========================================================================== */
const initThreeJS = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Create Scene
    const scene = new THREE.Scene();

    // Setup Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    // Setup Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. Particle Constellation
    const particlesCount = 800;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        // Random positions inside a bounding sphere/box
        positions[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom Particle Texture (Circular point)
    const pMaterial = new THREE.PointsMaterial({
        size: 0.035,
        color: 0xff2a5f,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeometry, pMaterial);
    scene.add(particleSystem);

    // 2. Wireframe 3D Icosahedron Structure
    const geom = new THREE.IcosahedronGeometry(2.2, 2);
    const mat = new THREE.MeshBasicMaterial({
        color: 0xff2a5f,
        wireframe: true,
        transparent: true,
        opacity: 0.07,
        blending: THREE.AdditiveBlending
    });
    const structureMesh = new THREE.Mesh(geom, mat);
    scene.add(structureMesh);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (event) => {
        // Normalize mouse positions: -0.5 to 0.5
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    // Window Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Slow rotations
        structureMesh.rotation.y = elapsedTime * 0.05;
        structureMesh.rotation.x = elapsedTime * 0.03;
        
        particleSystem.rotation.y = -elapsedTime * 0.015;

        // Smooth mouse following interpolation (lerp)
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Camera parallax movement
        camera.position.x = targetX * 3.5;
        camera.position.y = -targetY * 3.5;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();
};

/* ==========================================================================
   INTERACTIVE 3D HERO CARD TILT
   ========================================================================== */
const initCardTilt = () => {
    const card = document.getElementById('hero-card');
    if (!card) return;

    const maxTilt = 18; // maximum tilt angle in degrees

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        // Calculate mouse relative coordinates within the card (0 to width/height)
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Normalize coordinates: -0.5 to 0.5
        const normalizedX = (x / rect.width) - 0.5;
        const normalizedY = (y / rect.height) - 0.5;
        
        // Calculate rotations
        const rotY = (normalizedX * maxTilt).toFixed(2);
        const rotX = (-normalizedY * maxTilt).toFixed(2);
        
        // Apply transform styling
        card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03)`;
        
        // Apply cursor position custom properties for highlight glow
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
        // Reset tilt smoothly
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
        card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out';
    });
};

/* ==========================================================================
   SKILLS CARD LIGHTING HIGHLIGHTS
   ========================================================================== */
const initSkillCardsHighlight = () => {
    // Add spotlight hover tracking to both skill cards and certificate cards
    const cards = document.querySelectorAll('.skill-card, .cert-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
};

/* ==========================================================================
   TYPING TEXT ANIMATION
   ========================================================================== */
const initTypingAnimation = () => {
    const element = document.getElementById('typing-text');
    if (!element) return;

    const words = ["Creative Web Experiences", "3D Frontends", "Interactive Interfaces", "Responsive Layouts"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const type = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Delete characters
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40; // faster speed when deleting
        } else {
            // Add characters
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        // Check word completion states
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // pause at the end of the word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length; // cycle words
            typeSpeed = 500; // pause before typing next word
        }

        setTimeout(type, typeSpeed);
    };

    // Kickstart animation
    setTimeout(type, 500);
};

/* ==========================================================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
const initScrollReveal = () => {
    const revealedElements = document.querySelectorAll('[data-reveal]');
    
    const observerOptions = {
        root: null,
        threshold: 0.15, // element is visible by 15%
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('revealed');
                }, delay);
                
                observer.unobserve(element); // animate only once
            }
        });
    }, observerOptions);

    revealedElements.forEach(el => observer.observe(el));
};

/* ==========================================================================
   NAVIGATION INTERACTIONS (STICKY NAV, MOBILE TOGGLE)
   ========================================================================== */
const initNavigation = () => {
    const header = document.getElementById('main-header');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    // 1. Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 2. Active Link Highlighting based on Scroll Position
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // 3. Mobile Navigation Menu Toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile nav when clicking a link
        links.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
};

/* ==========================================================================
   CONTACT FORM SUBMISSION
   ========================================================================== */
const initContactForm = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Capture inputs
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Custom visual feedback (mock action)
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.querySelector('span').textContent;
        
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Sending...';
        submitBtn.querySelector('i').className = 'fa-solid fa-circle-notch fa-spin';

        setTimeout(() => {
            submitBtn.querySelector('span').textContent = 'Message Sent!';
            submitBtn.querySelector('i').className = 'fa-solid fa-check';
            submitBtn.style.background = '#28a745';
            submitBtn.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.4)';
            
            // Clear inputs
            form.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.querySelector('i').className = 'fa-solid fa-paper-plane';
                submitBtn.style.background = '';
                submitBtn.style.boxShadow = '';
            }, 3000);
        }, 1500);
    });
};

/* ==========================================================================
   CUSTOM CURSOR SYSTEM
   ========================================================================== */
const initCustomCursor = () => {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    if (!dot || !outline) return;

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate custom cursor with spring-damping interpolation (lerp)
    const updateCursor = () => {
        // Dot follows instantly or with very small delay
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;
        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;

        // Outline lags behind for fluid elastic effect
        outlineX += (mouseX - outlineX) * 0.12;
        outlineY += (mouseY - outlineY) * 0.12;
        outline.style.left = `${outlineX}px`;
        outline.style.top = `${outlineY}px`;

        requestAnimationFrame(updateCursor);
    };
    updateCursor();

    // Mouse Press States
    window.addEventListener('mousedown', () => {
        dot.classList.add('clicked');
        outline.classList.add('clicked');
    });

    window.addEventListener('mouseup', () => {
        dot.classList.remove('clicked');
        outline.classList.remove('clicked');
    });

    // Hover listeners for links and interactive items
    const hoverables = document.querySelectorAll('a, button, .btn, .nav-toggle, .social-btn, .project-card, .skill-card, .cert-card, input, textarea');
    
    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            dot.classList.add('hovered');
            outline.classList.add('hovered');
        });
        
        item.addEventListener('mouseleave', () => {
            dot.classList.remove('hovered');
            outline.classList.remove('hovered');
        });
    });
};

// Click handler for certificate cards
const initCertificateCardsClick = () => {
    const cards = document.querySelectorAll('.cert-card');
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // If the user clicked on a link inside the card, let the link handle it
            if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) {
                return;
            }
            // Find the primary view link in the card and click it
            const viewBtn = card.querySelector('.cert-btn');
            if (viewBtn) {
                window.open(viewBtn.href, '_blank', 'noopener,noreferrer');
            }
        });
    });
};

// Dropdown menu handler for mobile click-toggles
const initDropdowns = () => {
    const dropdowns = document.querySelectorAll('.cta-dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle active state on clicked dropdown
                const isActive = dropdown.classList.contains('active');
                
                // Close other dropdowns
                dropdowns.forEach(other => other.classList.remove('active'));
                
                if (!isActive) {
                    dropdown.classList.add('active');
                }
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    });
};

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initCardTilt();
    initSkillCardsHighlight();
    initTypingAnimation();
    initScrollReveal();
    initNavigation();
    initContactForm();
    initCustomCursor();
    initCertificateCardsClick();
    initDropdowns();
});
