'use client';
import {Provider, useDispatch, useSelector} from "react-redux";
import {setAppLoading, setLogout, setUser} from "@/src/redux/slices/authSlice";
import {checkAuthToken, requestApi} from "@/components/api/be.api";
import React from "react";
import {RootState} from "@/src/redux/store";
import {useRouter} from "next/navigation";

export function AuthProvider({ children }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);
    React.useEffect(() => {
        const initAuth = async () => {
            try {
                dispatch(setAppLoading(true));
                const response = await checkAuthToken();
                if (response && response?.statusCode >= 400) {
                    dispatch(setLogout());
                    router.push('/login/admin');
                } else {
                    dispatch(setUser(response));
                }
            } catch (error) {
                dispatch(setLogout());
                router.push('/login/admin');
            } finally {
                dispatch(setAppLoading(false));
            }
        };
        if(!isAuthenticated) initAuth();
    },[dispatch]);
    return <>{children}</>;
}