import React from "react";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from './components/Footer'
import Error404 from "./pages/404";
import Chatbot from "./components/Chatbot";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Transactions from "./pages/Transactions";
import GoalsPage from "./pages/GoalsPage";
import Reports from "./pages/Reports";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" />;
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/chatbot" element={
          <div>
            <Header/>
            <div className="pt-20">
              <Chatbot isFloating={false}/>
            </div>
          </div>
        } />

        <Route path="*" element={<Error404/>} />

        <Route path="/transactions" element={<div>
          <Header/>
          <div className="pt-20">
            <Transactions/>
          </div>
          <Footer/>
        </div>} />

          <Route path="goals" element={<div>
            <Header/>
            <div className="pt-20">
              <GoalsPage/>
            </div>
            <Footer/>
          </div>} />

          <Route path="reports" element={<div>
            <Header/>
            <div className="pt-20">
              <Reports/>
            </div>
            <Footer/>
          </div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
