/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/main.js
 * Version: Noub Sports_beta 2.0.0
 * Status: Production Ready
 */

import { NoubSportsApp } from './core/appClass.js';

window.addEventListener('DOMContentLoaded', () => {
    const app = new NoubSportsApp();
    app.boot();
});
