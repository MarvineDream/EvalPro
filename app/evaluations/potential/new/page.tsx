'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Slider,
  Paper,
  Card,
  CardContent,
  Typography,
  Grid,
} from '@mui/material';
import { ArrowLeft, Star } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

/* -------------------------------------------------------------------------- */
/* Types + mock employés                                                      */
/* -------------------------------------------------------------------------- */

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
};

export const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    position: 'Développeur',
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Curie',
    position: 'Chef de projet',
  },
];

/* -------------------------------------------------------------------------- */
/* Questions + cartes de classification                                       */
/* -------------------------------------------------------------------------- */

const questions = [
  'Est-ce que cette personne a la capacité de se challenger et de challenger les autres ?',
  'Quel degré de crédibilité et de confiance parvient-elle à créer autour d’elle ?',
  'Leadership et influence sur les autres',
  "Quel est son degré de curiosité et de spontanéité ? À quelle fréquence l’individu émet-il de nouvelles idées et se projette-t-il ?",
  'Quelle est la capacité de l’individu à recouper les informations et à prendre des décisions sans attendre de détenir toutes les informations ?',
  "Quel est son degré de rigueur dans l'accomplissement de ses activités ?",
  'Est-ce que cette personne exerce une influence efficace, grâce à ses convictions profondes ?',
  'Est-ce que cette personne anticipe l’avenir et planifie à l’avance, même en cas de grande incertitude ?',
  'Est-ce que cette personne fait preuve de résistance et de ténacité face aux problèmes et aux échecs ?',
  'Est-ce que cette personne démontre de l’ambition et de la motivation à évoluer et sortir de sa zone de confort ?',
  'Est-ce que cette personne est ouverte au feedback ? A-t-elle travaillé sur ce point et montré des améliorations tangibles ?',
];

const classificationCards = [
  {
    title: 'PROFESSIONAL',
    color: '#c62828',
    note: 'NOTE ≤ 17',
    description:
      'À l’aise dans un environnement connu ; adaptation et mobilité limitées.',
  },
  {
    title: 'ACHIEVER',
    color: '#f9a825',
    note: 'NOTE 18 – 35',
    description:
      'Bonne capacité d’adaptation et de résilience ; peut évoluer vers des rôles plus complexes à moyen terme.',
  },
  {
    title: 'POTENTIAL',
    color: '#1565c0',
    note: 'NOTE > 35',
    description:
      'Fort potentiel pour réussir dans un large éventail d’environnements et de rôles différents.',
  },
];
const fetchArticles = async (token: string) => {
  try {
    const res = await fetch('https://artiz-1ly2.onrender.com/api/admin/articles', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des articles');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur fetchArticles:', error);
    return null;
  }
};


/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function NewPotentialEvaluationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  useEffect(() => {
  const getArticles = async () => {
    if (!user?.token) return;

    const data = await fetchArticles(user.token);
    if (data) {
      console.log('Articles récupérés :', data);
      // Tu peux aussi les stocker avec un setState ici si tu veux les utiliser dans le composant
    }
  };

  getArticles();
}, [user?.token]);


  const staffId = searchParams.get('staffId') ?? '';

  const isHR = user?.role === 'RH';



  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [criteres, setCriteres] = useState(
    questions.map((q) => ({ question: q, note: 3 }))
  );
  const [commentaire, setCommentaire] = useState('');
  const [classification, setClassification] = useState('');
  const [noteGlobale, setNoteGlobale] = useState(0);
  const [moyenne, setMoyenne] = useState('0.00');
  const [finalClassification, setFinalClassification] = useState('PROFESSIONAL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const total = criteres.reduce((acc, curr) => acc + curr.note, 0);
    const avg = total / criteres.length;
    setNoteGlobale(total);
    setMoyenne(avg.toFixed(2));

    if (avg <= 2.5) setFinalClassification('PROFESSIONAL');
    else if (avg <= 4) setFinalClassification('ACHIEVER');
    else setFinalClassification('POTENTIAL');
  }, [criteres]);

  const handleChange = (index: number, value: number | number[]) => {
    const newCriteres = [...criteres];
    newCriteres[index].note = Math.round(value as number);
    setCriteres(newCriteres);
  };

  const handleSubmit = async () => {
    if (!selectedEmployee) {
      alert('Veuillez d’abord sélectionner un employé.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: selectedEmployee,
          type: 'EvaluationPotentiel',
          criteres,
          commentaire,
          classification: finalClassification,
          noteGlobale,
        }),
      });

      if (!res.ok) throw new Error('Erreur réseau.');

      alert('Évaluation enregistrée.');
      router.push('/evaluations/potentiel');
    } catch (err) {
      console.error(err);
      alert('Impossible de sauvegarder.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <Star className="h-8 w-8 text-purple-600" />
          <span>Nouvelle Évaluation de Potentiel</span>
        </h1>
      </div>

      <Grid container direction="column" spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Présentation de l’outil
            </Typography>
            <Typography paragraph>
              Cet outil vous aide, en tant que manager, à évaluer le potentiel
              de croissance d’un membre de votre équipe. Il se concentre sur les
              <strong> compétences comportementales</strong> afin d’identifier
              la capacité de la personne à évoluer vers des rôles plus
              complexes.
            </Typography>
            <Typography variant="h6" color="error" gutterBottom>
              Comment attribuer les notes ?
            </Typography>
            <Typography paragraph>
              Évaluez chaque critère de 1 à 5 selon l’impact et la fréquence des
              comportements observés.
            </Typography>

            <Box sx={{ overflowX: 'auto' }}>
              <table
                style={{
                  borderCollapse: 'collapse',
                  width: '100%',
                  fontSize: '0.85rem',
                }}
              >
                <thead>
                  <tr style={{ background: '#c00', color: '#fff' }}>
                    <th style={{ padding: 8 }}></th>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <th key={n} style={{ padding: 8, border: '1px solid #ddd' }}>
                        {n}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: 12,
                        border: '1px solid #ddd',
                        fontWeight: 700,
                        color: 'red',
                        textAlign: 'center',
                      }}
                    >
                      Grille d’évaluation
                    </td>
                    <td style={{ padding: 12, border: '1px solid #ddd' }}>
                      Impact nul, démonstrations occasionnelles
                    </td>
                    <td style={{ padding: 12, border: '1px solid #ddd' }}>
                      Impact faible, démonstrations occasionnelles
                    </td>
                    <td style={{ padding: 12, border: '1px solid #ddd' }}>
                      Impact visible mais pas constant
                    </td>
                    <td style={{ padding: 12, border: '1px solid #ddd' }}>
                      Impact clair et constant
                    </td>
                    <td style={{ padding: 12, border: '1px solid #ddd' }}>
                      Impact large, au-delà du périmètre
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {classificationCards.map((card) => (
                <Grid key={card.title} item xs={12} sm={4}>
                  <Card
                    sx={{
                      height: '100%',
                      background: card.color,
                      color: '#fff',
                      borderRadius: 2,
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{card.title}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {card.note}
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {card.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <TextField
              select
              label="Employé à évaluer"
              fullWidth
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              {mockEmployees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} — {emp.position}
                </MenuItem>
              ))}
            </TextField>
          </Paper>

          {criteres.map((critere, idx) => (
            <Paper key={idx} elevation={1} sx={{ p: 2, mb: 2 }}>
              <Typography sx={{ mb: 1 }}>{critere.question}</Typography>
              <Slider
                value={critere.note}
                min={1}
                max={5}
                step={1}
                marks
                onChange={(e, val) => handleChange(idx, val)}
                valueLabelDisplay="auto"
              />
            </Paper>
          ))}

          <Typography variant="h6" sx={{ mt: 3 }}>
            Note globale : {noteGlobale} / {criteres.length * 5} ({moyenne} / 5)
          </Typography>
          <Typography variant="h6" color="error" sx={{ mt: 1 }}>
            Classification finale : {finalClassification}
          </Typography>

          <TextField
            label="Commentaire global"
            multiline
            rows={4}
            fullWidth
            sx={{ mt: 3 }}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
          />

          <TextField
            select
            label="Classification finale (option RH)"
            fullWidth
            sx={{ mt: 2 }}
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
          >
            <MenuItem value="A">A — Très haut potentiel</MenuItem>
            <MenuItem value="B+">B+ — Progression rapide</MenuItem>
            <MenuItem value="B">B — Progression à moyen terme</MenuItem>
            <MenuItem value="C">C — Potentiel à confirmer</MenuItem>
            <MenuItem value="D">D — Potentiel limité</MenuItem>
          </TextField>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              Enregistrer l’évaluation
            </Button>
            <Button variant="outlined" onClick={() => router.back()}>
              Annuler
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
