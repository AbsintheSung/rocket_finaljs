import axios from "axios";
import Swal from 'sweetalert2'
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
                    <button class="orderStatus" value="status"  data-status=${item.paid} data-id=${item.id}>${paidStr}</button>
                </td>
                <td>
                    <button class="deleteOneBtn" value="delete"  data-id=${item.id}>刪除</button>
                </td>
            </tr>`
    })
    orderTbody.innerHTML = str
}

//刪除單筆
async function deleteOneData(id) {
    const sendUrl = `${baseUrl}/${account}/orders/${id}`
    try {
        const response = await axios.delete(sendUrl, axiosConfig)
        return response.data.orders
    } catch (error) {
        throw error.response.data.message
    }
}
//刪除多筆
async function deleteAllData() {
    const sendUrl = `${baseUrl}/${account}/orders/`
    try {
        const response = await axios.delete(sendUrl, axiosConfig)
        return response.data.message
    } catch (error) {
        throw error.response.data.message
    }
}

//修改狀態
async function checkoutStatus(id, status) {
    const sendUrl = `${baseUrl}/${account}/orders`
    const data = {
        "data": {
            "id": `${id}`,
            "paid": status
        }
    }
    try {
        const response = await axios.put(sendUrl, data, axiosConfig)
        return response.data.orders
    } catch (error) {
        console.log(error)
        throw error.response.data.message
    }
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
        const id = e.target.getAttribute('data-id')
        const status = e.target.getAttribute('data-status')
        const response = await handleStatus(checkoutStatus, id, status)
        response === undefined ? null : createOrder(response.value)
    }
    if (e.target.classList.contains('deleteOneBtn')) {
        const id = e.target.getAttribute('data-id')
        const response = await handleDelete(deleteOneData, id)
        response === undefined ? null : createOrder(response.value)
    }
})

deleteAllBtn.addEventListener('click', async function () {
    const response = await handleDelete(deleteAllData)
    response === undefined ? null : createOrder(response.value)
})


function sweetalert(text, statusTile, icon) {
    Swal.fire({
        title: `${statusTile}`,
        text: `${text}`,
        icon: `${icon}`
    });
}

async function handleDelete(fn, id) {
    return Swal.fire({
        title: "刪除訂單",
        text: "你確定要刪除此訂單嗎?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        showLoaderOnConfirm: true,
        preConfirm: () => {
            return fn(id)
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (!result.isConfirmed) {
            return
        }
        sweetalert("刪除成功", "成功通知", "success")
        return result
    }).catch((result) => {
        sweetalert(result, "失敗通知", "error")
    });
}

async function handleStatus(fn, id, status) {
    return Swal.fire({
        title: "通知",
        text: "你確定要修改此訂單嗎?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        showLoaderOnConfirm: true,
        preConfirm: () => {
            return fn(id, !JSON.parse(status))
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (!result.isConfirmed) {
            return
        }
        sweetalert("修改成功", "修改通知", "info")
        return result
    }).catch((result) => {
        sweetalert(result, "失敗通知", "warning")
    });
}



