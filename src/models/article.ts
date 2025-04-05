import { Component } from "react";
import { Community } from "./community";

export interface Article{
    id:string;
    title:string;
    subtitle:string;
    imgUrl:string | null;
    authorName:string;
    authorId:string;
    createdAt:string;
    community: Community | null;
    components: Component[];
}

export const articleListMock = [
    {
        id:'1-my-first-article-dshasjudohsafjusahgfusjah',
        authorName:'Gabriel',
        title:'My first article',
        subtitle:'This is a subtitle',
        authorId:'gabriel',
        imgUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSIs158DLx0TN5GOQGHSRqQ6_4IaAE6uugww&s',
        createdAt:'2025-04-02',
        community:{
            id:"com-1",
            name:"The cool magazine",
            description:"Only cool articles!!!"
        } as Community,
        components:[]
    } as Article,
    {
        id:'2-my-second-article-dshasjudohsafjusahgfusjah',
        authorName:'Gabriel',
        authorId:'gabriel',
        title:'My second article aaaaaaaaaaaaaaaaaaaaaa long title aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        subtitle:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vestibulum velit elit, in fermentum elit laoreet vitae. Fusce vel facilisis justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sodales orci sit amet sem porta finibus. Etiam maximus feugiat enim vitae hendrerit. Fusce sit amet ligula ut quam tristique scelerisque a quis nisl. Etiam luctus tincidunt nunc, et auctor ipsum ullamcorper ac. Aenean ultrices consequat quam vitae tempor. Sed gravida ultricies diam, nec auctor est feugiat a. Donec urna lorem, suscipit et urna vel, pharetra suscipit est.',
        imgUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSctHsRuSti0eiUT_vCSlRAlxYKTsG6UooYrQ&s',
        createdAt:'2025-04-02',
        community:null,
        components:[]
    } as Article,

] as Article[];
