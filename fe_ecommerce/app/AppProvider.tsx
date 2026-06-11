'use client';
import {store} from "@/src/redux/store";
import {Provider} from "react-redux";
import React from "react";

export function AppProvider({ children }:{children:React.ReactNode}) {
    return <Provider store={store}>{children}</Provider>;
}