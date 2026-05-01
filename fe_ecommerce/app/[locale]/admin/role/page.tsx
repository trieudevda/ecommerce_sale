"use client"
import React from 'react';
import {
    LoadingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import {
    Breadcrumb, Button, Flex,
    notification, Spin,
    Table,
    TableProps,
    theme, Typography,
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
import {getListRoleColumns} from "@/components/templates/admin/role/listColumn";


const App: React.FC = () => {
    const router = useRouter();
    const t = useTranslations("Role.List");
    const tTable = useTranslations("Role.Table");
    const [role,setRole] = React.useState([])
    const [messageApi, contextHolder] = notification.useNotification();
    const [isLoading, setIsLoading] = React.useState(true);
    const { user, isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);
    const onChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    React.useEffect(() => {

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await requestApi('roles/find-all', { method: 'GET' });
                if( data.statusCode === 403 ){
                    messageApi.error({title:'Quyền',description: "Bạn không có quyền thực hiện việc này!",
                        placement: 'bottomRight',});
                    return;
                }
                setRole(data.data);
            } catch (error) {
                messageApi.error({ title: 'Lỗi', description: 'Có lỗi xảy ra khi lưu dữ liệu' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    },[]);
    const handleEdit = (id: {id: string})=>{
        router.push(`/admin/role/edit/${id}`);
    }
    const handleDelete = async (id: string)=>{
        const data = await requestApi('roles/' + id, { method: 'DELETE' });
        if(data?.statusCode && data.statusCode >= 400)
            messageApi.error({title:'Xóa vai trò',description: Array.isArray(data.message) ? data.message[0] : data.message,
                placement: 'bottomRight',});
        else if(data) {
            messageApi.success({
                title: 'Xóa vai trò', description: 'Xóa vai trò thành công.',
                placement: 'bottomRight',
            });
            setRole((prevData) => prevData.filter(role => role.id !== id));
        }
    }
    const handleCreate = ()=>{
        router.push(ADMIN_PATHS.ROLE.CREATE());
    }
    const columns = getListRoleColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        t: tTable
    });
    if(!isAuthenticated) return <><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /></>
    return <>
        {contextHolder}
        {
            isLoading
                ? <div>Đang tải...</div>
                : <div>
                    <Flex gap={'small'} wrap={false}>
                        <Typography.Title level={3}>{t('title')}</Typography.Title>
                        {
                            user.role.slug === 'superAdmin'
                            ? <Button type="primary" onClick={handleCreate}>{t('create')}</Button>
                                : <></>
                        }
                    </Flex>
                    <AdminBreadcrumb/>
                    <Table rowKey="id" columns={columns} dataSource={role} onChange={onChange}/>
                </div>
        }
    </>

};

export default App;