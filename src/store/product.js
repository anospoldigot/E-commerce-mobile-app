import axios from 'axios';

import { ToastAndroid } from 'react-native';

import { makeObservable, observable, action, runInAction } from 'mobx';
import { BASE_URL } from './url';

import { categories } from '../data/categories';
import { products } from '../data/products';
import { cart } from '../data/cart';
import { wishlist } from '../data/wishlist';
import api from '../utils/api';

class Product {
  state = {
    allProducts: products,
    searchedProducts: [],
    products: [],
    product: {},
    categories: [],
    category: null,
    cart: [],
    wishlist: [],
  };

  constructor() {
    makeObservable(this, {
      state: observable,
      getCategories: action,
      getProducts: action,
      getProductsByCategories: action,
      getSearchedProducts: action,
      getRandomProducts: action,
      addToCart: action,
      addToWishlist: action,
      removeFromWishlist: action,
      setCategory: action,
      setProduct: action,
      initializeState: action,
      setCheckedCart: action,
      getCheckedCart: action,
    });

    this.initializeState();
  }

  createToast = message => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      0,
      50,
    );
  };

  initializeState = async () => {
    try {
      const cart = await api.get('/carts');
      this.state.cart = cart.data.data.map(value => {
        value.isChecked = false;
        return value;
      });

      const product = await api.get('/products');
      this.state.products = product.data.data;
      const wishlist = await api.get('/wishlists');
      this.state.wishlist = wishlist.data.data;
    } catch (error) {
      console.error(error)
    }
  };

  shuffle = a => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  };

  getCategories = async () => {
    this.state.categories = categories;
  };

  getProducts = async () => {
    this.state.products = this.shuffle(products);
    this.state.allProducts = this.shuffle(products);
  };

  getProductsByCategories = async id => {
    if (id === null) {
      this.state.searchedProducts = this.shuffle(this.state.allProducts);
    } else {
      this.state.searchedProducts = this.shuffle(
        this.state.allProducts.filter(x => x.category === id),
      );
    }
  };

  getSearchedProducts = text => {
    console.log(this.state.products)
    this.state.searchedProducts = this.shuffle(
      this.state.products.filter(x =>
        x.title.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  };

  getRandomProducts = () => {
    return this.shuffle(this.state.allProducts.slice(0, 6));
  };

  setCategory = id => {
    this.state.category = id;
  };

  setProduct = data => {
    this.state.product = data;
  };

  setCheckedCart = id => {
    this.state.cart = this.state.cart.map(value => {
      if (value.id == id) value.isChecked = !value.isChecked;

      return value;
    })
  }

  getCheckedCart = id => {
    return this.state.cart.filter(value => value.isChecked)
  }

  addToCart = async product => {
    try {
      console.log(product)
      await api.post('carts', product);
      if (this.state.cart.find(x => x.product.id === product.id)) {
        this.createToast('Already in cart');
      } else {
        this.state.cart = [...this.state.cart, { product: product, quantity: 1 }];
        this.createToast('Added to cart');
      }
    } catch (error) {
      console.error(error)
      alert(error)
    }
  };

  updateCartQuantity = (id, quantity) => {
    if (quantity === 0) {
      this.state.cart = this.state.cart.filter(x => x.product.id !== id);
    } else {
      this.state.cart = this.state.cart.map(x =>
        x.product.id === id ? { ...x, quantity: quantity } : x,
      );
    }
  };

  addToWishlist = product => {
    if (this.state.wishlist.find(x => x.id === product.id)) {
      this.createToast('Already in wishlist');
    } else {
      this.state.wishlist = [...this.state.wishlist, product];
      this.createToast('Added to wishlist');
    }
  };

  removeFromWishlist = id => {
    this.state.wishlist = this.state.wishlist.filter(x => x.id !== id);
  };
}

export const ProductStore = new Product();
