'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Building2, 
  ClipboardList, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText,
  CheckCircle
} from 'lucide-react';
import StatsCard from '@/components/Dashboard/StatsCard';
import ChartCard from '@/components/Dashboard/ChartCard';
import RecentActivity from '@/components/Dashboard/RecentActivity';


// Définition du type Trend
type Trend = { value: number; direction: "up" | "down" } | undefined;
type Stats = {
  totalEmployees: number;
  totalDepartments: number;
  evaluationsInProgress: number;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const isHR = user?.role === 'RH';
  const isManager = user?.role === 'Manager';

  const [stats, setStats] = useState<Stats | null>(null)
  type ContractExpiringEmployee = {
    id: string | number;
    firstName: string;
    lastName: string;
    position: string;
    contractEndDate: string;
    Typecontract: string;
  };
  
  const [contractsExpiring, setContractsExpiring] = useState<ContractExpiringEmployee[]>([]);
  const [departmentEmployees, setDepartmentEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les statistiques
        const statsResponse = await fetch('http://localhost:7000/staff/stats');
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Récupérer les contrats expirants
        const contractsResponse = await fetch('http://localhost:7000/staff/expired-contracts');
        const contractsData = await contractsResponse.json();
        setContractsExpiring(contractsData);

        // Récupérer les employés par département
        if (user?.departmentId) {
          const employeesResponse = await fetch(`http://localhost:7000/staff/${user.departmentId}`);
          const employeesData = await employeesResponse.json();
          setDepartmentEmployees(employeesData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, [user]);

  type StatColor = "blue" | "green" | "amber" | "red";
  interface StatItem {
    title: string;
    value: number;
    icon: React.ElementType;
    color: StatColor;
    trend: Trend;
  }

  

  const hrStats: StatItem[] = [
    {
      title: 'Total Employés',
      value: stats?.totalEmployees || 0,
      icon: Users,
      color: 'blue',
      trend: { value: 12, direction: 'up' } as Trend 
    },
    {
      title: 'Départements',
      value: stats?.totalDepartments || 0,
      icon: Building2,
      color: 'green',
      trend: undefined
    },
    {
      title: 'Évaluations en cours',
      value: stats?.evaluationsInProgress || 0,
      icon: ClipboardList,
      color: 'amber',
      trend: undefined
    },
    {
      title: 'Contrats expirant',
      value: contractsExpiring.length,
      icon: AlertTriangle,
      color: 'red',
      trend: undefined
    }
  ];

  const managerStats: StatItem[] = [
    {
      title: 'Mon Équipe',
      value: departmentEmployees.length,
      icon: Users,
      color: 'blue',
      trend: undefined
    },
    {
      title: 'Évaluations terminées',
      value: 2, // Remplacez par la valeur réelle si disponible
      icon: CheckCircle,
      color: 'green',
      trend: undefined
    },
    {
      title: 'En cours',
      value: 1, // Remplacez par la valeur réelle si disponible
      icon: ClipboardList,
      color: 'amber',
      trend: undefined
    },
    {
      title: 'À planifier',
      value: 1, // Remplacez par la valeur réelle si disponible
      icon: Calendar,
      color: 'red',
      trend: undefined
    }
  ];

  const statsToShow = isHR ? hrStats : managerStats;

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard {isHR ? 'RH' : 'Manager'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isHR 
            ? 'Vue d\'ensemble de la gestion des ressources humaines' 
            : 'Gestion de votre équipe et évaluations'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsToShow.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="space-y-3">
            {isHR ? (
              <>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3"
                aria-label='Ajouter un employé'>
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Ajouter un employé</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3"
                aria-label='Créer une évaluation'>
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Créer une évaluation</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3"
                aria-label='Gérer les départements'>
                  <Building2 className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Gérer les départements</span>
                </button>
              </>
            ) : (
              <>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3"
                aria-label='Nouvelle évaluation'>
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Nouvelle évaluation</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3"
                aria-label='Voir mon équipe'>
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Voir mon équipe</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3"
                aria-label='Mes statistiques'>
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Mes statistiques</span>
                </button>
              </>
            )}
          </div>
        </div>

        <ChartCard title={isHR ? "Évaluations par mois" : "Progression de l'équipe"}>
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <p>Graphique à venir</p>
            </div>
          </div>
        </ChartCard>

        <RecentActivity />
      </div>

      {isHR && contractsExpiring.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>Contrats expirant dans 7 jours</span>
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {contractsExpiring.map((employee) => (
              <div key={employee.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{employee.position}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-amber-600">
                    {new Date(employee.contractEndDate).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-xs text-gray-500">{employee.Typecontract}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
