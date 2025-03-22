import {
  Heading,
  Textarea,
  HStack,
  Fieldset,
  Field,
  IconButton, MenuTrigger, MenuContent, MenuItem, MenuRoot,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FieldErrors, UseFormClearErrors, UseFormRegister } from 'react-hook-form';
import { useEffect } from 'react';
import { NewStoryFormFields } from './NewStory';
import { MdFormatBold, MdFormatListBulleted, MdFormatListNumbered, MdOutlineInsertLink, MdTitle } from 'react-icons/md';
import { TfiLayoutLineSolid } from 'react-icons/tfi';
import { FaImage, FaQuoteRight } from 'react-icons/fa6';
import { IoCodeSlashSharp } from 'react-icons/io5';
import { Tooltip } from '@/components/ui/tooltip.tsx';

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

  const buttons = [
    { icon: <MdFormatBold />, tooltip: 'Bold' },
    { icon: <FaQuoteRight />, tooltip: 'Quote' },
    { icon: <MdFormatListBulleted />, tooltip: 'Unordered list' },
    { icon: <MdFormatListNumbered />, tooltip: 'Ordered list' },
    { icon: <TfiLayoutLineSolid />, tooltip: 'Horizontal line' },
    { icon: <MdOutlineInsertLink />, tooltip: 'Link' },
    { icon: <FaImage />, tooltip: 'Image' },
    { icon: <IoCodeSlashSharp />, tooltip: 'Code' },
  ];

  return (
    <>
      <Heading size="2xl">{t('newStory.write.title')}</Heading>
      <HStack gap={2} mt={4}>
        <MenuRoot positioning={{ placement: 'bottom-end' }}>
          <MenuTrigger asChild>
            <Tooltip
              content="Headings"
              openDelay={500}
              closeDelay={100}
            >
              <IconButton size="xs" variant="outline">
                <MdTitle />
              </IconButton>
            </Tooltip>
          </MenuTrigger>
          <MenuContent zIndex="popover" position="absolute" left="0" top="36">
            <MenuItem value="1">Heading 1</MenuItem>
            <MenuItem value="2">Heading 2</MenuItem>
            <MenuItem value="3">Heading 3</MenuItem>
            <MenuItem value="4">Heading 4</MenuItem>
          </MenuContent>
        </MenuRoot>
        {buttons.map((button) => (
          <Tooltip
            key={button.tooltip}
            content={button.tooltip}
            openDelay={500}
            closeDelay={100}
          >
            <IconButton size="xs" variant="outline">
              {button.icon}
            </IconButton>
          </Tooltip>
        ))}
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
