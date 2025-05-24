import Button from "./_components/button/button";

export default function NotFound(){

    return <div 
    style={{width:'100vw',height:'100vh',
    display:'flex',justifyContent:'center',alignItems:'center',
    flexDirection:'column',
    background:'var(--background)',color:'var(--foreground)'}}>
        <div>Whoops, this page doesn’t exist!</div>
        <Button link="/">Go back to the beginning</Button>
    </div>    

}