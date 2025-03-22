import { Group } from '@chakra-ui/react';
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsRoot } from '../../ui/steps';
import { Button } from '../../ui/button';
import { LuPencil } from 'react-icons/lu';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { BsStars } from 'react-icons/bs';
import { useContext, useEffect, useState } from 'react';
import Write from './Write';
import Preview from './Preview';
import Customize from './Customize';
import Posting from './Posting';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBlog } from '@/apis/blogApi.ts';
import { toast } from 'sonner';

const schema = z.object({
  content: z.string().nonempty('This field can\'t be empty'),
  title: z.string().nonempty('This field can\'t be empty').max(255, 'The maximum number of characters is 255'),
  description: z.string().max(255, 'The maximum number of characters is 255'),
  date: z.string().nonempty().refine(
    (val) => !isNaN(Date.parse(val)) && val === new Date(val).toISOString(),
    {
      message: "Invalid ISO date format",
    }
  ),
  banner: z.string().nonempty('This field can\'t be empty').url('This must be a valid URL'),
});

export type NewStoryFormFields = z.infer<typeof schema>;

export default function NewStory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userDetails } = useContext(UserDetailContext);
  const [step, setStep] = useState(0);
  const [validateFields, setValidateFields] = useState<('content' | 'title' | 'description' | 'date' | 'banner')[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    setValue,
  } = useForm<NewStoryFormFields>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (userDetails === null) {
      navigate('/');
    }
    document.title = t('newStory.title');
  }, [navigate, t, userDetails]);

  async function onSubmit(data: NewStoryFormFields) {
    setStep(step + 1);
    const id = await createBlog(data);
    toast.success(t('newStory.posting.success'));
    navigate(`/blog/${id}`);
  }

  async function checkPageCorrectness() {
    const isValid = await trigger(validateFields);
    if (isValid) {
      setStep(step + 1);
    }
  }

  return (
    <>
      <StepsRoot step={step} onStepChange={(e) => setStep(e.step)} count={3}>
        <StepsList>
          <StepsItem index={0} title={t('newStory.tabs.write')} icon={<LuPencil />} />
          <StepsItem index={1} title={t('newStory.tabs.preview')} icon={<IoDocumentTextOutline />} />
          <StepsItem index={2} title={t('newStory.tabs.customize')} icon={<BsStars />} />
        </StepsList>

        <StepsContent index={0}>
          <Write isVisible={step === 0} register={register} errors={errors} setValidateFields={setValidateFields} />
        </StepsContent>
        <StepsContent index={1}>
          <Preview content={getValues('content')} isVisible={step === 1} />
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
          <Posting isVisible={step === 3} />
        </StepsCompletedContent>

        {step < 3 && (
          <Group>
            <Button variant="outline" size="sm" onClick={() => setStep(step - 1)} disabled={step === 0}>
              {t('newStory.buttons.prev')}
            </Button>
            {step === 2 ? (
              <Button type="submit" variant="outline" size="sm" onClick={handleSubmit(onSubmit)}>
                {t('newStory.buttons.post')}
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={checkPageCorrectness}>
                {t('newStory.buttons.next')}
              </Button>
            )}
          </Group>
        )}
      </StepsRoot>
    </>
  );
}
