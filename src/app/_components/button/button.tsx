import Link from 'next/link';
import style from './button.module.css';

interface Props{
    text:string;
    link?:string;
    fontColor?:string;
    bgColor?:string;
    click?:() => void
}

export default function Button({text,link,click,fontColor,bgColor} : Props){
    const customStyle = {
        color:fontColor,
        backgroundColor:bgColor === "purple" ? 'var(--purple)' : bgColor
    };

    if(link){
        return <button className = {style.button}>
            <Link href={link}>{text}</Link>
        </button>
    }

    return <button 
    className={style.button}
     onClick={click || undefined}
     style={customStyle}
     >{text}</button>

}