import axios from "axios";
import { loading, handleDelete, handleStatus, toast } from './swal'
import { c3Generate, category, allOrderItems, drawC3 } from "./c3_chart"
// import Swal from 'sweetalert2'
const adminTable = document.querySelector('.admin-table')
const deleteAllBtn = document.querySelector('.deleteAllBtn')
const sectionRevenue = document.querySelector('.section-revenue')
const no_foundMain = document.querySelector('.no_found-section')
const tableContainer = document.querySelector('.table-container')
const account = "absinthe"
const uid = "3MqEVCXgUfWPBU1z05uHAjqjnzi2"
const baseUrl = "https://livejs-api.hexschool.io/api/livejs/v1/admin"
const axiosConfig = {
    headers: {
        Authorization: `${uid}`
    }
}
const orderData = []

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

//將遠端的的資料，存在本地
function creatrLocalData(array) {
    orderData.splice(0, orderData.length); //重製 0
    array.forEach(item => orderData.push(item))
}

//訂單有無的畫面顯示與隱藏
function showView() {
    no_foundMain.style.display = orderData.length === 0 ? 'block' : 'none';
    sectionRevenue.style.display = orderData.length === 0 ? 'none' : 'block';
    tableContainer.style.display = orderData.length === 0 ? 'none' : 'block';

}

//刪除單筆
async function deleteOneData(id) {
    const sendUrl = `${baseUrl}/${account}/orders/${id}`
    try {
        const response = await axios.delete(sendUrl, axiosConfig)
        creatrLocalData(response.data.orders)
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
        creatrLocalData(response.data.orders)
        return response.data.orders
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
        creatrLocalData(response.data.orders)
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
        showView()
        loading()
        const response = await axios.get(sendUrl, axiosConfig)
        if (response.status === 200) {
            createOrder(response.data.orders) //轉成dom並掛載到html上
            creatrLocalData(response.data.orders) //將取得資料存在  orderData 內
            toast('success', "加載完成")
        }
    } catch (error) {
        if (error.response.status === 403) sweetalert(error.response.data.message, "錯誤通知", "error")
        else if (error.response.status === 404) sweetalert(error.response.data.message, "錯誤通知", "error")
        else sweetalert('取得失敗，請聯絡服務商', "錯誤通知", "error")
    }
}


//表格 監聽事件
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
        response === undefined ? null : drawC3(response.value)
        showView()
    }
})

//刪除全部 監聽事件
deleteAllBtn.addEventListener('click', async function () {
    const response = await handleDelete(deleteAllData)
    response === undefined ? null : createOrder(response.value)
    response === undefined ? null : drawC3(response.value)
    showView()
})

//篩選監聽事件
sectionRevenue.addEventListener('change', function (e) {
    if (e.target.value === '類別營收比重') {
        const temp = category(orderData)
        c3Generate(temp)
    }
    if (e.target.value === '全品項營收比重') {
        const temp = allOrderItems(orderData)
        c3Generate(temp)
    }
})


//初始化
async function init() {
    await getOrderData()
    document.querySelector("body").style.paddingRight = 0 + "px" //alert套件 會造成 padding多了15px，用js重置
    drawC3(orderData)
    showView()
}
init()
