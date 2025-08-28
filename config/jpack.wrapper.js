/*! jReveal v@VERSION | @DATE | [@BUNDLE] */
(function (global) {
    "use strict";

    if (typeof global !== "object" || !global || !global.document) {
        throw new Error("jReveal requires a window and a document");
    }

    if (typeof global.jReveal !== "undefined") {
        throw new Error("jReveal is already defined");
    }

    // @CODE 

    global.jReveal = Reveal;

})(typeof window !== "undefined" ? window : this);