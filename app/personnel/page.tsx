'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users, Plus, Search, Filter,
  Edit, Trash2, Eye, Calendar,
  Building2, Mail
} from 'lucide-react';
import { Employee, Department } from '@/lib/types';

const PersonnelPage = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedContractType, setSelectedContractType] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    poste: "",
    departmentId: "",
    contractType: "",
    contractStartDate: "",
    contractEndDate: ""
  });

  const isHR = user?.role === 'RH';
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const fetchEmployees = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('https://backendeva.onrender.com/staff/All', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("Données reçues du backend :", data);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des employés', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchDepartments = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('https://backendeva.onrender.com/departement', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des départements', error);
      setDepartments([]);
    }
  }, [token]);

  const deleteEmployee = async (id: string) => {
    const confirmed = confirm("Supprimer cet employé ?");
    if (!confirmed || !token) return;
    try {
      const res = await fetch(`https://backendeva.onrender.com/staff/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setEmployees(prev => prev.filter(e => e._id !== id));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression employé :", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEmployees();
      fetchDepartments();
    }
  }, [token, fetchEmployees, fetchDepartments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nom, email, poste, departmentId, contractType, contractStartDate } = formData;

    if (!nom || !email || !poste || !departmentId || !contractType || !contractStartDate) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const res = await fetch("https://backendeva.onrender.com/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          poste: formData.poste,
          departement: formData.departmentId,
          typeContrat: formData.contractType,
          dateEmbauche: formData.contractStartDate,
          dateFinContrat: formData.contractEndDate || null,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement du personnel");

      const newStaff = await res.json();
      setEmployees(prev => [...prev, newStaff.staff]); // Ajouter le nouvel employé à la liste
      setShowAddModal(false);
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        poste: "",
        departmentId: "",
        contractType: "",
        contractStartDate: "",
        contractEndDate: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du personnel", error);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
  emp.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  emp.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (emp.poste || '').toLowerCase().includes(searchTerm.toLowerCase());


    const matchesDepartment = !selectedDepartment || emp.departmentId === selectedDepartment;
    const matchesContract = !selectedContractType || emp.contractType === selectedContractType;
    const hasAccess = isHR || emp.departmentId === user?.departmentId;

    return matchesSearch && matchesDepartment && matchesContract && hasAccess;
  });

  const getContractStatusColor = (employee: Employee) => {
    if (!employee.contractEndDate) return 'text-green-600';
    const endDate = new Date(employee.contractEndDate);
    const daysUntilExpiry = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 7) return 'text-red-600';
    if (daysUntilExpiry <= 30) return 'text-amber-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <span>{isHR ? 'Gestion du Personnel' : 'Mon Équipe'}</span>
            </h1>
            <p className="text-gray-600 mt-2">
              {isHR ? 'Gérez tous les employés de l\'entreprise' : 'Consultez les membres de votre équipe'}
            </p>
          </div>
          {isHR && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              aria-label="Ajouter un employé"
            >
              <Plus className="h-5 w-5" />
              <span>Ajouter un employé</span>
            </button>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
              aria-label="Fermer"
            >✕</button>

            <h2 className="text-xl font-bold mb-4 text-blue-600">Ajouter un employé</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Nom *" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} className="border px-4 py-2 rounded-lg w-full" required />
                <input type="text" placeholder="Prénom" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} className="border px-4 py-2 rounded-lg w-full" />
              </div>
              <input type="email" placeholder="Email *" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="border px-4 py-2 rounded-lg w-full" required />
              <input type="text" placeholder="Poste *" value={formData.poste} onChange={(e) => setFormData({ ...formData, poste: e.target.value })} className="border px-4 py-2 rounded-lg w-full" required />

              <select
                aria-label="Sélectionner un département"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="border px-4 py-2 rounded-lg w-full"
                required
              >
                <option value="">-- Sélectionner un département *</option>
                {departments.map((dept: any) => (
                  <option key={dept._id} value={dept._id}>{dept.nom}</option>
                ))}
              </select>

              <select
                aria-label="Type de contrat"
                value={formData.contractType}
                onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                className="border px-4 py-2 rounded-lg w-full"
                required
              >
                <option value="">-- Type de contrat *</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="STAGE">Stage</option>
                <option value="CONSULTANT">Consultant</option>
              </select>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm text-gray-600">
                  Date d&apos;embauche *
                  <input type="date" value={formData.contractStartDate} onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })} className="border px-4 py-2 rounded-lg w-full mt-1" required />
                </label>
                <label className="text-sm text-gray-600">
                  Date fin de contrat
                  <input type="date" value={formData.contractEndDate} onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })} className="border px-4 py-2 rounded-lg w-full mt-1" />
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            aria-label='Sélectionner un département'
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les départements</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>

          <select
            aria-label='Sélectionner un type de contrat'
            value={selectedContractType}
            onChange={(e) => setSelectedContractType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les contrats</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="STAGE">Stage</option>
            <option value="CONSULTANT">Consultant</option>
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredEmployees.length} employé(s)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee._id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-lg font-medium text-white">
                      {employee.prenom[0]}{employee.nom[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{employee.prenom} {employee.nom}</h3>
                    <p className="text-sm text-gray-600">{employee.poste}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button aria-label="Voir le profil" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="h-4 w-4" />
                  </button>
                  {isHR && (
                    <>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" aria-label="Modifier l'employé">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteEmployee(employee._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label="Supprimer l'employé">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{employee.email}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{departments.find(d => d.id === employee.departmentId)?.name || 'Non spécifié'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {employee.contractType}
                    </span>
                  </div>
                  {employee.contractEndDate && (
                    <span className={`text-sm font-medium ${getContractStatusColor(employee)}`}>
                      Expire le {new Date(employee.contractEndDate).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>

                {employee.salary && isHR && (
                  <div className="pt-2 border-t">
                    <span className="text-sm font-medium text-gray-900">
                      {employee.salary.toLocaleString('fr-FR')} €/an
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun employé trouvé</h3>
          <p className="text-gray-600">Aucun employé ne correspond à vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
};

export default PersonnelPage;
