import { EmptyState } from '@/components/ui/empty-state.tsx';
import { TbError404, TbMoodSad, TbBarrierBlock } from 'react-icons/tb';
import { Code } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  code: number;
}

function ErrorPage({ code }: Props) {
  const { t } = useTranslation();

  function getErrorConfig(code: number) {
    // Decide the error configuration based on the code
    switch (code) {
      case 400:
        return {
          title: t('navigation.badRequest.title'),
          description: t('navigation.badRequest.desc'),
          icon: <TbMoodSad />,
          codeText: '400 Bad Request',
        };
      case 401:
        return {
          title: t('navigation.unauthorized.title'),
          description: t('navigation.unauthorized.desc'),
          icon: <TbBarrierBlock />,
          codeText: '401 Unauthorized',
        };
      default:
        return {
          title: t('navigation.notFound.title'),
          description: t('navigation.notFound.desc'),
          icon: <TbError404 />,
          codeText: '404 Not Found',
        };
    }
  }

  const config = getErrorConfig(code);

  useEffect(() => {
    document.title = config.title;
  }, [config]);

  return (
    <EmptyState
      icon={config.icon}
      title={config.title}
      description={config.description}
      size="lg"
    >
      <Code>{config.codeText}</Code>
    </EmptyState>
  );
}

export default ErrorPage;
