interface HandleResponse<T = null> {
    statusCode: number | 200;
    message: string | string[];
    error?: string;
    data: T;
}   