export const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}


export const loadFromLocalStorage = (key) => {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null
}