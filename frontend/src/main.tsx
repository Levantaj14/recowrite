import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {Provider} from "./components/ui/provider";
import {BrowserRouter, Route, Routes} from "react-router";
import StickyNavbar from "@/Navbar.tsx";
import Story from "@/Story.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider>
            <BrowserRouter>
                <StickyNavbar/>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/story" element={<Story/>}/>
                </Routes>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
)
