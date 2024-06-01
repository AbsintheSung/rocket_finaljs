//c3相關
export function c3Generate(array) {
    c3.generate({
        bindto: '#chart',
        data: {
            columns: array,
            type: 'pie',
        },
        color: {
            pattern: ["#DACBFF", "#9D7FEA", "#5434A7", "#301E5F"]
        }
    });
}

export function changeOneDimensional(array) { //將 orderData.products 全部取出後，轉成一維陣列
    if (array.length === 0) return []
    let temp = []
    array.forEach(function (item) {
        temp.push(item.products)
    })
    let result = temp.reduce(function (previousValue, currentValue) {
        return previousValue.concat(currentValue);
    }, []);
    return result
}
export function category(array) {
    if (array.length === 0) return []
    const temp = changeOneDimensional(array)
    const c3Array = []
    let result = temp.reduce(function (allNames, name) {
        if (name.category in allNames) {
            allNames[name.category] = allNames[name.category] + (name.price * name.quantity);
        } else {
            allNames[name.category] = name.price * name.quantity;
        }
        return allNames;
    }, {});
    for (let key in result) {
        c3Array.push([key, result[key]])
    }
    return c3Array
}
export function allOrderItems(array) {
    if (array.length === 0) return []
    const temp = changeOneDimensional(array)
    let result = temp.reduce(function (allNames, name) {
        let temp = name.title
        if (temp in allNames) {
            allNames[name.title] = allNames[name.title] + (name.price * name.quantity);
        } else {
            allNames[name.title] = name.price * name.quantity;
        }
        return allNames;
    }, {});
    let sortedItems = Object.entries(result).sort((a, b) => b[1] - a[1]);

    // 取出前三個項目
    let c3Array = sortedItems.slice(0, 3);

    // 計算其餘項目的總和
    let otherItemsSum = sortedItems.slice(3).reduce((sum, item) => sum + item[1], 0);

    // 將其餘項目的總和加入到前三個項目中，並將其鍵設為 "其他"
    c3Array.push(["其他", otherItemsSum]);

    return c3Array

}