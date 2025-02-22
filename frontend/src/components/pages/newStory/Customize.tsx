import { Button } from '@/components/ui/button';
import { FileUploadList, FileUploadRoot, FileUploadTrigger } from '@/components/ui/file-upload';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { Field, Heading, HStack, Input, Textarea } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HiUpload } from 'react-icons/hi';

type Props = {
  title: string;
  setTitle: (text: string) => void;
  description: string;
  setDescription: (text: string) => void;
  banner: string;
  setBanner: (text: string) => void;
  isVisible: boolean;
  setNext: (next: boolean) => void;
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
}: Props) {
  const [value, setValue] = useState('2');

  useEffect(() => {
    if (isVisible) {
      setNext(title.length > 0 && banner.length > 0);
    }
  }, [setNext, title, banner, isVisible]);

  return (
    <>
      <Heading size="2xl">Let's make this more unique</Heading>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Field.Root required mt="4">
              <Field.Label>
                Title
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
                Description
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
            <Field.Root mt="4">
              <Field.Label>Picture</Field.Label>
              <RadioGroup value={value} onValueChange={(e) => setValue(e.value)}>
                <HStack gap="6">
                  <Radio value="1" disabled>
                    Upload
                  </Radio>
                  <Radio value="2">Online Picture</Radio>
                </HStack>
              </RadioGroup>
              {value === '1' && (
                <FileUploadRoot accept={['image/*']} mt="4">
                  <FileUploadTrigger>
                    <Button size="sm">
                      <HiUpload /> Upload file
                    </Button>
                  </FileUploadTrigger>
                  <FileUploadList />
                </FileUploadRoot>
              )}
              {value === '2' && (
                <Field.Root required mt="4">
                  <Field.Label>
                    URL
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input value={banner} onChange={(e) => setBanner(e.target.value)} />
                  <Field.HelperText>Make sure the picture is free to use and not copyrighted</Field.HelperText>
                </Field.Root>
              )}
            </Field.Root>
          </motion.div>
        </>
      )}
    </>
  );
}
