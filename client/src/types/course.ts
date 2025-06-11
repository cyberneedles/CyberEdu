export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number | null;
  category: string;
  icon: string;
  mode: string;
  prerequisites: string | null;
  overview: string | null;
  mainImage: string | null;
  logo: string | null;
  curriculum: Array<{
    sectionTitle: string;
    items: string[];
  }>;
  batches: Array<{
    startDate: string;
    startTime: string | null;
    endTime: string | null;
    mode: string;
    instructor: string;
  }>;
  fees: Array<{
    label: string;
    amount: number;
    notes: string;
  }>;
  careerOpportunities: string[];
  toolsAndTechnologies: string | null;
  whatYouWillLearn: string | null;
  isActive: boolean;
  syllabusUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
} 