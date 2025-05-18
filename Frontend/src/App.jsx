import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'
import CodeEditor from '../pages/CodeEditor.jsx'
import AiPdfMaker from '../pages/AiPdfMaker.jsx'
import Course from '../pages/Course'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import AdminDashboard from '../pages/AdminDashboard'
import { Link } from 'react-router-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <div className="nav-links">
        <Link to="/admin-dashboard" className="nav-link">Admin Dashboard</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/signup" className="nav-link">Sign Up</Link>
        <Link to="/courses" className="nav-link">Courses</Link>
        <Link to="/ai-pdf-maker" className="nav-link">AI Notes Maker</Link>
        <Link to="/" className="nav-link">Code Editor</Link>
      </div>

      <Routes>
        <Route path="/" element={<CodeEditor />} />
        <Route path="/ai-pdf-maker" element={<AiPdfMaker />} />
        <Route path="/courses" element={<Course />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  )
}

export default App
