// src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function requestApi<T>(url: string, options: RequestInit & { params?: Record<string, any> } = {}): Promise<T> {
    // const urlParams = new URLSearchParams(window.location.search);
    // const targetPath = urlParams.get('callbackUrl');
    // if(targetPath) {
    //     window.location.href = targetPath;
    // }
    const isFormData = options.body instanceof FormData;
    const headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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
        const errorData = await response.json().catch(() => ({}));
        return errorData;
    }
    return response.json();
}
export async function uploadSingle(file: File) {
  const formData = new FormData();

  formData.append('file', file); 
  formData.append('refId', '1');
  formData.append('refType', 'PRODUCT');

  return requestApi('/images/upload', {
    method: 'POST',
    body: formData,
  });
}
export async function uploadMultiple(files: File[]) {
  const formData = new FormData();

  files.forEach(file => {
    formData.append('files', file); 
  });

  formData.append('refId', '1');
  formData.append('refType', 'PRODUCT');

  return requestApi('/images/upload-multiple', {
    method: 'POST',
    body: formData,
  });
}
export async function checkAuthToken<T>() {
    const refreshRes = await fetch(BASE_URL + 'auth/refresh', {
        method: 'POST',
        credentials: 'include',
    });
    return refreshRes.json();
}