import BlogCard from "@/BlogCard.tsx";

function App() {
    const number = [...Array(1).keys()]
    return (
        <>
            {number.map(() => (
                <BlogCard
                    imageUrl="https://images.unsplash.com/photo-1616161560417-66d4db5892ec?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    title="Exploring the Latest Innovations in Artificial Intelligence"
                    description="Artificial intelligence revolutionizes healthcare, sustainability, and more with advancements in natural language processing, precision medicine, and edge AI. Ethical considerations like bias, transparency, and data privacy are crucial as AI grows."
                    author="Brent Denton"
                    href="/story"
                />
            ))}
        </>
    )
}

export default App
