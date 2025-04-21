'use client'

import { useRef, useState } from "react";
import { Editor } from '@tiptap/react'
import Header from "../_components/header/header";
import EditorWrapper from "../_components/editor/editor-wrapper";
import api from '../../utils/axios';
import Modal from "../_components/modal/modal";
import { FullscreenLoader } from "../_components/fullscreen-loading/fullscreen-loading";
import { useRouter } from 'next/navigation'
interface Preview{
  title:string,
  subtitle?:string;
  content:string;
  thumbnailUrl:string | null;
  thumbnailOptions:string[];
  authorUsername:string;
}

export default function WritePage(){

    const router = useRouter();

    const editorRef = useRef<Editor | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const [imagesUploaded,setImagesUploaded] = useState<string[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const [loading,setLoading] = useState(false);
    const [isErrorModalOpen,setIsErrorModalOpen] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const [preview,setPreview] = useState<Preview>();

    const handleAction = () => {
      console.log("aqui");
      setIsOpen(false);
      setLoading(true);

      api.post("/articles",preview,{}).then(
        (response)=>{
          console.log(response);
          setIsErrorModalOpen(false);
          //TODO: also clear draft
          //TODO: retrieve user username and use it to navigate
          setTimeout(()=>{
            router.push("/gabriel");
          },500);
        }
      ).catch((error)=>{
        setErrorMessage("There was a problem saving your article, please try again later. Don&apos;t worry, the draft is saved and you can access it later.");
        
        console.error(error);
      }).finally(()=>{
        setLoading(false);
      });

    };

    function publish(){
      let content = editorRef.current?.getHTML();
      const title = titleRef.current?.value;
      
      if(!title){
        setIsErrorModalOpen(true);
        setErrorMessage("Title is required!");
        return;
      }
      

      //TODO: open modal to let user select a thumbnail for the article

      //replace "" with '' to send via json
      content = content?.replaceAll("(?<=\\s\\w+)=\\\"([^\\\"]*)\\\"", "='$1'");
      const article  = {
        title,
        content,
        thumbnailUrl: imagesUploaded?.[0] || null,
        authorUsername:"gabriel"
      } as Preview;

      setPreview(article);
      
      setIsOpen(true);

    
    }

    return (
        <div>
            <Header location="editor" publish={publish}/>
            <EditorWrapper editorRef = {editorRef} titleRef={titleRef} setImagesUploaded={setImagesUploaded}/>
            <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Publish article"
            size="large"
            actionText="Publish"
            loading={loading}
            onAction={handleAction}
          >
            Are you sure you want to publish the article now?
          </Modal>
          {loading && <FullscreenLoader text="Publishing your article..." />}
          <Modal
            isOpen={isErrorModalOpen}
            onClose={() => setIsErrorModalOpen(false)}
            title="Error"
            size="medium"
            actionText="Close"
            loading={loading}
            showCancelButton={false}
            onAction={()=>setIsErrorModalOpen(false)}
          >
            {errorMessage}
          </Modal>
          
        </div>
    );

}