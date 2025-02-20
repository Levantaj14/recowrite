import { Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export default function Comments() {
  const { t } = useTranslation();
  return (
    <>
      <Heading size="2xl">{t('dashboard.tabs.comments')}</Heading>
    </>
  );
}
