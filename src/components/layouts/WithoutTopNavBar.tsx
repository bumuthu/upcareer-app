import React from 'react';
import { ClipLoader } from 'react-spinners';
import { useGlobalContext } from '../../context/GlobalContext';

const WithoutTopNavBar = ({ children }: { children: React.ReactNode }) => {
    const globalContext = useGlobalContext();
    return (
        <div style={{ height: 'calc(100vh - 20px)'}}>
            {
                globalContext.isLoading ?
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><ClipLoader /></div> :
                children
            }
        </div>
    )
}

export default WithoutTopNavBar;