import { Box, Card, Image, LinkBox } from '@chakra-ui/react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

type Props = {
  imageUrl?: string;
  title: string;
  date: string;
  content: string;
  description: string;
  href: string;
  index: number;
};

function BlogCard({ imageUrl, title, description, content, date, href, index }: Props) {
  const { t } = useTranslation();
  const patternsToRemove = ['\\*\\*', '\\[', '\\]', '\\(.*?\\)', '#', '```'];

  function decideDescription() {
    if (new Date(date) > new Date()) {
      return t('story.like.unavailable');
    }
    if (description === '') {
      let auxContent = content;
      patternsToRemove.forEach(pattern => {
        auxContent = auxContent.replace(new RegExp(pattern, 'g'), '');
      });
      auxContent = auxContent.slice(0, 100);
      if (content.length > 100) {
        auxContent = auxContent + '...';
      }
      return auxContent;
    }
    return description;
  }

  return (
    // TODO: Limit character limit for description based on device
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut', delay: index / 25 }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeInOut' },
      }}
    >
      <LinkBox as="article">
        <Link to={href}>
          <Card.Root flexDirection="row" overflow="hidden" maxW="100%" size="sm" mb={4}>
            <Image objectFit="cover" h="100px" w="100px" src={imageUrl} />
            <Box>
              <Card.Body>
                <Card.Title mb={1}>{title}</Card.Title>
                <Card.Description>{decideDescription()}</Card.Description>
              </Card.Body>
            </Box>
          </Card.Root>
        </Link>
      </LinkBox>
    </motion.div>
  );
}

export default BlogCard;
