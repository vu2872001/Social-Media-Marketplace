import { createSlice } from "@reduxjs/toolkit";
import { refreshToken } from "../apiRequest";
import { revertAll } from "../resetStore";
const initialState = {
  get: {
    data: [],
  },
};
export const commentSlice = createSlice({
  name: "comment",
  initialState: {
    get: {
      data: [],
    },
  },
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    commentPostSaga() {},
    commentPostSagaSuccess() {},

    deleteCommentPostSaga() {},
    deleteCommentPostSagaSuccess() {},

    updateCommentPostSaga() {},
    updateCommentPostSagaSuccess() {},

    getCommentPostSaga() {},
    getCommentPostSagaSuccess() {},
    getCommentPostSuccess: (state, action) => {
      debugger
      if(action.payload.data.results.data.length >0){
        const post_id = action.payload.data.results.data[0].post_id;
        const totalComment = action.payload.data.results.page;
        debugger
        const group_comment = {
          post_id: post_id,
          list_comment: [...action.payload.data.results.data],
          page: {
            ...totalComment,
            totalCurrentShowComment:action.payload.data.results.data.length
          },
        };
        const preState = state.get.data;
        if (state.get.data.length > 0) {
          const pos = state.get.data.map((e) => e.post_id).indexOf(post_id);
          if (pos > -1 && !action.payload.paging) {
            state.get.data[pos].list_comment = action.payload.data.results.data;
            console.log(state.get.data[pos].page);
            state.get.data[pos].page ={...state.get.data[pos].page,...action.payload.data.results.page};
          }
          else if (pos > -1 && action.payload.paging){
            state.get.data[pos].list_comment = [...state.get.data[pos].list_comment,...action.payload.data.results.data]
            state.get.data[pos].page.totalCurrentShowComment +=action.payload.data.results.data.length;
          }
          else {
            state.get.data = [...preState, group_comment];
          }
        } else {
          state.get.data = [...preState, group_comment];
        }
      }
      else{
        const post_id = action.payload.post_id;
        if (state.get.data.length > 0) {
          const pos = state.get.data.map((e) => e.post_id).indexOf(post_id);
          if (pos > -1) {
            state.get.data[pos].list_comment = [];
            state.get.data[pos].page = null;
          }
        }
      }
    },
  },
});
export const {
  updateCommentPostSaga,
  updateCommentPostSagaSuccess,
  deleteCommentPostSaga,
  deleteCommentPostSagaSuccess,
  commentPostSaga,
  commentPostSagaSuccess,
  getCommentPostSaga,
  getCommentPostSagaSuccess,
  getCommentPostSuccess,
} = commentSlice.actions;

export default commentSlice.reducer;
