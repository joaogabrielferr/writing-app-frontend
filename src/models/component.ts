export interface Component{
    type: 'paragraph' | 'image' | 'citation' | 'code';
    imgUrl?:string | null;
    text:string | null;
}