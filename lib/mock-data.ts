import { Department, Employee, EvaluationMidTerm, EvaluationPotential, DashboardStats } from './types';

export const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Informatique',
    managerId: '2',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'dept-2',
    name: 'Ressources Humaines',
    managerId: '1',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'dept-3',
    name: 'Marketing',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'dept-4',
    name: 'Finance',
    createdAt: new Date('2024-01-01')
  }
];

export const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    employeeId: 'EMP001',
    firstName: 'Sophie',
    lastName: 'Leroy',
    email: 'sophie.leroy@company.com',
    position: 'Développeur Senior',
    departmentId: 'dept-1',
    contractType: 'CDI',
    contractStartDate: new Date('2023-03-15'),
    salary: 55000,
    managerId: '2',
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'emp-2',
    employeeId: 'EMP002',
    firstName: 'Thomas',
    lastName: 'Bernard',
    email: 'thomas.bernard@company.com',
    position: 'Analyste Business',
    departmentId: 'dept-1',
    contractType: 'CDI',
    contractStartDate: new Date('2023-06-01'),
    salary: 48000,
    managerId: '2',
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'emp-3',
    employeeId: 'EMP003',
    firstName: 'Emma',
    lastName: 'Rousseau',
    email: 'emma.rousseau@company.com',
    position: 'Designer UX/UI',
    departmentId: 'dept-3',
    contractType: 'CDD',
    contractStartDate: new Date('2024-01-15'),
    contractEndDate: new Date('2025-01-14'),
    salary: 42000,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'emp-4',
    employeeId: 'EMP004',
    firstName: 'Lucas',
    lastName: 'Moreau',
    email: 'lucas.moreau@company.com',
    position: 'Comptable',
    departmentId: 'dept-4',
    contractType: 'CDI',
    contractStartDate: new Date('2022-09-01'),
    salary: 38000,
    createdAt: new Date('2022-09-01'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: 'emp-5',
    employeeId: 'EMP005',
    firstName: 'Camille',
    lastName: 'Petit',
    email: 'camille.petit@company.com',
    position: 'Stagiaire Marketing',
    departmentId: 'dept-3',
    contractType: 'STAGE',
    contractStartDate: new Date('2024-02-01'),
    contractEndDate: new Date('2024-07-31'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
];

export const mockMidTermEvaluations: EvaluationMidTerm[] = [
  {
    id: 'eval-mid-1',
    employeeId: 'emp-1',
    evaluatorId: '2',
    period: 'T1 2024',
    status: 'TERMINEE',
    objectives: [
      {
        id: 'obj-1',
        objective: 'Développer le module de facturation',
        targetDate: new Date('2024-03-31'),
        achievement: 5,
        comment: 'Excellent travail, livré en avance',
        completed: true
      },
      {
        id: 'obj-2',
        objective: 'Former 2 développeurs juniors',
        targetDate: new Date('2024-02-28'),
        achievement: 4,
        comment: 'Très bon mentoring',
        completed: true
      }
    ],
    professionalIntegration: 5,
    competencies: {
      knowledge: 5,
      skills: 4,
      behavior: 5,
      discipline: 5
    },
    globalAppreciation: 5,
    managerComment: 'Employé exemplaire, très autonome et proactif',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-30')
  },
  {
    id: 'eval-mid-2',
    employeeId: 'emp-2',
    evaluatorId: '2',
    period: 'T1 2024',
    status: 'EN_COURS',
    objectives: [
      {
        id: 'obj-3',
        objective: 'Analyser les processus métier',
        targetDate: new Date('2024-04-15'),
        achievement: 3,
        comment: 'En bonne voie',
        completed: false
      }
    ],
    professionalIntegration: 4,
    competencies: {
      knowledge: 4,
      skills: 3,
      behavior: 4,
      discipline: 4
    },
    globalAppreciation: 4,
    managerComment: 'Progresse bien, besoin d\'accompagnement sur certains aspects techniques',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-05')
  }
];

export const mockPotentialEvaluations: EvaluationPotential[] = [
  {
    id: 'eval-pot-1',
    employeeId: 'emp-1',
    evaluatorId: '1',
    criteria: {
      leadership: 5,
      communication: 4,
      problemSolving: 5,
      adaptability: 4,
      innovation: 5,
      teamwork: 5
    },
    finalScore: 4.7,
    classification: 'POTENTIAL',
    hrComment: 'Candidat idéal pour un poste de lead technique ou management',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
];

export const mockDashboardStats: DashboardStats = {
  totalEmployees: 5,
  totalDepartments: 4,
  contractsExpiringSoon: 2,
  evaluationsInProgress: 3,
  evaluationsCompleted: 2,
  departmentBreakdown: [
    { department: 'Informatique', count: 2 },
    { department: 'Marketing', count: 2 },
    { department: 'Finance', count: 1 },
    { department: 'RH', count: 0 }
  ],
  contractTypeBreakdown: [
    { type: 'CDI', count: 3 },
    { type: 'CDD', count: 1 },
    { type: 'STAGE', count: 1 },
    { type: 'CONSULTANT', count: 0 }
  ],
  evaluationsByMonth: [
    { month: 'Jan', count: 2 },
    { month: 'Fév', count: 3 },
    { month: 'Mar', count: 1 },
    { month: 'Avr', count: 0 }
  ]
};

// Helper functions to get data with relationships
export const getEmployeesWithDepartments = () => {
  return mockEmployees.map(emp => ({
    ...emp,
    department: mockDepartments.find(dept => dept.id === emp.departmentId)
  }));
};

export const getEvaluationsWithEmployee = () => {
  return mockMidTermEvaluations.map(evaluation => ({
    ...evaluation,
    employee: mockEmployees.find(emp => emp.id === evaluation.employeeId)
  }));
};

export const getEmployeesByDepartment = (departmentId: string) => {
  return getEmployeesWithDepartments().filter(emp => emp.departmentId === departmentId);
};

export const getContractsExpiringSoon = (days: number = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);
  
  return mockEmployees.filter(emp => 
    emp.contractEndDate && emp.contractEndDate <= cutoffDate
  );
};