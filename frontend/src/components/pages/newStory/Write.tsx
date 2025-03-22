import { Heading, Textarea, Link, HStack, Fieldset, Field } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Trans, useTranslation } from 'react-i18next';
import { FieldErrors, UseFormClearErrors, UseFormRegister } from 'react-hook-form';
import { useEffect } from 'react';
import { NewStoryFormFields } from './NewStory';

type Props = {
  register: UseFormRegister<NewStoryFormFields>;
  errors: FieldErrors<NewStoryFormFields>;
  isVisible: boolean;
  setValidateFields: (validateFields: ('content' | 'title' | 'description' | 'date' | 'banner')[]) => void;
  trigger: (field: ('content' | 'title' | 'description' | 'date' | 'banner')) => Promise<boolean>;
  clearErrors: UseFormClearErrors<NewStoryFormFields>;
};

export default function Write({ register, errors, isVisible, setValidateFields, trigger, clearErrors }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    if (isVisible) {
      setValidateFields(['content']);
    }
  }, [isVisible, setValidateFields]);

  async function clearContentError() {
    const correct = await trigger('content');
    if (correct) {
      clearErrors('content');
    }
  }

  return (
    <>
      <Heading size="2xl">{t('newStory.write.title')}</Heading>
      <HStack gap={1}>
        <Trans i18nKey="newStory.write.desc">
          Feel free to use
          <Link
            variant="underline"
            href="https://www.markdownguide.org/basic-syntax/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Markdown
          </Link>
          formatting to enhance your story
        </Trans>
      </HStack>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Fieldset.Root>
            <Fieldset.Content>
              <Field.Root invalid={!!errors.content}>
                <Textarea
                  placeholder={t('newStory.write.placeholder')}
                  mt="4"
                  height="calc(100vh - 400px)"
                  resize="none"
                  {...register('content', {
                    onChange: clearContentError,
                  })}
                />
                <Field.ErrorText>{errors.content?.message}</Field.ErrorText>
              </Field.Root>
            </Fieldset.Content>
          </Fieldset.Root>
        </motion.div>
      )}
    </>
  );
}
