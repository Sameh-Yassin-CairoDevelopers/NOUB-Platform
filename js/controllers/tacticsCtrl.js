/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/controllers/tacticsCtrl.js
 * Version: Noub Sports_beta 2.6.0 (FINAL ENGINEERING MASTER)
 * Status: Production Ready
 */

import { CanvasExporter } from '../utils/canvasExporter.js';
import { SoundManager } from '../utils/soundManager.js';
import { NotificationService } from '../services/notificationService.js';

export class TacticsController {
    constructor(router) {
        this.router = router;
        this.selectedElement = null;
        this.selectedTool = null;
        this.tokenCounterGold = 1;
        this.tokenCounterRed = 1;
    }

    init() {
        this.render();
    }

    render() {
        const view = document.getElementById('view-tactics');
        if (!view) return;

        view.innerHTML = `
            <div class="tactics-wrapper">
                <!-- TOOLBAR -->
                <div class="tactics-toolbar-container">
                    <div class="toolbar-group">
                        <button class="tool-btn" id="tactic-add-gold" title="إضافة لاعب أساسي">
                            <i class="fa-solid fa-user" style="color:#ffd700"></i>
                        </button>
                        <button class="tool-btn" id="tactic-add-red" title="إضافة لاعب منافس">
                            <i class="fa-solid fa-user" style="color:#ff6b6b"></i>
                        </button>
                        <button class="tool-btn" id="tactic-add-ball" title="إضافة كرة">
                            <i class="fa-solid fa-futbol"></i>
                        </button>
                        <button class="tool-btn" id="tactic-add-cone" title="قمع تدريب">
                            <i class="fa-solid fa-mountain" style="color:#ff9100"></i>
                        </button>
                        <button class="tool-btn" id="tactic-add-arrow" title="سهم تكتيكي">
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                        <button class="tool-btn btn-delete" id="tactic-delete-btn" title="حذف العنصر المحدد">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                    <div class="toolbar-group">
                        <button class="tool-btn" id="tactic-export-btn" title="تصدير الخطة كصورة HD">
                            <i class="fa-solid fa-download"></i>
                        </button>
                        <button class="btn-close-board" id="tactic-close-btn" title="إغلاق">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                <!-- 3D PITCH CANVAS -->
                <div class="field-wrapper">
                    <div class="field-container" id="tactics-pitch-canvas">
                        <div class="goal-net top"></div>
                        <div class="goal-net bottom"></div>

                        <div class="penalty-box top"></div>
                        <div class="penalty-box bottom"></div>

                        <div class="penalty-spot top"></div>
                        <div class="penalty-spot bottom"></div>

                        <div class="pitch-line center-line"></div>
                        <div class="pitch-circle"></div>
                        <div class="pitch-spot-center"></div>

                        <div class="corner-arc tl"></div>
                        <div class="corner-arc tr"></div>
                        <div class="corner-arc bl"></div>
                        <div class="corner-arc br"></div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const pitch = document.getElementById('tactics-pitch-canvas');
        if (!pitch) return;

        document.getElementById('tactic-close-btn')?.addEventListener('click', () => {
            SoundManager.play('click');
            this.router.navigate('view-home');
        });

        document.getElementById('tactic-add-gold')?.addEventListener('click', () => {
            this.addDraggableToken(pitch, 'GOLD');
        });

        document.getElementById('tactic-add-red')?.addEventListener('click', () => {
            this.addDraggableToken(pitch, 'RED');
        });

        document.getElementById('tactic-add-ball')?.addEventListener('click', () => {
            this.addDraggableItem(pitch, 'tool-ball');
        });

        document.getElementById('tactic-add-cone')?.addEventListener('click', () => {
            this.addDraggableItem(pitch, 'tool-cone');
        });

        document.getElementById('tactic-add-arrow')?.addEventListener('click', () => {
            this.addDraggableItem(pitch, 'tool-arrow');
        });

        document.getElementById('tactic-delete-btn')?.addEventListener('click', () => {
            if (this.selectedElement) {
                this.selectedElement.remove();
                this.selectedElement = null;
                document.getElementById('tactic-delete-btn')?.classList.remove('enabled');
                SoundManager.play('click');
            }
        });

        document.getElementById('tactic-export-btn')?.addEventListener('click', () => {
            SoundManager.play('success');
            CanvasExporter.exportBoard(pitch, 'noub-tactic-board.png');
            NotificationService.showToast("تم تصدير الخطة التكتيكية بنجاح!", "success");
        });

        pitch.addEventListener('click', (e) => {
            if (e.target === pitch) {
                this.deselectAll();
            }
        });
    }

    addDraggableToken(pitch, type) {
        SoundManager.play('click');
        const token = document.createElement('div');
        token.className = `draggable-item tactic-token ${type === 'GOLD' ? 'token-gold' : 'token-red'}`;
        
        const num = type === 'GOLD' ? this.tokenCounterGold++ : this.tokenCounterRed++;
        token.innerText = num.toString();

        token.style.top = '45%';
        token.style.left = type === 'GOLD' ? '40%' : '55%';

        this.attachDragBehavior(token, pitch);
        pitch.appendChild(token);
    }

    addDraggableItem(pitch, className) {
        SoundManager.play('click');
        const item = document.createElement('div');
        item.className = `draggable-item ${className}`;
        item.style.top = '50%';
        item.style.left = '50%';

        if (className === 'tool-arrow') {
            item.innerHTML = `<div class="arrow-container"><div class="arrow-shaft"></div><div class="arrow-head"></div></div>`;
        }

        this.attachDragBehavior(item, pitch);
        pitch.appendChild(item);
    }

    attachDragBehavior(element, container) {
        let isDragging = false;
        let startX, startY;
        let origLeft, origTop;

        const onPointerDown = (e) => {
            e.stopPropagation();
            this.selectElement(element);

            isDragging = true;
            const pointer = e.touches ? e.touches[0] : e;
            startX = pointer.clientX;
            startY = pointer.clientY;

            origLeft = element.offsetLeft;
            origTop = element.offsetTop;

            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
            document.addEventListener('touchmove', onPointerMove, { passive: false });
            document.addEventListener('touchend', onPointerUp);
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            if (e.cancelable) e.preventDefault();

            const pointer = e.touches ? e.touches[0] : e;
            const deltaX = pointer.clientX - startX;
            const deltaY = pointer.clientY - startY;

            let newLeft = origLeft + deltaX;
            let newTop = origTop + deltaY;

            const maxLeft = container.clientWidth - element.clientWidth;
            const maxTop = container.clientHeight - element.clientHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;
        };

        const onPointerUp = () => {
            isDragging = false;
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            document.removeEventListener('touchmove', onPointerMove);
            document.removeEventListener('touchend', onPointerUp);
        };

        element.addEventListener('pointerdown', onPointerDown);
        element.addEventListener('touchstart', onPointerDown, { passive: false });
    }

    selectElement(element) {
        this.deselectAll();
        this.selectedElement = element;
        element.classList.add('is-selected');
        document.getElementById('tactic-delete-btn')?.classList.add('enabled');
    }

    deselectAll() {
        document.querySelectorAll('.draggable-item').forEach(el => el.classList.remove('is-selected'));
        this.selectedElement = null;
        document.getElementById('tactic-delete-btn')?.classList.remove('enabled');
    }
}
