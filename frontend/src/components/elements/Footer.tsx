import { Center, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Center py={8}>
        <Text fontSize="xs" >&copy; {new Date().getFullYear()} recowrite &middot; All rights reserved</Text>
    </Center>
  );
}
