import{l as f,s as i}from"./swal-6bab203b.js";const s="yixuan",h=`https://livejs-api.hexschool.io/api/livejs/v1/customer/${s}/products`,n=`https://livejs-api.hexschool.io/api/livejs/v1/customer/${s}/carts`,$=`https://livejs-api.hexschool.io/api/livejs/v1/customer/${s}/orders`,q=document.querySelector(".product-category"),m=document.querySelector(".product-list");document.querySelector(".product-img");document.querySelector(".add-product");document.querySelector(".product-name");document.querySelector(".original-price");document.querySelector(".sale-price");const d=document.querySelector(".cart-items"),l=document.querySelector(".total-price");document.querySelector(".cancel-button .material-icons");document.querySelector(".cancel-all-button");let a=[];const v=()=>{axios.get(h).then(e=>{a=e.data.products,p(a)}).catch(e=>{console.log(e.response)})},p=e=>{let t="";e.forEach(c=>{t+=`<li class="product-cards" data-category="${c.category}">
            <span class="product-type">新品</span> 
            <img class="product-img" src="${c.images}">
            <button type="button" class="add-product" data-id="${c.id}">加入購物車</button>
            <h3 class="product-name">${c.title}</h3>
            <del class="original-price">NT$${c.origin_price}</del>
            <p class="sale-price">NT$${c.price}</p>
            </li>`}),r(m,t)},r=(e,t)=>{e.innerHTML=t},S=e=>{let t=e.target.value,c=a.filter(o=>t==="全部"||o.category===t);p(c)};v();q.addEventListener("change",S);axios.get(n).then(e=>{console.log(e.data);const t=u(e.data.carts);l.textContent=`NT$${e.data.finalTotal}`,r(d,t)}).catch(e=>{console.log(e)});const u=e=>e.map(t=>`
      <tr class="cart-items">
        <td>
          <div class="items-title">
            <img src="${t.product.images}" alt="產品圖片">
            <p>${t.product.title}</p>
          </div>
        </td>
        <td>${t.product.price}</td>
        <td>${t.quantity}</td>
        <td>${t.product.price*t.quantity}</td>
        <td class="cancel-button">
        <button type="button" class="material-icons" data-cart-id="${t.id}">clear</button>
        </td>
      </tr>`).join("");function x(e){axios.post(n,e).then(t=>{const c=u(t.data.carts);r(d,c),l.textContent=`NT$${t.data.finalTotal}`})}m.addEventListener("click",e=>{const t=e.target.getAttribute("data-id");t&&x({data:{productId:t,quantity:1}})});const E=document.querySelector(".orderInfo-form"),I=document.querySelector("#customerName"),T=document.querySelector("#customerPhone"),C=document.querySelector("#customerEmail"),P=document.querySelector("#customerAddress"),D=document.querySelector("#tradeWay"),y=Array.from(document.querySelectorAll(".orderInfo-message")),L=document.querySelector(".orderInfo-btn"),N={姓名:{presence:{message:"必填"}},電話:{presence:{message:"必填"}},Email:{presence:{message:"必填"},email:{message:"須符合Email格式"}},寄送地址:{presence:{message:"必填"}}};async function A(e){try{f(),(await axios.post($,e)).status===200&&(i("加入成功","通知訊息","success"),axios.get(n).then(c=>{console.log(c.data);const o=u(c.data.carts);l.textContent=`NT$${c.data.finalTotal}`,r(d,o)}).catch(c=>{console.log(c)}))}catch(t){i(t.response.data.message,"通知訊息","error")}}function g(){y.forEach(e=>e.textContent="")}function k(e){for(let t in e)y.forEach(c=>{c.getAttribute("data-message")===t&&(c.textContent=e[t].pop().split(" ").slice(1).join(" "))})}L.addEventListener("click",async e=>{e.preventDefault();const t=validate(E,N),c={data:{user:{name:I.value,tel:T.value,email:C.value,address:P.value,payment:D.value}}};g(),t?k(t):await A(c)});g();
