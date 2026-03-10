'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Code,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  CheckCircle,
  Play,
  Copy,
  Check,
  Lightbulb,
  Target,
  Zap,
  Star,
  Lock,
  Unlock,
  Terminal,
  ArrowLeft,
  Clock,
  AlertCircle,
  Info
} from 'lucide-react';
import { allLevels, Lesson, Level, CodeExample, Exercise } from './lessons-data';

// ============================================
// المكونات المساعدة
// ============================================

function CodeBlock({ code, output, explanation, tips }: { code: string; output?: string; explanation: string; tips?: string[] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden my-4">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-gray-400 text-sm">كود لغة المرجع</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'تم النسخ' : 'نسخ'}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-100 overflow-x-auto" dir="ltr">
        <code>{code}</code>
      </pre>
      {output && (
        <div className="border-t border-gray-700">
          <div className="px-4 py-2 bg-gray-800/50 text-gray-400 text-sm">
            الإخراج:
          </div>
          <pre className="p-4 text-sm text-green-400 bg-gray-900/50" dir="rtl">
            {output}
          </pre>
        </div>
      )}
      <div className="border-t border-gray-700 p-4 bg-gray-800/30">
        <p className="text-gray-300 text-sm whitespace-pre-line">{explanation}</p>
        {tips && tips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tips.map((tip, i) => (
              <span key={i} className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">
                💡 {tip}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const difficultyColors: Record<string, string> = {
    'سهل جداً': 'bg-green-900/30 text-green-300',
    'سهل': 'bg-green-900/30 text-green-300',
    'متوسط': 'bg-yellow-900/30 text-yellow-300',
    'صعب': 'bg-orange-900/30 text-orange-300',
    'صعب جداً': 'bg-red-900/30 text-red-300',
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-bold text-white">{exercise.title}</h4>
          <p className="text-gray-400 text-sm mt-1">{exercise.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${difficultyColors[exercise.difficulty]}`}>
          {exercise.difficulty}
        </span>
      </div>

      {/* Hints */}
      <div className="mb-4">
        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
        >
          <Lightbulb className="w-4 h-4" />
          {showHints ? 'إخفاء التلميحات' : 'عرض التلميحات'}
        </button>
        {showHints && (
          <ul className="mt-2 space-y-1 text-gray-300 text-sm">
            {exercise.hints.map((hint, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                {hint}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Solution */}
      <button
        onClick={() => setShowSolution(!showSolution)}
        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm mb-4"
      >
        {showSolution ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        {showSolution ? 'إخفاء الحل' : 'عرض الحل'}
      </button>

      {showSolution && (
        <div className="space-y-4">
          <CodeBlock
            code={exercise.solution}
            explanation={exercise.solutionExplanation}
          />
          <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4">
            <h5 className="text-green-400 font-medium mb-2">نقاط التعلم:</h5>
            <ul className="space-y-1">
              {exercise.learningPoints.map((point, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function LessonContent({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'content' | 'code' | 'exercises'>('content');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            العودة للمستوى
          </button>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <p className="text-gray-400 mt-1">{lesson.description}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lesson.duration}
            </span>
            {lesson.prerequisites.length > 0 && (
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                المتطلبات: {lesson.prerequisites.join('، ')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-4">
            {[
              { id: 'content', label: 'المحتوى', icon: BookOpen },
              { id: 'code', label: 'الأمثلة البرمجية', icon: Code },
              { id: 'exercises', label: 'التمارين', icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-800/30">
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-200 whitespace-pre-line leading-relaxed">
                  {lesson.introduction}
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                أهداف الدرس
              </h3>
              <ul className="space-y-2">
                {lesson.objectives.map((objective, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            {lesson.sections.map((section, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-blue-400">
                  {index + 1}. {section.title}
                </h3>
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-200 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </div>
                <div className="mt-6 bg-blue-900/20 rounded-lg p-4 border border-blue-800/30">
                  <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    النقاط الأساسية
                  </h4>
                  <ul className="space-y-1">
                    {section.keyPoints.map((point, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <Star className="w-3 h-3 text-yellow-400 mt-1 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-800/30">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                ملخص الدرس
              </h3>
              <div className="text-gray-200 whitespace-pre-line leading-relaxed">
                {lesson.summary}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold mb-4">الخطوات التالية</h3>
              <ul className="space-y-2">
                {lesson.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <ArrowLeft className="w-4 h-4 text-blue-400" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-8">
            {lesson.codeExamples.map((example, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold mb-2">{example.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{example.description}</p>
                <CodeBlock
                  code={example.code}
                  output={example.output}
                  explanation={example.explanation}
                  tips={example.tips}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'exercises' && (
          <div className="space-y-6">
            {lesson.exercises.map((exercise, index) => (
              <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LevelView({ level, onBack }: { level: Level; onBack: () => void }) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  if (selectedLesson) {
    return <LessonContent lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
          >
            <ChevronRight className="w-5 h-5" />
            العودة للمستويات
          </button>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{level.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">مستوى {level.name}</h1>
              <p className="text-gray-300 mt-1">{level.description}</p>
            </div>
          </div>
          <p className="text-gray-300 max-w-2xl">{level.longDescription}</p>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <span className="flex items-center gap-2 text-gray-300">
              <BookOpen className="w-4 h-4" />
              {level.lessonsCount} درس
            </span>
            <span className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4" />
              {level.totalHours}
            </span>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">الدروس</h2>
        <div className="grid gap-4">
          {level.lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="bg-gray-800/50 hover:bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all text-right group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-sm">
                      الدرس {index + 1}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{lesson.description}</p>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// الصفحة الرئيسية
// ============================================

export default function LearnPage() {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  if (selectedLevel) {
    return <LevelView level={selectedLevel} onBack={() => setSelectedLevel(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors">
            <ChevronRight className="w-5 h-5" />
            العودة للرئيسية
          </Link>
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              تعلم لغة المرجع
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              من الصفر إلى الاحتراف - دروس شاملة ومفصلة مع أمثلة برمجية وتمارين عملية
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">4</div>
              <div className="text-gray-300 text-sm">مستويات</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">10+</div>
              <div className="text-gray-300 text-sm">دروس</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-gray-300 text-sm">مثال برمجي</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">30+</div>
              <div className="text-gray-300 text-sm">تمرين تطبيقي</div>
            </div>
          </div>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">اختر المستوى المناسب لك</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level)}
              className={`bg-gradient-to-br ${level.color} p-6 rounded-2xl text-white hover:scale-105 transition-transform shadow-lg hover:shadow-xl text-right`}
            >
              <div className="text-5xl mb-4">{level.icon}</div>
              <h3 className="text-xl font-bold mb-2">مستوى {level.name}</h3>
              <p className="text-white/80 text-sm mb-4">{level.description}</p>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span>{level.lessonsCount} درس</span>
                <span>{level.totalHours}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Learning Path */}
        <div className="mt-16 bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center">مسار التعلم</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {allLevels.map((level, index) => (
              <div key={level.id} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {level.icon}
                  </div>
                  <span className="text-sm mt-2 font-medium">{level.name}</span>
                </div>
                {index < allLevels.length - 1 && (
                  <ChevronLeft className="w-6 h-6 text-gray-500 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">أمثلة برمجية حقيقية</h3>
            <p className="text-gray-400 text-sm">كل درس يحتوي على أمثلة عملية يمكنك تشغيلها وتعديلها</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">تمارين تطبيقية</h3>
            <p className="text-gray-400 text-sm">تحديات وحلول لتعزيز فهمك وتطبيق ما تعلمته</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">شهادات معتمدة</h3>
            <p className="text-gray-400 text-sm">احصل على شهادة بعد إكمال كل مستوى واجتياز الاختبار</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>جميع الدروس مجانية تماماً - الشهادات والاختبارات بمقابل</p>
          <p className="mt-2">
            لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية
          </p>
        </div>
      </div>
    </div>
  );
}
