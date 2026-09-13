import { readJson, updateJson } from './store';
import type { AdminRole } from './session';

/**
 * DOLANDYRYJYLARYŇ SANAWY
 * ==================================================================
 * Esasy pikir: **ulgamda parol ýok — rugsat e-poçta salgysynda**.
 * Kimiň salgysy şu sanawda bar bolsa, şol adam girip bilýär. Täze
 * işgär goşmak = onuň e-poçtasyny sanawa goşmak. Parol paýlaşmak,
 * ony ýatdan çykarmak ýa-da işden gidende çalyşmak meselesi ýok:
 * salgy sanawdan aýrylýar — giriş şobada ýapylýar.
 *
 * Sanawyň iki çeşmesi bar:
 *
 *  1. `ADMIN_EMAILS` gurşaw üýtgeýjisi — «esasy eýeler». Bular
 *     panelden POZULYP BILINMEÝÄR. Sebäbi: eger ýalňyşlyk bilen ähli
 *     dolandyryjy pozulsa, ulgama hiç kim girip bilmezdi. Gurşaw
 *     üýtgeýjisi şol gapyny hemişe açyk saklaýar.
 *
 *  2. Panelden goşulanlar — `.data/admins.json` faýlynda.
 *
 * Ýazylyşy:  ADMIN_EMAILS="ali@gmail.com:owner:Aly M., vepa@icloud.com:sales:Wepa G."
 *            (rol we at ýazylmasa: rol `owner`, at e-poçtadan alynýar)
 */

export interface AdminUser {
  id: string;
  /** Hemişe kiçi harplarda saklanýar — deňeşdirmede tapawut bolmaz ýaly */
  email: string;
  name: string;
  role: AdminRole;
  /** Işden giden işgäriň salgysyny pozman, wagtlaýyn ýapyp bolýar */
  active: boolean;
  /** Gurşaw üýtgeýjisinden gelen bolsa — panelden pozulmaýar */
  protected: boolean;
  createdAt: string;
  createdBy?: string;
  lastLoginAt?: string;
}

const FILE = 'admins.json';

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/** E-poçtadan okalýan at ýasamak: «vepa.gurbanow@…» → «Vepa Gurbanow» */
function nameFromEmail(email: string): string {
  return email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Atdan iki harply nyşan — gapdal menýudaky tegelek üçin */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NS';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Her dolandyryja hemişelik reňk — e-poçtadan hasaplanýar, tötänleýin däl */
const AVATAR_COLORS = ['132 0 252', '12 168 240', '13 148 104', '176 132 58', '118 114 148'];

export function avatarColorOf(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i += 1) hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function parseEnvAdmins(): AdminUser[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return [];

  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [emailPart, rolePart, namePart] = entry.split(':').map((piece) => piece?.trim());
      const email = normalizeEmail(emailPart ?? '');
      const role: AdminRole =
        rolePart === 'sales' || rolePart === 'analytics' || rolePart === 'owner' ? rolePart : 'owner';

      return {
        id: `env-${email}`,
        email,
        name: namePart || nameFromEmail(email),
        role,
        active: true,
        protected: true,
        createdAt: new Date(0).toISOString(),
      } satisfies AdminUser;
    })
    .filter((admin) => admin.email.includes('@'));
}

/**
 * Ähli dolandyryjylar: gurşawdakylar + faýldakylar.
 * Gurşawdakylar hemişe öňde — çaknyşyk bolsa, olaryň roly güýçli.
 */
export async function listAdmins(): Promise<AdminUser[]> {
  const stored = await readJson<AdminUser[]>(FILE, []);
  const env = parseEnvAdmins();
  const envEmails = new Set(env.map((admin) => admin.email));

  /* Gurşawdaky ýazgy rol we at boýunça güýçli, ýöne «soňky giriş»
     wagty diňe faýlda bolýar — şonuň üçin ol geçirilýär. */
  const merged = env.map((admin) => {
    const saved = stored.find((item) => normalizeEmail(item.email) === admin.email);
    return saved?.lastLoginAt ? { ...admin, lastLoginAt: saved.lastLoginAt } : admin;
  });

  return [...merged, ...stored.filter((admin) => !envEmails.has(normalizeEmail(admin.email)))];
}

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  const target = normalizeEmail(email);
  const all = await listAdmins();
  return all.find((admin) => normalizeEmail(admin.email) === target) ?? null;
}

export async function findAdminById(id: string): Promise<AdminUser | null> {
  const all = await listAdmins();
  return all.find((admin) => admin.id === id) ?? null;
}

/**
 * SAZLAMA TERTIBI (setup mode).
 * Sanaw düýbünden boş bolsa, ulgam entek sazlanmadyk diýmekdir.
 *  · Işläp düzüş wagtynda — islendik salga kod iberilýär we ol `owner`
 *    hökmünde girýär. Şeýtmesek, `.env` doldurylýança paneli görüp
 *    bolmazdy.
 *  · Önümçilikde — hiç kim girip bilmeýär. Bu bilkastlaýyn: açyk
 *    serwerde «islendik adam eýe bolýar» ýagdaýy bolup bilmez.
 */
export function isSetupMode(adminCount: number): boolean {
  return adminCount === 0 && process.env.NODE_ENV !== 'production';
}

export async function addAdmin(input: {
  email: string;
  name?: string;
  role: AdminRole;
  createdBy?: string;
}): Promise<AdminUser> {
  const email = normalizeEmail(input.email);

  const existing = await findAdminByEmail(email);
  if (existing) throw new Error('already_exists');

  const user: AdminUser = {
    id: `adm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    email,
    name: input.name?.trim() || nameFromEmail(email),
    role: input.role,
    active: true,
    protected: false,
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy,
  };

  await updateJson<AdminUser[]>(FILE, [], (current) => [...current, user]);
  return user;
}

export async function updateAdmin(
  id: string,
  patch: Partial<Pick<AdminUser, 'name' | 'role' | 'active' | 'lastLoginAt'>>,
): Promise<void> {
  await updateJson<AdminUser[]>(FILE, [], (current) =>
    current.map((admin) => (admin.id === id ? { ...admin, ...patch } : admin)),
  );
}

export async function removeAdmin(id: string): Promise<void> {
  if (id.startsWith('env-')) throw new Error('protected');
  await updateJson<AdminUser[]>(FILE, [], (current) => current.filter((admin) => admin.id !== id));
}

/**
 * Soňky giriş wagtyny bellemek.
 * Gurşawdan gelen dolandyryjylar faýlda ýok — olar üçin ýazgy açylýar
 * (diňe «soňky giriş» üçin; rol we at ýene-de gurşawdan alynýar).
 */
export async function touchLogin(user: AdminUser): Promise<void> {
  const now = new Date().toISOString();

  if (!user.protected) {
    await updateAdmin(user.id, { lastLoginAt: now });
    return;
  }

  await updateJson<AdminUser[]>(FILE, [], (current) => {
    const index = current.findIndex((admin) => admin.id === user.id);
    if (index === -1) return [...current, { ...user, lastLoginAt: now }];
    const next = [...current];
    next[index] = { ...next[index], lastLoginAt: now };
    return next;
  });
}
