
'use client'

import Link from "next/link";
import style from "./header.module.css";
import Button from "../button/button";
import { useEffect, useRef, useState } from "react";
import SearchBar from "../search-bar/search-bar";
import { useUser } from "@/context/auth-context";
import { LogOut, User } from "lucide-react";

interface Props{
    location: 'main' | 'editor' | 'other'
    publish?: () => void
}

export default function Header({location,publish} : Props){

    const {user,isAuthenticated,logout,isLoading} = useUser();
    
    console.log(location);
    const [isMobile,setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 1250);

      const [open, setOpen] = useState(false);
      const menuRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        function adjust(){
            setIsMobile(typeof window !== 'undefined' && window.innerWidth < 1250);
            
        }
        window.addEventListener("resize",adjust);
    
        return () =>{
          window.removeEventListener("resize",adjust);
        }
    
      },[location]);
    


   
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
    

    return (
        <header id = "header" className = {`${style.header} ${(location !== 'editor') ? style.border : ''}`}>
            <div className = {style.inner_header}>
                <div className = {style.logo_container}>
                    <Link href="/" className = {style.logo}>
                        <span>E</span>
                        SCRITR
                    </Link>
                </div>
                {/* {
                    (location === 'main' && !isMobile) && <SearchBar></SearchBar>
                } */}
                <div className = {style.right}>
                    {
                        ((location === 'main'  || location === 'other') && isAuthenticated) && <Button text={"Write"} link="/write" />
                    }
                    {
                        (location === 'editor' && isAuthenticated) && <Button text = {'Publish'} click={publish} />
                    }

                    {
                        isLoading ? <>loading</> : (
                                <>
                                    {
                                        !isAuthenticated ? <Link href={"/register"}><Button bgColor="purple" fontColor="white" text = "Sign up"/></Link> : null
                                    }
                                    {
                                        !isAuthenticated ? <Link href={"/login"}><Button text = "Sign in"/></Link> : null
                                    }
                                </>
                        )
                    }
                    
                        
                    

                    
                    <div className = {style.avatarContainer} ref={menuRef}>
                        {user?.id ?
                            
                            (
                                user?.avatar ?
                                <img
                                 src={user.avatar}
                                 alt="User Avatar"
                                 onClick={() => setOpen(prev => !prev)}
                                 />
                                 : <div onClick={() => setOpen(prev => !prev)} className = {style.avatar_no_picture}>{user?.username?.[0]?.toLocaleUpperCase()}</div>

                            )
                            : <div className = {style.avatarPlaceholder}></div>
                        }
                        {(open && isAuthenticated) && (
                        <div className={style.dropdown}>
                            {
                                user?.avatar ?
                                <img
                                 src={user.avatar}
                                 alt="User Avatar"
                                 />
                                 : <div className = {style.avatar_no_picture_large}>{user?.username?.[0]?.toLocaleUpperCase()}</div>

                            }
                            <Link className = {style.link} href={`/${user!.username}`}>
                                <button className={style.item}><User size = {14}/>Profile</button>
                            </Link>
                            <button onClick = {logout} className={style.item}> <LogOut size = {14}/> Logout</button>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );

}