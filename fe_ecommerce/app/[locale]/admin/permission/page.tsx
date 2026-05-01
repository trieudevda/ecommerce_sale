"use client"
import React, {useMemo, useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import {
    Breadcrumb, Button, Flex,
    notification,
    Table,
    TableProps, Tag,
    theme, Tree, TreeDataNode, TreeProps, Typography,
} from 'antd';
import {requestApi} from "@/components/api/be.api";
import {getListUserColumns} from "@/components/templates/admin/user/listColumn";
import { useRouter } from 'next/navigation';
import {useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import AdminBreadcrumb from "@/components/templates/admin/breadcrumb/breadcrumb";
import {useTranslations} from "use-intl";
import {ADMIN_PATHS} from "@/src/path";
import {getListPermissionColumns} from "@/components/templates/admin/permission/listColumn";


const App: React.FC = () => {
    const router = useRouter();
    const t = useTranslations("User.List");
    const tTable = useTranslations("User.Table");
    const [allRole,setAllRole] = React.useState([])
    const [per,setPer] = React.useState([])
    const [messageApi, contextHolder] = notification.useNotification();
    const [isLoading, setIsLoading] = React.useState(true);
    const { user, isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const onChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const [checkedKeys, setCheckedKeys] = useState([]);
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await requestApi('roles/find-all-role', { method: 'GET' });
                if( data.statusCode === 403 ){
                    messageApi.error({title:'Quyền',description: "Bạn không có quyền thực hiện việc này!",
                        placement: 'bottomRight',});
                    setTimeout(()=>{router.push(ADMIN_PATHS.USER.LIST())},1000);
                    return;
                }
                setAllRole(data);
            } catch (error) {
                messageApi.error({ title: 'Lỗi', description: 'Có lỗi xảy ra khi lưu dữ liệu' });
            } finally {
                setIsLoading(false);
            }
        };
        const fetchPer = async () => {
            try {
                setIsLoading(true);
                const data = await requestApi('permissions/find-all', { method: 'GET' });
                if( data.statusCode === 403 ){
                    messageApi.error({title:'Quyền',description: "Bạn không có quyền thực hiện việc này!",
                        placement: 'bottomRight',});
                    setTimeout(()=>{router.push(ADMIN_PATHS.USER.LIST())},1000);
                    return;
                }
                setPer(data.data);
            } catch (error) {
                messageApi.error({ title: 'Lỗi', description: 'Có lỗi xảy ra khi lưu dữ liệu' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        fetchPer();
    },[]);
    const initialCheckedKeys = useMemo(() => {
        const keys = [];
        allRole.forEach(role => {
            if (role.permissions) {
                role.permissions.forEach(p => {
                    keys.push(`r${role.id}-p${p.id}`); // Phải khớp 100% với key ở trên
                });
            }
        });
        return keys;
    }, [allRole]);
    React.useEffect(() => {
        if (initialCheckedKeys.length > 0) {
            setCheckedKeys(initialCheckedKeys);
        }
    }, [initialCheckedKeys]);
    const buildFullTree = (roles, allPermissions) => {
        return roles.map(role => {
            // Tạo cấu trúc Module cho từng Role
            const moduleMap = {};
            allPermissions.forEach(p => {
                if (!moduleMap[p.module]) {
                    moduleMap[p.module] = {
                        title: p.module,
                        key: `role-${role.id}-mod-${p.module}`,
                        children: []
                    };
                }

                // Kiểm tra xem Role này có quyền này không
                const hasPermission = role.permissions.some(rp => rp.id === p.id);

                moduleMap[p.module].children.push({
                    title: p.name,
                    key: `role-${role.id}-per-${p.id}`,
                    checked: hasPermission, // Thuộc tính để nhận diện
                    isLeaf: true
                });
            });

            return {
                title: role.name,
                key: `role-root-${role.id}`,
                children: Object.values(moduleMap)
            };
        });
    };
    const treeData = useMemo(() => {
        if (!allRole.length || !per.length) return [];

        return allRole.map((role) => ({
            title: `Vai trò: ${role.name}`,
            key: `r-${role.id}`, // Node gốc của từng Role
            children: Object.values(
                per.reduce((acc, p) => {
                    if (!acc[p.module]) {
                        acc[p.module] = {
                            title: p.module,
                            key: `r${role.id}-m${p.module}`, // Key module phải gắn với roleId
                            children: []
                        };
                    }
                    acc[p.module].children.push({
                        title: p.name,
                        key: `r${role.id}-p${p.id}`, // Key permission: r1-p1
                        isLeaf: true
                    });
                    return acc;
                }, {})
            )
        }));
    }, [allRole, per]);

// Lấy tất cả các ID quyền đã có của TẤT CẢ các role để hiển thị trạng thái check ban đầu
    const allCheckedKeys = useMemo(() => {
        let keys = [];
        allRole.forEach(role => {
            role.permissions.forEach(p => {
                keys.push(`r${role.id}-p${p.id}`);
            });
        });
        return keys;
    }, [allRole]);
    const getPermissionChanges1 = (latestCheckedKeys) => {
        const changes = [];

        // Duyệt qua từng Role để so sánh độc lập
        allRole.forEach(role => {
            const roleId = String(role.id);
            const prefix = `r${roleId}-p`;

            // 1. Lấy danh sách ID quyền BAN ĐẦU của Role này (từ initialCheckedKeys)
            const originalIds = initialCheckedKeys
                .filter(k => k.startsWith(prefix))
                .map(k => k.split('-p')[1]); // Trả về mảng ID dạng string: ["1", "2"]
            // 2. Lấy danh sách ID quyền HIỆN TẠI của Role này (từ latestCheckedKeys)
            const currentIds = latestCheckedKeys
                .filter(k => k.startsWith(prefix))
                .map(k => k.split('-p')[1]);
            // LOGIC SO SÁNH:
            // Added: Có trong Current nhưng KHÔNG có trong Original
            const added = currentIds.filter(id => !originalIds.includes(id));
            // Removed: Có trong Original nhưng KHÔNG có trong Current
            const removed = originalIds.filter(id => !currentIds.includes(id));
            // Chỉ thêm vào mảng kết quả nếu thực sự có thay đổi
            if (added.length > 0 || removed.length > 0) {
                changes.push({
                    roleId: role.id,
                    added: added.map(Number),
                    removed: removed.map(Number)
                });
            }
        });

        return changes;
    };
    const getPermissionChanges = (latestCheckedKeys) => {
        const changes = [];
        allRole.forEach(role => {
            const roleId = String(role.id);
            const prefix = `r${roleId}-p`;

            // Lấy list ID hiện tại từ UI (chỉ lấy node lá - permission)
            const currentIds = latestCheckedKeys
                .filter(k => k.startsWith(prefix))
                .map(k => k.split('-p')[1]);

            // Lấy list ID gốc của Role này từ database/state
            const originalIds = role.permissions.map(p => String(p.id));

            const added = currentIds.filter(id => !originalIds.includes(id));
            const removed = originalIds.filter(id => !currentIds.includes(id));

            if (added.length > 0 || removed.length > 0) {
                changes.push({
                    roleId: role.id,
                    added: added.map(Number),
                    removed: removed.map(Number)
                });
            }
        });
        return changes;
    };
    const updateState1 = async (target: string,currentCheckedKeys: string[])=>{
        const changes = getPermissionChanges(currentCheckedKeys);
        if (changes.length === 0) {
            console.log("Không có thay đổi nào được thực hiện.");
            return;
        }
        const roleId = changes[0].roleId;
        const data = await requestApi('roles/role-per/' + roleId, { method: 'PATCH', body: JSON.stringify(changes[0]) });
        if(data?.statusCode && data.statusCode >= 400)
            messageApi.error({title:'Cập nhật thất bại',description: Array.isArray(data.message) ? data.message[0] : data.message,
                placement: 'bottomRight',});
        else if(data) {
            messageApi.success({
                title: 'Cập nhật thành công', description: 'Phân quyền cho vai trò đã được cập nhật trên hệ thống.',
                placement: 'bottomRight',
            });
        }
    }
    const updateState = async (targetKey: string, currentCheckedKeys: string[]) => {
        const changes = getPermissionChanges(currentCheckedKeys);

        // TRƯỜNG HỢP 1: Không có thay đổi nào về quyền (có thể chỉ click node cha rỗng)
        if (changes.length === 0) {
            console.warn("Không tìm thấy thay đổi về Permission.");
            return;
        }

        // TRƯỜNG HỢP 2: Có thay đổi
        // Tìm change khớp với Role của node vừa click (targetKey)
        // Giả sử targetKey có dạng "r1-mModule" hoặc "r1-p10" -> lấy được roleId là 1
        const match = targetKey.match(/r(\d+)/);
        const targetRoleId = match ? Number(match[1]) : null;

        // Tìm đúng phần thay đổi của Role đó
        const roleChange = changes.find(c => c.roleId === targetRoleId) || changes[0];

        try {
            const data = await requestApi(`roles/role-per/${roleChange.roleId}`, {
                method: 'PATCH',
                body: JSON.stringify(roleChange)
            });

            if (data?.statusCode >= 400) {
                messageApi.error({
                    title: 'Thất bại',
                    description: data.message,
                    placement: 'bottomRight',
                });
            } else {
                messageApi.success({
                    title: 'Thành công',
                    description: 'Đã cập nhật quyền hạn.',
                    placement: 'bottomRight',
                });
            }
        } catch (error) {
            console.error("Lỗi kết nối API:", error);
        }
    };
    const handleCreate = ()=>{
        if(user.role)
            console.log(user.sub)
        console.log(user.role)
    }
    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };
    const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    };
    return <>
        {contextHolder}
        {
            isLoading || treeData.length === 0
                ? <div>Đang tải...</div>
                : <div>
                    <Flex gap={'small'} wrap={false}>
                        <Typography.Title level={3}>{t('title')}</Typography.Title>
                        <Button type="primary" onClick={handleCreate}>{t('create')}</Button>
                        {/*ADMIN_PATHS.USER.CREATE()*/}
                    </Flex>
                    {/*<AdminBreadcrumb/>*/}
                    <><Tree
                        checkable
                        onSelect={onSelect}
                        onCheck={(checkedKeysValue, info) => {
                            // if (Array.isArray(checkedKeysValue)) {
                            //     setCheckedKeys(checkedKeysValue);
                            // } else {
                            //     setCheckedKeys(checkedKeysValue.checked);
                            // }
                            // const { checked, node } = info;
                            // const targetKey = node.key;
                            // updateState(targetKey);
                            // if (checked) {
                            //     // updateState(targetKey);
                            //     console.log("Bạn vừa tích THÊM quyền:", targetKey);
                            // } else {
                            //     console.log("Bạn vừa GỠ bỏ quyền:", targetKey);
                            // }
                            let latestKeys: string[] = [];

                            if (Array.isArray(checkedKeysValue)) {
                                latestKeys = checkedKeysValue as string[];
                            } else {
                                latestKeys = checkedKeysValue.checked as string[];
                            }

                            // 1. Cập nhật state để UI hiển thị (sẽ cập nhật ở lần render tới)
                            setCheckedKeys(latestKeys);

                            // 2. Truyền TRỰC TIẾP giá trị vừa lấy được vào hàm logic
                            const { node } = info;
                            updateState(node.key as string, latestKeys);
                        }}
                        checkedKeys={checkedKeys}
                        treeData={treeData}
                    /></>
                </div>
        }
    </>

};

export default App;