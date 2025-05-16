'use client'

import { House, ScrollText, Search, ShieldCheck, Users } from "lucide-react";
import style from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar(){
    const path = usePathname();
    const [isMobile,setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 1250);

    useEffect(()=>{
        function adjust(){
          setIsMobile(typeof window !== 'undefined' && window.innerWidth < 1250);
        }

        window.addEventListener("resize",adjust);

    
        return () =>{
          window.removeEventListener("resize",adjust);
        }
    
      },[]);
    console.log(path);
    const a : number[]= [];
    for(let i = 0;i<20;i++)a.push(i);
    return (
        <aside className = {style.aside}>
            <div className = {style.content}>
                <div className = {style.buttons}>
                    <button className = {`${style.button} ${path === '/' ? style.selected : ''}`}>
                        <span><House /></span>
                        {!isMobile && <span>Home</span>
                        }
                    </button>
                    <button className = {`${style.button} ${path === '/premium' ? style.selected : ''}`}>
                        <span><ShieldCheck /></span>
                        {!isMobile && <span>Premium</span>
                        }
                    </button>
                    <button className = {`${style.button} ${path === '/lists' ? style.selected : ''}`}>
                        <span><ScrollText /></span>
                        {!isMobile && <span>Lists</span>
                        }
                    </button>
                    <button className = {`${style.button} ${path === '/search' ? style.selected : ''}`}>
                        <span><Search /></span>
                        {!isMobile && <span>Search</span>
                        }
                    </button>
                    <button className = {`${style.button} ${path === '/communities' ? style.selected : ''}`}>
                        <span><Users /></span>
                        {!isMobile && <span>Communities</span>
                        }
                    </button>
                </div>
                {
                    a.map((i,idx) => <div key = {i + idx} className = {style.skeleton_preview}></div>)
                }
            </div>
        </aside>
    );

}