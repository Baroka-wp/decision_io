export function getUserName() {
    return localStorage.getItem('user_Name');
}

export function setUserName(name) {
    localStorage.setItem('user_Name', name);
}