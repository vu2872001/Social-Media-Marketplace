import { Injectable } from '@nestjs/common';
import { ExceptionResponse } from 'src/common/utils/custom-exception.filter';
import { Product } from 'src/database/model/product.model';
import { Page } from 'src/database/view-model/page-model';
import { PagingData } from 'src/database/view-model/paging.model';
import { ResponseData } from 'src/database/view-model/success-message.model';
import { ShoppingCartRepository } from '../repository/shopping_cart.repository';

@Injectable()
export class ShoppingCartService {
    constructor(
        private readonly shoppingCartRepository: ShoppingCartRepository,
    ) { }

    //add product to cart
    async addProductToCart(profile_id: number, product_id: number): Promise<ResponseData<boolean>> {
        try {
            var response = new ResponseData<boolean>();
            response.results = null;
            return response;
        } catch (err) {
            ExceptionResponse(err);
        }
    }
    //remove product from cart
    async removeProductFromCart(profile_id: number, product_id: number): Promise<ResponseData<boolean>> {
        try {
            var response = new ResponseData<boolean>();
            response.results = null;
            return response;
        } catch (err) {
            ExceptionResponse(err);
        }
    }

    //change quantity of a product in cart
    async changeQuantityOfProductInCart(profile_id: number, product_id: number, quantity: number): Promise<ResponseData<boolean>> {
        try {
            var response = new ResponseData<boolean>();
            response.results = null;
            return response;
        } catch (err) {
            ExceptionResponse(err);
        }
    }

    //get all product in cart (paging)
    async getAllProductInCartPaging(profile_id: number, page: Page): Promise<ResponseData<PagingData<Product[]>>> {
        try {
            var response = new ResponseData<PagingData<Product[]>>();
            response.results = null;
            return response;
        } catch (err) {
            ExceptionResponse(err);
        }
    }

    //get all product in cart (without paging) -> for payemnt transaction
    async getAllProductInCartWithoutPaging(profile_id: number): Promise<ResponseData<Product[]>> {
        try {
            var response = new ResponseData<Product[]>();
            response.results = null;
            return response;
        } catch (err) {
            ExceptionResponse(err);
        }
    }

}
