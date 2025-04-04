
'use client'

import Link from "next/link";
import style from "./header.module.css";
import { useState } from "react";

export default function Header(){

    const [user,setUser] = useState(null);


    return (
        <header id = "header" className = {style.header}>
            <div className = {style.inner_header}>
                <div>
                    <Link href="/" className = {style.logo}>
                        2VERSO
                    </Link>
                </div>
                <div>search bar</div>
                <div>
                    <nav>
                        <Link href="/gabriel">Gabriel</Link>
                    </nav>
                </div>
            </div>
        </header>
    );

}