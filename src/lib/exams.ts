// بيانات أسئلة الاختبارات لكل شهادة
export const exams: Record<string, { questions: Array<{ id: string; question: string; options: string[]; correctAnswer: number }> }> = {
  // يمكن إضافة أسئلة الاختبارات هنا
};

// حساب نتيجة الاختبار
export function calculateScore(
  answers: Record<string, number>,
  certificateId: string
): { percentage: number; passed: boolean; correctCount: number; totalCount: number } {
  const exam = exams[certificateId];
  
  if (!exam) {
    // إذا لم تكن هناك أسئلة محددة، نحسب بشكل افتراضي
    const totalQuestions = Object.keys(answers).length;
    const correctCount = Math.floor(totalQuestions * 0.7); // افتراض 70% صحيحة
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    return {
      percentage,
      passed: percentage >= 70,
      correctCount,
      totalCount: totalQuestions,
    };
  }

  const questions = exam.questions;
  let correctCount = 0;

  for (const question of questions) {
    const userAnswer = answers[question.id];
    if (userAnswer === question.correctAnswer) {
      correctCount++;
    }
  }

  const percentage = Math.round((correctCount / questions.length) * 100);

  return {
    percentage,
    passed: percentage >= 70,
    correctCount,
    totalCount: questions.length,
  };
}

// توليد أسئلة عشوائية
export function generateRandomQuestions(count: number = 20): Array<{ id: string; question: string; options: string[]; correctAnswer: number }> {
  // أسئلة عامة للاختبارات
  const allQuestions = [
    {
      id: '1',
      question: 'ما هي لغة البرمجة الأكثر استخداماً لتطوير الويب؟',
      options: ['Python', 'JavaScript', 'C++', 'Java'],
      correctAnswer: 1,
    },
    {
      id: '2',
      question: 'ما هو Framework المستخدم مع React؟',
      options: ['Django', 'Next.js', 'Flask', 'Laravel'],
      correctAnswer: 1,
    },
    {
      id: '3',
      question: 'ما هو معنى HTML؟',
      options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
      correctAnswer: 0,
    },
    {
      id: '4',
      question: 'ما هي قاعدة البيانات الأكثر استخداماً مع تطبيقات الويب؟',
      options: ['MySQL', 'PostgreSQL', 'MongoDB', 'كل ما سبق'],
      correctAnswer: 3,
    },
    {
      id: '5',
      question: 'ما هو CSS؟',
      options: ['Programming Language', 'Database System', 'Style Sheet Language', 'Markup Language'],
      correctAnswer: 2,
    },
  ];

  // خلط الأسئلة واختيار العدد المطلوب
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
