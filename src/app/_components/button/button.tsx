import Link from 'next/link';
import style from './button.module.css';
import React, { PropsWithChildren } from 'react';
import { LucideIcon } from 'lucide-react';

interface Props{
    link?:string;
    fontColor?:string;
    bgColor?:string;
    border?:string;
    click?:() => void;
    Icon?: LucideIcon;
    customStyle?:{[key:string]:string},
    children:React.ReactNode | undefined;
}

export default function Button({link,click,fontColor,bgColor,Icon,children,border,customStyle} : PropsWithChildren<Props>){
    const commonConfig = {
        color: fontColor === "purple" ? 'var(--purple)' : fontColor,
        backgroundColor: bgColor === "purple" ? 'var(--purple)' : bgColor,
        border: border ? `1px solid ${border === "purple" ? 'var(--purple)' : border}` : 'none'
    };

    if(link){
        return <button className = {style.button}>
            <Link href={link}>{Icon && <Icon/>}
            {children}</Link>
        </button>
    }

    return <button 
    className={style.button}
     onClick={click || undefined}
     style={commonConfig && customStyle}
     >{Icon && <Icon size={16} />}{children}</button>

}