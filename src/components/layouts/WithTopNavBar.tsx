import React from 'react';
import TopNavBar from "./TopNavBar"

const WithTopNavBar = ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={{ height: 'calc(100vh - 20px)'}}>
            <TopNavBar />
            {children}
        </div>
    )
}

export default WithTopNavBar;