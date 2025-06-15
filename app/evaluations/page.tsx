'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  // autres propriétés...
};


export default function EvaluationsPage() {
  /* ---------------------------------------------------------------------- */
  /* Contexte & états                                                       */
  /* ---------------------------------------------------------------------- */
  const { user } = useAuth();
  const isHR = user?.role === 'RH';


  const [activeTab, setActiveTab] =
    useState<'midterm' | 'potential' | 'final'>('midterm');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [open, setOpen] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* Données                                                                */
  /* ---------------------------------------------------------------------- */
  const midTermEvaluations = getEvaluationsWithEmployee();

  const potentialEvaluations = mockPotentialEvaluations.map((evaluation) => ({
    ...evaluation,
    employee:
      evaluation.employee ??
      mockMidTermEvaluations.find(
        (me) => me.employeeId === evaluation.employeeId,
      )?.employee,
  }));

  /* ---------------------------------------------------------------------- */
  /* Helpers d'affichage                                                    */
  /* ---------------------------------------------------------------------- */
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
        return <CheckCircle className="h-4 w-4" />;
      case 'EN_COURS':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
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

  /* ---------------------------------------------------------------------- */
  /* Rendus spécialisés                                                     */
  /* ---------------------------------------------------------------------- */
  const renderMidTermEvaluations = () => (
    <div className="space-y-4">
      {midTermEvaluations.map((evaluation) => (
        <div
          key={evaluation.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              {/* Colonne gauche ------------------------------------------------ */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>

                <div className="flex-1">
                  {/* Titre + statut ------------------------------------------ */}
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Évaluation Mi-parcours – {evaluation.period}
                    </h3>
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        evaluation.status,
                      )}`}
                    >
                      {getStatusIcon(evaluation.status)}
                      <span>
                        {evaluation.status === 'TERMINEE' ? 'Terminée' : 'En cours'}
                      </span>
                    </span>
                  </div>

                  {/* Métadonnées --------------------------------------------- */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>
                        {evaluation.employee?.firstName}{' '}
                        {evaluation.employee?.lastName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Créée le{' '}
                        {evaluation.createdAt.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span>Note globale : {evaluation.globalAppreciation}/5</span>
                    </div>
                  </div>

                  {/* Objectifs ------------------------------------------------ */}
                  <div className="mt-3">
                    <p className="text-sm text-gray-700">
                      {evaluation.objectives.length} objectif(s) •{' '}
                      {evaluation.objectives.filter((o) => o.completed).length}{' '}
                      terminé(s)
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions ------------------------------------------------------ */}
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  <Eye className="h-4 w-4" />
                </button>
                {(isHR || evaluation.evaluatorId === user?.id) && (
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPotentialEvaluations = () => (
    <div className="space-y-4">
      {potentialEvaluations.map((evaluation) => (
        <div
          key={evaluation.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Évaluation de Potentiel
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getClassificationColor(
                        evaluation.classification,
                      )}`}
                    >
                      {evaluation.classification}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>
                        {evaluation.employee?.firstName}{' '}
                        {evaluation.employee?.lastName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Créée le{' '}
                        {evaluation.createdAt.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span>Score final : {evaluation.finalScore}/5</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-medium text-blue-700">
                          {evaluation.criteria.leadership}
                        </div>
                        <div className="text-blue-600">Leadership</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-medium text-green-700">
                          {evaluation.criteria.communication}
                        </div>
                        <div className="text-green-600">Communication</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="font-medium text-purple-700">
                          {evaluation.criteria.innovation}
                        </div>
                        <div className="text-purple-600">Innovation</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  <Eye className="h-4 w-4" />
                </button>
                {isHR && (
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFinalEvaluations = () => (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Évaluations finales</h3>
      <p className="text-gray-600 mb-4">
        Les évaluations finales combinent les évaluations mi-parcours et de potentiel.
      </p>
      {isHR && (
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Créer une évaluation finale
        </button>
      )}
    </div>
  );

  /* ---------------------------------------------------------------------- */
  /* Rendu principal                                                        */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="p-6 space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* En-tête de page                                                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <ClipboardList className="h-8 w-8 text-blue-600" />
              <span>Évaluations</span>
            </h1>
            <p className="text-gray-600 mt-2">
              {isHR
                ? 'Gérez toutes les évaluations des employés'
                : 'Consultez et gérez vos évaluations'}
            </p>
          </div>

          {/* Bouton "Nouvelle évaluation" -------------------------------- */}
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Nouvelle évaluation</span>
          </button>
        </div>

        {/* Popup choix Mi-parcours / Potentiel ---------------------------- */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-semibold mb-4">Type d'évaluation</h2>
              <div className="flex flex-col space-y-3">
                <Link
                  href="/evaluations/midterm/new"
                  onClick={() => setOpen(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-center px-4 py-2 rounded"
                >
                  Mi-parcours
                </Link>
                <Link
                  href="/evaluations/potential/new"
                  onClick={() => setOpen(false)}
                  className="bg-green-500 hover:bg-green-600 text-white text-center px-4 py-2 rounded"
                >
                  Potentiel
                </Link>
                <button
                  className="text-sm text-gray-500 hover:text-gray-700 mt-4"
                  onClick={() => setOpen(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Carte avec onglets                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Onglets --------------------------------------------------------- */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('midterm')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'midterm'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mi-parcours ({midTermEvaluations.length})
            </button>
            <button
              onClick={() => setActiveTab('potential')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'potential'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Potentiel ({potentialEvaluations.length})
            </button>
            <button
              onClick={() => setActiveTab('final')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'final'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Finales (0)
            </button>
          </nav>
        </div>

        {/* Filtres --------------------------------------------------------- */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une évaluation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINEE">Terminée</option>
            </select>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {activeTab === 'midterm' && `${midTermEvaluations.length} évaluation(s)`}
                {activeTab === 'potential' &&
                  `${potentialEvaluations.length} évaluation(s)`}
                {activeTab === 'final' && '0 évaluation(s)'}
              </span>
            </div>
          </div>
        </div>

        {/* Contenu --------------------------------------------------------- */}
        <div className="p-6">
          {activeTab === 'midterm' && renderMidTermEvaluations()}
          {activeTab === 'potential' && renderPotentialEvaluations()}
          {activeTab === 'final' && renderFinalEvaluations()}
        </div>
      </div>
    </div>
  );
}