export interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  role: 'RH' | 'Manager';
  departmentId?: string;
  createdAt: Date;
  lastLogin?: Date;
  token?: string;
}

export interface Department {
  id: string;
  name: string;
  managerId?: string;
  createdAt: Date;
}

export interface Employee {
  _id: string;
  employeeId: string;
  prenom: string;
  nom: string;
  email: string;
  poste: string;
  departmentId: string;
  department?: Department;
  contractType: 'CDI' | 'CDD' | 'stagiaire' | 'consultant';
  contractStartDate: Date;
  contractEndDate?: Date;
  salary?: number;
  managerId?: string;
  manager?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface EvaluationMidTerm {
  id: string;
  employeeId: string;
  employee?: Employee;
  evaluatorId: string;
  evaluator?: User;
  period: string;
  status: 'EN_COURS' | 'TERMINEE';
  objectives: ObjectiveEvaluation[];
  professionalIntegration: number; // 1-5
  competencies: {
    knowledge: number; // 1-5
    skills: number; // 1-5
    behavior: number; // 1-5
    discipline: number; // 1-5
  };
  globalAppreciation: number; // 1-5
  managerComment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ObjectiveEvaluation {
  id: string;
  objective: string;
  targetDate: Date;
  achievement: number; // 1-5
  comment: string;
  completed: boolean;
}

export interface EvaluationPotential {
  id: string;
  employeeId: string;
  employee?: Employee;
  evaluatorId: string;
  evaluator?: User;
  criteria: {
    leadership: number; // 1-5
    communication: number; // 1-5
    problemSolving: number; // 1-5
    adaptability: number; // 1-5
    innovation: number; // 1-5
    teamwork: number; // 1-5
  };
  finalScore: number;
  classification: 'POTENTIAL' | 'ACHIEVER' | 'PROFESSIONAL';
  hrComment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EvaluationFinal {
  id: string;
  employeeId: string;
  employee?: Employee;
  midTermEvaluationId: string;
  midTermEvaluation?: EvaluationMidTerm;
  potentialEvaluationId: string;
  potentialEvaluation?: EvaluationPotential;
  finalScore: number;
  hrComment: string;
  approved: boolean;
  signedAt?: Date;
  pdfPath?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  contractsExpiringSoon: number;
  evaluationsInProgress: number;
  evaluationsCompleted: number;
  departmentBreakdown: { department: string; count: number }[];
  contractTypeBreakdown: { type: string; count: number }[];
  evaluationsByMonth: { month: string; count: number }[];
}

export interface AuthContext {
  user: User | null;
  login: (email: string, password: string) => Promise<{ token: string; user: User } | null>;
  logout: () => void;
  loading: boolean;
}
