export const getData = (k) => JSON.parse(localStorage.getItem(k)) || [];
export const saveData = (k, d) => localStorage.setItem(k, JSON.stringify(d));
export const getUser = () => JSON.parse(localStorage.getItem("user"));
