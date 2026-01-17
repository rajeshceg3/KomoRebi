# Komorebi

**Komorebi** (Japanese: 木漏れ日) is a digital sanctuary designed to provide a moment of calm and focus in a chaotic world. It is a single-file, zero-dependency static web application that leverages advanced browser technologies to create an immersive, generative relaxation experience.

## Vision
To demonstrate how minimal, efficient code can produce profound user experiences. Komorebi combines high-fidelity visual effects with procedurally generated audio to induce a state of "flow" and mindfulness.

## Features

### Visual Immersion
-   **Mesh Gradients:** Smoothly animating background colors that shift with the "Dawn", "Dusk", and "Meadow" themes.
-   **Parallax Depth:** Multi-layered environment (Dust Motes, Background, UI) that reacts to mouse movement with realistic depth perception.
-   **Atmospherics:** Procedural light rays and subtle film grain noise to add texture and warmth.
-   **Audio-Reactive Mandalas:** Generative sacred geometry that pulses, rotates, and evolves in perfect synchronization with the audio frequencies (Bass, Mids, Treble).

### "Resonance" Audio Engine
A custom-built, generative audio system powered by the Web Audio API.
-   **Procedural Soundscapes:** Real-time synthesis of ambient textures. No external audio files are used.
    -   *Dawn:* Ethereal sine waves and random chimes.
    -   *Dusk:* Deep, warm sawtooth drones with low-pass filtering.
    -   *Meadow:* Pink noise "wind" simulation and organic plucks.
-   **Spatial Audio:** Stereo panning and frequency modulation based on cursor position.
-   **Focus Synchronization:** Audio dynamics (volume and timbre) tightly coupled with the breathing rhythm in Focus Mode.

### Mindfulness Tools
-   **Focus Mode:** A 4-7-8 inspired breathing guide that simplifies the interface and synchronizes all sensory inputs (Visual + Audio) to a calming rhythm.

## Technical Architecture
-   **Stack:** Pure HTML5, CSS3, and Vanilla JavaScript (ES6+).
-   **Zero Dependencies:** No frameworks, no build steps, no external assets (fonts loaded via Google Fonts).
-   **Performance:**
    -   GPU-accelerated animations (`transform`, `will-change`).
    -   RequestAnimationFrame loops for parallax, audio spatialization, and canvas rendering.
    -   Procedural generation for both visuals (Canvas API) and audio (Oscillators/Buffers).

## Usage
Simply open `index.html` in any modern web browser.
-   **Click the Sound Icon** to enable the generative audio.
-   **Move your mouse** to explore the spatial soundscape.
-   **Select a Theme** (Sun, Moon, Leaf icons) to change the mood.
-   **Enter Focus Mode** (Circle icon) to start a guided breathing session.
