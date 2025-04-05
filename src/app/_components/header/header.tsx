
'use client'

import Link from "next/link";
import style from "./header.module.css";
import Button from "../button/button";

export default function Header(){

    return (
        <header id = "header" className = {style.header}>
            <div className = {style.inner_header}>
                <div className = {style.logo_container}>
                    <Link href="/" className = {style.logo}>
                        2VERSO
                    </Link>
                </div>
                <div>search bar</div>
                <div className = {style.right}>
                    <Button text={"Write"} />
                    <div className = {style.avatar}></div>
                    {/* <nav>
                        <Link href="/gabriel">Gabriel</Link>
                    </nav> */}
                </div>
            </div>
        </header>
    );

}