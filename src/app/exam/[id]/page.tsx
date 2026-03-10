"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Award, Clock, ChevronLeft, ChevronRight, CheckCircle2, 
  XCircle, AlertCircle, Play, RotateCcw, Home,
  Trophy, Loader2, Shield, Eye, AlertTriangle
} from "lucide-react";

interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  points: number;
  category: string;
  difficulty: string;
}

interface ExamSession {
  sessionId: string;
  securityToken: string;
  certificateId: string;
  questions: ExamQuestion[];
  duration: number;
  totalQuestions: number;
  studentName: string;
  startTime: number;
}

interface ExamResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  passingScore: number;
  earnedPoints: number;
  totalPoints: number;
  timeSpent: number;
  tabSwitches: number;
  certificateNumber: string | null;
  results: Array<{
    questionId: string;
    userAnswer: number | undefined;
    isCorrect: boolean;
    correctAnswer: number;
    explanation: string;
  }>;
}

interface Certificate {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  duration: string;
  level: string;
  skills: string[];
  passingScore: number;
  totalQuestions: number;
  examDuration: number;
  featured: boolean;
}

const categoryLabels: Record<string, string> = {
  programming: 'برمجة',
  ai: 'ذكاء اصطناعي',
  web: 'تطوير ويب',
  cybersecurity: 'أمن سيبراني',
  data: 'تحليل بيانات',
};

const difficultyLabels: Record<string, { label: string; color: string }> = {
  easy: { label: 'سهل', color: 'bg-green-100 text-green-700' },
  medium: { label: 'متوسط', color: 'bg-yellow-100 text-yellow-700' },
  hard: { label: 'صعب', color: 'bg-orange-100 text-orange-700' },
  expert: { label: 'خبير', color: 'bg-red-100 text-red-700' },
};

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const certificateId = params.id as string;
  
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<ExamSession | null>(null);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [studentName, setStudentName] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [tabWarning, setTabWarning] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);

  // Fetch certificate info
  useEffect(() => {
    async function fetchCertificate() {
      try {
        const response = await fetch(`/api/certificates`);
        const data = await response.json();
        if (data.success) {
          const cert = data.data.find((c: Certificate) => c.id === certificateId);
          if (cert) {
            setCertificate(cert);
          }
        }
      } catch (error) {
        console.error('Error fetching certificate:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCertificate();
  }, [certificateId]);

  // Timer effect
  useEffect(() => {
    if (!isStarted || isFinished || !session) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isStarted, isFinished, session]);

  // Anti-cheat: Tab visibility detection
  useEffect(() => {
    if (!isStarted || isFinished) return;

    const handleVisibilityChange = async () => {
      if (document.hidden && session) {
        setTabWarning(prev => prev + 1);
        setShowTabWarning(true);
        
        // Notify server
        try {
          await fetch('/api/exam/session', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: session.sessionId,
              securityToken: session.securityToken,
              tabSwitch: true,
            }),
          });
        } catch (error) {
          console.error('Error reporting tab switch:', error);
        }

        // Auto-hide warning after 3 seconds
        setTimeout(() => setShowTabWarning(false), 3000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isStarted, isFinished, session]);

  // Prevent copy/paste and right-click
  useEffect(() => {
    if (!isStarted || isFinished) return;

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'p')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isStarted, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartExam = async () => {
    if (!studentName.trim()) {
      alert("الرجاء إدخال اسمك");
      return;
    }

    try {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      const response = await fetch('/api/exam/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId,
          studentName,
          userId: user?.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSession(data.data);
        setTimeLeft(data.data.duration);
        setIsStarted(true);
      } else {
        alert(data.error || 'فشل في بدء الاختبار');
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      alert('فشل في بدء الاختبار');
    }
  };

  const handleAnswer = async (answerIndex: number) => {
    if (!session) return;
    const questionId = session.questions[currentQuestion].id;
    
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));

    // Save answer to server
    try {
      await fetch('/api/exam/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          securityToken: session.securityToken,
          questionId,
          answer: answerIndex,
          action: 'answer',
        }),
      });
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const handleNext = () => {
    if (!session) return;
    if (currentQuestion < session.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmitExam = useCallback(async () => {
    if (!session) return;

    try {
      const response = await fetch('/api/exam/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          securityToken: session.securityToken,
          action: 'submit',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        setIsFinished(true);
        if (data.data.certificateNumber) {
          setCertificateNumber(data.data.certificateNumber);
        }
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">الشهادة غير موجودة</h2>
            <p className="text-muted-foreground mb-4">
              لم يتم العثور على الشهادة المطلوبة
            </p>
            <Button asChild>
              <Link href="/certificates">
                <ChevronRight className="w-4 h-4 ml-2" />
                العودة للشهادات
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Start Screen
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/certificates">
              <ChevronRight className="w-4 h-4 ml-2" />
              العودة للشهادات
            </Link>
          </Button>
          
          <Card className="overflow-hidden">
            <div className="hero-gradient text-white p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                  <Award className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{certificate.title}</h1>
                  <p className="text-blue-100">{categoryLabels[certificate.category] || certificate.category}</p>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <Alert className="mb-6 border-amber-500 bg-amber-50">
                <Shield className="w-4 h-4 text-amber-600" />
                <AlertTitle className="text-amber-700">تنبيه أمني</AlertTitle>
                <AlertDescription className="text-amber-700">
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>سيتم تسجيل أي تبديل للتبويب أو نافذة أخرى</li>
                    <li>الأسئلة مرتبة عشوائياً في كل محاولة</li>
                    <li>الخيارات مرتبة عشوائياً في كل سؤال</li>
                    <li>لا يمكن الرجوع لتعديل الإجابات بعد الإرسال</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Alert className="mb-6">
                <AlertCircle className="w-4 h-4" />
                <AlertTitle>معلومات الاختبار</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>عدد الأسئلة: {certificate.totalQuestions} سؤال (عشوائي)</li>
                    <li>المدة: {certificate.examDuration} دقيقة</li>
                    <li>درجة النجاح: {certificate.passingScore}%</li>
                    <li>الأسئلة تختلف في كل محاولة</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  أدخل اسمك (كما سيظهر في الشهادة)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-3 text-lg text-right"
                  placeholder="الاسم الكامل"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-2">المهارات المطلوبة:</h3>
                <div className="flex flex-wrap gap-2">
                  {certificate.skills.map((skill, i) => (
                    <Badge key={i} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full gold-accent text-primary font-bold text-lg py-6"
                onClick={handleStartExam}
                disabled={!studentName.trim()}
              >
                <Play className="w-5 h-5 ml-2" />
                بدء الاختبار الآمن
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Result Screen
  if (isFinished && result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="overflow-hidden">
            <div className={`${result.passed ? "hero-gradient" : "bg-destructive"} text-white p-6 text-center`}>
              {result.passed ? (
                <>
                  <Trophy className="w-20 h-20 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold mb-2">تهانينا! 🎉</h1>
                  <p className="text-xl text-blue-100">لقد اجتزت الاختبار بنجاح</p>
                </>
              ) : (
                <>
                  <XCircle className="w-20 h-20 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold mb-2">للأسف</h1>
                  <p className="text-xl text-red-100">لم تصل لدرجة النجاح المطلوبة</p>
                </>
              )}
            </div>
            
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2">
                  <span className={result.passed ? "text-primary" : "text-destructive"}>
                    {result.score}%
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {result.correctCount} إجابة صحيحة من {result.totalQuestions}
                </p>
                <Progress value={result.score} className="h-3 mt-4" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground">درجتك</p>
                    <p className="text-2xl font-bold text-primary">{result.score}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground">درجة النجاح</p>
                    <p className="text-2xl font-bold">{result.passingScore}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground">النقاط</p>
                    <p className="text-2xl font-bold">{result.earnedPoints}/{result.totalPoints}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground">الوقت</p>
                    <p className="text-2xl font-bold">{formatTime(result.timeSpent)}</p>
                  </CardContent>
                </Card>
              </div>

              {result.tabSwitches > 0 && (
                <Alert className="mb-6 border-amber-500 bg-amber-50">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <AlertTitle className="text-amber-700">تنبيه أمني</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    تم تسجيل {result.tabSwitches} تبديل للتبويب أثناء الاختبار
                  </AlertDescription>
                </Alert>
              )}
              
              {result.passed ? (
                <div className="space-y-4">
                  <Alert className="border-green-500 bg-green-50">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <AlertTitle>تم إصدار شهادتك!</AlertTitle>
                    <AlertDescription>
                      رقم الشهادة: {result.certificateNumber}
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    className="w-full gold-accent text-primary font-bold py-6"
                    onClick={() => {
                      const certNumber = result.certificateNumber || certificateNumber;
                      router.push(`/certificate/${certNumber}?name=${encodeURIComponent(studentName)}&certId=${certificateId}&score=${result.score}`);
                    }}
                  >
                    <Award className="w-5 h-5 ml-2" />
                    عرض الشهادة
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="border-destructive bg-red-50">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <AlertTitle>حاول مرة أخرى</AlertTitle>
                    <AlertDescription>
                      راجع المواد التعليمية وأعد المحاولة - الأسئلة ستكون مختلفة!
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    className="w-full hero-gradient text-white py-6"
                    onClick={() => {
                      setIsStarted(false);
                      setIsFinished(false);
                      setCurrentQuestion(0);
                      setAnswers({});
                      setResult(null);
                      setSession(null);
                    }}
                  >
                    <RotateCcw className="w-5 h-5 ml-2" />
                    إعادة الاختبار (أسئلة جديدة)
                  </Button>
                </div>
              )}
              
              <div className="flex gap-4 mt-4">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/certificates">
                    <Home className="w-4 h-4 ml-2" />
                    الرئيسية
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/dashboard">
                    <Award className="w-4 h-4 ml-2" />
                    شهاداتي
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Exam Screen
  const question = session.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / session.questions.length) * 100;
  const isAnswered = answers[question.id] !== undefined;
  const difficulty = difficultyLabels[question.difficulty] || difficultyLabels.medium;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4 select-none">
      {/* Tab Warning */}
      {showTabWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert className="border-amber-500 bg-amber-50 shadow-lg animate-pulse">
            <Eye className="w-4 h-4 text-amber-600" />
            <AlertTitle className="text-amber-700">تحذير!</AlertTitle>
            <AlertDescription className="text-amber-700">
              تم تسجيل تبديل التبويب ({tabWarning} مرات)
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">{certificate.title}</h1>
            <p className="text-sm text-muted-foreground">
              السؤال {currentQuestion + 1} من {session.questions.length}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className={difficulty.color}>{difficulty.label}</Badge>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timeLeft < 60 ? "bg-red-100 text-red-700" : "bg-muted"
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
        
        {/* Progress */}
        <Progress value={progress} className="h-2 mb-6" />
        
        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                {question.category}
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{question.points} نقطة</span>
                {isAnswered && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    تمت الإجابة
                  </Badge>
                )}
              </div>
            </div>
            <CardTitle className="text-xl mt-4">
              {question.question}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = answers[question.id] === index;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full text-right p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isSelected ? "bg-primary text-white" : "bg-muted"
                      }`}>
                        {["أ", "ب", "ج", "د"][index]}
                      </div>
                      <span className="flex-1">{option}</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ChevronRight className="w-4 h-4 ml-2" />
            السابق
          </Button>
          
          <div className="flex items-center gap-1 overflow-x-auto max-w-[60%] py-2">
            {session.questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(i)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                  i === currentQuestion
                    ? "bg-primary text-white"
                    : answers[q.id] !== undefined
                    ? "bg-green-500 text-white"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          {currentQuestion === session.questions.length - 1 ? (
            <Button
              className="gold-accent text-primary font-bold"
              onClick={handleSubmitExam}
            >
              إنهاء الاختبار
              <CheckCircle2 className="w-4 h-4 mr-2" />
            </Button>
          ) : (
            <Button onClick={handleNext}>
              التالي
              <ChevronLeft className="w-4 h-4 mr-2" />
            </Button>
          )}
        </div>
        
        {/* Questions Status */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>تمت الإجابة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span>لم تتم الإجابة</span>
              </div>
            </div>
            <span className="font-bold">
              {Object.keys(answers).length} / {session.questions.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
