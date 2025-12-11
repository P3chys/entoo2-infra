/**
 * Test Data Fixtures
 * Reusable test data for Entoo2 tests
 */

export const testUsers = {
  student: {
    email: 'student@test.entoo2.local',
    password: 'StudentPassword123!',
    display_name: 'Test Student',
    role: 'student',
    language: 'en',
  },
  admin: {
    email: 'admin@test.entoo2.local',
    password: 'AdminPassword123!',
    display_name: 'Test Admin',
    role: 'admin',
    language: 'cs',
  },
};

export const testSemesters = [
  {
    name_cs: '1. semestr',
    name_en: '1st Semester',
    order_index: 1,
  },
  {
    name_cs: '2. semestr',
    name_en: '2nd Semester',
    order_index: 2,
  },
];

export const testSubjects = [
  {
    name_cs: 'Úvod do práva',
    name_en: 'Introduction to Law',
    description_cs: 'Základní právní pojmy a instituty.',
    description_en: 'Basic legal concepts and institutions.',
    credits: 5,
    teachers: [
      {
        teacher_name: 'Prof. JUDr. Jan Novák',
        topic_cs: 'Teorie práva',
        topic_en: 'Legal Theory',
      },
    ],
  },
  {
    name_cs: 'Občanské právo',
    name_en: 'Civil Law',
    description_cs: 'Občanské právo hmotné.',
    description_en: 'Substantive civil law.',
    credits: 6,
    teachers: [
      {
        teacher_name: 'Doc. JUDr. Marie Svobodová',
        topic_cs: 'Závazkové právo',
        topic_en: 'Law of Obligations',
      },
    ],
  },
];

export const testDocuments = {
  pdf: {
    name: 'test-lecture.pdf',
    mimeType: 'application/pdf',
    content: '%PDF-1.4 test content',
  },
  docx: {
    name: 'test-notes.docx',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    content: 'PK test docx content',
  },
  txt: {
    name: 'test-summary.txt',
    mimeType: 'text/plain',
    content: 'This is a test summary of the lecture materials.',
  },
};

export const testComments = [
  {
    content: 'Velmi užitečné materiály, děkuji!',
  },
  {
    content: 'Great explanation of the topic.',
  },
];

export const testQuestions = [
  {
    title: 'Rozdíl mezi právem veřejným a soukromým?',
    content: 'Může mi někdo vysvětlit hlavní rozdíly mezi těmito dvěma oblastmi práva?',
  },
  {
    title: 'How to cite legal sources?',
    content: 'What is the correct format for citing legal sources in academic papers?',
  },
];

export const generateUniqueEmail = (prefix: string = 'test'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}@test.entoo2.local`;
};

export const generateTestFile = (
  name: string,
  content: string,
  mimeType: string = 'text/plain'
) => {
  return {
    name,
    mimeType,
    buffer: Buffer.from(content),
  };
};
