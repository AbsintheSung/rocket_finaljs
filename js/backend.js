//假資料
const data = {
    "status": true,
    "orders": [
        {
            "createdAt": 1716275072,
            "total": 51000,
            "quantity": 4,
            "id": "0GKApY4YcHlBCg2HijfI",
            "user": {
                "address": "12123123",
                "name": "ssss",
                "tel": "0932051549",
                "payment": "ATM",
                "email": "h90243768@gmail.com"
            },
            "products": [
                {
                    "images": "https://hexschool-api.s3.us-west-2.amazonaws.com/custom/tTQQggBAfhl0vEeM7WmTwij1JbAwC7MBD2TSyjHbZHvBjnLU5tOtoGszOmODOEu6DRjzdjIpcEzeCCkmRWaL8JDJwaaWglER7P3V4JXKT7FT5gm0UL45CaHpSVlEXbKK.png",
                    "quantity": 2,
                    "price": 15000,
                    "description": "Charles 雙人床架有著多種異材組合，北美黃楊木打造的床架，仿真皮革的床頭靠枕再加上烤漆金屬的床腳，體現實木床架Mid-Century Modern(世紀中期現代風)美學；且床腳筆直設計，床底寬敞空間考量現代人收納儲物需求，推薦給尋覓復古風雙人床架的你，同款式另有雙人標準床架(5*6.2)尺寸。",
                    "origin_price": 17000,
                    "id": "3STbcpyj9Qqt9KaSitfr",
                    "title": "Charles 雙人床架",
                    "category": "床架"
                },
                {
                    "images": "https://hexschool-api.s3.us-west-2.amazonaws.com/custom/Zr4h1Oqvc6NtAnpe5pNqJfGYyBJshAlKctfv0BTAZBqVAuvfSAWk4bcidBd8qBu1lRn5TWvib6O3UbmIAEt5w8SdB94GuFplZn6IM4SBvtxWJA2VnOqvQOsKungCPDXv.png",
                    "quantity": 1,
                    "price": 9000,
                    "description": "喬丹6尺雙人加大床頭片",
                    "origin_price": 12000,
                    "id": "3lSb3g5Z8RqhjldnL8hp",
                    "title": "Jordan 雙人床架／雙人加大",
                    "category": "床架"
                },
                {
                    "images": "https://hexschool-api.s3.us-west-2.amazonaws.com/custom/VYPOpg83Jg7Ft5raI0eyzs6xSz0ttKzSJSklFq7il0HdwJ1iQ9kLHAU19rmkSapmyzRErTm1sxWO725W7CnowkRjwxgSyyRBo1ihGLwNbfYtgbo2nCTY9sarjqoxQbYX.png",
                    "quantity": 1,
                    "price": 12000,
                    "description": "Antony 雙人床架加大選用北美黃楊木打造，木質堅韌且紋理細膩，胡桃木色手工塗裝持久不掉色，彎角導圓、造型簡約、黃銅妝點，體現床架 Mid-Century Modern (世紀中期現代風家具)美學，推薦給喜愛復古風雙人床架的你。同款式還有雙人床架(5*6.2)尺寸，適合寢室空間有限的你。",
                    "origin_price": 18000,
                    "id": "Qh0dTcA8zu6YVBtJTH7m",
                    "title": "Antony 雙人床架／雙人加大",
                    "category": "床架"
                }
            ],
            "paid": true,
            "updatedAt": 1716275083
        }
    ]
}
import axios from "axios";
const account = "absinthe"
const uid = "3MqEVCXgUfWPBU1z05uHAjqjnzi2"
const baseUrl = "https://livejs-api.hexschool.io/api/livejs/v1/admin"
const axiosConfig = {
    headers: {
        Authorization: `${uid}`
    }
}

//訂單日期
function createOrderTime(orderTime) {
    let temp = new Date(orderTime * 1000);
    let date = `<p>${temp.getFullYear()}/${temp.getMonth() + 1}/${temp.getDate()}</p>`;
    return date
}

//訂日項目 數量 金額
function createProductItem(array) {
    let temp = ''
    array.forEach(function (item) {
        let num = item.price * item.quantity
        temp += `<p><span>${item.title}(${item.price})</span> * <span>${item.quantity}</span></p><br>
        <p>共:${num}元</p><br>`
    })
    return temp
}

// 處理狀態
function paidStatus(status) {
    return status ? '已處理' : '未處理';
}

//動態建立表單內容
function createOrder(array) {
    const orderTbody = document.querySelector('.admin-table tbody');
    let str = '';

    array.forEach(function (item) {
        let paidStr = paidStatus(item.paid)
        let productsStr = createProductItem(item.products)
        let createDate = createOrderTime(item.createdAt)
        str += `<tr>
                <td>${item.id}</td>
                <td>
                    <p>${item.user.name}</p>
                    <p>${item.user.tel}</p>
                </td>
                <td>${item.user.address}</td>
                <td>${item.user.email}</td>
                <td>
                    ${productsStr}
                </td>
                <td>${createDate}</td>
                <td>
                    <button class="orderStatus" value="status"  data-id=${item.id}>${paidStr}</button>
                </td>
                <td>
                    <button class="deleteOneBtn" value="delete"  data-id=${item.id}>刪除</button>
                </td>
            </tr>`
    })
    orderTbody.innerHTML = str
}


//遠端獲取資料
async function getOrderData() {
    const sendUrl = `${baseUrl}/${account}/orders`
    try {
        const response = await axios.get(sendUrl, axiosConfig)
        if (response.status === 200) {
            createOrder(response.data.orders)
        }
    } catch (error) {
        if (error.response.status === 403) console.log(error.response.data)
        else if (error.response.status === 404) console.log(error.response.data)
        else console.log('取得失敗，請聯絡服務商')
    }
}
getOrderData()
