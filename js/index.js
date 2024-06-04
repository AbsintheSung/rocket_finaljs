import { loading, toast, sweetalert } from "./swal";
//API們
const apiPath = "yixuan";
const productListUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/products`;
const cartUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`;
const formUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/orders`;
//網頁元素們
const productCategory = document.querySelector(".product-category");

const productList = document.querySelector(".product-list");
const productImg = document.querySelector(".product-img");
const addProduct = document.querySelector(".add-product");
const productName = document.querySelector(".product-name");
const originalPrice = document.querySelector(".original-price");
const salePrice = document.querySelector(".sale-price");

const cartItems = document.querySelector(".cart-items");
const cartList = document.querySelector(".cart-list");
const cartTotalPrice = document.querySelector(".total-price");
const cancelButton = document.querySelector(".cancel-button .material-icons");
const cancelAllButton = document.querySelector(".cancel-all-button");

let productsData = [];

//取得產品列表
const getProductList = () => {
  axios
    .get(productListUrl)
    .then((response) => {
      productsData = response.data.products;
      renderProducts(productsData);
    })
    .catch((error) => {
      console.log(error.response);
    });
};

//渲染產品列表
const renderProducts = (products) => {
  let allProduct = "";
  products.forEach((obj) => {
    allProduct += `<li class="product-cards" data-category="${obj.category}">
            <span class="product-type">新品</span> 
            <img class="product-img" src="${obj.images}">
            <button type="button" class="add-product" data-id="${obj.id}">加入購物車</button>
            <h3 class="product-name">${obj.title}</h3>
            <del class="original-price">NT$${obj.origin_price}</del>
            <p class="sale-price">NT$${obj.price}</p>
            </li>`;
  });
  renderHtml(productList, allProduct);
};

//渲染 HTML 到指定元素
const renderHtml = (element, data) => {
  element.innerHTML = data;
};

//篩選資料
const checkProduct = (event) => {
  let selectedCategory = event.target.value;
  let filteredProducts = productsData.filter((item) => {
    return selectedCategory === "全部" || item.category === selectedCategory;
  });
  renderProducts(filteredProducts);
};

getProductList();

//監聽篩選選單
productCategory.addEventListener("change", checkProduct);

//取得購物車
axios
  .get(cartUrl)
  .then((response) => {
    console.log(response.data);
    const cartData = renderCartItem(response.data.carts);
    cartTotalPrice.textContent = `NT$${response.data.finalTotal}`;
    renderHtml(cartList, cartData);
  })
  .catch((error) => {
    console.log(error);
  });

//渲染購物車
const renderCartItem = (data) => {
  return data
    .map(
      (obj) => `
      <tr class="cart-items">
        <td>
          <div class="items-title">
            <img src="${obj.product.images}" alt="產品圖片">
            <p>${obj.product.title}</p>
          </div>
        </td>
        <td>${obj.product.price}</td>
        <td>${obj.quantity}</td>
        <td>${obj.product.price * obj.quantity}</td>
        <td class="cancel-button">
        <p class="material-icons" data-cart-id="${obj.id}">clear</p>
        </td>
      </tr>`
    )
    .join("");
};

//加入購物車
function addCart(data) {
  axios.post(cartUrl, data).then((response) => {
    const cartData = renderCartItem(response.data.carts);
    renderHtml(cartList, cartData);
    cartTotalPrice.textContent = `NT$${response.data.finalTotal}`;
  });
}

//點擊加入購物車並新增至頁面上
productList.addEventListener("click", (event) => {
  const productId = event.target.getAttribute("data-id");
  if (productId) {
    const productData = {
      data: {
        productId: productId,
        quantity: 1,
      },
    };
    addCart(productData);
  }
});

//刪除購物車所有品項
cancelAllButton.addEventListener('click',() => {
  axios.delete(cartUrl).then((response) =>{
    cartList.innerHTML = '';
    cartTotalPrice.textContent = 'NT$0';
    document.getElementById('empty-cart-message').classList.add('empty-cart');
    console.log(response);
  })
})

//表單驗證( 使用 validate套件)
const orderInfoForm = document.querySelector(".orderInfo-form");
const customerName = document.querySelector("#customerName");
const customerPhone = document.querySelector("#customerPhone");
const customerEmail = document.querySelector("#customerEmail");
const customerAddress = document.querySelector("#customerAddress");
const tradeWay = document.querySelector("#tradeWay");
const orderInfoMessage = Array.from(
  document.querySelectorAll(".orderInfo-message")
);
const orderInfoBtn = document.querySelector(".orderInfo-btn");
const constraints = {
  姓名: {
    presence: {
      message: "必填",
    },
  },
  電話: {
    presence: {
      message: "必填",
    },
  },
  Email: {
    presence: {
      message: "必填",
    },
    email: {
      message: "須符合Email格式",
    },
  },
  寄送地址: {
    presence: {
      message: "必填",
    },
  },
};
async function sendOrder(data) {
  try {
    loading();
    const response = await axios.post(formUrl, data);
    if (response.status === 200) {
      sweetalert("加入成功", "通知訊息", "success");
      axios
        .get(cartUrl)
        .then((response) => {
          console.log(response.data);
          const cartData = renderCartItem(response.data.carts);
          cartTotalPrice.textContent = `NT$${response.data.finalTotal}`;
          renderHtml(cartList, cartData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (error) {
    sweetalert(error.response.data.message, "通知訊息", "error");
    // console.log(error.response.data.message);
  }
}

function resetErrorMes() {
  orderInfoMessage.forEach((item) => (item.textContent = ""));
}
function Verify(errorMessage) {
  for (let errorkey in errorMessage) {
    orderInfoMessage.forEach((item) => {
      if (item.getAttribute("data-message") === errorkey) {
        item.textContent = errorMessage[errorkey]
          .pop()
          .split(" ")
          .slice(1)
          .join(" ");
      }
    });
  }
}
orderInfoBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const errorMessage = validate(orderInfoForm, constraints);
  const data = {
    data: {
      user: {
        name: customerName.value,
        tel: customerPhone.value,
        email: customerEmail.value,
        address: customerAddress.value,
        payment: tradeWay.value,
      },
    },
  };
  resetErrorMes();
  errorMessage ? Verify(errorMessage) : await sendOrder(data);
});
resetErrorMes();
