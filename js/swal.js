import Swal from 'sweetalert2'


export function loading(statusText) {
    Swal.fire({
        title: statusText,
        text: "請稍候...",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}


export function sweetalert(text, statusTile, icon) {
    Swal.fire({
        text: `${text}`,
        title: `${statusTile}`,
        icon: `${icon}`
    });
}

export async function handleDelete(fn, id) {
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

export async function handleStatus(fn, id, status) {
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


const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1000,
});
export function toast(iconIcon, titleText) {
    Toast.fire({
        icon: iconIcon,
        title: titleText,

    });

}



