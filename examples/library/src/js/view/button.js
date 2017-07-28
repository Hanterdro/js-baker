'use strict';

import getButtonText from "../lib/buttonText";

const BUTTON_HTML = `<button>${getButtonText('Tom')}</button>`;

function addButtonToDom(selector) {
    document.querySelector(selector).innerHTML = BUTTON_HTML;
}

export default addButtonToDom;