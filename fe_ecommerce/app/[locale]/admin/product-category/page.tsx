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
import {useRouter, useSearchParams} from 'next/navigation';
import {useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import AdminBreadcrumb from "@/components/templates/admin/breadcrumb/breadcrumb";
import {useTranslations} from "use-intl";
import {ADMIN_PATHS} from "@/src/path";
import { getListCategoryColumns } from '@/components/templates/admin/category/listColumn';
import LoadingAdmin from "@/components/templates/admin/loading/loading-admin";


const App: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isTree = searchParams.get('isTree');
    const t = useTranslations("Product.Category");
    const [cate,setCate] = React.useState([])
    const [messageApi, contextHolder] = notification.useNotification();
    const [isLoading, setIsLoading] = React.useState(true);
    const { user } = useSelector((state: RootState) => state.auth);
    const onChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
    };
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await requestApi('category/find-all', { method: 'GET' });
                if( data.statusCode === 403 ){
                    messageApi.error({title:'Danh mục',description: "Bạn không có quyền thực hiện việc này!",
                        placement: 'bottomRight',});
                    return;
                }
                setCate(data.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    },[]);
    const handleCreate = ()=>{
        router.push(ADMIN_PATHS.PRODUCT.CATEGORY.CREATE());
    }
    const handleEdit = (id: {id: string})=>{
        router.push(ADMIN_PATHS.PRODUCT.CATEGORY.EDIT(id));
    }
    const handleDelete = async (id: string)=>{
        // const data = await requestApi('user/' + id, { method: 'DELETE' });
        // if(data?.statusCode && data.statusCode >= 400)
        //     messageApi.error({title:'Xóa người dùng',description: Array.isArray(data.message) ? data.message[0] : data.message,
        //     placement: 'bottomRight',});
        // else if(data) {
        //     messageApi.success({
        //         title: 'Xóa người dùng', description: 'Dữ liệu người dùng đã được cập nhật trên hệ thống.',
        //         placement: 'bottomRight',
        //     });
        //     setUser((prevData) => prevData.filter(user => user.id !== id));
        // }
    }
    const columns = getListCategoryColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        t: t
    });
    return <>
        {contextHolder}
        {
        isLoading
                ? LoadingAdmin
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
                {
                    isTree
                    ? <Table rowKey="id" columns={columns} dataSource={cate} onChange={onChange} expandable={{
                            childrenColumnName: 'children',
                        }}/>
                    : <Table rowKey="id" columns={columns} dataSource={cate} onChange={onChange}/>
                }

            </div>
        }
        </>

};

export default App;