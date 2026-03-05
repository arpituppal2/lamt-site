import { NextRequest, NextResponse } from 'next/server';
import { getTeams, saveTeams, getNextNumber, formatCode, Team } from '@/lib/teams';

const WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const { schoolName, teamName, division, coachName, coachEmail, members } = body;

  if (!schoolName || !coachName || !coachEmail || !division)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

  if (!Array.isArray(members) || !members.length)
    return NextResponse.json({ error: 'At least one member required' }, { status: 400 });

  if (members.length > 4)
    return NextResponse.json({ error: 'Max 4 members per team' }, { status: 400 });

  const teams = getTeams();
  const num = getNextNumber(teams);
  const teamCode = formatCode(num);

  const newTeam: Team = {
    id: crypto.randomUUID(),
    teamNumber: num,
    teamCode,
    schoolName,
    teamName,
    division,
    coachName,
    coachEmail,
    members,
    createdAt: new Date().toISOString(),
  };

  teams.push(newTeam);
  saveTeams(teams);

  // Post to Discord webhook
  if (WEBHOOK) {
    const memberLines = members
      .map((m: { name: string; grade: string; discordUsername?: string }, i: number) => {
        const disc = m.discordUsername ? ` | Discord: ${m.discordUsername}` : '';
        return `${i + 1}. ${m.name} (Grade ${m.grade})${disc}`;
      })
      .join('\n');

    await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: `New Registration: ${teamCode}`,
          color: 0x2774ae,
          fields: [
            { name: 'School', value: `${schoolName}${teamName ? ` — ${teamName}` : ''}`, inline: false },
            { name: 'Division', value: division === 'MS' ? 'Middle School' : 'High School', inline: true },
            { name: 'Coach', value: `${coachName} (${coachEmail})`, inline: false },
            { name: 'Members', value: memberLines || 'N/A', inline: false },
          ],
          timestamp: new Date().toISOString(),
        }],
      }),
    }).catch(console.error);
  }

  return NextResponse.json({ success: true, teamCode, teamNumber: num });
}
