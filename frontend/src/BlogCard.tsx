import {Box, Card, Image, LinkBox} from "@chakra-ui/react";
import {Link} from "react-router";
import {motion} from "framer-motion";

type Props = {
    imageUrl?: string;
    title: string;
    description: string;
    author: string;
    href: string;
}

function BlogCard({imageUrl, title, description, author, href}: Props) {
    return (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
            <LinkBox
                as="article"
                _hover={{boxShadow: "lg", transform: "scale(1.02)", transition: "0.2s"}}
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
                                <Card.Title mb="2">{title}</Card.Title>
                                <Card.Description>{description}</Card.Description>
                                <Card.Description>{author}</Card.Description>
                            </Card.Body>
                        </Box>
                    </Card.Root>
                </Link>
            </LinkBox>
        </motion.div>
    )
}

export default BlogCard;