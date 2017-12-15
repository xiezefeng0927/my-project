export function saveToLocal(id, key, value) {
    var seller = window.localStorage.__seller__;
    if (!seller) {
        seller = {};
        seller[id] = {};
    } else {
        seller = JSON.parse(seller);
        if (!seller[id]) {
            seller[id] = {};
        }
    }
    seller[id][key] = value;
    window.localStorage.__seller__ = JSON.stringify(seller);
}

export function loadFromLocal(id, key, _default) {
    var seller = window.localStorage.__seller__;

    if (!seller) {
        return _default;
    }
    var sellerId = JSON.parse(seller)[id];

    if (!sellerId) {
        return _default;
    }
    return sellerId[key] || _default;
}