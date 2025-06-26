'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Plus } from 'lucide-react';

interface User {
  _id: string;
  prenom: string;
  nom: string;
  poste: string;
  typeContrat: string;
  dateEmbauche?: string;
  dateFinContrat: string;
  departement: string;
}

interface Evaluation {
  employeeId: string;
  globalAppreciation: number;
  createdAt: string;
  status: string;
}

const TeamPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [evaluation, setEvaluations] = useState<Evaluation[]>([]);
  const [isManager, setIsManager] = useState<boolean>(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Vérification d'accès
  useEffect(() => {
    if (user) {
      setIsManager(user.role === 'Manager');
    }
  }, [user]);

  // Charger les membres de l’équipe
  useEffect(() => {
    if (isManager && user?.departmentId) {
      const fetchEmployees = async () => {
        try {
          const res = await fetch(`https://backendeva.onrender.com/staff/by-department/${user.departmentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data: User[] = await res.json();
          setTeamMembers(data);
        } catch (error) {
          console.error("Erreur chargement équipe:", error);
        }
      };
      fetchEmployees();
    }
  }, [isManager, user?.departmentId, token]);

  // Charger les évaluations
  useEffect(() => {
    if (isManager && user?.departmentId) {
      const fetchEvaluations = async () => {
        try {
          const res = await fetch(`https://backendeva.onrender.com/evaluation/department/${user.departmentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data: Evaluation[] = await res.json();
          setEvaluations(data);
        } catch (error) {
          console.error("Erreur chargement évaluations:", error);
        }
      };
      fetchEvaluations();
    }
  }, [isManager, user?.departmentId, token]);

  // Filtrage des membres de l'équipe
  const filteredTeamMembers = teamMembers.filter((member) =>
    member.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.poste.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Affichage conditionnel
  if (!isManager || !user?.departmentId) {
    return (
      <div className="p-6 text-center">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Accès restreint</h3>
        <p className="text-gray-600">
          Cette page est réservée aux managers avec un département assigné.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6 flex items-center justify-between">
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

      {/* Recherche des membres de l'équipe */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un membre de l'équipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full"
        />
      </div>

      {/* Liste des membres de l'équipe */}
      <div className="space-y-4">
        {filteredTeamMembers.map((member) => (
          <div key={member._id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{member.prenom} {member.nom}</h2>
            <p className="text-gray-600">{member.poste}</p>
            <p className="text-gray-500">Type de contrat: {member.typeContrat}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
