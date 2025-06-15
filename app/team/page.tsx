'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Search, 
  Calendar,
  Star,
  ClipboardList,
  Eye,
  Plus,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { getEmployeesByDepartment, getEvaluationsWithEmployee } from '@/lib/mock-data';

const TeamPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const isManager = user?.role === 'Manager';
  
  if (!isManager || !user?.departmentId) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accès restreint</h3>
          <p className="text-gray-600">
            Cette page est réservée aux managers avec un département assigné.
          </p>
        </div>
      </div>
    );
  }

  const teamMembers = getEmployeesByDepartment(user.departmentId);
  const evaluations = getEvaluationsWithEmployee();
  
  const filteredTeamMembers = teamMembers.filter(member =>
    member.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEmployeeEvaluations = (employeeId: string) => {
    return evaluations.filter(evaluation => evaluation.employeeId === employeeId);
  };

  const getLastEvaluationScore = (employeeId: string) => {
    const empEvaluations = getEmployeeEvaluations(employeeId);
    if (empEvaluations.length === 0) return null;
    
    const lastEval = empEvaluations.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    
    return lastEval.globalAppreciation;
  };

  const getContractStatusColor = (employee: any) => {
    if (!employee.contractEndDate) return 'text-green-600';
    
    const daysUntilExpiry = Math.ceil((employee.contractEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 7) return 'text-red-600';
    if (daysUntilExpiry <= 30) return 'text-amber-600';
    return 'text-green-600';
  };

  const teamStats = {
    totalMembers: teamMembers.length,
    evaluationsCompleted: evaluations.filter(evaluation => evaluation.status === 'TERMINEE').length,
    evaluationsInProgress: evaluations.filter(evaluation => evaluation.status === 'EN_COURS').length,
    averageScore: evaluations.length > 0 
      ? (evaluations.reduce((sum, evaluation) => sum + evaluation.globalAppreciation, 0) / evaluations.length).toFixed(1)
      : 'N/A'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <span>Mon Équipe</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez et suivez les performances de votre équipe
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
            <Plus className="h-5 w-5" />
            <span>Nouvelle évaluation</span>
          </button>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Membres d&apos;équipe</p>
              <p className="text-3xl font-bold text-gray-900">{teamStats.totalMembers}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Évaluations terminées</p>
              <p className="text-3xl font-bold text-gray-900">{teamStats.evaluationsCompleted}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <ClipboardList className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-3xl font-bold text-gray-900">{teamStats.evaluationsInProgress}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Score moyen</p>
              <p className="text-3xl font-bold text-gray-900">{teamStats.averageScore}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un membre de l'équipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeamMembers.map((member) => {
          const lastScore = getLastEvaluationScore(member.id);
          const memberEvaluations = getEmployeeEvaluations(member.id);
          
          return (
            <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Member Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-lg font-medium text-white">
                        {member.prenom[0]}{member.nom[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {member.prenom} {member.nom}
                      </h3>
                      <p className="text-sm text-gray-600">{member.position}</p>
                    </div>
                  </div>
                  <button 
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Voir les détails du membre"
                    aria-label="Voir les détails du membre"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>

                {/* Member Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Contrat</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {member.contractType}
                      </span>
                      {member.contractEndDate && (
                        <p className={`text-xs ${getContractStatusColor(member)}`}>
                          Expire le {member.contractEndDate.toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dernière évaluation</span>
                    <div className="text-right">
                      {lastScore ? (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900">
                            {lastScore}/5
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Aucune</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Évaluations</span>
                    <span className="text-sm font-medium text-gray-900">
                      {memberEvaluations.length} total
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ancienneté</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.floor((new Date().getTime() - member.contractStartDate.getTime()) / (1000 * 60 * 60 * 24 * 30))} mois
                    </span>
                  </div>
                </div>

                {/* Performance Indicator */}
                {lastScore && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Performance</span>
                      <span className="text-sm text-gray-600">{lastScore}/5</span>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          lastScore >= 4 ? 'bg-green-500' : 
                          lastScore >= 3 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        data-score={lastScore}
                      ></div>
                    </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                      Voir profil
                    </button>
                    <button className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                      Évaluer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTeamMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre trouvé</h3>
          <p className="text-gray-600">
            Aucun membre de l&apos;équipe ne correspond à votre recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamPage;