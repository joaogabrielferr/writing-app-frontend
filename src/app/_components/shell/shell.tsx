'use client'

import { PropsWithChildren } from "react";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import styles from "./shell.module.css";

export default function Shell({children} : PropsWithChildren){

    return <>
            <Header location="main"/>
            <div className = {styles.mainPageHome}>
                <Sidebar/>
                <div className = {styles.mainPageMainContainer}>
                    <main className = {styles.mainPageMain}>
                        {children}

                    </main>
                </div>
            </div>
           </>

}