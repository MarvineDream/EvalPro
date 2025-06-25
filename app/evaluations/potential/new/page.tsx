'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  FileText,
  Calendar,
  User,
} from 'lucide-react';
import {
  getEvaluationsWithEmployee,
  mockMidTermEvaluations,
  mockPotentialEvaluations,
} from '@/lib/mock-data';

const EvaluationsPage = () => {
  const { user } = useAuth();
  const isHR = user?.role === 'RH';

  const [activeTab, setActiveTab] = useState<'midterm' | 'potential' | 'final'>('midterm');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [midTermEvaluations, setMidTermEvaluations] = useState<any[]>([]);
  const [potentialEvaluations, setPotentialEvaluations] = useState<any[]>([]);

  useEffect(() => {
    const midterms = getEvaluationsWithEmployee();
    setMidTermEvaluations(midterms);

    const potentials = mockPotentialEvaluations.map((evaluation) => ({
      ...evaluation,
      employee: evaluation.employee || mockMidTermEvaluations.find((me) => me.employeeId === evaluation.employeeId)?.employee,
    }));
    setPotentialEvaluations(potentials);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TERMINEE':
        return 'bg-green-100 text-green-800';
      case 'EN_COURS':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TERMINEE':
        return <CheckCircle className="h-4 w-4" aria-hidden="true" />;
      case 'EN_COURS':
        return <Clock className="h-4 w-4" aria-hidden="true" />;
      default:
        return <AlertTriangle className="h-4 w-4" aria-hidden="true" />;
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'POTENTIAL':
        return 'bg-purple-100 text-purple-800';
      case 'ACHIEVER':
        return 'bg-blue-100 text-blue-800';
      case 'PROFESSIONAL':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR');
  };

  const filterEvaluations = (evaluations: any[]) => {
    return evaluations.filter((e) => {
      const matchesSearch =
        `${e.employee?.firstName ?? ''} ${e.employee?.lastName ?? ''}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || e.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const renderMidTermEvaluations = () => {
    const filtered = filterEvaluations(midTermEvaluations);
    return (
      <div className="space-y-4">
        {filtered.map((evaluation) => (
          <div key={evaluation.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6 flex items-start justify-between">
              <div className="flex space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <ClipboardList className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Évaluation Mi-parcours - {evaluation.period}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(evaluation.status)}`}>
                      {getStatusIcon(evaluation.status)}
                      <span>{evaluation.status === 'TERMINEE' ? 'Terminée' : 'En cours'}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2"><User className="h-4 w-4" aria-hidden="true" /><span>{evaluation.employee?.firstName} {evaluation.employee?.lastName}</span></div>
                    <div className="flex items-center space-x-2"><Calendar className="h-4 w-4" aria-hidden="true" /><span>Créée le {formatDate(evaluation.createdAt)}</span></div>
                    <div className="flex items-center space-x-2"><Star className="h-4 w-4" aria-hidden="true" /><span>Note globale: {evaluation.globalAppreciation}/5</span></div>
                  </div>
                  <p className="text-sm text-gray-700 mt-3">{evaluation.objectives.length} objectif(s) • {evaluation.objectives.filter((obj: { completed: boolean }) => obj.completed).length
} terminé(s)</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  aria-label="Voir l'évaluation"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </button>
                {(isHR || evaluation.evaluatorId === user?.id) && (
                  <button
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                    aria-label="Modifier l'évaluation"
                  >
                    <Edit className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPotentialEvaluations = () => {
    const filtered = filterEvaluations(potentialEvaluations);
    return (
      <div className="space-y-4">
        {filtered.map((evaluation) => (
          <div key={evaluation.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6 flex items-start justify-between">
              <div className="flex space-x-4">
                <div className="p-3 bg-purple-50 rounded-lg"><Star className="h-6 w-6 text-purple-600" aria-hidden="true" /></div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Évaluation de Potentiel</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getClassificationColor(evaluation.classification)}`}>
                      {evaluation.classification}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2"><User className="h-4 w-4" aria-hidden="true" /><span>{evaluation.employee?.firstName} {evaluation.employee?.lastName}</span></div>
                    <div className="flex items-center space-x-2"><Calendar className="h-4 w-4" aria-hidden="true" /><span>Créée le {formatDate(evaluation.createdAt)}</span></div>
                    <div className="flex items-center space-x-2"><Star className="h-4 w-4" aria-hidden="true" /><span>Score final: {evaluation.finalScore}/5</span></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                    <div className="text-center p-2 bg-blue-50 rounded"><div className="font-medium text-blue-700">{evaluation.criteria.leadership}</div><div className="text-blue-600">Leadership</div></div>
                    <div className="text-center p-2 bg-green-50 rounded"><div className="font-medium text-green-700">{evaluation.criteria.communication}</div><div className="text-green-600">Communication</div></div>
                    <div className="text-center p-2 bg-purple-50 rounded"><div className="font-medium text-purple-700">{evaluation.criteria.innovation}</div><div className="text-purple-600">Innovation</div></div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  aria-label="Voir l'évaluation de potentiel"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </button>
                {isHR && (
                  <button
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                    aria-label="Modifier l'évaluation de potentiel"
                  >
                    <Edit className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="px-10 py-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Mes évaluations</h1>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('midterm')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeTab === 'midterm' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            aria-label="Onglet Évaluations Mi-parcours"
          >
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
            <span>Mi-parcours</span>
          </button>
          <button
            onClick={() => setActiveTab('potential')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeTab === 'potential' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            aria-label="Onglet Évaluations de Potentiel"
          >
            <Star className="h-5 w-5" aria-hidden="true" />
            <span>Potentiel</span>
          </button>
          <button
            onClick={() => setActiveTab('final')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeTab === 'final' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            aria-label="Onglet Évaluations Finales"
          >
            <FileText className="h-5 w-5" aria-hidden="true" />
            <span>Finales</span>
          </button>
        </div>

        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un collaborateur..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Recherche collaborateur"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>

          <button
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            aria-label="Filtrer par statut"
          >
            <Filter className="h-5 w-5" aria-hidden="true" />
          </button>

          {isHR && (
            <button
              className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-1"
              aria-label="Créer une nouvelle évaluation"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              <span>Ajouter</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'midterm' && renderMidTermEvaluations()}
      {activeTab === 'potential' && renderPotentialEvaluations()}
      {activeTab === 'final' && (
        <div className="text-center text-gray-500">Pas d’évaluations finales disponibles.</div>
      )}
    </main>
  );
};

export default EvaluationsPage;