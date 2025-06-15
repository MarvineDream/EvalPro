// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';
// import { 
//   ClipboardList, 
//   Save, 
//   Plus, 
//   Trash2, 
//   Calendar,
//   User,
//   Target,
//   Star,
//   MessageSquare,
//   ArrowLeft
// } from 'lucide-react';
// import { mockEmployees, getEmployeesByDepartment } from '@/lib/mock-data';

// const NewMidTermEvaluationPage = () => {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [selectedEmployee, setSelectedEmployee] = useState('');
//   const [period, setPeriod] = useState('');
//   const [objectives, setObjectives] = useState([
//     { objective: '', targetDate: '', achievement: 1, comment: '', completed: false }
//   ]);
//   const [professionalIntegration, setProfessionalIntegration] = useState(1);
//   const [competencies, setCompetencies] = useState({
//     knowledge: 1,
//     skills: 1,
//     behavior: 1,
//     discipline: 1
//   });
//   const [globalAppreciation, setGlobalAppreciation] = useState(1);
//   const [managerComment, setManagerComment] = useState('');

//   const isHR = user?.role === 'RH';
  
//   // Get employees based on user role
//   const availableEmployees = isHR 
//     ? mockEmployees 
//     : user?.departmentId 
//       ? getEmployeesByDepartment(user.departmentId)
//       : [];

//   const addObjective = () => {
//     setObjectives([
//       ...objectives,
//       { objective: '', targetDate: '', achievement: 1, comment: '', completed: false }
//     ]);
//   };

//   const removeObjective = (index: number) => {
//     if (objectives.length > 1) {
//       setObjectives(objectives.filter((_, i) => i !== index));
//     }
//   };

//   const updateObjective = (index: number, field: string, value: any) => {
//     const updated = objectives.map((obj, i) => 
//       i === index ? { ...obj, [field]: value } : obj
//     );
//     setObjectives(updated);
//   };

//   const updateCompetency = (field: string, value: number) => {
//     setCompetencies(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSave = (status: 'EN_COURS' | 'TERMINEE') => {
//     // Here you would save the evaluation
//     console.log('Saving evaluation with status:', status);
//     router.push('/evaluations');
//   };

//   const renderStarRating = (value: number, onChange: (value: number) => void) => (
//     <div className="flex space-x-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <button
//           key={star}
//           type="button"
//           onClick={() => onChange(star)}
//           className={`p-1 rounded transition-colors duration-200 ${
//             star <= value 
//               ? 'text-yellow-400 hover:text-yellow-500' 
//               : 'text-gray-300 hover:text-gray-400'
//           }`}
//           aria-label={`Évaluer ${star} étoile${star > 1 ? 's' : ''}`}
//         >
//           <Star className="h-5 w-5 fill-current" />
//         </button>
//       ))}
//     </div>
//   );

//   return (
//     <div className="p-6 space-y-6">
//       {/* Page Header */}
//       <div className="border-b border-gray-200 pb-6">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={() => router.back()}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//             aria-label="Retour"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
//               <ClipboardList className="h-8 w-8 text-blue-600" />
//               <span>Nouvelle Évaluation Mi-parcours</span>
//             </h1>
//             <p className="text-gray-600 mt-2">
//               Créez une nouvelle évaluation progressive pour un employé
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Form */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Employee Selection */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//               <User className="h-5 w-5 text-blue-600" />
//               <span>Informations de base</span>
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Employé à évaluer
//                 </label>
//                 <select
//                   value={selectedEmployee}
//                   onChange={(e) => setSelectedEmployee(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   aria-label="Sélectionner un employé"
//                   required
//                 >
//                   <option value="">Sélectionner un employé</option>
//                   {availableEmployees.map(emp => (
//                     <option key={emp.id} value={emp.id}>
//                       {emp.prenom} {emp.nom} - {emp.poste}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Période d&apos;évaluation
//                 </label>
//                 <input
//                   type="text"
//                   value={period}
//                   onChange={(e) => setPeriod(e.target.value)}
//                   placeholder="Ex: T1 2024, Janvier 2024..."
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Objectives */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
//                 <Target className="h-5 w-5 text-green-600" />
//                 <span>Objectifs</span>
//               </h3>
//               <button
//                 onClick={addObjective}
//                 className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1 transition-colors duration-200"
//               >
//                 <Plus className="h-4 w-4" />
//                 <span>Ajouter</span>
//               </button>
//             </div>

//             <div className="space-y-4">
//               {objectives.map((obj, index) => (
//                 <div key={index} className="border border-gray-200 rounded-lg p-4">
//                   <div className="flex items-start justify-between mb-3">
//                     <h4 className="font-medium text-gray-900">Objectif {index + 1}</h4>
//                     {objectives.length > 1 && (
//                       <button
//                         onClick={() => removeObjective(index)}
//                         className="text-red-600 hover:text-red-700 p-1"
//                         aria-label="Supprimer l'objectif"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     )}
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Description de l&apos;objectif
//                       </label>
//                       <textarea
//                         value={obj.objective}
//                         onChange={(e) => updateObjective(index, 'objective', e.target.value)}
//                         rows={2}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Décrivez l'objectif..."
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Date cible
//                       </label>
//                       <input
//                         type="date"
//                         value={obj.targetDate}
//                         onChange={(e) => updateObjective(index, 'targetDate', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         aria-label="Sélectionner une date cible"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Réalisation (1-5)
//                       </label>
//                       <div className="flex items-center space-x-2">
//                         {renderStarRating(obj.achievement, (value) => updateObjective(index, 'achievement', value))}
//                         <span className="text-sm text-gray-600">({obj.achievement}/5)</span>
//                       </div>
//                     </div>
                    
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Commentaire
//                       </label>
//                       <textarea
//                         value={obj.comment}
//                         onChange={(e) => updateObjective(index, 'comment', e.target.value)}
//                         rows={2}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Commentaire sur la réalisation..."
//                       />
//                     </div>
                    
//                     <div className="md:col-span-2">
//                       <label className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           checked={obj.completed}
//                           onChange={(e) => updateObjective(index, 'completed', e.target.checked)}
//                           className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         />
//                         <span className="text-sm text-gray-700">Objectif terminé</span>
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Competencies */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//               <Star className="h-5 w-5 text-purple-600" />
//               <span>Compétences</span>
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Savoir (Connaissances)
//                 </label>
//                 <div className="flex items-center space-x-2">
//                   {renderStarRating(competencies.knowledge, (value) => updateCompetency('knowledge', value))}
//                   <span className="text-sm text-gray-600">({competencies.knowledge}/5)</span>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Savoir-faire (Compétences)
//                 </label>
//                 <div className="flex items-center space-x-2">
//                   {renderStarRating(competencies.skills, (value) => updateCompetency('skills', value))}
//                   <span className="text-sm text-gray-600">({competencies.skills}/5)</span>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Savoir-être (Comportement)
//                 </label>
//                 <div className="flex items-center space-x-2">
//                   {renderStarRating(competencies.behavior, (value) => updateCompetency('behavior', value))}
//                   <span className="text-sm text-gray-600">({competencies.behavior}/5)</span>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Discipline
//                 </label>
//                 <div className="flex items-center space-x-2">
//                   {renderStarRating(competencies.discipline, (value) => updateCompetency('discipline', value))}
//                   <span className="text-sm text-gray-600">({competencies.discipline}/5)</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Integration & Global */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//               <MessageSquare className="h-5 w-5 text-amber-600" />
//               <span>Évaluation globale</span>
//             </h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Intégration professionnelle
//                 </label>
//                 <div className="flex items-center space-x-2">
//                   {renderStarRating(professionalIntegration, setProfessionalIntegration)}
//                   <span className="text-sm text-gray-600">({professionalIntegration}/5)</span>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Appréciation globale
//                 </label>
//                 <div className="flex items-center space-x-2">
//                   {renderStarRating(globalAppreciation, setGlobalAppreciation)}
//                   <span className="text-sm text-gray-600">({globalAppreciation}/5)</span>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Commentaire du manager
//                 </label>
//                 <textarea
//                   value={managerComment}
//                   onChange={(e) => setManagerComment(e.target.value)}
//                   rows={4}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Commentaire général sur la performance de l'employé..."
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Actions */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
//             <div className="space-y-3">
//               <button
//                 onClick={() => handleSave('EN_COURS')}
//                 className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
//               >
//                 <Save className="h-4 w-4" />
//                 <span>Sauvegarder (En cours)</span>
//               </button>
              
//               <button
//                 onClick={() => handleSave('TERMINEE')}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
//               >
//                 <Save className="h-4 w-4" />
//                 <span>Finaliser l&apos;évaluation</span>
//               </button>
              
//               <button
//                 onClick={() => router.back()}
//                 className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors duration-200"
//                 aria-label="Annuler"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>

//           {/* Help */}
//           <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
//             <h3 className="text-lg font-semibold text-blue-900 mb-2">Aide</h3>
//             <div className="text-sm text-blue-800 space-y-2">
//               <p>• Vous pouvez sauvegarder l&apos;évaluation en cours et la reprendre plus tard</p>
//               <p>• Une fois finalisée, l&apos;évaluation ne pourra plus être modifiée</p>
//               <p>• Tous les champs sont obligatoires pour finaliser</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewMidTermEvaluationPage;
'use client';

/* -------------------------------------------------------------------------- */
/* Page : Nouvelle Évaluation Mi‑parcours  – version étendue                  */
/* -------------------------------------------------------------------------- */
/*  Ajouts :
     • Évaluation de l'Intégration Professionnelle (critères + note + commentaire)
     • Évaluation des Compétences (critères + note + axe d'amélioration)
     • Savoir‑Faire (idem)
     • Savoir‑Être  (idem)
     • Discipline   (idem)
     • Appréciation globale (textarea)
     • Décision finale (Validé / Refusé / À revoir)
     • Signatures : Collaborateur, Responsable, RH + dates
*/

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  MenuItem,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import {
  ClipboardList,
  ArrowLeft,
  Plus,
  Trash2,
  Target,
  Star as LucideStar,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockEmployees, getEmployeesByDepartment } from '@/lib/mock-data';

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */
const ratingChoices = ['Très Bien', 'Bien', 'Passable', 'Insuffisant', 'Pas Concerné'];
const periodChoices = ['Mensuel', 'T1', 'T2', 'T3', 'Annuel'];

const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <Box sx={{ display: 'flex', gap: 0.5 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <IconButton key={s} size="small" sx={{ p: 0.5, color: s <= value ? '#f6b01e' : '#c5c5c5' }} onClick={() => onChange(s)}>
        <LucideStar size={18} fill="currentColor" />
      </IconButton>
    ))}
  </Box>
);

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
interface SubTask {
  title: string;
  rating: string;
  comment: string;
}

interface Objective {
  objective: string;
  period: string;
  percentage: number;
  achievement: number;
  comment: string;
  completed: boolean;
  subtasks: SubTask[];
}

interface EvalRowComment {
  critere: string;
  note: string;
  comment: string; // commentaire ou axe d'amélioration
}

/* -------------------------------------------------------------------------- */
export default function NewMidTermEvaluationPage() {
  const router = useRouter();
  const { user } = useAuth();

  const isHR = user?.role === 'RH';
  const availableEmployees = isHR
    ? mockEmployees
    : user?.departmentId
    ? getEmployeesByDepartment(user.departmentId)
    : [];

  /* ---------------------------------------------------------------------- */
  /* State principal                                                        */
  /* ---------------------------------------------------------------------- */
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [periodGlobal, setPeriodGlobal] = useState('');

  const [objectives, setObjectives] = useState<Objective[]>([
    {
      objective: '',
      period: '',
      percentage: 0,
      achievement: 1,
      comment: '',
      completed: false,
      subtasks: [],
    },
  ]);

  // --- Intégration Professionnelle ---------------------------------------
  const integrationCriteria = [
    'Adaptation Poste',
    'Adaptation Equipe',
    'Respect des Procédures',
    'Maîtrise des Outils',
  ];
  const [integrationRows, setIntegrationRows] = useState<EvalRowComment[]>(
    integrationCriteria.map((c) => ({ critere: c, note: '', comment: '' })),
  );

  // --- Compétences -------------------------------------------------------
  const competenceCriteria = [
    'Acquis de la formation initiale',
    'Acquis de la formation continue',
    "Connaissance de l’entreprise",
    'Connaissance des procédures liées à son activité',
    "Connaissance des logiciels d'exploitation",
    'Connaissance des logiciels techniques/bancaires',
  ];
  const [competenceRows, setCompetenceRows] = useState<EvalRowComment[]>(
    competenceCriteria.map((c) => ({ critere: c, note: '', comment: '' })),
  );

  // --- Savoir‑Faire ------------------------------------------------------
  const savoirFaireCriteria = [
    'Organisation du travail',
    'Application des procédures',
    'Fiabilité des tâches exécutées',
    'Fiabilité des contrôles réalisés',
    'Reporting : Fiabilité des infos / Respect délais',
  ];
  const [savoirFaireRows, setSavoirFaireRows] = useState<EvalRowComment[]>(
    savoirFaireCriteria.map((c) => ({ critere: c, note: '', comment: '' })),
  );

  // --- Savoir‑Être -------------------------------------------------------
  const savoirEtreCriteria = [
    'Autonomie',
    'Initiative',
    'Rigueur',
    'Disponibilité',
    'Ponctualité',
    'Courtoisie',
    'Travail d\'équipe',
    'Assiduité',
    'Présentation',
    'Humanisme',
    'Agilité',
    'Résilience',
    'Diversité',
    'Innovation',
    'Éco‑responsabilité',
  ];
  const [savoirEtreRows, setSavoirEtreRows] = useState<EvalRowComment[]>(
    savoirEtreCriteria.map((c) => ({ critere: c, note: '', comment: '' })),
  );

  // --- Discipline --------------------------------------------------------
  const disciplineCriteria = [
    'Respect du code de déontologie',
    'Respect du règlement intérieur',
    'Respect du livret sécurité informatique',
    'Respect de la charte informatique',
    'Respect de la charte métier',
  ];
  const [disciplineRows, setDisciplineRows] = useState<EvalRowComment[]>(
    disciplineCriteria.map((c) => ({ critere: c, note: '', comment: '' })),
  );

  // --- Appréciation & décision ------------------------------------------
  const [appreciationGlobal, setAppreciationGlobal] = useState('');
  const [decision, setDecision] = useState('');

  // --- Signatures --------------------------------------------------------
  const [signatures, setSignatures] = useState({
    collaborateur: '',
    responsableNom: '',
    responsableDate: '',
    rhNom: '',
    rhDate: '',
  });

  /* ---------------------------------------------------------------------- */
  /* Helpers update rows                                                    */
  /* ---------------------------------------------------------------------- */
  const handleRowChange = (
    setter: React.Dispatch<React.SetStateAction<EvalRowComment[]>>,
    idx: number,
    field: keyof EvalRowComment,
    value: any,
  ) => {
    setter((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  };

  /* ---------------------------------------------------------------------- */
  /* Handlers Objectifs (déjà présents)                                     */
  /* ---------------------------------------------------------------------- */
  const addObjective = () =>
    setObjectives((prev) => [
      ...prev,
      {
        objective: '',
        period: '',
        percentage: 0,
        achievement: 1,
        comment: '',
        completed: false,
        subtasks: [],
      },
    ]);

  const removeObjective = (idx: number) =>
    setObjectives((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const updateObjective = (idx: number, field: keyof Objective, value: any) =>
    setObjectives((prev) => prev.map((obj, i) => (i === idx ? { ...obj, [field]: value } : obj)));

  const addSubtask = (objIdx: number) =>
    setObjectives((prev) =>
      prev.map((obj, i) =>
        i === objIdx ? { ...obj, subtasks: [...obj.subtasks, { title: '', rating: '', comment: '' }] } : obj,
      ),
    );

  const removeSubtask = (objIdx: number, subIdx: number) =>
    setObjectives((prev) =>
      prev.map((obj, i) =>
        i === objIdx ? { ...obj, subtasks: obj.subtasks.filter((_, s) => s !== subIdx) } : obj,
      ),
    );

  const updateSubtask = (objIdx: number, subIdx: number, field: keyof SubTask, value: any) =>
    setObjectives((prev) =>
      prev.map((obj, i) =>
        i === objIdx
          ? {
              ...obj,
              subtasks: obj.subtasks.map((s, si) => (si === subIdx ? { ...s, [field]: value } : s)),
            }
          : obj,
      ),
    );

  /* ---------------------------------------------------------------------- */
  /* Render helpers for generic table rows                                  */
  /* ---------------------------------------------------------------------- */
  const renderEvalTable = (
    rows: EvalRowComment[],
    setter: React.Dispatch<React.SetStateAction<EvalRowComment[]>>,
    axe = false,
  ) => (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell width="35%">Critère</TableCell>
          <TableCell width="20%">Note</TableCell>
          <TableCell>{axe ? 'Axe d\'amélioration' : 'Commentaire'}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, idx) => (
          <TableRow key={idx}>
            <TableCell>{row.critere}</TableCell>
            <TableCell>
              <Select
                value={row.note}
                onChange={(e) => handleRowChange(setter, idx, 'note', e.target.value)}
                fullWidth
              >
                {ratingChoices.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
            <TableCell>
              <TextField
                value={row.comment}
                onChange={(e) => handleRowChange(setter, idx, 'comment', e.target.value)}
                fullWidth
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header */}
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <ClipboardList className="h-8 w-8 text-blue-600" />
          <span>Nouvelle Évaluation Mi‑parcours</span>
        </h1>
      </div>

      <Paper sx={{ p: 4 }}>
        {/* Sélection employé ------------------------------------------------ */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Employé à évaluer"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              fullWidth
            >
              {availableEmployees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Période globale (optionnel)"
              value={periodGlobal}
              onChange={(e) => setPeriodGlobal(e.target.value)}
              placeholder="T1 2024, Janvier…"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* ----- Objectifs -------------------------------------------------- */}
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Objectifs fixés
          </Typography>
          {/* ... (Objectifs UI repris comme précédemment) ...*/}
          {objectives.map((obj, idx) => (
            <Paper key={idx} sx={{ p: 3, mb: 3 }} variant="outlined">
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography fontWeight="bold">Activité {idx + 1}</Typography>
                {objectives.length > 1 && (
                  <IconButton color="error" onClick={() => removeObjective(idx)}>
                    <Trash2 size={16} />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Activité *"
                    value={obj.objective}
                    onChange={(e) => updateObjective(idx, 'objective', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    select
                    label="Période"
                    value={obj.period}
                    onChange={(e) => updateObjective(idx, 'period', e.target.value)}
                    fullWidth
                  >
                    {periodChoices.map((p) => (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    type="number"
                    label="Pourcentage %"
                    value={obj.percentage}
                    onChange={(e) => updateObjective(idx, 'percentage', Number(e.target.value))}
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" mb={0.5}>
                    Réalisation (1‑5)
                  </Typography>
                  <StarRating value={obj.achievement} onChange={(v) => updateObjective(idx, 'achievement', v)} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Commentaire"
                    value={obj.comment}
                    onChange={(e) => updateObjective(idx, 'comment', e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>

              {/* Sous-tâches */}
              {obj.subtasks.length > 0 && (
                <Table size="small" sx={{ mt: 3 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sous‑tâche</TableCell>
                      <TableCell>Note</TableCell>
                      <TableCell>Commentaire</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {obj.subtasks.map((sub, sIdx) => (
                      <TableRow key={sIdx}>
                        <TableCell>
                          <TextField
                            value={sub.title}
                            onChange={(e) => updateSubtask(idx, sIdx, 'title', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 130 }}>
                          <Select
                            value={sub.rating}
                            onChange={(e) => updateSubtask(idx, sIdx, 'rating', e.target.value)}
                            fullWidth
                          >
                            {ratingChoices.map((r) => (
                              <MenuItem key={r} value={r}>
                                {r}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={sub.comment}
                            onChange={(e) => updateSubtask(idx, sIdx, 'comment', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton color="error" onClick={() => removeSubtask(idx, sIdx)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              <Button startIcon={<Add />} size="small" onClick={() => addSubtask(idx)} sx={{ mt: 2 }}>
                Ajouter une sous‑tâche
              </Button>
            </Paper>
          ))}

          <Button startIcon={<Plus />} onClick={addObjective} variant="outlined">
            Ajouter une activité
          </Button>
        </Box>

        {/* ----- Évaluation Intégration Professionnelle ------------------- */}
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Évaluation de l'Intégration Professionnelle
          </Typography>
          {renderEvalTable(integrationRows, setIntegrationRows)}
        </Box>

        {/* ----- Évaluation des Compétences -------------------------------- */}
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Évaluation des Compétences
          </Typography>
          {renderEvalTable(competenceRows, setCompetenceRows, true)}
        </Box>

        {/* ----- Savoir-Faire --------------------------------------------- */}
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Savoir‑Faire
          </Typography>
          {renderEvalTable(savoirFaireRows, setSavoirFaireRows, true)}
        </Box>

        {/* ----- Savoir-Être ---------------------------------------------- */}
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Savoir‑Être
          </Typography>
          {renderEvalTable(savoirEtreRows, setSavoirEtreRows, true)}
        </Box>

        {/* ----- Discipline ---------------------------------------------- */}
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Discipline
          </Typography>
          {renderEvalTable(disciplineRows, setDisciplineRows, true)}
        </Box>

        {/* ----- Appréciation Globale ------------------------------------- */}
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Appréciation globale
          </Typography>
          <TextField
            value={appreciationGlobal}
            onChange={(e) => setAppreciationGlobal(e.target.value)}
            fullWidth
            multiline
            rows={4}
            placeholder="Résumé global de l'évaluation..."
          />
        </Box>

        {/* ----- Décision -------------------------------------------------- */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Décision finale
          </Typography>
          <Select value={decision} onChange={(e) => setDecision(e.target.value)} fullWidth>
            <MenuItem value="Validé">Validé</MenuItem>
            <MenuItem value="Refusé">Refusé</MenuItem>
            <MenuItem value="À revoir">À revoir</MenuItem>
          </Select>
        </Box>

        {/* ----- Signatures ----------------------------------------------- */}
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Signatures
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Collaborateur"
                value={signatures.collaborateur}
                onChange={(e) => setSignatures({ ...signatures, collaborateur: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Responsable (Nom)"
                value={signatures.responsableNom}
                onChange={(e) => setSignatures({ ...signatures, responsableNom: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                value={signatures.responsableDate}
                onChange={(e) => setSignatures({ ...signatures, responsableDate: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="RH (Nom)"
                value={signatures.rhNom}
                onChange={(e) => setSignatures({ ...signatures, rhNom: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                value={signatures.rhDate}
                onChange={(e) => setSignatures({ ...signatures, rhDate: e.target.value })}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>

        {/* ----- Actions globales ---------------------------------------- */}
        <Box mt={6} display="flex" gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => router.back()}>Annuler</Button>
          <Button variant="contained" color="primary" onClick={() => alert('Sauvegarde')}>Sauvegarder</Button>
        </Box>
      </Paper>
    </Container>
  );
}
