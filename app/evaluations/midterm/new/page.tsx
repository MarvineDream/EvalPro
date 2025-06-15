'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ClipboardList, 
  Save, 
  Plus, 
  Trash2, 
  Calendar,
  User,
  Target,
  Star,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { mockEmployees, getEmployeesByDepartment } from '@/lib/mock-data';

const NewMidTermEvaluationPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [period, setPeriod] = useState('');
  const [objectives, setObjectives] = useState([
    { objective: '', targetDate: '', achievement: 1, comment: '', completed: false }
  ]);
  const [professionalIntegration, setProfessionalIntegration] = useState(1);
  const [competencies, setCompetencies] = useState({
    knowledge: 1,
    skills: 1,
    behavior: 1,
    discipline: 1
  });
  const [globalAppreciation, setGlobalAppreciation] = useState(1);
  const [managerComment, setManagerComment] = useState('');

  const isHR = user?.role === 'RH';
  
  // Get employees based on user role
  const availableEmployees = isHR 
    ? mockEmployees 
    : user?.departmentId 
      ? getEmployeesByDepartment(user.departmentId)
      : [];

  const addObjective = () => {
    setObjectives([
      ...objectives,
      { objective: '', targetDate: '', achievement: 1, comment: '', completed: false }
    ]);
  };

  const removeObjective = (index: number) => {
    if (objectives.length > 1) {
      setObjectives(objectives.filter((_, i) => i !== index));
    }
  };

  const updateObjective = (index: number, field: string, value: any) => {
    const updated = objectives.map((obj, i) => 
      i === index ? { ...obj, [field]: value } : obj
    );
    setObjectives(updated);
  };

  const updateCompetency = (field: string, value: number) => {
    setCompetencies(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (status: 'EN_COURS' | 'TERMINEE') => {
    // Here you would save the evaluation
    console.log('Saving evaluation with status:', status);
    router.push('/evaluations');
  };

  const renderStarRating = (value: number, onChange: (value: number) => void) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`p-1 rounded transition-colors duration-200 ${
            star <= value 
              ? 'text-yellow-400 hover:text-yellow-500' 
              : 'text-gray-300 hover:text-gray-400'
          }`}
          aria-label={`Évaluer ${star} étoile${star > 1 ? 's' : ''}`}
        >
          <Star className="h-5 w-5 fill-current" />
        </button>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <ClipboardList className="h-8 w-8 text-blue-600" />
              <span>Nouvelle Évaluation Mi-parcours</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Créez une nouvelle évaluation progressive pour un employé
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Informations de base</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employé à évaluer
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Sélectionner un employé"
                  required
                >
                  <option value="">Sélectionner un employé</option>
                  {availableEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.prenom} {emp.nom} - {emp.poste}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période d&apos;évaluation
                </label>
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="Ex: T1 2024, Janvier 2024..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>Objectifs</span>
              </h3>
              <button
                onClick={addObjective}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter</span>
              </button>
            </div>

            <div className="space-y-4">
              {objectives.map((obj, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Objectif {index + 1}</h4>
                    {objectives.length > 1 && (
                      <button
                        onClick={() => removeObjective(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                        aria-label="Supprimer l'objectif"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description de l&apos;objectif
                      </label>
                      <textarea
                        value={obj.objective}
                        onChange={(e) => updateObjective(index, 'objective', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Décrivez l'objectif..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date cible
                      </label>
                      <input
                        type="date"
                        value={obj.targetDate}
                        onChange={(e) => updateObjective(index, 'targetDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Sélectionner une date cible"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Réalisation (1-5)
                      </label>
                      <div className="flex items-center space-x-2">
                        {renderStarRating(obj.achievement, (value) => updateObjective(index, 'achievement', value))}
                        <span className="text-sm text-gray-600">({obj.achievement}/5)</span>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commentaire
                      </label>
                      <textarea
                        value={obj.comment}
                        onChange={(e) => updateObjective(index, 'comment', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Commentaire sur la réalisation..."
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={obj.completed}
                          onChange={(e) => updateObjective(index, 'completed', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Objectif terminé</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competencies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-600" />
              <span>Compétences</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Savoir (Connaissances)
                </label>
                <div className="flex items-center space-x-2">
                  {renderStarRating(competencies.knowledge, (value) => updateCompetency('knowledge', value))}
                  <span className="text-sm text-gray-600">({competencies.knowledge}/5)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Savoir-faire (Compétences)
                </label>
                <div className="flex items-center space-x-2">
                  {renderStarRating(competencies.skills, (value) => updateCompetency('skills', value))}
                  <span className="text-sm text-gray-600">({competencies.skills}/5)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Savoir-être (Comportement)
                </label>
                <div className="flex items-center space-x-2">
                  {renderStarRating(competencies.behavior, (value) => updateCompetency('behavior', value))}
                  <span className="text-sm text-gray-600">({competencies.behavior}/5)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discipline
                </label>
                <div className="flex items-center space-x-2">
                  {renderStarRating(competencies.discipline, (value) => updateCompetency('discipline', value))}
                  <span className="text-sm text-gray-600">({competencies.discipline}/5)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Integration & Global */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-amber-600" />
              <span>Évaluation globale</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intégration professionnelle
                </label>
                <div className="flex items-center space-x-2">
                  {renderStarRating(professionalIntegration, setProfessionalIntegration)}
                  <span className="text-sm text-gray-600">({professionalIntegration}/5)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appréciation globale
                </label>
                <div className="flex items-center space-x-2">
                  {renderStarRating(globalAppreciation, setGlobalAppreciation)}
                  <span className="text-sm text-gray-600">({globalAppreciation}/5)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire du manager
                </label>
                <textarea
                  value={managerComment}
                  onChange={(e) => setManagerComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Commentaire général sur la performance de l'employé..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleSave('EN_COURS')}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <Save className="h-4 w-4" />
                <span>Sauvegarder (En cours)</span>
              </button>
              
              <button
                onClick={() => handleSave('TERMINEE')}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <Save className="h-4 w-4" />
                <span>Finaliser l&apos;évaluation</span>
              </button>
              
              <button
                onClick={() => router.back()}
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors duration-200"
                aria-label="Annuler"
              >
                Annuler
              </button>
            </div>
          </div>

          {/* Help */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Aide</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• Vous pouvez sauvegarder l&apos;évaluation en cours et la reprendre plus tard</p>
              <p>• Une fois finalisée, l&apos;évaluation ne pourra plus être modifiée</p>
              <p>• Tous les champs sont obligatoires pour finaliser</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMidTermEvaluationPage;