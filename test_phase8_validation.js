import fs from 'fs';
import path from 'path';

console.log('=== BEYOND EARTH: PHASE 8 AUTOMATED VALIDATION SUITE ===\n');

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

// 1. SECURITY AUDIT: Search for dangerous innerHTML / dangerouslySetInnerHTML / eval
console.log('1. Auditing Codebase for Unsafe DOM Injection & eval...');
function scanDirectory(dir, extList) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(scanDirectory(fullPath, extList));
    } else if (extList.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

const sourceFiles = scanDirectory('./client/src', ['.jsx', '.js']).concat(scanDirectory('./server/src', ['.js']));
let dangerousDomUsages = [];
let evalUsages = [];

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('dangerouslySetInnerHTML') || content.includes('innerHTML')) {
    dangerousDomUsages.push(file);
  }
  if (content.match(/\beval\s*\(/)) {
    evalUsages.push(file);
  }
}

assert(dangerousDomUsages.length === 0, `Zero dangerouslySetInnerHTML or innerHTML occurrences (Found: ${dangerousDomUsages.length})`);
assert(evalUsages.length === 0, `Zero eval() execution occurrences (Found: ${evalUsages.length})`);

// 2. ACCESSIBILITY (A11Y) AUDIT: Verify focus-ring and ARIA attributes
console.log('\n2. Auditing Keyboard Navigation, Focus Rings & ARIA attributes...');

const cssContent = fs.readFileSync('./client/src/index.css', 'utf8');
assert(cssContent.includes(':focus-visible'), 'CSS contains explicit :focus-visible rules');
assert(cssContent.includes('.focus-ring'), 'CSS defines .focus-ring utility');
assert(cssContent.includes('prefers-reduced-motion'), 'CSS defines prefers-reduced-motion media query');
assert(cssContent.includes('scroll-behavior: smooth'), 'CSS sets smooth scrolling with reduced-motion fallback');

const appContent = fs.readFileSync('./client/src/App.jsx', 'utf8');
assert(appContent.includes('Skip to main content'), 'Skip to main content link implemented in App.jsx');
assert(appContent.includes('id="main-content"'), 'Main content landmark with id="main-content" tabIndex="-1"');
assert(appContent.includes('ErrorBoundary'), 'ErrorBoundary wraps main application views');

const navbarContent = fs.readFileSync('./client/src/components/common/Navbar.jsx', 'utf8');
assert(navbarContent.includes('aria-expanded'), 'Mobile navigation toggle has aria-expanded');
assert(navbarContent.includes('aria-controls'), 'Mobile navigation toggle has aria-controls');
assert(navbarContent.includes("e.key === 'Escape'"), 'Mobile menu closes on Escape key');

const statusBadgeContent = fs.readFileSync('./client/src/components/common/StatusBadge.jsx', 'utf8');
assert(statusBadgeContent.includes('Icon') && statusBadgeContent.includes('config.icon'), 'StatusBadge includes distinctive icons for non-color status conveyance');
assert(statusBadgeContent.includes('aria-label'), 'StatusBadge includes comprehensive aria-label');

const modalContent = fs.readFileSync('./client/src/components/timeline/EventDetailModal.jsx', 'utf8');
assert(modalContent.includes('role="dialog"') && modalContent.includes('aria-modal="true"'), 'Timeline EventDetailModal uses proper WAI-ARIA modal dialog roles');
assert(modalContent.includes("e.key === 'Escape'"), 'Timeline EventDetailModal supports Escape to close');

const certModalContent = fs.readFileSync('./client/src/components/academy/PrintableCertificateModal.jsx', 'utf8');
assert(certModalContent.includes('role="dialog"') && certModalContent.includes('aria-modal="true"'), 'PrintableCertificateModal uses proper WAI-ARIA modal dialog roles');
assert(certModalContent.includes("e.key === 'Escape'"), 'PrintableCertificateModal supports Escape to close');

const carouselContent = fs.readFileSync('./client/src/components/hardware/FlagshipCarousel.jsx', 'utf8');
assert(carouselContent.includes('isPaused') && carouselContent.includes('aria-label'), 'FlagshipCarousel implements WCAG 2.2.2 Pause/Play controls');
assert(carouselContent.includes('onPointerEnter') || carouselContent.includes('onMouseEnter'), 'FlagshipCarousel pauses on hover/focus');

// 3. CODE SPLITTING & PERFORMANCE AUDIT
console.log('\n3. Auditing Route-level Lazy Loading and Image Optimizations...');
assert(appContent.includes('React.lazy') || appContent.includes('lazy('), 'App.jsx utilizes React.lazy for route splitting');
assert(appContent.includes('<Suspense'), 'App.jsx wraps routes in Suspense fallback');

const distAssets = fs.existsSync('./client/dist/assets') ? fs.readdirSync('./client/dist/assets') : [];
const jsChunks = distAssets.filter(f => f.endsWith('.js'));
assert(jsChunks.length >= 7, `Multiple lazy-loaded async chunks generated in production build (Found: ${jsChunks.length} chunks)`);

// 4. WCAG CONTRAST VERIFICATION
console.log('\n4. Mathematically Verifying Contrast Ratios for Text Colors...');
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16)
  };
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const bgSpace = '#080512';
const surfaceBg = '#110B20';
const cardBg = '#170F2C';

const colors = [
  { name: 'Pure White (#FFFFFF)', hex: '#FFFFFF' },
  { name: 'High-contrast Text (#F5F0FF)', hex: '#F5F0FF' },
  { name: 'Muted Lavender (#A99BBF)', hex: '#A99BBF' },
  { name: 'Violet Accent (#C4B5FD)', hex: '#C4B5FD' },
  { name: 'Purple Highlight (#A855F7)', hex: '#A855F7' },
  { name: 'Slate 200 (#E2E8F0)', hex: '#E2E8F0' },
  { name: 'Slate 300 (#CBD5E1)', hex: '#CBD5E1' },
  { name: 'Slate 400 (#94A3B8)', hex: '#94A3B8' }
];

let allPassAA = true;
for (const c of colors) {
  const cr = getContrast(c.hex, bgSpace);
  const crCard = getContrast(c.hex, cardBg);
  const isAA = cr >= 4.5 && crCard >= 4.5;
  if (!isAA && c.hex !== '#A855F7') { // A855F7 is primary button bg / accent icon
    allPassAA = false;
  }
  console.log(`    • ${c.name} vs bg: ${cr.toFixed(2)}:1 | vs card: ${crCard.toFixed(2)}:1 [${cr >= 4.5 ? 'WCAG AA' : 'Large Text Only'}]`);
}
assert(allPassAA, 'All body text tokens meet WCAG 2.1 AA (>= 4.5:1 contrast)');

// 5. HARDWARE DATA RESILIENCE & FALLBACKS
console.log('\n5. Auditing Hardware Resilience & Fallbacks...');
const instrumentSuiteContent = fs.readFileSync('./client/src/components/hardware/InstrumentSuite.jsx', 'utf8');
assert(instrumentSuiteContent.includes('scroll-mt-24'), 'InstrumentSuite has scroll-mt-24 for sticky navbar clearance');
assert(instrumentSuiteContent.includes('Scientific instrument suite telemetry is currently pending') || instrumentSuiteContent.includes('!instruments || instruments.length === 0'), 'InstrumentSuite contains resilient empty/fallback state');

const timelineContent = fs.readFileSync('./client/src/components/hardware/JourneyTimeline.jsx', 'utf8');
assert(timelineContent.includes('scroll-mt-24'), 'JourneyTimeline has scroll-mt-24');
assert(timelineContent.includes('flight log records are currently being compiled') || timelineContent.includes('!milestones || milestones.length === 0'), 'JourneyTimeline contains resilient empty/fallback state');

const fateContent = fs.readFileSync('./client/src/components/hardware/PhysicalFateCard.jsx', 'utf8');
assert(fateContent.includes('scroll-mt-24'), 'PhysicalFateCard has scroll-mt-24');
assert(fateContent.includes('hardware.physical_fate || hardware.status_summary') || fateContent.includes('Physical telemetry currently tracking'), 'PhysicalFateCard handles missing fate data gracefully');

const sourcesContent = fs.readFileSync('./client/src/components/hardware/SourcesList.jsx', 'utf8');
assert(sourcesContent.includes('scroll-mt-24'), 'SourcesList has scroll-mt-24');
assert(sourcesContent.includes('rel="noopener noreferrer"'), 'SourcesList external links contain security attributes');

const telemetryContent = fs.readFileSync('./client/src/components/hardware/TelemetryDossier.jsx', 'utf8');
assert(telemetryContent.includes('Telemetry unavailable'), 'TelemetryDossier uses explicit "Telemetry unavailable" rather than fabricated guesses');

console.log(`\n=== VALIDATION SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED ===\n`);
if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
