import {Box, Card, Image, LinkBox, LinkOverlay} from "@chakra-ui/react";

type Props = {
    imageUrl?: string;
    title: string;
    description: string;
    author: string;
    href: string;
}

function BlogCard({imageUrl, title, description, author, href}: Props) {
    return (
        <LinkBox
            as="article"
            _hover={{boxShadow: "lg", transform: "scale(1.02)", transition: "0.2s"}}
        >
            <LinkOverlay href={href}>
                <Card.Root flexDirection="row" overflow="hidden" maxW="100%" size="sm" mb={4}>
                    <Image
                        objectFit="cover"
                        maxH="110px"
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
            </LinkOverlay>
        </LinkBox>
    )
}

export default BlogCard;