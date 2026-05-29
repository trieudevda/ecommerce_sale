import {Spin} from "antd";
import React from "react";

const LoadingPage = () => <div
    style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }}
>
    <Spin size="large" />
</div>
export default  LoadingPage