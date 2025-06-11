import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { signInWithEmailAndPassword as firebaseAuthSignInWithEmailAndPassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug: Log the config (without sensitive values)
console.log('Firebase Config:', {
  hasApiKey: !!firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Export types for our data
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  courseId: string;
  content: string;
  rating: number;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: Date;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  courseId?: string;
  message?: string;
  createdAt: Date;
  status: 'new' | 'contacted' | 'converted' | 'lost';
}

// Helper functions for Firebase operations
export const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await db.collection('courses').add({
    ...courseData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
};

export async function getCourses() {
  const coursesCollection = collection(db, 'courses');
  const snapshot = await getDocs(coursesCollection);
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addCourse(courseData: any) {
  const coursesCollection = collection(db, 'courses');
  const docRef = await addDoc(coursesCollection, courseData);
  return { id: docRef.id, ...courseData };
}

export const createTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'createdAt'>) => {
  const docRef = await db.collection('testimonials').add({
    ...testimonialData,
    createdAt: new Date()
  });
  return docRef.id;
};

export async function getTestimonials() {
  const testimonialsCollection = collection(db, 'testimonials');
  const snapshot = await getDocs(testimonialsCollection);
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addTestimonial(testimonialData: any) {
  const testimonialsCollection = collection(db, 'testimonials');
  const docRef = await addDoc(testimonialsCollection, testimonialData);
  return { id: docRef.id, ...testimonialData };
}

export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await db.collection('blog').add({
    ...postData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
};

export async function getBlogPosts() {
  const blogCollection = collection(db, 'blog');
  const snapshot = await getDocs(blogCollection);
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addBlogPost(blogData: any) {
  const blogCollection = collection(db, 'blog');
  const docRef = await addDoc(blogCollection, blogData);
  return { id: docRef.id, ...blogData };
}

export const createFAQ = async (faqData: Omit<FAQ, 'id' | 'createdAt'>) => {
  const docRef = await db.collection('faqs').add({
    ...faqData,
    createdAt: new Date()
  });
  return docRef.id;
};

export async function getFAQs() {
  const faqsCollection = collection(db, 'faqs');
  const snapshot = await getDocs(faqsCollection);
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addFAQ(faqData: any) {
  const faqsCollection = collection(db, 'faqs');
  const docRef = await addDoc(faqsCollection, faqData);
  return { id: docRef.id, ...faqData };
}

export const createLead = async (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
  const docRef = await db.collection('leads').add({
    ...leadData,
    createdAt: new Date(),
    status: 'new'
  });
  return docRef.id;
};

export async function getLeads() {
  const leadsCollection = collection(db, 'leads');
  const snapshot = await getDocs(leadsCollection);
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addLead(leadData: any) {
  const leadsCollection = collection(db, 'leads');
  const docRef = await addDoc(leadsCollection, leadData);
  return { id: docRef.id, ...leadData };
}

// Authentication functions
export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await firebaseAuthSignInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Firebase auth error:', error);
    throw error;
  }
};

export const signOut = async () => {
  return auth.signOut();
};

export const getCurrentUser = () => {
  return auth.currentUser;
}; 