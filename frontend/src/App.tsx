import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Inbox from "./pages/Inbox";

import Navbar from "./components/Navbar";

function App() {
    return (
        <>
            <BrowserRouter basename="/Kliboard/">
                <Navbar />
                <div className="pages">
                    <Routes>
                        <Route
                            path="/"
                            element={<Home />}
                        >
                        </Route>

                        <Route
                            path="/inbox"
                            element={<Inbox />}
                        >
                        </Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    );
}

export default App;
