
'use client'

import Link from "next/link";
import style from "./header.module.css";
import Button from "../button/button";
import { useEffect, useState } from "react";
import SearchBar from "../search-bar/search-bar";
import { useUser } from "@/context/auth-context";

interface Props{
    location: 'main' | 'editor' | 'other'
    publish?: () => void
}

export default function Header({location,publish} : Props){

    const {user,isAuthenticated,logout,isLoading} = useUser();
    
    console.log(user,isAuthenticated);

    console.log(location);
    const [isMobile,setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 1250);
    const [scrolled,setScrolled] = useState(false);

    useEffect(()=>{
        function adjust(){
            setIsMobile(typeof window !== 'undefined' && window.innerWidth < 1250);
            
        }
        window.addEventListener("resize",adjust);
    
        return () =>{
          window.removeEventListener("resize",adjust);
        }
    
      },[location]);
    

    useEffect(()=>{
        function addHeaderBackground(){
            if(location !== 'editor'){
                if(window.scrollY > 10 && !scrolled){
                    setScrolled(true);
                }
                if(window.scrollY <= 10 && scrolled){
                    setScrolled(false);
                }
            }
        }
                
        window.addEventListener('scroll',addHeaderBackground);
        
        return () =>{
            window.removeEventListener('scroll',addHeaderBackground);
        }

        }
        ,[scrolled,location]);
    

    return (
        <header id = "header" className = {`${style.header} ${scrolled ? style.scrolled : ''}`}>
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
                <div>
                    isAuthenticated: {String(isAuthenticated)}
                </div>
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

                                    {
                                        isAuthenticated && <Button click={logout} text = "Sign out"/>
                                    }
                                </>
                        )
                    }
                    
                        
                    


                    <div className = {style.avatar}></div>
                </div>
            </div>
        </header>
    );

}