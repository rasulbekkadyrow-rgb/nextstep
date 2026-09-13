'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Send, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * MINIMALISTIK SOWALNAMA FORMASY
 * ------------------------------------------------------------------
 * Konwersiýa üçin kararlar:
 *  · Diňe 3 hökmany meýdan (at, telefon, gutarýan ýyl) — her goşmaça
 *    meýdan konwersiýany peseldýär.
 *  · «Mekdebi gutarýan ýyly» hökmany, sebäbi ol ýüztutmanyň
 *    gyssaglylygyny kesgitleýär: şu ýyl gutarýan talyp bilen derrew
 *    habarlaşmaly, indiki ýylyňky bolsa garaşyp biler.
 *  · «Okamak isleýän ugry» islege görä: talyplaryň bir bölegi entek
 *    karar bermedik bolýar, olary hökmany saýlaw bilen gorkuzmaly däl.
 *  · Ýalňyşlar meýdanyň aşagynda, gyzyl reňkde we düşnükli dilde çykýar.
 *  · Iberilenden soň forma ýerine tassyklama görkezilýär — täzeden
 *    ibermek howpy aýrylýar.
 *  · Ähli ýazgylar `next-intl` arkaly üç dilde-de gelýär.
 */

const buildSchema = (m: (key: string) => string) =>
  z.object({
    name: z.string().min(1, m('nameRequired')).min(2, m('nameShort')),
    phone: z
      .string()
      .min(1, m('phoneRequired'))
      /* Türkmenistan (+993) we Türkiýe (+90) belgileri we meňzeşleri */
      .regex(/^[+]?[\d\s()-]{7,20}$/, m('phoneInvalid')),
    gradYear: z.string().min(1, m('gradYearRequired')),
    program: z.string().optional(),
    channel: z.string().optional(),
    message: z.string().max(600).optional(),
  });

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

export function LeadForm() {
  const t = useTranslations('form');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const schema = buildSchema((key) => t(`errors.${key}`));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        /* `locale` iberilýär: dolandyryjy haýsy dilde jogap bermelidigini
           derrew görýär — bu üç dilli saýtda möhüm. */
        body: JSON.stringify({ ...values, locale, source: 'site' }),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  const gradYearOptions = t.raw('gradYearOptions') as string[];
  const programOptions = t.raw('programOptions') as string[];
  const channelOptions = t.raw('channelOptions') as string[];

  return (
    <div id="arza" className="scroll-mt-24">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[26rem] flex-col items-center justify-center rounded-3xl border border-ok/30 bg-ok/[0.06] p-10 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 240, damping: 14 }}
              className="grid h-16 w-16 place-items-center rounded-full bg-ok text-base"
            >
              <Check className="h-8 w-8" strokeWidth={3} />
            </motion.span>
            <h3 className="mt-6 text-h3">{t('successTitle')}</h3>
            <p className="mt-3 max-w-[40ch] text-body text-muted">{t('successText')}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hairline-grad rounded-3xl bg-surface/60 p-7 backdrop-blur-sm md:p-9"
          >
            <p className="eyebrow">{t('eyebrow')}</p>
            <h3 className="mt-4 text-h3">{t('title')}</h3>
            <p className="mt-3 max-w-[46ch] text-body-sm text-muted">{t('subtitle')}</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field label={t('fields.name.label')} error={errors.name?.message} className="sm:col-span-2">
                <input {...register('name')} placeholder={t('fields.name.placeholder')} className={inputClass(!!errors.name)} autoComplete="name" />
              </Field>

              <Field label={t('fields.phone.label')} error={errors.phone?.message}>
                <input {...register('phone')} type="tel" inputMode="tel" dir="ltr" placeholder={t('fields.phone.placeholder')} className={cn(inputClass(!!errors.phone), 'tnum')} autoComplete="tel" />
              </Field>

              <Field label={t('fields.gradYear.label')} error={errors.gradYear?.message}>
                <select {...register('gradYear')} defaultValue="" className={inputClass(!!errors.gradYear)}>
                  <option value="" disabled>{t('fields.gradYear.placeholder')}</option>
                  {gradYearOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </Field>

              <Field label={t('fields.program.label')} className="sm:col-span-2">
                <select {...register('program')} defaultValue="" className={inputClass(false)}>
                  <option value="" disabled>{t('fields.program.placeholder')}</option>
                  {programOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </Field>

              <Field label={t('fields.channel.label')} className="sm:col-span-2">
                <select {...register('channel')} defaultValue="" className={inputClass(false)}>
                  <option value="" disabled>{t('fields.channel.placeholder')}</option>
                  {channelOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </Field>

              <Field label={t('fields.message.label')} className="sm:col-span-2">
                <textarea {...register('message')} rows={3} placeholder={t('fields.message.placeholder')} className={cn(inputClass(false), 'resize-none')} />
              </Field>
            </div>

            {status === 'error' && (
              <p className="mt-5 flex items-start gap-2 rounded-xl border border-brand/25 bg-brand/[0.07] p-3.5 text-body-sm text-brand">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span><strong>{t('errorTitle')}.</strong> {t('errorText')}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative mt-7 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full brand-gradient px-7 py-4 text-body-sm font-semibold text-brand-ink shadow-brand transition-all duration-300 ease-out-expo hover:brightness-110 active:scale-[0.985] disabled:opacity-60"
            >
              <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out-expo group-hover:translate-x-full" />
              <span className="relative">{isSubmitting ? t('submitting') : t('submit')}</span>
              <Send className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </button>

            <p className="mt-4 text-center text-micro leading-relaxed text-faint">{t('privacy')}</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full rounded-xl border bg-base/70 px-4 py-3 text-body-sm',
    'placeholder:text-faint transition-colors duration-200',
    'focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/12',
    hasError ? 'border-brand/60' : 'border-line/12 hover:border-line/25',
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-2 block text-label font-medium text-muted">{label}</span>
      {children}
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 block text-body-sm text-brand"
          role="alert"
        >
          {error}
        </motion.span>
      )}
    </label>
  );
}
