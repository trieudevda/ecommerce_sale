"use client"
import React from 'react';
import {Button, Flex, notification, Table, TableProps, Typography,} from 'antd';
import {requestApi} from "@/components/api/be.api";
import {useRouter} from 'next/navigation';
import {useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import AdminBreadcrumb from "@/components/templates/admin/breadcrumb/breadcrumb";
import {useTranslations} from "use-intl";
import {ADMIN_PATHS} from "@/src/path";
import {getListProductColumns} from "@/components/templates/admin/product/listColumn";


const App: React.FC = () => {
    const router = useRouter();
    const t = useTranslations("Product.List");
    const tMess = useTranslations("Message");
    const tTable = useTranslations("Product.Table");
    const [product,setProduct] = React.useState([])
    const [messageApi, contextHolder] = notification.useNotification();
    const [isLoading, setIsLoading] = React.useState(true);
    const { user } = useSelector((state: RootState) => state.auth);
    const onChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data:any = await requestApi('product/find-all', { method: 'GET' });
                if( data.statusCode === 403 ){
                    messageApi.error({title:tMess('Title.role'),description: tMess('Description.You_are_not_authorized_to_do_this'),
                        placement: 'bottomRight',});
                    return;
                }
                setProduct(data.data);
            } catch (error) {
                messageApi.error({ title: tMess('Title.error'), description: tMess('Description.An_error_occurred_while_saving_the_data') });
            } finally {
                setIsLoading(false);
            }
        };
        // fetchData();
    },[]);
    const handleEdit = (slug: string)=>{
        router.push(ADMIN_PATHS.PRODUCT.EDIT(slug));
    }
    const handleDelete = async (slug: string)=>{
        const data:any = await requestApi('product/' + slug, { method: 'DELETE' });
        if(data?.statusCode && data.statusCode >= 400)
            messageApi.error({title:tMess('Title.info'),description: Array.isArray(data.message) ? data.message[0] : data.message,
                placement: 'bottomRight',});
        else if(data) {
            messageApi.success({
                title: tMess('Title.info'), description: tMess('Description.data_updated_successfully'),
                placement: 'bottomRight',
            });
            setProduct((prevData) => prevData.filter(p => p.slug !== slug));
        }
    }
    const handleCreate = ()=>{
        router.push(ADMIN_PATHS.PRODUCT.CREATE());
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
                    <Table rowKey="id" columns={columns} dataSource={product} onChange={onChange}/>
                </div>
        }
    </>

};

export default App;