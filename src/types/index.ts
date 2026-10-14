export type DegreeType = 'Bachelors' | "Master's" | 'PhD' | 'MEng' | 'MBA' | 'Other';

export type ApplicationStatus = 
  | 'Researching' 
  | 'In Progress' 
  | 'Submitted' 
  | 'Interview' 
  | 'Accepted' 
  | 'Rejected' 
  | 'Waitlisted' 
  | 'Declined';

export type RequirementStatus = 'Not Started' | 'Draft' | 'Final' | 'Submitted';

export type RecommenderStatus = 'Not Requested' | 'Requested' | 'Confirmed' | 'Submitted';

export type FundingType = 'Assistantship' | 'Scholarship' | 'Fellowship' | 'Self-funded' | 'Loan';

export type SchoolCategory = 'Safety' | 'Target' | 'Reach' | 'Dream';

export type AchievementId =
  | 'first_school'
  | 'five_schools'
  | 'ten_schools'
  | 'first_submission'
  | 'first_offer'
  | 'global_explorer'
  | 'deadline_crusher'
  | 'fully_funded';

export interface Achievement {
  id: AchievementId;
  unlockedAt: string; // ISO timestamp
}

export interface School {
  id: string;
  name: string;
  program: string;
  degreeType: DegreeType;
  country: string;
  countryCode: string;
  deadline: string; // YYYY-MM-DD
  status: ApplicationStatus;
  applicationFee: number;
  portalUrl: string;
  notes: string;
  logoUrl?: string;
  ranking?: number;
  category?: SchoolCategory; // Safety / Target / Reach / Dream
  createdAt: string;
  updatedAt: string;
}

export interface Requirement {
  id: string;
  schoolId: string;
  name: string;
  status: RequirementStatus;
  notes: string;
  dueDate?: string;
}

export interface SchoolSubmission {
  schoolId: string;
  status: RecommenderStatus;
}

export interface Recommender {
  id: string;
  name: string;
  email: string;
  relationship: string;
  institution: string;
  lastContactedDate: string; // YYYY-MM-DD
  schoolSubmissions: SchoolSubmission[];
}

export interface Funding {
  id: string;
  schoolId: string;
  fundingType: FundingType;
  amountOffered: number;
  tuitionCost: number;
  estimatedCostOfLiving: number;
  notes: string;
}

export interface UserSettings {
  applicantName: string;
  targetDegree: DegreeType;
  homeCountry: string;
  currency: string;
  targetIntake: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'status_change' | 'requirement_update' | 'school_added' | 'recommender_update' | 'funding_update';
  title: string;
  description: string;
}

// Dummy runtime exports to satisfy value imports when verbatimModuleSyntax is enabled
export const ApplicationStatus = undefined as unknown as ApplicationStatus;
export const RequirementStatus = undefined as unknown as RequirementStatus;
export const RecommenderStatus = undefined as unknown as RecommenderStatus;
export const FundingType = undefined as unknown as FundingType;
export const DegreeType = undefined as unknown as DegreeType;
export const ActiveTab = undefined as unknown as ActiveTab;

export type ActiveTab = 
  | 'dashboard' 
  | 'applications' 
  | 'universities'
  | 'programs'
  | 'scholarships'
  | 'documents'
  | 'timeline' 
  | 'resources'
  | 'assistant' 
  | 'requirements' 
  | 'recommenders' 
  | 'funding' 
  | 'settings';
