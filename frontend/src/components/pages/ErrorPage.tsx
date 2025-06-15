import { EmptyState } from '@/components/ui/empty-state.tsx';
import { TbError404, TbMoodSad, TbBarrierBlock } from 'react-icons/tb';
import { Code } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  code: number;
}

function ErrorPage({code}: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(<TbMoodSad />);
  const [codeText, setCodeText] = useState('');

  useEffect(() => {
    // Set the title, description, and icon based on the error code
    if (code === 400) {
      setTitle(t('navigation.badRequest.title'));
      setDescription(t('navigation.badRequest.desc'));
      setCodeText("400 Bad Request");
      document.title = t('navigation.badRequest.tabTitle');
    } else if (code === 401) {
      setTitle(t('navigation.unauthorized.title'));
      setDescription(t('navigation.unauthorized.desc'))
      setIcon(<TbBarrierBlock />);
      setCodeText("401 Unauthorized");
      document.title = t('navigation.unauthorized.tabTitle');
    } else {
      setTitle(t('navigation.notFound.title'));
      setDescription(t('navigation.notFound.desc'))
      setIcon(<TbError404 />);
      setCodeText("404 Not Found");
      document.title = t('navigation.notFound.tabTitle');
    }
  }, [code, t]);

  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      size="lg"
    >
      <Code>{codeText}</Code>
    </EmptyState>
  );
}

export default ErrorPage;
