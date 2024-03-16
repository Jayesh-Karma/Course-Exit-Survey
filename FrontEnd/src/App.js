import {BrowserRouter, Route, Routes} from "react-router-dom";
import SubmitFeedback from "./Pages/SubmitFeedback";
import AllFeedback from "./Pages/AllFeedback";
import Login from "./Pages/Login";


function App() {


    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route exact index element = {<SubmitFeedback/>}  />
                    <Route exact path='/' element = {<SubmitFeedback/>}  />
                    <Route exact path={`/all-feedback/Qj0tlV5FbnTuQObT5I6vVs4szJEpshx1`} element = {<AllFeedback/>} />
                    <Route exact path='/login' element = {<Login/>} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
