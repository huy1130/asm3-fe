import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuizListPage from './pages/QuizListPage';
import TakeQuizPage from './pages/TakeQuizPage';
import ManageQuestionsPage from './pages/admin/ManageQuestionsPage';
import ManageQuizzesPage from './pages/admin/ManageQuizzesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <QuizListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <PrivateRoute>
              <TakeQuizPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/questions"
          element={
            <AdminRoute>
              <ManageQuestionsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <AdminRoute>
              <ManageQuizzesPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
