'use client'

import style from "./sidebar.module.css";

export default function Sidebar(){

    const a : number[]= [];
    for(let i = 0;i<10;i++)a.push(i);
    return (
        <aside className = {style.aside}>
            <div className = {style.content}>
                {
                    a.map((i,idx) => <div key = {i + idx} className = {style.skeleton_preview}></div>)
                }
            </div>
        </aside>
    );

}