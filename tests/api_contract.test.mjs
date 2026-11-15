import http from 'http';
import app from '../server/src/app.js';

console.log('=== BEYOND EARTH: API CONTRACT REGRESSION TEST SUITE ===\n');

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

const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/v1`;

  try {
    // 1. Health Endpoint
    const resHealth = await fetch(`${baseUrl}/health`);
    const dataHealth = await resHealth.json();
    assert(resHealth.status === 200 && dataHealth.status === 'healthy', 'GET /health returns healthy status');

    // 2. Destinations
    const resDest = await fetch(`${baseUrl}/destinations`);
    const dataDest = await resDest.json();
    assert(resDest.status === 200 && dataDest.success && dataDest.data.length === 13, `GET /destinations returns 13 bodies (found: ${dataDest?.data?.length})`);
    assert(dataDest.data.some(d => d.slug === 'mars' && d.hardware_count >= 4), 'GET /destinations enriches destination with resident hardware_count');

    const resMars = await fetch(`${baseUrl}/destinations/mars`);
    const dataMars = await resMars.json();
    assert(resMars.status === 200 && dataMars.data.hardware.length > 0, 'GET /destinations/mars returns destination details and resident hardware');

    const resBadDest = await fetch(`${baseUrl}/destinations/non-existent-planet`);
    assert(resBadDest.status === 404, 'GET /destinations/:slug returns 404 for invalid destination slug');

    // 3. Hardware Catalog
    const resHw = await fetch(`${baseUrl}/hardware`);
    const dataHw = await resHw.json();
    assert(resHw.status === 200 && dataHw.success && dataHw.data.length === 18, `GET /hardware returns all 18 missions (found: ${dataHw?.data?.length})`);

    // Hardware Filter: status
    const resHwOp = await fetch(`${baseUrl}/hardware?status=OPERATIONAL`);
    const dataHwOp = await resHwOp.json();
    assert(dataHwOp.data.every(h => h.operational_status === 'OPERATIONAL'), 'GET /hardware?status=OPERATIONAL filters accurately');

    // Hardware Filter: category
    const resHwRover = await fetch(`${baseUrl}/hardware?category=ROVER`);
    const dataHwRover = await resHwRover.json();
    assert(dataHwRover.data.every(h => h.category === 'ROVER'), 'GET /hardware?category=ROVER filters accurately');

    // Hardware Filter: destination
    const resHwMars = await fetch(`${baseUrl}/hardware?destination=mars`);
    const dataHwMars = await resHwMars.json();
    assert(dataHwMars.data.every(h => h.destination_slug === 'mars'), 'GET /hardware?destination=mars filters accurately');

    // Hardware Filter: search
    const resHwSearch = await fetch(`${baseUrl}/hardware?search=voyager`);
    const dataHwSearch = await resHwSearch.json();
    assert(dataHwSearch.data.length >= 2 && dataHwSearch.data.some(h => h.slug === 'voyager-1') && dataHwSearch.data.some(h => h.slug === 'voyager-2'), 'GET /hardware?search=voyager returns Voyager missions');

    // Hardware Detail
    const resV1 = await fetch(`${baseUrl}/hardware/voyager-1`);
    const dataV1 = await resV1.json();
    assert(resV1.status === 200 && dataV1.data.slug === 'voyager-1', 'GET /hardware/voyager-1 returns hardware details');
    assert(Array.isArray(dataV1.data.related_missions) && dataV1.data.related_missions.length > 0, 'GET /hardware/voyager-1 resolves related_missions');

    const resBadHw = await fetch(`${baseUrl}/hardware/non-existent-craft`);
    assert(resBadHw.status === 404, 'GET /hardware/:slug returns 404 for invalid slug');

    // Hardware Featured
    const resFeat = await fetch(`${baseUrl}/hardware/featured`);
    const dataFeat = await resFeat.json();
    assert(resFeat.status === 200 && dataFeat.data.length > 0 && dataFeat.data.every(h => h.is_featured), 'GET /hardware/featured returns featured items');

    // 4. Timeline
    const resTimeline = await fetch(`${baseUrl}/timeline`);
    const dataTimeline = await resTimeline.json();
    assert(resTimeline.status === 200 && dataTimeline.data.length > 50, `GET /timeline returns aggregated milestones (found: ${dataTimeline?.data?.length})`);

    const resTimelineMajor = await fetch(`${baseUrl}/timeline?major_only=true`);
    const dataTimelineMajor = await resTimelineMajor.json();
    assert(dataTimelineMajor.data.every(m => m.is_major_milestone), 'GET /timeline?major_only=true returns major highlights only');

    const resTimelineDecade = await fetch(`${baseUrl}/timeline?era=1970s`);
    const dataTimelineDecade = await resTimelineDecade.json();
    assert(dataTimelineDecade.data.every(m => m.date.startsWith('197')), 'GET /timeline?era=1970s filters by decade');

    // 5. Science
    const resSci = await fetch(`${baseUrl}/science/concepts`);
    const dataSci = await resSci.json();
    assert(resSci.status === 200 && dataSci.data.length === 4, 'GET /science/concepts returns 4 STEM explainers');

    const resRtg = await fetch(`${baseUrl}/science/concepts/rtg-nuclear-power`);
    const dataRtg = await resRtg.json();
    assert(resRtg.status === 200 && dataRtg.data.related_hardware.length > 0, 'GET /science/concepts/:slug enriches with related hardware');

    const resDiscoveries = await fetch(`${baseUrl}/science/discoveries`);
    const dataDiscoveries = await resDiscoveries.json();
    assert(resDiscoveries.status === 200 && dataDiscoveries.data.length > 0, 'GET /science/discoveries aggregates discoveries');

    // 6. Status Radar
    const resStatusSum = await fetch(`${baseUrl}/status/summary`);
    const dataStatusSum = await resStatusSum.json();
    assert(resStatusSum.status === 200 && dataStatusSum.data.counts.TOTAL_TRACKED === 18, 'GET /status/summary counts TOTAL_TRACKED === 18');
    assert(dataStatusSum.data.counts.OPERATIONAL >= 7, 'GET /status/summary counts OPERATIONAL hardware');

    const resStatusRadar = await fetch(`${baseUrl}/status/radar`);
    const dataStatusRadar = await resStatusRadar.json();
    assert(resStatusRadar.status === 200 && dataStatusRadar.data.length === 18, 'GET /status/radar returns all 18 telemetry items');

    // 7. Academy
    const resQuizzes = await fetch(`${baseUrl}/academy/quizzes`);
    const dataQuizzes = await resQuizzes.json();
    assert(resQuizzes.status === 200 && dataQuizzes.data.length === 6, 'GET /academy/quizzes returns 6 quiz summaries');

    const resQuizSlug = await fetch(`${baseUrl}/academy/quizzes/cadet-solar-system`);
    const dataQuizSlug = await resQuizSlug.json();
    assert(resQuizSlug.status === 200 && dataQuizSlug.data.questions.length > 0, 'GET /academy/quizzes/:slug returns full questions');

    const resSims = await fetch(`${baseUrl}/academy/quizzes/simulations`);
    const dataSims = await resSims.json();
    assert(resSims.status === 200 && dataSims.data.length === 4, 'GET /academy/quizzes/simulations returns 4 mission simulations');

    const resDaily = await fetch(`${baseUrl}/academy/quizzes/daily`);
    const dataDaily = await resDaily.json();
    assert(resDaily.status === 200 && dataDaily.data.challenge_id.startsWith('daily-'), 'GET /academy/quizzes/daily returns deterministic challenge');

    console.log(`\n=== API TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED ===\n`);
  } catch (err) {
    console.error('Fatal API test error:', err);
    totalTests++;
  } finally {
    server.close();
    process.exit(passedTests === totalTests ? 0 : 1);
  }
});
