import './App.css'
import BusinessApp from "./app/main/BusinessApp.jsx";
import {Route, BrowserRouter, Routes} from "react-router-dom";
import React from "react";
import BusinessDetail from "./app/main/main_detail/BusinessDetail.jsx";
import {YelpProvider} from "./app/hooks/useNodeAPI.jsx";

function App() {
    return (
        <YelpProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<BusinessApp/>}/>
                    <Route path="/business/:id" element={<BusinessDetail/>}/>
                </Routes>
            </BrowserRouter>
        </YelpProvider>
    )
}

export default App
