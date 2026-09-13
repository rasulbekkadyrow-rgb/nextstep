import { cookies } from 'next/headers';
import { findAdminById, findAdminByEmail, avatarColorOf, initialsOf, type AdminUser } from './admins';
import { SESSION_COOKIE, verifySession, type SessionPayload } from './session';
import type { TeamMember } from '@/lib/types';

/**
 * HÄZIRKI ULANYJY — SERWER TARAPY
 * ==================================================================
 * Sahypalar «kim girdi?» diýen soragy şu ýerden soraýar.
 *
 * Näme üçin diňe kukä ynanylmaýar? Sebäbi kuki 7 gün ýaşaýar, emma
 * şol wagtyň içinde adam işden gidip biler ýa-da roly üýtgäp biler.
 * Şonuň üçin her sahypa açylanda gol barlanýar WE dolandyryjynyň
 * sanawdaky häzirki ýagdaýy okalýar. Sanawdan aýrylan adamyň kukisi
 * elinde galsa-da, ol indi hiç ýere girip bilmeýär.
 *
 * (Aradaky gatlak diňe goly barlaýar — ol Edge-de işleýär we faýl
 * ulgamyna elýeterliligi ýok. Şol sebäpli ikinji, doly barlag şu ýerde.)
 */

export interface CurrentAdmin {
  session: SessionPayload;
  user: AdminUser;
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const jar = await cookies();
  const session = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!session) return null;

  /* Belgi boýunça tapylmasa, e-poçta boýunça: gurşaw üýtgeýjisindäki
     ýazgynyň belgisi salgydan ýasalýar we salgy üýtgemeýär. */
  const user = (await findAdminById(session.sub)) ?? (await findAdminByEmail(session.email));
  if (!user || !user.active) return null;

  return { session, user };
}

/** `AdminShell` `TeamMember` görnüşini isleýär — öwrüji şu ýerde */
export function toTeamMember(user: AdminUser): TeamMember {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    avatarColor: avatarColorOf(user.email),
    initials: initialsOf(user.name),
  };
}
