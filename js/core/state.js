/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/core/state.js
 * Version: 3.0.0 (UNIFIED MASTER STATE MANAGER)
 * Description: Centralized reactive state container synchronizing data across
 *              NOUB Sports, NOUB Industry, and NOUB Bio-Sanctuary.
 */

class MasterStateManager {
    constructor() {
        this.listeners = new Set();
        
        // Initial Default Unified State
        this.data = {
            activeRealm: 'hub', // 'hub' | 'sports' | 'industry' | 'sanctuary' | 'profile'
            user: null,
            
            // ⚽ 1. SPORTS STATE
            sports: {
                card: null,
                myTeam: null,
                matches: [],
                emergencies: [],
                tournaments: [],
                scoutMarket: []
            },

            // 🏺 2. INDUSTRY & CRAFTING STATE
            industry: {
                workshops: [
                    { id: 'ws_stone', level: 1, last_collected: Date.now() },
                    { id: 'ws_pottery', level: 1, last_collected: Date.now() },
                    { id: 'ws_papyrus', level: 1, last_collected: Date.now() },
                    { id: 'ws_foundry', level: 1, last_collected: Date.now() }
                ],
                resources: {
                    LIMESTONE: 120,
                    CLAY: 85,
                    PAPYRUS: 60,
                    BRONZE: 30,
                    GOLD_LEAF: 5,
                    LAPIS_LAZULI: 2
                },
                unlockedTombs: [1, 2], // KV1 and KV2 unlocked by default
                soulCard: null,
                activeSwapOffers: [],
                completedAlbums: []
            },

            // 🌿 3. BIO-SANCTUARY 89x STATE
            sanctuary: {
                specimens: [],
                activeGestation: [],
                activeBonsai: []
            },

            // 🔔 4. NOTIFICATIONS & SYSTEM
            notifications: [],
            unreadCount: 0,
            isOnline: navigator.onLine
        };

        this.loadLocalPersistedState();
    }

    /**
     * Subscribe to state mutation events.
     * @param {Function} callback 
     * @returns {Function} unsubscribe
     */
    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notify() {
        this.persistLocalState();
        this.listeners.forEach(cb => {
            try {
                cb(this.data);
            } catch (err) {
                console.error("State listener notification error:", err);
            }
        });
    }

    // --- USER PROFILE & TREASURY MUTATORS ---
    setUser(user) {
        this.data.user = user;
        this.notify();
    }

    updateGold(delta) {
        if (!this.data.user) return;
        this.data.user.gold_balance = Math.max(0, (this.data.user.gold_balance || 0) + delta);
        this.notify();
    }

    addXP(amount) {
        if (!this.data.user) return;
        const currentXP = (this.data.user.xp || 0) + amount;
        const currentLevel = Math.floor(currentXP / 1000) + 1;
        this.data.user.xp = currentXP;
        this.data.user.level = currentLevel;
        this.notify();
    }

    // --- REALM SWITCHER ---
    setRealm(realmName) {
        this.data.activeRealm = realmName;
        this.notify();
    }

    // --- SPORTS MUTATORS ---
    setSportsCard(card) {
        this.data.sports.card = card;
        this.notify();
    }

    setSportsMatches(matches) {
        this.data.sports.matches = matches;
        this.notify();
    }

    setEmergencies(emergencies) {
        this.data.sports.emergencies = emergencies;
        this.notify();
    }

    // --- INDUSTRY MUTATORS ---
    addResource(resourceId, amount) {
        if (!this.data.industry.resources[resourceId]) {
            this.data.industry.resources[resourceId] = 0;
        }
        this.data.industry.resources[resourceId] += amount;
        this.notify();
    }

    spendResource(resourceId, amount) {
        if ((this.data.industry.resources[resourceId] || 0) < amount) {
            return false;
        }
        this.data.industry.resources[resourceId] -= amount;
        this.notify();
        return true;
    }

    unlockTomb(kvNumber) {
        if (!this.data.industry.unlockedTombs.includes(kvNumber)) {
            this.data.industry.unlockedTombs.push(kvNumber);
            this.notify();
        }
    }

    setSoulCard(cardData) {
        this.data.industry.soulCard = cardData;
        this.notify();
    }

    // --- SANCTUARY MUTATORS ---
    addSpecimen(specimen) {
        this.data.sanctuary.specimens.push(specimen);
        this.notify();
    }

    setSpecimens(specimens) {
        this.data.sanctuary.specimens = specimens;
        this.notify();
    }

    addGestation(event) {
        this.data.sanctuary.activeGestation.push(event);
        this.notify();
    }

    removeGestation(eventId) {
        this.data.sanctuary.activeGestation = this.data.sanctuary.activeGestation.filter(e => e.id !== eventId);
        this.notify();
    }

    // --- NOTIFICATIONS MUTATORS ---
    addNotification(item) {
        const notif = {
            id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            title: item.title || 'إشعار جديد',
            message: item.message || '',
            type: item.type || 'info', // 'info' | 'success' | 'alert' | 'gold'
            timestamp: new Date().toISOString(),
            read: false,
            actionUrl: item.actionUrl || null
        };
        this.data.notifications.unshift(notif);
        this.data.unreadCount = this.data.notifications.filter(n => !n.read).length;
        this.notify();
    }

    markAllNotificationsRead() {
        this.data.notifications.forEach(n => n.read = true);
        this.data.unreadCount = 0;
        this.notify();
    }

    // --- LOCAL STORAGE PERSISTENCE ---
    persistLocalState() {
        try {
            const serializable = {
                user: this.data.user,
                industry: {
                    resources: this.data.industry.resources,
                    unlockedTombs: this.data.industry.unlockedTombs,
                    soulCard: this.data.industry.soulCard,
                    workshops: this.data.industry.workshops
                },
                sanctuary: {
                    specimens: this.data.sanctuary.specimens,
                    activeGestation: this.data.sanctuary.activeGestation
                },
                sports: {
                    card: this.data.sports.card
                }
            };
            localStorage.setItem('NOUB_MASTER_STATE', JSON.stringify(serializable));
        } catch (e) {
            console.warn("Could not persist state locally:", e);
        }
    }

    loadLocalPersistedState() {
        try {
            const raw = localStorage.getItem('NOUB_MASTER_STATE');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.user) this.data.user = parsed.user;
                if (parsed.industry) {
                    this.data.industry.resources = { ...this.data.industry.resources, ...(parsed.industry.resources || {}) };
                    this.data.industry.unlockedTombs = parsed.industry.unlockedTombs || this.data.industry.unlockedTombs;
                    this.data.industry.soulCard = parsed.industry.soulCard || null;
                }
                if (parsed.sanctuary) {
                    this.data.sanctuary.specimens = parsed.sanctuary.specimens || [];
                    this.data.sanctuary.activeGestation = parsed.sanctuary.activeGestation || [];
                }
                if (parsed.sports && parsed.sports.card) {
                    this.data.sports.card = parsed.sports.card;
                }
            }
        } catch (e) {
            console.warn("Error loading persisted state:", e);
        }
    }
}

export const state = new MasterStateManager();
