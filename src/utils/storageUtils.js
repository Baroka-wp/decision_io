export function getUserName() {
    return localStorage.getItem('userName');
}

export function setUserName(name) {
    localStorage.setItem('userName', name);
}