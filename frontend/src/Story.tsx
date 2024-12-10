import {Flex, Heading, Image, Link as ChakraLink, Stack, Text, Box, Separator, Card, LinkBox} from "@chakra-ui/react";
import {motion} from "framer-motion";
import {HoverCardArrow, HoverCardContent, HoverCardRoot, HoverCardTrigger} from "./components/ui/hover-card";
import {Avatar} from "@/components/ui/avatar.tsx";
import {Link} from "react-router";

function Story() {
    return (
        <motion.div initial={{opacity: 0, y: +75}} animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.4, ease: "easeInOut"}}>
            <Heading size="4xl" mb="3">Exploring the Latest Innovations in Artificial Intelligence</Heading>
            <Flex flexDirection="row" justifyContent="flex-start" mb={5} alignItems="center">
                <Text textStyle="md" mr={1}>Written by</Text>
                <HoverCardRoot>
                    <HoverCardTrigger>
                        <Link to={"/user/brent_denton"}>
                            <ChakraLink>@brent_denton</ChakraLink>
                        </Link>
                    </HoverCardTrigger>
                    <HoverCardContent>
                        <HoverCardArrow/>
                        <Stack gap="4" direction="row">
                            <Avatar
                                name="Brent Denton"
                                src="https://images.unsplash.com/photo-1733371001616-0341f62c56c1?q=80&w=3269&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            />
                            <Stack gap={3}>
                                <Stack gap="1">
                                    <Text textStyle="sm" fontWeight="semibold">
                                        Brent Denton
                                    </Text>
                                    <Text textStyle="sm" color="fg.muted">
                                        Greutățile vieții în viață m-au făcut să car mai mult decât a trebuit să duc.
                                    </Text>
                                </Stack>
                            </Stack>
                        </Stack>
                    </HoverCardContent>
                </HoverCardRoot>
            </Flex>
            <Image
                rounded="lg"
                maxH="300px"
                w="100%"
                src="https://images.unsplash.com/photo-1616161560417-66d4db5892ec?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                objectFit="cover"
            />
            {/*Demo text*/}
            <Box mb={10}>
                <Text mt={15}>Artificial intelligence is transforming every corner of our digital landscape, and
                    recent
                    advancements are pushing the boundaries of what's possible. From enhanced natural language
                    processing models to cutting-edge applications in healthcare and sustainable technology, the AI
                    space is rapidly evolving. Here’s a look at some of the latest developments that are shaping the
                    future.</Text>
                <Heading size="2xl" mt={5} mb={5}>1. Next-Generation Language Models</Heading>
                <Text>Recent years have seen tremendous leaps in natural language processing, especially with the
                    advent
                    of large language models like GPT-4 and beyond. These models can engage in detailed
                    conversations,
                    summarize complex texts, and assist in tasks ranging from customer support to creative writing.
                    The
                    latest models are increasingly multilingual, context-aware, and capable of responding with
                    higher
                    precision, which is making AI assistants and chatbots more reliable and versatile than ever
                    before.</Text>
                <Heading size="2xl" mt={5} mb={5}>2. AI in Healthcare: Precision Medicine and Diagnostics</Heading>
                <Text>AI is now a core part of innovation in healthcare, where it aids in diagnosing diseases with
                    unprecedented accuracy. For instance, deep learning models trained on medical imaging data are
                    capable of detecting early signs of conditions like cancer, cardiovascular disease, and even
                    neurological disorders. Additionally, AI models are being utilized to analyze genetic data,
                    empowering the field of precision medicine to provide highly personalized treatment plans
                    tailored
                    to individual patients' genetic profiles and medical history.</Text>
                <Heading size="2xl" mt={5} mb={5}>3. AI and Sustainability</Heading>
                <Text>In the face of climate change, AI-driven solutions are being developed to create a more
                    sustainable future. From optimizing energy usage in smart cities to predicting and mitigating
                    natural disasters, AI is playing a pivotal role. For example, AI-powered algorithms help
                    industries
                    like agriculture reduce water usage and improve crop yield, while conservation efforts are using
                    machine learning to monitor endangered species populations and predict ecological
                    changes.</Text>
                <Heading size="2xl" mt={5} mb={5}>4. Automated Content Generation and Augmented Creativity</Heading>
                <Text>AI’s role in content creation has expanded dramatically, thanks to advances in models that
                    generate images, videos, and even music. Creative industries are using AI to enhance human
                    creativity, whether through digital art, film production, or interactive media. DALL-E, for
                    example,
                    can create detailed images based on textual descriptions, opening new avenues for artists,
                    advertisers, and designers to bring unique visions to life. This augmented creativity allows
                    users
                    to explore fresh ideas and push creative boundaries in a matter of minutes.</Text>
                <Heading size="2xl" mt={5} mb={5}>5. Trustworthy AI and Ethical Considerations</Heading>
                <Text>As AI becomes more powerful, ethical considerations around bias, transparency, and data
                    privacy
                    are increasingly critical. Researchers and organizations are focused on developing “trustworthy
                    AI”
                    that prioritizes fairness and minimizes potential harm. This involves rigorous testing to
                    eliminate
                    algorithmic biases, enhancing transparency by making model decisions interpretable, and
                    protecting
                    user privacy. Regulatory frameworks are also emerging globally to ensure AI development aligns
                    with
                    societal values.</Text>
                <Heading size="2xl" mt={5} mb={5}>6. The Rise of Edge AI</Heading>
                <Text>Edge AI is an emerging trend that aims to run AI algorithms directly on devices rather than
                    relying on centralized cloud servers. This approach has major benefits, such as reduced latency,
                    improved data privacy, and lower energy consumption. Edge AI is transforming industries such as
                    autonomous vehicles, IoT (Internet of Things) devices, and smart home applications. By
                    processing
                    data locally on devices, edge AI enables faster, real-time responses, which is crucial for
                    applications that demand quick decision-making.</Text>
                <Heading size="2xl" mt={5} mb={5}>Conclusion</Heading>
                <Text>The world of AI is expanding in remarkable ways, influencing everything from personal
                    assistants
                    to global efforts in healthcare, sustainability, and beyond. These advancements raise exciting
                    possibilities for the future, but they also call for careful consideration of ethical challenges
                    to
                    ensure AI remains a positive force. As AI continues to evolve, it will undoubtedly reshape
                    industries, redefine possibilities, and play an essential role in addressing some of the world’s
                    most pressing challenges.</Text>
                {/*End of demo text*/}
            </Box>
            <Separator/>
            <Heading size="3xl" mt="5" mb="5">
                Continue reading
            </Heading>
            <motion.div initial={{opacity: 0, x: 200}}
                        whileInView={{opacity: 1, x: 0}} transition={{duration: 0.8, ease: "easeInOut"}}
                        viewport={{once: true}}>
                <Flex gap={5} mb={10}>
                    <LinkBox
                        as="article"
                        _hover={{boxShadow: "lg", transform: "scale(1.02)", transition: "0.2s"}}
                    >
                        <Link to="/story/2">
                            <Card.Root maxW="sm" overflow="hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1642783770696-5ce1b9e24263?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                />
                                <Card.Body gap="2">
                                    <Text>Regina Grimes</Text>
                                    <Card.Title>Embracing Digital Detox: Rediscovering Balance in a Hyperconnected
                                        World</Card.Title>
                                    <Card.Description>
                                        Technology dominates our lives, leading to stress and burnout. Digital detoxes,
                                        periods of intentional disconnection, can improve focus, mental health, and
                                        well-being.
                                    </Card.Description>
                                </Card.Body>
                            </Card.Root>
                        </Link>
                    </LinkBox>
                    <LinkBox
                        as="article"
                        _hover={{boxShadow: "lg", transform: "scale(1.02)", transition: "0.2s"}}
                    >
                        <Link to="/story/3">
                            <Card.Root maxW="sm" overflow="hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1664575198308-3959904fa430?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                />
                                <Card.Body gap="2">
                                    <Text>Bernadette Underwood</Text>
                                    <Card.Title>The Rise of Remote Work: Transforming Our Approach to Work and
                                        Life</Card.Title>
                                    <Card.Description>
                                        Remote work, initially a temporary solution, has become a long-term arrangement
                                        reshaping modern work culture. This shift influences both professional and
                                        personal lives.
                                    </Card.Description>
                                </Card.Body>
                            </Card.Root>
                        </Link>
                    </LinkBox>
                </Flex>
            </motion.div>
        </motion.div>
    )
}

export default Story;