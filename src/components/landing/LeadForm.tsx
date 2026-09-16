'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, Send, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const buildSchema = (m: (key: string) => string) =>
  z.object({
    name: z.string().min(1, m('nameRequired')).min(2, m('nameShort')),
    phone: z
      .string()
      .min(1, m('phoneRequired'))
      // +993, +90 we ş.m.
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
        // menejer haýsy dilde jogap bermelidigini görsün
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
            className="flex min-h-[26rem] flex-col items-center justify-center rounded-3xl border border-ok/25 bg-ok/[0.06] p-10 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 240, damping: 14 }}
              className="grid h-16 w-16 place-items-center rounded-full bg-ok text-white"
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
            className="card rounded-3xl p-6 md:p-7"
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

              <details className="group sm:col-span-2">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-body-sm font-bold text-brand [&::-webkit-details-marker]:hidden">
                  <Plus className="h-4 w-4 transition-transform duration-300 group-open:rotate-45" aria-hidden />
                  {t('moreToggle')}
                </summary>
                <div className="mt-5 grid gap-5">
                <Field label={t('fields.program.label')}>
                  <select {...register('program')} defaultValue="" className={inputClass(false)}>
                    <option value="" disabled>{t('fields.program.placeholder')}</option>
                    {programOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </Field>

                <Field label={t('fields.channel.label')}>
                  <select {...register('channel')} defaultValue="" className={inputClass(false)}>
                    <option value="" disabled>{t('fields.channel.placeholder')}</option>
                    {channelOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </Field>

                <Field label={t('fields.message.label')}>
                  <textarea {...register('message')} rows={3} placeholder={t('fields.message.placeholder')} className={cn(inputClass(false), 'resize-none')} />
                </Field>
                </div>
              </details>
            </div>

            {status === 'error' && (
              <p className="mt-5 flex items-start gap-2 rounded-xl border border-danger/25 bg-danger/[0.07] p-3.5 text-body-sm text-danger">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span><strong>{t('errorTitle')}.</strong> {t('errorText')}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-7 flex w-full items-center justify-center gap-2.5 rounded-full bg-brand px-7 py-4 text-body font-bold text-brand-ink shadow-brand transition-[background-color,box-shadow] duration-300 ease-out-expo hover:bg-brand-deep hover:shadow-brand-lg active:scale-[0.985] disabled:opacity-60"
            >
              <span>{isSubmitting ? t('submitting') : t('submit')}</span>
              <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
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
    'w-full rounded-xl border bg-surface px-4 py-3.5 text-body-sm',
    'placeholder:text-faint transition-colors duration-200',
    'focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/12',
    hasError ? 'border-danger/60' : 'border-line/10 hover:border-line/25',
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
      <span className="mb-2 block text-label font-bold text-muted">{label}</span>
      {children}
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 block text-body-sm font-semibold text-danger"
          role="alert"
        >
          {error}
        </motion.span>
      )}
    </label>
  );
}
