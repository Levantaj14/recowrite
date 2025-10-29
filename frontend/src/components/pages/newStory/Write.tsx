import { Heading, Textarea, Fieldset, Field } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FieldErrors, UseFormClearErrors, UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { useEffect } from 'react';
import { OptionRow } from '@/components/pages/newStory/OptionRow.tsx';
import { NewStoryFormFields } from '@/components/pages/newStory/newStorySchema.ts';

type Props = {
  register: UseFormRegister<NewStoryFormFields>;
  errors: FieldErrors<NewStoryFormFields>;
  isVisible: boolean;
  setValidateFields: (validateFields: ('content' | 'title' | 'description' | 'date' | 'banner')[]) => void;
  trigger: (field: ('content' | 'title' | 'description' | 'date' | 'banner')) => Promise<boolean>;
  clearErrors: UseFormClearErrors<NewStoryFormFields>;
  setValue: UseFormSetValue<NewStoryFormFields>;
  getValue: UseFormGetValues<NewStoryFormFields>;
};

export default function Write({
                                register,
                                errors,
                                isVisible,
                                setValidateFields,
                                trigger,
                                clearErrors,
                                setValue,
                                getValue,
                              }: Props) {
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
      <Heading size="2xl">{t('content.newStory.write.title')}</Heading>
      <OptionRow setValue={setValue} getValues={getValue} />
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
                  id="content"
                  placeholder={t('content.newStory.write.placeholder')}
                  mt="2"
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
