'use client'
import React, {useEffect, useState} from 'react';
import {Card, Checkbox, ConfigProvider, notification, Tabs, TabsProps, Tree, Typography} from 'antd';
import {SettingOutlined} from '@ant-design/icons';
import {requestApi} from "@/components/api/be.api";
import {useTranslations} from "use-intl";
import LoadingPage from "@/src/custom/loading-page/loading-page";

const App: React.FC = () => {
    const t = useTranslations("Permission");
    const tMess = useTranslations("Message");
    const [allRole, setAllRole] = useState<any[]>([]);
    const [per, setPer] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [messageApi, contextHolder] = notification.useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rolesRes, perRes] = await Promise.all([
                    requestApi('roles/find-all-role', { method: 'GET' }),
                    requestApi('permissions/find-all', { method: 'GET' })
                ]);
                setAllRole(rolesRes);
                setPer(perRes.data);
            } catch (error) {
                messageApi.error({ title: tMess('Title.error'), description: tMess("Description.Unable_to_connect_to_the_server") });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [messageApi, tMess]);

    const updatePermission = async (roleId: number, added: number[], removed: number[]) => {
        try {
            await requestApi(`roles/role-per/${roleId}`, {
                method: 'PATCH',
                body: JSON.stringify({ roleId, added, removed })
            });
            messageApi.success({ title: tMess('Title.success'), description: tMess('Description.data_update_successfully') });
            // Refresh local state
            const rolesRes = await requestApi('roles/find-all-role', { method: 'GET' });
            setAllRole(rolesRes);
        } catch (e) {
            messageApi.error({ title: tMess('Title.fail'), description: tMess('Description.An_error_occurred_while_saving_the_data') });
        }
    };

    const tabItems = allRole.map((role: any) => {
        const rolePermissionIds = role.permissions.map((p: any) => p.id);
        const allPermissionIds = per.map((p: any) => p.id);
        const isFullAccess = rolePermissionIds.length === allPermissionIds.length && allPermissionIds.length > 0;

        return {
            key: role.id,
            label: role.name,
            children: (
                <div className="flex flex-col gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <Checkbox
                            checked={isFullAccess}
                            onChange={(e) => {
                                if (e.target.checked) updatePermission(role.id, allPermissionIds.filter(id => !rolePermissionIds.includes(id)), []);
                                else updatePermission(role.id, [], rolePermissionIds);
                            }}
                            className="font-bold text-blue-700"
                        >
                            {t('all_permissions') || 'Cấp tất cả quyền'}
                        </Checkbox>
                    </div>

                    <Tree
                        checkable
                        disabled={isFullAccess} // Khóa cây nếu đã chọn tất cả quyền
                        defaultExpandAll
                        checkedKeys={rolePermissionIds}
                        treeData={per.reduce((acc: any, p: any) => {
                            const module = acc.find((m: any) => m.key === p.module);
                            const newNode = { title: p.name, key: p.id };
                            if (module) module.children.push(newNode);
                            else acc.push({ title: t(p.module) || p.module, key: p.module, children: [newNode] });
                            return acc;
                        }, [])}
                        onCheck={(checkedKeys) => {
                            const newIds = (checkedKeys as number[]).filter(id => typeof id === 'number');
                            const added = newIds.filter(id => !rolePermissionIds.includes(id));
                            const removed = rolePermissionIds.filter((id: number) => !newIds.includes(id));
                            updatePermission(role.id, added, removed);
                        }}
                    />
                </div>
            )
        };
    });

    if (isLoading) return <LoadingPage />;

    return (
        <ConfigProvider theme={{ token: { borderRadius: 12 } }}>
            {contextHolder}
            <div className="p-6 max-w-5xl mx-auto">
                <Typography.Title level={2} className="!mb-6">
                    <SettingOutlined className="text-blue-600 mr-2" /> {t('title')}
                </Typography.Title>
                <Card className="shadow-sm rounded-2xl">
                    <Tabs tabPlacement={"left" as TabsProps['tabPlacement']} items={tabItems} className="min-h-[400px]" />
                </Card>
            </div>
        </ConfigProvider>
    );
};

export default App;
// "use client"
// import React, {useMemo, useState} from 'react';
// import {Flex, notification, TableProps, Tree, TreeProps, Typography,} from 'antd';
// import {requestApi} from "@/components/api/be.api";
// import {useRouter} from 'next/navigation';
// import {useSelector} from "react-redux";
// import {RootState} from "@/src/redux/store";
// import {useTranslations} from "use-intl";
// import {ADMIN_PATHS} from "@/src/path";
//
//
// const App: React.FC = () => {
//     const router = useRouter();
//     const t = useTranslations("Permission");
//     const tMess = useTranslations("Message");
//     const [allRole,setAllRole] = React.useState([])
//     const [per,setPer] = React.useState([])
//     const [messageApi, contextHolder] = notification.useNotification();
//     const [isLoading, setIsLoading] = React.useState(true);
//     const { user } = useSelector((state: RootState) => state.auth);
//     const onChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
//         console.log('params', pagination, filters, sorter, extra);
//     };
//     const [checkedKeys, setCheckedKeys] = useState([]);
//     React.useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setIsLoading(true);
//                 const data = await requestApi('roles/find-all-role', { method: 'GET' });
//                 if( data.statusCode === 403 ){
//                     messageApi.error({title:tMess('Title.permission'),description: tMess("Description.You_are_not_authorized_to_do_this"),
//                         placement: 'bottomRight',});
//                     setTimeout(()=>{router.push(ADMIN_PATHS.USER.LIST())},1000);
//                     return;
//                 }
//                 setAllRole(data);
//             } catch (error) {
//                 messageApi.error({ title: tMess('Title.error'), description: tMess("Description.An_error_occurred_while_saving_the_data") });
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         const fetchPer = async () => {
//             try {
//                 setIsLoading(true);
//                 const data = await requestApi('permissions/find-all', { method: 'GET' });
//                 if( data.statusCode === 403 ){
//                     messageApi.error({title:tMess('Title.role'),description: tMess("Description.You_are_not_authorized_to_do_this"),
//                         placement: 'bottomRight',});
//                     setTimeout(()=>{router.push(ADMIN_PATHS.USER.LIST())},1000);
//                     return;
//                 }
//                 setPer(data.data);
//             } catch (error) {
//                 messageApi.error({ title: tMess('Title.error'), description: tMess("Description.An_error_occurred_while_saving_the_data") });
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchData();
//         fetchPer();
//     },[]);
//     const initialCheckedKeys = useMemo(() => {
//         const keys = [];
//         allRole?.forEach(role => {
//             if (role.permissions) {
//                 role.permissions.forEach(p => {
//                     keys.push(`r${role.id}-p${p.id}`); // Phải khớp 100% với key ở trên
//                 });
//             }
//         });
//         return keys;
//     }, [allRole]);
//     React.useEffect(() => {
//         if (initialCheckedKeys.length > 0) {
//             setCheckedKeys(initialCheckedKeys);
//         }
//     }, [initialCheckedKeys]);
//     const buildFullTree = (roles, allPermissions) => {
//         return roles.map(role => {
//             // Tạo cấu trúc Module cho từng Role
//             const moduleMap = {};
//             allPermissions.forEach(p => {
//                 if (!moduleMap[p.module]) {
//                     moduleMap[p.module] = {
//                         title: p.module,
//                         key: `role-${role.id}-mod-${p.module}`,
//                         children: []
//                     };
//                 }
//                 // Kiểm tra xem Role này có quyền này không
//                 const hasPermission = role.permissions.some(rp => rp.id === p.id);
//                 moduleMap[p.module].children.push({
//                     title: p.name,
//                     key: `role-${role.id}-per-${p.id}`,
//                     checked: hasPermission, // Thuộc tính để nhận diện
//                     isLeaf: true
//                 });
//             });
//
//             return {
//                 title: role.name,
//                 key: `role-root-${role.id}`,
//                 children: Object.values(moduleMap)
//             };
//         });
//     };
//     const treeData = useMemo(() => {
//         if (!allRole.length || !per.length) return [];
//
//         return allRole.map((role) => ({
//             title: `Vai trò: ${role.name}`,
//             key: `r-${role.id}`, // Node gốc của từng Role
//             children: Object.values(
//                 per.reduce((acc, p) => {
//                     if (!acc[p.module]) {
//                         acc[p.module] = {
//                             title: p.module,
//                             key: `r${role.id}-m${p.module}`, // Key module phải gắn với roleId
//                             children: []
//                         };
//                     }
//                     acc[p.module].children.push({
//                         title: p.name,
//                         key: `r${role.id}-p${p.id}`, // Key permission: r1-p1
//                         isLeaf: true
//                     });
//                     return acc;
//                 }, {})
//             )
//         }));
//     }, [allRole, per]);
//     const getPermissionChanges = (latestCheckedKeys) => {
//         const changes = [];
//         allRole.forEach(role => {
//             const roleId = String(role.id);
//             const prefix = `r${roleId}-p`;
//
//             // Lấy list ID hiện tại từ UI (chỉ lấy node lá - permission)
//             const currentIds = latestCheckedKeys
//                 .filter(k => k.startsWith(prefix))
//                 .map(k => k.split('-p')[1]);
//
//             // Lấy list ID gốc của Role này từ database/state
//             const originalIds = role.permissions.map(p => String(p.id));
//
//             const added = currentIds.filter(id => !originalIds.includes(id));
//             const removed = originalIds.filter(id => !currentIds.includes(id));
//
//             if (added.length > 0 || removed.length > 0) {
//                 changes.push({
//                     roleId: role.id,
//                     added: added.map(Number),
//                     removed: removed.map(Number)
//                 });
//             }
//         });
//         return changes;
//     };
//     const updateState = async (targetKey: string, currentCheckedKeys: string[]) => {
//         const changes = getPermissionChanges(currentCheckedKeys);
//         if (changes.length === 0) {
//             // console.warn("Không tìm thấy thay đổi về Permission.");
//             return;
//         }
//         const match = targetKey.match(/r(\d+)/);
//         const targetRoleId = match ? Number(match[1]) : null;
//         // Tìm đúng phần thay đổi của Role đó
//         const roleChange = changes.find(c => c.roleId === targetRoleId) || changes[0];
//         try {
//             const data = await requestApi(`roles/role-per/${roleChange.roleId}`, {
//                 method: 'PATCH',
//                 body: JSON.stringify(roleChange)
//             });
//
//             if (data?.statusCode >= 400) {
//                 messageApi.error({
//                     title: tMess('Title.success'),
//                     description: data.message,
//                     placement: 'bottomRight',
//                 });
//             } else {
//                 messageApi.success({
//                     title: tMess('Title.fail'),
//                     description: tMess('Description.data_update_successfully'),
//                     placement: 'bottomRight',
//                 });
//             }
//         } catch (error) {
//             messageApi.error({
//                 title: tMess('Title.fail'),
//                 description:
//                     error?.message || tMess('Description.Unable_to_connect_to_the_server'),
//                 placement: 'bottomRight'
//             });
//         }
//     };
//     const handleCreate = ()=>{
//         if(user.role)
//             console.log(user.sub)
//         console.log(user.role)
//     }
//     const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
//         console.log('selected', selectedKeys, info);
//     };
//     const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
//         console.log('onCheck', checkedKeys, info);
//     };
//     return <>
//         {contextHolder}
//         {
//             isLoading || treeData.length === 0
//                 ? <div>Đang tải...</div>
//                 : <div>
//                     <Flex gap={'small'} wrap={false}>
//                         <Typography.Title level={3}>{t('title')}</Typography.Title>
//                     </Flex>
//                     {/*<AdminBreadcrumb/>*/}
//                     <><Tree
//                         checkable
//                         onSelect={onSelect}
//                         onCheck={(checkedKeysValue, info) => {
//                             let latestKeys: string[] = [];
//
//                             if (Array.isArray(checkedKeysValue)) {
//                                 latestKeys = checkedKeysValue as string[];
//                             } else {
//                                 latestKeys = checkedKeysValue.checked as string[];
//                             }
//                             setCheckedKeys(latestKeys);
//                             // 2. Truyền TRỰC TIẾP giá trị vừa lấy được vào hàm logic
//                             const { node } = info;
//                             updateState(node.key as string, latestKeys);
//                         }}
//                         checkedKeys={checkedKeys}
//                         treeData={treeData}
//                     /></>
//                 </div>
//         }
//     </>
//
// };
//
// export default App;