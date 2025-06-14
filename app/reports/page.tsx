'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  Download, 
  Filter,
  Calendar,
  Users,
  TrendingUp,
  PieChart,
  FileText,
  Building2,
  Star,
  ClipboardList
} from 'lucide-react';
import { mockDashboardStats, mockDepartments } from '@/lib/mock-data';

const ReportsPage = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedReport, setSelectedReport] = useState('overview');

  const isHR = user?.role === 'RH';

  if (!isHR) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accès restreint</h3>
          <p className="text-gray-600">
            Seuls les RH peuvent accéder aux rapports.
          </p>
        </div>
      </div>
    );
  }

  const stats = mockDashboardStats;

  const reportTypes = [
    {
      id: 'overview',
      name: 'Vue d\'ensemble',
      icon: BarChart3,
      description: 'Statistiques générales de l\'entreprise'
    },
    {
      id: 'evaluations',
      name: 'Évaluations',
      icon: ClipboardList,
      description: 'Rapport sur les évaluations'
    },
    {
      id: 'departments',
      name: 'Départements',
      icon: Building2,
      description: 'Analyse par département'
    },
    {
      id: 'contracts',
      name: 'Contrats',
      icon: FileText,
      description: 'Suivi des contrats'
    },
    {
      id: 'performance',
      name: 'Performance',
      icon: Star,
      description: 'Analyse des performances'
    }
  ];

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employés</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
              <p className="text-sm text-green-600 mt-1">+12% vs année précédente</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Départements</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDepartments}</p>
              <p className="text-sm text-gray-500 mt-1">Stable</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Évaluations</p>
              <p className="text-3xl font-bold text-gray-900">{stats.evaluationsCompleted}</p>
              <p className="text-sm text-amber-600 mt-1">{stats.evaluationsInProgress} en cours</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <ClipboardList className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contrats à renouveler</p>
              <p className="text-3xl font-bold text-gray-900">{stats.contractsExpiringSoon}</p>
              <p className="text-sm text-red-600 mt-1">Dans les 30 jours</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par département</h3>
          <div className="space-y-3">
            {stats.departmentBreakdown.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{dept.department}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(dept.count / stats.totalEmployees) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{dept.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contract Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Types de contrats</h3>
          <div className="space-y-3">
            {stats.contractTypeBreakdown.map((contract, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{contract.type}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(contract.count / stats.totalEmployees) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{contract.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluations Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Évaluations par mois</h3>
        <div className="flex items-end space-x-4 h-64">
          {stats.evaluationsByMonth.map((month, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-600 rounded-t"
                style={{ height: `${(month.count / 3) * 100}%`, minHeight: '4px' }}
              ></div>
              <div className="mt-2 text-sm text-gray-600">{month.month}</div>
              <div className="text-xs text-gray-500">{month.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEvaluationsReport = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Rapport des évaluations</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-700">{stats.evaluationsCompleted}</div>
          <div className="text-sm text-green-600">Évaluations terminées</div>
        </div>
        <div className="text-center p-4 bg-amber-50 rounded-lg">
          <div className="text-2xl font-bold text-amber-700">{stats.evaluationsInProgress}</div>
          <div className="text-sm text-amber-600">En cours</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-700">1</div>
          <div className="text-sm text-red-600">En retard</div>
        </div>
      </div>
    </div>
  );

  const renderDepartmentsReport = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse par département</h3>
      <div className="space-y-4">
        {mockDepartments.map((dept) => {
          const deptStats = stats.departmentBreakdown.find(d => d.department === dept.name);
          return (
            <div key={dept.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{dept.name}</h4>
                <span className="text-sm text-gray-600">{deptStats?.count || 0} employés</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderContractsReport = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Suivi des contrats</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Contrats expirant bientôt</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Dans 7 jours</span>
              <span className="font-medium text-red-600">1</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Dans 30 jours</span>
              <span className="font-medium text-amber-600">{stats.contractsExpiringSoon}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Types de contrats</h4>
          <div className="space-y-2">
            {stats.contractTypeBreakdown.map((contract, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{contract.type}</span>
                <span className="font-medium">{contract.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceReport = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse des performances</h3>
      <div className="text-center py-8">
        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Rapport de performance en cours de développement</p>
      </div>
    </div>
  );

  const renderReport = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport();
      case 'evaluations':
        return renderEvaluationsReport();
      case 'departments':
        return renderDepartmentsReport();
      case 'contracts':
        return renderContractsReport();
      case 'performance':
        return renderPerformanceReport();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span>Rapports et Analyses</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Consultez les statistiques et analyses de votre entreprise
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
            <Download className="h-5 w-5" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label='Sélectionner une période'
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="Q1-2024">Q1 2024</option>
              <option value="Q2-2024">Q2 2024</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Département
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label='Sélectionner un département'
            >
              <option value="">Tous les départements</option>
              {mockDepartments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
              <Filter className="h-5 w-5" />
              <span>Appliquer les filtres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {reportTypes.map((report) => {
              const IconComponent = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                    selectedReport === report.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{report.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderReport()}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;