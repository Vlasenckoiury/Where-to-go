import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
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
            </Routes>
        </Router>
    );
}

export default App;
