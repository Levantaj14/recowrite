import {Box, Flex, Heading, IconButton, LinkBox, LinkOverlay, Spacer, Text} from "@chakra-ui/react";
import {Avatar} from "@/components/ui/avatar.tsx";
import {motion} from "motion/react";
import BlogCard from "@/BlogCard.tsx";
import {FaBluesky, FaInstagram, FaMastodon, FaMedium, FaWordpress, FaXTwitter} from "react-icons/fa6";
import {useParams} from "react-router";

function User() {
    const {username} = useParams();

    return (
        // TODO: Make it look good on phones
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
            <Flex direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                    <Flex gap={6} alignItems="center">
                        <Avatar
                            size="2xl"
                            name="Brent Denton"
                            src="https://images.unsplash.com/photo-1733371001616-0341f62c56c1?q=80&w=3269&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        />
                        <Box>
                            <Heading size="4xl">Brent Denton</Heading>
                            <Text color={"gray"}>@{username}</Text>
                        </Box>
                    </Flex>
                </Box>
                <Spacer/>
                <Box>
                    <Flex direction="row" >
                        <LinkBox>
                            <IconButton variant="ghost">
                                <LinkOverlay href="https://www.instagram.com" target="_blank"><FaInstagram/></LinkOverlay>
                            </IconButton>
                        </LinkBox>
                        <LinkBox>
                            <IconButton variant="ghost">
                                <LinkOverlay href="https://x.com" target="_blank"><FaXTwitter/></LinkOverlay>
                            </IconButton>
                        </LinkBox>
                        <LinkBox>
                            <IconButton variant="ghost">
                                <LinkOverlay href="https://bsky.app/" target="_blank"><FaBluesky/></LinkOverlay>
                            </IconButton>
                        </LinkBox>
                        <LinkBox>
                            <IconButton variant="ghost">
                                <LinkOverlay href="https://mastodon.social" target="_blank"><FaMastodon/></LinkOverlay>
                            </IconButton>
                        </LinkBox>
                        <LinkBox>
                            <IconButton variant="ghost">
                                <LinkOverlay href="https://medium.com" target="_blank"><FaMedium /></LinkOverlay>
                            </IconButton>
                        </LinkBox>
                        <LinkBox>
                            <IconButton variant="ghost">
                                <LinkOverlay href="https://wordpress.com" target="_blank"><FaWordpress /></LinkOverlay>
                            </IconButton>
                        </LinkBox>
                    </Flex>
                </Box>
            </Flex>
            <Heading mt={6} size="xl">About me</Heading>
            <Text>Greutățile vieții în viață m-au făcut să car mai mult decât a trebuit să duc.</Text>
            <Heading size="xl" mt={6} mb={2}>Articles</Heading>
            <BlogCard
                imageUrl="https://images.unsplash.com/photo-1616161560417-66d4db5892ec?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                title="Exploring the Latest Innovations in Artificial Intelligence"
                description="Artificial intelligence revolutionizes healthcare, sustainability, and more with advancements in natural language processing, precision medicine, and edge AI. Ethical considerations like bias, transparency, and data privacy are crucial as AI grows."
                author="Brent Denton"
                href="/story"
            />
        </motion.div>
    )
}

export default User;