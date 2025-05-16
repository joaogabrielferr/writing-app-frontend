'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import style from "./secondary-sidebar.module.css";


export default function SecondarySidebar(){

    const [teste,setTeste] = useState(false);
    const innerAside = useRef<HTMLDivElement>(null);

    // Use useCallback to memoize the function so it doesn't trigger useEffect unnecessarily
    // if passed as a dependency (though not strictly needed with empty dependency array).
    const adjustSize = useCallback(() => {
        if (!innerAside.current) {
            console.log("Inner aside ref not available yet.");
            return; 
        }
        const banner = document.getElementById("__banner__");
        const tags = document.getElementById("__tags__");

        let offset = 80; // Base offset (header + margin)

        // It's 0 for elements with display: none.
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
        // Use a small delay if elements outside this component render slightly later.
        const initialTimeoutId = setTimeout(adjustSize, 50); // 50ms delay might help catch external element rendering

        //ResizeObserver to watch the banner and tags for size changes.
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
            clearTimeout(initialTimeoutId); // Clear the initial timeout if component unmounts quickly
            observer.disconnect();
            window.removeEventListener('resize', adjustSize); 
        };

    }, [adjustSize]);

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