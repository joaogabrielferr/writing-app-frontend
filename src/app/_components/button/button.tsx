import style from './button.module.css';

export default function Button({text} : {text:string}){

    return <button className={style.button}>{text}</button>

}