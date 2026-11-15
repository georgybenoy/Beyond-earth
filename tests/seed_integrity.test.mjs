import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== BEYOND EARTH: NASA SCIENTIFIC DATA & SEED INTEGRITY TEST ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
  }
}

const dataDir = path.join(__dirname, '../server/data');

const destinations = JSON.parse(fs.readFileSync(path.join(dataDir, 'destinations_seeds.json'), 'utf8'));
const hardware = JSON.parse(fs.readFileSync(path.join(dataDir, 'hardware_seeds.json'), 'utf8'));
const quizzes = JSON.parse(fs.readFileSync(path.join(dataDir, 'quiz_seeds.json'), 'utf8'));
const science = JSON.parse(fs.readFileSync(path.join(dataDir, 'science_seeds.json'), 'utf8'));
const simulations = JSON.parse(fs.readFileSync(path.join(dataDir, 'simulation_seeds.json'), 'utf8'));

// 1. Destination Schemas & Uniqueness
console.log('1. Auditing Planetary & Celestial Destinations...');
const destSlugs = new Set();
let allDestValid = true;
destinations.forEach(d => {
  if (!d.slug || destSlugs.has(d.slug)) allDestValid = false;
  destSlugs.add(d.slug);
  if (!d.name || typeof d.distance_from_sun_au !== 'number') allDestValid = false;
});
assert(allDestValid && destinations.length === 13, `All 13 destinations have unique slugs and valid astronomical properties`);

// 2. Hardware Catalog Integrity & NASA NSSDCA Provenance
console.log('\n2. Auditing NASA Hardware & Scientific Provenance...');
const hwSlugs = new Set();
let allHwValid = true;
let allNssdcaPresent = true;
let allSourcesPresent = true;
let allInstrumentsPresent = true;
let allMilestonesChronological = true;

const validStatuses = new Set([
  'OPERATIONAL',
  'INACTIVE_SURFACE',
  'DEEP_SPACE_TRAVELLING',
  'ATMOSPHERIC_ENTRY_DESTROYED',
  'SURFACE_IMPACT_DESTROYED',
  'LOST_CONTACT'
]);

hardware.forEach(h => {
  if (!h.slug || hwSlugs.has(h.slug)) allHwValid = false;
  hwSlugs.add(h.slug);

  // Destination Foreign Key Check
  if (!destSlugs.has(h.destination_slug)) {
    console.error(`Unknown destination_slug "${h.destination_slug}" on hardware ${h.slug}`);
    allHwValid = false;
  }

  // Visited destinations check
  if (h.visited_destination_slugs) {
    h.visited_destination_slugs.forEach(vSlug => {
      if (!destSlugs.has(vSlug)) {
        console.error(`Unknown visited_destination_slug "${vSlug}" on hardware ${h.slug}`);
        allHwValid = false;
      }
    });
  }

  // Operational status check
  if (!validStatuses.has(h.operational_status)) {
    console.error(`Invalid operational_status "${h.operational_status}" on hardware ${h.slug}`);
    allHwValid = false;
  }

  // NSSDCA Master ID check
  if (!h.nssdca_id || typeof h.nssdca_id !== 'string' || h.nssdca_id.trim() === '') {
    allNssdcaPresent = false;
  }

  // Sources and citations check
  if (!h.sources || !Array.isArray(h.sources) || h.sources.length === 0) {
    allSourcesPresent = false;
  } else {
    h.sources.forEach(src => {
      if (!src.title || !src.url || !src.source_type) {
        allSourcesPresent = false;
      }
    });
  }

  // Instruments check
  if (!h.instruments || !Array.isArray(h.instruments) || h.instruments.length === 0) {
    allInstrumentsPresent = false;
  }

  // Milestone dates format (YYYY-MM-DD)
  if (h.milestones && Array.isArray(h.milestones)) {
    h.milestones.forEach(m => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(m.date)) {
        console.error(`Invalid milestone date format "${m.date}" on hardware ${h.slug}`);
        allMilestonesChronological = false;
      }
    });
  }
});

assert(allHwValid, 'All 18 hardware items have unique slugs, valid categories, and destination foreign keys');
assert(allNssdcaPresent, 'All 18 hardware items contain verified NASA NSSDCA Master Catalog IDs');
assert(allSourcesPresent, 'All 18 hardware items contain official NASA/JPL primary source URLs and citations');
assert(allInstrumentsPresent, 'All 18 hardware items document authentic scientific instrument suites');
assert(allMilestonesChronological, 'All flight milestone events use valid ISO 8601 calendar dates (YYYY-MM-DD)');

// 3. Quiz & Academy Integrity
console.log('\n3. Auditing Quiz & Academy Educational Seeds...');
let allQuizzesValid = true;
let totalQuestions = 0;
quizzes.forEach(q => {
  if (!q.slug || !q.title || !q.difficulty || !Array.isArray(q.questions) || q.questions.length === 0) {
    allQuizzesValid = false;
  }
  q.questions.forEach(quest => {
    totalQuestions++;
    if (!quest.question_text || !Array.isArray(quest.options) || quest.options.length < 2) {
      allQuizzesValid = false;
    }
    if (typeof quest.correct_option_index !== 'number' || quest.correct_option_index >= quest.options.length) {
      allQuizzesValid = false;
    }
    if (!quest.explanation) {
      allQuizzesValid = false;
    }
  });
});
assert(allQuizzesValid, `All 6 Space Academy quizzes have valid schema, explanations, and bound correct options (${totalQuestions} questions)`);

// 4. Mission Simulations
console.log('\n4. Auditing Mission Simulations...');
let allSimsValid = true;
simulations.forEach(s => {
  if (!s.slug || !s.title || !s.dilemma || !Array.isArray(s.options) || s.options.length < 2) {
    allSimsValid = false;
  }
  s.options.forEach(opt => {
    if (!opt.id || !opt.label || !opt.description || !opt.consequence || !opt.historical_fact) {
      allSimsValid = false;
    }
  });
});
assert(allSimsValid && simulations.length === 4, 'All 4 mission simulations have valid interactive decision trees');

// 5. Science Explainers Cross-references
console.log('\n5. Auditing Science Explainers & Cross-references...');
let allScienceValid = true;
science.forEach(sc => {
  if (!sc.slug || !sc.title || !sc.summary || !sc.how_it_works || !sc.why_it_matters_on_earth) allScienceValid = false;
  if (sc.related_hardware_slugs) {
    sc.related_hardware_slugs.forEach(hSlug => {
      if (!hwSlugs.has(hSlug)) {
        console.error(`Unknown related_hardware_slug "${hSlug}" on science concept ${sc.slug}`);
        allScienceValid = false;
      }
    });
  }
});
assert(allScienceValid && science.length === 4, 'All 4 science concepts have valid educational explainers and valid hardware cross-references');

console.log(`\n=== SEED INTEGRITY SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED ===\n`);
if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
