import styles from "./spinner.module.css";

export function Spinner({size}:{size:number}){
    return <div className = {styles.spinner} style={{width:size,height:size}} ></div>
}