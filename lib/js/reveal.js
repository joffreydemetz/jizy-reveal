export default class Reveal {
    constructor(element, options) {
        this.el = element;

        this.uid = parseInt(new Date().getTime() / 1000, 10) + (Math.random() * 10).toFixed(8).toString();
        this.uid = this.uid.toString().replace('.', '-');

        this.config = Object.assign({}, {
            textOff: 'Show',
            textOn: 'Hide',
            autoHide: true,
            onLoad: (element) => { },
            onHide: (element) => { },
            onShow: (element) => { }
        }, options || {});

        if (typeof this.config.onLoad === 'function') {
            this.config.onLoad(this.el);
        }

        this.readable = false;

        this.render();
    }

    render() {
        let button = document.createElement("button");
        this.el.after(button);
        button.id = `pwd-${this.uid}`;
        this.button = button;

        let span = document.createElement("span");
        button.appendChild(span);
        span.innerText = this.config.textOff;

        this._clickHandler = e => this._onClicked(e);
        button.addEventListener("click", this._clickHandler);

        if (this.config.autoHide) {
            this._outsideHandler = e => this._onClickedOutside(e);
            this._keyHandler = e => this._onKeyPressed(e);
            document.addEventListener("click", this._outsideHandler);
            this.el.addEventListener("keydown", this._keyHandler);
        }
    }

    destroy() {
        if (this.button) {
            this.button.removeEventListener("click", this._clickHandler);
            this.button.remove();
            this.button = null;
        }
        if (this._outsideHandler) {
            document.removeEventListener("click", this._outsideHandler);
        }
        if (this._keyHandler) {
            this.el.removeEventListener("keydown", this._keyHandler);
        }
    }

    hide() {
        this.readable = false;
        this.el.setAttribute("type", "password");
        document.querySelector(`#pwd-${this.uid} > span`).classList.remove("readable");
        document.querySelector(`#pwd-${this.uid} > span`).textContent = this.config.textOff;
        if (typeof this.config.onHide === 'function') {
            this.config.onHide(this.el);
        }
    }

    show() {
        this.readable = true;
        this.el.setAttribute("type", "text");
        document.querySelector(`#pwd-${this.uid} > span`).classList.add("readable");
        document.querySelector(`#pwd-${this.uid} > span`).textContent = this.config.textOn;
        if (typeof this.config.onShow === 'function') {
            this.config.onShow(this.el);
        }
    }

    _onClicked(e) {
        e.preventDefault();
        this.readable === false ? this.show() : this.hide();
        return false;
    }

    _onClickedOutside(e) {
        if (!this.button || !this.button.isConnected) {
            return;
        }
        if (!this.el.contains(e.target) && !this.button.contains(e.target)) {
            this.hide();
        }
    }

    _onKeyPressed(e) {
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            this.hide();
            return false;
        }
    }
};


