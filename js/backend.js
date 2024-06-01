import axios from "axios";
const adminTable = document.querySelector('.admin-table')
const deleteAllBtn = document.querySelector('.deleteAllBtn')
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


adminTable.addEventListener('click', async function async(e) {
    if (e.target.classList.contains('orderStatus')) {
        console.log('我是處理狀態');
    }
    if (e.target.classList.contains('deleteOneBtn')) {
        console.log('我是刪除單筆');
    }
})

deleteAllBtn.addEventListener('click', async function () {
    console.log('我是刪除全部')
})


