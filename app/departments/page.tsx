'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2,
  Plus,
  Users,
  Edit,
  Trash2,
  UserCheck,
  TrendingUp
} from 'lucide-react';

type Department = {
  _id: string;
  name: string;
  managerId?: string;
  description?: string;
  createdAt: string;
};

type Employee = {
  _id: string;
  name: string;
  prenom: string;
  contractType: 'CDI' | 'CDD' | 'stagiaire';
};

type Staff = {
  _id: string;
  nom: string;
  prenom: string;
  position: string;
  departmentId?: string;
  contractType?: 'CDI' | 'CDD' | 'stagiaire';
};

type User = {
  _id: string;
  nom: string;
  email: string;
  role: string;
};

const DepartmentsPage = () => {
  const { user } = useAuth();
  const token = user?.token || '';
  const isHR = user?.role === 'RH';

  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [departmentName, setDepartmentName] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Staff[]>([]);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [managers, setManagers] = useState<User[]>([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [description, setDescription] = useState('');


  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await fetch("https://backendeva.onrender.com/auth/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await res.json();
        console.log("📦 Données reçues :", data);

        if (Array.isArray(data)) {
          setManagers(data);
        } else {
          console.error("⚠️ Les données reçues ne sont pas un tableau :", data);
          setManagers([]); // fallback vide
        }
      } catch (err) {
        console.error("❌ Erreur de chargement des managers :", err);
        setManagers([]); // fallback en cas d'erreur
      }
    };

    fetchManagers();
  }, []);

  // Fetch departments + employees on mount
  useEffect(() => {
    if (!isHR) return;

    async function fetchData() {
      setLoading(true);
      try {
        // Fetch departments
        const depRes = await fetch('https://backendeva.onrender.com/departement', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!depRes.ok) throw new Error('Erreur chargement départements');
        const depsData: Department[] = await depRes.json();

        // Fetch employees
        const empRes = await fetch('https://backendeva.onrender.com/staff/All', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!empRes.ok) throw new Error('Erreur chargement employés');
        const empsData: Employee[] = await empRes.json();
        console.log("📦 Données reçues :", empsData);

        setDepartments(depsData);
        setEmployees(empsData);
      } catch (err) {
        console.error(err);
        alert('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token, isHR]);

  const handleViewTeam = async (departmentId: string) => {
    try {
      const res = await fetch(`https://backendeva.onrender.com/staff/by-departement/${departmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Erreur lors du chargement de l’équipe');

      const team: Staff[] = await res.json();
      setSelectedTeam(team);
      setTeamModalOpen(true);
    } catch (err) {
      console.error(err);
      alert('Impossible de charger l’équipe');
    }
  };

  const handleEditDepartment = async (department: Department) => {
    try {
      setOpenAddModal(false);
      const res = await fetch('https://backendeva.onrender.com/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Erreur lors de la récupération des managers');

      const managers = await res.json();
      console.log("📦 Données reçues :", managers);

      setManagers(managers);
      setDepartmentName(department.name);
      setSelectedManager(department.managerId || '');
      setEditingDepartment(department);
      setOpenAddModal(true); // Ouvrir le modal de modification
    } catch (err) {
      console.error(err);
      alert('Impossible de charger la liste des managers');
    }
  };

  const getEmployeesByDepartment = (departmentId: string) =>
    employees.filter((emp) => (emp as any).departmentId === departmentId);

  const getDepartmentStats = (departmentId: string) => {
    const emps = getEmployeesByDepartment(departmentId);
    const totalEmployees = emps.length;
    const cdiCount = emps.filter((emp) => emp.contractType === 'CDI').length;
    const cddCount = emps.filter((emp) => emp.contractType === 'CDD').length;
    const stageCount = emps.filter((emp) => emp.contractType === 'stagiaire').length;

    return { totalEmployees, cdiCount, cddCount, stageCount };
  };

  const getManagerName = (managerId?: string) => {
    if (!managerId) return 'Non assigné';

    const manager = employees.find(emp => emp._id.toString() === managerId.toString());
    return manager ? `${manager.name}` : 'Non trouvé';
  };

  const resetModal = () => {
    setEditingDepartment(null);
    setDepartmentName('');
    setSelectedManager('');
  };

  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentName.trim()) {
      alert('Le nom du département est requis.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: departmentName.trim(),
        managerId: selectedManager || null
      };

      let res;
      if (editingDepartment) {
        // PUT update
        res = await fetch(`https://backendeva.onrender.com/departement/${editingDepartment._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        // POST create
        res = await fetch('https://backendeva.onrender.com/departement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      // Amélioration de la gestion des erreurs
      if (!res.ok) {
        const errorText = await res.text(); // ou res.json() si le serveur renvoie un JSON
        throw new Error(`Erreur lors de la sauvegarde : ${errorText}`);
      }

      const savedDepartment: Department = await res.json();

      if (editingDepartment) {
        setDepartments((prev) =>
          prev.map((d) => (d._id === savedDepartment._id ? savedDepartment : d))
        );
      } else {
        setDepartments((prev) => [...prev, savedDepartment]);
      }

      resetModal();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        alert(`Erreur lors de la sauvegarde du département : ${err.message}`);
      } else {
        alert('Erreur lors de la sauvegarde du département');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm('Confirmer la suppression du département ?')) return;

    try {
      const res = await fetch(`https://backendeva.onrender.com/departement/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setDepartments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression du département');
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Chargement des départements et employés...
      </div>
    );
  }

  if (!isHR) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accès restreint</h3>
          <p className="text-gray-600">
            Seuls les RH peuvent accéder à la gestion des départements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span>Gestion des Départements</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les départements et leurs responsables
          </p>
        </div>
        <button
          onClick={() => {
            setOpenAddModal(true);
            resetModal(); // Réinitialiser le modal
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          aria-label="Ajouter un nouveau département"
        >
          <Plus className="h-5 w-5" />
          <span>Nouveau département</span>
        </button>
      </div>

      {openAddModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
            <h2 className="text-lg font-semibold mb-4">
              {editingDepartment ? 'Modifier Département' : 'Ajouter un nouveau département'}
            </h2>

            <form onSubmit={handleSaveDepartment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nom du département</label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  required
                  placeholder="Nom du département"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Manager</label>
                <select
                  aria-label="Sélectionner un manager"
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  required
                >
                  <option value="">-- Sélectionner un manager --</option>
                  {managers?.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez brièvement ce département"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpenAddModal(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  {saving ? 'Enregistrement...' : (editingDepartment ? 'Mettre à jour' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Départements</p>
              <p className="text-3xl font-bold text-gray-900">{departments.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employés</p>
              <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avec Manager</p>
              <p className="text-3xl font-bold text-gray-900">
                {departments.filter((dept) => dept.managerId).length}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <UserCheck className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Moyenne/Dept</p>
              <p className="text-3xl font-bold text-gray-900">
                {departments.length === 0
                  ? 0
                  : Math.round(employees.length / departments.length)}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => {
          const stats = getDepartmentStats(department._id);
          return (
            <div
              key={department._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {department.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Créé le{' '}
                        {new Date(department.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditDepartment(department)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      aria-label="Modifier le département"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(department._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      aria-label="Supprimer le département"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Manager Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Manager:</span>
                  </div>
                  <p className="text-sm text-gray-900 mt-1">
                    {getManagerName(department.managerId)}
                  </p>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Employés</p>
                      <p className="text-lg font-bold text-gray-900">{stats.totalEmployees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CDI</p>
                      <p className="text-lg font-bold text-gray-900">{stats.cdiCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CDD</p>
                      <p className="text-lg font-bold text-gray-900">{stats.cddCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">STAGE</p>
                      <p className="text-lg font-bold text-gray-900">{stats.stageCount}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleViewTeam(department._id)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Voir l&apos;équipe
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Modal */}
      {teamModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Équipe</h2>
            <ul className="space-y-2">
              {selectedTeam.map((member) => (
                <li key={member._id} className="flex justify-between">
                  <span>{member.nom} {member.prenom}</span>
                  <span className="text-sm text-gray-500">{member.contractType}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setTeamModalOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;