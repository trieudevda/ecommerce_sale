'use client'
import {notification} from "antd";
import React from "react";
import {checkAuthToken} from "@/components/api/be.api";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import {setLogout, setUser} from "@/src/redux/slices/authSlice";
import {useRouter} from "next/navigation";
import {ADMIN_PATHS} from "@/src/path";
import {useTranslations} from "use-intl";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = notification.useNotification();
    const { isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const tMess = useTranslations("Message");
    React.useEffect(() => {
        if(!isAuthenticated){
            const fetchData = async () => {
                try {
                   const user = await checkAuthToken();
                    if (user && user.statusCode >= 400){
                        dispatch(setLogout());
                    }
                    else{
                        dispatch(setUser(user));
                        router.push(ADMIN_PATHS.PERMISSION.LIST());
                    }
                } catch (error) {
                    messageApi.error({ title: tMess('error'), description: tMess('Message.An_error_occurred_while_saving_the_data') });
                } finally {
                }
            };
            fetchData();
        }else{
            router.push(ADMIN_PATHS.USER.LIST());
        }
    },[]);
    if(isAppLoading) return <div>Đang tải...</div>;
    return <>
        {contextHolder}
        {children}
    </>
}