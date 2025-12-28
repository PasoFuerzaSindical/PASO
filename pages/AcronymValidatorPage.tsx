
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Acronym } from '../lib/types';

const initialAcronyms: Acronym[] = [
  { id: 1, text: 'Para Aguantar, Sonríe Obligado', votes: 42 },
  { id: 2, text: 'Profesionales Agotados Sin Opciones', votes: 35 },
  { id: 3, text: 'Puede Aguantar, Sigue Operando', votes: 18 },
];

const AcronymValidatorPage: React.FC = () => {
  const [acronyms, setAcronyms] = useState<Acronym[]>(initialAcronyms.sort((a,b) => b.votes - a.votes));
  const [newAcronym, setNewAcronym] = useState('');

  const handleVote = (id: number, amount: number) => {
    setAcronyms(
      acronyms
        .map((a) => (a.id === id ? { ...a, votes: a.votes + amount } : a))
        .sort((a, b) => b.votes - a.votes)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAcronym.trim()) {
      const newEntry: Acronym = {
        id: Date.now(),
        text: newAcronym.trim(),
        votes: 1,
      };
      setAcronyms([...acronyms, newEntry].sort((a, b) => b.votes - a.votes));
      setNewAcronym('');
    }
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Propón un Acrónimo para P.A.S.O.</CardTitle>
          <CardDescription>
            "Si pasas de todo, P.A.S.O. es tu sindicato". Ayúdanos a encontrar el verdadero significado.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Input
              value={newAcronym}
              onChange={(e) => setNewAcronym(e.target.value)}
              placeholder="Ej: Para Ayer, Sin Oposición"
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Proponer Significado</Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ranking de Acrónimos</CardTitle>
          <CardDescription>Los más votados por la comunidad del precariado.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {acronyms.map((acronym) => (
              <li key={acronym.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <p className="font-medium">{acronym.text}</p>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleVote(acronym.id, 1)}>
                    <ThumbsUp className="h-4 w-4 text-brand-green" />
                  </Button>
                  <span className="font-bold w-8 text-center">{acronym.votes}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleVote(acronym.id, -1)}>
                    <ThumbsDown className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcronymValidatorPage;
