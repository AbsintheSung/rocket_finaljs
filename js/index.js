//API們
const apiPath = 'yixuan';
const productListUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/products`;
const cartUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`;



//網頁元素們
const productCategory = document.querySelector('.product-category');

const productList = document.querySelector('.product-list'); 
const productImg = document.querySelector('.product-img');
const addProduct = document.querySelector('.add-product');
const productName = document.querySelector('.product-name');
const originalPrice = document.querySelector('.original-price');
const salePrice = document.querySelector('.sale-price');





let productsData = [];

//取得產品列表
const getProductList = () => {
    axios.get(productListUrl)
        .then(response => {
            productsData = response.data.products;
            renderProducts(productsData);
        })
        .catch(error => {
            console.log(error.response);
        });
}

const renderProducts = (products) =>{
    let allProduct = '';
    products.forEach(obj => {
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
    renderHtml(productList,allProduct);
}



//渲染物件到頁面上
const renderHtml = ( element , data ) =>{
    element.innerHTML = data;
}

//篩選資料
const checkProduct = (event) => {
    let selectedCategory = event.target.value;
    let filteredProducts = productsData.filter(item => {
        return selectedCategory === "全部" || item.category === selectedCategory;
    });
    renderProducts(filteredProducts);
}

getProductList();

//監聽篩選選單
productCategory.addEventListener('change',checkProduct);

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
