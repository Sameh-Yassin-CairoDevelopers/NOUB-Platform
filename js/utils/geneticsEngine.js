/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/utils/geneticsEngine.js
 * Version: 3.0.0 (MENDELIAN & POLYGENIC GENETIC RECOMBINATION ENGINE)
 * Description: Academic Punnett square genetics recombination simulator for
 *              biological breeding events (alleles inheritance, mutation rates, hybrid vigor).
 */

export class GeneticsEngine {
    /**
     * Recombines two parental diploid genotypes using Mendelian segregation laws.
     * 
     * @param {Array} sireLoci - Sire loci array [{ locus, allele }, ...]
     * @param {Array} damLoci - Dam loci array [{ locus, allele }, ...]
     * @param {number} mutationRate - Mutation probability (default 0.03 = 3%)
     * @returns {Array} Offspring recombined diploid loci
     */
    static recombine(sireLoci = [], damLoci = [], mutationRate = 0.03) {
        const offspringLoci = [];
        const lociMap = new Map();

        // Index sire alleles
        sireLoci.forEach(item => {
            const parts = (item.allele || 'A/a').split('/');
            lociMap.set(item.locus, {
                sireAlleles: parts,
                name: item.name || item.locus,
                note: item.note || ''
            });
        });

        // Combine with dam alleles
        damLoci.forEach(item => {
            const parts = (item.allele || 'A/a').split('/');
            if (lociMap.has(item.locus)) {
                lociMap.get(item.locus).damAlleles = parts;
            } else {
                lociMap.set(item.locus, {
                    sireAlleles: ['A', 'a'],
                    damAlleles: parts,
                    name: item.name || item.locus,
                    note: item.note || ''
                });
            }
        });

        // Perform segregation
        lociMap.forEach((data, locusKey) => {
            const sireChoices = data.sireAlleles || ['A', 'a'];
            const damChoices = data.damAlleles || ['A', 'a'];

            // Pick 1 gamete from sire and 1 gamete from dam
            const inheritedSire = sireChoices[Math.floor(Math.random() * sireChoices.length)];
            const inheritedDam = damChoices[Math.floor(Math.random() * damChoices.length)];

            // Check for beneficial rare mutation
            let finalSire = inheritedSire;
            let finalDam = inheritedDam;
            let hasMutation = false;

            if (Math.random() < mutationRate) {
                hasMutation = true;
                finalDam = `${inheritedDam}*`; // Rare mutated allele marker
            }

            offspringLoci.push({
                locus: locusKey,
                name: data.name,
                allele: `${finalSire}/${finalDam}`,
                note: hasMutation ? '⚡ طفرة جينية نادرة الحدوث!' : 'مورثة مندلية نقية'
            });
        });

        return offspringLoci;
    }

    /**
     * Calculates the Inbreeding Coefficient (COI %) based on parental heritage.
     */
    static calculateCOI(sireGeneration = 1, damGeneration = 1) {
        const genDiff = Math.abs(sireGeneration - damGeneration);
        if (genDiff === 0 && sireGeneration > 1) {
            return (6.25 / sireGeneration).toFixed(2);
        }
        return (3.125 / Math.max(1, sireGeneration + damGeneration)).toFixed(2);
    }
}
