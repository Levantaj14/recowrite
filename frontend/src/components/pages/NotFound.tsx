import { EmptyState } from '@/components/ui/empty-state.tsx';
import { TbError404 } from 'react-icons/tb';
import { Code } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function NotFound() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('navigation.notFound.tabTile');
  }, [t]);

  return (
    <EmptyState
      icon={<TbError404 />}
      title={t('navigation.notFound.title')}
      description={t('navigation.notFound.desc')}
      size="lg"
    >
      <Code>404 Not Found</Code>
    </EmptyState>
  );
}

export default NotFound;
