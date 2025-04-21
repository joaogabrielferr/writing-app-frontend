import { Author } from "./author";

export interface Article{
    id:string;
    title:string;
    content: string;
    thumbnail:string | null;
    author:Author;
    createdAt:string;
    subtitle?:string;
    firstParagraph:string;
}

export const articleListMock = [
    {
        id:'1-my-first-article-dshasjudohsafjusahgfusjah',
        author:{
            name:'Gabriel',
            username:'gabriel'
        },
        title:'My first article',
        thumbnail:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSIs158DLx0TN5GOQGHSRqQ6_4IaAE6uugww&s',
        createdAt:'2025-04-02',
        firstParagraph:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero voluptatum, voluptate velit, deleniti, quae aspernatur ipsum dicta sunt laudantium veniam maxime? Ab, atque. Autem atque quo inventore aliquid, ut molestias voluptatum, esse ratione provident dignissimos impedit itaque laborum dolore, voluptatibus dolorem magni. Illo ut rerum neque ullam asperiores doloribus voluptatum."
    } as Article,
    {
        id:'2-my-second-article-dshasjudohsafjusahgfusjah',
        author:{
            name:'Gabriel',
            username:'gabriel'
        },
        title:'This is a more realistic title - and some more text',
        thumbnail:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSctHsRuSti0eiUT_vCSlRAlxYKTsG6UooYrQ&s',
        createdAt:'2025-04-02',
        } as Article,
    {
        id:'3-my-second-article-dshasjudohsafjusahgfusjah',
        author:{
            name:'Gabriel',
            username:'gabriel'
        },
        title:'My second article aaaaaaaaaaaaaaaaaaaaaa long title aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaa aaaaaaaaaa aaaaaaaaaaaa a aaaaaaaaaaa',
        thumbnail:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSctHsRuSti0eiUT_vCSlRAlxYKTsG6UooYrQ&s',
        createdAt:'2025-04-02',
        firstParagraph:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero voluptatum, voluptate velit, deleniti, quae aspernatur ipsum dicta sunt laudantium veniam maxime? Ab, atque. Autem atque quo inventore aliquid, ut molestias voluptatum, esse ratione provident dignissimos impedit itaque laborum dolore, voluptatibus dolorem magni. Illo ut rerum neque ullam asperiores doloribus voluptatum."
    } as Article,

] as Article[];
