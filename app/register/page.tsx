'use client';

import { useState } from 'react';

type MemberInput = { name: string; grade: string; discordUsername: string };

export default function RegisterPage() {
  const [schoolName, setSchoolName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [division, setDivision] = useState('');
  const [coachName, setCoachName] = useState('');
  const [coachEmail, setCoachEmail] = useState('');
  const [members, setMembers] = useState<MemberInput[]>([
    { name: '', grade: '', discordUsername: '' },
    { name: '', grade: '', discordUsername: '' },
    { name: '', grade: '', discordUsername: '' },
    { name: '', grade: '', discordUsername: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ teamCode: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateMember = (i: number, field: keyof MemberInput, val: string) =>
    setMembers((prev) => { const n = [...prev]; n[i] = { ...n[i], [field]: val }; return n; });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setResult(null); setLoading(true);
    const filteredMembers = members.filter((m) => m.name.trim());
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolName, teamName: teamName || undefined, division, coachName, coachEmail, members: filteredMembers }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Registration failed');
      else setResult({ teamCode: data.teamCode });
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Team Registration</h1>
        <p className="text-slate-500 mb-6">LAMT 2026 &mdash; May 23, 2026. One form per team.</p>

        {result && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-5 py-4">
            <p className="text-green-800 font-semibold text-lg">Registration submitted!</p>
            <p className="text-green-700 mt-1">Your team code is <span className="font-mono font-bold">{result.teamCode}</span>.</p>
            <p className="text-green-600 text-sm mt-1">Join our Discord and share this code to get your team channel and role.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-5 py-4 text-red-800">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">School Name *</label>
              <input required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={schoolName} onChange={e => setSchoolName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Team Name (optional)</label>
              <input className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={teamName} onChange={e => setTeamName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Division *</label>
              <select required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={division} onChange={e => setDivision(e.target.value)}>
                <option value="">Select division</option>
                <option value="MS">Middle School</option>
                <option value="HS">High School</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Coach Name *</label>
              <input required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={coachName} onChange={e => setCoachName(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Coach Email *</label>
              <input required type="email" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={coachEmail} onChange={e => setCoachEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">Team Members (up to 4)</h2>
            <p className="text-xs text-slate-500 mb-3">At least 1 required. Discord usernames help us auto-assign roles when you join the server.</p>
            <div className="space-y-3">
              {members.map((m, i) => (
                <div key={i} className="grid md:grid-cols-3 gap-3 border border-slate-100 rounded-lg p-3 bg-slate-50">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Member {i + 1} Name</label>
                    <input className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm" value={m.name} onChange={e => updateMember(i, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Grade</label>
                    <input className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm" placeholder="e.g. 10" value={m.grade} onChange={e => updateMember(i, 'grade', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Discord Username</label>
                    <input className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm" placeholder="e.g. mathkid123" value={m.discordUsername} onChange={e => updateMember(i, 'discordUsername', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#2774AE] text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition">
            {loading ? 'Submitting…' : 'Submit Registration'}
          </button>
        </form>
      </div>
    </main>
  );
}
