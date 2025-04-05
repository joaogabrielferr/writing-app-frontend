import Header from "@/app/_components/header/header";
import style from './article-page.module.css'

export default async function ArticlePage({
    params,
  }: {
    params: Promise<{ articleId: string }>
  }){

    const {articleId} = await params;
    console.log(articleId);

    return (
        <>
          <Header/>
          <div className = {style.container}>

            <h1 className = {style.title}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, ad?</h1>
            
            <div className = {style.subtitle}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, facilis.
            </div>

            <p>
              {articleId}
            </p>

            <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit blanditiis non nihil maxime est sunt possimus quaerat, labore ab quibusdam quidem necessitatibus. Mollitia provident molestiae, ipsa, minus suscipit deserunt quam quidem unde beatae assumenda deleniti illum dolores aspernatur voluptatum accusamus minima atque. Unde, cum rem! Illo consequuntur in aliquam cumque?
            </p>
            
            <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi deserunt neque ad iusto! Nulla pariatur magni ipsam maiores eligendi, error eius voluptatem mollitia ipsum commodi consequuntur, dolore voluptate accusantium hic earum. Aliquam sint expedita eaque impedit ex alias eveniet doloribus recusandae a laboriosam inventore in corporis fugit sunt ab animi aperiam autem perferendis, numquam officia velit, est commodi iure blanditiis. Facilis quaerat quod explicabo, nihil vero qui iure facere ullam optio iste nisi, tempora minus ut. Dolores, rerum impedit temporibus optio doloremque ab error in maiores eaque quibusdam. Sed quas reiciendis quod vitae at cumque dicta omnis nihil, numquam ipsa?
            </p>
            
            <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque ipsum sunt culpa, voluptas non a est iusto aspernatur ipsa consequatur, beatae reiciendis delectus alias molestiae porro perferendis placeat? Distinctio omnis aut rem odit quos fuga perspiciatis laboriosam assumenda corrupti, veniam recusandae pariatur sed dolorem! Rerum nam itaque totam nostrum laborum?

            </p>
            </div>
  
        </>
    );

}