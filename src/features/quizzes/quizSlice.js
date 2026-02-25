import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const parseError = (err, fallback) => {
  const data = err.response?.data;
  if (!data) return fallback;
  if (typeof data.error === 'string') return data.error;
  if (typeof data.error?.message === 'string') return data.error.message;
  if (typeof data.message === 'string') return data.message;
  return fallback;
};

export const fetchQuizzes = createAsyncThunk('quizzes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/quizzes');
    return res.data;
  } catch (err) {
    return rejectWithValue(parseError(err, 'Failed to fetch quizzes'));
  }
});

export const fetchQuizById = createAsyncThunk('quizzes/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/quizzes/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(parseError(err, 'Failed to fetch quiz'));
  }
});

export const createQuiz = createAsyncThunk('quizzes/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/quizzes', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(parseError(err, 'Failed to create quiz'));
  }
});

export const updateQuiz = createAsyncThunk('quizzes/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/quizzes/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(parseError(err, 'Failed to update quiz'));
  }
});

export const deleteQuiz = createAsyncThunk('quizzes/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/quizzes/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(parseError(err, 'Failed to delete quiz'));
  }
});

const quizSlice = createSlice({
  name: 'quizzes',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchQuizzes.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchQuizzes.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchQuizById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchQuizById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchQuizById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createQuiz.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(createQuiz.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateQuiz.fulfilled, (state, action) => {
        const idx = state.list.findIndex((q) => q._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateQuiz.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.list = state.list.filter((q) => q._id !== action.payload);
      })
      .addCase(deleteQuiz.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearCurrent, clearError } = quizSlice.actions;
export default quizSlice.reducer;
