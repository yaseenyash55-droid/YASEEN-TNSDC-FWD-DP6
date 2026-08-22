# 🚀 Modern 3D Interactive Portfolio — Mohammed Yaseen A

A modern, high-performance **3D Animated Portfolio Website** featuring embedded interactive **Spline 3D Scenes**, **Three.js background constellations**, custom glassmorphism styling, and smooth `IntersectionObserver` scroll-reveal animations.

![Portfolio Preview Banner](assets/images/profile-front.jpg)

---

## ✨ Features & Enhancements Added

- 🎨 **Spline 3D Integration**:
  - **Hero Section**: Interactive 3D Developer Desk / Laptop scene (`@splinetool/viewer`) with real-time **3D Scene / Profile Card** view mode toggle.
  - **Skills Section**: Floating 3D Cyber Orb scene accent.
  - **Projects Section**: Floating 3D Spatial Geometry scene accent.
- ⚡ **Performance & Non-Blocking Lazy Loading**:
  - Post-paint dynamic injection of 3D WebGL scripts (0ms impact on First Contentful Paint).
  - WebGL capability detection & `prefers-reduced-motion` compliance.
  - 7-second fallback timeout automatically switching to static profile cards on slow connections.
- 🌊 **Smooth Entrance & Micro-Interactions**:
  - Cascading 80ms staggered reveals for skills, project cards, and certificates.
  - Sticky glassmorphic navbar with smooth height shrink (`80px` ➔ `64px`) on scroll.
  - Tactile button scale (`scale(1.025)`) and vector icon translation effects.
- 📱 **Responsive Design**:
  - Full mobile viewport optimization with touch device cursor handling and centered dropdowns.

---

## 🛠️ Tech Stack & Dependencies

- **HTML5 & Vanilla CSS3**: CSS Variables, Glassmorphism, CSS Grid & Flexbox layouts.
- **ES6+ JavaScript**: Vanilla DOM manipulation, `IntersectionObserver`, and WebGL detection.
- **Three.js (r128)**: Rendered on `#bg-canvas` for background particle constellation & wireframe icosahedron.
- **Spline 3D Web Component (`@splinetool/viewer`)**: Dynamic lazy CDN module import (`https://unpkg.com/@splinetool/viewer@1.9.72/build/spline-viewer.js`).
- **FontAwesome 6.4.0** & **Google Fonts** (*Inter* & *Outfit*).

---

## 💻 How to Run Locally

Since this is a lightweight static portfolio project, no build or node installation is required to run the site:

1. **Option A: VS Code Live Server**
   - Open the project folder in VS Code.
   - Right-click `index.html` and select **"Open with Live Server"**.

2. **Option B: Python Local Server**
   ```bash
   python -m http.server 8000
   ```
   Open `http://localhost:8000` in your browser.

3. **Option C: Node `serve`**
   ```bash
   npx serve .
   ```

---

## 🌐 Deployment Readiness

This project is a static web application and is **100% ready** for instant zero-configuration deployment to:

- **GitHub Pages**: Set source to `main` branch root (`/`).
- **Vercel**: Deploy with zero build settings (Output: `.`).
- **Netlify**: Drag-and-drop root folder or connect Git repository.
- **Surge.sh**: Run `npx surge` inside project directory.

---

## 📝 Optional Manual Customizations

If you'd like to personalize the 3D scenes further:
1. **Spline Scene Links**: You can replace any `url="https://prod.spline.design/..."` in `index.html` with your own custom exported `.splinecode` link from [Spline.design](https://spline.design).
2. **Project Screenshots**: Replace the `.project-placeholder` blocks in `index.html` with direct `<img>` tags if you have custom screenshots for your projects.
