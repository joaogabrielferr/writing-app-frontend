'use client'

import { PropsWithChildren, useEffect } from "react";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import styles from "./shell.module.css";
import { useSidebar } from "@/context/sidebar-context";

interface Props{
    location:'main' | 'editor' | 'other' | 'article'
}

export default function Shell({children,location} : PropsWithChildren<Props>){

    const {isSidebarMobile,isToggleVisible,setIsToggleVisible} = useSidebar();
    
    // useEffect(()=>{
    //     if(location == "article"){
    //         setIsToggleVisible(false);
    //     }
    // },[location,setIsToggleVisible]);

    console.log(isToggleVisible,isSidebarMobile);
    return <>
            <Header location={location}/>
            <div className = {styles.mainPageHome}>
                <Sidebar/>
                <div className = {`${styles.mainPageMainContainer} ${ isToggleVisible && !isSidebarMobile ? styles.addMarginSidebar : '' } `}>
                    <main className = {styles.mainPageMain}>
                        {children}

                    </main>
                </div>
            </div>
           </>

}