
'use client'

import Link from "next/link";
import style from "./header.module.css";
import Button from "../button/button";

interface Props{
    location: 'main' | 'editor' | 'other'
    publish?: () => void
}

export default function Header({location,publish} : Props){
    console.log(location);
    return (
        <header id = "header" className = {`${style.header} ${location === 'main' ? style.header_background_main : ''} `}>
            <div className = {style.inner_header}>
                <div className = {style.logo_container}>
                    <Link href="/" className = {style.logo}>
                        <span>E</span>
                        SCRITR
                    </Link>
                </div>
                {
                    (location === 'main') && <div>search bar</div>
                }
                <div className = {style.right}>
                    {
                        (location === 'main'  || location === 'other') && <Button text={"Write"} link="/write" />
                    }
                    {
                        location === 'editor' && <Button text = {'Publish'} click={publish} />
                    }
                    <div className = {style.avatar}></div>
                </div>
            </div>
        </header>
    );

}