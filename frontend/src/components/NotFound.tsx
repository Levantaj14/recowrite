import { EmptyState } from '@/components/ui/empty-state.tsx';
import { TbError404 } from 'react-icons/tb';
import { Code } from '@chakra-ui/react';
import { useEffect } from 'react';

function NotFound() {
  useEffect(() => {
    document.title = 'Not Found';
  }, []);

  return (
    <EmptyState
      icon={<TbError404 />}
      title="Maybe your lost"
      description="The page that your trying to access does not exist"
      size="lg"
    >
      <Code>404 Not Found</Code>
    </EmptyState>
  );
}

export default NotFound;