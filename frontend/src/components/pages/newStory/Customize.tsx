import { Button } from '@/components/ui/button';
import { FileUploadList, FileUploadRoot, FileUploadTrigger } from '@/components/ui/file-upload';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { Field, Heading, HStack, Input, Portal, Textarea } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiUpload } from 'react-icons/hi';
import { Popover } from '@chakra-ui/react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import './calendar-style.css';
import { useColorMode } from '@/components/ui/color-mode';
import { hu, ro, enUS } from "react-day-picker/locale";

type Props = {
  title: string;
  setTitle: (text: string) => void;
  description: string;
  setDescription: (text: string) => void;
  banner: string;
  setBanner: (text: string) => void;
  isVisible: boolean;
  setNext: (next: boolean) => void;
  postingTime: string;
  setPostingTime: (text: string) => void;
  selected: Date;
  setSelected: (date: Date) => void;
};

export default function Customize({
  title,
  setTitle,
  description,
  setDescription,
  banner,
  setBanner,
  isVisible,
  setNext,
  postingTime,
  setPostingTime,
  selected,
  setSelected,
}: Props) {
  const { t, i18n } = useTranslation();
  const [imageType, setImageType] = useState('2');
  const { colorMode } = useColorMode();

  const localizeCalendarFormat = () => ({ hu, ro })[i18n.language] || enUS;

  useEffect(() => {
    if (isVisible) {
      setNext(title.length > 0 && banner.length > 0);
    }
  }, [setNext, title, banner, isVisible]);

  return (
    <>
      <Heading size="2xl">{t('newStory.customize.title')}</Heading>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Field.Root required mt="4">
              <Field.Label>
                {t('newStory.customize.fields.title')}
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </Field.Root>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.04 }}
          >
            <Field.Root mt="4">
              <Field.Label>
                {t('newStory.customize.fields.desc')}
                <Field.RequiredIndicator />
              </Field.Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} autoresize />
            </Field.Root>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.08 }}
          >
            <Field.Root required mt="4">
              <Field.Label>
                {t('newStory.customize.fields.date.title')}
                <Field.RequiredIndicator />
              </Field.Label>
              <RadioGroup value={postingTime} onValueChange={(e) => setPostingTime(e.value)}>
                <HStack gap="6">
                  <Radio value="now">{t('newStory.customize.fields.date.options.now')}</Radio>
                  <Radio value="schedule">{t('newStory.customize.fields.date.options.schedule')}</Radio>
                  {postingTime === 'schedule' && (
                    <Popover.Root>
                      <Popover.Trigger asChild>
                        <Button size="sm" variant="outline">
                          {t('buttons.choose')}
                        </Button>
                      </Popover.Trigger>
                      <Portal>
                        <Popover.Positioner>
                          <Popover.Content>
                            <Popover.Arrow />
                            <Popover.Body>
                              <div className={colorMode === 'dark' ? 'dark-date-picker' : 'light-date-picker'}>
                                <DayPicker animate required ISOWeek mode="single" selected={selected} onSelect={setSelected} locale={localizeCalendarFormat()} />
                              </div>
                            </Popover.Body>
                          </Popover.Content>
                        </Popover.Positioner>
                      </Portal>
                    </Popover.Root>
                  )}
                </HStack>
              </RadioGroup>
            </Field.Root>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.12 }}
          >
            <Field.Root mt="4">
              <Field.Label>{t('newStory.customize.fields.picture.name')}</Field.Label>
              <RadioGroup value={imageType} onValueChange={(e) => setImageType(e.value)}>
                <HStack gap="6">
                  <Radio value="1" disabled>
                    {t('newStory.customize.fields.picture.radio.upload')}
                  </Radio>
                  <Radio value="2">{t('newStory.customize.fields.picture.radio.online')}</Radio>
                </HStack>
              </RadioGroup>
              {imageType === '1' && (
                <FileUploadRoot accept={['image/*']} mt="4">
                  <FileUploadTrigger>
                    <Button size="sm">
                      <HiUpload /> {t('newStory.customize.fields.picture.uploadButton')}
                    </Button>
                  </FileUploadTrigger>
                  <FileUploadList />
                </FileUploadRoot>
              )}
              {imageType === '2' && (
                <Field.Root required mt="4">
                  <Field.Label>
                    URL
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input value={banner} onChange={(e) => setBanner(e.target.value)} />
                  <Field.HelperText>{t('newStory.customize.fields.picture.urlHelper')}</Field.HelperText>
                </Field.Root>
              )}
            </Field.Root>
          </motion.div>
        </>
      )}
    </>
  );
}
