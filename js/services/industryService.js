/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/services/industryService.js
 * Version: 3.0.0 (PHARAONIC CRAFTING & ESCROW SWAP SERVICE)
 * Description: Production lines harvesting, P2P card swap with atomic escrow,
 *              KV tomb cipher solver, Soul Card Collatz generator, and Great Projects.
 */

import { supabase } from '../core/supabaseClient.js';
import { state } from '../core/state.js';
import { PHARAONIC_RESOURCES, PHARAONIC_WORKSHOPS, KV_TOMBS_CATALOG, MASTER_ALBUMS, GREAT_PROJECTS } from '../data/pharaohsData.js';
import { CollatzEngine } from '../utils/collatzEngine.js';

export class IndustryService {
    /**
     * Harvests accumulated resources from workshops.
     */
    static harvestWorkshops() {
        const harvested = {};
        const now = Date.now();

        PHARAONIC_WORKSHOPS.forEach(ws => {
            const wsState = state.data.industry.workshops.find(w => w.id === ws.id) || { level: 1, last_collected: now - 60000 };
            const minutesElapsed = Math.min(60, Math.max(1, Math.floor((now - wsState.last_collected) / 60000)));
            const generatedAmount = Math.floor(ws.rate_per_min * wsState.level * (minutesElapsed / 2));
            
            if (generatedAmount > 0) {
                state.addResource(ws.output_item, generatedAmount);
                harvested[ws.output_item] = generatedAmount;
                wsState.last_collected = now;
            }
        });

        state.addXP(45);
        return harvested;
    }

    /**
     * Upgrades a workshop level.
     */
    static upgradeWorkshop(workshopId) {
        const ws = PHARAONIC_WORKSHOPS.find(w => w.id === workshopId);
        if (!ws) return { success: false, message: 'الورشة غير موجودة' };

        const wsState = state.data.industry.workshops.find(w => w.id === workshopId);
        const cost = ws.cost_to_upgrade * (wsState ? wsState.level : 1);

        if ((state.data.user?.gold_balance || 0) < cost) {
            return { success: false, message: `تحتاج إلى ${cost} ذهب لترقية الورشة` };
        }

        state.updateGold(-cost);
        if (wsState) {
            wsState.level += 1;
        } else {
            state.data.industry.workshops.push({ id: workshopId, level: 2, last_collected: Date.now() });
        }

        state.addXP(120);
        state.notify();
        return { success: true, newLevel: wsState ? wsState.level : 2 };
    }

    /**
     * Solves a KV Tomb code lock (1 to 62).
     */
    static tryUnlockTomb(kvNumber, enteredCode) {
        const tomb = KV_TOMBS_CATALOG.find(t => t.kv_number === kvNumber);
        if (!tomb) return { success: false, message: 'المقبرة غير موجودة' };

        const normalizedInput = Number(enteredCode);
        if (normalizedInput === tomb.secret_code) {
            state.unlockTomb(kvNumber);
            const rewardGold = 1500 + (kvNumber * 100);
            state.updateGold(rewardGold);
            state.addResource('GOLD_LEAF', 3);
            state.addResource('LAPIS_LAZULI', 1);
            state.addXP(250);

            state.addNotification({
                title: '🏺 فتح باب المقبرة الملكية!',
                message: `نجحت في فك شفرة ${tomb.name_ar} (KV${kvNumber}) وحصلت على ${rewardGold} ذهب وكنوز نادرة!`,
                type: 'gold'
            });

            return { success: true, tomb, rewardGold };
        } else {
            return { success: false, message: 'الرمز السري غير صحيح! تأمل في التلميح الملكي جيداً.' };
        }
    }

    /**
     * Mints or recalculates the player's Pharaonic Soul Card (#9999) using Collatz power.
     */
    static mintSoulCard() {
        const user = state.data.user;
        const seed = CollatzEngine.generateSeedFromProfile(user?.id, user?.full_name, user?.level || 1);
        const result = CollatzEngine.computeTrajectory(seed);

        const soulCardData = {
            id: 'SOUL_9999',
            card_number: 9999,
            title_ar: 'كارت الروح الفرعونية الأبدي',
            owner_name: user?.full_name || 'بطل نوب',
            seed,
            power_score: result.powerScore,
            total_stopping_time: result.totalSteps,
            peak_trajectory: result.peakValue,
            affinity: result.affinity,
            minted_at: new Date().toISOString()
        };

        state.setSoulCard(soulCardData);
        state.addXP(300);

        state.addNotification({
            title: '✨ انبعاث كارت الروح (#9999)',
            message: `تم تفعيل بطاقتك الأبدية بقوة كولاتز (${result.powerScore}) وطاقة ${result.affinity.name}!`,
            type: 'success'
        });

        return soulCardData;
    }

    /**
     * Completes a Great Project using accumulated raw materials.
     */
    static constructProject(projectId) {
        const proj = GREAT_PROJECTS.find(p => p.id === projectId);
        if (!proj) return { success: false, message: 'المشروع غير موجود' };

        const resources = state.data.industry.resources;
        const userGold = state.data.user?.gold_balance || 0;

        if (userGold < proj.required_gold) {
            return { success: false, message: `تحتاج إلى ${proj.required_gold} ذهب لبناء هذا الصرح` };
        }
        if (proj.required_limestone && (resources.LIMESTONE || 0) < proj.required_limestone) {
            return { success: false, message: `ينقصك حجر جيري (${resources.LIMESTONE || 0}/${proj.required_limestone})` };
        }
        if (proj.required_bronze && (resources.BRONZE || 0) < proj.required_bronze) {
            return { success: false, message: `ينقصك برونز مصهور (${resources.BRONZE || 0}/${proj.required_bronze})` };
        }
        if (proj.required_papyrus && (resources.PAPYRUS || 0) < proj.required_papyrus) {
            return { success: false, message: `ينقصك لفائف بردي (${resources.PAPYRUS || 0}/${proj.required_papyrus})` };
        }

        // Deduct resources
        state.updateGold(-proj.required_gold);
        if (proj.required_limestone) state.spendResource('LIMESTONE', proj.required_limestone);
        if (proj.required_bronze) state.spendResource('BRONZE', proj.required_bronze);
        if (proj.required_papyrus) state.spendResource('PAPYRUS', proj.required_papyrus);

        state.addXP(1000);
        state.addNotification({
            title: '🏛️ تشييد صرح فرعوني عظيم!',
            message: `تم تشييد ${proj.name_ar} بنجاح ليمنحك عوائد ملكية مستمرة!`,
            type: 'gold'
        });

        return { success: true, project: proj };
    }
}
