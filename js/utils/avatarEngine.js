/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/utils/avatarEngine.js
 * Version: 11.0.0 (ACADEMIC FIX: SEAMLESS ANATOMICAL NECK & COLLAR ALIGNMENT)
 * Description: High-precision SVG avatar rendering engine with anatomically correct
 *              head-neck-torso geometry, eliminating all gaps between neckline and jersey.
 */

const AVATAR_CONFIG = {
    FIXED_SKIN: '#e0ac69', 
    SKIN_TONES: ['#f8d9b6', '#e0ac69', '#c68642', '#8d5524', '#593110'],

    LOGOS: [
        null,
        'fa-shield-halved',
        'fa-star',
        'fa-bolt',
        'fa-fire',
        'fa-crown',
        'fa-skull',
        'fa-gem',
        'fa-dragon',
        'fa-anchor',
        'fa-feather-pointed',
        'fa-paw',
        'fa-award',
        'fa-certificate',
        'fa-yin-yang',
        'fa-peace',
        'fa-heart-crack',
        'fa-diamond',
        'fa-chess-knight',
        'fa-rocket',
        'fa-jet-fighter',
        'fa-ghost',
        'fa-robot',
        'fa-tree',
        'fa-water',
        'fa-wind'
    ],
    
    FACE_GEAR: [
        null,
        'fa-glasses',
        'fa-mask',
        'fa-infinity',
        'fa-head-side-headphones'
    ],

    HEAD_GEAR: [
        null,
        'fa-hat-cowboy',
        'fa-graduation-cap',
        'fa-helmet-safety',
        'fa-crown',
        'fa-band-aid'
    ],

    KITS: [
        '#3b82f6',
        '#ef4444',
        '#10b981',
        '#f59e0b',
        '#ffffff',
        '#111111',
        '#8b5cf6',
        '#D4AF37',
        '#ec4899',
        '#6366f1',
        '#14b8a6',
        '#7f1d1d',
        '#1e3a8a'
    ]
};

export class AvatarEngine {
    constructor() {
        this.state = { kit: '#3b82f6', logo: 1, face: 1, hair: 1 };
    }

    /**
     * Generates a fully anatomical, seamless SVG player avatar.
     * Eliminates all neck-sinking and shoulder alignment bugs.
     * 
     * @param {Object|string} visualDna - Visual DNA configuration
     * @param {string} shirtName - Player display name on jersey
     * @returns {string} HTML string containing responsive SVG
     */
    static generateAvatarHTML(visualDna, shirtName = 'NOUB') {
        const dna = (typeof visualDna === 'string') ? JSON.parse(visualDna || '{}') : (visualDna || {});
        
        const kitColor = dna.kit || '#D4AF37'; 
        const skinIndex = (dna.skin && dna.skin >= 1 && dna.skin <= AVATAR_CONFIG.SKIN_TONES.length) ? dna.skin - 1 : 1;
        const skinColor = AVATAR_CONFIG.SKIN_TONES[skinIndex] || AVATAR_CONFIG.FIXED_SKIN;
        
        const logoIcon = AVATAR_CONFIG.LOGOS[(dna.logo || 1) - 1];
        const faceIcon = AVATAR_CONFIG.FACE_GEAR[(dna.face || 1) - 1];
        const headIcon = AVATAR_CONFIG.HEAD_GEAR[(dna.hair || 1) - 1];

        // Unique SVG gradient IDs to avoid collisions
        const gradId = `kitGrad_${Math.floor(Math.random() * 1000000)}`;

        return `
            <div class="avatar-comp" style="
                position: relative; 
                width: 100%; 
                height: 100%; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                overflow: hidden;
            ">
                <svg viewBox="0 0 300 320" width="100%" height="100%" style="display: block; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.5));">
                    <defs>
                        <!-- Jersey 3D Lighting Gradient -->
                        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="${kitColor}" stop-opacity="1" />
                            <stop offset="70%" stop-color="${kitColor}" stop-opacity="0.9" />
                            <stop offset="100%" stop-color="#000000" stop-opacity="0.35" />
                        </linearGradient>
                        
                        <!-- Neck Shadow Gradient -->
                        <linearGradient id="neckShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="${skinColor}" />
                            <stop offset="100%" stop-color="#000000" stop-opacity="0.25" />
                        </linearGradient>
                    </defs>

                    <!-- 1. ANATOMICAL HEAD & NECK (SEAMLESS CONTINUITY) -->
                    <!-- Neck -->
                    <path d="M 130 115 L 130 160 Q 150 175 170 160 L 170 115 Z" fill="url(#neckShadow)" />
                    
                    <!-- Head Oval with Realistic Proportions -->
                    <ellipse cx="150" cy="85" rx="42" ry="50" fill="${skinColor}" />
                    
                    <!-- Ears -->
                    <circle cx="106" cy="88" r="10" fill="${skinColor}" />
                    <circle cx="194" cy="88" r="10" fill="${skinColor}" />

                    <!-- 2. ATHLETE JERSEY TORSO & SHOULDERS -->
                    <!-- Main Body & Sleeves (Anatomically Welded to Neck) -->
                    <path d="
                        M 125 155 
                        Q 150 178 175 155 
                        L 215 172 
                        L 255 210 
                        L 225 240 
                        L 205 215 
                        L 205 320 
                        L 95 320 
                        L 95 215 
                        L 75 240 
                        L 45 210 
                        L 85 172 
                        Z
                    " fill="url(#${gradId})" stroke="rgba(255,255,255,0.15)" stroke-width="2" />

                    <!-- Jersey Collar Trim (Golden/Accent Outline) -->
                    <path d="M 125 155 Q 150 182 175 155" fill="none" stroke="#D4AF37" stroke-width="4" stroke-linecap="round" />
                    <path d="M 125 155 Q 150 172 175 155" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="2" />

                    <!-- Jersey Seam Highlights (Athletic Fit Lines) -->
                    <path d="M 105 185 L 105 320" stroke="rgba(0,0,0,0.18)" stroke-width="2" />
                    <path d="M 195 185 L 195 320" stroke="rgba(0,0,0,0.18)" stroke-width="2" />
                </svg>

                <!-- 3. JERSEY LOGO BADGE (DYNAMIC OVERLAY) -->
                ${logoIcon ? `
                <div style="
                    position: absolute; 
                    top: 60%; 
                    right: 32%; 
                    transform: translateY(-50%);
                    z-index: 4; 
                    width: 28px; 
                    height: 28px; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    background: rgba(0,0,0,0.25);
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
                ">
                    <i class="fa-solid ${logoIcon}" style="font-size: 15px; color: #ffffff;"></i>
                </div>` : ''}

                <!-- 4. PLAYER NAME ON SHIRT -->
                <div class="shirt-text" style="
                    position: absolute; 
                    bottom: 16px; 
                    z-index: 5; 
                    color: rgba(255,255,255,0.95); 
                    font-family: 'Orbitron', 'Cairo', sans-serif; 
                    font-size: 13px; 
                    font-weight: 900;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.8);
                    pointer-events: none;
                ">
                    ${shirtName || 'NOUB'}
                </div>

                <!-- 5. FACE ACCESSORY (GLASSES / MASK) -->
                ${faceIcon ? `
                <i class="fa-solid ${faceIcon}" style="
                    font-size: 32px; 
                    color: #111; 
                    position: absolute;
                    top: 24%; 
                    z-index: 6; 
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
                "></i>
                ` : ''}

                <!-- 6. HEADGEAR (CROWN / CAP / HELMET) -->
                ${headIcon ? `
                <i class="fa-solid ${headIcon}" style="
                    font-size: 42px; 
                    color: #D4AF37;
                    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.6)); 
                    position: absolute;
                    top: 3%; 
                    z-index: 7; 
                "></i>
                ` : ''}
            </div>
        `;
    }
    
    static getConfig() {
        return AVATAR_CONFIG;
    }
}
