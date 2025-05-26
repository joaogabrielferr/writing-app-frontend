'use client'

import { Bookmark, House, Search, ShieldCheck, User, Users } from "lucide-react";
import style from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "../button/button";
import { useSidebar } from "@/context/sidebar-context";
import { ReactNode } from "react";
import { useUser } from "@/context/auth-context";

export default function Sidebar(){
    const path = usePathname();
    
    const {user,isAuthenticated} = useUser();

    // const [isMobile,setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 1200);

    // useEffect(()=>{
    //     function adjust(){
    //       setIsMobile(typeof window !== 'undefined' && window.innerWidth < 1200);
    //     }

    //     window.addEventListener("resize",adjust);

    
    //     return () =>{
    //       window.removeEventListener("resize",adjust);
    //     }
    
    //   },[]);

    const a : number[]= [];
    for(let i = 0;i<20;i++)a.push(i);
    return (
        <SidebarShell>
            <div className = {style.buttons}>
                <button className = {`${style.button} ${path === '/' ? style.selected : ''}`}>
                    <span><House /></span>
                    <span>Home</span>
                </button>
                <button className = {`${style.button} ${path === '/premium' ? style.selected : ''}`}>
                    <span><ShieldCheck /></span>
                    <span>Premium</span>
                </button>
                <button className = {`${style.button} ${path === '/bookmarks' ? style.selected : ''}`}>
                    <span><Bookmark /></span>
                    <span>Bookmarks</span>
                </button>
                <button className = {`${style.button} ${path === '/search' ? style.selected : ''}`}>
                    <span><Search /></span>
                    <span>Search</span>
                </button>
                <button className = {`${style.button} ${path === '/communities' ? style.selected : ''}`}>
                    <span><Users /></span>
                    <span>Communities</span>
                </button>
                {
                    isAuthenticated && user?.username &&
                    (
                        <Link href={`/${user.username}`}>
                        <button className = {`${style.button} ${path === `/${user.username}` ? style.selected : ''}`}>
                            <span><User /></span>
                            <span>Profile</span>
                        </button>
                        </Link>
                    )
                }
                <Link href = {"/write"}>
                        <Button customStyle={{width:"100%",paddingTop:"1.2rem",paddingBottom:"1.2rem",marginTop:"20px"}}>Write</Button>
                </Link>
            </div>
            {/* {

                    a.map((i,idx) => <div key = {i + idx} className = {style.skeleton_preview}></div>)
                } */}
            </SidebarShell>
    );

}

function SidebarShell({children}:{children:ReactNode}){

    const {isSidebarMobile,isToggleVisible} = useSidebar();

    const showMobileSidebar = isSidebarMobile && isToggleVisible;
    const showNormalSidebar = !isSidebarMobile &&  isToggleVisible;

    if(showNormalSidebar){
        return (
            <aside className = {`${style.aside}`}>
                <div className = {style.content}>
                    {children}
                </div>
                </aside>
        );
    }else if(showMobileSidebar){
        return (
            <aside className = {style.sidebarMobile}>
                <div className = {style.content}>
                    {children}
                </div>
            </aside>
        )
    }

    return null;



}