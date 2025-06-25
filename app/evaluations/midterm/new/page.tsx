'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container,Typography, TextField, Grid, Button, Box, MenuItem, Paper, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Select,} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import {ClipboardList,ArrowLeft,Plus,Trash2,Target,Star as LucideStar,} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockEmployees, getEmployeesByDepartment } from '@/lib/mock-data';
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

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  departmentId?: string; // si utilisée dans getEmployeesByDepartment
}

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
  comment: string; 
}

export default function NewMidTermEvaluationPage() {
  const router = useRouter();
  
  const { user } = useAuth();
  useEffect(() => {
  const getArticles = async () => {
    if (!user?.token) return;

    const data = await fetchArticles(user.token);
    if (data) {
      console.log('Articles récupérés :', data);
      // tu peux aussi les stocker dans un état si besoin
    }
  };

  getArticles();
}, [user?.token]);


  const isHR = user?.role === 'RH';
  const availableEmployees = isHR
    ? mockEmployees
    : user?.departmentId
    ? getEmployeesByDepartment(user.departmentId)
    : [];

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
  const fetchArticles = async (token: string) => {
  try {
    const res = await fetch('https://artiz-1ly2.onrender.com/api/admin/articles', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Erreur lors du fetch des articles :', err);
    return null;
  }
};


  const integrationCriteria = [
    'Adaptation Poste',
    'Adaptation Equipe',
    'Respect des Procédures',
    'Maîtrise des Outils',
  ];
  const [integrationRows, setIntegrationRows] = useState<EvalRowComment[]>(
    integrationCriteria.map((c) => ({ critere: c, note: '', comment: '' })),
  );

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

  const [appreciationGlobal, setAppreciationGlobal] = useState('');
  const [decision, setDecision] = useState('');

  const [signatures, setSignatures] = useState({
    collaborateur: '',
    responsableNom: '',
    responsableDate: '',
    rhNom: '',
    rhDate: '',
  });


  const handleRowChange = (
    setter: React.Dispatch<React.SetStateAction<EvalRowComment[]>>,
    idx: number,
    field: keyof EvalRowComment,
    value: any,
  ) => {
    setter((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  };

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

        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Évaluation de l'Intégration Professionnelle
          </Typography>
          {renderEvalTable(integrationRows, setIntegrationRows)}
        </Box>

      
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Évaluation des Compétences
          </Typography>
          {renderEvalTable(competenceRows, setCompetenceRows, true)}
        </Box>

        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Savoir‑Faire
          </Typography>
          {renderEvalTable(savoirFaireRows, setSavoirFaireRows, true)}
        </Box>

        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Savoir‑Être
          </Typography>
          {renderEvalTable(savoirEtreRows, setSavoirEtreRows, true)}
        </Box>

        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Discipline
          </Typography>
          {renderEvalTable(disciplineRows, setDisciplineRows, true)}
        </Box>

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

        <Box mt={6} display="flex" gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => router.back()}>Annuler</Button>
          <Button variant="contained" color="primary" onClick={() => alert('Sauvegarde')}>Sauvegarder</Button>
        </Box>
      </Paper>
    </Container>
  );
}
