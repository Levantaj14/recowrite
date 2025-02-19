import { Flex, Spinner } from '@chakra-ui/react';

export default function CustomLoading(message: string) {
  return (
    <Flex align="center" gap="2">
      <Spinner size="sm" />
      {message}
    </Flex>
  )
}