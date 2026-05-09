import { Heading, Fieldset, Field } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FieldErrors, UseFormClearErrors, UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { useEffect } from 'react';
import { OptionRow } from '@/components/pages/newStory/OptionRow.tsx';
import { NewStoryFormFields } from '@/components/pages/newStory/newStorySchema.ts';
import Tiptap from './Tiptap';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import { useEditor } from '@tiptap/react';

type Props = {
  register: UseFormRegister<NewStoryFormFields>;
  errors: FieldErrors<NewStoryFormFields>;
  isVisible: boolean;
  setValidateFields: (validateFields: ('content' | 'title' | 'description' | 'date' | 'banner')[]) => void;
  trigger: (field: 'content' | 'title' | 'description' | 'date' | 'banner') => Promise<boolean>;
  clearErrors: UseFormClearErrors<NewStoryFormFields>;
  setValue: UseFormSetValue<NewStoryFormFields>;
  getValue: UseFormGetValues<NewStoryFormFields>;
};

export default function Write({ setValue, errors, isVisible, setValidateFields }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    if (isVisible) {
      setValidateFields(['content']);
    }
  }, [isVisible, setValidateFields]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4, 5],
        },
      }),
      Placeholder.configure({
        placeholder: t('content.newStory.write.placeholder'),
      }),
      Typography,
      Highlight,
    ],
    onUpdate: ({ editor }) => {
      setValue('content', JSON.stringify(editor.getJSON()));
    }
  });

  return (
    <>
      <Heading size="2xl">{t('content.newStory.write.title')}</Heading>
      <OptionRow editor={editor} />
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Fieldset.Root>
            <Fieldset.Content>
              <Field.Root invalid={!!errors.content}>
                <Tiptap editor={editor} />
                <Field.ErrorText>{errors.content?.message}</Field.ErrorText>
              </Field.Root>
            </Fieldset.Content>
          </Fieldset.Root>
        </motion.div>
      )}
    </>
  );
}
