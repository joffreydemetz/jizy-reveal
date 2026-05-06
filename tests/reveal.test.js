/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';

let Reveal;

const setupInput = (attrs = {}) => {
    const input = document.createElement('input');
    input.type = 'password';
    input.name = attrs.name || 'pwd';
    if (attrs.value !== undefined) input.value = attrs.value;
    document.body.appendChild(input);
    return input;
};

const getButton = (instance) => document.querySelector(`#pwd-${instance.uid}`);
const getSpan = (instance) => document.querySelector(`#pwd-${instance.uid} > span`);

beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    Reveal = (await import('../lib/js/reveal.js')).default;
});

describe('constructor', () => {
    test('stores the element reference', () => {
        const input = setupInput();
        const r = new Reveal(input);
        expect(r.el).toBe(input);
    });

    test('initial readable state is false', () => {
        const r = new Reveal(setupInput());
        expect(r.readable).toBe(false);
    });

    test('applies default texts when no options given', () => {
        const r = new Reveal(setupInput());
        expect(r.config.textOff).toBe('Show');
        expect(r.config.textOn).toBe('Hide');
    });

    test('merges custom options over defaults', () => {
        const r = new Reveal(setupInput(), { textOff: 'Voir', textOn: 'Cacher' });
        expect(r.config.textOff).toBe('Voir');
        expect(r.config.textOn).toBe('Cacher');
    });

    test('keeps default callbacks as functions when not overridden', () => {
        const r = new Reveal(setupInput());
        expect(typeof r.config.onLoad).toBe('function');
        expect(typeof r.config.onHide).toBe('function');
        expect(typeof r.config.onShow).toBe('function');
    });

    test('accepts undefined options', () => {
        expect(() => new Reveal(setupInput())).not.toThrow();
    });

    test('generates a uid', () => {
        const r = new Reveal(setupInput());
        expect(typeof r.uid).toBe('string');
        expect(r.uid.length).toBeGreaterThan(0);
        expect(r.uid).not.toContain('.');
    });

    test('generates a different uid for each instance', () => {
        const a = new Reveal(setupInput({ name: 'a' }));
        const b = new Reveal(setupInput({ name: 'b' }));
        expect(a.uid).not.toBe(b.uid);
    });

    test('invokes onLoad with the element on construction', () => {
        const input = setupInput();
        const onLoad = jest.fn();
        new Reveal(input, { onLoad });
        expect(onLoad).toHaveBeenCalledTimes(1);
        expect(onLoad).toHaveBeenCalledWith(input);
    });
});

describe('render', () => {
    test('inserts a button immediately after the element', () => {
        const input = setupInput();
        const r = new Reveal(input);
        expect(input.nextElementSibling).toBe(getButton(r));
    });

    test('button id is pwd-<uid>', () => {
        const r = new Reveal(setupInput());
        expect(getButton(r).id).toBe(`pwd-${r.uid}`);
    });

    test('button contains a span with textOff text', () => {
        const r = new Reveal(setupInput(), { textOff: 'Voir' });
        const span = getSpan(r);
        expect(span).not.toBeNull();
        expect(span.tagName).toBe('SPAN');
        expect(span.innerText).toBe('Voir');
    });

    test('two instances each render their own button', () => {
        const a = new Reveal(setupInput({ name: 'a' }));
        const b = new Reveal(setupInput({ name: 'b' }));
        expect(document.querySelectorAll('button').length).toBe(2);
        expect(getButton(a)).not.toBe(getButton(b));
    });
});

describe('show()', () => {
    test('sets element type to text', () => {
        const input = setupInput();
        const r = new Reveal(input);
        r.show();
        expect(input.getAttribute('type')).toBe('text');
    });

    test('flips readable to true', () => {
        const r = new Reveal(setupInput());
        r.show();
        expect(r.readable).toBe(true);
    });

    test('adds readable class to span and updates text to textOn', () => {
        const r = new Reveal(setupInput(), { textOn: 'Cacher' });
        r.show();
        const span = getSpan(r);
        expect(span.classList.contains('readable')).toBe(true);
        expect(span.textContent).toBe('Cacher');
    });

    test('invokes onShow with the element', () => {
        const input = setupInput();
        const onShow = jest.fn();
        const r = new Reveal(input, { onShow });
        r.show();
        expect(onShow).toHaveBeenCalledTimes(1);
        expect(onShow).toHaveBeenCalledWith(input);
    });
});

describe('hide()', () => {
    test('sets element type back to password', () => {
        const input = setupInput();
        const r = new Reveal(input);
        r.show();
        r.hide();
        expect(input.getAttribute('type')).toBe('password');
    });

    test('flips readable to false', () => {
        const r = new Reveal(setupInput());
        r.show();
        r.hide();
        expect(r.readable).toBe(false);
    });

    test('removes readable class and restores textOff', () => {
        const r = new Reveal(setupInput(), { textOff: 'Voir' });
        r.show();
        r.hide();
        const span = getSpan(r);
        expect(span.classList.contains('readable')).toBe(false);
        expect(span.textContent).toBe('Voir');
    });

    test('invokes onHide with the element', () => {
        const input = setupInput();
        const onHide = jest.fn();
        const r = new Reveal(input, { onHide });
        r.show();
        r.hide();
        expect(onHide).toHaveBeenCalledTimes(1);
        expect(onHide).toHaveBeenCalledWith(input);
    });
});

describe('button click', () => {
    test('first click reveals the password', () => {
        const input = setupInput();
        const r = new Reveal(input);
        getButton(r).dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
        expect(r.readable).toBe(true);
        expect(input.getAttribute('type')).toBe('text');
    });

    test('second click hides it again', () => {
        const input = setupInput();
        const r = new Reveal(input);
        const btn = getButton(r);
        btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
        btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
        expect(r.readable).toBe(false);
        expect(input.getAttribute('type')).toBe('password');
    });

    test('preventDefault is called so the button does not submit a form', () => {
        const r = new Reveal(setupInput());
        const evt = new window.MouseEvent('click', { bubbles: true, cancelable: true });
        getButton(r).dispatchEvent(evt);
        expect(evt.defaultPrevented).toBe(true);
    });

    test('toggles the readable class on the span across clicks', () => {
        const r = new Reveal(setupInput());
        const btn = getButton(r);
        const span = getSpan(r);
        btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
        expect(span.classList.contains('readable')).toBe(true);
        btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
        expect(span.classList.contains('readable')).toBe(false);
    });

    test('two instances toggle independently', () => {
        const inputA = setupInput({ name: 'a' });
        const inputB = setupInput({ name: 'b' });
        const a = new Reveal(inputA);
        const b = new Reveal(inputB);
        getButton(a).dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
        expect(a.readable).toBe(true);
        expect(b.readable).toBe(false);
        expect(inputA.getAttribute('type')).toBe('text');
        expect(inputB.getAttribute('type')).toBe('password');
    });
});

describe('_onKeyPressed', () => {
    test('Enter hides the field', () => {
        const r = new Reveal(setupInput());
        r.show();
        const evt = new window.KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
        const result = r._onKeyPressed(evt);
        expect(r.readable).toBe(false);
        expect(evt.defaultPrevented).toBe(true);
        expect(result).toBe(false);
    });

    test('non-Enter keys are ignored', () => {
        const r = new Reveal(setupInput());
        r.show();
        r._onKeyPressed(new window.KeyboardEvent('keydown', { key: 'a', cancelable: true }));
        expect(r.readable).toBe(true);
    });
});

describe('_onClickedOutside', () => {
    test('hides when click target is outside both the input and the toggle button', () => {
        const r = new Reveal(setupInput());
        r.show();
        const outside = document.createElement('div');
        document.body.appendChild(outside);
        r._onClickedOutside({ target: outside });
        expect(r.readable).toBe(false);
    });

    test('does not hide when click target is the input element', () => {
        const input = setupInput();
        const r = new Reveal(input);
        r.show();
        r._onClickedOutside({ target: input });
        expect(r.readable).toBe(true);
    });

    test('does not hide when click target is inside the toggle button', () => {
        const r = new Reveal(setupInput());
        r.show();
        r._onClickedOutside({ target: getSpan(r) });
        expect(r.readable).toBe(true);
    });
});
