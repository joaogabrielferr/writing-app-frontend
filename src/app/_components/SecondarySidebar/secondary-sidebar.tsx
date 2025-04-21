'use client'

import { useEffect, useState } from "react";
import style from "./secondary-sidebar.module.css";


export default function SecondarySidebar(){

    const [teste,setTeste] = useState(false);
    

    useEffect(()=>{
        console.log("sidebar loaded!");
        setTimeout(()=>{
            setTeste(true);
        },2000);
 

    },[]);

    if(!teste){
        return <LoadingSkeleton/>
    }

    return (
        <aside className = {style.aside}>
            <div className = {style.inner_aside}>
                <div className = {style.content}>
                    <div className = {style.inner_content}>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    <div className = {style.skeleton}></div>
                    </div>
                </div>
                
            </div>
        </aside>
    );

}

function LoadingSkeleton(){
    return (
        <div className = {style.inner_aside}>
            <div className = {style.content}>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
            </div>
        </div>
    );
}