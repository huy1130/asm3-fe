import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import quizReducer from '../features/quizzes/quizSlice';
import questionReducer from '../features/questions/questionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    quizzes: quizReducer,
    questions: questionReducer,
  },
});

export default store;
