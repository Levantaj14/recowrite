import BlogCard from "@/BlogCard.tsx";
import {Container} from "@chakra-ui/react";

function App() {
    const number = [...Array(10).keys()]
    return (
        <>
            <Container as="main" mt="4" mb="4" maxW="6xl">
                {number.map(() => (
                    <BlogCard
                        imageUrl="https://images.unsplash.com/photo-1616161560417-66d4db5892ec?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        title="Exploring the Latest Innovations in Artificial Intelligence"
                        description="A flexible UI component library for React."
                        author="Brent Denton"
                        href="/story"
                    />
                ))}
            </Container>
        </>
    )
}

export default App
