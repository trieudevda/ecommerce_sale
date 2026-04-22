'use client'
import { notification, theme } from "antd";
import React from "react";

export default  function AdminLayout({children}: {
    children: React.ReactNode;
}) {
    const [messageApi, contextHolder] = notification.useNotification();
    return <div className={"m-auto"}>
            {contextHolder}
            {children}
    </div>
}