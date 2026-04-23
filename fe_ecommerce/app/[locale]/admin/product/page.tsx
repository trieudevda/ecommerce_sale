"use client"
import React from 'react';
import {
     Button, Flex,
    notification,
    Table,
    TableProps,
     Typography,
} from 'antd';
import {requestApi} from "@/components/api/be.api";
import {getListUserColumns} from "@/components/templates/admin/user/listColumn";
import { useRouter } from 'next/navigation';
import {useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import AdminBreadcrumb from "@/components/templates/admin/breadcrumb/breadcrumb";
import {useTranslations} from "use-intl";
import {ADMIN_PATHS} from "@/src/path";
import {getListProductColumns} from "@/components/templates/admin/product/listColumn";


const App: React.FC = () => {
    const router = useRouter();
    const t = useTranslations("Product.List");
    const tTable = useTranslations("Product.Table");
    const [user1,setUser] = React.useState([])
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
                const data = await requestApi('product/find-all', { method: 'GET' });
                if( data.statusCode === 403 ){
                    messageApi.error({title:'Quyền',description: "Bạn không có quyền thực hiện việc này!",
                        placement: 'bottomRight',});
                    return;
                }
                setUser(data.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    },[]);
    const handleEdit = (id: {id: string})=>{
        router.push(`/admin/user/edit/${id}`);
    }
    const handleDelete = async (id: string)=>{
        const data = await requestApi('user/' + id, { method: 'DELETE' });
        if(data?.statusCode && data.statusCode >= 400)
            messageApi.error({title:'Xóa người dùng',description: Array.isArray(data.message) ? data.message[0] : data.message,
                placement: 'bottomRight',});
        else if(data) {
            messageApi.success({
                title: 'Xóa người dùng', description: 'Dữ liệu người dùng đã được cập nhật trên hệ thống.',
                placement: 'bottomRight',
            });
            setUser((prevData) => prevData.filter(user => user.id !== id));
        }
    }
    const handleCreate = ()=>{
        router.push(ADMIN_PATHS.USER.CREATE());
    }
    const columns = getListProductColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        t: tTable
    });
    return <>
        {contextHolder}
        {
            isLoading
                ? <div>Đang tải...</div>
                : <div>
                    <Flex gap={'small'} wrap={false}>
                        <Typography.Title level={3}>{t('title')}</Typography.Title>
                        {
                            user.role.slug !== 'user' && user.role.slug !== 'guest'
                                ? <Button type="primary" onClick={handleCreate}>{t('create')}</Button>
                                : <></>
                        }
                    </Flex>
                    <AdminBreadcrumb/>
                    <Table rowKey="id" columns={columns} dataSource={user1} onChange={onChange}/>
                </div>
        }
    </>

};

export default App;