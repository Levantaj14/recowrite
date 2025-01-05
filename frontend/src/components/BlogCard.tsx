import { Box, Card, Image, LinkBox, Text } from '@chakra-ui/react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

type Props = {
  imageUrl?: string;
  title: string;
  description: string;
  author: string;
  href: string;
  index: number;
}

function BlogCard({ imageUrl, title, description, author, href, index }: Props) {
  return (
    // TODO: Limit character limit for description based on device
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut', delay: index / 25 }}>
      <LinkBox
        as="article"
        _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}
      >
        <Link to={href}>
          <Card.Root flexDirection="row" overflow="hidden" maxW="100%" size="sm" mb={4}>
            <Image
              objectFit="cover"
              maxH="100%"
              maxW="110px"
              src={imageUrl}
            />
            <Box>
              <Card.Body>
                <Text fontSize="sm" mb="1">
                  {author}
                </Text>
                <Card.Title mb={1}>{title}</Card.Title>
                <Card.Description>{description}</Card.Description>
              </Card.Body>
            </Box>
          </Card.Root>
        </Link>
      </LinkBox>
    </motion.div>
  );
}

export default BlogCard;