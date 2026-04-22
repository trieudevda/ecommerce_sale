const APP_PATH = {
    ADMIN: '/admin',
    USER: '/user',
    ROLE: '/role',
    PERMISSION: '/permission',
}
export const ADMIN_PATHS = {
    USER: {
        LIST: () => APP_PATH.ADMIN + APP_PATH.USER,
        CREATE: () => APP_PATH.ADMIN + APP_PATH.USER + '/create',
        EDIT: (id: string) => APP_PATH.ADMIN + APP_PATH.USER + `/edit/${id}`,
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