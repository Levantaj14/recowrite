import BlogCard from "@/BlogCard.tsx";
import {Container} from "@chakra-ui/react";
import StickyNavbar from "@/Navbar.tsx";

function App() {
    const number = [...Array(10).keys()]
    return (
        <>
            <StickyNavbar/>
            <Container as="main" mt="4" mb="4" maxW="6xl">
                {number.map(() => (
                    <BlogCard
                        imageUrl="https://placehold.co/200"
                        title="Chakra UI Component"
                        description="A flexible UI component library for React."
                        author="John Doe"
                        href="#"
                    />
                ))}
            </Container>
        </>
    )
}

export default App
