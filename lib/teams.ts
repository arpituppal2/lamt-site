import fs from 'fs';
import path from 'path';

export type TeamMember = {
  name: string;
  grade: string;
  discordUsername?: string;
};

export type Team = {
  id: string;
  teamNumber: number;
  teamCode: string;
  schoolName: string;
  teamName?: string;
  division: 'MS' | 'HS';
  coachName: string;
  coachEmail: string;
  members: TeamMember[];
  createdAt: string;
};

const DATA_PATH = path.join(process.cwd(), 'data', 'teams.json');

function ensureFile() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, '[]');
}

export function getTeams(): Team[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')) as Team[];
}

export function saveTeams(teams: Team[]) {
  ensureFile();
  fs.writeFileSync(DATA_PATH, JSON.stringify(teams, null, 2));
}

export function getNextNumber(teams: Team[]): number {
  if (!teams.length) return 1;
  return Math.max(...teams.map((t) => t.teamNumber)) + 1;
}

export function formatCode(n: number): string {
  return `LAMT-2026-${n.toString().padStart(3, '0')}`;
}
