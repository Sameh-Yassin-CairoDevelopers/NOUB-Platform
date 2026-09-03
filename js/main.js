/*
 * Project: DYNASTY TYCOON (سلالات الفراعنة والورش الكبرى)
 * Filename: js/main.js
 * Version: 3.2.0
 */

import { DynastyTycoonApp } from './core/appClass.js';

window.addEventListener('DOMContentLoaded', () => {
    const app = new DynastyTycoonApp();
    app.boot();
});
