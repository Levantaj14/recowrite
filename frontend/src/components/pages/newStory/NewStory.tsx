import { Group } from '@chakra-ui/react';
import {
  StepsCompletedContent,
  StepsContent,
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsRoot,
} from '../../ui/steps';
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

export default function NewStory() {
  const navigate = useNavigate();
  const { userDetails } = useContext(UserDetailContext);
  const [step, setStep] = useState(0);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState('');
  const [next, setNext] = useState(false);

  useEffect(() => {
    if (userDetails === null) {
      navigate('/');
    }
    document.title = 'New Story';
  }, [navigate, userDetails]);

  return (
    <>
      <StepsRoot step={step} onStepChange={(e) => setStep(e.step)} count={3}>
        <StepsList>
          <StepsItem index={0} title="Write" icon={<LuPencil />} />
          <StepsItem index={1} title="Preview" icon={<IoDocumentTextOutline />} />
          <StepsItem index={2} title="Customize" icon={<BsStars />} />
        </StepsList>

        <StepsContent index={0}>
          <Write content={content} setContent={setContent} setNext={setNext} isVisible={step === 0} />
        </StepsContent>
        <StepsContent index={1}>
          <Preview content={content} isVisible={step === 1} setNext={setNext} />
        </StepsContent>
        <StepsContent index={2}>
          <Customize
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            banner={banner}
            setBanner={setBanner}
            setNext={setNext}
            isVisible={step === 2}
          />
        </StepsContent>
        <StepsCompletedContent>
          <Posting title={title} content={content} description={description} banner={banner} isVisible={step === 3} />
        </StepsCompletedContent>

        {step < 3 && (
          <Group>
            <StepsPrevTrigger asChild>
              <Button variant="outline" size="sm">
                Prev
              </Button>
            </StepsPrevTrigger>
            <StepsNextTrigger asChild>
              <Button variant="outline" size="sm" disabled={!next}>
                {step === 2 ? 'Post' : 'Next'}
              </Button>
            </StepsNextTrigger>
          </Group>
        )}
      </StepsRoot>
    </>
  );
}
