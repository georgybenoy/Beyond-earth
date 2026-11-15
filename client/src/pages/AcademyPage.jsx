import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  Trophy, 
  Award, 
  Sparkles, 
  CheckCircle, 
  Lock,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

import AcademyHero from '../components/academy/AcademyHero';
import LearningPathSelector from '../components/academy/LearningPathSelector';
import InteractiveQuizEngine from '../components/academy/InteractiveQuizEngine';
import MissionSimulator from '../components/academy/MissionSimulator';
import DailyChallengeCard from '../components/academy/DailyChallengeCard';
import { useCadet } from '../hooks/useCadet';
import AchievementTrophyRoom, { ALL_BADGES } from '../components/academy/AchievementTrophyRoom';
import PrintableCertificateModal from '../components/academy/PrintableCertificateModal';

export default function AcademyPage() {
  // Persistent Global Cadet State from CadetContext
  const {
    userPoints,
    unlockedBadges,
    completedQuizzes,
    completedSims,
    dailyStreak,
    lastDailyDate,
    hasCompletedDailyToday,
    awardQuizPoints,
    awardSimulationPoints,
    awardDailyPoints
  } = useCadet();

  // UI Navigation State
  const [activeTab, setActiveTab] = useState('quizzes'); // 'quizzes', 'simulations', 'daily', 'trophy'
  const [activeTier, setActiveTier] = useState(''); // '', 'CADET', 'EXPLORER', 'COMMANDER'
  const [activeQuizDetail, setActiveQuizDetail] = useState(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Data Store
  const [quizzes, setQuizzes] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial academy data
  useEffect(() => {
    async function loadAcademyData() {
      setLoading(true);
      try {
        const [qList, sList, dChallenge] = await Promise.all([
          api.getQuizzes(),
          api.getSimulations(),
          api.getDailyChallenge()
        ]);
        setQuizzes(qList || []);
        setSimulations(sList || []);
        setDailyChallenge(dChallenge || null);
      } catch (err) {
        console.error('Failed to load Space Academy curriculum:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAcademyData();
  }, []);

  // Filter quizzes by active difficulty tier
  const filteredQuizzes = activeTier
    ? quizzes.filter(q => q.difficulty.toUpperCase() === activeTier.toUpperCase())
    : quizzes;

  // Start a specific quiz
  const handleStartQuiz = async (slug) => {
    setLoading(true);
    try {
      const fullQuiz = await api.getQuiz(slug);
      setActiveQuizDetail(fullQuiz);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to load quiz details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Forward completion events to centralized CadetContext
  const handleQuizComplete = awardQuizPoints;
  const handleSimulationComplete = awardSimulationPoints;
  const handleDailyComplete = awardDailyPoints;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-deep-space">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cadet Profile & Telemetry Header */}
        <AcademyHero
          userPoints={userPoints}
          unlockedBadges={unlockedBadges}
          completedQuizzes={completedQuizzes}
          completedSims={completedSims}
          dailyStreak={dailyStreak}
          onOpenCertificate={() => setIsCertificateModalOpen(true)}
        />

        {/* Learning Path & Mode Navigation */}
        {!activeQuizDetail && (
          <LearningPathSelector
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            activeTier={activeTier}
            onSelectTier={setActiveTier}
          />
        )}

        {/* Content Body Based on Active Tab & State */}
        {loading ? (
          <LoadingSpinner message="Calibrating Space Academy flight terminal..." />
        ) : activeQuizDetail ? (
          /* Active Interactive Quiz Engine */
          <InteractiveQuizEngine
            quiz={activeQuizDetail}
            onComplete={handleQuizComplete}
            onExit={() => setActiveQuizDetail(null)}
          />
        ) : activeTab === 'quizzes' ? (
          /* Quizzes Grid Catalog */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-extrabold text-2xl text-white">
                Available Mission Exams ({filteredQuizzes.length})
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Score 70%+ to unlock flight badge
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => {
                const isPassed = completedQuizzes.includes(quiz.slug);

                let badgeColor = 'bg-space-cyan/15 text-space-cyan border-space-cyan/30';
                if (quiz.difficulty === 'EXPLORER') {
                  badgeColor = 'bg-space-violet/15 text-space-violet border-space-violet/30';
                } else if (quiz.difficulty === 'COMMANDER') {
                  badgeColor = 'bg-amber-400/15 text-amber-300 border-amber-400/30';
                }

                return (
                  <div
                    key={quiz.slug}
                    className="glass-panel p-6 rounded-3xl border border-space-border flex flex-col justify-between hover:border-space-cyan/40 transition-all group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                          {quiz.difficulty} TIER
                        </span>

                        {isPassed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Passed</span>
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-amber-400 font-bold">
                            +{quiz.badge_points} PTS
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading font-bold text-xl text-white group-hover:text-space-cyan transition-colors mb-2">
                        {quiz.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                        {quiz.description}
                      </p>

                      <div className="text-[11px] font-mono text-slate-400 mb-6 flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-space-violet" />
                        <span>Reward: 🏅 {quiz.badge_name}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartQuiz(quiz.slug)}
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-violet-glow focus-ring"
                    >
                      <span>{isPassed ? 'Retake Exam' : 'Start Flight Exam'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : activeTab === 'simulations' ? (
          /* Mission Simulator */
          <MissionSimulator
            simulations={simulations}
            completedSims={completedSims}
            onCompleteSimulation={handleSimulationComplete}
          />
        ) : activeTab === 'daily' ? (
          /* Daily Space Challenge */
          <DailyChallengeCard
            dailyData={dailyChallenge}
            hasCompletedToday={hasCompletedDailyToday}
            streak={dailyStreak}
            onCompleteDaily={handleDailyComplete}
          />
        ) : activeTab === 'trophy' ? (
          /* Trophy Room & Badges */
          <AchievementTrophyRoom
            unlockedBadges={unlockedBadges}
            onOpenCertificate={() => setIsCertificateModalOpen(true)}
          />
        ) : null}

        {/* Printable Completion Certificate Modal */}
        {isCertificateModalOpen && (
          <PrintableCertificateModal
            userPoints={userPoints}
            unlockedBadges={unlockedBadges}
            onClose={() => setIsCertificateModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
