import { Badge, Flex, Group } from '@chakra-ui/react';
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsRoot } from '../../ui/steps';
import { Button } from '../../ui/button';
import { LuPencil } from 'react-icons/lu';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { BsStars } from 'react-icons/bs';
import { useContext, useEffect, useRef, useState } from 'react';
import Write from './Write';
import Preview from './Preview';
import Customize from './Customize';
import Posting from './Posting';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBlog } from '@/apis/blogApi.ts';
import { toast } from 'sonner';
import ErrorPage from '@/components/pages/ErrorPage.tsx';
import { useQuery } from '@tanstack/react-query';
import { getStrikeCount } from '@/apis/strikeApi.ts';
import NewStorySchema, { NewStoryFormFields } from '@/components/pages/newStory/newStorySchema.ts';
import { Editor } from '@tiptap/react';
import { EmptyState } from '@/components/ui/empty-state';
import { FiAlertCircle } from 'react-icons/fi';

export default function NewStory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userDetails } = useContext(UserDetailContext);
  const [step, setStep] = useState(0);
  const [manualValidation, setManualValidation] = useState(false);
  const [validateFields, setValidateFields] = useState<
    ('content' | 'title' | 'description' | 'date' | 'banner' | 'bannerType' | 'bannerName' | 'ai')[]
  >([]);

  const { data, isLoading } = useQuery({
    queryKey: ['strike'],
    queryFn: getStrikeCount,
  });

  // Using a single schema and form for the 3 steps, only validating fields relevant to the current step
  const schema = NewStorySchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    clearErrors,
    setError,
  } = useForm<NewStoryFormFields>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (userDetails !== null) {
      document.title = t('content.newStory.title');
    }
  }, [navigate, t, userDetails]);

  const editorRef = useRef<Editor | null>(null);

  async function onSubmit(data: NewStoryFormFields) {
    setStep(step + 1);
    const id = await createBlog(data);
    if (id === null) {
      setManualValidation(true);
      return;
    }
    toast.success(t('content.newStory.posting.success'));
    navigate(`/blog/${id}`);
  }

  async function checkPageCorrectness() {
    if (editorRef.current?.isEmpty) {
      setError('content', { message: t('common.errors.required.field') });
      return;
    }

    const isValid = await trigger(validateFields);
    if (isValid) {
      setStep(step + 1);
    }
  }

  return userDetails === null ? (
    <ErrorPage code={401} />
  ) : (
    <StepsRoot step={step} onStepChange={(e) => setStep(e.step)} count={3}>
      <StepsList>
        <StepsItem index={0} title={t('content.newStory.tabs.write')} icon={<LuPencil />} />
        <StepsItem index={1} title={t('content.newStory.tabs.preview')} icon={<IoDocumentTextOutline />} />
        <StepsItem index={2} title={t('content.newStory.tabs.customize')} icon={<BsStars />} />
      </StepsList>

      <StepsContent index={0}>
        <Write
          editorRef={editorRef}
          isVisible={step === 0}
          errors={errors}
          setValidateFields={setValidateFields}
          setValue={setValue}
          clearErrors={clearErrors}
          setError={setError}
        />
      </StepsContent>
      <StepsContent index={1}>
        <Preview content={getValues('content')} setValidateFields={setValidateFields} isVisible={step === 1} />
      </StepsContent>
      <StepsContent index={2}>
        <Customize
          isVisible={step === 2}
          register={register}
          errors={errors}
          setValidateFields={setValidateFields}
          setValue={setValue}
        />
      </StepsContent>
      <StepsCompletedContent>
        {manualValidation ? (
          <EmptyState
            icon={<FiAlertCircle />}
            title={t('content.newStory.manualValidation.title')}
            description={t('content.newStory.manualValidation.desc')}
            size="lg"
          >
            <Button onClick={() => navigate('/')} variant="outline">
              {t('content.newStory.manualValidation.button')}
            </Button>
          </EmptyState>
        ) : (
          <Posting isVisible={step === 3} />
        )}
      </StepsCompletedContent>

      {step < 3 && (
        <Flex align="center" justify="space-between" mb={10}>
          <Group>
            <Button variant="outline" size="sm" onClick={() => setStep(step - 1)} disabled={step === 0}>
              {t('content.newStory.buttons.prev')}
            </Button>
            {step === 2 ? (
              <Button type="submit" variant="outline" size="sm" onClick={handleSubmit(onSubmit)}>
                {t('content.newStory.buttons.post')}
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={checkPageCorrectness}>
                {t('content.newStory.buttons.next')}
              </Button>
            )}
          </Group>
          {!isLoading && data && data.count > 0 && (
            <Badge colorPalette="red" size="md">
              {data.count} {t('content.newStory.strike')}
            </Badge>
          )}
        </Flex>
      )}
    </StepsRoot>
  );
}
