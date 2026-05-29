"use client"
import React from 'react';
import {Button, Flex, notification, Table, TableProps, Typography,} from 'antd';
import {requestApi} from "@/components/api/be.api";
import {useRouter, useSearchParams} from 'next/navigation';
import {useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import AdminBreadcrumb from "@/components/templates/admin/breadcrumb/breadcrumb";
import {useTranslations} from "use-intl";
import {ADMIN_PATHS} from "@/src/path";
import {getListCategoryColumns} from '@/components/templates/admin/category/listColumn';
import LoadingAdmin from "@/components/templates/admin/loading/loading-admin";


const App: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isTree = searchParams.get('isTree') || false;
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
                const data = await requestApi('category/find-all', { method: 'GET',params:{isTree:isTree,isActive:true} });
                if( data.statusCode === 403 ){
                    messageApi.error({title:'Danh mục',description: "Bạn không có quyền thực hiện việc này!",
                        placement: 'bottomRight',});
                    return;
                }
                setCate(data.data);
            } catch (error) {
                messageApi.error({ title: 'Lỗi', description: 'Có lỗi xảy ra khi lưu dữ liệu' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    },[isTree]);
    const handleCreate = ()=>{
        router.push(ADMIN_PATHS.PRODUCT.CATEGORY.CREATE());
    }
    const handleEdit = (slug: {id: string})=>{
        router.push(ADMIN_PATHS.PRODUCT.CATEGORY.EDIT(slug));
    }
    const handleDelete = async (slug: string)=>{
        const data = await requestApi('category/'+slug, { method: 'DELETE' });
        if(data?.statusCode && data.statusCode >= 400)
            messageApi.error({title:'Xóa Danh mục',description: Array.isArray(data.message) ? data.message[0] : data.message,
            placement: 'bottomRight',});
        else if(data) {
            messageApi.success({
                title: 'Xóa Danh mục', description: 'Dữ liệu danh mục đã được cập nhật trên hệ thống.',
                placement: 'bottomRight',
            });
            setCate((prevData) => prevData.filter(cate => cate.slug !== slug));
        }
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
                        user.role === 'superAdmin'
                        ? <Button type="primary" onClick={handleCreate}>{t('create')}</Button>
                            : <></>
                    }
                </Flex>
                <AdminBreadcrumb/>
                <Table rowKey="id" columns={columns} dataSource={cate} onChange={onChange}/>

            </div>
        }
        </>

};

export default App;