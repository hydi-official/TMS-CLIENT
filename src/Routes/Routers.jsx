import React from 'react';
import { Routes, Route } from "react-router-dom";

import Home from '../Pages/Home';
import About from '../Pages/About';
import Contact from '../Pages/Contact';
import Services from '../Pages/Services';
import Login from '../Pages/Login';

import StudentDashboard from '../Pages/student/Dashboard';
import Profile from '../Pages/student/Profile';

import LecturerDashboard from '../Pages/lecturer/Dashboard';
import Students from '../Pages/lecturer/Students';
import Lecturerprofile from '../Pages/lecturer/Profile';

import AdminDashboard from '../Pages/admin/Dashboard';
import ManageUsers from '../Pages/admin/ManageUsers';
import ForgotPin from '../Pages/ForgotPin';
import Lecturers from '../Pages/student/Lecturers';
import StudentApproval from '../Pages/lecturer/StudentApproval';
import Submissions from '../Pages/lecturer/Submissions';
import StudentSubmission from '../Pages/student/Submission';
import Notifications from '../Pages/lecturer/Notifications';
import StudentNotifications from '../Pages/student/StudentNotifications';
import Annoucement from '../Pages/lecturer/Annoucement';
import Grades from '../Pages/student/Grades';
import LectuererGrades from '../Pages/lecturer/LectuererGrades';
import Thesis from '../Pages/lecturer/Thesis';
import StudentThesis from '../Pages/student/StudentThesis';
import StudentAnnouncement from '../Pages/student/StudentAnnoucement';
import AddStudent from '../Pages/admin/AddStudent';
import AddLectuerer from '../Pages/admin/AddLectuerer';
import AssignmentPage from '../Pages/admin/Assignmnents';
import AdminProfile from '../Pages/admin/AdminProfile';

const Routers = () => {
  return (
    <Routes>
      {/* Default → Login */}
      <Route path="/" element={<Login />} />

      {/* Public pages */}
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/forgot-pin" element={<ForgotPin />} />
      <Route path="/login" element={<Login />} />



      {/* Student routes */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/profile" element={<Profile />} />
      <Route path="/student/lecturers" element={<Lecturers />} />
      <Route path="/student/submissions" element={<StudentSubmission/>} />
      <Route path="/student/notifications" element={<StudentNotifications/>} />
      <Route path="/student/grades" element={<Grades/>} />
      <Route path="/student/thesis" element={<StudentThesis/>} />
            <Route path="/student/announcements" element={<StudentAnnouncement/>} />






      {/* Lecturer routes */}
      <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
      <Route path="/lecturer/students" element={<Students />} />
      <Route path="/lecturer/students/approval" element={<StudentApproval />} />
      <Route path="/lecturer/profile" element={<Lecturerprofile />} />
      <Route path="/lecturer/submissions" element={<Submissions />} />
      <Route path="/lecturer/notifications" element={<Notifications />} />
      <Route path="/lecturer/announcements" element={<Annoucement />} />
      <Route path="/lecturer/grades" element={<LectuererGrades />} />
            <Route path="/lecturer/thesis" element={<Thesis />} />







      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/manage-users" element={<ManageUsers />} />
      <Route path="/admin/add-student" element={<AddStudent />} />
      <Route path="/admin/add-lecturer" element={<AddLectuerer />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/assignments" element={<AssignmentPage/>} />

    </Routes>
  );
};

export default Routers;
