import React from 'react';
import TopNavBar from "./TopNavBar"
import { useGlobalContext } from '../../context/GlobalContext';
import { ClipLoader } from 'react-spinners';

const WithTopNavBar = ({ children }: { children: React.ReactNode }) => {
    const globalContext = useGlobalContext();
    return (
        <div style={{ height: 'calc(100vh - 20px)'}}>
            <TopNavBar />
            {
                globalContext.isLoading ?
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><ClipLoader /></div> :
                children
            }
        </div>
    )
}

export default WithTopNavBar;