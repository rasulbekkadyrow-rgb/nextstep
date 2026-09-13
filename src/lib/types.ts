import type { Locale } from './i18n';

/* ==================================================================
   MAGLUMAT NUSGALARY (Data models)
   Talyp kabul ediş maslahaty üçin: ýüztutma, resminama barlagy,
   uniwersitetler we saýtyň mazmuny.
   ================================================================== */

/**
 * Kabul tapgyrlary — Kanban tagtasynyň sütünleri.
 * Tertip hakyky prosesi yzarlaýar, şonuň üçin ýerleri çalşyrylmaly däl:
 * her tapgyr diňe özünden öňkiden soň gelip bilýär.
 */
export const LEAD_STAGES = [
  'new',        // Täze ýüztutma — entek habarlaşylmadyk
  'consulted',  // Maslahat berildi, uniwersitetleriň sanawy iberildi
  'documents',  // Resminamalar ýygnalýar
  'applied',    // Arza uniwersitete tabşyryldy
  'accepted',   // Kabul haty geldi
  'enrolled',   // Ýazgy tamamlandy — üstünlikli jemlenen iş
  'lost',       // Ýitirilen (sebäbi bellenýär)
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

/** Ýüztutmanyň gelen çeşmesi */
export const LEAD_SOURCES = ['instagram', 'site', 'referral', 'whatsapp', 'call'] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export type Priority = 'high' | 'medium' | 'low';

/**
 * Resminamalaryň barlag sanawy.
 * Dolandyryjy kartany açman, näçe resminamanyň ýygnanandygyny görýär —
 * bu Kanban tagtasyndaky iň köp seredilýän maglumat.
 */
export interface DocumentChecklist {
  passport: boolean;    // Pasport
  diploma: boolean;     // Orta mekdebiň attestaty
  transcript: boolean;  // Baha sahypasy (transkript)
  photo: boolean;       // Biometrik surat
}

export const DOCUMENT_KEYS = ['passport', 'diploma', 'transcript', 'photo'] as const;

/** Ýygnalan resminamalaryň göterimi — kartadaky ilerleme çyzygy üçin */
export function documentProgress(docs: DocumentChecklist): number {
  const done = DOCUMENT_KEYS.filter((k) => docs[k]).length;
  return Math.round((done / DOCUMENT_KEYS.length) * 100);
}

/** Bir talybyň ýüztutmasy — CRM-iň esasy birligi */
export interface Lead {
  id: string;
  /** Talybyň ady (ene-atasy ýüz tutan bolsa-da, kart talyba degişli) */
  name: string;
  phone: string;
  /** Mekdebi gutarýan ýa-da gutaran ýyly — ileri tutmak üçin möhüm */
  gradYear: string;
  /** Okamak isleýän ugry: «Lukmançylyk», «Inženerçilik»… */
  program: string;
  /** Talybyň isleýän uniwersiteti (belli bolsa) */
  targetUniversity?: string;
  message?: string;
  source: LeadSource;
  stage: LeadStage;
  priority: Priority;
  assigneeId: string;
  /** Ýüztutmanyň gelen sahypasynyň dili — haýsy dilde jogap bermelidigi */
  locale: Locale;
  documents: DocumentChecklist;
  createdAt: string;
  lastTouchAt?: string;
  /** Iň ýakyn möhlet: uniwersitetiň arza kabul ediş soňky güni */
  deadlineAt?: string;
  tags: string[];
  notes: LeadNote[];
}

export interface LeadNote {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'sales' | 'analytics' | 'owner';
  avatarColor: string;
  initials: string;
}

/* ---------------- Seljerme paneli üçin görnüşler ---------------- */

export interface TrafficPoint {
  date: string;
  visitors: number;
  sessions: number;
  leads: number;
}

export interface SourceShare {
  key: LeadSource | 'organic' | 'direct';
  value: number;
}

/** Saýtdaky öwrülme tapgyrlary — CRM tapgyrlaryndan tapawutly */
export interface FunnelStage {
  key: 'visit' | 'scroll' | 'formOpen' | 'formSubmit' | 'consulted';
  count: number;
}

export interface KpiValue {
  key: string;
  value: number;
  delta: number;
  format: 'number' | 'percent' | 'duration';
}

/* ---------------- Mazmun dolandyryşy üçin görnüşler ---------------- */

/** Üç dilde-de berilmeli ýazgy. Terjimäniň dolulygy şu nusga boýunça ölçelýär. */
export type LocalizedText = Record<Locale, string>;

/**
 * Kabul haty — saýtdaky esasy subutnama birligi.
 *
 * ETIKA BELLIGI: `consentGiven` meýdany bilkastlaýyn hökmany edildi.
 * Talybyň ýazmaça razylygy bolmasa, hat saýtda görkezilmeýär —
 * bu diňe etiki däl, hukuk taýdan hem zerur şert.
 */
export interface AcceptanceLetter {
  id: string;
  order: number;
  visible: boolean;
  consentGiven: boolean;
  /** Talybyň ady — gysgaldylan görnüşde saklanmagy maslahat berilýär: «A. Myradow» */
  studentName: string;
  university: string;
  program: LocalizedText;
  academicYear: string;
  /** Hatyň şekili — şahsy maglumatlar bulaşdyrylan (blur) bolmaly */
  imageUrl?: string;
}

export interface University {
  id: string;
  name: string;
  short: string;
  city: string;
  note: LocalizedText;
  logoUrl?: string;
  visible: boolean;
}

/** Telegram integrasiýasynyň sazlamalary */
export interface TelegramSettings {
  connected: boolean;
  botUsername: string;
  chatId: string;
  events: {
    newLead: boolean;
    stageChange: boolean;
    accepted: boolean;
    lost: boolean;
    dailyDigest: boolean;
  };
  template: string;
}
