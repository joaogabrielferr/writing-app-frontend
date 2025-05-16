import Link from 'next/link';
import style from './button.module.css';
import React from 'react';
import { LucideIcon } from 'lucide-react';


interface Props{
    text?:string;
    link?:string;
    fontColor?:string;
    bgColor?:string;
    click?:() => void;
    Icon?: LucideIcon;
}

export default function Button({text,link,click,fontColor,bgColor,Icon} : Props){
    const customStyle = {
        color: fontColor === "purple" ? 'var(--purple)' : fontColor,
        backgroundColor:bgColor === "purple" ? 'var(--purple)' : bgColor
    };

    if(link){
        return <button className = {style.button}>
            <Link href={link}>{Icon && <Icon/>}
            {text ? text : ''}</Link>
        </button>
    }

    return <button 
    className={style.button}
     onClick={click || undefined}
     style={customStyle}
     >{Icon && <Icon size={16} />}{text}</button>

}