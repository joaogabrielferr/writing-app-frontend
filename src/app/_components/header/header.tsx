
import Link from "next/link";
import style from "./header.module.css";

export default function Header(){

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