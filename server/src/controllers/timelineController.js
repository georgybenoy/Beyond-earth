import { seedStore } from '../data/seedStore.js';

// Curated educational contexts for the pivotal landmark milestones
const MAJOR_MILESTONES = {
  'apollo-11-lm:1969-07-20:LANDING': {
    is_major: true,
    educational_context: "First human boots and robotic guidance systems safely touched down on another planetary body, leaving the descent stage as a permanent monument.",
    highlight_label: "Apollo 11 Lunar Touchdown"
  },
  'apollo-11-lm:1969-07-21:MILESTONE': {
    is_major: true,
    educational_context: "Neil Armstrong and Buzz Aldrin deployed the Early Apollo Scientific Experiments Package (EASEP) on the lunar regolith.",
    highlight_label: "First Steps & Instruments on the Moon"
  },
  'viking-1:1976-07-20:LANDING': {
    is_major: true,
    educational_context: "The first successful long-duration operational lander on Mars, beaming back the first sharp panoramas of red Martian plains.",
    highlight_label: "First Touchdown on Mars"
  },
  'voyager-1:1979-03-05:FLYBY': {
    is_major: true,
    educational_context: "Voyager 1 flew through the Jovian system, discovering active sulfur volcanoes on moon Io and fine dust rings around Jupiter.",
    highlight_label: "Discovery of Active Alien Volcanoes"
  },
  'voyager-2:1986-01-24:FLYBY': {
    is_major: true,
    educational_context: "The only spacecraft in human history to visit Uranus, discovering 10 new moons, 2 rings, and a violently tilted magnetic field.",
    highlight_label: "Sole Reconnaissance of Uranus"
  },
  'voyager-2:1989-08-25:FLYBY': {
    is_major: true,
    educational_context: "Humanity's first and only close look at deep-blue Neptune and cryovolcanic moon Triton, which features active nitrogen geysers.",
    highlight_label: "Neptune & Triton Encounter"
  },
  'voyager-1:1990-02-14:MILESTONE': {
    is_major: true,
    educational_context: "Turned cameras around at 6 billion km to capture Earth as a single speck of blue dust suspended in a sunbeam — the 'Pale Blue Dot'.",
    highlight_label: "The Iconic 'Pale Blue Dot'"
  },
  'voyager-1:2012-08-25:DISCOVERY': {
    is_major: true,
    educational_context: "First human machine to leave the solar bubble and cross into the interstellar medium, bathed in unshielded galactic cosmic rays.",
    highlight_label: "Voyager Crosses into Interstellar Space"
  },
  'hubble:1990-04-24:LAUNCH': {
    is_major: true,
    educational_context: "Launched aboard Space Shuttle Discovery, putting humanity's flagship optical observatory above Earth's blurring atmosphere.",
    highlight_label: "Hubble Space Telescope Deployment"
  },
  'hubble:1995-12-18:DISCOVERY': {
    is_major: true,
    educational_context: "Pointed at a seemingly empty patch of sky for 10 consecutive days, revealing over 3,000 previously invisible ancient galaxies.",
    highlight_label: "The Hubble Deep Field Revelation"
  },
  'opportunity:2004-01-25:LANDING': {
    is_major: true,
    educational_context: "Bounced to rest inside Eagle Crater and discovered hematite 'blueberries', cementing proof that liquid water once drenched Mars.",
    highlight_label: "Opportunity Mars Landing & Water Proof"
  },
  'curiosity:2012-08-06:LANDING': {
    is_major: true,
    educational_context: "Pioneered the rocket-powered sky crane maneuver to land a one-ton robotic laboratory, proving Gale Crater held ancient freshwater lakes.",
    highlight_label: "Curiosity Sky Crane Touchdown"
  },
  'new-horizons:2015-07-14:FLYBY': {
    is_major: true,
    educational_context: "Completed the preliminary reconnaissance of the classical solar system, revealing Pluto's vast nitrogen-ice heart and ice mountains.",
    highlight_label: "Historic Pluto & Charon Flyby"
  },
  'juno:2016-07-04:ORBIT_INSERTION': {
    is_major: true,
    educational_context: "First solar-powered probe at Jupiter, diving beneath murderous radiation belts to uncover Jupiter's deep atmospheric roots and magnetic dynamo.",
    highlight_label: "Juno Jupiter Polar Insertion"
  },
  'parker-solar-probe:2021-04-28:DISCOVERY': {
    is_major: true,
    educational_context: "First human machine to fly directly through the Sun's corona, crossing the Alfvén critical surface where solar wind is born.",
    highlight_label: "First Spacecraft to 'Touch the Sun'"
  },
  'perseverance:2021-02-18:LANDING': {
    is_major: true,
    educational_context: "Safely set down in ancient Jezero Crater lakebed to seek signs of past microbial life and cache hermetically sealed rock cores.",
    highlight_label: "Perseverance Rover Jezero Landing"
  },
  'perseverance:2021-04-19:MILESTONE': {
    is_major: true,
    educational_context: "Ingenuity helicopter achieved humanity's first powered, controlled flight on another planet — an extraterrestrial Wright Brothers moment.",
    highlight_label: "Ingenuity's Historic First Flight"
  }
};

export const getTimelineMilestones = (req, res, next) => {
  try {
    const { 
      era, 
      event_type, 
      hardware_slug, 
      destination, 
      category, 
      mission_type, 
      search, 
      major_only, 
      sort = 'asc' 
    } = req.query;

    const hardwareList = seedStore.getRawHardware();
    const destMap = seedStore.getDestMap();

    // Aggregate all milestones across all hardware missions
    let milestones = [];
    hardwareList.forEach(h => {
      if (h.milestones && Array.isArray(h.milestones)) {
        h.milestones.forEach((m, idx) => {
          const key = `${h.slug}:${m.date}:${m.event_type}`;
          const majorMeta = MAJOR_MILESTONES[key] || null;

          milestones.push({
            id: `${h.slug}-${m.date}-${idx}`,
            date: m.date,
            title: m.title,
            description: m.description,
            event_type: m.event_type,
            hardware_slug: h.slug,
            hardware_name: h.name,
            hardware_category: h.category,
            hardware_image: h.image_url,
            hardware_attribution: h.image_attribution || 'NASA / JPL-Caltech',
            operational_status: h.operational_status,
            launch_date: h.launch_date,
            launch_vehicle: h.launch_vehicle,
            power_source: h.power_source,
            mass_kg: h.mass_kg,
            destination_slug: h.destination_slug,
            destination_name: destMap[h.destination_slug] || h.destination_slug,
            nssdca_id: h.nssdca_id || null,
            sources: h.sources || [],
            is_major_milestone: !!majorMeta,
            highlight_label: majorMeta?.highlight_label || null,
            educational_context: majorMeta?.educational_context || m.description
          });
        });
      }
    });

    // Filter by hardware slug
    if (hardware_slug) {
      milestones = milestones.filter(m => m.hardware_slug.toLowerCase() === hardware_slug.toLowerCase());
    }

    // Filter by destination slug
    if (destination) {
      milestones = milestones.filter(m => m.destination_slug.toLowerCase() === destination.toLowerCase());
    }

    // Filter by mission category / type (ROVER, LANDER, ORBITER, DEEP_SPACE_PROBE, SPACE_TELESCOPE)
    const effectiveCategory = category || mission_type;
    if (effectiveCategory) {
      milestones = milestones.filter(m => m.hardware_category.toLowerCase() === effectiveCategory.toLowerCase());
    }

    // Filter by event type (LAUNCH, LANDING, FLYBY, ORBIT_INSERTION, DISCOVERY, FINAL_SIGNAL, MILESTONE)
    if (event_type) {
      milestones = milestones.filter(m => m.event_type.toLowerCase() === event_type.toLowerCase());
    }

    // Filter for major landmark highlights only
    if (major_only === 'true') {
      milestones = milestones.filter(m => m.is_major_milestone === true);
    }

    // Filter by decade/era
    if (era) {
      milestones = milestones.filter(m => {
        const year = parseInt(m.date.split('-')[0], 10);
        if (era === '1960s') return year >= 1960 && year < 1970;
        if (era === '1970s') return year >= 1970 && year < 1980;
        if (era === '1980s') return year >= 1980 && year < 1990;
        if (era === '1990s') return year >= 1990 && year < 2000;
        if (era === '2000s') return year >= 2000 && year < 2010;
        if (era === '2010s') return year >= 2010 && year < 2020;
        if (era === '2020s') return year >= 2020;
        return true;
      });
    }

    // Full text search
    if (search) {
      const q = search.toLowerCase();
      milestones = milestones.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.hardware_name.toLowerCase().includes(q) ||
        m.destination_name.toLowerCase().includes(q)
      );
    }

    // Sort chronologically
    milestones.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sort.toLowerCase() === 'desc' ? dateB - dateA : dateA - dateB;
    });

    res.json({
      success: true,
      data: milestones,
      meta: {
        total: milestones.length,
        major_milestones_count: milestones.filter(m => m.is_major_milestone).length,
        filtersApplied: { era, event_type, hardware_slug, destination, category: effectiveCategory, search, sort }
      }
    });
  } catch (error) {
    next(error);
  }
};
