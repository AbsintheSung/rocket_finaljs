//API們
const apiPath = 'yixuan';
const productListUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/products`;
const cartUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`;

//網頁元素們
const productList = document.querySelector('.product-list'); 
const productImg = document.querySelector('.product-img');
const addProduct = document.querySelector('.add-product');
const productName = document.querySelector('.product-name');
const originalPrice = document.querySelector('.original-price');
const salePrice = document.querySelector('.sale-price');







//取得產品列表
const getProductList = () => {
    axios.get(productListUrl)
        .then(response => {
            console.log(response.data.products)
            let allProduct = '';
            response.data.products.forEach(obj => {
                allProduct +=
                    `<li class="product-cards" data-category="${obj.category}">
                    <span class="product-type">新品</span> 
                    <img class="product-img" src="${obj.images}">
                    <a href="#" alt="加入購物車" class="add-product" data-id="${obj.id}">加入購物車</a>
                    <h3 class="product-name">${obj.title}</h3>
                    <del class="original-price">NT$${obj.origin_price}</del>
                    <p class="sale-price">NT$${obj.price}</p>
                    </li>`;
            });
            renderHtml(productList, allProduct);
        })
        .catch(error => {
            console.log(error.response);
        });
}

getProductList();

//渲染物件到頁面上
const renderHtml = ( element , data ) =>{
    element.innerHTML = data;
}

const obj =  {
    "data": {
      "productId": "wgN3j5LRIItJpMXnpM3t",
      "quantity": 5
    }
  }

//加入購物車
const addCartItem = () =>{
    axios.post(cartUrl, obj)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

}

//取得購物車列表

const getCartList = () => {

axios.post(cartUrl, obj)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}

getCartList();
