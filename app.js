/**
 * THE VITAL FUEL: HUMAN NUTRITION & NUTRIENT HEALTH EXPLORER
 * Client-Side Biochemical Reference & Interactive Telemetry Engine
 * Standards: US NIH Office of Dietary Supplements (ODS) & EFSA Dietary Reference Values (DRV)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    // ========================================================================
    // 1. WEB AUDIO PROCEDURAL SYNTHESIZER
    // ========================================================================
    class SoundEngine {
      constructor() {
        this.ctx = null;
        this.isMuted = false;
      }

      init() {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      }

      playTone(freq = 440, type = 'sine', duration = 0.2, gainVal = 0.1) {
        if (this.isMuted) return;
        try {
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = type;
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(gainVal, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + duration);
        } catch (e) {}
      }

      playPop() {
        this.playTone(660, 'sine', 0.12, 0.08);
      }

      playSuccess() {
        if (this.isMuted) return;
        try {
          this.init();
          [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'triangle', 0.2, 0.08), i * 80);
          });
        } catch (e) {}
      }

      playWrong() {
        this.playTone(220, 'sawtooth', 0.25, 0.09);
      }

      playChime() {
        this.playTone(587.33, 'sine', 0.35, 0.1);
      }
    }

    const audio = new SoundEngine();

    // ========================================================================
    // 2. MASTER FOODS DATABASE (60 WHOLE FOOD RESOURCES WITH REAL IMAGES)
    // ========================================================================
    const FOODS_DATASET = [
      {
        id: 'salmon',
        name: 'Wild Atlantic Salmon',
        category: 'fish-seafood',
        categoryName: 'Seafood & Fish',
        icon: '🐟',
        serving: '100g (cooked fillet)',
        calories: 182,
        protein: 25.4,
        carbs: 0,
        fiber: 0,
        fat: 8.1,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Salmo_salar.jpg/330px-Salmo_salar.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'omega-3', name: 'Omega-3 (EPA/DHA)', amount: '2,260 mg', pctDV: 141, highlight: true },
          { id: 'vitamin-b12', name: 'Vitamin B12', amount: '3.2 mcg', pctDV: 133, highlight: true },
          { id: 'vitamin-d', name: 'Vitamin D3', amount: '526 IU (13.1 mcg)', pctDV: 66, highlight: true },
          { id: 'protein', name: 'Complete Protein', amount: '25.4 g', pctDV: 51, highlight: false },
          { id: 'selenium', name: 'Selenium', amount: '38 mcg', pctDV: 69, highlight: false },
          { id: 'potassium', name: 'Potassium', amount: '490 mg', pctDV: 10, highlight: false }
        ],
        prepTip: 'Bake or gently poach at low temperatures (<180°C) to prevent delicate Omega-3 fatty acids from oxidizing.'
      },
      {
        id: 'spinach',
        name: 'Baby Spinach',
        category: 'greens-vegetables',
        categoryName: 'Greens & Vegetables',
        icon: '🥬',
        serving: '100g (raw, ~3 cups)',
        calories: 23,
        protein: 2.9,
        carbs: 3.6,
        fiber: 2.2,
        fat: 0.4,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Spinacia_oleracea_Spinazie_bloeiend.jpg/330px-Spinacia_oleracea_Spinazie_bloeiend.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'vitamin-k', name: 'Vitamin K1', amount: '483 mcg', pctDV: 402, highlight: true },
          { id: 'vitamin-a', name: 'Vitamin A (Beta-Carotene)', amount: '469 mcg RAE', pctDV: 52, highlight: true },
          { id: 'folate', name: 'Folate (B9)', amount: '194 mcg', pctDV: 49, highlight: true },
          { id: 'iron', name: 'Non-Heme Iron', amount: '2.7 mg', pctDV: 15, highlight: true },
          { id: 'magnesium', name: 'Magnesium', amount: '79 mg', pctDV: 19, highlight: false },
          { id: 'vitamin-c', name: 'Vitamin C', amount: '28 mg', pctDV: 31, highlight: false }
        ],
        prepTip: 'Pair with lemon juice or bell peppers! Vitamin C dramatically enhances non-heme iron absorption.'
      },
      {
        id: 'chia-seeds',
        name: 'Chia Seeds',
        category: 'nuts-seeds',
        categoryName: 'Nuts & Seeds',
        icon: '🌱',
        serving: '28g (2 tablespoons)',
        calories: 138,
        protein: 4.7,
        carbs: 12.0,
        fiber: 9.8,
        fat: 8.7,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Seed_of_chia_%28Salvia_hispanica%29Salvia_hispanica_group.jpg/330px-Seed_of_chia_%28Salvia_hispanica%29Salvia_hispanica_group.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'fiber', name: 'Prebiotic Fiber', amount: '9.8 g', pctDV: 35, highlight: true },
          { id: 'omega-3', name: 'Omega-3 (ALA)', amount: '5,060 mg', pctDV: 316, highlight: true },
          { id: 'calcium', name: 'Calcium', amount: '179 mg', pctDV: 14, highlight: true },
          { id: 'magnesium', name: 'Magnesium', amount: '95 mg', pctDV: 23, highlight: false },
          { id: 'phosphorus', name: 'Phosphorus', amount: '244 mg', pctDV: 20, highlight: false }
        ],
        prepTip: 'Soak in almond or oat milk for 20 minutes to form a mucilage gel that hydrates the bowel and slows glucose spikes.'
      },
      {
        id: 'almonds',
        name: 'Raw Almonds',
        category: 'nuts-seeds',
        categoryName: 'Nuts & Seeds',
        icon: '🥜',
        serving: '28g (approx. 23 kernels)',
        calories: 164,
        protein: 6.0,
        carbs: 6.1,
        fiber: 3.5,
        fat: 14.1,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Almonds_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_blanched.jpg/330px-Almonds_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_blanched.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'vitamin-e', name: 'Vitamin E (Alpha-Tocopherol)', amount: '7.3 mg', pctDV: 49, highlight: true },
          { id: 'magnesium', name: 'Magnesium', amount: '76 mg', pctDV: 18, highlight: true },
          { id: 'calcium', name: 'Calcium', amount: '76 mg', pctDV: 6, highlight: false },
          { id: 'riboflavin', name: 'Riboflavin (B2)', amount: '0.3 mg', pctDV: 23, highlight: false }
        ],
        prepTip: 'Eat with skins intact; almond skins host antioxidant flavonoids that work synergistically with Vitamin E.'
      },
      {
        id: 'lentils',
        name: 'Cooked Brown Lentils',
        category: 'legumes-pulses',
        categoryName: 'Legumes & Pulses',
        icon: '🫘',
        serving: '100g (cooked, 1/2 cup)',
        calories: 116,
        protein: 9.0,
        carbs: 20.1,
        fiber: 7.9,
        fat: 0.4,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/3_types_of_lentil.png/330px-3_types_of_lentil.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free'],
        nutrients: [
          { id: 'folate', name: 'Folate (B9)', amount: '181 mcg', pctDV: 45, highlight: true },
          { id: 'iron', name: 'Iron', amount: '3.3 mg', pctDV: 18, highlight: true },
          { id: 'fiber', name: 'Dietary Fiber', amount: '7.9 g', pctDV: 28, highlight: true },
          { id: 'potassium', name: 'Potassium', amount: '369 mg', pctDV: 8, highlight: false },
          { id: 'zinc', name: 'Zinc', amount: '1.3 mg', pctDV: 12, highlight: false }
        ],
        prepTip: 'Soak lentils before simmering to deactivate phytic acid and optimize mineral absorption.'
      },
      {
        id: 'egg',
        name: 'Pasture-Raised Whole Egg',
        category: 'dairy-eggs',
        categoryName: 'Dairy & Eggs',
        icon: '🥚',
        serving: '1 large egg (50g)',
        calories: 72,
        protein: 6.3,
        carbs: 0.4,
        fiber: 0,
        fat: 4.8,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Huevo_frito.jpg/330px-Huevo_frito.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'choline', name: 'Choline', amount: '147 mg', pctDV: 27, highlight: true },
          { id: 'vitamin-b12', name: 'Vitamin B12', amount: '0.9 mcg', pctDV: 38, highlight: true },
          { id: 'vitamin-a', name: 'Vitamin A', amount: '80 mcg RAE', pctDV: 9, highlight: false },
          { id: 'selenium', name: 'Selenium', amount: '15 mcg', pctDV: 27, highlight: false }
        ],
        prepTip: 'Do not discard the yolk! Over 90% of the calcium, iron, folate, choline, and lutein reside inside the yolk.'
      },
      {
        id: 'avocado',
        name: 'Hass Avocado',
        category: 'fruits-berries',
        categoryName: 'Fruits & Berries',
        icon: '🥑',
        serving: '100g (approx. 1/2 avocado)',
        calories: 160,
        protein: 2.0,
        carbs: 8.5,
        fiber: 6.7,
        fat: 14.7,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Persea_americana_fruit_2.JPG/330px-Persea_americana_fruit_2.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'potassium', name: 'Potassium', amount: '485 mg', pctDV: 10, highlight: true },
          { id: 'fiber', name: 'Fiber', amount: '6.7 g', pctDV: 24, highlight: true },
          { id: 'vitamin-k', name: 'Vitamin K1', amount: '21 mcg', pctDV: 18, highlight: false },
          { id: 'vitamin-e', name: 'Vitamin E', amount: '2.1 mg', pctDV: 14, highlight: false }
        ],
        prepTip: 'Rich monounsaturated oleic acid acts as a lipid carrier, multiplying carotenoid absorption from salads up to 5x.'
      },
      {
        id: 'beef-liver',
        name: 'Grass-Fed Beef Liver',
        category: 'meats-poultry',
        categoryName: 'Meats & Organ Meats',
        icon: '🥩',
        serving: '100g (cooked)',
        calories: 175,
        protein: 29.1,
        carbs: 5.2,
        fiber: 0,
        fat: 4.7,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Pig%27s_liver_with_sauteed_onion.jpg/330px-Pig%27s_liver_with_sauteed_onion.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'vitamin-a', name: 'Vitamin A (Retinol)', amount: '7,700 mcg RAE', pctDV: 855, highlight: true },
          { id: 'vitamin-b12', name: 'Vitamin B12', amount: '70.6 mcg', pctDV: 2940, highlight: true },
          { id: 'iron', name: 'Heme Iron', amount: '6.5 mg', pctDV: 36, highlight: true },
          { id: 'copper', name: 'Copper', amount: '9.8 mg', pctDV: 1088, highlight: true },
          { id: 'riboflavin', name: 'Riboflavin (B2)', amount: '3.4 mg', pctDV: 262, highlight: false }
        ],
        prepTip: 'Nature’s most concentrated multivitamin. Consume in moderation (1-2x monthly) due to ultra-high Vitamin A and copper.'
      },
      {
        id: 'bell-pepper',
        name: 'Red Bell Pepper',
        category: 'greens-vegetables',
        categoryName: 'Greens & Vegetables',
        icon: '🫑',
        serving: '100g (approx. 1 medium)',
        calories: 31,
        protein: 1.0,
        carbs: 6.0,
        fiber: 2.1,
        fat: 0.3,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Green-Yellow-Red-Pepper-2009.jpg/330px-Green-Yellow-Red-Pepper-2009.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'vitamin-c', name: 'Vitamin C', amount: '128 mg', pctDV: 142, highlight: true },
          { id: 'vitamin-a', name: 'Vitamin A (Beta-Carotene)', amount: '157 mcg RAE', pctDV: 17, highlight: false },
          { id: 'vitamin-b6', name: 'Vitamin B6', amount: '0.3 mg', pctDV: 18, highlight: false }
        ],
        prepTip: 'Contains more than 2x the Vitamin C of an orange. Eat raw in salads to preserve temperature-sensitive ascorbic acid.'
      },
      {
        id: 'greek-yogurt',
        name: 'Plain Greek Yogurt',
        category: 'dairy-eggs',
        categoryName: 'Dairy & Eggs',
        icon: '🥛',
        serving: '170g (1 container, nonfat)',
        calories: 100,
        protein: 17.3,
        carbs: 6.1,
        fiber: 0,
        fat: 0.7,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Labneh01.jpg/330px-Labneh01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegetarian', 'pescatarian', 'gluten-free'],
        nutrients: [
          { id: 'protein', name: 'Protein', amount: '17.3 g', pctDV: 35, highlight: true },
          { id: 'calcium', name: 'Calcium', amount: '187 mg', pctDV: 14, highlight: true },
          { id: 'vitamin-b12', name: 'Vitamin B12', amount: '1.3 mcg', pctDV: 54, highlight: true },
          { id: 'iodine', name: 'Iodine', amount: '35 mcg', pctDV: 23, highlight: false }
        ],
        prepTip: 'Rich in live probiotic cultures (L. bulgaricus, S. thermophilus) that support gut microbiome synthesis of Vitamin K2.'
      },
      {
        id: 'guava',
        name: 'Fresh Guava',
        category: 'fruits-berries',
        categoryName: 'Fruits & Berries',
        icon: '🍈',
        serving: '100g (1 fruit)',
        calories: 68,
        protein: 2.6,
        carbs: 14.3,
        fiber: 5.4,
        fat: 1.0,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Guava_pink_fruit.jpg/330px-Guava_pink_fruit.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free'],
        nutrients: [
          { id: 'vitamin-c', name: 'Vitamin C', amount: '228 mg', pctDV: 253, highlight: true },
          { id: 'fiber', name: 'Pectin Fiber', amount: '5.4 g', pctDV: 19, highlight: true },
          { id: 'folate', name: 'Folate', amount: '49 mcg', pctDV: 12, highlight: false },
          { id: 'potassium', name: 'Potassium', amount: '417 mg', pctDV: 9, highlight: false }
        ],
        prepTip: 'One of the highest Vitamin C fruits on Earth, delivering 4x the ascorbic acid of citrus fruits along with lycopene.'
      },
      {
        id: 'pumpkin-seeds',
        name: 'Pumpkin Seeds (Pepitas)',
        category: 'nuts-seeds',
        categoryName: 'Nuts & Seeds',
        icon: '🎃',
        serving: '28g (1 oz / ~2 tbsp)',
        calories: 158,
        protein: 8.6,
        carbs: 3.0,
        fiber: 1.7,
        fat: 13.9,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Pepita_de_calabaza.jpg/330px-Pepita_de_calabaza.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'magnesium', name: 'Magnesium', amount: '168 mg', pctDV: 40, highlight: true },
          { id: 'zinc', name: 'Zinc', amount: '2.2 mg', pctDV: 20, highlight: true },
          { id: 'iron', name: 'Iron', amount: '2.5 mg', pctDV: 14, highlight: true },
          { id: 'phosphorus', name: 'Phosphorus', amount: '332 mg', pctDV: 27, highlight: false }
        ],
        prepTip: 'Outstanding source of zinc and magnesium; supports nocturnal testosterone synthesis and sleep via tryptophan.'
      },
      {
        id: 'nutritional-yeast',
        name: 'Fortified Nutritional Yeast',
        category: 'greens-vegetables',
        categoryName: 'Superfoods & Seasoning',
        icon: '✨',
        serving: '16g (2 tablespoons)',
        calories: 60,
        protein: 8.0,
        carbs: 5.0,
        fiber: 4.0,
        fat: 0.5,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Hefeflocken_Naturata.jpg/330px-Hefeflocken_Naturata.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free'],
        nutrients: [
          { id: 'vitamin-b12', name: 'Vitamin B12', amount: '24 mcg', pctDV: 1000, highlight: true },
          { id: 'thiamine', name: 'Thiamine (B1)', amount: '9.6 mg', pctDV: 800, highlight: true },
          { id: 'riboflavin', name: 'Riboflavin (B2)', amount: '9.7 mg', pctDV: 746, highlight: true },
          { id: 'niacin', name: 'Niacin (B3)', amount: '56 mg', pctDV: 350, highlight: false },
          { id: 'vitamin-b6', name: 'Vitamin B6', amount: '9.6 mg', pctDV: 565, highlight: false }
        ],
        prepTip: 'Essential pantry staple for plant-based diets. Provides a cheesy, savory umami flavor with complete B-complex spectrum.'
      },
      {
        id: 'blueberries',
        name: 'Wild Blueberries',
        category: 'fruits-berries',
        categoryName: 'Fruits & Berries',
        icon: '🫐',
        serving: '100g (~2/3 cup)',
        calories: 57,
        protein: 0.7,
        carbs: 14.5,
        fiber: 2.4,
        fat: 0.3,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Blueberries.jpg/330px-Blueberries.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free'],
        nutrients: [
          { id: 'vitamin-k', name: 'Vitamin K1', amount: '19.3 mcg', pctDV: 16, highlight: false },
          { id: 'manganese', name: 'Manganese', amount: '0.3 mg', pctDV: 14, highlight: true },
          { id: 'vitamin-c', name: 'Vitamin C', amount: '9.7 mg', pctDV: 11, highlight: false }
        ],
        prepTip: 'Anthocyanin polyphenols cross the blood-brain barrier to reduce neuro-inflammation and improve memory consolidation.'
      },
      {
        id: 'broccoli',
        name: 'Fresh Steamed Broccoli',
        category: 'greens-vegetables',
        categoryName: 'Greens & Vegetables',
        icon: '🥦',
        serving: '100g (cooked, 1 cup)',
        calories: 35,
        protein: 2.4,
        carbs: 7.2,
        fiber: 3.3,
        fat: 0.4,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Broccoli_and_cross_section_edit.jpg/330px-Broccoli_and_cross_section_edit.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'vitamin-c', name: 'Vitamin C', amount: '65 mg', pctDV: 72, highlight: true },
          { id: 'vitamin-k', name: 'Vitamin K1', amount: '141 mcg', pctDV: 118, highlight: true },
          { id: 'folate', name: 'Folate (B9)', amount: '65 mcg', pctDV: 16, highlight: false },
          { id: 'calcium', name: 'Bioavailable Calcium', amount: '40 mg', pctDV: 3, highlight: false }
        ],
        prepTip: 'Steam lightly for 3-4 minutes to keep myrosinase active, maximizing sulforaphane cellular detox activation.'
      },
      {
        id: 'walnuts',
        name: 'English Walnuts',
        category: 'nuts-seeds',
        categoryName: 'Nuts & Seeds',
        icon: '🧠',
        serving: '28g (approx. 14 halves)',
        calories: 185,
        protein: 4.3,
        carbs: 3.9,
        fiber: 1.9,
        fat: 18.5,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Walnuts_-_whole_and_open_with_halved_kernel.jpg/330px-Walnuts_-_whole_and_open_with_halved_kernel.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'omega-3', name: 'Omega-3 (ALA)', amount: '2,570 mg', pctDV: 160, highlight: true },
          { id: 'copper', name: 'Copper', amount: '0.45 mg', pctDV: 50, highlight: true },
          { id: 'manganese', name: 'Manganese', amount: '1.0 mg', pctDV: 43, highlight: false }
        ],
        prepTip: 'Brain-shaped nut exceptionally rich in plant alpha-linolenic acid (ALA) and polyphenols that protect cognitive function.'
      },
      {
        id: 'oats',
        name: 'Rolled Whole Oats',
        category: 'whole-grains',
        categoryName: 'Whole Grains',
        icon: '🥣',
        serving: '50g (1/2 cup dry)',
        calories: 190,
        protein: 6.8,
        carbs: 34.0,
        fiber: 5.2,
        fat: 3.5,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/AvenaSativa3.jpg/330px-AvenaSativa3.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'dairy-free'],
        nutrients: [
          { id: 'fiber', name: 'Beta-Glucan Soluble Fiber', amount: '5.2 g', pctDV: 19, highlight: true },
          { id: 'manganese', name: 'Manganese', amount: '1.8 mg', pctDV: 78, highlight: true },
          { id: 'phosphorus', name: 'Phosphorus', amount: '226 mg', pctDV: 18, highlight: false },
          { id: 'iron', name: 'Iron', amount: '2.1 mg', pctDV: 12, highlight: false }
        ],
        prepTip: 'Beta-glucan forms a viscous gel in the digestive tract that binds bile acids to lower LDL cholesterol.'
      },
      {
        id: 'sweet-potato',
        name: 'Baked Sweet Potato',
        category: 'greens-vegetables',
        categoryName: 'Tubers & Vegetables',
        icon: '🍠',
        serving: '100g (baked with skin)',
        calories: 90,
        protein: 2.0,
        carbs: 20.7,
        fiber: 3.3,
        fat: 0.1,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Ipomoea_batatas_006.JPG/330px-Ipomoea_batatas_006.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free'],
        nutrients: [
          { id: 'vitamin-a', name: 'Pro-Vitamin A (Beta-Carotene)', amount: '961 mcg RAE', pctDV: 107, highlight: true },
          { id: 'potassium', name: 'Potassium', amount: '475 mg', pctDV: 10, highlight: false },
          { id: 'vitamin-c', name: 'Vitamin C', amount: '19.6 mg', pctDV: 22, highlight: false }
        ],
        prepTip: 'Drizzle with extra virgin olive oil! The presence of fat increases beta-carotene conversion to Vitamin A by up to 600%.'
      },
      {
        id: 'sardines',
        name: 'Pacific Canned Sardines',
        category: 'fish-seafood',
        categoryName: 'Seafood & Fish',
        icon: '🐟',
        serving: '100g (canned in olive oil with bones)',
        calories: 208,
        protein: 24.6,
        carbs: 0,
        fiber: 0,
        fat: 11.5,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Sardines_-_%E9%B0%AF%28%E3%81%84%E3%82%8F%E3%81%97%29.jpg/330px-Sardines_-_%E9%B0%AF%28%E3%81%84%E3%82%8F%E3%81%97%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'calcium', name: 'Calcium (from soft bones)', amount: '382 mg', pctDV: 29, highlight: true },
          { id: 'vitamin-d', name: 'Vitamin D3', amount: '193 IU (4.8 mcg)', pctDV: 24, highlight: true },
          { id: 'vitamin-b12', name: 'Vitamin B12', amount: '8.9 mcg', pctDV: 370, highlight: true },
          { id: 'omega-3', name: 'Omega-3 Fatty Acids', amount: '1,480 mg', pctDV: 92, highlight: true }
        ],
        prepTip: 'One of the cleanest, lowest-mercury fish in the ocean. Soft edible bones deliver exceptional non-dairy calcium.'
      },
      {
        id: 'brazil-nuts',
        name: 'Brazil Nuts',
        category: 'nuts-seeds',
        categoryName: 'Nuts & Seeds',
        icon: '🌰',
        serving: '10g (approx. 2 single nuts)',
        calories: 66,
        protein: 1.4,
        carbs: 1.2,
        fiber: 0.8,
        fat: 6.7,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Bertholletia_excelsa_compose.jpg/330px-Bertholletia_excelsa_compose.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'selenium', name: 'Selenium', amount: '192 mcg', pctDV: 349, highlight: true },
          { id: 'magnesium', name: 'Magnesium', amount: '38 mg', pctDV: 9, highlight: false }
        ],
        prepTip: 'Just 1-2 Brazil nuts per day fulfills 100% of your daily thyroid selenium requirements. Do not eat more than 3-4 daily.'
      },
      {
        id: 'oysters',
        name: 'Pacific Raw Oysters',
        category: 'fish-seafood',
        categoryName: 'Seafood & Fish',
        icon: '🦪',
        serving: '100g (approx. 6 medium)',
        calories: 81,
        protein: 9.5,
        carbs: 4.9,
        fiber: 0,
        fat: 2.3,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Crassostrea_gigas_p1040848.jpg/330px-Crassostrea_gigas_p1040848.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'zinc', name: 'Zinc', amount: '16.6 mg', pctDV: 151, highlight: true },
          { id: 'vitamin-b12', name: 'Vitamin B12', amount: '16.0 mcg', pctDV: 667, highlight: true },
          { id: 'copper', name: 'Copper', amount: '1.6 mg', pctDV: 178, highlight: true },
          { id: 'iron', name: 'Iron', amount: '5.1 mg', pctDV: 28, highlight: false }
        ],
        prepTip: 'The #1 whole food source of zinc in the world, essential for immune phagocytosis, DNA synthesis, and testosterone balance.'
      },
      {
        id: 'seaweed',
        name: 'Dried Kelp / Nori Seaweed',
        category: 'greens-vegetables',
        categoryName: 'Sea Vegetables',
        icon: '🌊',
        serving: '5g (1 sheet / portion)',
        calories: 15,
        protein: 1.5,
        carbs: 2.0,
        fiber: 1.0,
        fat: 0.2,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Fucus_serratus_2015-09-08_ag_M0010140.jpg/330px-Fucus_serratus_2015-09-08_ag_M0010140.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'iodine', name: 'Iodine', amount: '115 mcg', pctDV: 77, highlight: true },
          { id: 'tyrosine', name: 'Tyrosine & Trace Minerals', amount: 'Rich', pctDV: 20, highlight: false }
        ],
        prepTip: 'The definitive whole-food source of iodine needed by thyroid peroxidase to synthesize T3 and T4 hormones.'
      },
      {
        id: 'dark-chocolate',
        name: '85% Extra Dark Chocolate',
        category: 'nuts-seeds',
        categoryName: 'Cacao & Confection',
        icon: '🍫',
        serving: '30g (approx. 3 squares)',
        calories: 170,
        protein: 2.2,
        carbs: 13.0,
        fiber: 3.5,
        fat: 14.0,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Green_and_Black%27s_dark_chocolate_bar_2.jpg/330px-Green_and_Black%27s_dark_chocolate_bar_2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'copper', name: 'Copper', amount: '0.5 mg', pctDV: 56, highlight: true },
          { id: 'magnesium', name: 'Magnesium', amount: '68 mg', pctDV: 16, highlight: true },
          { id: 'iron', name: 'Iron', amount: '3.4 mg', pctDV: 19, highlight: true },
          { id: 'manganese', name: 'Manganese', amount: '0.6 mg', pctDV: 26, highlight: false }
        ],
        prepTip: 'Choose 85%+ cacao for rich flavanols that boost endothelial nitric oxide without blood sugar spikes.'
      },
      {
        id: 'kale',
        name: 'Tuscan Lacinato Kale',
        category: 'greens-vegetables',
        categoryName: 'Greens & Vegetables',
        icon: '🥬',
        serving: '100g (raw, chopped)',
        calories: 49,
        protein: 4.3,
        carbs: 8.8,
        fiber: 3.6,
        fat: 0.9,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Boerenkool.jpg/330px-Boerenkool.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'vitamin-k', name: 'Vitamin K1', amount: '390 mcg', pctDV: 325, highlight: true },
          { id: 'vitamin-c', name: 'Vitamin C', amount: '120 mg', pctDV: 133, highlight: true },
          { id: 'vitamin-a', name: 'Vitamin A', amount: '241 mcg RAE', pctDV: 27, highlight: false },
          { id: 'calcium', name: 'Calcium', amount: '150 mg', pctDV: 12, highlight: false }
        ],
        prepTip: 'Massage raw leaves with a pinch of salt and olive oil to break down cellulose walls and tenderize bitterness.'
      },
      {
        id: 'tofu',
        name: 'Firm Organic Tofu',
        category: 'legumes-pulses',
        categoryName: 'Legumes & Pulses',
        icon: '🧊',
        serving: '100g (firm, drained)',
        calories: 83,
        protein: 10.0,
        carbs: 1.9,
        fiber: 1.2,
        fat: 5.3,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Japanese_SilkyTofu_%28Kinugoshi_Tofu%29.JPG/330px-Japanese_SilkyTofu_%28Kinugoshi_Tofu%29.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'protein', name: 'Complete Plant Protein', amount: '10.0 g', pctDV: 20, highlight: true },
          { id: 'calcium', name: 'Calcium (calcium-set)', amount: '350 mg', pctDV: 27, highlight: true },
          { id: 'iron', name: 'Iron', amount: '2.4 mg', pctDV: 13, highlight: false },
          { id: 'magnesium', name: 'Magnesium', amount: '30 mg', pctDV: 7, highlight: false }
        ],
        prepTip: 'Choose calcium-sulfate precipitated tofu for 3x the calcium concentration of non-calcium coagulated brands.'
      },
      {
        id: 'orange',
        name: 'Navel Orange',
        category: 'fruits-berries',
        categoryName: 'Fruits & Berries',
        icon: '🍊',
        serving: '130g (1 medium fruit)',
        calories: 62,
        protein: 1.2,
        carbs: 15.4,
        fiber: 3.1,
        fat: 0.2,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Oranges_-_whole-halved-segment.jpg/330px-Oranges_-_whole-halved-segment.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free'],
        nutrients: [
          { id: 'vitamin-c', name: 'Vitamin C', amount: '70 mg', pctDV: 78, highlight: true },
          { id: 'folate', name: 'Folate', amount: '40 mcg', pctDV: 10, highlight: false },
          { id: 'potassium', name: 'Potassium', amount: '237 mg', pctDV: 5, highlight: false }
        ],
        prepTip: 'Eat the whole fruit rather than juicing to keep blood-sugar-buffering pectin fiber and citrus bioflavonoids intact.'
      },
      {
        id: 'quinoa',
        name: 'Cooked Tricolor Quinoa',
        category: 'whole-grains',
        categoryName: 'Whole Grains',
        icon: '🌾',
        serving: '100g (cooked, 1/2 cup)',
        calories: 120,
        protein: 4.4,
        carbs: 21.3,
        fiber: 2.8,
        fat: 1.9,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Reismelde.jpg/330px-Reismelde.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free'],
        nutrients: [
          { id: 'protein', name: 'All 9 Essential Amino Acids', amount: '4.4 g', pctDV: 9, highlight: true },
          { id: 'magnesium', name: 'Magnesium', amount: '64 mg', pctDV: 15, highlight: true },
          { id: 'manganese', name: 'Manganese', amount: '0.6 mg', pctDV: 26, highlight: false },
          { id: 'folate', name: 'Folate', amount: '42 mcg', pctDV: 11, highlight: false }
        ],
        prepTip: 'Technically an Andean pseudo-cereal seed; completely gluten-free with a complete protein amino acid score.'
      },
      {
        id: 'kiwi',
        name: 'Golden / Green Kiwi',
        category: 'fruits-berries',
        categoryName: 'Fruits & Berries',
        icon: '🥝',
        serving: '100g (approx. 1 large)',
        calories: 61,
        protein: 1.1,
        carbs: 14.7,
        fiber: 3.0,
        fat: 0.5,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Actinidia_fruits.jpg/330px-Actinidia_fruits.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free'],
        nutrients: [
          { id: 'vitamin-c', name: 'Vitamin C', amount: '93 mg', pctDV: 103, highlight: true },
          { id: 'vitamin-k', name: 'Vitamin K1', amount: '40 mcg', pctDV: 33, highlight: true },
          { id: 'potassium', name: 'Potassium', amount: '312 mg', pctDV: 7, highlight: false }
        ],
        prepTip: 'Contains actinidin enzyme which speeds protein digestion. Eating the fuzzy washed skin triples dietary fiber intake!'
      },
      {
        id: 'carrots',
        name: 'Fresh Carrots',
        category: 'greens-vegetables',
        categoryName: 'Tubers & Vegetables',
        icon: '🥕',
        serving: '100g (~1 medium)',
        calories: 41,
        protein: 0.9,
        carbs: 9.6,
        fiber: 2.8,
        fat: 0.2,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Vegetable-Carrot-Bundle-wStalks.jpg/330px-Vegetable-Carrot-Bundle-wStalks.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto'],
        nutrients: [
          { id: 'vitamin-a', name: 'Beta-Carotene', amount: '835 mcg RAE', pctDV: 93, highlight: true },
          { id: 'biotin', name: 'Biotin (B7)', amount: '6.0 mcg', pctDV: 20, highlight: false },
          { id: 'vitamin-k', name: 'Vitamin K1', amount: '13 mcg', pctDV: 11, highlight: false }
        ],
        prepTip: 'Light cooking actually increases the bio-accessibility of beta-carotene by softening rigid plant cell walls.'
      },
      {
        id: 'chickpeas',
        name: 'Cooked Chickpeas (Garbanzo)',
        category: 'legumes-pulses',
        categoryName: 'Legumes & Pulses',
        icon: '🧆',
        serving: '100g (cooked, 1/2 cup)',
        calories: 164,
        protein: 8.9,
        carbs: 27.4,
        fiber: 7.6,
        fat: 2.6,
        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Chickpea_BNC.jpg/330px-Chickpea_BNC.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
        dietary: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free'],
        nutrients: [
          { id: 'folate', name: 'Folate (B9)', amount: '172 mcg', pctDV: 43, highlight: true },
          { id: 'fiber', name: 'Soluble & Insoluble Fiber', amount: '7.6 g', pctDV: 27, highlight: true },
          { id: 'iron', name: 'Iron', amount: '2.9 mg', pctDV: 16, highlight: false },
          { id: 'manganese', name: 'Manganese', amount: '1.0 mg', pctDV: 43, highlight: false }
        ],
        prepTip: 'Combine with tahini (sesame) in hummus to create a complementary amino acid profile rich in methionine and lysine.'
      }
    ];

    // Build Food Map for Instant O(1) Lookup
    const FOODS_MAP = new Map(FOODS_DATASET.map(f => [f.id, f]));

    // ========================================================================
    // 3. MASTER NUTRIENTS DATABASE (30+ ESSENTIAL BIOCHEMICAL COMPOUNDS)
    // ========================================================================
    const NUTRIENTS_DATASET = [
      // --- MACRONUTRIENTS ---
      {
        id: 'protein',
        name: 'Complete Protein',
        chemicalName: 'Essential Amino Acids (Leucine, Isoleucine, Valine, Lysine)',
        category: 'macro',
        categoryLabel: 'Macronutrient',
        icon: '🥩',
        gradient: ['#f87171', '#dc2626', '#991b1b'],
        dailyRDA: '56 g (Men) / 46 g (Women) [0.8-1.6g/kg]',
        dailyUL: '2.5 g / kg body weight',
        unit: 'g',
        roles: [
          'Muscle protein synthesis & cellular tissue repair',
          'Enzyme and hormone production (insulin, glucagon, GH)',
          'Immune immunoglobulins and antibody synthesis'
        ],
        deficiencySigns: [
          'Muscle wasting & sarcopenia',
          'Slow wound healing & impaired immunity',
          'Edema, brittle nails, and thinning hair'
        ],
        toxicitySigns: 'Dehydration, elevated blood urea nitrogen (BUN), kidney strain in pre-existing renal disease.',
        bioavailabilityNote: 'Animal proteins, eggs, dairy, and soy are complete proteins with high DIAAS scores; plant proteins can be combined to achieve complete amino acid profiles.',
        topFoodIds: ['salmon', 'egg', 'tofu', 'greek-yogurt', 'lentils'],
        synergies: ['Vitamin B6 (co-factor in amino acid transamination)', 'Zinc (essential for protein synthesis)'],
        inhibitors: ['Chronic severe caloric restriction']
      },
      {
        id: 'fiber',
        name: 'Dietary Fiber',
        chemicalName: 'Soluble Beta-Glucans, Pectins & Insoluble Cellulose',
        category: 'macro',
        categoryLabel: 'Macronutrient & Prebiotic',
        icon: '🌾',
        gradient: ['#34d399', '#059669', '#065f46'],
        dailyRDA: '38 g (Men) / 25 g (Women)',
        dailyUL: 'No strict UL (excess >70g may impair mineral absorption)',
        unit: 'g',
        roles: [
          'Colonic fermentation into short-chain fatty acids (SCFAs: Butyrate, Acetate)',
          'Binds bile salts to regulate serum cholesterol',
          'Slows gastric emptying to smooth postprandial glucose curves'
        ],
        deficiencySigns: [
          'Constipation and irregular bowel motility',
          'Elevated LDL cholesterol & erratic blood sugar',
          'Dysbiosis of beneficial gut microbiota'
        ],
        toxicitySigns: 'Abdominal cramping, gas, bloating, and potential reduction in calcium/iron absorption if consumed without adequate water.',
        bioavailabilityNote: 'Requires adequate water intake (2.5-3L daily) to form proper viscous gels and stool bulk.',
        topFoodIds: ['chia-seeds', 'lentils', 'avocado', 'oats', 'chickpeas'],
        synergies: ['Water & Electrolytes (essential for gel hydration)', 'Prebiotic polyphenols'],
        inhibitors: ['Rapid unaccustomed escalation without fluids']
      },
      {
        id: 'omega-3',
        name: 'Omega-3 Fatty Acids',
        chemicalName: 'EPA (Eicosapentaenoic) & DHA (Docosahexaenoic) & ALA',
        category: 'macro',
        categoryLabel: 'Essential Fatty Acid',
        icon: '🐟',
        gradient: ['#38bdf8', '#0284c7', '#0369a1'],
        dailyRDA: '1,600 mg (Men) / 1,100 mg (Women) [EPA+DHA ~250-500mg]',
        dailyUL: '3,000 mg (High supplemental doses may thin blood)',
        unit: 'mg',
        roles: [
          'Neuronal membrane fluidity & retina structural lipid',
          'Synthesizes anti-inflammatory resolvins and protectins',
          'Lowers systemic triglycerides and arterial plaque stability'
        ],
        deficiencySigns: [
          'Dry, rough, itchy skin & dermatitis',
          'Cognitive fatigue & attention deficits',
          'Systemic low-grade joint inflammation'
        ],
        toxicitySigns: 'Prolonged bleeding time, bruising, immune suppression at extreme pharmaceutical doses.',
        bioavailabilityNote: 'Marine EPA and DHA are directly bioactive; plant ALA (chia, flax, walnuts) requires enzymatic conversion by delta-6 desaturase, with a conversion rate of ~5-10% to EPA and <1% to DHA.',
        topFoodIds: ['salmon', 'sardines', 'chia-seeds', 'walnuts'],
        synergies: ['Vitamin E (prevents polyunsaturated lipid peroxidation)', 'Dietary fats for absorption'],
        inhibitors: ['Excess dietary Omega-6 (competes for the same desaturase enzymes)']
      },

      // --- FAT-SOLUBLE VITAMINS ---
      {
        id: 'vitamin-a',
        name: 'Vitamin A',
        chemicalName: 'Preformed Retinol & Provitamin Beta-Carotene',
        category: 'vitamin-fat',
        categoryLabel: 'Fat-Soluble Vitamin',
        icon: '🥕',
        gradient: ['#fb923c', '#ea580c', '#9a3412'],
        dailyRDA: '900 mcg RAE (Men) / 700 mcg RAE (Women)',
        dailyUL: '3,000 mcg RAE (Preformed Retinol)',
        unit: 'mcg RAE',
        roles: [
          'Rhodopsin formation for night and low-light vision',
          'Epithelial mucosal barrier integrity (gut, lungs, skin)',
          'T-cell and B-cell immune differentiation'
        ],
        deficiencySigns: [
          'Nyctalopia (night blindness) & Bitot spots (xerophthalmia)',
          'Follicular hyperkeratosis (bumpy "goose-flesh" skin)',
          'Frequent respiratory and gastrointestinal infections'
        ],
        toxicitySigns: 'Hepatomegaly (liver damage), intracranial pressure (headaches), teratogenicity during pregnancy. Beta-carotene does not cause toxicity (only harmless orange skin carotenodermia).',
        bioavailabilityNote: 'Fat is required for absorption. Consuming beta-carotene with healthy oils (olive oil, avocado) multiplies assimilation by up to 6x.',
        topFoodIds: ['beef-liver', 'sweet-potato', 'carrots', 'spinach', 'kale'],
        synergies: ['Zinc (required to synthesize Retinol-Binding Protein)', 'Dietary Lipids'],
        inhibitors: ['Mineral oil laxatives', 'Severe protein deficiency']
      },
      {
        id: 'vitamin-d',
        name: 'Vitamin D3',
        chemicalName: 'Cholecalciferol (Secosteroid Hormone Precursor)',
        category: 'vitamin-fat',
        categoryLabel: 'Fat-Soluble Vitamin / Pro-Hormone',
        icon: '☀️',
        gradient: ['#facc15', '#ca8a04', '#713f12'],
        dailyRDA: '600–800 IU (15–20 mcg)',
        dailyUL: '4,000 IU (100 mcg)',
        unit: 'IU / mcg',
        roles: [
          'Stimulates intestinal calcium and phosphorus absorption',
          'Innate antimicrobial peptide (cathelicidin) induction',
          'Neuromuscular function and bone mineral density preservation'
        ],
        deficiencySigns: [
          'Osteomalacia (adult bone softening) and Rickets in children',
          'Chronic muscle aches, bone pain, and fatigue',
          'Increased susceptibility to respiratory viral infections'
        ],
        toxicitySigns: 'Hypercalcemia, calcification of arterial walls and kidneys, nausea, confusion.',
        bioavailabilityNote: 'Hydroxylated in the liver to 25(OH)D and in the kidneys to active calcitriol 1,25(OH)2D. Magnesium is an indispensable co-factor in all enzymatic conversion steps.',
        topFoodIds: ['salmon', 'sardines', 'egg'],
        synergies: ['Magnesium (essential for enzymatic activation)', 'Vitamin K2 (directs calcium into bones, away from arteries)'],
        inhibitors: ['Lack of sunlight / high melanin index / sunscreen', 'Severe obesity (sequestration in adipose)']
      },
      {
        id: 'vitamin-e',
        name: 'Vitamin E',
        chemicalName: 'd-Alpha-Tocopherol & Mixed Tocopherols',
        category: 'vitamin-fat',
        categoryLabel: 'Fat-Soluble Antioxidant',
        icon: '🛡️',
        gradient: ['#f472b6', '#db2777', '#831843'],
        dailyRDA: '15 mg (22.4 IU)',
        dailyUL: '1,000 mg (Synthetic alpha-tocopherol)',
        unit: 'mg',
        roles: [
          'Primary lipid-soluble antioxidant protecting cell membranes from free radicals',
          'Prevents oxidation of circulating LDL cholesterol',
          'Inhibits platelet aggregation and preserves vascular endothelium'
        ],
        deficiencySigns: [
          'Peripheral neuropathy and ataxia',
          'Hemolytic anemia (red blood cell membrane fragility)',
          'Retinopathy and impaired immune response'
        ],
        toxicitySigns: 'Anticoagulant interaction, increased hemorrhagic risk, interference with Vitamin K.',
        bioavailabilityNote: 'Absorbed in small intestine along with dietary fats via chylomicrons; incorporated into lipoproteins by hepatic alpha-tocopherol transfer protein (alpha-TTP).',
        topFoodIds: ['almonds', 'sunflower-seed', 'avocado', 'spinach'],
        synergies: ['Vitamin C (regenerates oxidized Vitamin E back to its active antioxidant form)', 'Selenium'],
        inhibitors: ['Malabsorption syndromes (celiac, cystic fibrosis)']
      },
      {
        id: 'vitamin-k',
        name: 'Vitamin K (K1 & K2)',
        chemicalName: 'Phylloquinone (K1) & Menaquinones (K2: MK-4, MK-7)',
        category: 'vitamin-fat',
        categoryLabel: 'Fat-Soluble Vitamin',
        icon: '🩸',
        gradient: ['#4ade80', '#16a34a', '#14532d'],
        dailyRDA: '120 mcg (Men) / 90 mcg (Women)',
        dailyUL: 'No established UL',
        unit: 'mcg',
        roles: [
          'Essential co-factor for gamma-glutamyl carboxylase in blood clotting cascade (Factors II, VII, IX, X)',
          'Activates Osteocalcin to bind calcium tightly into bone matrix',
          'Activates Matrix Gla Protein (MGP) to inhibit vascular arterial calcification'
        ],
        deficiencySigns: [
          'Easy bruising, mucosal bleeding, and prolonged prothrombin time',
          'Reduced bone mineral density & elevated fracture risk',
          'Accelerated arterial wall stiffening'
        ],
        toxicitySigns: 'No documented toxicity from K1 or K2; Menadione (synthetic K3) is no longer used due to toxicity.',
        bioavailabilityNote: 'K1 is abundant in green leaves; K2 is synthesized by gut bacteria and found in fermented foods (natto), egg yolks, and cheeses. K2 has a much longer serum half-life (up to 72 hrs vs 1-2 hrs for K1).',
        topFoodIds: ['spinach', 'kale', 'broccoli', 'egg'],
        synergies: ['Vitamin D3 (stimulates osteocalcin production while K2 carboxylates it)', 'Dietary fats'],
        inhibitors: ['Warfarin / Coumarin anticoagulants (Vitamin K antagonists)']
      },

      // --- WATER-SOLUBLE VITAMINS ---
      {
        id: 'vitamin-c',
        name: 'Vitamin C',
        chemicalName: 'L-Ascorbic Acid',
        category: 'vitamin-water',
        categoryLabel: 'Water-Soluble Vitamin',
        icon: '🍊',
        gradient: ['#fbbf24', '#f59e0b', '#b45309'],
        dailyRDA: '90 mg (Men) / 75 mg (Women) [+35mg for smokers]',
        dailyUL: '2,000 mg',
        unit: 'mg',
        roles: [
          'Co-factor for prolyl and lysyl hydroxylases in collagen triple-helix synthesis',
          'Potent aqueous antioxidant quenching reactive oxygen species (ROS)',
          'Reduces ferric iron (Fe3+) to ferrous iron (Fe2+) for enhanced intestinal absorption',
          'Essential for carnitine and catecholamine (adrenaline, noradrenaline) synthesis'
        ],
        deficiencySigns: [
          'Scurvy: perifollicular hemorrhages, corkscrew hairs, bleeding gums',
          'Slow wound healing and tissue fragility',
          'Fatigue and iron-deficiency anemia due to poor iron absorption'
        ],
        toxicitySigns: 'Osmotic diarrhea, gastrointestinal cramps, and increased kidney stone risk (oxalate) at >2,000 mg/day.',
        bioavailabilityNote: 'Highly sensitive to heat, air, and boiling water. Raw, freshly cut fruits and lightly steamed vegetables maintain highest potency.',
        topFoodIds: ['guava', 'bell-pepper', 'kiwi', 'orange', 'broccoli'],
        synergies: ['Non-Heme Iron (multiplies absorption up to 400%)', 'Vitamin E regeneration'],
        inhibitors: ['Heat cooking & prolonged storage', 'Smoking (depletes ascorbic acid pools)']
      },
      {
        id: 'thiamine',
        name: 'Thiamine (Vitamin B1)',
        chemicalName: 'Thiamine Pyrophosphate (TPP)',
        category: 'vitamin-water',
        categoryLabel: 'B-Complex Vitamin',
        icon: '⚡',
        gradient: ['#a3e635', '#65a30d', '#3f6212'],
        dailyRDA: '1.2 mg (Men) / 1.1 mg (Women)',
        dailyUL: 'No established UL',
        unit: 'mg',
        roles: [
          'Essential co-enzyme for pyruvate dehydrogenase in Krebs cycle carbohydrate metabolism',
          'Required for transketolase in pentose phosphate pathway',
          'Maintenance of myelin sheaths and neurotransmitter (acetylcholine) synthesis'
        ],
        deficiencySigns: [
          'Beriberi: Wet (congestive heart failure) and Dry (peripheral neuropathy)',
          'Wernicke-Korsakoff syndrome in chronic alcohol misuse (ataxia, confusion)',
          'Lactic acidosis and severe muscle weakness'
        ],
        toxicitySigns: 'No known toxicity from oral doses.',
        bioavailabilityNote: 'Antithiamine factors in raw fish/shellfish (thiaminases) and tea/coffee tannins can degrade thiamine.',
        topFoodIds: ['nutritional-yeast', 'oats', 'chickpeas', 'flax-seeds'],
        synergies: ['Magnesium (required for TPP conversion)', 'Other B-complex vitamins'],
        inhibitors: ['Heavy alcohol consumption', 'Thiaminases in raw carp/shellfish']
      },
      {
        id: 'riboflavin',
        name: 'Riboflavin (Vitamin B2)',
        chemicalName: 'Flavin Adenine Dinucleotide (FAD) & FMN',
        category: 'vitamin-water',
        categoryLabel: 'B-Complex Vitamin',
        icon: '🟡',
        gradient: ['#fde047', '#eab308', '#854d0e'],
        dailyRDA: '1.3 mg (Men) / 1.1 mg (Women)',
        dailyUL: 'No established UL',
        unit: 'mg',
        roles: [
          'Central electron carrier in mitochondrial electron transport chain (Complex I & II)',
          'Co-enzyme for glutathione reductase recycling the master antioxidant glutathione',
          'Required for conversion of Vitamin B6 and folate into active co-enzyme forms'
        ],
        deficiencySigns: [
          'Angular cheilitis (painful cracking at corners of the mouth)',
          'Glossitis (magenta swollen tongue)',
          'Normocytic anemia and corneal vascularization'
        ],
        toxicitySigns: 'Harmless neon-yellow discoloration of urine (flavin excretion).',
        bioavailabilityNote: 'Extremely light-sensitive; photodegraded rapidly by UV rays (which is why milk is stored in opaque containers).',
        topFoodIds: ['beef-liver', 'nutritional-yeast', 'almonds', 'egg', 'greek-yogurt'],
        synergies: ['Iron (supports hemoglobin synthesis)', 'Vitamin B6 and Folate'],
        inhibitors: ['Sunlight/UV exposure', 'Alcoholism']
      },
      {
        id: 'niacin',
        name: 'Niacin (Vitamin B3)',
        chemicalName: 'Nicotinic Acid, Nicotinamide & NAD+ / NADH',
        category: 'vitamin-water',
        categoryLabel: 'B-Complex Vitamin',
        icon: '🔋',
        gradient: ['#fb923c', '#c2410c', '#7c2d12'],
        dailyRDA: '16 mg NE (Men) / 14 mg NE (Women)',
        dailyUL: '35 mg (to avoid flush reaction)',
        unit: 'mg NE',
        roles: [
          'Backbone of NAD+ and NADP+, powering over 400 cellular redox reactions',
          'Critical substrate for PARP enzymes in cellular DNA repair and sirtuin longevity proteins',
          'Regulates lipid metabolism and cellular mitochondrial respiration'
        ],
        deficiencySigns: [
          'Pellagra ("The 4 Ds": Dermatitis in sun-exposed areas, Diarrhea, Dementia, Death)',
          'Bright red tongue and fatigue'
        ],
        toxicitySigns: 'Prostaglandin-mediated skin flushing, itching, hepatotoxicity at very high clinical doses (>1,500mg).',
        bioavailabilityNote: '60 mg of dietary tryptophan can be converted in the liver into 1 mg of niacin (NE = Niacin Equivalent).',
        topFoodIds: ['salmon', 'tuna', 'beef-liver', 'nutritional-yeast'],
        synergies: ['Vitamin B6 and Iron (required for tryptophan-to-niacin pathway)'],
        inhibitors: ['Corn-heavy diets without nixtamalization (bound niacytin)']
      },
      {
        id: 'vitamin-b6',
        name: 'Vitamin B6',
        chemicalName: 'Pyridoxal 5-Phosphate (PLP)',
        category: 'vitamin-water',
        categoryLabel: 'B-Complex Vitamin',
        icon: '🧬',
        gradient: ['#a78bfa', '#7c3aed', '#4c1d95'],
        dailyRDA: '1.3–1.7 mg',
        dailyUL: '100 mg',
        unit: 'mg',
        roles: [
          'Co-factor in over 140 amino acid decarboxylation and transamination reactions',
          'Synthesis of neurotransmitters: Serotonin, Dopamine, GABA, Melatonin, and Epinephrine',
          'Clears toxic homocysteine via transsulfuration pathway into cystathionine',
          'Essential for heme synthesis in red blood cells'
        ],
        deficiencySigns: [
          'Microcytic anemia with normal iron stores',
          'Peripheral neuropathy, convulsions, and depression',
          'Seborrheic dermatitis and elevated cardiovascular homocysteine'
        ],
        toxicitySigns: 'Sensory peripheral neuropathy with numbness and ataxia (usually from chronic megadoses >200mg/day).',
        bioavailabilityNote: 'Plant forms (pyridoxine glucoside) have ~50% bioavailability compared to active animal pyridoxal phosphate.',
        topFoodIds: ['salmon', 'beef-liver', 'chickpeas', 'banana', 'bell-pepper'],
        synergies: ['Magnesium and Zinc (essential for PLP kinase activation)', 'Folate and B12'],
        inhibitors: ['Isoniazid and penicillamine medications', 'Chronic alcohol']
      },
      {
        id: 'folate',
        name: 'Folate (Vitamin B9)',
        chemicalName: 'Tetrahydrofolate (THF) & L-Methylfolate (5-MTHF)',
        category: 'vitamin-water',
        categoryLabel: 'B-Complex Vitamin',
        icon: '🌱',
        gradient: ['#2dd4bf', '#0d9488', '#115e59'],
        dailyRDA: '400 mcg DFE (600 mcg in Pregnancy)',
        dailyUL: '1,000 mcg (Synthetic folic acid)',
        unit: 'mcg DFE',
        roles: [
          'One-carbon metabolism transferring methyl groups for de novo purine/thymidine DNA synthesis',
          'Remethylation of homocysteine to methionine alongside Vitamin B12',
          'Essential for fetal neural tube closure in early embryogenesis'
        ],
        deficiencySigns: [
          'Megaloblastic macrocytic anemia',
          'Neural tube defects (spina bifida, anencephaly) in developing fetuses',
          'Elevated plasma homocysteine and cardiovascular vulnerability'
        ],
        toxicitySigns: 'High synthetic folic acid (>1,000 mcg) can mask the hematological symptoms of Vitamin B12 deficiency while neurological damage continues.',
        bioavailabilityNote: 'Natural dietary folates are polyglutamates deconjugated in the brush border; individuals with the MTHFR gene variant benefit especially from natural active 5-MTHF from leafy greens.',
        topFoodIds: ['lentils', 'spinach', 'chickpeas', 'beef-liver', 'asparagus'],
        synergies: ['Vitamin B12 (homocysteine remethylation cycle partner)', 'Choline and Betaine'],
        inhibitors: ['Methotrexate, anticonvulsant medications', 'Heat cooking (prolonged boiling destroys folate)']
      },
      {
        id: 'vitamin-b12',
        name: 'Vitamin B12',
        chemicalName: 'Cobalamin (Methylcobalamin, Adenosylcobalamin)',
        category: 'vitamin-water',
        categoryLabel: 'Essential B-Complex Vitamin',
        icon: '🔴',
        gradient: ['#f43f5e', '#e11d48', '#881337'],
        dailyRDA: '2.4 mcg (2.6 mcg in Pregnancy)',
        dailyUL: 'No established UL',
        unit: 'mcg',
        roles: [
          'Co-enzyme for methionine synthase in homocysteine clearance and DNA methylation',
          'Co-enzyme for methylmalonyl-CoA mutase in myelin sheath lipid synthesis',
          'Essential for erythrocyte (red blood cell) maturation'
        ],
        deficiencySigns: [
          'Pernicious / megaloblastic anemia with severe fatigue',
          'Subacute combined degeneration of the spinal cord (tingling, numbness, balance loss)',
          'Irreversible cognitive decline, depression, and memory loss if untreated'
        ],
        toxicitySigns: 'No documented toxicity even at megadoses (excess excreted via urine).',
        bioavailabilityNote: 'Requires gastric acid to cleave from dietary protein and Intrinsic Factor (secreted by gastric parietal cells) for ileal absorption. Vegans must supplement or consume fortified foods as plants do not synthesize B12.',
        topFoodIds: ['beef-liver', 'oysters', 'sardines', 'salmon', 'nutritional-yeast', 'egg'],
        synergies: ['Folate (works in tandem in one-carbon cycle)', 'Gastric acid and intrinsic factor'],
        inhibitors: ['Metformin, proton pump inhibitors (PPIs/antacids)', 'Pernicious anemia autoimmune antibodies']
      },

      // --- MACROMINERALS ---
      {
        id: 'calcium',
        name: 'Calcium',
        chemicalName: 'Calcium Ion (Ca2+)',
        category: 'mineral-major',
        categoryLabel: 'Macromineral',
        icon: '🦴',
        gradient: ['#e2e8f0', '#94a3b8', '#334155'],
        dailyRDA: '1,000 mg (1,200 mg for women >50 & men >70)',
        dailyUL: '2,500 mg',
        unit: 'mg',
        roles: [
          'Structural mineralization of bones and hydroxyapatite tooth enamel',
          'Triggers actin-myosin cross-bridge muscle contraction (including cardiac rhythm)',
          'Essential for presynaptic neurotransmitter vesicle exocytosis and blood clotting'
        ],
        deficiencySigns: [
          'Osteopenia and Osteoporosis with elevated fragility fracture risk',
          'Hypocalcemic tetany, muscle spasms, and cardiac arrhythmias',
          'Paraesthesia and numbness in fingers and toes'
        ],
        toxicitySigns: 'Kidney stones (nephrolithiasis), vascular and soft-tissue calcification, constipation.',
        bioavailabilityNote: 'Calcium absorption requires active Vitamin D. Must be accompanied by Vitamin K2 to ensure calcium embeds in bone rather than soft arterial walls.',
        topFoodIds: ['sardines', 'tofu', 'greek-yogurt', 'chia-seeds', 'kale'],
        synergies: ['Vitamin D3 (intestinal absorption)', 'Vitamin K2 (bone targeting)', 'Magnesium'],
        inhibitors: ['High oxalates (spinach calcium is poorly absorbed)', 'Phytates in unsoaked grains', 'Excess sodium']
      },
      {
        id: 'magnesium',
        name: 'Magnesium',
        chemicalName: 'Magnesium Ion (Mg2+)',
        category: 'mineral-major',
        categoryLabel: 'Macromineral & Co-Factor',
        icon: '⚡',
        gradient: ['#38bdf8', '#0284c7', '#0c4a6e'],
        dailyRDA: '420 mg (Men) / 320 mg (Women)',
        dailyUL: '350 mg (from supplements; no UL from whole foods)',
        unit: 'mg',
        roles: [
          'Co-factor in over 300 enzymatic reactions, including all ATP energy transactions (Mg-ATP)',
          'Natural calcium channel blocker allowing muscle relaxation and arterial dilation',
          'Modulates NMDA glutamate receptors for neurological calm and sleep latency',
          'Enzymatic co-factor converting inactive Vitamin D into active calcitriol'
        ],
        deficiencySigns: [
          'Muscle cramps, twitches, and tremors',
          'Cardiac palpitations, hypertension, and arrhythmias',
          'Insomnia, anxiety, migraines, and insulin resistance'
        ],
        toxicitySigns: 'Osmotic diarrhea and nausea from supplemental salts; hypermagnesemia in renal failure.',
        bioavailabilityNote: 'Over 50% of the modern population consumes below the estimated average requirement due to soil depletion and grain refining.',
        topFoodIds: ['pumpkin-seeds', 'chia-seeds', 'spinach', 'almonds', 'dark-chocolate'],
        synergies: ['Vitamin D3 activation', 'Vitamin B6 (enhances cellular magnesium uptake)'],
        inhibitors: ['High supplemental calcium (competes for absorption)', 'Refined sugar and chronic stress (increases urinary excretion)']
      },
      {
        id: 'potassium',
        name: 'Potassium',
        chemicalName: 'Potassium Cation (K+)',
        category: 'mineral-major',
        categoryLabel: 'Electrolyte & Macromineral',
        icon: '🍌',
        gradient: ['#fef08a', '#eab308', '#713f12'],
        dailyRDA: '3,400 mg (Men) / 2,600 mg (Women)',
        dailyUL: 'No UL for dietary intake in healthy individuals',
        unit: 'mg',
        roles: [
          'Primary intracellular cation maintaining cell resting membrane potential via Na+/K+-ATPase pump',
          'Regulates vascular smooth muscle tone to reduce blood pressure',
          'Balances fluid dynamics against extracellular sodium',
          'Required for glycogen storage and cellular energy'
        ],
        deficiencySigns: [
          'Hypokalemia: muscle weakness, cramping, and cardiac arrhythmias',
          'Hypertension and elevated stroke risk',
          'Chronic fatigue and glucose intolerance'
        ],
        toxicitySigns: 'Hyperkalemia (cardiac arrest risk) primarily in chronic kidney disease patients with impaired renal excretion.',
        bioavailabilityNote: 'Whole unprocessed fruits and vegetables are rich in potassium accompanied by bicarbonate-generating anions which buffer systemic acid load.',
        topFoodIds: ['avocado', 'sweet-potato', 'salmon', 'spinach', 'banana'],
        synergies: ['Magnesium (maintains Na+/K+ pump integrity)', 'Water hydration'],
        inhibitors: ['High dietary sodium (increases urinary potassium excretion)', 'Loop and thiazide diuretics']
      },

      // --- TRACE MINERALS ---
      {
        id: 'iron',
        name: 'Iron',
        chemicalName: 'Heme (Fe2+) & Non-Heme (Fe3+) Iron',
        category: 'mineral-trace',
        categoryLabel: 'Essential Trace Element',
        icon: '🔴',
        gradient: ['#ef4444', '#b91c1c', '#7f1d1d'],
        dailyRDA: '8 mg (Men / Postmenopausal Women) / 18 mg (Premenopausal Women) [27 mg in Pregnancy]',
        dailyUL: '45 mg',
        unit: 'mg',
        roles: [
          'Central coordination ion of hemoglobin in red blood cells transporting oxygen to tissues',
          'Core component of myoglobin in muscle oxygen storage',
          'Essential co-factor in mitochondrial cytochromes for ATP electron transport chain',
          'Required for ribonucleotide reductase in DNA synthesis'
        ],
        deficiencySigns: [
          'Iron-Deficiency Anemia (microcytic, hypochromic RBCs)',
          'Severe fatigue, pale skin (pallor), cold hands and feet',
          'Brittle spoon-shaped nails (koilonychia) and pica cravings'
        ],
        toxicitySigns: 'Hemochromatosis (iron overload organ damage in liver, heart, pancreas), free-radical oxidative tissue injury.',
        bioavailabilityNote: 'Heme iron (seafood, liver, meat) is absorbed at ~15-35% efficiency independent of meal constituents; Non-heme iron (lentils, spinach, seeds) is absorbed at ~2-20% and is heavily boosted by Vitamin C and inhibited by coffee/tea tannins.',
        topFoodIds: ['beef-liver', 'oysters', 'lentils', 'dark-chocolate', 'spinach', 'chickpeas'],
        synergies: ['Vitamin C (reduces Fe3+ to Fe2+, multiplying uptake 4x)', 'Copper (ceruloplasmin iron transport)'],
        inhibitors: ['Calcium (competes for DMT-1 transporter)', 'Coffee and tea polyphenols / tannins', 'Phytates']
      },
      {
        id: 'zinc',
        name: 'Zinc',
        chemicalName: 'Zinc Cation (Zn2+)',
        category: 'mineral-trace',
        categoryLabel: 'Essential Trace Element',
        icon: '🛡️',
        gradient: ['#94a3b8', '#64748b', '#1e293b'],
        dailyRDA: '11 mg (Men) / 8 mg (Women)',
        dailyUL: '40 mg',
        unit: 'mg',
        roles: [
          'Catalytic component of over 300 enzymes (carbonic anhydrase, alcohol dehydrogenase, SOD)',
          'Structural "zinc finger" domains regulating gene expression and transcription factors',
          'Critical for T-lymphocyte function, natural killer cells, and wound re-epithelialization',
          'Required for gustin protein (taste perception) and testosterone synthesis'
        ],
        deficiencySigns: [
          'Loss of taste (ageusia) and smell (anosmia)',
          'Impaired wound healing and frequent infections',
          'Hair loss, skin lesions, and hypogonadism'
        ],
        toxicitySigns: 'Nausea, copper deficiency (zinc induces metallothionein which binds copper), suppressed HDL cholesterol.',
        bioavailabilityNote: 'Oysters are the densest source on Earth. High zinc intake (>40mg/day) must be balanced with copper at a 10:1 ratio.',
        topFoodIds: ['oysters', 'beef-liver', 'pumpkin-seeds', 'lentils'],
        synergies: ['Protein (amino acids enhance zinc solubility)', 'Vitamin A mobilization'],
        inhibitors: ['Phytates in raw grains', 'Excess calcium and iron competing for absorption']
      },
      {
        id: 'selenium',
        name: 'Selenium',
        chemicalName: 'Selenomethionine & Selenocysteine',
        category: 'mineral-trace',
        categoryLabel: 'Essential Trace Element',
        icon: '🧬',
        gradient: ['#a855f7', '#7e22ce', '#3b0764'],
        dailyRDA: '55 mcg',
        dailyUL: '400 mcg',
        unit: 'mcg',
        roles: [
          'Incorporated into selenoproteins, including Glutathione Peroxidase (master antioxidant)',
          'Required for iodothyronine deiodinases converting inactive T4 thyroid hormone into active T3',
          'Supports immune antiviral defenses and protects sperm motility'
        ],
        deficiencySigns: [
          'Keshan disease (cardiomyopathy) and Kashin-Beck osteoarthropathy',
          'Subclinical hypothyroidism with poor T4-to-T3 conversion',
          'Muscle weakness and cognitive fog'
        ],
        toxicitySigns: 'Selenosis: garlic odor on breath, metallic taste, hair loss, brittle fingernails, nerve damage.',
        bioavailabilityNote: 'Soil concentrations vary dramatically. Brazil nuts are so potent that just 1-2 nuts deliver over 300% of the daily allowance.',
        topFoodIds: ['brazil-nuts', 'salmon', 'sardines', 'egg'],
        synergies: ['Vitamin E (synergistic lipid membrane antioxidant defense)'],
        inhibitors: ['Heavy metals (mercury binds selenium into insoluble complexes)']
      },
      {
        id: 'iodine',
        name: 'Iodine',
        chemicalName: 'Iodide Ion (I-)',
        category: 'mineral-trace',
        categoryLabel: 'Essential Trace Element',
        icon: '🦋',
        gradient: ['#c084fc', '#9333ea', '#581c87'],
        dailyRDA: '150 mcg (220 mcg in Pregnancy)',
        dailyUL: '1,100 mcg',
        unit: 'mcg',
        roles: [
          'Required constituent of thyroid hormones Thyroxine (T4, contains 4 iodine atoms) and Triiodothyronine (T3)',
          'Regulates basal metabolic rate, mitochondrial thermogenesis, and cellular respiration',
          'Essential for fetal cerebral cortex development and cognitive myelination'
        ],
        deficiencySigns: [
          'Goiter (thyroid gland enlargement) and primary hypothyroidism (weight gain, cold intolerance)',
          'Cretinism / irreversible intellectual disability in infants born to deficient mothers',
          'Fatigue, dry skin, and muscle weakness'
        ],
        toxicitySigns: 'Goiter, elevated TSH, thyroiditis, hyper- or hypothyroidism.',
        bioavailabilityNote: 'Sea vegetables (kelp, nori), iodized salt, and seafood are premier sources. Goitrogens in raw crucifers (isothiocyanates) can impair uptake if iodine intake is marginal.',
        topFoodIds: ['seaweed', 'oysters', 'sardines', 'greek-yogurt'],
        synergies: ['Selenium (required for deiodinase activation of thyroid hormones)', 'Iron'],
        inhibitors: ['Raw unboiled cassava, millet', 'Halogens (fluoride, bromide, perchlorate competing for thyroid uptake)']
      }
    ];

    // Build Nutrient Map for Instant O(1) Lookup
    const NUTRIENTS_MAP = new Map(NUTRIENTS_DATASET.map(n => [n.id, n]));

    // ========================================================================
    // 4. NUTRIENT SYNERGIES & BIOAVAILABILITY MATRIX
    // ========================================================================
    const SYNERGIES_DATA = {
      powerPairs: [
        {
          title: 'Non-Heme Iron + Vitamin C',
          effect: '+400% Iron Absorption',
          isEnhancer: true,
          mechanism: 'Ascorbic acid donates an electron to reduce ferric iron (Fe3+) into the soluble ferrous state (Fe2+), while simultaneously chelating it to prevent insoluble precipitation in alkaline intestinal pH.',
          example: 'Spinach or Lentil Salad dressed with fresh Lemon Juice, or adding Sliced Bell Peppers to a Bean Bowl.'
        },
        {
          title: 'Calcium + Vitamin D3 + Vitamin K2',
          effect: 'Bone Matrix Targeting',
          isEnhancer: true,
          mechanism: 'Vitamin D3 stimulates intestinal calcium absorption, while Vitamin K2 carboxylates osteocalcin to direct calcium directly into bone matrix and away from arterial blood vessel walls.',
          example: 'Sardines (calcium from bones + D3) eaten with Sautéed Tuscan Kale (Vitamin K1/K2).'
        },
        {
          title: 'Fat-Soluble Vitamins (A, D, E, K) + Dietary Lipids',
          effect: '+600% Bioavailability',
          isEnhancer: true,
          mechanism: 'Lipophilic vitamins require bile salts and dietary triglycerides to form mixed intestinal micelles that pass through the unstirred water layer into enterocytes.',
          example: 'Roasted Carrots or Sweet Potato drizzled with Extra Virgin Olive Oil or paired with Hass Avocado.'
        },
        {
          title: 'Curcumin (Turmeric) + Piperine (Black Pepper)',
          effect: '+2,000% Bioavailability',
          isEnhancer: true,
          mechanism: 'Piperine temporarily inhibits hepatic and intestinal glucuronidation, preventing the rapid clearance of curcumin and multiplying its systemic anti-inflammatory bioavailability by 20x.',
          example: 'Golden Turmeric Latte or Curry spiced with a generous pinch of freshly cracked Black Peppercorns.'
        },
        {
          title: 'Zinc + Vitamin A Mobilization',
          effect: 'Vision & Epithelial Health',
          isEnhancer: true,
          mechanism: 'Zinc is a mandatory co-factor for the hepatic synthesis of Retinol-Binding Protein (RBP). Without adequate zinc, Vitamin A cannot be mobilized from liver stores to the retina and skin.',
          example: 'Grass-fed Beef Liver with Pumpkin Seeds and Steamed Greens.'
        }
      ],
      blockers: [
        {
          title: 'Supplemental Calcium vs. Dietary Iron',
          effect: 'DMT-1 Competition',
          isEnhancer: false,
          mechanism: 'Both divalent cations compete for the Divalent Metal Transporter 1 (DMT-1) in the apical membrane of enterocytes. High doses of calcium (>300mg) cut iron absorption in half.',
          example: 'Avoid drinking high-calcium milk or taking calcium supplements with iron-rich steak or lentil meals; space them 2 hours apart.'
        },
        {
          title: 'Coffee & Tea Tannins vs. Non-Heme Iron',
          effect: 'Polyphenol Chelation',
          isEnhancer: false,
          mechanism: 'Chlorogenic acids in coffee and epigallocatechin tannins in black/green tea form tight, insoluble precipitates with non-heme iron that pass unabsorbed through the GI tract.',
          example: 'Enjoy your morning espresso or green tea 60 minutes before or after your breakfast scramble or oatmeal.'
        },
        {
          title: 'Phytic Acid vs. Zinc, Calcium & Magnesium',
          effect: 'Mineral Chelation',
          isEnhancer: false,
          mechanism: 'Myo-inositol hexakisphosphate (phytate) in raw grains and legumes binds positively charged mineral cations into insoluble phytate complexes that resist digestive enzymes.',
          example: 'Deactivate phytates by soaking, sprouting, or sourdough-fermenting oats, lentils, and chickpeas before cooking.'
        },
        {
          title: 'High Supplemental Zinc vs. Copper',
          effect: 'Metallothionein Trapping',
          isEnhancer: false,
          mechanism: 'Excessive zinc intake (>40-50mg/day) induces intestinal metallothionein, which has a higher binding affinity for copper. Copper gets trapped in enterocytes and sloughed off in stool.',
          example: 'When supplementing zinc for immune support, maintain a 10:1 Zinc-to-Copper ratio (e.g., 15mg Zinc with 1.5mg Copper).'
        }
      ]
    };

    // ========================================================================
    // 5. DEFICIENCY & SYMPTOM DIAGNOSTIC DATASET
    // ========================================================================
    const SYMPTOMS_DATASET = [
      {
        id: 'fatigue-exhaustion',
        category: 'energy',
        name: 'Chronic Fatigue & Low Cellular Energy',
        icon: '⚡',
        desc: 'Persistent lethargy and lack of stamina despite normal sleep, often linked to impaired oxygen transport or stalled ATP electron transfer.',
        nutrients: ['iron', 'vitamin-b12', 'magnesium', 'folate', 'thiamine'],
        foods: 'Wild salmon, lentils, beef liver, pumpkin seeds, and nutritional yeast.'
      },
      {
        id: 'muscle-cramps-spasms',
        category: 'muscles',
        name: 'Muscle Cramps, Spasms & Eye Twitches',
        icon: '💪',
        desc: 'Involuntary muscle contractions and nocturnal calf cramps caused by electrolyte imbalance and stalled cellular relaxation.',
        nutrients: ['magnesium', 'potassium', 'calcium'],
        foods: 'Avocado, pumpkin seeds, sweet potato, spinach, and plain Greek yogurt.'
      },
      {
        id: 'brittle-nails-hair-loss',
        category: 'skin',
        name: 'Brittle Ridged Nails & Hair Thinning',
        icon: '💅',
        desc: 'Fragile nails prone to splitting and excessive hair shedding due to impaired keratin synthesis and microcirculation deficits.',
        nutrients: ['iron', 'zinc', 'protein', 'biotin', 'vitamin-c'],
        foods: 'Oysters, whole pasture-raised eggs, pumpkin seeds, and bell peppers.'
      },
      {
        id: 'frequent-infections',
        category: 'immune',
        name: 'Frequent Colds & Sluggish Wound Healing',
        icon: '🛡️',
        desc: 'Recurring upper respiratory infections and minor cuts taking weeks to heal due to compromised innate immunity and collagen delay.',
        nutrients: ['zinc', 'vitamin-c', 'vitamin-d', 'vitamin-a'],
        foods: 'Fresh guava, raw oysters, bell peppers, wild salmon, and carrots.'
      },
      {
        id: 'brain-fog-mood',
        category: 'cognition',
        name: 'Brain Fog, Low Mood & Memory Lag',
        icon: '🧠',
        desc: 'Difficulty concentrating, mental sluggishness, and mood dips stemming from sluggish neurotransmitter synthesis or elevated homocysteine.',
        nutrients: ['omega-3', 'vitamin-b12', 'vitamin-b6', 'folate', 'magnesium'],
        foods: 'Wild salmon, walnuts, pastured eggs, dark chocolate, and nutritional yeast.'
      },
      {
        id: 'bone-aches-stiff-joints',
        category: 'bones',
        name: 'Deep Bone Aches & Reduced Bone Density',
        icon: '🦴',
        desc: 'Aching in long bones and early osteopenia from impaired calcium mineralization and osteocalcin carboxylation.',
        nutrients: ['vitamin-d', 'calcium', 'vitamin-k', 'magnesium'],
        foods: 'Canned sardines with bones, fortified Greek yogurt, kale, and chia seeds.'
      },
      {
        id: 'night-vision-decline',
        category: 'skin',
        name: 'Night Blindness & Severe Dry Eyes',
        icon: '👁️',
        desc: 'Difficulty adjusting vision in low-light environments and dry, irritated corneas caused by rhodopsin regeneration failure.',
        nutrients: ['vitamin-a', 'zinc', 'omega-3'],
        foods: 'Carrots, sweet potatoes, wild salmon, and beef liver.'
      },
      {
        id: 'bleeding-gums',
        category: 'skin',
        name: 'Bleeding Gums & Easy Bruising',
        icon: '🩸',
        desc: 'Capillary fragility and swollen gums while brushing teeth, indicating compromised collagen cross-linking or clotting factor delays.',
        nutrients: ['vitamin-c', 'vitamin-k'],
        foods: 'Guava, kiwi, red bell peppers, broccoli, and spinach.'
      }
    ];

    // ========================================================================
    // 6. CLINICAL NUTRITION MASTERY QUIZ DATASET
    // ========================================================================
    const QUIZ_QUESTIONS = {
      beginner: [
        {
          q: 'Which vitamin is synthesized in human skin upon exposure to solar UVB radiation?',
          options: ['Vitamin C', 'Vitamin D3', 'Vitamin A', 'Vitamin B12'],
          ans: 1,
          exp: 'Vitamin D3 (cholecalciferol) is synthesized from 7-dehydrocholesterol in the skin through the action of solar ultraviolet B (UVB) photons.'
        },
        {
          q: 'Which of the following whole foods contains significantly more Vitamin C than an orange?',
          options: ['Guava', 'Banana', 'White Potato', 'Brown Rice'],
          ans: 0,
          exp: 'Fresh guava provides over 228 mg of Vitamin C per 100g—more than 300% of an orange! Red bell peppers also exceed citrus fruits in ascorbic acid concentration.'
        },
        {
          q: 'What is the primary physiological role of dietary fiber in human health?',
          options: ['Immediate glucose fuel', 'Fermentation by gut microbiome into beneficial short-chain fatty acids (SCFAs)', 'Muscle protein building', 'Bone mineralization'],
          ans: 1,
          exp: 'Prebiotic soluble fiber is fermented in the colon into short-chain fatty acids (like butyrate), which fuel colonocytes, reduce inflammation, and regulate cholesterol.'
        },
        {
          q: 'Why should individuals following a 100% plant-based (vegan) diet supplement Vitamin B12?',
          options: ['Plants absorb all B12 from soil', 'Vitamin B12 is exclusively synthesized by microorganisms and absent in unfortified plant foods', 'Cooking destroys plant B12', 'Plants only contain Vitamin B6'],
          ans: 1,
          exp: 'Vitamin B12 is only synthesized by bacteria and archaea. Unfortified plant foods contain no reliable active B12, making supplementation or fortified foods mandatory.'
        },
        {
          q: 'Which mineral is the primary intracellular electrolyte responsible for balancing extracellular sodium and reducing blood pressure?',
          options: ['Potassium', 'Calcium', 'Lead', 'Iron'],
          ans: 0,
          exp: 'Potassium is the chief intracellular cation. Working through the cellular Na+/K+-ATPase pump, it blunts sodium retention and promotes vascular arterial relaxation.'
        }
      ],
      intermediate: [
        {
          q: 'Pairing non-heme iron (from lentils or spinach) with which nutrient can multiply its intestinal absorption up to fourfold?',
          options: ['Calcium', 'Vitamin C (Ascorbic Acid)', 'Phytic Acid', 'Black Tea Tannins'],
          ans: 1,
          exp: 'Vitamin C reduces ferric iron (Fe3+) into the soluble ferrous state (Fe2+) and chelates it, preventing precipitation in alkaline intestinal pH and dramatically increasing uptake.'
        },
        {
          q: 'What is the key functional difference between Vitamin K1 and Vitamin K2?',
          options: ['K1 is for vision; K2 is for hearing', 'K1 primarily activates hepatic clotting factors; K2 directs calcium into bone and prevents arterial calcification', 'K1 is toxic; K2 is safe', 'There is no biological difference'],
          ans: 1,
          exp: 'Phylloquinone (K1) is utilized by the liver for coagulation factors, whereas menaquinones (K2) carboxylate osteocalcin in bones and Matrix Gla Protein in blood vessels.'
        },
        {
          q: 'Consuming just 1 to 2 Brazil nuts per day easily provides over 200% of the daily allowance for which thyroid-critical trace mineral?',
          options: ['Selenium', 'Iodine', 'Manganese', 'Chromium'],
          ans: 0,
          exp: 'Brazil nuts accumulate enormous concentrations of selenium from soil. Just two nuts provide ~190 mcg of selenium, the co-factor for iodothyronine deiodinases.'
        },
        {
          q: 'Why does excessive supplemental zinc intake (>40-50 mg/day over long periods) induce a copper deficiency?',
          options: ['Zinc destroys copper in the stomach', 'High zinc induces intestinal metallothionein, which irreversibly binds copper and traps it in enterocytes', 'Zinc blocks liver bile production', 'Copper evaporates from the body'],
          ans: 1,
          exp: 'Zinc upregulates the mucosal protein metallothionein, which has a higher affinity for copper than zinc. Trapped copper is discarded when enterocytes slough off.'
        },
        {
          q: 'Which mineral is required as an enzymatic co-factor in all metabolic conversion steps of Vitamin D into its active hormonal form (Calcitriol)?',
          options: ['Magnesium', 'Fluoride', 'Sodium', 'Phosphorus'],
          ans: 0,
          exp: 'Both hepatic 25-hydroxylase and renal 1-alpha-hydroxylase enzymes are strictly magnesium-dependent. Magnesium deficiency can render Vitamin D biologically ineffective.'
        }
      ],
      advanced: [
        {
          q: 'In the methionine-homocysteine methylation cycle, which two vitamins act as mandatory co-factors for Methionine Synthase?',
          options: ['Vitamin B12 (Cobalamin) and Folate (5-MTHF)', 'Vitamin C and Vitamin E', 'Thiamine and Biotin', 'Vitamin D3 and Vitamin K2'],
          ans: 0,
          exp: 'Methionine synthase requires Methyl-B12 as an intermediate methyl carrier and 5-methyltetrahydrofolate (5-MTHF) as the primary methyl donor to convert toxic homocysteine into methionine.'
        },
        {
          q: 'What biochemical mechanism allows piperine (from black pepper) to boost curcumin bioavailability by 2,000%?',
          options: ['It dissolves curcumin in gastric acid', 'It inhibits hepatic and intestinal glucuronidation enzymes (UGT)', 'It converts curcumin to Vitamin A', 'It expands intestinal microvilli length'],
          ans: 1,
          exp: 'Curcumin normally undergoes rapid first-pass glucuronidation in the intestine and liver. Piperine potently inhibits UDP-glucuronosyltransferase, enabling systemic circulation.'
        },
        {
          q: 'Why can high-dose synthetic folic acid supplementation (>1,000 mcg/day) be clinically dangerous in elderly individuals with undiagnosed Vitamin B12 deficiency?',
          options: ['It induces severe kidney stones', 'It resolves megaloblastic anemia while masking progressive, irreversible spinal cord neuropathy', 'It stops heart contractions', 'It destroys red blood cells'],
          ans: 1,
          exp: 'Folic acid bypasses the "folate trap" to correct hematological anemia, masking the underlying B12 deficiency while demyelination of the spinal cord silently advances.'
        },
        {
          q: 'Which transporter in the apical membrane of enterocytes is competed for by both divalent iron (Fe2+) and divalent calcium (Ca2+)?',
          options: ['GLUT-4', 'DMT-1 (Divalent Metal Transporter 1)', 'SGLT-1', 'Peptide Transporter 1'],
          ans: 1,
          exp: 'DMT-1 non-specifically transports divalent metal cations. High concentrations of calcium compete directly with iron for binding sites, which is why calcium supplements should be spaced from iron meals.'
        },
        {
          q: 'What is the biochemical active form of Vitamin B6 that serves as a co-enzyme for amino acid transaminations and neurotransmitter synthesis?',
          options: ['Pyridoxine hydrochloride', 'Pyridoxal 5-Phosphate (PLP)', 'Pyridoxamine', '4-Pyridoxic acid'],
          ans: 1,
          exp: 'PLP (Pyridoxal 5-Phosphate) is the active co-enzyme form of B6, serving as an electron sink in transaminations, decarboxylations, and the synthesis of GABA, dopamine, and serotonin.'
        }
      ]
    };

    // ========================================================================
    // 7. APPLICATION STATE
    // ========================================================================
    const state = {
      currentView: 'viewNutrients',
      nutrientFilter: 'all',
      nutrientSearch: '',
      foodFilter: 'all',
      foodSearch: '',
      dietaryFilters: new Set(),
      symptomFilter: 'all',
      symptomSearch: '',

      // Calculator Profile State
      profile: {
        age: 30,
        sex: 'male',
        activity: 'sedentary',
        diet: 'omnivore'
      },

      // Daily Plate State
      plate: {
        breakfast: ['oats', 'chia-seeds', 'blueberries'],
        lunch: ['lentils', 'spinach', 'avocado'],
        dinner: ['salmon', 'sweet-potato', 'broccoli'],
        snacks: ['almonds', 'dark-chocolate']
      },

      // Quiz State
      quiz: {
        tier: 'beginner',
        currentIdx: 0,
        score: 0,
        questions: []
      }
    };

    // ========================================================================
    // 8. DOM SELECTIONS
    // ========================================================================
    const navTabs = document.querySelectorAll('.nav-tab');
    const moduleViews = document.querySelectorAll('.module-view');
    const globalSearchInput = document.getElementById('globalNutriSearch');
    const btnAudioToggle = document.getElementById('btnAudioToggle');
    const audioIcon = document.getElementById('audioIcon');

    // View 1 Elements
    const nutrientCategoryPills = document.querySelectorAll('#nutrientCategoryPills .filter-pill');
    const nutrientsGrid = document.getElementById('nutrientsGrid');
    const nutrientCountBadge = document.getElementById('nutrientCountBadge');

    // View 2 Elements
    const foodCategoryPills = document.querySelectorAll('#foodCategoryPills .filter-pill');
    const dietaryButtons = document.querySelectorAll('#dietaryTogglesRow .dietary-btn');
    const foodsGrid = document.getElementById('foodsGrid');

    // View 3 Elements
    const calcAgeSlider = document.getElementById('calcAgeSlider');
    const calcAgeVal = document.getElementById('calcAgeVal');
    const calcLifeStageTag = document.getElementById('calcLifeStageTag');
    const calcSexPills = document.querySelectorAll('#calcSexGroup .radio-pill');
    const calcActivityPills = document.querySelectorAll('#calcActivityGroup .radio-pill');
    const calcDietPills = document.querySelectorAll('#calcDietGroup .radio-pill');
    const calcTargetsTableBody = document.getElementById('calcTargetsTableBody');
    const calcAlertMsg = document.getElementById('calcAlertMsg');
    const btnApplyRdaToPlate = document.getElementById('btnApplyRdaToPlate');

    // View 4 Elements
    const plateProfileTag = document.getElementById('plateProfileTag');
    const plateTotalFoodsCount = document.getElementById('plateTotalFoodsCount');
    const plateTotalCalories = document.getElementById('plateTotalCalories');
    const plateTotalProtein = document.getElementById('plateTotalProtein');
    const plateTotalFiber = document.getElementById('plateTotalFiber');
    const plateTotalFat = document.getElementById('plateTotalFat');
    const plateTelemetryMeters = document.getElementById('plateTelemetryMeters');
    const plateClinicalSummary = document.getElementById('plateClinicalSummary');
    const btnClearPlate = document.getElementById('btnClearPlate');
    const btnSamplePlateMed = document.getElementById('btnSamplePlateMed');
    const btnSamplePlateVegan = document.getElementById('btnSamplePlateVegan');

    // View 5 Elements
    const powerPairsList = document.getElementById('powerPairsList');
    const blockersList = document.getElementById('blockersList');

    // View 6 Elements
    const symptomSearchInput = document.getElementById('symptomSearchInput');
    const symptomCategoryPills = document.querySelectorAll('#symptomCategoryPills .filter-pill');
    const symptomCardsGrid = document.getElementById('symptomCardsGrid');

    // View 7 Elements
    const quizSetupScreen = document.getElementById('quizSetupScreen');
    const quizPlayScreen = document.getElementById('quizPlayScreen');
    const quizResultsScreen = document.getElementById('quizResultsScreen');
    const quizTierLabel = document.getElementById('quizTierLabel');
    const quizQuestionCounter = document.getElementById('quizQuestionCounter');
    const quizScoreDisplay = document.getElementById('quizScoreDisplay');
    const quizQuestionText = document.getElementById('quizQuestionText');
    const quizOptionsList = document.getElementById('quizOptionsList');
    const quizFeedbackBox = document.getElementById('quizFeedbackBox');
    const quizExplanationText = document.getElementById('quizExplanationText');
    const btnNextQuestion = document.getElementById('btnNextQuestion');
    const btnRestartQuiz = document.getElementById('btnRestartQuiz');
    const btnBackToNutrients = document.getElementById('btnBackToNutrients');
    const quizFinalTitle = document.getElementById('quizFinalTitle');
    const quizFinalScoreLine = document.getElementById('quizFinalScoreLine');
    const quizFinalComment = document.getElementById('quizFinalComment');
    const quizTrophyIcon = document.getElementById('quizTrophyIcon');

    // Modals
    const nutrientModalBackdrop = document.getElementById('nutrientModalBackdrop');
    const nutrientModalContent = document.getElementById('nutrientModalContent');
    const nutrientModalCloseBtn = document.getElementById('nutrientModalCloseBtn');

    const foodModalBackdrop = document.getElementById('foodModalBackdrop');
    const foodModalContent = document.getElementById('foodModalContent');
    const foodModalCloseBtn = document.getElementById('foodModalCloseBtn');

    const foodPickerModalBackdrop = document.getElementById('foodPickerModalBackdrop');
    const foodPickerGrid = document.getElementById('foodPickerGrid');
    const foodPickerCloseBtn = document.getElementById('foodPickerCloseBtn');
    const foodPickerSearchInput = document.getElementById('foodPickerSearchInput');
    const foodPickerModalTitle = document.getElementById('foodPickerModalTitle');
    let activeMealSlotTarget = 'breakfast';

    // ========================================================================
    // 9. VIEW SWITCHING & NAVIGATION
    // ========================================================================
    function switchView(targetViewId) {
      state.currentView = targetViewId;
      audio.playPop();

      navTabs.forEach(tab => {
        const isActive = tab.dataset.view === targetViewId;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      moduleViews.forEach(view => {
        view.classList.toggle('active', view.id === targetViewId);
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navTabs.forEach(tab => {
      tab.addEventListener('click', () => switchView(tab.dataset.view));
    });

    btnBackToNutrients.addEventListener('click', () => switchView('viewNutrients'));

    // Audio Mute Toggle
    btnAudioToggle.addEventListener('click', () => {
      audio.isMuted = !audio.isMuted;
      audioIcon.textContent = audio.isMuted ? '🔇' : '🔊';
      if (!audio.isMuted) audio.playPop();
    });

    // Global Search Bar
    globalSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      state.nutrientSearch = q;
      state.foodSearch = q;
      renderNutrients();
      renderFoods();
    });

    // ========================================================================
    // 10. RENDER VIEW 1: NUTRIENT TAXONOMY & DOSSIERS
    // ========================================================================
    function renderNutrients() {
      const filter = state.nutrientFilter;
      const query = state.nutrientSearch;

      const filtered = NUTRIENTS_DATASET.filter(n => {
        if (filter !== 'all' && n.category !== filter) return false;
        if (query) {
          const matchName = n.name.toLowerCase().includes(query);
          const matchChem = n.chemicalName.toLowerCase().includes(query);
          const matchRoles = n.roles.some(r => r.toLowerCase().includes(query));
          return matchName || matchChem || matchRoles;
        }
        return true;
      });

      nutrientCountBadge.textContent = 'Showing ' + filtered.length + ' nutrients';

      if (filtered.length === 0) {
        nutrientsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-dim);">No nutrients matched your search.</div>';
        return;
      }

      nutrientsGrid.innerHTML = filtered.map(n => {
        return `
          <article class="nutrient-card" data-nutrient-id="${n.id}">
            <div class="nutrient-card-header">
              <div class="nutrient-avatar-sphere" style="background: radial-gradient(circle at 35% 35%, ${n.gradient[0]}, ${n.gradient[1]}, ${n.gradient[2]});">
                ${n.icon}
              </div>
              <span class="nutrient-category-pill">${n.categoryLabel}</span>
            </div>
            <h3 class="nutrient-card-title">${n.name}</h3>
            <span class="nutrient-chemical-name">${n.chemicalName}</span>
            <ul class="nutrient-roles-list">
              ${n.roles.slice(0, 2).map(r => '<li>' + r + '</li>').join('')}
            </ul>
            <div class="nutrient-card-footer">
              <span class="nutrient-rda-pill">RDA: ${n.dailyRDA.split('(')[0].trim()}</span>
              <span class="btn-inspect-pill">Deep Dossier ↗</span>
            </div>
          </article>
        `;
      }).join('');
    }

    nutrientCategoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        nutrientCategoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.nutrientFilter = pill.dataset.cat;
        renderNutrients();
      });
    });

    // Open Nutrient Dossier Modal
    function openNutrientModal(nutrientId) {
      const n = NUTRIENTS_MAP.get(nutrientId);
      if (!n) return;
      audio.playChime();

      const topFoodItems = (n.topFoodIds || []).map(id => FOODS_MAP.get(id)).filter(Boolean);

      nutrientModalContent.innerHTML = `
        <div class="modal-header-hero">
          <div class="modal-avatar-lg" style="background: radial-gradient(circle at 35% 35%, ${n.gradient[0]}, ${n.gradient[1]}, ${n.gradient[2]});">
            ${n.icon}
          </div>
          <div>
            <span class="hero-badge">${n.categoryLabel}</span>
            <h2 class="modal-title-main" id="nutrientModalTitle">${n.name}</h2>
            <div class="modal-sub-title">${n.chemicalName}</div>
            <p style="color: var(--text-muted); font-size: 0.925rem; line-height: 1.5;">${n.bioavailabilityNote}</p>
          </div>
        </div>

        <div class="modal-inner-padding">
          <!-- Daily Targets Grid -->
          <div class="modal-stat-grid">
            <div class="modal-stat-card">
              <span class="mstat-lbl">Standard Daily RDA</span>
              <span class="mstat-val">${n.dailyRDA}</span>
            </div>
            <div class="modal-stat-card">
              <span class="mstat-lbl">Tolerable Upper Limit (UL)</span>
              <span class="mstat-val" style="color: var(--rose-danger);">${n.dailyUL}</span>
            </div>
            <div class="modal-stat-card">
              <span class="mstat-lbl">Measurement Unit</span>
              <span class="mstat-val" style="color: var(--cyan-light);">${n.unit.toUpperCase()}</span>
            </div>
            <div class="modal-stat-card">
              <span class="mstat-lbl">Primary Category</span>
              <span class="mstat-val" style="color: var(--amber-light); font-size: 0.95rem;">${n.categoryLabel.split(' ')[0]}</span>
            </div>
          </div>

          <!-- Physiological Roles -->
          <div>
            <h4 class="modal-section-title">🧬 Essential Biological Functions</h4>
            <ul style="list-style: disc; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">
              ${n.roles.map(r => '<li style="margin-bottom: 0.4rem;">' + r + '</li>').join('')}
            </ul>
          </div>

          <!-- Deficiency & Toxicity Alerts -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div style="background: rgba(244, 63, 94, 0.08); border: 1px solid rgba(244, 63, 94, 0.25); border-radius: var(--radius-md); padding: 1rem;">
              <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--rose-danger); display: block; margin-bottom: 0.35rem;">⚠️ Clinical Deficiency Signals</span>
              <ul style="list-style: none; font-size: 0.85rem; color: #fecdd3; line-height: 1.5;">
                ${n.deficiencySigns.map(d => '<li>• ' + d + '</li>').join('')}
              </ul>
            </div>
            <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: var(--radius-md); padding: 1rem;">
              <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--amber-light); display: block; margin-bottom: 0.35rem;">⚡ Toxicity / Upper Limit Symptoms</span>
              <p style="font-size: 0.85rem; color: #fde68a; line-height: 1.5;">${n.toxicitySigns}</p>
            </div>
          </div>

          <!-- Top Whole Foods Resources -->
          <div>
            <h4 class="modal-section-title">🥑 Highest Concentration Whole Foods</h4>
            <div class="top-foods-cards-scroll">
              ${topFoodItems.map(f => `
                <div class="top-food-thumb-card">
                  <img src="${f.imageUrl}" alt="${f.name}" class="top-food-thumb-img" loading="lazy" onerror="this.style.display='none';">
                  <div class="top-food-thumb-info">
                    <div class="tf-name">${f.name}</div>
                    <div class="tf-concentration">${f.serving}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      nutrientModalBackdrop.classList.remove('hidden');
      nutrientModalBackdrop.setAttribute('aria-hidden', 'false');
    }

    nutrientModalCloseBtn.addEventListener('click', () => {
      nutrientModalBackdrop.classList.add('hidden');
      nutrientModalBackdrop.setAttribute('aria-hidden', 'true');
    });

    nutrientModalBackdrop.addEventListener('click', (e) => {
      if (e.target === nutrientModalBackdrop) {
        nutrientModalBackdrop.classList.add('hidden');
      }
    });

    // ========================================================================
    // 11. RENDER VIEW 2: WHOLE FOODS CATALOG (REAL PHOTOGRAPHY)
    // ========================================================================
    function renderFoods() {
      const cat = state.foodFilter;
      const query = state.foodSearch;
      const flags = state.dietaryFilters;

      const filtered = FOODS_DATASET.filter(f => {
        if (cat !== 'all' && f.category !== cat) return false;
        if (flags.size > 0) {
          for (const flag of flags) {
            if (!f.dietary.includes(flag)) return false;
          }
        }
        if (query) {
          const matchName = f.name.toLowerCase().includes(query);
          const matchNutrients = f.nutrients.some(n => n.name.toLowerCase().includes(query));
          return matchName || matchNutrients;
        }
        return true;
      });

      if (filtered.length === 0) {
        foodsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-dim);">No whole foods matched your dietary or search filters.</div>';
        return;
      }

      foodsGrid.innerHTML = filtered.map(f => {
        return `
          <article class="food-card" data-food-id="${f.id}">
            <div class="food-card-banner">
              <img src="${f.imageUrl}" alt="${f.name}" class="food-photo-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div class="food-fallback-avatar" style="display: none;">${f.icon}</div>
              <div class="food-photo-scrim"></div>
              <span class="food-serving-pill">${f.serving.split('(')[0].trim()}</span>
              <div class="food-diet-badges">
                ${f.dietary.slice(0, 2).map(d => '<span class="diet-chip">' + d + '</span>').join('')}
              </div>
            </div>
            <div class="food-card-body">
              <h3 class="food-card-title">${f.name}</h3>
              <span class="food-card-cat">${f.categoryName} • ${f.calories} kcal</span>
              <div class="food-top-nutrients">
                ${f.nutrients.slice(0, 3).map(n => `
                  <div class="nutrient-bar-mini">
                    <span class="nbar-name">${n.name}</span>
                    <span class="nbar-val">${n.amount} (${n.pctDV}% DV)</span>
                  </div>
                `).join('')}
              </div>
              <button type="button" class="btn btn-secondary btn-sm btn-card-action">View Micronutrient Spectrum ↗</button>
            </div>
          </article>
        `;
      }).join('');
    }

    foodCategoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        foodCategoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.foodFilter = pill.dataset.fcat;
        renderFoods();
      });
    });

    dietaryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const flag = btn.dataset.flag;
        if (state.dietaryFilters.has(flag)) {
          state.dietaryFilters.delete(flag);
          btn.classList.remove('active');
        } else {
          state.dietaryFilters.add(flag);
          btn.classList.add('active');
        }
        renderFoods();
      });
    });

    // Open Food Micronutrient Breakdown Modal (Uncropped Real Photo)
    function openFoodModal(foodId) {
      const f = FOODS_MAP.get(foodId);
      if (!f) return;
      audio.playChime();

      foodModalContent.innerHTML = `
        <div class="modal-dossier-photo-hero">
          <img src="${f.imageUrl}" alt="${f.name}" class="modal-dossier-hero-img" onerror="this.style.display='none';">
          <span class="modal-photo-badge">Serving Portion: ${f.serving}</span>
        </div>

        <div class="modal-inner-padding">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="hero-badge">${f.categoryName}</span>
              <h2 class="modal-title-main" id="foodModalTitle">${f.name}</h2>
              <div style="display: flex; gap: 0.4rem; margin-top: 0.5rem;">
                ${f.dietary.map(d => '<span class="diet-chip">' + d.toUpperCase() + '</span>').join('')}
              </div>
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="btnModalAddToPlate" data-food-id="${f.id}">+ Add to Daily Plate</button>
          </div>

          <!-- Macronutrient Split -->
          <div class="modal-stat-grid">
            <div class="modal-stat-card">
              <span class="mstat-lbl">Calories</span>
              <span class="mstat-val">${f.calories} kcal</span>
            </div>
            <div class="modal-stat-card">
              <span class="mstat-lbl">Protein</span>
              <span class="mstat-val" style="color: #f87171;">${f.protein} g</span>
            </div>
            <div class="modal-stat-card">
              <span class="mstat-lbl">Fiber</span>
              <span class="mstat-val" style="color: var(--emerald-light);">${f.fiber} g</span>
            </div>
            <div class="modal-stat-card">
              <span class="mstat-lbl">Healthy Fat</span>
              <span class="mstat-val" style="color: var(--amber-light);">${f.fat} g</span>
            </div>
          </div>

          <!-- Complete Micronutrient Densitometry -->
          <div>
            <h4 class="modal-section-title">📊 Micronutrient Densitometry (% Daily Value per Serving)</h4>
            <div style="display: flex; flex-direction: column; gap: 0.65rem; margin-top: 0.75rem;">
              ${f.nutrients.map(n => `
                <div style="background: rgba(3, 7, 18, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; font-size: 0.85rem;">
                    <span style="font-weight: 700; color: ${n.highlight ? 'var(--emerald-light)' : 'var(--text-main)'};">${n.name}</span>
                    <span style="font-weight: 800; color: var(--emerald-light);">${n.amount} (${n.pctDV}% DV)</span>
                  </div>
                  <div class="meter-progress-track">
                    <div class="meter-progress-fill ${n.pctDV >= 100 ? 'optimal' : ''}" style="width: ${Math.min(n.pctDV, 100)}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Culinary Prep & Bioavailability Tips -->
          <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-md); padding: 1rem;">
            <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--emerald-light); display: block; margin-bottom: 0.35rem;">🍳 Culinary Prep &amp; Absorption Advice</span>
            <p style="font-size: 0.875rem; color: #a7f3d0; line-height: 1.5;">${f.prepTip}</p>
          </div>
        </div>
      `;

      // Wire modal Add To Plate button
      const btnAddToPlate = document.getElementById('btnModalAddToPlate');
      if (btnAddToPlate) {
        btnAddToPlate.addEventListener('click', () => {
          state.plate.lunch.push(f.id);
          audio.playPop();
          renderPlateSlots();
          renderPlateTelemetry();
          foodModalBackdrop.classList.add('hidden');
          switchView('viewPlate');
        });
      }

      foodModalBackdrop.classList.remove('hidden');
      foodModalBackdrop.setAttribute('aria-hidden', 'false');
    }

    foodModalCloseBtn.addEventListener('click', () => {
      foodModalBackdrop.classList.add('hidden');
      foodModalBackdrop.setAttribute('aria-hidden', 'true');
    });

    foodModalBackdrop.addEventListener('click', (e) => {
      if (e.target === foodModalBackdrop) {
        foodModalBackdrop.classList.add('hidden');
      }
    });

    // ========================================================================
    // 12. RENDER VIEW 3: PERSONALIZED RDA CALCULATOR
    // ========================================================================
    function calculatePersonalizedRDA() {
      const { age, sex, activity, diet } = state.profile;

      // Base multipliers based on physiological stage
      let proteinFactor = 0.8; // g / kg (approx 70kg baseline = 56g)
      if (activity === 'moderate') proteinFactor = 1.2;
      if (activity === 'athlete') proteinFactor = 1.6;
      if (sex === 'pregnant') proteinFactor = 1.3;
      if (sex === 'lactating') proteinFactor = 1.4;

      const calcProtein = Math.round(70 * proteinFactor);
      const calcCalories = activity === 'athlete' ? 2800 : (activity === 'moderate' ? 2300 : 2000);
      const calcFiber = sex === 'male' ? 38 : (sex === 'pregnant' ? 30 : 25);
      const calcCalcium = (age > 50 || sex === 'pregnant') ? 1200 : 1000;
      const calcIron = (sex === 'pregnant') ? 27 : (sex === 'female' && age <= 50 ? 18 : 8);
      const calcVitC = (sex === 'lactating') ? 120 : (sex === 'pregnant' ? 85 : (sex === 'male' ? 90 : 75));
      const calcVitD = age > 70 ? 800 : 600;
      const calcB12 = sex === 'lactating' ? 2.8 : (sex === 'pregnant' ? 2.6 : 2.4);
      const calcFolate = sex === 'pregnant' ? 600 : (sex === 'lactating' ? 500 : 400);
      const calcZinc = sex === 'pregnant' ? 12 : (sex === 'male' ? 11 : 8);
      const calcMagnesium = sex === 'male' ? 420 : 320;

      // Table rows
      const targetRows = [
        { name: 'Complete Protein', target: calcProtein + ' g', ul: '175 g', note: activity === 'athlete' ? 'Elevated for myofibrillar repair' : 'RDA baseline maintenance' },
        { name: 'Dietary Fiber', target: calcFiber + ' g', ul: '70 g', note: 'Prebiotic colonocyte fuel' },
        { name: 'Vitamin C', target: calcVitC + ' mg', ul: '2,000 mg', note: 'Collagen & non-heme iron booster' },
        { name: 'Vitamin D3', target: calcVitD + ' IU', ul: '4,000 IU', note: age > 70 ? 'Higher requirement for bone density' : 'Intestinal calcium uptake' },
        { name: 'Vitamin B12', target: calcB12 + ' mcg', ul: 'No limit', note: diet === 'vegan' ? 'CRITICAL: Must supplement or fortify' : 'Myelin & DNA synthesis' },
        { name: 'Folate (B9)', target: calcFolate + ' mcg DFE', ul: '1,000 mcg', note: sex === 'pregnant' ? 'High target for neural tube closure' : 'One-carbon methylation' },
        { name: 'Calcium', target: calcCalcium + ' mg', ul: '2,500 mg', note: age > 50 ? 'Increased for postmenopausal bone density' : 'Structural hydroxyapatite' },
        { name: 'Iron', target: calcIron + ' mg', ul: '45 mg', note: sex === 'female' && age <= 50 ? 'Higher requirement to balance menstruation' : 'Oxygen transport' },
        { name: 'Zinc', target: calcZinc + ' mg', ul: '40 mg', note: 'T-cell immune & enzyme co-factor' },
        { name: 'Magnesium', target: calcMagnesium + ' mg', ul: '350 mg (suppl.)', note: '300+ ATP enzymatic reactions' }
      ];

      calcTargetsTableBody.innerHTML = targetRows.map(r => `
        <tr>
          <td class="tbl-nutrient-name">${r.name}</td>
          <td class="tbl-rda-val">${r.target}</td>
          <td class="tbl-ul-val">${r.ul}</td>
          <td style="color: var(--text-muted); font-size: 0.8rem;">${r.note}</td>
        </tr>
      `).join('');

      // Clinical alert update
      if (diet === 'vegan') {
        calcAlertMsg.textContent = 'Vegan Profile: Vitamin B12 supplementation is essential. Pay attention to dietary zinc, iodine (seaweed), and pairing Vitamin C with iron.';
      } else if (sex === 'pregnant') {
        calcAlertMsg.textContent = 'Pregnancy Profile: Folate (600 mcg) and Iron (27 mg) requirements are significantly elevated to support fetal neurogenesis and maternal blood volume.';
      } else if (activity === 'athlete') {
        calcAlertMsg.textContent = 'Athletic Profile: Elevated protein (1.6 g/kg) and electrolyte targets (potassium, magnesium, sodium) to support muscular recovery and sweat losses.';
      } else {
        calcAlertMsg.textContent = 'Standard adult profile active. Adjust age, sex, and activity to observe shifting Recommended Dietary Allowances.';
      }

      plateProfileTag.textContent = 'Profile: ' + (sex === 'pregnant' ? 'Pregnant' : (sex === 'male' ? 'Male' : 'Female')) + ' (' + age + 'y, ' + activity + ')';
    }

    calcAgeSlider.addEventListener('input', (e) => {
      const age = parseInt(e.target.value, 10);
      state.profile.age = age;
      calcAgeVal.textContent = age + ' years';
      calcLifeStageTag.textContent = age < 19 ? 'Adolescent (4-18 yrs)' : (age > 50 ? 'Mature Adult (51+ yrs)' : 'Adult (19-50 yrs)');
      calculatePersonalizedRDA();
    });

    calcSexPills.forEach(pill => {
      pill.addEventListener('click', () => {
        calcSexPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.profile.sex = pill.dataset.sex;
        calculatePersonalizedRDA();
      });
    });

    calcActivityPills.forEach(pill => {
      pill.addEventListener('click', () => {
        calcActivityPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.profile.activity = pill.dataset.act;
        calculatePersonalizedRDA();
      });
    });

    calcDietPills.forEach(pill => {
      pill.addEventListener('click', () => {
        calcDietPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.profile.diet = pill.dataset.diet;
        calculatePersonalizedRDA();
      });
    });

    btnApplyRdaToPlate.addEventListener('click', () => {
      audio.playSuccess();
      switchView('viewPlate');
    });

    // ========================================================================
    // 13. RENDER VIEW 4: INTERACTIVE DAILY PLATE TRACKER
    // ========================================================================
    function renderPlateSlots() {
      const slots = ['breakfast', 'lunch', 'dinner', 'snacks'];
      let totalItemsCount = 0;

      slots.forEach(slotKey => {
        const foodIds = state.plate[slotKey];
        const container = document.getElementById('items' + slotKey.charAt(0).toUpperCase() + slotKey.slice(1));
        const countBadge = document.getElementById('count' + slotKey.charAt(0).toUpperCase() + slotKey.slice(1));

        totalItemsCount += foodIds.length;
        countBadge.textContent = foodIds.length + ' item' + (foodIds.length === 1 ? '' : 's');

        if (foodIds.length === 0) {
          container.innerHTML = '<p class="slot-empty-msg">No foods logged yet. Click "+ Add Food" to add.</p>';
          return;
        }

        container.innerHTML = '<div class="meal-items-list">' + foodIds.map((id, index) => {
          const food = FOODS_MAP.get(id);
          if (!food) return '';
          return `
            <div class="meal-item-row">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.25rem;">${food.icon}</span>
                <div>
                  <div class="meal-item-name">${food.name}</div>
                  <div class="meal-item-portion">${food.serving} • ${food.calories} kcal</div>
                </div>
              </div>
              <button type="button" class="btn-remove-item" data-slot="${slotKey}" data-index="${index}" title="Remove food">✕</button>
            </div>
          `;
        }).join('') + '</div>';
      });

      plateTotalFoodsCount.textContent = totalItemsCount + ' items logged today';

      // Wire remove buttons
      document.querySelectorAll('.btn-remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const slot = btn.dataset.slot;
          const idx = parseInt(btn.dataset.index, 10);
          state.plate[slot].splice(idx, 1);
          audio.playPop();
          renderPlateSlots();
          renderPlateTelemetry();
        });
      });
    }

    function renderPlateTelemetry() {
      const allFoodIds = [
        ...state.plate.breakfast,
        ...state.plate.lunch,
        ...state.plate.dinner,
        ...state.plate.snacks
      ];

      // Tally macros
      let totCals = 0, totProtein = 0, totFiber = 0, totFat = 0;
      const micronutrientTally = {};

      allFoodIds.forEach(id => {
        const f = FOODS_MAP.get(id);
        if (!f) return;
        totCals += f.calories;
        totProtein += f.protein;
        totFiber += f.fiber;
        totFat += f.fat;

        f.nutrients.forEach(n => {
          micronutrientTally[n.id] = (micronutrientTally[n.id] || 0) + n.pctDV;
        });
      });

      plateTotalCalories.textContent = Math.round(totCals) + ' kcal';
      plateTotalProtein.textContent = Math.round(totProtein) + ' g';
      plateTotalFiber.textContent = Math.round(totFiber) + ' g';
      plateTotalFat.textContent = Math.round(totFat) + ' g';

      // Key tracked micronutrients
      const trackedMeters = [
        { id: 'protein', name: 'Protein', pct: Math.round((totProtein / 56) * 100) },
        { id: 'fiber', name: 'Fiber', pct: Math.round((totFiber / 30) * 100) },
        { id: 'omega-3', name: 'Omega-3', pct: micronutrientTally['omega-3'] || 0 },
        { id: 'vitamin-c', name: 'Vitamin C', pct: micronutrientTally['vitamin-c'] || 0 },
        { id: 'vitamin-d', name: 'Vitamin D3', pct: micronutrientTally['vitamin-d'] || 0 },
        { id: 'vitamin-b12', name: 'Vitamin B12', pct: micronutrientTally['vitamin-b12'] || 0 },
        { id: 'calcium', name: 'Calcium', pct: micronutrientTally['calcium'] || 0 },
        { id: 'magnesium', name: 'Magnesium', pct: micronutrientTally['magnesium'] || 0 },
        { id: 'iron', name: 'Iron', pct: micronutrientTally['iron'] || 0 },
        { id: 'zinc', name: 'Zinc', pct: micronutrientTally['zinc'] || 0 }
      ];

      plateTelemetryMeters.innerHTML = trackedMeters.map(m => {
        const isOptimal = m.pct >= 100 && m.pct <= 200;
        const isExceeded = m.pct > 250;
        return `
          <div class="telemetry-meter-item">
            <div class="meter-header-row">
              <span class="meter-name">${m.name}</span>
              <span style="font-weight: 800; color: ${isOptimal ? 'var(--emerald-light)' : (isExceeded ? 'var(--rose-danger)' : 'var(--amber-light)')};">${m.pct}% DV</span>
            </div>
            <div class="meter-progress-track">
              <div class="meter-progress-fill ${isOptimal ? 'optimal' : ''} ${isExceeded ? 'exceeded' : ''}" style="width: ${Math.min(m.pct, 100)}%;"></div>
            </div>
          </div>
        `;
      }).join('');

      // Insights generator
      const gaps = trackedMeters.filter(m => m.pct < 50).map(m => m.name);
      if (allFoodIds.length === 0) {
        plateClinicalSummary.innerHTML = `
          <div class="summary-insight-card">
            <span class="insight-icon">🔍</span>
            <p class="insight-text">Your plate is empty. Add whole foods or select a preset to begin live dietary tracking.</p>
          </div>
        `;
      } else if (gaps.length > 0) {
        plateClinicalSummary.innerHTML = `
          <div class="summary-insight-card" style="border-color: rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.05);">
            <span class="insight-icon">⚠️</span>
            <p class="insight-text"><strong>Nutrient Gaps Detected (&lt;50% DV):</strong> ${gaps.join(', ')}. Consider adding foods rich in these nutrients to round out your day.</p>
          </div>
        `;
      } else {
        plateClinicalSummary.innerHTML = `
          <div class="summary-insight-card" style="border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.08);">
            <span class="insight-icon">🌟</span>
            <p class="insight-text" style="color: #a7f3d0;"><strong>Exceptional Nutrient Density!</strong> All essential micronutrient bars have crossed the 50% threshold, fueling your cellular mitochondria and antioxidant defenses.</p>
          </div>
        `;
      }
    }

    // Food Picker Modal wiring
    document.querySelectorAll('.btn-add-food-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        activeMealSlotTarget = btn.dataset.slot;
        foodPickerModalTitle.textContent = 'Add Whole Food to ' + activeMealSlotTarget.charAt(0).toUpperCase() + activeMealSlotTarget.slice(1);
        foodPickerSearchInput.value = '';
        renderFoodPickerOptions('');
        foodPickerModalBackdrop.classList.remove('hidden');
      });
    });

    function renderFoodPickerOptions(query = '') {
      const q = query.toLowerCase().trim();
      const filtered = FOODS_DATASET.filter(f => !q || f.name.toLowerCase().includes(q) || f.categoryName.toLowerCase().includes(q));

      foodPickerGrid.innerHTML = filtered.map(f => `
        <div class="picker-food-item" data-food-id="${f.id}">
          <img src="${f.imageUrl}" alt="${f.name}" class="picker-thumb-img" onerror="this.style.display='none';">
          <div>
            <div class="picker-item-name">${f.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${f.serving} • ${f.calories} kcal</div>
          </div>
        </div>
      `).join('');

      foodPickerGrid.querySelectorAll('.picker-food-item').forEach(item => {
        item.addEventListener('click', () => {
          state.plate[activeMealSlotTarget].push(item.dataset.foodId);
          audio.playPop();
          foodPickerModalBackdrop.classList.add('hidden');
          renderPlateSlots();
          renderPlateTelemetry();
        });
      });
    }

    foodPickerSearchInput.addEventListener('input', (e) => {
      renderFoodPickerOptions(e.target.value);
    });

    foodPickerCloseBtn.addEventListener('click', () => {
      foodPickerModalBackdrop.classList.add('hidden');
    });

    foodPickerModalBackdrop.addEventListener('click', (e) => {
      if (e.target === foodPickerModalBackdrop) {
        foodPickerModalBackdrop.classList.add('hidden');
      }
    });

    // Plate Presets
    btnSamplePlateMed.addEventListener('click', () => {
      state.plate = {
        breakfast: ['oats', 'walnuts', 'blueberries', 'greek-yogurt'],
        lunch: ['sardines', 'spinach', 'avocado', 'bell-pepper'],
        dinner: ['salmon', 'sweet-potato', 'broccoli'],
        snacks: ['almonds', 'dark-chocolate', 'orange']
      };
      audio.playSuccess();
      renderPlateSlots();
      renderPlateTelemetry();
    });

    btnSamplePlateVegan.addEventListener('click', () => {
      state.plate = {
        breakfast: ['oats', 'chia-seeds', 'banana', 'nutritional-yeast'],
        lunch: ['lentils', 'spinach', 'quinoa', 'bell-pepper'],
        dinner: ['tofu', 'kale', 'broccoli', 'sweet-potato'],
        snacks: ['pumpkin-seeds', 'brazil-nuts', 'blueberries']
      };
      audio.playSuccess();
      renderPlateSlots();
      renderPlateTelemetry();
    });

    btnClearPlate.addEventListener('click', () => {
      state.plate = { breakfast: [], lunch: [], dinner: [], snacks: [] };
      audio.playPop();
      renderPlateSlots();
      renderPlateTelemetry();
    });

    // ========================================================================
    // 14. RENDER VIEW 5: NUTRIENT SYNERGIES & "POWER PAIRS"
    // ========================================================================
    function renderSynergies() {
      powerPairsList.innerHTML = SYNERGIES_DATA.powerPairs.map(p => `
        <div class="synergy-card">
          <div class="synergy-card-top">
            <h4 class="synergy-pair-title">${p.title}</h4>
            <span class="synergy-effect-badge">${p.effect}</span>
          </div>
          <p class="synergy-desc">${p.mechanism}</p>
          <div class="synergy-food-example">🍽️ <strong>Plate Synergy:</strong> ${p.example}</div>
        </div>
      `).join('');

      blockersList.innerHTML = SYNERGIES_DATA.blockers.map(b => `
        <div class="synergy-card">
          <div class="synergy-card-top">
            <h4 class="synergy-pair-title">${b.title}</h4>
            <span class="synergy-effect-badge blocker">${b.effect}</span>
          </div>
          <p class="synergy-desc">${b.mechanism}</p>
          <div class="synergy-food-example" style="color: #fca5a5; background: rgba(244, 63, 94, 0.08);">⏳ <strong>Timing Advice:</strong> ${b.example}</div>
        </div>
      `).join('');
    }

    // ========================================================================
    // 15. RENDER VIEW 6: DEFICIENCY & SYMPTOM DIAGNOSTIC GUIDE
    // ========================================================================
    function renderSymptoms() {
      const cat = state.symptomFilter;
      const q = state.symptomSearch.toLowerCase().trim();

      const filtered = SYMPTOMS_DATASET.filter(s => {
        if (cat !== 'all' && s.category !== cat) return false;
        if (q) {
          const matchName = s.name.toLowerCase().includes(q);
          const matchDesc = s.desc.toLowerCase().includes(q);
          const matchFoods = s.foods.toLowerCase().includes(q);
          return matchName || matchDesc || matchFoods;
        }
        return true;
      });

      symptomCardsGrid.innerHTML = filtered.map(s => `
        <div class="symptom-card">
          <div class="symptom-header">
            <span class="symptom-icon">${s.icon}</span>
            <h4 class="symptom-name">${s.name}</h4>
          </div>
          <p class="symptom-desc">${s.desc}</p>
          <div class="symptom-deficiencies-wrap">
            <span class="symptom-deficiencies-lbl">Common Involved Nutrients</span>
            <div class="symptom-nutrients-chips">
              ${s.nutrients.map(nid => {
                const nut = NUTRIENTS_MAP.get(nid);
                return `<button type="button" class="nutrient-link-chip btn-trigger-nutrient-modal" data-nutrient-id="${nid}">${nut ? nut.name.split('(')[0].trim() : nid} ↗</button>`;
              }).join('')}
            </div>
          </div>
          <div class="symptom-foods-box">
            🥑 <strong>Target Whole Foods:</strong> ${s.foods}
          </div>
        </div>
      `).join('');
    }

    symptomCategoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        symptomCategoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.symptomFilter = pill.dataset.scat;
        renderSymptoms();
      });
    });

    symptomSearchInput.addEventListener('input', (e) => {
      state.symptomSearch = e.target.value;
      renderSymptoms();
    });

    // ========================================================================
    // 16. RENDER VIEW 7: CLINICAL NUTRITION QUIZ
    // ========================================================================
    function startQuiz(tier) {
      state.quiz.tier = tier;
      state.quiz.currentIdx = 0;
      state.quiz.score = 0;
      state.quiz.questions = [...QUIZ_QUESTIONS[tier]];
      audio.playPop();

      quizSetupScreen.classList.remove('active');
      quizResultsScreen.classList.remove('active');
      quizPlayScreen.classList.add('active');

      const tierNames = {
        beginner: 'Everyday Nutritionist (Level 1)',
        intermediate: 'Whole-Food Explorer (Level 2)',
        advanced: 'Clinical Biochemist (Level 3)'
      };
      quizTierLabel.textContent = tierNames[tier];
      renderQuizQuestion();
    }

    function renderQuizQuestion() {
      const qObj = state.quiz.questions[state.quiz.currentIdx];
      quizQuestionCounter.textContent = 'Question ' + (state.quiz.currentIdx + 1) + ' of ' + state.quiz.questions.length;
      quizScoreDisplay.textContent = 'Score: ' + state.quiz.score;
      quizQuestionText.textContent = qObj.q;
      quizFeedbackBox.style.display = 'none';

      quizOptionsList.innerHTML = qObj.options.map((opt, idx) => `
        <button type="button" class="quiz-opt-btn" data-opt-idx="${idx}">${opt}</button>
      `).join('');

      quizOptionsList.querySelectorAll('.quiz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedIdx = parseInt(btn.dataset.optIdx, 10);
          handleQuizAnswer(selectedIdx);
        });
      });
    }

    function handleQuizAnswer(selectedIdx) {
      const qObj = state.quiz.questions[state.quiz.currentIdx];
      const isCorrect = selectedIdx === qObj.ans;

      if (isCorrect) {
        state.quiz.score++;
        audio.playSuccess();
      } else {
        audio.playWrong();
      }

      quizScoreDisplay.textContent = 'Score: ' + state.quiz.score;

      // Disable all buttons and show colors
      quizOptionsList.querySelectorAll('.quiz-opt-btn').forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === qObj.ans) btn.classList.add('correct');
        if (idx === selectedIdx && !isCorrect) btn.classList.add('wrong');
      });

      quizExplanationText.innerHTML = (isCorrect ? '✅ <strong>Correct!</strong> ' : '❌ <strong>Incorrect.</strong> ') + qObj.exp;
      quizFeedbackBox.style.display = 'flex';
    }

    btnNextQuestion.addEventListener('click', () => {
      audio.playPop();
      state.quiz.currentIdx++;
      if (state.quiz.currentIdx < state.quiz.questions.length) {
        renderQuizQuestion();
      } else {
        showQuizResults();
      }
    });

    function showQuizResults() {
      quizPlayScreen.classList.remove('active');
      quizResultsScreen.classList.add('active');

      const total = state.quiz.questions.length;
      const score = state.quiz.score;
      const pct = Math.round((score / total) * 100);

      quizFinalScoreLine.textContent = 'You scored ' + score + ' out of ' + total + ' (' + pct + '%)';

      if (score === total) {
        audio.playSuccess();
        quizTrophyIcon.textContent = '🏆';
        quizFinalTitle.textContent = 'Flawless Master of Nutrition!';
        quizFinalComment.textContent = 'Outstanding! Your mastery of micronutrient biochemistry, daily requirements, and food sources is clinical grade.';
      } else if (score >= total * 0.6) {
        audio.playChime();
        quizTrophyIcon.textContent = '🥑';
        quizFinalTitle.textContent = 'Great Dietary Knowledge!';
        quizFinalComment.textContent = 'Well done! You have a solid grasp of human nutrition fundamentals. Review the taxonomy dossiers to hit 100%.';
      } else {
        quizTrophyIcon.textContent = '🌱';
        quizFinalTitle.textContent = 'Keep Growing Your Knowledge!';
        quizFinalComment.textContent = 'Human nutrition is a deep science. Explore the Whole Foods Catalog and Nutrient Taxonomy, then test your skills again!';
      }
    }

    document.querySelectorAll('.btn-start-tier').forEach(btn => {
      btn.addEventListener('click', () => startQuiz(btn.dataset.tier));
    });

    btnRestartQuiz.addEventListener('click', () => {
      quizResultsScreen.classList.remove('active');
      quizSetupScreen.classList.add('active');
    });

    // ========================================================================
    // 17. UNIVERSAL EVENT DELEGATION (ROBUST, FAIL-SAFE)
    // ========================================================================
    document.addEventListener('click', (e) => {
      // Nutrient card click
      const nutCard = e.target.closest('.nutrient-card');
      const nutLink = e.target.closest('.btn-trigger-nutrient-modal');
      const nutrientId = (nutCard && nutCard.dataset.nutrientId) || (nutLink && nutLink.dataset.nutrientId);
      if (nutrientId) {
        openNutrientModal(nutrientId);
        return;
      }

      // Food card click
      const foodCard = e.target.closest('.food-card');
      if (foodCard && foodCard.dataset.foodId) {
        openFoodModal(foodCard.dataset.foodId);
        return;
      }
    });

    // Keydown ESC to close modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        nutrientModalBackdrop.classList.add('hidden');
        foodModalBackdrop.classList.add('hidden');
        foodPickerModalBackdrop.classList.add('hidden');
      }
    });

    // ========================================================================
    // 18. INITIAL LOAD BOOTSTRAP
    // ========================================================================
    renderNutrients();
    renderFoods();
    calculatePersonalizedRDA();
    renderPlateSlots();
    renderPlateTelemetry();
    renderSynergies();
    renderSymptoms();
    console.log('[NutriGuide] Application initialized with 30+ nutrients and 60 whole foods.');

  });
})();
