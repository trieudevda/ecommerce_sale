const APP_PATH = {
    ADMIN: '/admin',
    USER: '/user',
    PRODUCT_CATEGORY: '/product-category',
    PRODUCT_CATEGORY_ATTRIBUTE: '/attribute',
    PRODUCT: '/product',
    ROLE: '/role',
    PERMISSION: '/permission',
}
export const ADMIN_PATHS = {
    USER: {
        LIST: () => APP_PATH.ADMIN + APP_PATH.USER,
        CREATE: () => APP_PATH.ADMIN + APP_PATH.USER + '/create',
        EDIT: (id: string) => APP_PATH.ADMIN + APP_PATH.USER + `/edit/${id}`,
    },
    PRODUCT: {
        LIST: () => APP_PATH.ADMIN + APP_PATH.PRODUCT,
        CREATE: () => APP_PATH.ADMIN + APP_PATH.PRODUCT + '/create',
        CATEGORY: {
            LIST: () => APP_PATH.ADMIN + APP_PATH.PRODUCT_CATEGORY,
            CREATE: () => APP_PATH.ADMIN + APP_PATH.PRODUCT_CATEGORY + '/create',
            EDIT: (id: string) => APP_PATH.ADMIN + APP_PATH.PRODUCT_CATEGORY + `/edit/${id}`,
            ATTRIBUTE: {
                LIST: () => APP_PATH.ADMIN + APP_PATH.PRODUCT_CATEGORY + APP_PATH.PRODUCT_CATEGORY_ATTRIBUTE,
                CREATE: () => APP_PATH.ADMIN + APP_PATH.PRODUCT_CATEGORY + APP_PATH.PRODUCT_CATEGORY_ATTRIBUTE+ '/create',
            }
        }
        // EDIT: (id: string) => APP_PATH.ADMIN + APP_PATH.USER + `/edit/${id}`,
    },
    ROLE: {
        LIST: () => APP_PATH.ADMIN + APP_PATH.ROLE,
        CREATE: () => APP_PATH.ADMIN + APP_PATH.ROLE + '/create',
        EDIT: (id: string) => APP_PATH.ADMIN + APP_PATH.ROLE + `/edit/${id}`,
    },
    PERMISSION: {
        LIST: () => APP_PATH.ADMIN + APP_PATH.PERMISSION,
        CREATE: () => APP_PATH.ADMIN + APP_PATH.PERMISSION + '/create',
        EDIT: (id: string) => APP_PATH.ADMIN + APP_PATH.PERMISSION + `/edit/${id}`,
    },
    LOGIN: '/admin/login',
};