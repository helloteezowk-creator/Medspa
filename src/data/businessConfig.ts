export interface ServiceItem {
  id: string;
  name: string;
  category: 'injectables' | 'laser' | 'skin' | 'body' | 'facials';
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  startingPrice: number;
  duration: string;
  downtime: string;
  idealFor: string[];
  popular?: boolean;
  image: string;
  benefits: string[];
}

export interface BusinessConfig {
  name: string;
  subName: string;
  headline: string;
  heroSubheadline: string;
  phone: string;
  phoneRaw: string;
  hours: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    state: string;
    zip: string;
    full: string;
  };
  stats: Array<{
    number: string;
    label: string;
    sublabel: string;
  }>;
  trustPillars: Array<{
    id: string;
    title: string;
    description: string;
    icon: 'award' | 'shield' | 'sparkles' | 'heartHandshake';
  }>;
  journeySteps: Array<{
    number: string;
    step: string;
    title: string;
    description: string;
  }>;
  services: ServiceItem[];
  technologies: Array<{
    name: string;
    purpose: string;
    description: string;
    clearance: string;
  }>;
  testimonials: Array<{
    name: string;
    location: string;
    treatment: string;
    quote: string;
    rating: number;
    date: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
    category: string;
  }>;
}

export const businessConfig: BusinessConfig = {
  name: 'LUMINA',
  subName: 'MEDICAL SPA',
  headline: 'DISCOVER A MORE CONFIDENT YOU',
  heroSubheadline: 'Experience personalized aesthetic treatments and advanced skincare solutions designed around your natural beauty goals.',
  phone: '+1 (800) 555-0199',
  phoneRaw: 'tel:+18005550199',
  hours: 'Mon – Sat: 9:00 AM – 8:00 PM',
  email: 'concierge@luminamedspa.com',
  address: {
    street: '9601 Wilshire Boulevard',
    suite: 'Suite 420',
    city: 'Beverly Hills',
    state: 'CA',
    zip: '90210',
    full: '9601 Wilshire Blvd, Suite 420, Beverly Hills, CA 90210',
  },
  stats: [
    { number: '12+', label: 'Years of Practice', sublabel: 'Clinical leadership' },
    { number: '25,000+', label: 'Satisfied Patients', sublabel: 'Natural, refined outcomes' },
    { number: '20+', label: 'Licensed Clinicians', sublabel: 'Board-certified medical team' },
  ],
  trustPillars: [
    {
      id: 'specialists',
      title: 'Expert Medical Clinicians',
      description: 'Physician-supervised practitioners with specialized training in aesthetic medicine.',
      icon: 'award',
    },
    {
      id: 'safety',
      title: 'FDA-Cleared Safety Standards',
      description: 'Medical-grade sterile suites, certified equipment, and authentic authentic injectables.',
      icon: 'shield',
    },
    {
      id: 'custom',
      title: 'Individualized Treatment Plans',
      description: 'Comprehensive facial mapping and protocols tailored to your unique anatomical goals.',
      icon: 'sparkles',
    },
    {
      id: 'comfort',
      title: 'Discretion & Boutique Luxury',
      description: 'Private concierge care in serene suites designed for ultimate relaxation.',
      icon: 'heartHandshake',
    },
  ],
  journeySteps: [
    {
      number: '01',
      step: 'Consultation',
      title: 'Comprehensive Skin & Facial Analysis',
      description: 'We evaluate your skin health, facial balance, and personal goals using advanced diagnostic mapping.',
    },
    {
      number: '02',
      step: 'Planning',
      title: 'Personalized Treatment Mapping',
      description: 'Your clinician designs a tailored protocol balancing immediate radiance with long-term collagen stimulation.',
    },
    {
      number: '03',
      step: 'Treatment',
      title: 'Gentle Clinical Application',
      description: 'Delivered in serene, private treatment suites with medical precision and prioritized comfort.',
    },
    {
      number: '04',
      step: 'Results',
      title: 'Sustained Glow & Aftercare Regimen',
      description: 'Personalized home regimens and scheduled follow-ups to preserve and enhance your natural results.',
    },
  ],
  services: [
    {
      id: 'hydrafacial',
      name: 'Hydrafacial Treatments',
      category: 'facials',
      categoryLabel: 'Facial Wellness',
      shortDescription: 'Patented vortex-fusion technology for deep pore cleansing, exfoliation, extraction, and intensive antioxidant hydration.',
      fullDescription: 'Hydrafacial uses a three-step medical approach to cleanse, extract, and hydrate the skin with nourishing serums that create an instant, dewy radiance without irritation or downtime.',
      startingPrice: 225,
      duration: '45–60 mins',
      downtime: 'Zero downtime',
      idealFor: ['Enlarged pores', 'Dull complexion', 'Fine dehydration lines', 'Uneven texture'],
      popular: true,
      image: '/src/assets/images/treatment_hydrafacial_glow_1794044958347.jpg',
      benefits: ['Instant skin illumination', 'Painless blackhead extraction', 'Deep antioxidant nourishment', 'Safe for all skin types'],
    },
    {
      id: 'botox-injectables',
      name: 'Botox & Injectable Treatments',
      category: 'injectables',
      categoryLabel: 'Injectable Aesthetics',
      shortDescription: 'Precision neuromodulators to smooth dynamic forehead lines, crow’s feet, and frown lines while preserving natural expression.',
      fullDescription: 'Our licensed injectors deliver subtle, measured neuromodulators (Botox®, Dysport®, Daxxify®) to soften wrinkles and lift facial contours while keeping your natural expressions vibrant and balanced.',
      startingPrice: 350,
      duration: '30 mins',
      downtime: 'Immediate return to normal day',
      idealFor: ['Forehead furrows', 'Glabellar frown lines', 'Crow’s feet', 'Jaw slimming (masseter)'],
      popular: true,
      image: '/src/assets/images/treatment_injectable_aesthetics_1794044956255.jpg',
      benefits: ['Smoother expression lines', 'Prevents deep wrinkle etching', 'Preserves natural movement', 'Results last 3–4 months'],
    },
    {
      id: 'skin-rejuvenation',
      name: 'Skin Rejuvenation & Resurfacing',
      category: 'laser',
      categoryLabel: 'Laser & Energy',
      shortDescription: 'Advanced fractional phototherapy to stimulate deep dermal collagen, refine skin texture, and restore youthful elasticity.',
      fullDescription: 'Clinical skin rejuvenation pairs targeted light and thermal pulses to trigger the body’s natural regenerative healing, smoothing texture and promoting long-term collagen remodeling.',
      startingPrice: 450,
      duration: '60 mins',
      downtime: '1–2 days mild pinkness',
      idealFor: ['Collagen loss', 'Sun damage', 'Rough skin texture', 'Fine perioral lines'],
      popular: true,
      image: '/src/assets/images/treatment_laser_rejuvenation_1794044956801.jpg',
      benefits: ['Stimulates neocollagenesis', 'Evens skin tone and clarity', 'Tightens pore appearance', 'Restores natural bounce'],
    },
    {
      id: 'body-contouring',
      name: 'Body Contouring & Sculpting',
      category: 'body',
      categoryLabel: 'Body & Contouring',
      shortDescription: 'Non-invasive cryolipolysis and radiofrequency body sculpting to target stubborn localized fat pockets and tone contours.',
      fullDescription: 'Safe, non-surgical body contouring shapes and refines stubborn areas such as the abdomen, flanks, arms, and thighs without incisions, anesthesia, or downtime.',
      startingPrice: 750,
      duration: '60–90 mins',
      downtime: 'Zero downtime',
      idealFor: ['Abdomen & love handles', 'Inner/outer thighs', 'Submental chin fat', 'Upper arms'],
      popular: true,
      image: '/src/assets/images/treatment_body_contouring_1794044977358.jpg',
      benefits: ['Non-surgical fat reduction', 'Noticeable inch loss', 'Tightens adjacent skin', 'Permanent fat cell elimination'],
    },
    {
      id: 'dermal-fillers',
      name: 'Dermal Fillers',
      category: 'injectables',
      categoryLabel: 'Injectable Aesthetics',
      shortDescription: 'Hyaluronic acid formulations to restore midface volume, define the jawline, and hydrate and contour lips naturally.',
      fullDescription: 'Premium hyaluronic acid gels (Juvéderm®, Restylane®) artfully placed to enhance cheek structure, soften nasolabial folds, and shape balanced lips with soft, harmonious volume.',
      startingPrice: 650,
      duration: '45 mins',
      downtime: 'Minor swelling (24–48h)',
      idealFor: ['Hollow cheeks', 'Thinning lips', 'Under-eye hollows', 'Receded jawline'],
      benefits: ['Instant subtle volume', 'Reversible and safe', 'Promotes dermal hydration', 'Results last 9–18 months'],
      image: '/src/assets/images/treatment_injectable_aesthetics_1794044956255.jpg',
    },
    {
      id: 'laser-hair-removal',
      name: 'Laser Hair Removal',
      category: 'laser',
      categoryLabel: 'Laser & Energy',
      shortDescription: 'Medical dual-wavelength diode and Alexandrite lasers for comfortable, permanent hair reduction across all skin tones.',
      fullDescription: 'State-of-the-art contact cooling technology delivers fast, comfortable hair follicle reduction suitable for face, legs, underarms, back, and bikini areas.',
      startingPrice: 150,
      duration: '20–45 mins',
      downtime: 'Zero downtime',
      idealFor: ['Unwanted hair growth', 'Ingrown hairs & razor bumps', 'Smooth long-term maintenance'],
      benefits: ['Up to 90% permanent hair reduction', 'Built-in chill tip cooling', 'Safe across Fitzpatrick skin types I–VI', 'Softens skin texture'],
      image: '/src/assets/images/treatment_laser_rejuvenation_1794044956801.jpg',
    },
    {
      id: 'microneedling',
      name: 'Microneedling (Collagen Induction)',
      category: 'skin',
      categoryLabel: 'Skin Rejuvenation',
      shortDescription: 'Automated micro-punctures to activate the body’s healing cascade, smoothing acne scars, pores, and fine lines.',
      fullDescription: 'Precision medical microneedling creates micro-channels that stimulate collagen and elastin synthesis. Can be paired with growth factors or hyaluronic acid infusions.',
      startingPrice: 375,
      duration: '60 mins',
      downtime: '24 hours mild redness',
      idealFor: ['Acne scarring', 'Pore texture', 'Fine lines', 'Stretch marks'],
      benefits: ['Dramatically refines scar tissue', 'Enhances product absorption by 300%', 'Safe all year round', 'Improves skin thickness'],
      image: '/src/assets/images/treatment_hydrafacial_glow_1794044958347.jpg',
    },
    {
      id: 'chemical-peels',
      name: 'Medical Chemical Peels',
      category: 'skin',
      categoryLabel: 'Skin Rejuvenation',
      shortDescription: 'Custom glycolic, lactic, salicylic, and TCA peels to shed damaged outer layers and reveal glowing new skin.',
      fullDescription: 'Formulated to target sun spots, uneven tone, fine lines, and active congestion. Tailored in strength from gentle lunchtime peels to deeper corrective resurfacing.',
      startingPrice: 195,
      duration: '40 mins',
      downtime: '1–4 days subtle flaking',
      idealFor: ['Melasma & hyperpigmentation', 'Sun spots', 'Rough dull skin', 'Congested acneic skin'],
      benefits: ['Fast radiant turnaround', 'Dissolves dead cellular buildup', 'Reduces pigment clusters', 'Smoothes superficial lines'],
      image: '/src/assets/images/promo_macro_radiance_1794044958044.jpg',
    },
    {
      id: 'skin-tightening',
      name: 'RF Skin Tightening',
      category: 'body',
      categoryLabel: 'Body & Contouring',
      shortDescription: 'Deep thermal radiofrequency to contract lax collagen fibers and stimulate new structural elastin in face and neck.',
      fullDescription: 'Non-surgical radiofrequency heating firms loose skin along the jawline, submental neck, abdomen, and knees without surgical recovery.',
      startingPrice: 500,
      duration: '60 mins',
      downtime: 'Zero downtime',
      idealFor: ['Mild jowling', 'Neck laxity', 'Post-pregnancy skin slack', 'Crepey skin around eyes'],
      benefits: ['Lifts and firms contours', 'Non-invasive and comfortable', 'Gradual natural tightening over 90 days', 'Pairs well with microneedling'],
      image: '/src/assets/images/treatment_body_contouring_1794044977358.jpg',
    },
    {
      id: 'acne-treatments',
      name: 'Clinical Acne Treatments',
      category: 'skin',
      categoryLabel: 'Skin Rejuvenation',
      shortDescription: 'Comprehensive protocols combining medical extractions, high-frequency antibacterial therapy, and blue light phototherapy.',
      fullDescription: 'An individualized clinical approach targeting the root drivers of active breakouts, sebum overproduction, and post-inflammatory erythema.',
      startingPrice: 180,
      duration: '50 mins',
      downtime: 'Zero downtime',
      idealFor: ['Adult acne', 'Hormonal cystic breakouts', 'Congested comedones', 'Post-acne red marks'],
      benefits: ['Eliminates acne-causing bacteria', 'Soothes systemic inflammation', 'Unclogs deep micro-comedones', 'Prevents recurring scarring'],
      image: '/src/assets/images/treatment_hydrafacial_glow_1794044958347.jpg',
    },
    {
      id: 'anti-aging-treatments',
      name: 'Anti-Aging Medical Facials',
      category: 'facials',
      categoryLabel: 'Facial Wellness',
      shortDescription: 'Peptide infusions, microcurrent facial toning, and medical cryo-therapy to revitalize mature, fatigued skin.',
      fullDescription: 'A multi-modal facial combining targeted ultrasonic infusion, dynamic microcurrent muscle stimulation, and high-concentration bio-peptides.',
      startingPrice: 260,
      duration: '75 mins',
      downtime: 'Zero downtime',
      idealFor: ['Tired, mature skin', 'Loss of facial tone', 'Deep dryness', 'Pre-event rejuvenation'],
      benefits: ['Immediate lifted contour effect', 'Boosts cellular ATP synthesis', 'Intensely plumps and hydrates', 'Gentle and deeply relaxing'],
      image: '/src/assets/images/promo_macro_radiance_1794044958044.jpg',
    },
    {
      id: 'facial-treatments',
      name: 'Custom Signature Facials',
      category: 'facials',
      categoryLabel: 'Facial Wellness',
      shortDescription: 'Bespoke clinical facial designed around your skin’s real-time moisture barrier, seasonal stressors, and sensitivity.',
      fullDescription: 'Your master aesthetician blends organic botanicals and medical-grade actives with lymphatic drainage and sculpting massage.',
      startingPrice: 185,
      duration: '60 mins',
      downtime: 'Zero downtime',
      idealFor: ['Sensitive skin', 'Seasonal dehydration', 'Skin barrier repair', 'Stress relief'],
      benefits: ['Restores moisture barrier', 'Promotes lymphatic detoxification', 'Customized active ingredients', 'Instant dewy glow'],
      image: '/src/assets/images/treatment_hydrafacial_glow_1794044958347.jpg',
    },
    {
      id: 'pigmentation-treatments',
      name: 'Pigmentation & Melasma Therapy',
      category: 'laser',
      categoryLabel: 'Laser & Energy',
      shortDescription: 'Targeted broad-band light (BBL) and pigment-specific wavelengths to break down sun spots, freckles, and melasma patches.',
      fullDescription: 'Advanced photothermal energy selectively shatters stubborn melanin deposits, allowing natural exfoliation to clear discoloration without damaging healthy surrounding tissue.',
      startingPrice: 400,
      duration: '45 mins',
      downtime: '2–3 days micro-crusting',
      idealFor: ['Stubborn dark spots', 'Melasma', 'Freckling', 'Photo-aging on face, neck, chest'],
      benefits: ['Clears chronic hyperpigmentation', 'Even, luminous complexion', 'Reverses visible sun damage', 'Precise melanin-targeting'],
      image: '/src/assets/images/treatment_laser_rejuvenation_1794044956801.jpg',
    },
    {
      id: 'laser-skin-treatments',
      name: 'Laser Skin Treatments (BBL & Halo)',
      category: 'laser',
      categoryLabel: 'Laser & Energy',
      shortDescription: 'Hybrid fractional laser therapy delivering both ablative and non-ablative wavelengths for dramatic clarity and glow.',
      fullDescription: 'Halo™ and BBL™ laser therapy targets both deep dermal damage and superficial tone irregularities simultaneously, delivering radiant luminosity with minimal recovery.',
      startingPrice: 650,
      duration: '75 mins',
      downtime: '3–4 days bronzing',
      idealFor: ['Deep textural irregularities', 'Enlarged pores', 'Pigment combined with fine lines', 'Overall skin renewal'],
      benefits: ['Synergistic hybrid wavelength precision', 'Dramatic glow and clarity', 'Long-lasting collagen renewal', 'Customizable intensity'],
      image: '/src/assets/images/treatment_laser_rejuvenation_1794044956801.jpg',
    },
  ],
  technologies: [
    {
      name: 'Sciton® BBL HERO™ & Halo',
      purpose: 'Advanced Phototherapy & Hybrid Resurfacing',
      description: 'World-renowned photothermal technology capable of treating pigment, redness, and texture 4x faster with unmatched clinical safety.',
      clearance: 'FDA-Cleared Class II Medical Device',
    },
    {
      name: 'Hydrafacial® Syndeo™ Elite',
      purpose: 'Vortex-Fusion Skin Renewal',
      description: 'Digitally connected clinical platform providing non-invasive hydradermabrasion, vortex extractions, and targeted booster infusions.',
      clearance: 'Patented Medical Technology',
    },
    {
      name: 'Morpheus8™ Fractional RF',
      purpose: 'Deep Subdermal Adipose Remodeling',
      description: 'Combines microneedling with fractional radiofrequency energy to remodel dermal collagen up to 4mm deep.',
      clearance: 'FDA-Cleared Aesthetic System',
    },
    {
      name: 'Candela® GentleMax Pro Plus',
      purpose: 'Dual-Wavelength Laser Hair & Pigment',
      description: 'Gold-standard 755nm Alexandrite and 1064nm Nd:YAG laser with Dynamic Cooling Device (DCD) for maximum client comfort.',
      clearance: 'FDA-Cleared Medical Laser',
    },
  ],
  testimonials: [
    {
      name: 'Catherine R.',
      location: 'Beverly Hills, CA',
      treatment: 'BBL Laser Rejuvenation & Hydrafacial',
      quote: 'The clinicians at Lumina approach aesthetic treatments with the discernment of artists and the rigor of doctors. My sun damage is completely gone, and my skin has never looked more vibrant.',
      rating: 5,
      date: 'October 2026',
    },
    {
      name: 'Julian M.',
      location: 'West Hollywood, CA',
      treatment: 'Botox & Jawline Contouring',
      quote: 'I wanted subtle, natural refinement that didn’t look frozen or overworked. The team listened to every detail and achieved exactly what I hoped for. Immaculate private suites.',
      rating: 5,
      date: 'September 2026',
    },
    {
      name: 'Elena S.',
      location: 'Santa Monica, CA',
      treatment: 'RF Skin Tightening & Microneedling',
      quote: 'From the initial 3D skin analysis to the post-care check-in, the experience was five-star concierge. My skin firmness and clarity improved remarkably in just 6 weeks.',
      rating: 5,
      date: 'August 2026',
    },
    {
      name: 'Victoria K.',
      location: 'Brentwood, CA',
      treatment: 'InfraBaldan 3.0 Infrared Slimming Pod',
      quote: 'The InfraBaldan pod is genuinely revolutionary. In 8 comfortable sessions under the infrared canopy, I noticed significant toning in my core and hips with zero fatigue or recovery time.',
      rating: 5,
      date: 'October 2026',
    },
    {
      name: 'Dr. David C.',
      location: 'Newport Beach, CA',
      treatment: 'Tear Trough & Midface Hyaluronic Filler',
      quote: 'As a physician myself, I hold aesthetic injectors to the highest clinical standard. The anatomical knowledge and conservative dosing at Lumina is truly best-in-class.',
      rating: 5,
      date: 'September 2026',
    },
    {
      name: 'Maya T.',
      location: 'Pacific Palisades, CA',
      treatment: 'Clinical Acne Protocol & Chemical Peel',
      quote: 'I struggled with cystic breakouts for three years before coming here. Their combination of deep medical extractions and gentle peels transformed my skin without irritation.',
      rating: 5,
      date: 'July 2026',
    },
    {
      name: 'Olivia P.',
      location: 'Malibu, CA',
      treatment: 'TriLaser Permanent Hair Removal',
      quote: 'Completely painless thanks to the chill-tip handpiece. After just four sessions, I had virtually zero regrowth. The clinical staff made me feel so comfortable and valued.',
      rating: 5,
      date: 'June 2026',
    },
    {
      name: 'Sophia L.',
      location: 'Bel Air, CA',
      treatment: 'Custom Signature Facial & Peptide Infusion',
      quote: 'My go-to treatment before red carpet and gala events. The signature facial leaves my skin plumper, dewy, and camera-ready with zero redness. Pure luxury.',
      rating: 5,
      date: 'May 2026',
    },
  ],
  faqs: [
    {
      question: 'What happens during my initial consultation?',
      answer: 'Your consultation begins with a detailed medical history intake and multi-spectral digital skin analysis. Your clinician examines your facial structure, discusses your aesthetic goals and timeline, and creates a transparent, personalized protocol with zero sales pressure.',
      category: 'General',
    },
    {
      question: 'How do you ensure results look natural and not "overdone"?',
      answer: 'Our foundational philosophy is "natural harmony." We utilize conservative dosing, anatomical precision, and micro-aliquot injection techniques designed to enhance your existing features rather than alter your natural identity.',
      category: 'Injectables',
    },
    {
      question: 'Can I combine multiple treatments in one visit?',
      answer: 'Yes! Many of our patients pair Hydrafacial or gentle laser treatments with neuromodulators or microneedling. During your assessment, your clinician will determine safe same-day combinations to minimize visits and optimize healing.',
      category: 'Treatments',
    },
    {
      question: 'Do you offer patient financing or treatment packages?',
      answer: 'We provide flexible 0% APR financing options through CareCredit® and Cherry®, allowing you to divide treatment plans into comfortable monthly installments. We also offer curated treatment series with savings.',
      category: 'Pricing',
    },
  ],
};
