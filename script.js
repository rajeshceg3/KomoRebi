document.addEventListener('DOMContentLoaded', () => {
    // Get references to key DOM elements
    const body = document.body;
    const themeBloom = document.getElementById('theme-bloom');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const lightRays = document.getElementById('light-rays');
    const motesContainer = document.getElementById('dust-motes');
    const themeButtons = document.querySelectorAll('.control-leaf[id^="theme-"]');
    const togglePatternButton = document.getElementById('toggle-pattern');
    const toggleRaysButton = document.getElementById('toggle-rays');
    const focusToggleButton = document.getElementById('toggle-focus');
    const focusPromptEl = document.getElementById('focus-prompt');

    // Store original prompt text for focus mode
    const originalPromptText = focusPromptEl.textContent;
    const breathPrompts = ["Breathe In", "Hold", "Breathe Out", "Hold"];
    let breathIndex = 0; // Current index for breath prompts

    let animationFrameId = null; // For parallax animation frame
    let isFocusModeActive = false; // State for focus mode
    let focusInterval = null; // Interval for breathing prompts

    /**
     * Updates the active state of control buttons based on the current theme or pattern.
     */
    function updateControlActiveStates() {
        // Update active theme button
        const currentTheme = body.dataset.theme;
        themeButtons.forEach(button => {
            if (button.id === `theme-${currentTheme}`) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Update active state of pattern toggle button
        if (body.classList.contains('pattern-active')) {
            togglePatternButton.classList.add('active');
        } else {
            togglePatternButton.classList.remove('active');
        }

        // Update active state of light rays toggle button
        if (body.classList.contains('light-rays-active')) {
            toggleRaysButton.classList.add('active');
        } else {
            toggleRaysButton.classList.remove('active');
        }
    }

    /**
     * Helper function to convert CSS variable timing to milliseconds.
     * @param {string} varName - The name of the CSS variable (e.g., '--timing-fast').
     * @returns {number} The time in milliseconds.
     */
    function varCssToMs(varName) {
        const value = getComputedStyle(document.documentElement).getPropertyValue(varName);
        return parseFloat(value) || 0; // Return 0 if parsing fails
    }

    // --- PARALLAX EFFECT ---
    function handleParallaxMove(coords) {
        // Disable parallax if focus mode is active
        if (isFocusModeActive) return;

        // Cancel any pending animation frame to ensure only one is active
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        animationFrameId = requestAnimationFrame(() => {
            const { clientX, clientY } = coords;
            // Calculate normalized coordinates (-0.5 to 0.5) relative to viewport center
            const x = (clientX / window.innerWidth) - 0.5;
            const y = (clientY / window.innerHeight) - 0.5;

            // Move light rays with mouse
            const mouseXPercent = (clientX / window.innerWidth) * 100;
            if (lightRays) {
                lightRays.style.setProperty('--mouse-x', `${mouseXPercent}%`);
            }

            // Multipliers for different layers to create depth
            const multipliers = {
                'background-canvas': 30, // Moves fastest
                'main': -10,             // Moves slower, in opposite direction
                'controls': -5           // Moves slowest, in opposite direction
            };

            // Apply transform to each parallax layer
            parallaxLayers.forEach(layer => {
                // Determine multiplier based on layer ID or first class name
                // Check id first
                let multiplier = multipliers[layer.id];
                // If not found, check class list
                if (multiplier === undefined) {
                    const classes = layer.className.split(' ');
                    for (const cls of classes) {
                         if (multipliers[cls] !== undefined) {
                             multiplier = multipliers[cls];
                             break;
                         }
                    }
                }

                if (multiplier !== undefined && layer.style) {
                    layer.style.transform = `translateX(${x * multiplier}px) translateY(${y * multiplier}px)`;
                }
            });
        });
    }

    window.addEventListener('mousemove', handleParallaxMove);
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            handleParallaxMove(e.touches[0]);
        }
    }, { passive: true });

    // --- THEME BLOOM EFFECT ---
    function triggerThemeBloom(newTheme, event) {
        themeBloom.style.left = `${event.clientX}px`;
        themeBloom.style.top = `${event.clientY}px`;

        themeBloom.classList.remove('is-blooming');
        themeBloom.style.transform = 'scale(0)';

        void themeBloom.offsetWidth;

        themeBloom.classList.add('is-blooming');

        setTimeout(() => {
            body.dataset.theme = newTheme;
            updateControlActiveStates();
        }, varCssToMs('--timing-fast'));

        themeBloom.addEventListener('transitionend', () => {
            themeBloom.classList.remove('is-blooming');
            themeBloom.style.transform = 'scale(0)';
        }, { once: true });
    }

    themeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const newTheme = button.id.replace('theme-', '');
            triggerThemeBloom(newTheme, event);
        });
    });

    // --- TOGGLES ---
    togglePatternButton.addEventListener('click', () => {
        body.classList.toggle('pattern-active');
        updateControlActiveStates();
    });

    toggleRaysButton.addEventListener('click', () => {
        body.classList.toggle('light-rays-active');
        updateControlActiveStates();
    });

    // --- DUST MOTES GENERATION ---
    const numMotes = 30;
    for (let i = 0; i < numMotes; i++) {
        const mote = document.createElement('div');
        mote.className = 'mote';
        const size = Math.random() * 3 + 1;
        mote.style.width = `${size}px`;
        mote.style.height = `${size}px`;
        mote.style.left = `${Math.random() * 100}%`;
        mote.style.top = `${Math.random() * 100}%`;
        mote.style.animationDuration = `${Math.random() * 20 + 15}s`;
        mote.style.animationDelay = `${Math.random() * 10}s`;
        mote.style.setProperty('--x-end', Math.random() * 200 - 100);
        mote.style.setProperty('--y-end', Math.random() * 200 - 100);
        motesContainer.appendChild(mote);
    }

    // --- FOCUS MODE ---
    function toggleFocusMode() {
        isFocusModeActive = !isFocusModeActive;
        body.classList.toggle('focus-mode-active', isFocusModeActive);
        focusToggleButton.classList.toggle('active', isFocusModeActive);

        if (isFocusModeActive) {
            breathIndex = 0;

            const updatePrompt = () => {
                focusPromptEl.style.opacity = '0';
                setTimeout(() => {
                    const currentPrompt = breathPrompts[breathIndex];
                    focusPromptEl.textContent = currentPrompt;
                    focusPromptEl.style.opacity = '1';

                    motesContainer.classList.toggle('is-holding', currentPrompt === "Hold");

                    breathIndex = (breathIndex + 1) % breathPrompts.length;
                }, 500);
            };

            updatePrompt();
            focusInterval = setInterval(updatePrompt, 4000);
        } else {
            if (focusInterval) {
                clearInterval(focusInterval);
            }
            focusInterval = null;
            motesContainer.classList.remove('is-holding');
            focusPromptEl.style.opacity = '0';
            setTimeout(() => {
                focusPromptEl.textContent = originalPromptText;
                focusPromptEl.style.opacity = '1';
            }, 500);
        }
    }

    focusToggleButton.addEventListener('click', toggleFocusMode);

    document.getElementById('background-canvas').addEventListener('click', () => {
        if (isFocusModeActive) {
            toggleFocusMode();
        }
    });

    // Initial setup
    updateControlActiveStates();
});
