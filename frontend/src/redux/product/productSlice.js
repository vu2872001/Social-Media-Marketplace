import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../resetStore";
const initialState = {
  getSelling: {
    data: [],
  },
  createSelling: {
    isFetching: false,
    isError: false,
    isSuccess: false,
  },
  getShopping: {
    data: [],
  },
  getProductDetail: {
    data: null,
  },
  getListCartWithoutPaging: {
    data: [],
  },
  update: {
    product: null,
  },
};
export const productSlice = createSlice({
  name: "product",
  initialState: {
    getSelling: {
      data: [],
    },
    createSelling: {
      isFetching: false,
      isError: false,
      isSuccess: false,
    },
    getShopping: {
      data: [],
    },
    getProductDetail: {
      data: null,
    },
    getListCartWithoutPaging: {
      data: [],
    },
    update: {
      product: null,
    },
  },
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    getSellingProductSaga() {},
    getSellingProduct: (state, action) => {
      state.getSelling.data = action.payload;
    },
    createSellingProductSagaSuccess() {},


    deleteSellingProductSagaSuccess() {},

    updateSellingProductSagaSuccess() {},

    getShoppingProductSaga() {},
    getShoppingProductSagaSuccess() {},
    getShoppingProduct: (state, action) => {
      state.getShopping.data = action.payload;
    },
   
    
    getListCartWithoutPagingSaga() {},
    getListCartWithoutPaging: (state, action) => {
      state.getListCartWithoutPaging.data = action.payload;
    },
    addProductToCartWithoutPagingSagaSuccess(){},
    removeProductFromListCartWithoutPagingSuccess(){},
    
    getProductDetail: (state, action) => {
      state.getProductDetail.data = action.payload;
    },
    updateProduct: (state, action) => {
      state.update.product = action.payload;
    },
    resetUpdateProduct: (state) => {
      state.update.product = null;
    },
  },
});
export const {
  getProductDetail,

  getListCartWithoutPaging,
  getListCartWithoutPagingSaga,
  addProductToCartWithoutPagingSagaSuccess,
  removeProductFromListCartWithoutPagingSuccess,

  getShoppingProductSaga,
  getShoppingProduct,
  getShoppingProductSagaSuccess,

  getSellingProductSaga,
  getSellingProduct,
  createSellingProductSagaSuccess,
  deleteSellingProductSagaSuccess,
  updateSellingProductSagaSuccess,

  updateProduct,
  resetUpdateProduct,
} = productSlice.actions;

export default productSlice.reducer;