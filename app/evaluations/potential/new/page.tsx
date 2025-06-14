'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Star, 
  Save, 
  User,
  MessageSquare,
  ArrowLeft,
  Award,
  TrendingUp,
  Users,
  Lightbulb,
  Target,
  Heart
} from 'lucide-react';
import { mockEmployees } from '@/lib/mock-data';

const NewPotentialEvaluationPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [criteria, setCriteria] = useState({
    leadership: 1,
    communication: 1,
    problemSolving: 1,
    adaptability: 1,
    innovation: 1,
    teamwork: 1
  });
  const [hrComment, setHrComment] = useState('');

  const isHR = user?.role === 'RH';

  if (!isHR) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accès restreint</h3>
          <p className="text-gray-600">
            Seuls les RH peuvent créer des évaluations de potentiel.
          </p>
        </div>
      </div>
    );
  }

  const updateCriteria = (field: string, value: number) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const calculateFinalScore = () => {
    const total = Object.values(criteria).reduce((sum, value) => sum + value, 0);
    return (total / Object.keys(criteria).length).toFixed(1);
  };

  const getClassification = () => {
    const score = parseFloat(calculateFinalScore());
    if (score >= 4.5) return 'POTENTIAL';
    if (score >= 3.5) return 'ACHIEVER';
    return 'PROFESSIONAL';
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'POTENTIAL':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ACHIEVER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROFESSIONAL':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSave = () => {
    // Here you would save the evaluation
    console.log('Saving potential evaluation');
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
          <Star className="h-6 w-6 fill-current" />
        </button>
      ))}
    </div>
  );

  const criteriaConfig = [
    {
      key: 'leadership',
      label: 'Leadership',
      icon: Award,
      description: 'Capacité à diriger et inspirer les autres',
      color: 'text-purple-600'
    },
    {
      key: 'communication',
      label: 'Communication',
      icon: MessageSquare,
      description: 'Aptitude à communiquer efficacement',
      color: 'text-blue-600'
    },
    {
      key: 'problemSolving',
      label: 'Résolution de problèmes',
      icon: Target,
      description: 'Capacité à analyser et résoudre les problèmes',
      color: 'text-green-600'
    },
    {
      key: 'adaptability',
      label: 'Adaptabilité',
      icon: TrendingUp,
      description: 'Flexibilité face aux changements',
      color: 'text-amber-600'
    },
    {
      key: 'innovation',
      label: 'Innovation',
      icon: Lightbulb,
      description: 'Créativité et esprit d\'innovation',
      color: 'text-orange-600'
    },
    {
      key: 'teamwork',
      label: 'Travail d\'équipe',
      icon: Users,
      description: 'Collaboration et esprit d\'équipe',
      color: 'text-indigo-600'
    }
  ];

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
              <Star className="h-8 w-8 text-purple-600" />
              <span>Nouvelle Évaluation de Potentiel</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Évaluez le potentiel d&apos;évolution d&apos;un employé
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
              <span>Employé à évaluer</span>
            </h3>
            
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Sélectionner un employé"
              required
            >
              <option value="">Sélectionner un employé</option>
              {mockEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} - {emp.position}
                </option>
              ))}
            </select>
          </div>

          {/* Criteria Evaluation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-600" />
              <span>Critères d&apos;évaluation</span>
            </h3>
            
            <div className="space-y-6">
              {criteriaConfig.map((config) => {
                const IconComponent = config.icon;
                return (
                  <div key={config.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-gray-50 rounded-lg ${config.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{config.label}</h4>
                          <p className="text-sm text-gray-600">{config.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          {renderStarRating(criteria[config.key as keyof typeof criteria], (value) => updateCriteria(config.key, value))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({criteria[config.key as keyof typeof criteria]}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RH Comment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-amber-600" />
              <span>Commentaire RH</span>
            </h3>
            
            <textarea
              value={hrComment}
              onChange={(e) => setHrComment(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Commentaire général sur le potentiel de l'employé, recommandations d'évolution, points d'amélioration..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Score Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé</h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {calculateFinalScore()}/5
                </div>
                <div className="text-sm text-gray-600">Score final</div>
              </div>
              
              <div className="text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getClassificationColor(getClassification())}`}>
                  {getClassification()}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2 text-sm">
                  {criteriaConfig.map((config) => (
                    <div key={config.key} className="flex justify-between">
                      <span className="text-gray-600">{config.label}</span>
                      <span className="font-medium">
                        {criteria[config.key as keyof typeof criteria]}/5
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleSave}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <Save className="h-4 w-4" />
                <span>Sauvegarder l&apos;évaluation</span>
              </button>
              
              <button
                onClick={() => router.back()}
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Annuler
              </button>
            </div>
          </div>

          {/* Classification Guide */}
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">Guide de classification</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-purple-800">
                  <strong>POTENTIAL</strong> (4.5-5): Fort potentiel d&apos;évolution
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-purple-800">
                  <strong>ACHIEVER</strong> (3.5-4.4): Bon performer avec potentiel
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-purple-800">
                  <strong>PROFESSIONAL</strong> (1-3.4): Professionnel solide
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPotentialEvaluationPage;