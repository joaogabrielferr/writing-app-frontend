'use client'

import style from "./profile-sidebar.module.css";


export default function ProfileSidebar(){

    

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
                    </div>
                </div>    
            </div>
        </aside>
    );

}

