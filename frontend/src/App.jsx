import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/password_reset';
import ResetPassword from './components/password_reset_confirm';
import Home from './Home/Home';
import SubCategoryAdd from './addsubcategory/addsubcategory';
import Info from './Home/Info';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/addsubcategory" element={<SubCategoryAdd/>} />
                <Route path="/info" element={<Info/>} />
                <Route path="/password_reset" element={<ForgotPassword/>} />
                <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
            </Routes>
        </Router>
    );
}

export default App;
