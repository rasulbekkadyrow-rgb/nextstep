'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  DndContext, DragOverlay, PointerSensor, KeyboardSensor, useSensor, useSensors,
  closestCorners, useDroppable, useDraggable,
  type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, GripVertical, CalendarClock, GraduationCap } from 'lucide-react';
import { LEAD_STAGES, documentProgress, type Lead, type LeadStage } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * KANBAN TAGTASY — süýşürip-taşlamak (drag & drop)
 * ==================================================================
 * Binagärlik kararlary:
 *
 * 1. `@dnd-kit` saýlandy (`react-beautiful-dnd` däl), sebäbi:
 *    · React 19 bilen doly işleýär;
 *    · klawiatura bilen süýşürmegi goldaýar (elýeterlilik talaby);
 *    · gurluşyk göwrümi kiçi.
 *
 * 2. OPTIMISTIK TÄZELEME: karta goýberilen badyna ekranda geçýär,
 *    serwere ýazgy soň iberilýär. Ýalňyşlyk bolsa yzyna gaýtarylýar.
 *
 * 3. KARTADAKY IŇ MÖHÜM MAGLUMAT — resminamalaryň ilerlemesi.
 *    Dolandyryjy kartany açman, näçe resminamanyň ýygnanandygyny
 *    görýär. «Resminamalar ýygnalýar» tapgyrynda günüň esasy sowaly
 *    şu bolýar, şonuň üçin ol karta göni çykaryldy.
 */
export function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const t = useTranslations('admin.sales');
  const [leads, setLeads] = useState(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    /* 6px süýşürilenden soň başlaýar — kartanyň üstündäki düwmelere
       basmak bilen garyşmazlygy üçin */
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const byStage = useMemo(() => {
    const map = {} as Record<LeadStage, Lead[]>;
    for (const stage of LEAD_STAGES) map[stage] = [];
    for (const lead of leads) map[lead.stage]?.push(lead);
    return map;
  }, [leads]);

  const activeLead = leads.find((l) => l.id === activeId) ?? null;

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const leadId = String(active.id);
    const nextStage = String(over.id) as LeadStage;
    const current = leads.find((l) => l.id === leadId);
    if (!current || current.stage === nextStage) return;

    const previous = leads;
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage: nextStage } : l)));

    try {
      const res = await fetch(`/api/leads/${leadId}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: nextStage }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setLeads(previous); // Ýalňyşlyk — öňki ýagdaýa dolanýarys
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(e: DragStartEvent) => setActiveId(String(e.active.id))}
      onDragEnd={handleDragEnd}
    >
      <p className="mb-4 text-body-sm text-faint">{t('dragHint')}</p>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {LEAD_STAGES.map((stage) => (
          <Column
            key={stage}
            stage={stage}
            label={t(`columns.${stage}`)}
            leads={byStage[stage]}
            isDragging={activeId !== null}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.16,1,0.3,1)' }}>
        {activeLead && <LeadCard lead={activeLead} overlay />}
      </DragOverlay>
    </DndContext>
  );
}

/**
 * Sütünleriň reňk kody — kabul prosesiniň temperaturasy:
 * bitarap çal (başlangyç) → gyzyl (işjeň iş) → ýaşyl (üstünlik).
 */
const STAGE_TONE: Record<LeadStage, string> = {
  new: 'bg-slate',
  consulted: 'bg-brand/60',
  documents: 'bg-warn',
  applied: 'bg-brand',
  accepted: 'bg-ok/70',
  enrolled: 'bg-ok',
  lost: 'bg-slate/50',
};

function Column({
  stage, label, leads, isDragging,
}: {
  stage: LeadStage; label: string; leads: Lead[]; isDragging: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  /* Sütündäki resminamalaryň ortaça dolulygy — tapgyryň «saglygy» */
  const avgDocs = leads.length
    ? Math.round(leads.reduce((s, l) => s + documentProgress(l.documents), 0) / leads.length)
    : 0;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex w-[18rem] shrink-0 flex-col rounded-2xl border p-3 transition-all duration-300',
        isOver
          ? 'border-brand/50 bg-brand/[0.05]'
          : isDragging
            ? 'border-dashed border-line/20 bg-surface/40'
            : 'border-line/10 bg-surface/40',
      )}
    >
      <div className="mb-3 flex items-center gap-2 px-1.5">
        <span className={cn('h-2 w-2 shrink-0 rounded-full', STAGE_TONE[stage])} aria-hidden />
        <h3 className="flex-1 truncate text-body-sm font-semibold">{label}</h3>
        <span className="tnum rounded-full bg-line/[0.07] px-1.5 py-0.5 text-micro font-bold text-muted">
          {leads.length}
        </span>
      </div>

      {leads.length > 0 && stage !== 'lost' && (
        <p className="tnum mb-3 px-1.5 font-mono text-micro text-faint">
          {avgDocs}% resminama
        </p>
      )}

      <div className="flex flex-1 flex-col gap-2.5">
        {leads.map((lead) => (
          <DraggableCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}

function DraggableCard({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(isDragging && 'opacity-30')}
    >
      <LeadCard lead={lead} dragHandle={{ ...listeners, ...attributes }} />
    </div>
  );
}

export function LeadCard({
  lead, dragHandle, overlay,
}: {
  lead: Lead;
  dragHandle?: Record<string, unknown>;
  overlay?: boolean;
}) {
  const t = useTranslations('admin.sales');
  const progress = documentProgress(lead.documents);

  const priorityTone = {
    high: 'border-brand/30 bg-brand/[0.07] text-brand',
    medium: 'border-warn/30 bg-warn/[0.08] text-warn',
    low: 'border-line/12 bg-line/[0.04] text-faint',
  }[lead.priority];

  const priorityLabel = {
    high: t('card.priorityHigh'),
    medium: t('card.priorityMedium'),
    low: t('card.priorityLow'),
  }[lead.priority];

  const localeFlag = { tm: '🇹🇲', ru: '🇷🇺', tr: '🇹🇷' }[lead.locale];

  /* Möhlet ýakynlaşsa, karta duýduryş reňkini alýar */
  const daysLeft = lead.deadlineAt
    ? Math.ceil((new Date(lead.deadlineAt).getTime() - Date.now()) / 86_400_000)
    : null;
  const urgent = daysLeft !== null && daysLeft <= 21;

  return (
    <motion.article
      layout={!overlay}
      className={cn(
        'group rounded-xl border bg-base p-3.5 transition-shadow duration-300',
        urgent ? 'border-warn/35' : 'border-line/10',
        overlay ? 'rotate-2 shadow-lift' : 'hover:shadow-soft',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...dragHandle}
          aria-label={t('dragHint')}
          className="mt-0.5 cursor-grab touch-none text-faint opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" aria-hidden />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-body-sm font-semibold">{lead.name}</p>
            <span aria-label={lead.locale} title={lead.locale}>{localeFlag}</span>
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-body-sm text-muted">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {lead.program}
          </p>
        </div>
      </div>

      {/* ---- Resminamalaryň ilerlemesi: kartadaky esasy görkeziji ---- */}
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-micro text-faint">{t('card.docsLabel')}</span>
          <span className="tnum font-mono text-micro font-bold text-muted">{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-line/[0.08]">
          <div
            className={cn('h-full rounded-full transition-all duration-500', progress === 100 ? 'bg-ok' : 'bg-brand')}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className={cn('rounded-md border px-2 py-0.5 text-micro font-semibold', priorityTone)}>
          {priorityLabel}
        </span>
        <span className="rounded-md border border-line/10 bg-surface/70 px-2 py-0.5 text-micro text-muted">
          {t(`sources.${lead.source}`)}
        </span>
        <span className="tnum rounded-md border border-line/10 bg-surface/70 px-2 py-0.5 font-mono text-micro text-muted">
          {lead.gradYear}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-line/[0.07] pt-3">
        {daysLeft !== null ? (
          <span className={cn('flex items-center gap-1.5 text-micro font-semibold', urgent ? 'text-warn' : 'text-faint')}>
            <CalendarClock className="h-3 w-3" aria-hidden />
            <span className="tnum">{daysLeft} gün</span>
          </span>
        ) : (
          <span className="truncate text-micro text-faint">
            {lead.targetUniversity ?? '—'}
          </span>
        )}

        <div className="flex shrink-0 items-center gap-1">
          <a
            href={`tel:${lead.phone.replace(/\s/g, '')}`}
            aria-label={t('card.callNow')}
            className="grid h-6 w-6 place-items-center rounded-md text-faint transition-colors hover:bg-line/[0.06] hover:text-brand"
          >
            <Phone className="h-3 w-3" aria-hidden />
          </a>
          <a
            href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('card.openChat')}
            className="grid h-6 w-6 place-items-center rounded-md text-faint transition-colors hover:bg-line/[0.06] hover:text-ok"
          >
            <MessageCircle className="h-3 w-3" aria-hidden />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
