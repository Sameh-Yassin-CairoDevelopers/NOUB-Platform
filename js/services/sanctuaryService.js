/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/services/sanctuaryService.js
 * Version: 3.0.0 (BIO-SANCTUARY 89x ACCELERATED GENETICS SERVICE)
 * Description: Real-time biological specimen management, Mendelian breeding events,
 *              WSAVA vaccination protocols, Bonsai care, and pedigree registry.
 */

import { supabase } from '../core/supabaseClient.js';
import { state } from '../core/state.js';
import { SANCTUARY_SPECIES, SANCTUARY_BREEDS } from '../data/sanctuaryData.js';
import { TimeEngine } from '../utils/timeEngine.js';
import { GeneticsEngine } from '../utils/geneticsEngine.js';

export class SanctuaryService {
    /**
     * Initializes default pedigree specimens if the player's sanctuary is fresh.
     */
    static initDefaultSpecimens() {
        if (state.data.sanctuary.specimens && state.data.sanctuary.specimens.length > 0) {
            return state.data.sanctuary.specimens;
        }

        const defaults = [
            {
                id: 'spec_gsd_1',
                name: 'رعد (DDR Champion)',
                species_id: 'CANINE',
                breed_id: 'gsd_working',
                gender: 'MALE',
                generation: 1,
                birth_date: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString(),
                health_score: 98,
                stamina: 92,
                beauty: 88,
                rarity: 'LEGENDARY',
                loci: SANCTUARY_BREEDS.gsd_working.loci,
                vaccinations: [
                    { name: 'DHPP Core Vaccine', status: 'COMPLETED', date: '2026-01-10' },
                    { name: 'Rabies (السعار)', status: 'COMPLETED', date: '2026-02-15' }
                ]
            },
            {
                id: 'spec_gsd_2',
                name: 'عاصفة (DDR Pure Dam)',
                species_id: 'CANINE',
                breed_id: 'gsd_working',
                gender: 'FEMALE',
                generation: 1,
                birth_date: new Date(Date.now() - 300 * 24 * 3600 * 1000).toISOString(),
                health_score: 95,
                stamina: 89,
                beauty: 94,
                rarity: 'EPIC',
                loci: SANCTUARY_BREEDS.gsd_working.loci,
                vaccinations: [
                    { name: 'DHPP Core Vaccine', status: 'COMPLETED', date: '2026-01-20' },
                    { name: 'Rabies (السعار)', status: 'COMPLETED', date: '2026-03-01' }
                ]
            },
            {
                id: 'spec_saluki_1',
                name: 'شهاب الصقلاوي',
                species_id: 'CANINE',
                breed_id: 'saluki_smooth',
                gender: 'MALE',
                generation: 1,
                birth_date: new Date(Date.now() - 400 * 24 * 3600 * 1000).toISOString(),
                health_score: 99,
                stamina: 98,
                beauty: 96,
                rarity: 'MYTHIC',
                loci: SANCTUARY_BREEDS.saluki_smooth.loci,
                vaccinations: [
                    { name: 'Core Sighthound Vaccine', status: 'COMPLETED', date: '2026-02-01' }
                ]
            },
            {
                id: 'spec_horse_1',
                name: 'تاج المعادي (صقلاوي جدران)',
                species_id: 'EQUINE',
                breed_id: 'arabian_saklawi',
                gender: 'FEMALE',
                generation: 1,
                birth_date: new Date(Date.now() - 700 * 24 * 3600 * 1000).toISOString(),
                health_score: 100,
                stamina: 96,
                beauty: 99,
                rarity: 'ROYAL_HERITAGE',
                loci: SANCTUARY_BREEDS.arabian_saklawi.loci,
                vaccinations: [
                    { name: 'Equine Influenza & Tetanus', status: 'COMPLETED', date: '2026-01-05' }
                ]
            },
            {
                id: 'spec_bonsai_1',
                name: 'صنوبر الشاهين (عمر 45 عاماً)',
                species_id: 'FLORA_BONSAI',
                breed_id: 'bonsai_kuromatsu',
                gender: 'NEUTRAL',
                generation: 1,
                soil_moisture: 78,
                pruning_health: 94,
                rarity: 'HERITAGE',
                loci: SANCTUARY_BREEDS.bonsai_kuromatsu.loci,
                vaccinations: []
            }
        ];

        state.setSpecimens(defaults);
        return defaults;
    }

    /**
     * Initiates a Mendelian cross-breeding event calculated with the 89x speed clock.
     */
    static startBreeding(sireId, damId) {
        const specimens = state.data.sanctuary.specimens;
        const sire = specimens.find(s => s.id === sireId);
        const dam = specimens.find(s => s.id === damId);

        if (!sire || !dam) return { success: false, message: 'الأب أو الأم غير محددين' };
        if (sire.species_id !== dam.species_id) return { success: false, message: 'يجب أن يكون الأبوان من نفس الفصيلة البيولوجية' };
        if (sire.gender !== 'MALE' || dam.gender !== 'FEMALE') return { success: false, message: 'يجب اختيار ذكر وأنثى مكتملين بيولوجياً' };

        const species = SANCTUARY_SPECIES[sire.species_id];
        const gestationRealMs = TimeEngine.bioDaysToRealMs(species.gestation_days_bio);

        const startTime = Date.now();
        const completionTime = new Date(startTime + gestationRealMs).toISOString();

        // Compute offspring genotype in advance using Mendelian engine
        const offspringLoci = GeneticsEngine.recombine(sire.loci, dam.loci);
        const coi = GeneticsEngine.calculateCOI(sire.generation, dam.generation);

        const breedingEvent = {
            id: 'gest_' + Date.now(),
            sire_id: sire.id,
            sire_name: sire.name,
            dam_id: dam.id,
            dam_name: dam.name,
            species_id: sire.species_id,
            breed_id: sire.breed_id,
            generation: Math.max(sire.generation, dam.generation) + 1,
            coi_percent: coi,
            offspring_loci: offspringLoci,
            start_time: new Date(startTime).toISOString(),
            completion_time: completionTime,
            status: 'IN_GESTATION'
        };

        state.addGestation(breedingEvent);
        state.addXP(150);

        state.addNotification({
            title: '🧬 بدء دورة التزاوج والجينات (89x)',
            message: `بدأت فترة حمل بين [${sire.name}] و [${dam.name}] بمعامل قرابة COI ${coi}%.`,
            type: 'success'
        });

        return { success: true, breedingEvent, gestationRealMs };
    }

    /**
     * Hatches/delivers offspring when gestation time is reached.
     */
    static deliverOffspring(breedingEventId) {
        const event = state.data.sanctuary.activeGestation.find(e => e.id === breedingEventId);
        if (!event) return { success: false, message: 'حدث التزاوج غير موجود' };

        const check = TimeEngine.getRemainingTime(event.completion_time);
        if (!check.isComplete) {
            return { success: false, message: `فترة الحمل لم تكتمل بعد (متبقي: ${check.formatted})` };
        }

        const breed = SANCTUARY_BREEDS[event.breed_id] || SANCTUARY_BREEDS.gsd_working;
        const newSpecimen = {
            id: 'spec_pup_' + Date.now(),
            name: `سليل نوب (${event.sire_name} × ${event.dam_name})`,
            species_id: event.species_id,
            breed_id: event.breed_id,
            gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
            generation: event.generation,
            birth_date: new Date().toISOString(),
            health_score: 100,
            stamina: Math.floor(90 + Math.random() * 10),
            beauty: Math.floor(90 + Math.random() * 10),
            rarity: event.generation > 2 ? 'MYTHIC' : 'EPIC',
            loci: event.offspring_loci,
            vaccinations: [
                { name: 'فحص الولادة وتثبيت الجينات', status: 'COMPLETED', date: new Date().toISOString().split('T')[0] }
            ]
        };

        state.addSpecimen(newSpecimen);
        state.removeGestation(breedingEventId);
        state.addXP(400);

        state.addNotification({
            title: '🎉 ولادة سليل جديد بمواصفات ملكية!',
            message: `تم استقبال [${newSpecimen.name}] في المحمية بنجاح وتسجيل شجرة نسبه.`,
            type: 'gold'
        });

        return { success: true, specimen: newSpecimen };
    }

    /**
     * Tends to a Bonsai tree (Watering or Pruning).
     */
    static careBonsai(specimenId, actionType = 'WATER') {
        const specimen = state.data.sanctuary.specimens.find(s => s.id === specimenId);
        if (!specimen) return { success: false, message: 'الشجرة غير موجودة' };

        if (actionType === 'WATER') {
            specimen.soil_moisture = Math.min(100, (specimen.soil_moisture || 50) + 25);
            state.addXP(30);
            state.notify();
            return { success: true, message: 'تم ري الشجرة بتربة الأكاداما اليابانية', specimen };
        } else if (actionType === 'PRUNE') {
            specimen.pruning_health = Math.min(100, (specimen.pruning_health || 60) + 15);
            state.addXP(50);
            state.notify();
            return { success: true, message: 'تم تقليم الفروع وتنسيق الشكل التراثي (Jin/Shari)', specimen };
        }
    }
}
