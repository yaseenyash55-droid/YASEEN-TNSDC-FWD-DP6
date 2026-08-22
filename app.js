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
   SCROLL REVEAL (INTERSECTION OBSERVER WITH STAGGER)
   ========================================================================== */
const initScrollReveal = () => {
    // Auto-stagger grid items if data-delay isn't explicitly set
    const gridContainers = document.querySelectorAll('.skills-grid, .projects-grid, .certs-grid, .contact-details');
    gridContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            if (child.hasAttribute('data-reveal') && !child.hasAttribute('data-delay')) {
                child.setAttribute('data-delay', (index % 4) * 80); // 80ms stagger step
            }
        });
    });

    const revealedElements = document.querySelectorAll('[data-reveal]');
    
    const observerOptions = {
        root: null,
        threshold: 0.12, // element is visible by 12%
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = parseInt(element.getAttribute('data-delay'), 10) || 0;
                
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
   SPLINE 3D LAZY LOADING, CAPABILITY DETECTION & CONTROLLER
   ========================================================================== */
const initSplineIntegration = () => {
    const splineBtn = document.getElementById('toggle-spline-btn');
    const cardBtn = document.getElementById('toggle-card-btn');
    const splineView = document.getElementById('spline-hero-view');
    const cardView = document.getElementById('card-hero-view');

    // 1. WebGL & Low Power Device Check
    const checkWebGLSupport = () => {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isWebGLAvailable = checkWebGLSupport();
    const isMobileDevice = window.innerWidth < 600;

    // Graceful Fallback: If WebGL unavailable or reduced motion requested, show profile card directly
    if (!isWebGLAvailable || prefersReducedMotion) {
        if (splineView && cardView) {
            splineView.style.display = 'none';
            cardView.style.display = 'block';
            cardView.classList.add('active');
            if (splineBtn && cardBtn) {
                cardBtn.classList.add('active');
                splineBtn.classList.remove('active');
            }
        }
    }

    // 2. Dynamic Lazy Loading Script Injection after initial page paint
    const loadSplineScript = () => {
        if (document.querySelector('script[src*="spline-viewer"]')) return;
        
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.9.72/build/spline-viewer.js';
        script.async = true;
        document.head.appendChild(script);
    };

    // Delay loading script until main thread is clear (after load)
    if (document.readyState === 'complete') {
        setTimeout(loadSplineScript, 200);
    } else {
        window.addEventListener('load', () => setTimeout(loadSplineScript, 200));
    }

    // 3. View Toggle Interaction
    if (splineBtn && cardBtn && splineView && cardView) {
        splineBtn.addEventListener('click', () => {
            splineBtn.classList.add('active');
            cardBtn.classList.remove('active');
            
            cardView.classList.remove('active');
            setTimeout(() => {
                cardView.style.display = 'none';
                splineView.style.display = 'block';
                splineView.classList.add('active');
            }, 150);
        });

        cardBtn.addEventListener('click', () => {
            cardBtn.classList.add('active');
            splineBtn.classList.remove('active');
            
            splineView.classList.remove('active');
            setTimeout(() => {
                splineView.style.display = 'none';
                cardView.style.display = 'block';
                cardView.classList.add('active');
            }, 150);
        });
    }

    // 4. Skeleton Loader & Timeout Fallback Handling
    const splineViewers = document.querySelectorAll('spline-viewer');
    splineViewers.forEach(viewer => {
        let isLoaded = false;

        const hideFallback = () => {
            if (isLoaded) return;
            isLoaded = true;
            const fallback = viewer.parentElement.querySelector('.spline-loader-fallback');
            if (fallback) {
                fallback.style.opacity = '0';
                fallback.style.transition = 'opacity 0.4s ease';
                setTimeout(() => fallback.remove(), 400);
            }
        };

        viewer.addEventListener('load', hideFallback);

        // Fallback Timeout: If 3D scene takes over 7s to load on slow connections, switch to static card gracefully
        setTimeout(() => {
            if (!isLoaded) {
                hideFallback();
                if (viewer.closest('#spline-hero-view') && cardBtn) {
                    cardBtn.click(); // Switch to profile card fallback
                }
            }
        }, 7000);
    });
};

/* ==========================================================================
   3D GLOBE-TO-FACE PARTICLE INTRO REVEAL SYSTEM
   ========================================================================== */
const initHeroFaceReveal = () => {
    const canvas = document.getElementById('hero-reveal-canvas');
    const settledPhoto = document.getElementById('hero-settled-photo');
    if (!canvas) return;

    // Capability & Motion Preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 600;

    // Setup Three.js Scene for Hero Reveal Box
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. STARTING STATE: Wireframe 3D Icosahedron / Globe
    const globeGeom = new THREE.IcosahedronGeometry(1.6, 2);
    const globeMat = new THREE.MeshBasicMaterial({
        color: 0xff2a5f,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const globeMesh = new THREE.Mesh(globeGeom, globeMat);
    scene.add(globeMesh);

    // Glow Outer Ring Sphere
    const ringGeom = new THREE.IcosahedronGeometry(1.85, 1);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    scene.add(ringMesh);

    // Particle Sampling Setup
    const sampleWidth = isMobile ? 36 : 56;
    const sampleHeight = isMobile ? 36 : 56;
    const particleCount = sampleWidth * sampleHeight;

    const particlesGeom = new THREE.BufferGeometry();
    const currentPositions = new Float32Array(particleCount * 3);
    const startPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    // Distribute start positions on sphere surface
    for (let i = 0; i < particleCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const radius = 1.6 + (Math.random() - 0.5) * 0.2;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        startPositions[i * 3] = x;
        startPositions[i * 3 + 1] = y;
        startPositions[i * 3 + 2] = z;

        currentPositions[i * 3] = x;
        currentPositions[i * 3 + 1] = y;
        currentPositions[i * 3 + 2] = z;

        // Default initial wireframe neon pink/cyan colors
        particleColors[i * 3] = 1.0;
        particleColors[i * 3 + 1] = 0.16;
        particleColors[i * 3 + 2] = 0.37;
    }

    // Default target grid positions
    for (let iy = 0; iy < sampleHeight; iy++) {
        for (let ix = 0; ix < sampleWidth; ix++) {
            const idx = iy * sampleWidth + ix;
            targetPositions[idx * 3] = ((ix / sampleWidth) - 0.5) * 2.4;
            targetPositions[idx * 3 + 1] = ((0.5 - (iy / sampleHeight))) * 2.4;
            targetPositions[idx * 3 + 2] = (Math.random() - 0.5) * 0.1;
        }
    }

    particlesGeom.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    particlesGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const pMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.045 : 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });

    const morphParticleSystem = new THREE.Points(particlesGeom, pMaterial);
    scene.add(morphParticleSystem);

    // 2. Load & Sample profile-front.jpg Pixels
    let isImageLoaded = false;
    const targetColors = new Float32Array(particleCount * 3);

    const img = new Image();
    img.src = 'assets/images/profile-front.jpg';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        const sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = sampleWidth;
        sampleCanvas.height = sampleHeight;
        const ctx = sampleCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
        const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight).data;

        for (let iy = 0; iy < sampleHeight; iy++) {
            for (let ix = 0; ix < sampleWidth; ix++) {
                const idx = iy * sampleWidth + ix;
                const pixelIdx = (iy * sampleWidth + ix) * 4;

                const r = imgData[pixelIdx] / 255;
                const g = imgData[pixelIdx + 1] / 255;
                const b = imgData[pixelIdx + 2] / 255;

                targetColors[idx * 3] = r;
                targetColors[idx * 3 + 1] = g;
                targetColors[idx * 3 + 2] = b;
            }
        }
        isImageLoaded = true;
    };

    // Animation Controls
    let animProgress = 0;
    let isSettled = false;
    const morphDuration = 2.0; // 2s morph
    const startTime = performance.now() + 400; // 400ms delay after load

    // Mouse Parallax Track
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            mouseX = ((e.clientX - rect.left) / rect.width) - 0.5;
            mouseY = ((e.clientY - rect.top) / rect.height) - 0.5;
        }
    });

    // Resize Handler
    window.addEventListener('resize', () => {
        if (!canvas.parentElement) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    // Main Render Loop
    const animateReveal = () => {
        const now = performance.now();
        const elapsed = (now - startTime) / 1000;

        // Reduced Motion Check
        if (prefersReducedMotion) {
            animProgress = 1;
        } else if (elapsed > 0) {
            animProgress = Math.min(1, elapsed / morphDuration);
        }

        // Quintic Easing Curve for smooth particle assembly
        const easeProgress = animProgress < 0.5 
            ? 16 * Math.pow(animProgress, 5) 
            : 1 - Math.pow(-2 * animProgress + 2, 5) / 2;

        // Rotate globe during starting state & early morph
        if (animProgress < 1) {
            globeMesh.rotation.y += 0.015;
            globeMesh.rotation.x += 0.008;
            ringMesh.rotation.y -= 0.012;

            globeMat.opacity = Math.max(0, 0.8 * (1 - easeProgress * 1.5));
            ringMat.opacity = Math.max(0, 0.35 * (1 - easeProgress * 1.5));
            pMaterial.opacity = Math.min(0.95, easeProgress * 1.4);
        } else {
            globeMesh.visible = false;
            ringMesh.visible = false;
        }

        // Lerp Particles from Sphere to Face Grid
        const posAttr = particlesGeom.attributes.position;
        const colAttr = particlesGeom.attributes.color;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Interpolate position
            posAttr.array[i3] = startPositions[i3] + (targetPositions[i3] - startPositions[i3]) * easeProgress;
            posAttr.array[i3 + 1] = startPositions[i3 + 1] + (targetPositions[i3 + 1] - startPositions[i3 + 1]) * easeProgress;
            posAttr.array[i3 + 2] = startPositions[i3 + 2] + (targetPositions[i3 + 2] - startPositions[i3 + 2]) * easeProgress;

            // Interpolate color if image loaded
            if (isImageLoaded) {
                colAttr.array[i3] = 1.0 + (targetColors[i3] - 1.0) * easeProgress;
                colAttr.array[i3 + 1] = 0.16 + (targetColors[i3 + 1] - 0.16) * easeProgress;
                colAttr.array[i3 + 2] = 0.37 + (targetColors[i3 + 2] - 0.37) * easeProgress;
            }
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;

        // Mouse Parallax Lerp
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        scene.rotation.y = targetX * 0.4;
        scene.rotation.x = -targetY * 0.4;

        // Settle State Handling
        if (easeProgress >= 1 && !isSettled) {
            isSettled = true;
            if (settledPhoto) {
                settledPhoto.classList.add('settled');
            }
            // Smoothly fade out particle canvas overlay once settled photo is visible
            setTimeout(() => {
                canvas.style.opacity = '0';
            }, 600);
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animateReveal);
    };

    animateReveal();
};

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initHeroFaceReveal();
    initCardTilt();
    initSkillCardsHighlight();
    initTypingAnimation();
    initScrollReveal();
    initNavigation();
    initContactForm();
    initCustomCursor();
    initCertificateCardsClick();
    initDropdowns();
    initSplineIntegration();
});
