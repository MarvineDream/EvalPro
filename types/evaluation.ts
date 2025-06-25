import { Employee } from './employee';

export interface MidTermEvaluation {
  id: string;
  employeeId: string;
  employee: Employee;
  evaluatorId: string;
  period: string;
  status: 'TERMINEE' | 'EN_COURS';
  objectives: {
    completed: boolean;
  }[];
  createdAt: Date;
  globalAppreciation: number;
}

export interface PotentialEvaluation {
  id: string;
  employeeId: string;
  employee: Employee;
  classification: string;
  finalScore: number;
  criteria: {
    leadership: number;
    communication: number;
    innovation: number;
  };
  createdAt: Date;
}
