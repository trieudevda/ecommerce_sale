'use client';
import {store} from "@/src/redux/store";
import {Provider, useDispatch} from "react-redux";
import React from "react";

export function AppProvider({ children }) {
    return <Provider store={store}>{children}</Provider>;
}