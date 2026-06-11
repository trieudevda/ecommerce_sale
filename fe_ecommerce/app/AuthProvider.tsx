'use client';
import {useDispatch, useSelector} from "react-redux";
import {setAppLoading, setLogout, setUser} from "@/src/redux/slices/authSlice";
import {checkAuthToken} from "@/components/api/be.api";
import React from "react";
import {RootState} from "@/src/redux/store";
import {useRouter} from "next/navigation";
import {ADMIN_PATHS} from "@/src/path";

export function AuthProvider({children}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);
    React.useEffect(() => {
        const initAuth = async () => {
            try {
                if(user) router.push(ADMIN_PATHS.USER.LIST());
                dispatch(setAppLoading(true));
                const response = await checkAuthToken();
                if (response && response?.statusCode >= 400) {
                    dispatch(setLogout());
                    router.push(ADMIN_PATHS.AUTH.LOGIN());
                } else {
                    dispatch(setUser(response));
                }
            } catch (error) {
                dispatch(setLogout());
                router.push(ADMIN_PATHS.AUTH.LOGIN());
            } finally {
                dispatch(setAppLoading(false));
            }
        };
        if(!isAuthenticated) initAuth();
    },[dispatch]);
    return <>{children}</>;
}