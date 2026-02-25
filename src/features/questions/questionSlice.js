import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchQuestions = createAsyncThunk('questions/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/questions');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch questions');
  }
});

export const createQuestion = createAsyncThunk('questions/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/questions', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to create question');
  }
});

export const updateQuestion = createAsyncThunk('questions/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/questions/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to update question');
  }
});

export const deleteQuestion = createAsyncThunk('questions/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/questions/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to delete question');
  }
});

const questionSlice = createSlice({
  name: 'questions',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchQuestions.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchQuestions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createQuestion.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(createQuestion.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateQuestion.fulfilled, (state, action) => {
        const idx = state.list.findIndex((q) => q._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateQuestion.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.list = state.list.filter((q) => q._id !== action.payload);
      })
      .addCase(deleteQuestion.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearError } = questionSlice.actions;
export default questionSlice.reducer;
