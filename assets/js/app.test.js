/**
 * Unit Tests for app.js utility functions
 * Run with: npm test
 */

/**
 * @jest-environment jsdom
 */

const AppUtils = require('./app.js');

describe('AppUtils', () => {
    
    // ========================================
    // DOM Helper Tests
    // ========================================
    
    describe('$ (querySelector helper)', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div class="container">
                    <p class="text">Hello</p>
                    <span class="text">World</span>
                </div>
            `;
        });

        test('should select first matching element', () => {
            const el = AppUtils.$('.text');
            expect(el.tagName).toBe('P');
            expect(el.textContent).toBe('Hello');
        });

        test('should return null for non-existent selector', () => {
            const el = AppUtils.$('.nonexistent');
            expect(el).toBeNull();
        });

        test('should work with context parameter', () => {
            const container = document.querySelector('.container');
            const el = AppUtils.$('.text', container);
            expect(el.textContent).toBe('Hello');
        });
    });

    describe('$$ (querySelectorAll helper)', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <ul>
                    <li>One</li>
                    <li>Two</li>
                    <li>Three</li>
                </ul>
            `;
        });

        test('should return array of all matching elements', () => {
            const items = AppUtils.$$('li');
            expect(Array.isArray(items)).toBe(true);
            expect(items.length).toBe(3);
        });

        test('should return empty array for non-existent selector', () => {
            const items = AppUtils.$$('.nonexistent');
            expect(items).toEqual([]);
        });
    });

    // ========================================
    // Class Manipulation Tests
    // ========================================

    describe('addClass', () => {
        test('should add class to element', () => {
            document.body.innerHTML = '<div id="test"></div>';
            const el = document.getElementById('test');
            AppUtils.addClass(el, 'active');
            expect(el.classList.contains('active')).toBe(true);
        });

        test('should handle null element gracefully', () => {
            expect(() => AppUtils.addClass(null, 'active')).not.toThrow();
        });
    });

    describe('removeClass', () => {
        test('should remove class from element', () => {
            document.body.innerHTML = '<div id="test" class="active"></div>';
            const el = document.getElementById('test');
            AppUtils.removeClass(el, 'active');
            expect(el.classList.contains('active')).toBe(false);
        });

        test('should handle null element gracefully', () => {
            expect(() => AppUtils.removeClass(null, 'active')).not.toThrow();
        });
    });

    describe('hasClass', () => {
        test('should return true when element has class', () => {
            document.body.innerHTML = '<div id="test" class="active"></div>';
            const el = document.getElementById('test');
            expect(AppUtils.hasClass(el, 'active')).toBe(true);
        });

        test('should return false when element does not have class', () => {
            document.body.innerHTML = '<div id="test"></div>';
            const el = document.getElementById('test');
            expect(AppUtils.hasClass(el, 'active')).toBe(false);
        });

        test('should return false for null element', () => {
            expect(AppUtils.hasClass(null, 'active')).toBe(false);
        });
    });

    // ========================================
    // Index Helper Tests
    // ========================================

    describe('getIndex', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <ul>
                    <li id="first">One</li>
                    <li id="second">Two</li>
                    <li id="third">Three</li>
                </ul>
            `;
        });

        test('should return correct index for first child', () => {
            const el = document.getElementById('first');
            expect(AppUtils.getIndex(el)).toBe(0);
        });

        test('should return correct index for middle child', () => {
            const el = document.getElementById('second');
            expect(AppUtils.getIndex(el)).toBe(1);
        });

        test('should return correct index for last child', () => {
            const el = document.getElementById('third');
            expect(AppUtils.getIndex(el)).toBe(2);
        });

        test('should return -1 for null element', () => {
            expect(AppUtils.getIndex(null)).toBe(-1);
        });

        test('should return -1 for element without parent', () => {
            const orphan = document.createElement('div');
            expect(AppUtils.getIndex(orphan)).toBe(-1);
        });
    });

    // ========================================
    // Navigation Logic Tests
    // ========================================

    describe('calculateTargetIndex', () => {
        test('should increment index when going down', () => {
            expect(AppUtils.calculateTargetIndex(0, 4, 'down')).toBe(1);
            expect(AppUtils.calculateTargetIndex(2, 4, 'down')).toBe(3);
        });

        test('should wrap to 0 when going down from max', () => {
            expect(AppUtils.calculateTargetIndex(4, 4, 'down')).toBe(0);
        });

        test('should decrement index when going up', () => {
            expect(AppUtils.calculateTargetIndex(2, 4, 'up')).toBe(1);
            expect(AppUtils.calculateTargetIndex(4, 4, 'up')).toBe(3);
        });

        test('should wrap to max when going up from 0', () => {
            expect(AppUtils.calculateTargetIndex(0, 4, 'up')).toBe(4);
        });

        test('should work with numeric direction (1 = down)', () => {
            expect(AppUtils.calculateTargetIndex(0, 4, 1)).toBe(1);
        });

        test('should work with numeric direction (-1 = up)', () => {
            expect(AppUtils.calculateTargetIndex(2, 4, -1)).toBe(1);
        });

        test('should return current index for invalid direction', () => {
            expect(AppUtils.calculateTargetIndex(2, 4, 'invalid')).toBe(2);
        });
    });

    // ========================================
    // Slider Position Tests
    // ========================================

    describe('calculateSliderPositions', () => {
        test('should calculate positions moving forward (direction = 1)', () => {
            const positions = AppUtils.calculateSliderPositions(1, 6, 1);
            expect(positions.center).toBe(2);
            expect(positions.left).toBe(1);
            expect(positions.right).toBe(3);
        });

        test('should calculate positions moving backward (direction = -1)', () => {
            const positions = AppUtils.calculateSliderPositions(2, 6, -1);
            expect(positions.center).toBe(1);
            expect(positions.left).toBe(0);
            expect(positions.right).toBe(2);
        });

        test('should wrap around when moving forward from last item', () => {
            const positions = AppUtils.calculateSliderPositions(5, 6, 1);
            expect(positions.center).toBe(0);
        });

        test('should wrap around when moving backward from first item', () => {
            const positions = AppUtils.calculateSliderPositions(0, 6, -1);
            expect(positions.center).toBe(5);
        });

        test('should handle edge case with 3 items', () => {
            const positions = AppUtils.calculateSliderPositions(0, 3, 1);
            expect(positions.center).toBe(1);
            expect(positions.left).toBe(0);
            expect(positions.right).toBe(2);
        });
    });

    // ========================================
    // Transition Class Tests
    // ========================================

    describe('getTransitionClass', () => {
        test('should return section--next when moving forward', () => {
            expect(AppUtils.getTransitionClass(0, 2, 4)).toBe('section--next');
            expect(AppUtils.getTransitionClass(1, 3, 4)).toBe('section--next');
        });

        test('should return section--prev when moving backward', () => {
            expect(AppUtils.getTransitionClass(3, 1, 4)).toBe('section--prev');
            expect(AppUtils.getTransitionClass(2, 0, 4)).toBe('section--prev');
        });

        test('should return null for wrap-around from max to 0', () => {
            expect(AppUtils.getTransitionClass(4, 0, 4)).toBeNull();
        });

        test('should return null for wrap-around from 0 to max', () => {
            expect(AppUtils.getTransitionClass(0, 4, 4)).toBeNull();
        });
    });

    // ========================================
    // CTA Visibility Tests
    // ========================================

    describe('shouldShowCta', () => {
        test('should return false for first section (index 0)', () => {
            expect(AppUtils.shouldShowCta(0, 4)).toBe(false);
        });

        test('should return false for last section', () => {
            expect(AppUtils.shouldShowCta(4, 4)).toBe(false);
        });

        test('should return true for middle sections', () => {
            expect(AppUtils.shouldShowCta(1, 4)).toBe(true);
            expect(AppUtils.shouldShowCta(2, 4)).toBe(true);
            expect(AppUtils.shouldShowCta(3, 4)).toBe(true);
        });
    });

    // ========================================
    // Wheel Delta Tests
    // ========================================

    describe('parseWheelDelta', () => {
        test('should parse wheelDelta (legacy)', () => {
            const event = { wheelDelta: -120 };
            expect(AppUtils.parseWheelDelta(event)).toBe(120);
        });

        test('should parse deltaY (modern)', () => {
            const event = { deltaY: 100 };
            expect(AppUtils.parseWheelDelta(event)).toBe(100);
        });

        test('should parse detail (Firefox legacy)', () => {
            const event = { detail: 3 };
            expect(AppUtils.parseWheelDelta(event)).toBe(60);
        });

        test('should prioritize wheelDelta over deltaY', () => {
            const event = { wheelDelta: -120, deltaY: 100 };
            expect(AppUtils.parseWheelDelta(event)).toBe(120);
        });
    });

    // ========================================
    // Swipe Detection Tests
    // ========================================

    describe('detectSwipe', () => {
        test('should detect swipe up (returns down direction)', () => {
            // Swipe up: start at 500, end at 400 (moved up by 100)
            const result = AppUtils.detectSwipe(500, 400, 200, 200, 0, 200);
            expect(result).toBe('down');
        });

        test('should detect swipe down (returns up direction)', () => {
            // Swipe down: start at 400, end at 500 (moved down by 100)
            const result = AppUtils.detectSwipe(400, 500, 200, 200, 0, 200);
            expect(result).toBe('up');
        });

        test('should return null for horizontal swipe', () => {
            // Horizontal swipe: more X movement than Y
            const result = AppUtils.detectSwipe(500, 520, 200, 400, 0, 200);
            expect(result).toBeNull();
        });

        test('should return null for small movements', () => {
            // Movement less than 50px
            const result = AppUtils.detectSwipe(500, 470, 200, 200, 0, 200);
            expect(result).toBeNull();
        });

        test('should return null for slow swipes', () => {
            // Swipe takes more than 300ms
            const result = AppUtils.detectSwipe(500, 400, 200, 200, 0, 500);
            expect(result).toBeNull();
        });

        test('should detect swipe at boundary conditions', () => {
            // Exactly 51px in 299ms
            const result = AppUtils.detectSwipe(500, 449, 200, 200, 0, 299);
            expect(result).toBe('down');
        });
    });

    // ========================================
    // DOM Ready Tests
    // ========================================

    describe('ready', () => {
        test('should call function immediately if DOM is ready', () => {
            const mockFn = jest.fn();
            // In jsdom, document.readyState is typically 'complete'
            AppUtils.ready(mockFn);
            expect(mockFn).toHaveBeenCalled();
        });
    });
});
