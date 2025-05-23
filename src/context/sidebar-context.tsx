'use client'

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";


interface Props{
    isSidebarMobile:boolean,
    isToggleVisible:boolean,
    setIsToggleVisible:Dispatch<SetStateAction<boolean>>
}

const SidebarContext = createContext<Props | undefined>(undefined);

export const SidebarProvider = ({children} : {children:ReactNode}) =>{

    const [isMobile,setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 1200);
    const [isToggleVisible,setIsToggleVisible] = useState(false);

    useEffect(()=>{
        function adjust(){
            setIsMobile(typeof window !== 'undefined' && window.innerWidth < 1200);
        }

        window.addEventListener("resize",adjust);
    
        return () =>{
            window.removeEventListener("resize",adjust);
        }
    
        },[]);

    useEffect(()=>setIsToggleVisible(false),[isMobile]);


    return <SidebarContext.Provider value = {{isSidebarMobile:isMobile,isToggleVisible,setIsToggleVisible}}>
        {children}
    </SidebarContext.Provider>

}

export const useSidebar = (): Props => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar not defined');
  }
  return context;
};