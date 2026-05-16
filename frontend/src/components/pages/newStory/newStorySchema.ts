import { z } from 'zod';
import { TFunction } from 'i18next';

function createBaseSchema(t: TFunction) {
  return z.object({
    content: z.string().nonempty(t('common.errors.required.field')),
    title: z.string().nonempty(t('common.errors.required.field')).max(255, t('common.errors.validation.maxChars')),
    description: z.string().max(255, t('common.errors.validation.maxChars')),
    date: z.string().nonempty().refine(
      (val) => !Number.isNaN(Date.parse(val)) && val === new Date(val).toISOString(),
      {
        message: t('common.errors.validation.invalidDate'),
      },
    ),
    banner: z.string().nonempty(t('common.errors.required.field')),
    bannerType: z.enum(['IMAGE_URL', 'IMAGE_UPLOAD']),
    bannerName: z.string().optional(),
    ai: z.boolean(),
  });
}

export type NewStoryFormFields = z.infer<ReturnType<typeof createBaseSchema>>;

export default function NewStorySchema(t: TFunction) {
  return createBaseSchema(t).refine(
    (data) => {
      if (data.bannerType === 'IMAGE_URL') {
        try {
          new URL(data.banner);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    {
      message: t('common.errors.validation.invalidUrl'),
      path: ['banner'],
    },
  );
}