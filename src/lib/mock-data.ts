import type {
  Lead, TeamMember, TrafficPoint, FunnelStage, SourceShare, TelegramSettings,
} from './types';

/**
 * GÖRKEZME MAGLUMATLAR (Mock data)
 * ------------------------------------------------------------------
 * Diňe interfeýsi işläp düzmek we synag etmek üçin. Önümçilikde bu
 * faýlyň ýerine hakyky maglumat gory ulanylýar — komponentleriň kody
 * üýtgemeýär, sebäbi maglumatlaryň görnüşi (`types.ts`) şol bir bolýar.
 *
 * Talyplaryň atlary toslamadyr we hakyky adamlara degişli däldir.
 */

export const TEAM: TeamMember[] = [
  { id: 'u1', name: 'Serdar M.', role: 'sales', initials: 'SM', avatarColor: 'var(--c-brand)' },
  { id: 'u2', name: 'Aýnur G.', role: 'analytics', initials: 'AG', avatarColor: 'var(--c-ok)' },
  { id: 'u3', name: 'Kerim B.', role: 'owner', initials: 'KB', avatarColor: 'var(--c-gold)' },
];

const docs = (p: boolean, d: boolean, t: boolean, f: boolean) => ({
  passport: p, diploma: d, transcript: t, photo: f,
});

export const MOCK_LEADS: Lead[] = [
  {
    id: 'NS-1041', name: 'Gurbanmyrat Ataýew', phone: '+993 65 12 34 56',
    gradYear: '2026', program: 'Inženerçilik we tehnologiýa',
    source: 'instagram', stage: 'new', priority: 'high',
    assigneeId: 'u1', locale: 'tm', createdAt: '2026-09-12T08:14:00Z',
    documents: docs(false, false, false, false),
    tags: ['2026 uçurym'], notes: [],
    message: 'Kompýuter inženerligi boýunça okamak isleýärin.',
  },
  {
    id: 'NS-1040', name: 'Ольга Петрова', phone: '+993 62 88 90 11',
    gradYear: '2025', program: 'Медицина', targetUniversity: 'Medipol',
    source: 'site', stage: 'consulted', priority: 'high',
    assigneeId: 'u1', locale: 'ru', createdAt: '2026-09-11T14:30:00Z',
    lastTouchAt: '2026-09-12T09:05:00Z',
    documents: docs(true, false, false, false),
    tags: ['lukmançylyk'], notes: [
      { id: 'n1', authorId: 'u1', text: 'Uniwersitetleriň sanawy WhatsApp arkaly iberildi.', createdAt: '2026-09-12T09:05:00Z' },
    ],
  },
  {
    id: 'NS-1039', name: 'Mähri Yılmaz', phone: '+90 532 111 22 33',
    gradYear: '2025', program: 'Mimarlık ve tasarım', targetUniversity: 'Bahçeşehir',
    source: 'referral', stage: 'documents', priority: 'medium',
    assigneeId: 'u1', locale: 'tr', createdAt: '2026-09-09T11:00:00Z',
    lastTouchAt: '2026-09-11T16:20:00Z', deadlineAt: '2026-09-30T00:00:00Z',
    documents: docs(true, true, false, true),
    tags: ['portfolio gerek'], notes: [],
  },
  {
    id: 'NS-1038', name: 'Jennet Hojaýewa', phone: '+993 61 45 67 89',
    gradYear: '2025', program: 'Ykdysadyýet we dolandyryş', targetUniversity: 'İstanbul Aydın',
    source: 'whatsapp', stage: 'applied', priority: 'medium',
    assigneeId: 'u1', locale: 'tm', createdAt: '2026-09-06T09:45:00Z',
    lastTouchAt: '2026-09-10T13:00:00Z', deadlineAt: '2026-10-05T00:00:00Z',
    documents: docs(true, true, true, true),
    tags: [], notes: [],
  },
  {
    id: 'NS-1035', name: 'Batyr Sähedow', phone: '+993 64 22 33 44',
    gradYear: '2024', program: 'Diş lukmançylygy', targetUniversity: 'Medipol',
    source: 'call', stage: 'accepted', priority: 'high',
    assigneeId: 'u1', locale: 'tm', createdAt: '2026-08-28T10:10:00Z',
    lastTouchAt: '2026-09-08T12:00:00Z',
    documents: docs(true, true, true, true),
    tags: ['kabul haty geldi'], notes: [],
  },
  {
    id: 'NS-1030', name: 'Aýlar Nurgeldiýewa', phone: '+993 63 55 66 77',
    gradYear: '2024', program: 'Halkara gatnaşyklar', targetUniversity: 'İstinye',
    source: 'instagram', stage: 'enrolled', priority: 'low',
    assigneeId: 'u1', locale: 'tm', createdAt: '2026-08-14T15:20:00Z',
    lastTouchAt: '2026-09-02T11:30:00Z',
    documents: docs(true, true, true, true),
    tags: ['ýazgy tamamlandy'], notes: [],
  },
  {
    id: 'NS-1032', name: 'Şemşat Baýramowa', phone: '+993 63 77 88 99',
    gradYear: '2023-nji ýyl we ondan öň', program: 'Entek kesgitlemedim',
    source: 'instagram', stage: 'lost', priority: 'low',
    assigneeId: 'u1', locale: 'tm', createdAt: '2026-08-22T15:20:00Z',
    lastTouchAt: '2026-09-01T11:30:00Z',
    documents: docs(false, false, false, false),
    tags: ['indiki ýyla süýşürdi'], notes: [],
  },
];

/* ---------------- Seljerme paneli üçin görkezme maglumatlar ---------------- */

export const TRAFFIC_30D: TrafficPoint[] = Array.from({ length: 30 }, (_, i) => {
  const day = new Date(2026, 7, 14 + i);
  /* Hepdäniň ahyrynda gatnaw peselýär — hakyky görnüşe ýakynlaşdyrmak üçin */
  const weekend = [0, 6].includes(day.getDay()) ? 0.68 : 1;
  const trend = 1 + i * 0.021;
  const visitors = Math.round((180 + Math.sin(i / 2.6) * 42) * weekend * trend);
  return {
    date: day.toISOString().slice(0, 10),
    visitors,
    sessions: Math.round(visitors * 1.28),
    leads: Math.max(1, Math.round(visitors * (0.035 + i * 0.0008))),
  };
});

export const SOURCE_SHARES: SourceShare[] = [
  { key: 'instagram', value: 46 },
  { key: 'organic', value: 21 },
  { key: 'direct', value: 14 },
  { key: 'whatsapp', value: 11 },
  { key: 'referral', value: 8 },
];

export const FUNNEL: FunnelStage[] = [
  { key: 'visit', count: 6480 },
  { key: 'scroll', count: 3910 },
  { key: 'formOpen', count: 812 },
  { key: 'formSubmit', count: 294 },
  { key: 'consulted', count: 138 },
];

export const DEVICE_SHARES = [
  { key: 'mobile' as const, value: 78 },
  { key: 'desktop' as const, value: 17 },
  { key: 'tablet' as const, value: 5 },
];

export const LANG_SHARES = [
  { key: 'tm', value: 61 },
  { key: 'ru', value: 27 },
  { key: 'tr', value: 12 },
];

export const TELEGRAM_DEFAULTS: TelegramSettings = {
  connected: true,
  botUsername: '@nextstep_crm_bot',
  chatId: '-1002xxxxxxxxx',
  events: { newLead: true, stageChange: true, accepted: true, lost: false, dailyDigest: true },
  template:
    '🎓 Täze ýüztutma\n👤 {name}\n📞 {phone}\n📚 Ugry: {program}\n🗓 Gutarýan ýyly: {gradYear}\n🌐 Çeşme: {source} · Dil: {locale}\n🕒 {time}',
};
