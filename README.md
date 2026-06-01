# jizy-reveal

Provides a way to reveal or hide sensitive information, such as passwords, in input fields.

It injects a toggle button right after the target input. Clicking it switches the
input between `type="password"` and `type="text"`, updating the button label
accordingly. The value is automatically re-hidden when the user clicks anywhere
outside the input and button, or presses `Enter` / `Escape` while focused on the
input.

## Install

```bash
npm install jizy-reveal
```

## Usage

```javascript
import Reveal from 'jizy-reveal';

const passwordField = document.querySelector('#password');

const revealToggle = new Reveal(passwordField, {
    textOff: 'Show',
    textOn: 'Hide',
    onLoad: (element) => {
        // perform some stuff on the input element
    },
    onHide: (element) => {
        // perform some stuff on the input element
    },
    onShow: (element) => {
        // perform some stuff on the input element
    }
});
```

### Browser (global build)

The minified build at `dist/js/jizy-reveal.min.js` exposes a global `Reveal`:

```html
<script src="jizy-reveal.min.js"></script>
<script>
    new Reveal(document.querySelector('#password'));
</script>
```

## Options

All options are optional. Pass them as the second argument to the constructor.

| Option     | Type       | Default    | Description                                         |
|------------|------------|------------|-----------------------------------------------------|
| `textOff`  | `string`   | `'Show'`   | Button label while the value is hidden.             |
| `textOn`   | `string`   | `'Hide'`   | Button label while the value is revealed.           |
| `autoHide` | `boolean`  | `true`     | Re-hide the value on outside click or `Enter`/`Escape`. Set to `false` to toggle only via the button. |
| `onLoad`   | `function` | no-op      | Called once during construction, with the input element. |
| `onHide`   | `function` | no-op      | Called after the value is hidden, with the input element. |
| `onShow`   | `function` | no-op      | Called after the value is revealed, with the input element. |

## Methods

| Method      | Description                                                          |
|-------------|----------------------------------------------------------------------|
| `show()`    | Reveals the value (`type="text"`), updates the label, fires `onShow`. |
| `hide()`    | Hides the value (`type="password"`), updates the label, fires `onHide`. |
| `destroy()` | Removes the toggle button and unbinds all listeners (click, outside-click, keydown). Call this before discarding the input to avoid leaking listeners. |

```javascript
revealToggle.show();
revealToggle.hide();
revealToggle.destroy();
```

## Auto-hide behaviour

When `autoHide` is enabled (the default), a revealed value is hidden again
automatically when:

- the user clicks anywhere outside the input and its toggle button, or
- the user presses `Enter` or `Escape` while the input is focused.

Set `autoHide: false` to disable this and reveal/hide only through the toggle
button (or the `show()` / `hide()` methods).

## License

MIT © [Joffrey Demetz](https://joffreydemetz.com/)
