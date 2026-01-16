/**
 * Main Application Script - Vanilla JS (No jQuery)
 * Converted from jQuery to reduce ~85KB dependency
 */

// Utility functions (exported for testing)
const AppUtils = {
    // DOM Ready helper
    ready: function(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    },

    // Query selector helper
    $: function(selector, context) {
        return (context || document).querySelector(selector);
    },

    // Query selector all helper
    $$: function(selector, context) {
        return Array.from((context || document).querySelectorAll(selector));
    },

    // Add class to element
    addClass: function(el, className) {
        if (el) el.classList.add(className);
    },

    // Remove class from element
    removeClass: function(el, className) {
        if (el) el.classList.remove(className);
    },

    // Check if element has class
    hasClass: function(el, className) {
        return el ? el.classList.contains(className) : false;
    },

    // Get index of element among siblings
    getIndex: function(el) {
        if (!el || !el.parentNode) return -1;
        return Array.from(el.parentNode.children).indexOf(el);
    },

    // Calculate target index for navigation
    calculateTargetIndex: function(currentIndex, maxIndex, direction) {
        if (direction === 'down' || direction === 1) {
            return currentIndex !== maxIndex ? currentIndex + 1 : 0;
        } else if (direction === 'up' || direction === -1) {
            return currentIndex !== 0 ? currentIndex - 1 : maxIndex;
        }
        return currentIndex;
    },

    // Calculate slider positions with wrap-around
    calculateSliderPositions: function(centerId, numProjects, direction) {
        const wrap = (val) => {
            if (val < 0) return numProjects - 1;
            if (val >= numProjects) return 0;
            return val;
        };

        return {
            center: wrap(centerId + direction),
            left: wrap((centerId === 0 ? numProjects - 1 : centerId - 1) + direction),
            right: wrap((centerId === numProjects - 1 ? 0 : centerId + 1) + direction)
        };
    },

    // Determine transition class based on navigation direction
    getTransitionClass: function(fromIndex, toIndex, maxIndex) {
        // No transition for wrap-around
        if ((fromIndex === maxIndex && toIndex === 0) || (fromIndex === 0 && toIndex === maxIndex)) {
            return null;
        }
        return toIndex > fromIndex ? 'section--next' : 'section--prev';
    },

    // Check if CTA should be visible
    shouldShowCta: function(toIndex, maxIndex) {
        return toIndex !== 0 && toIndex !== maxIndex;
    },

    // Parse wheel delta from event
    parseWheelDelta: function(e) {
        return e.wheelDelta ? -e.wheelDelta : (e.deltaY || 20 * (e.detail || 0));
    },

    // Detect swipe gesture
    detectSwipe: function(startY, endY, startX, endX, startTime, endTime) {
        const deltaY = startY - endY;
        const deltaX = startX - endX;
        const deltaTime = endTime - startTime;

        // Require: vertical swipe > 50px, faster than 300ms, more vertical than horizontal
        if (Math.abs(deltaY) > 50 && deltaTime < 300 && Math.abs(deltaY) > Math.abs(deltaX)) {
            return deltaY > 0 ? 'down' : 'up';
        }
        return null;
    }
};

// Skip app initialization in test environment
var _isTestEnvironment = typeof module !== 'undefined' && module.exports && typeof jest !== 'undefined';

if (!_isTestEnvironment) {

// Main app initialization
(function() {
    'use strict';

    const { ready, $, $$, addClass, removeClass, hasClass, getIndex, 
            calculateTargetIndex, getTransitionClass, shouldShowCta,
            parseWheelDelta, detectSwipe, calculateSliderPositions } = AppUtils;

    function fadeIn(el, duration) {
        el.style.opacity = 0;
        el.style.transition = `opacity ${duration}ms`;
        requestAnimationFrame(() => { el.style.opacity = 1; });
    }

    function fadeOut(el, duration) {
        el.style.transition = `opacity ${duration}ms`;
        el.style.opacity = 0;
    }

    // Main app
    ready(function() {
        const sideNav = $('.side-nav');
        const outerNav = $('.outer-nav');
        const mainContent = $('.main-content');
        const headerCta = $('.header--cta');
        const perspective = $('.perspective');
        const outerNavReturn = $('.outer-nav--return');
        const viewport = document.getElementById('viewport');

        // Skip initialization if required DOM elements are missing
        if (!sideNav || !mainContent) return;

        // Navigate by direction (scroll/swipe/keyboard)
        function navigateByDirection(direction) {
            const activeNav = $('.is-active', sideNav);
            const currentIndex = getIndex(activeNav);
            const maxIndex = sideNav.children.length - 1;
            const targetIndex = calculateTargetIndex(currentIndex, maxIndex, direction);

            updateNavigation(targetIndex);
            updateSections(currentIndex, targetIndex, maxIndex);
        }

        // Update navigation active states
        function updateNavigation(targetIndex) {
            $$('.side-nav > li, .outer-nav > li').forEach(li => removeClass(li, 'is-active'));
            addClass(sideNav.children[targetIndex], 'is-active');
            addClass(outerNav.children[targetIndex], 'is-active');
        }

        // Update section visibility and transitions
        function updateSections(fromIndex, toIndex, maxIndex) {
            const sections = $$(mainContent.tagName + ' > li', mainContent.parentNode);
            
            sections.forEach(section => {
                removeClass(section, 'section--is-active');
                $$('.section--next, .section--prev', section).forEach(el => {
                    removeClass(el, 'section--next');
                    removeClass(el, 'section--prev');
                });
            });

            addClass(mainContent.children[toIndex], 'section--is-active');

            // Add transition classes
            const transitionClass = getTransitionClass(fromIndex, toIndex, maxIndex);
            if (transitionClass) {
                const fromSection = mainContent.children[fromIndex];
                if (fromSection) {
                    Array.from(fromSection.children).forEach(child => addClass(child, transitionClass));
                }
            }

            // Toggle header CTA visibility
            if (shouldShowCta(toIndex, maxIndex)) {
                addClass(headerCta, 'is-active');
            } else {
                removeClass(headerCta, 'is-active');
            }
        }

        // Navigation toggle (hamburger menu)
        function initNavToggle() {
            const navToggle = $('.header--nav-toggle');
            
            navToggle.addEventListener('click', function() {
                addClass(perspective, 'perspective--modalview');
                setTimeout(() => addClass(perspective, 'effect-rotate-left--animate'), 25);
                addClass(outerNav, 'is-vis');
                $$('.outer-nav li').forEach(li => addClass(li, 'is-vis'));
                addClass(outerNavReturn, 'is-vis');
            });

            function closeNav() {
                removeClass(perspective, 'effect-rotate-left--animate');
                setTimeout(() => removeClass(perspective, 'perspective--modalview'), 400);
                removeClass(outerNav, 'is-vis');
                $$('.outer-nav li').forEach(li => removeClass(li, 'is-vis'));
                removeClass(outerNavReturn, 'is-vis');
            }

            outerNavReturn.addEventListener('click', closeNav);
            $$('.outer-nav li').forEach(li => li.addEventListener('click', closeNav));
        }

        // Slider functionality
        function initSlider() {
            const prevBtn = $('.slider--prev');
            const nextBtn = $('.slider--next');
            const slider = $('.slider');

            if (!prevBtn || !nextBtn || !slider) return;

            function slide(direction) {
                fadeOut(slider, 400);

                setTimeout(() => {
                    const allProjects = $$('.slider--item', slider);
                    const numProjects = allProjects.length;

                    for (let i = 0; i < numProjects; i++) {
                        if (hasClass(allProjects[i], 'slider--item-center')) {
                            const positions = calculateSliderPositions(i, numProjects, direction);

                            // Remove old positions
                            removeClass(allProjects[i], 'slider--item-center');
                            const oldLeftId = i === 0 ? numProjects - 1 : i - 1;
                            const oldRightId = i === numProjects - 1 ? 0 : i + 1;
                            removeClass(allProjects[oldLeftId], 'slider--item-left');
                            removeClass(allProjects[oldRightId], 'slider--item-right');
                            allProjects.forEach(p => addClass(p, 'slider--item-hidden'));

                            // Apply new positions
                            removeClass(allProjects[positions.center], 'slider--item-hidden');
                            addClass(allProjects[positions.center], 'slider--item-center');
                            removeClass(allProjects[positions.left], 'slider--item-hidden');
                            addClass(allProjects[positions.left], 'slider--item-left');
                            removeClass(allProjects[positions.right], 'slider--item-hidden');
                            addClass(allProjects[positions.right], 'slider--item-right');

                            break;
                        }
                    }
                }, 400);

                fadeIn(slider, 400);
            }

            prevBtn.addEventListener('click', () => slide(-1));
            nextBtn.addEventListener('click', () => slide(1));

            // Keyboard arrow navigation for slider
            document.addEventListener('keydown', function(e) {
                // Only trigger when Projects section (index 1) is active
                const activeNav = $('.is-active', sideNav);
                if (getIndex(activeNav) !== 1) return;
                
                // Don't interfere with nav menu or input fields
                if (hasClass(outerNav, 'is-vis')) return;
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                if (e.keyCode === 37) { // Left arrow
                    e.preventDefault();
                    slide(-1);
                } else if (e.keyCode === 39) { // Right arrow
                    e.preventDefault();
                    slide(1);
                }
            });
        }

        // Form input labels
        function initFormInputs() {
            $$('.work-request--information input').forEach(input => {
                input.addEventListener('focusout', function() {
                    if (this.value === '') {
                        removeClass(this, 'has-value');
                    } else {
                        addClass(this, 'has-value');
                    }
                    window.scrollTo(0, 0);
                });
            });
        }

        // Hash navigation
        function handleHash() {
            const hash = window.location.hash;
            if (!hash) return;

            const target = document.querySelector(hash);
            if (!target) return;

            const section = target.closest('.l-section.section');
            if (!section) return;

            const sections = Array.from(mainContent.children);
            const targetIndex = sections.indexOf(section);
            if (targetIndex < 0) return;

            const activeNav = $('.is-active', sideNav);
            const currentIndex = getIndex(activeNav);
            const maxIndex = sideNav.children.length - 1;

            updateNavigation(targetIndex);
            updateSections(currentIndex, targetIndex, maxIndex);
        }

        // Wheel/scroll navigation
        let wheelThrottled = true;
        let wheelTimeout = null;

        function handleWheel(e) {
            if (hasClass(outerNav, 'is-vis')) return;

            if (e.cancelable) e.preventDefault();

            const delta = parseWheelDelta(e);

            if (delta > 50 && wheelThrottled) {
                wheelThrottled = false;
                clearTimeout(wheelTimeout);
                wheelTimeout = setTimeout(() => { wheelThrottled = true; }, 800);
                navigateByDirection('down');
            } else if (delta < -50 && wheelThrottled) {
                wheelThrottled = false;
                clearTimeout(wheelTimeout);
                wheelTimeout = setTimeout(() => { wheelThrottled = true; }, 800);
                navigateByDirection('up');
            }
        }

        document.addEventListener('wheel', handleWheel, { passive: false });
        document.addEventListener('mousewheel', handleWheel, { passive: false });
        document.addEventListener('DOMMouseScroll', handleWheel, { passive: false });

        // Click navigation
        $$('.side-nav li, .outer-nav li').forEach(li => {
            li.addEventListener('click', function() {
                if (hasClass(this, 'is-active')) return;

                const parent = this.parentNode;
                const activeEl = $('.is-active', parent);
                const fromIndex = getIndex(activeEl);
                const toIndex = getIndex(this);
                const maxIndex = parent.children.length - 1;

                updateNavigation(toIndex);
                updateSections(fromIndex, toIndex, maxIndex);
            });
        });

        // CTA button click
        $$('.cta').forEach(cta => {
            cta.addEventListener('click', function() {
                const activeNav = $('.is-active', sideNav);
                const currentIndex = getIndex(activeNav);
                const maxIndex = sideNav.children.length - 1;

                updateNavigation(maxIndex);
                updateSections(currentIndex, maxIndex, maxIndex);
            });
        });

        // Native touch swipe support (replaces Hammer.js, saves ~72KB)
        if (viewport) {
            let touchStartY = 0;
            let touchStartX = 0;
            let touchStartTime = 0;

            viewport.addEventListener('touchstart', function(e) {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
                touchStartTime = Date.now();
            }, { passive: true });

            viewport.addEventListener('touchend', function(e) {
                if (hasClass(outerNav, 'is-vis')) return;

                const touchEndY = e.changedTouches[0].clientY;
                const touchEndX = e.changedTouches[0].clientX;
                const swipeDirection = detectSwipe(touchStartY, touchEndY, touchStartX, touchEndX, touchStartTime, Date.now());

                if (swipeDirection) {
                    navigateByDirection(swipeDirection);
                }
            }, { passive: true });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (hasClass(outerNav, 'is-vis')) return;

            if (e.keyCode === 40) { // Down arrow
                e.preventDefault();
                navigateByDirection('down');
            } else if (e.keyCode === 38) { // Up arrow
                e.preventDefault();
                navigateByDirection('up');
            }
        });

        // Initialize
        initNavToggle();
        initSlider();
        initFormInputs();
        handleHash();
        window.addEventListener('hashchange', handleHash);
    });

    // Lazy-load ClustrMaps
    ready(function() {
        const container = document.getElementById('clustrmap-container');
        if (!container) return;

        const scriptUrl = container.dataset.clustrSrc || 
            'https://clustrmaps.com/globe.js?d=YgWdHCkJi9jii45ReF_lG6XfjkX6EY71WmJlCaYnpMs';

        function ensureGlobe() {
            if (container.querySelector('canvas, iframe')) return;
            
            const iframe = document.createElement('iframe');
            iframe.src = 'map.html';
            iframe.title = 'Visitor map';
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            iframe.style.border = '0';
            container.appendChild(iframe);
        }

        function loadGlobeScript() {
            if (container.dataset.globeLoaded) return;
            container.dataset.globeLoaded = 'true';

            const script = document.createElement('script');
            script.id = 'clstr_globe';
            script.src = scriptUrl;
            script.async = true;
            script.onload = () => setTimeout(ensureGlobe, 1500);
            script.onerror = ensureGlobe;
            container.appendChild(script);
            setTimeout(ensureGlobe, 2000);
        }

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadGlobeScript();
                        observer.disconnect();
                    }
                });
            }, { root: null, threshold: 0.25 });
            observer.observe(container);
        } else {
            loadGlobeScript();
        }
    });
})();

} // End of browser environment check

// Export for testing (CommonJS/Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppUtils;
}
