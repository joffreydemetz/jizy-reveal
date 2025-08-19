# jizy-reveal 

Provides a way to reveal or hide sensitive information, such as passwords, in input fields.

```javascript
import { Reveal } from 'jizy-reveal';

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
