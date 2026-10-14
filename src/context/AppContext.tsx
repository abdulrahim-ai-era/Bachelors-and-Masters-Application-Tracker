import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  School,
  Requirement,
  Recommender,
  Funding,
  UserSettings,
  ActivityLog,
  ActiveTab,
  ApplicationStatus,
  RequirementStatus,
  RecommenderStatus,
  Achievement,
  AchievementId,
} from '../types';
import {
  sampleSchools,
  sampleRequirements,
  sampleRecommenders,
  sampleFunding,
  initialSettings,
  sampleActivityLogs,
} from '../data/sampleData';
import { calculateNetCost, calculateNetValue, getDaysUntilDeadline, getRecommenderInactivity } from '../utils/formatters';

// Automatic one-time cleanup so the user's tracker always starts completely fresh and empty
try {
  if (!localStorage.getItem('gradtrack_clean_v2')) {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('gradtrack_')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.setItem('gradtrack_clean_v2', 'true');
  }
} catch {
  // ignore
}

const STORAGE_KEYS = {
  SCHOOLS: 'gradtrack_schools_v2',
  REQUIREMENTS: 'gradtrack_requirements_v2',
  RECOMMENDERS: 'gradtrack_recommenders_v2',
  FUNDING: 'gradtrack_funding_v2',
  SETTINGS: 'gradtrack_settings_v2',
  ACTIVITIES: 'gradtrack_activities_v2',
  ACHIEVEMENTS: 'gradtrack_achievements_v2',
};

interface AppContextType {
  // State
  schools: School[];
  requirements: Requirement[];
  recommenders: Recommender[];
  funding: Funding[];
  settings: UserSettings;
  activityLogs: ActivityLog[];
  achievements: Achievement[];
  pendingAchievement: Achievement | null;
  activeTab: ActiveTab;
  searchQuery: string;
  selectedSchoolId: string | null;

  // Setters & Navigation
  setActiveTab: (tab: ActiveTab) => void;
  setSearchQuery: (query: string) => void;
  setSelectedSchoolId: (id: string | null) => void;
  dismissAchievement: () => void;

  // School CRUD
  addSchool: (schoolData: Omit<School, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateSchool: (id: string, updates: Partial<School>) => void;
  deleteSchool: (id: string) => void;

  // Requirement CRUD
  addRequirement: (reqData: Omit<Requirement, 'id'>) => void;
  updateRequirement: (id: string, updates: Partial<Requirement>) => void;
  deleteRequirement: (id: string) => void;
  toggleRequirementStatus: (id: string) => void;

  // Recommender CRUD
  addRecommender: (recData: Omit<Recommender, 'id'>) => void;
  updateRecommender: (id: string, updates: Partial<Recommender>) => void;
  deleteRecommender: (id: string) => void;
  updateRecommenderSchoolStatus: (recommenderId: string, schoolId: string, status: RecommenderStatus) => void;

  // Funding CRUD
  setSchoolFunding: (schoolId: string, fundingData: Omit<Funding, 'id' | 'schoolId'>) => void;
  deleteSchoolFunding: (schoolId: string) => void;

  // Settings & System Actions
  updateSettings: (updates: Partial<UserSettings>) => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => { success: boolean; error?: string };
  loadSampleData: () => void;
  clearAllData: () => void;
  addActivityLog: (type: ActivityLog['type'], title: string, description: string) => void;

  // Live Derived Metrics (Zero stale data)
  totalSchools: number;
  statusCounts: Record<ApplicationStatus, number>;
  submittedCount: number;
  inProgressCount: number;
  offersCount: number;
  countriesCount: number;
  upcomingDeadlines: {
    school: School;
    days: number;
    isUrgent: boolean;
    isUpcoming: boolean;
    isOverdue: boolean;
    label: string;
  }[];
  overallCompletionPercentage: number;
  recommenderSummary: {
    total: number;
    confirmedOrSubmitted: number;
    pending: number;
    flaggedInactive: number;
  };
  fundingRankings: {
    school: School;
    funding?: Funding;
    netCost: number;
    netValue: number;
  }[];
  bestFundingOffer: {
    school: School;
    funding: Funding;
    netCost: number;
  } | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or empty fallback (ready for buyers' real data)
  const [schools, setSchools] = useState<School[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHOOLS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [requirements, setRequirements] = useState<Requirement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUIREMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recommenders, setRecommenders] = useState<Recommender[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECOMMENDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [funding, setFunding] = useState<Funding[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FUNDING);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);

  const achievementsRef = useRef<Achievement[]>(achievements);
  useEffect(() => { achievementsRef.current = achievements; }, [achievements]);

  const unlockAchievement = useCallback((id: AchievementId) => {
    if (achievementsRef.current.some(a => a.id === id)) return; // already unlocked
    const newAchievement: Achievement = { id, unlockedAt: new Date().toISOString() };
    setAchievements(prev => [...prev, newAchievement]);
    setPendingAchievement(newAchievement);
  }, []);

  const dismissAchievement = useCallback(() => {
    setPendingAchievement(null);
  }, []);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(schools));
    } catch (e) {
      console.error('Failed to save schools to localStorage', e);
    }
  }, [schools]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUIREMENTS, JSON.stringify(requirements));
    } catch (e) {
      console.error('Failed to save requirements to localStorage', e);
    }
  }, [requirements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECOMMENDERS, JSON.stringify(recommenders));
    } catch (e) {
      console.error('Failed to save recommenders to localStorage', e);
    }
  }, [recommenders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FUNDING, JSON.stringify(funding));
    } catch (e) {
      console.error('Failed to save funding to localStorage', e);
    }
  }, [funding]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activityLogs));
    } catch (e) {
      console.error('Failed to save activity logs to localStorage', e);
    }
  }, [activityLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.error('Failed to save achievements to localStorage', e);
    }
  }, [achievements]);

  // --- AUTO-DETECT ACHIEVEMENTS ---
  useEffect(() => {
    const schoolCount = schools.length;
    const submittedSchools = schools.filter(s => s.status === 'Submitted' || s.status === 'Interview' || s.status === 'Accepted' || s.status === 'Waitlisted');
    const acceptedSchools = schools.filter(s => s.status === 'Accepted');
    const uniqueCountries = new Set(schools.map(s => s.country?.trim()).filter(Boolean)).size;
    const hasFully = funding.some(f => f.amountOffered > 0 && f.tuitionCost > 0 && f.amountOffered >= f.tuitionCost);

    if (schoolCount >= 1) unlockAchievement('first_school');
    if (schoolCount >= 5) unlockAchievement('five_schools');
    if (schoolCount >= 10) unlockAchievement('ten_schools');
    if (submittedSchools.length >= 1) unlockAchievement('first_submission');
    if (acceptedSchools.length >= 1) unlockAchievement('first_offer');
    if (uniqueCountries >= 3) unlockAchievement('global_explorer');
    if (hasFully) unlockAchievement('fully_funded');
  }, [schools, funding, unlockAchievement]);

  // Helper for logging activities
  const addActivityLog = (type: ActivityLog['type'], title: string, description: string) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      type,
      title,
      description,
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]); // keep last 50
  };

  // --- SCHOOL CRUD ---
  const addSchool = (schoolData: Omit<School, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const newId = `school-${Date.now()}`;
    const newSchool: School = {
      ...schoolData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSchools(prev => [newSchool, ...prev]);

    // Automatically create core default requirements for this school
    const ts = Date.now();
    const defaultReqs: Requirement[] = [
      { id: `req-${ts}-1`, schoolId: newId, name: 'Statement of Purpose (SOP)', status: 'Not Started', notes: 'Tailor research objectives to faculty.' },
      { id: `req-${ts}-2`, schoolId: newId, name: 'Official Transcripts', status: 'Not Started', notes: 'Request verified electronic copy.' },
      { id: `req-${ts}-3`, schoolId: newId, name: 'Letters of Recommendation (LOR)', status: 'Not Started', notes: 'Minimum 2-3 academic/industry letters.' },
      { id: `req-${ts}-4`, schoolId: newId, name: 'Resume / Curriculum Vitae', status: 'Not Started', notes: 'Highlight publications & technical projects.' },
      { id: `req-${ts}-5`, schoolId: newId, name: 'IELTS / TOEFL Score', status: 'Not Started', notes: 'English proficiency test result.' },
      { id: `req-${ts}-6`, schoolId: newId, name: 'GRE / GMAT Score', status: 'Not Started', notes: 'Standardized test score (if required).' },
      { id: `req-${ts}-7`, schoolId: newId, name: 'Application Fee Payment', status: 'Not Started', notes: 'Pay the application fee before submission.' },
    ];
    setRequirements(prev => [...prev, ...defaultReqs]);

    addActivityLog('school_added', 'School Added', `Added ${newSchool.name} (${newSchool.program}) to application tracker.`);
    return newId;
  };

  const updateSchool = (id: string, updates: Partial<School>) => {
    setSchools(prev =>
      prev.map(s => {
        if (s.id === id) {
          const updated = { ...s, ...updates, updatedAt: new Date().toISOString() };
          if (updates.status && updates.status !== s.status) {
            addActivityLog(
              'status_change',
              'Status Updated',
              `${s.name} status changed to ${updates.status}.`
            );
          }
          return updated;
        }
        return s;
      })
    );
  };

  const deleteSchool = (id: string) => {
    const schoolToDelete = schools.find(s => s.id === id);
    setSchools(prev => prev.filter(s => s.id !== id));
    // Cascade delete requirements and funding
    setRequirements(prev => prev.filter(r => r.schoolId !== id));
    setFunding(prev => prev.filter(f => f.schoolId !== id));
    // Cascade remove from recommenders
    setRecommenders(prev =>
      prev.map(rec => ({
        ...rec,
        schoolSubmissions: rec.schoolSubmissions.filter(sub => sub.schoolId !== id),
      }))
    );
    if (selectedSchoolId === id) {
      setSelectedSchoolId(null);
    }
    if (schoolToDelete) {
      addActivityLog('school_added', 'School Removed', `Removed ${schoolToDelete.name} from tracker.`);
    }
  };

  // --- REQUIREMENT CRUD ---
  const addRequirement = (reqData: Omit<Requirement, 'id'>) => {
    const newReq: Requirement = {
      ...reqData,
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setRequirements(prev => [...prev, newReq]);
    const school = schools.find(s => s.id === reqData.schoolId);
    addActivityLog('requirement_update', 'Requirement Added', `Added "${newReq.name}" for ${school?.name || 'School'}.`);
  };

  const updateRequirement = (id: string, updates: Partial<Requirement>) => {
    setRequirements(prev =>
      prev.map(r => {
        if (r.id === id) {
          const updated = { ...r, ...updates };
          if (updates.status && updates.status !== r.status) {
            const school = schools.find(s => s.id === r.schoolId);
            addActivityLog(
              'requirement_update',
              'Requirement Progress',
              `"${r.name}" at ${school?.name || 'School'} marked as ${updates.status}.`
            );
          }
          return updated;
        }
        return r;
      })
    );
  };

  const deleteRequirement = (id: string) => {
    setRequirements(prev => prev.filter(r => r.id !== id));
  };

  const toggleRequirementStatus = (id: string) => {
    const cycle: Record<RequirementStatus, RequirementStatus> = {
      'Not Started': 'Draft',
      'Draft': 'Final',
      'Final': 'Submitted',
      'Submitted': 'Not Started',
    };
    setRequirements(prev =>
      prev.map(r => {
        if (r.id === id) {
          const nextStatus = cycle[r.status] || 'Draft';
          const school = schools.find(s => s.id === r.schoolId);
          addActivityLog(
            'requirement_update',
            'Requirement Updated',
            `"${r.name}" for ${school?.name || 'School'} toggled to ${nextStatus}.`
          );
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  // --- RECOMMENDER CRUD ---
  const addRecommender = (recData: Omit<Recommender, 'id'>) => {
    const newRec: Recommender = {
      ...recData,
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setRecommenders(prev => [...prev, newRec]);
    addActivityLog('recommender_update', 'Recommender Added', `Added recommender ${newRec.name} (${newRec.relationship}).`);
  };

  const updateRecommender = (id: string, updates: Partial<Recommender>) => {
    setRecommenders(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, ...updates } : rec))
    );
  };

  const deleteRecommender = (id: string) => {
    setRecommenders(prev => prev.filter(rec => rec.id !== id));
  };

  const updateRecommenderSchoolStatus = (recommenderId: string, schoolId: string, status: RecommenderStatus) => {
    setRecommenders(prev =>
      prev.map(rec => {
        if (rec.id !== recommenderId) return rec;
        const exists = rec.schoolSubmissions.some(s => s.schoolId === schoolId);
        let updatedSubmissions;
        if (exists) {
          updatedSubmissions = rec.schoolSubmissions.map(s =>
            s.schoolId === schoolId ? { ...s, status } : s
          );
        } else {
          updatedSubmissions = [...rec.schoolSubmissions, { schoolId, status }];
        }
        return {
          ...rec,
          schoolSubmissions: updatedSubmissions,
          lastContactedDate: new Date().toISOString().split('T')[0], // update contact date on change
        };
      })
    );
    const rec = recommenders.find(r => r.id === recommenderId);
    const school = schools.find(s => s.id === schoolId);
    addActivityLog(
      'recommender_update',
      'Recommendation Updated',
      `${rec?.name || 'Recommender'} status for ${school?.name || 'School'} is now ${status}.`
    );
  };

  // --- FUNDING CRUD ---
  const setSchoolFunding = (schoolId: string, fundingData: Omit<Funding, 'id' | 'schoolId'>) => {
    setFunding(prev => {
      const existingIndex = prev.findIndex(f => f.schoolId === schoolId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...fundingData,
        };
        return updated;
      } else {
        const newFunding: Funding = {
          ...fundingData,
          id: `fund-${Date.now()}`,
          schoolId,
        };
        return [...prev, newFunding];
      }
    });
    const school = schools.find(s => s.id === schoolId);
    addActivityLog('funding_update', 'Funding Updated', `Updated financial aid and tuition breakdown for ${school?.name || 'School'}.`);
  };

  const deleteSchoolFunding = (schoolId: string) => {
    setFunding(prev => prev.filter(f => f.schoolId !== schoolId));
  };

  // --- SETTINGS & SYSTEM ---
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const exportDataJSON = () => {
    const exportObject = {
      app: 'GradTrack',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        schools,
        requirements,
        recommenders,
        funding,
        settings,
        activityLogs,
      },
    };
    const jsonStr = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanName = (settings.applicantName || 'Applicant').replace(/[^a-zA-Z0-9]/g, '_');
    a.download = `GradTrack_${cleanName}_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonString: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      const data = parsed.data || parsed;
      if (!Array.isArray(data.schools)) {
        return { success: false, error: 'Invalid backup file: "schools" array missing.' };
      }
      setSchools(data.schools || []);
      setRequirements(data.requirements || []);
      setRecommenders(data.recommenders || []);
      setFunding(data.funding || []);
      if (data.settings) setSettings(data.settings);
      if (data.activityLogs) setActivityLogs(data.activityLogs);

      addActivityLog('status_change', 'Data Restored', 'Successfully restored full data backup from JSON file.');
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message || 'Failed to parse JSON file.' };
    }
  };

  const loadSampleData = () => {
    setSchools(sampleSchools);
    setRequirements(sampleRequirements);
    setRecommenders(sampleRecommenders);
    setFunding(sampleFunding);
    setSettings(initialSettings);
    setActivityLogs(sampleActivityLogs);
    addActivityLog('status_change', 'Sample Data Loaded', 'Restored sample universities, requirements, recommenders, and funding packages.');
  };

  const clearAllData = () => {
    setSchools([]);
    setRequirements([]);
    setRecommenders([]);
    setFunding([]);
    setActivityLogs([]);
    setAchievements([]);
    setPendingAchievement(null);
    setSelectedSchoolId(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.SCHOOLS);
      localStorage.removeItem(STORAGE_KEYS.REQUIREMENTS);
      localStorage.removeItem(STORAGE_KEYS.RECOMMENDERS);
      localStorage.removeItem(STORAGE_KEYS.FUNDING);
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    } catch {
      // ignore
    }
  };

  // --- LIVE DERIVED METRICS (Computed at Render Time) ---
  const totalSchools = schools.length;

  const statusCounts = useMemo(() => {
    const counts: Record<ApplicationStatus, number> = {
      Researching: 0,
      'In Progress': 0,
      Submitted: 0,
      Interview: 0,
      Accepted: 0,
      Rejected: 0,
      Waitlisted: 0,
      Declined: 0,
    };
    schools.forEach(s => {
      if (counts[s.status] !== undefined) {
        counts[s.status]++;
      }
    });
    return counts;
  }, [schools]);

  const submittedCount = statusCounts['Submitted'] + statusCounts['Interview'] + statusCounts['Accepted'] + statusCounts['Waitlisted'];
  const inProgressCount = statusCounts['In Progress'];
  const offersCount = statusCounts['Accepted'];

  const countriesCount = useMemo(() => {
    const uniqueCountries = new Set(schools.map(s => s.country?.trim()).filter(Boolean));
    return uniqueCountries.size;
  }, [schools]);

  const upcomingDeadlines = useMemo(() => {
    return schools
      .map(s => {
        const deadlineInfo = getDaysUntilDeadline(s.deadline);
        return {
          school: s,
          ...deadlineInfo,
        };
      })
      .filter(item => item.isUpcoming || item.isOverdue) // within 30 days or overdue
      .sort((a, b) => a.days - b.days);
  }, [schools]);

  const overallCompletionPercentage = useMemo(() => {
    if (requirements.length === 0) return 0;
    const completed = requirements.filter(r => r.status === 'Submitted').length;
    return Math.round((completed / requirements.length) * 100);
  }, [requirements]);

  const recommenderSummary = useMemo(() => {
    let total = recommenders.length;
    let confirmedOrSubmitted = 0;
    let pending = 0;
    let flaggedInactive = 0;

    recommenders.forEach(rec => {
      const inactivity = getRecommenderInactivity(rec.lastContactedDate);
      if (inactivity.isInactive) {
        flaggedInactive++;
      }
      rec.schoolSubmissions.forEach(sub => {
        if (sub.status === 'Submitted' || sub.status === 'Confirmed') {
          confirmedOrSubmitted++;
        } else if (sub.status === 'Requested') {
          pending++;
        }
      });
    });

    return { total, confirmedOrSubmitted, pending, flaggedInactive };
  }, [recommenders]);

  const fundingRankings = useMemo(() => {
    return schools
      .map(school => {
        const schoolFund = funding.find(f => f.schoolId === school.id);
        const tuition = schoolFund?.tuitionCost || 0;
        const living = schoolFund?.estimatedCostOfLiving || 0;
        const offered = schoolFund?.amountOffered || 0;
        const netCost = calculateNetCost(tuition, living, offered);
        const netValue = calculateNetValue(tuition, living, offered);
        return {
          school,
          funding: schoolFund,
          netCost,
          netValue,
        };
      })
      .sort((a, b) => a.netCost - b.netCost); // Lowest net cost first
  }, [schools, funding]);

  const bestFundingOffer = useMemo(() => {
    if (fundingRankings.length === 0) return null;
    const withFunding = fundingRankings.filter(item => (item.funding?.amountOffered || 0) > 0);
    if (withFunding.length === 0) return null;
    return {
      school: withFunding[0].school,
      funding: withFunding[0].funding!,
      netCost: withFunding[0].netCost,
    };
  }, [fundingRankings]);

  return (
    <AppContext.Provider
      value={{
        schools,
        requirements,
        recommenders,
        funding,
        settings,
        activityLogs,
        achievements,
        pendingAchievement,
        activeTab,
        searchQuery,
        selectedSchoolId,
        setActiveTab,
        setSearchQuery,
        setSelectedSchoolId,
        dismissAchievement,
        addSchool,
        updateSchool,
        deleteSchool,
        addRequirement,
        updateRequirement,
        deleteRequirement,
        toggleRequirementStatus,
        addRecommender,
        updateRecommender,
        deleteRecommender,
        updateRecommenderSchoolStatus,
        setSchoolFunding,
        deleteSchoolFunding,
        updateSettings,
        exportDataJSON,
        importDataJSON,
        loadSampleData,
        clearAllData,
        addActivityLog,
        totalSchools,
        statusCounts,
        submittedCount,
        inProgressCount,
        offersCount,
        countriesCount,
        upcomingDeadlines,
        overallCompletionPercentage,
        recommenderSummary,
        fundingRankings,
        bestFundingOffer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
