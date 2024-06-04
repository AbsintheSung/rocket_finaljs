import{a as r,l as v,s as u}from"./swal-46d26614.js";const n="yixuan",S=`https://livejs-api.hexschool.io/api/livejs/v1/customer/${n}/products`,o=`https://livejs-api.hexschool.io/api/livejs/v1/customer/${n}/carts`,$=`https://livejs-api.hexschool.io/api/livejs/v1/customer/${n}/orders`,E=document.querySelector(".product-category"),m=document.querySelector(".product-list");document.querySelector(".product-img");document.querySelector(".add-product");document.querySelector(".product-name");document.querySelector(".original-price");document.querySelector(".sale-price");document.querySelector(".cart-items");const d=document.querySelector(".cart-list"),l=document.querySelector(".total-price");document.querySelectorAll(".cancel-button .material-icons");const L=document.querySelector(".cancel-all-button");let s=[];const I=()=>{r.get(S).then(t=>{s=t.data.products,p(s)}).catch(t=>{console.log(t.response)})},p=t=>{let e="";t.forEach(c=>{e+=`<li class="product-cards" data-category="${c.category}">
            <span class="product-type">新品</span> 
            <img class="product-img" src="${c.images}">
            <button type="button" class="add-product" data-id="${c.id}">加入購物車</button>
            <h3 class="product-name">${c.title}</h3>
            <del class="original-price">NT$${c.origin_price}</del>
            <p class="sale-price">NT$${c.price}</p>
            </li>`}),i(m,e)},i=(t,e)=>{t.innerHTML=e},x=t=>{let e=t.target.value,c=s.filter(a=>e==="全部"||a.category===e);p(c)};I();E.addEventListener("change",x);const y=()=>{r.get(o).then(t=>{const e=g(t.data.carts);l.textContent=`NT$${t.data.finalTotal}`,i(d,e),t.data.carts.length===0?(document.querySelector(".cart-table").classList.add("cart-table-hidden"),document.getElementById("empty-cart-message").classList.add("empty-cart")):(document.querySelector(".cart-table").classList.remove("cart-table-hidden"),document.getElementById("empty-cart-message").classList.remove("empty-cart")),document.querySelectorAll(".material-icons").forEach(c=>{c.addEventListener("click",a=>{const q=a.target.getAttribute("data-cart-id");console.log(q)})})}).catch(t=>{console.log(t)})},g=t=>t.map(e=>`
      <tr class="cart-items">
        <td>
          <div class="items-title">
            <img src="${e.product.images}" alt="產品圖片">
            <p>${e.product.title}</p>
          </div>
        </td>
        <td>${e.product.price}</td>
        <td>${e.quantity}</td>
        <td>${e.product.price*e.quantity}</td>
        <td class="cancel-button">
        <p class="material-icons" data-cart-id="${e.id}">clear</p>
        </td>
      </tr>`).join(""),A=t=>{r.post(o,t).then(e=>{y()})};m.addEventListener("click",t=>{const e=t.target.getAttribute("data-id");e&&A({data:{productId:e,quantity:1}})});L.addEventListener("click",()=>{r.delete(o).then(t=>{d.innerHTML="",l.textContent="NT$0",document.querySelector(".cart-table").classList.add("cart-table-hidden"),document.getElementById("empty-cart-message").classList.add("empty-cart")}).catch(t=>{console.error(t)})});y();const C=document.querySelector(".orderInfo-form"),T=document.querySelector("#customerName"),P=document.querySelector("#customerPhone"),N=document.querySelector("#customerEmail"),k=document.querySelector("#customerAddress"),D=document.querySelector("#tradeWay"),h=Array.from(document.querySelectorAll(".orderInfo-message")),b=document.querySelector(".orderInfo-btn"),B={姓名:{presence:{message:"必填"}},電話:{presence:{message:"必填"}},Email:{presence:{message:"必填"},email:{message:"須符合Email格式"}},寄送地址:{presence:{message:"必填"}}};async function M(t){try{v(),(await r.post($,t)).status===200&&(u("加入成功","通知訊息","success"),r.get(o).then(c=>{console.log(c.data);const a=g(c.data.carts);l.textContent=`NT$${c.data.finalTotal}`,i(d,a)}).catch(c=>{console.log(c)}))}catch(e){u(e.response.data.message,"通知訊息","error")}}function f(){h.forEach(t=>t.textContent="")}function w(t){for(let e in t)h.forEach(c=>{c.getAttribute("data-message")===e&&(c.textContent=t[e].pop().split(" ").slice(1).join(" "))})}b.addEventListener("click",async t=>{t.preventDefault();const e=validate(C,B),c={data:{user:{name:T.value,tel:P.value,email:N.value,address:k.value,payment:D.value}}};f(),e?w(e):await M(c)});f();
