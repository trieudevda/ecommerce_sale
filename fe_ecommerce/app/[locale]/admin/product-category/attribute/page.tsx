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
import {getListCategoryAttributeColumns} from "@/components/templates/admin/category-attribute/listColumn";
import LoadingPage from "@/src/custom/loading-page/loading-page";


const App: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    // const isTree = searchParams.get('isTree');
    const t = useTranslations("Product.Category.Attribute");
    const [attr,setAttr] = React.useState([])
    const [messageApi, contextHolder] = notification.useNotification();
    const [isLoading, setIsLoading] = React.useState(true);
    const tMess = useTranslations("Message");
    const { user } = useSelector((state: RootState) => state.auth);
    const onChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
    };
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await requestApi('category-attribute/find-all', { method: 'GET' });
                if( data.statusCode === 403 ){
                    messageApi.error({title:tMess('Title.error'),description: tMess('Description.You_are_not_authorized_to_do_this'),
                        placement: 'bottomRight',});
                    return;
                }
                setAttr(data.data);
            } catch (error) {
                messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    },[]);
    const handleCreate = ()=>{
        router.push(ADMIN_PATHS.PRODUCT.CATEGORY.ATTRIBUTE.CREATE());
    }
    const handleEdit = (slug: string)=>{
        router.push(ADMIN_PATHS.PRODUCT.CATEGORY.ATTRIBUTE.EDIT(slug));
    }
    const handleDelete = async (slug: string)=>{
        const data = await requestApi('category-attribute/'+slug , { method: 'DELETE' });
        if(data?.statusCode && data.statusCode >= 400)
            // messageApi.error({title:'Xóa thuộc tính',description: Array.isArray(data.message) ? data.message[0] : data.message,
            messageApi.error({title:tMess('Title.info'),description: tMess('Description.You_are_not_authorized_to_do_this'),
            placement: 'bottomRight',});
        else if(data) {
            messageApi.success({
                title: tMess('Title.info'), description: tMess('Description.data_update_successfully'),
                placement: 'bottomRight',
            });
            setAttr((prevData) => prevData.filter(attr => attr.slug !== slug));
        }
    }
    const columns = getListCategoryAttributeColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        t: t
    });
    if (isLoading) {
        return <LoadingPage />;
    }
    return <>
        {contextHolder}
        <div>
            <Flex gap={'small'} wrap={false}>
                <Typography.Title level={3}>{t('title')}</Typography.Title>
                {
                    user.role === 'superAdmin'
                        ? <Button type="primary" onClick={handleCreate}>{t('create')}</Button>
                        : <></>
                }
            </Flex>
            <AdminBreadcrumb/>
            <Table rowKey="id" columns={columns} dataSource={attr} onChange={onChange} expandable={{
                childrenColumnName: 'children',
            }}/>
        </div>
        </>

};

export default App;