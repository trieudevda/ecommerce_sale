// src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function requestApi<T>(url: string, options: RequestInit & { params?: Record<string, any> } = {}): Promise<T> {
    // await checkAuthToken();
    // const urlParams = new URLSearchParams(window.location.search);
    // const targetPath = urlParams.get('callbackUrl');
    // if(targetPath) {
    //     window.location.href = targetPath;
    // }
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };
    let fullUrl = `${BASE_URL}${url}`;
    if (options.params) {
        const queryString = new URLSearchParams(options.params).toString();
        fullUrl += `?${queryString}`;
    }
    let response = await fetch(fullUrl, {
        ...options,
        headers,
        credentials: 'include'
    });
    if (!response.ok) {
        // if (response.status === 401) {
        //     if(window.location.pathname.startsWith('/login') ) {
        //         return response.json();
        //     }
        // }
        // if (response.status === 403) {
        //     return
        //     alert("Cảnh báo: Bạn không có quyền thực hiện việc này!");
        // }
        const errorData = await response.json().catch(() => ({}));
        return errorData;
        // throw new Error(errorData.message || 'Có lỗi xảy ra');
    }
    return response.json();
}
export async function checkAuthToken<T>(){
        const refreshRes = await fetch(BASE_URL+'auth/refresh', {
            method: 'POST',
            credentials: 'include',
        });
        return refreshRes.json();
}