import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {Provider} from "./components/ui/provider";
import {BrowserRouter, Route, Routes} from "react-router";
import StickyNavbar from "@/Navbar.tsx";
import Story from "@/Story.tsx";
import {Container} from "@chakra-ui/react";
import User from "@/User.tsx";
import NotFound from "@/NotFound.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider>
            <BrowserRouter>
                <StickyNavbar/>
                <Container as="main" mt="4" mb="4" maxW="6xl">
                    <Routes>
                        <Route path="/" element={<App/>}/>
                        <Route path="/story" element={<Story/>}/>
                        <Route path="/user/:username" element={<User/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </Container>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
)
