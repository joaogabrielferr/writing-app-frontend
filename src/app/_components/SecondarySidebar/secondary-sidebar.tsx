'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import style from "./secondary-sidebar.module.css";


export default function SecondarySidebar(){

    const [teste] = useState(false);
    const innerAside = useRef<HTMLDivElement>(null);


    const adjustSize = useCallback(() => {
        if (!innerAside.current) {
            console.log("Inner aside ref not available yet.");
            return; 
        }
        const banner = document.getElementById("__banner__");
        const tags = document.getElementById("__tags__");

        let offset = 80; // Base offset (header + margin)

        if (banner && banner.offsetHeight > 0) {
            offset += banner.offsetHeight;
            // console.log(`Banner found, height: ${banner.offsetHeight}`);
        }
        if (tags && tags.offsetHeight > 0) {
            offset += tags.offsetHeight;
            // console.log(`Tags found, height: ${tags.offsetHeight}`);
        }

        console.log(`Adjusting sidebar height. Total offset: ${offset}px`);
        innerAside.current.style.height = `calc(100vh - ${offset}px)`;

    }, []);

    useEffect(() => {

        // Run adjustSize once after the component mounts and DOM elements are likely ready.
        const initialTimeoutId = setTimeout(adjustSize, 50); 

        const observer = new ResizeObserver(adjustSize);

        const bannerElement = document.getElementById("__banner__");
        const tagsElement = document.getElementById("__tags__");

        if (bannerElement) {
            observer.observe(bannerElement);
        }
        if (tagsElement) {
            observer.observe(tagsElement);
        }

        window.addEventListener('resize', adjustSize);

        return () => {
            clearTimeout(initialTimeoutId); 
            observer.disconnect();
            window.removeEventListener('resize', adjustSize); 
        };

    }, [adjustSize]);


    if(!teste){
        return <LoadingSkeleton/>
    }

    return (
        <aside className = {style.aside}>
            <div className = {style.inner_aside} ref = {innerAside}>
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