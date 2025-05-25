'use client'

import {EditorContent, Editor } from '@tiptap/react'

import { Dispatch, memo, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import "./editor-wrapper.scss";
import { Bold, Heading1, Heading2, ImagePlus, Italic, List, PanelBottomClose, PanelLeftClose, PanelRightClose, PanelTopClose, Strikethrough } from 'lucide-react'
import {Underline as UnderlineIcon} from 'lucide-react';
import { ALL_IMAGES_ADDED_LOCAL_STORAGE_KEY } from '@/global-variables';
import api from '@/lib/api'
import Modal from '../modal/modal'
import axios from 'axios'
import { FullscreenLoader } from '../fullscreen-loading/fullscreen-loading'


type Props = {
  initialContent?: string
  editor: Editor | null;
  onTitleChange: (newTitle: string) => void;
  onSubtitleChange: (newSubtitle: string) => void;
  title: string;
  subtitle:string;
}


type Position = 'top' | 'bottom' | 'left' | 'right';
type Location = 'title' | 'subtitle' | 'editor' | null;

export default function EditorWrapper({editor,onTitleChange,onSubtitleChange,title,subtitle} : Props) {


  const [toolbarPosition, setToolbarPosition] = useState<Position>('top');
  const [isMobile,setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 1250);
  const [focusLocation, setFocusLocation] = useState<Location>('editor');

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setisItalic] = useState(false);
  const [isH1, setIsH1] = useState(false);
  const [isH2, setIsH2] = useState(false);
  const [isStrike,setIsStrike] = useState(false);
  const [isUnderline,setIsUnderline] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage,setIsUploadingImage] = useState(false);
  const [isModalUploadErrorOpen,setIsModaulUploadErrorOpen] = useState(false);
  const [uploadImageError,setUploadImageError] = useState('');
  
  const suppressNextArrowUp = useRef(false);

  const localTitleRef = useRef<HTMLInputElement>(null); //needed for focusing
  const localSubtitleRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!editor) return;
    
    //necessary for good performance
    editor.on('transaction', () => {
      setIsBold(editor.isActive('bold'));
      setisItalic(editor.isActive('italic'));
      setIsH1(editor.isActive('heading',{level:1}));
      setIsH2(editor.isActive('heading',{level:2}));
      setIsStrike(editor.isActive('strike'));
      setIsUnderline(editor.isActive('underline'));
    });
  
  }, [editor]);


  useEffect(()=>{
    function adjust(){
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 1250);
    }

    function scrollIfCaretNearBottom(threshold = 100, scrollAmount = 150) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return;

      const range = selection.getRangeAt(0).cloneRange();
      range.collapse(true);

      const rects = range.getClientRects();
      if (!rects || rects.length === 0) return;

      const caretRect = rects[0];
      const caretBottom = caretRect.bottom;
      const viewportHeight = window.innerHeight;

      const distanceToBottom = viewportHeight - caretBottom;

      if (distanceToBottom < threshold) {
        console.log("distance to bottom:",distanceToBottom);
        window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      }
}
  
    let lastCheck = 0;
    const throttleDelay = 150;
  
    function handleKeydown() {
      const now = Date.now();
      console.log("aqui");
      if (now - lastCheck > throttleDelay) {
        scrollIfCaretNearBottom();
        lastCheck = now;
      }
    }
    window.addEventListener('keydown', handleKeydown);

    window.addEventListener("resize",adjust);

    return () =>{
      window.removeEventListener("resize",adjust);
      window.removeEventListener('keydown', handleKeydown)
    }

  },[toolbarPosition]);

  useEffect(()=>{
    if(isMobile){
      setToolbarPosition('bottom');
    }
  },[isMobile]);


  const addImage = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event?.target?.files?.[0];

    if(!file)return;

    if(!editor){
      console.error("editor not available");
      return;
    }
    
    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append('file',file);

    try{

      const response = await api.post("/articles/image",formData);
      
      const url = response?.data?.url;
      if(url){

        editor.chain().focus().setImage({src:url}).run();
        const data = localStorage.getItem(ALL_IMAGES_ADDED_LOCAL_STORAGE_KEY);
        let images;
        if(data){
          images = JSON.parse(data);
          if(images?.items?.length){
            images.items.push(url);
          }else{
            images = {items:[url]};
          }
        }else{
          images = {items:[url]};
        }
        localStorage.setItem(ALL_IMAGES_ADDED_LOCAL_STORAGE_KEY,JSON.stringify(images));
      }

    }catch(error){

      if(axios.isAxiosError(error) && error.response){
        const status = error.response.status;
        if (status === 401 || status === 403) {
          setUploadImageError("Authentication failed. Please log in again.");
        }else if(status == 400 || status == 500){
          setUploadImageError("We couldn't save your image in our servers. Please try again later.");
        }else{
          setUploadImageError("That was a problem saving your image. Check your internet connection and try again later.");
        }
      }else{
        // Network error or other non-Axios error
        setUploadImageError("A network error occurred, or the server is unreachable. Please check your connection.");
      }

    }finally {
      setIsUploadingImage(false);
      if (event.target) {
        event.target.value = '';
      }
    }

  }, [editor]);

  const editorContent = useMemo(() => (
    <EditorContent 
      editor={editor} 
      className="editor"  
      onFocus={() => {
        setFocusLocation("editor");
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp') {
          const { state } = editor!;
          const { selection } = state;
          const firstNode = state.doc.content.firstChild;
          const isAtStartOfFirstNode =
            firstNode &&
            selection.$from.parent === firstNode &&
            selection.$from.parentOffset === 0;
  

          if (isAtStartOfFirstNode) {
            e.preventDefault();
            suppressNextArrowUp.current = true;
            console.log("aqui",localSubtitleRef);
            localSubtitleRef.current?.focus();
          }
        }
      }}
    />
  ), [editor]);

  const triggerAddImage = useCallback(() => {
    // Instead of prompt, trigger the hidden file input
    fileInputRef.current?.click();
  }, []);

  if (!editor) return null;


  return (
    <div className = "pageEditor">
    <div className = "editorContainer">
      <Toolbar editor={editor} addImage={triggerAddImage} focusLocation={focusLocation} isMobile = {isMobile} setToolbarPosition={setToolbarPosition}
        toolbarPosition={toolbarPosition} key={'super-cool-toolbar'} isBold = {isBold} isItalic = {isItalic} isH1 = {isH1} isH2 = {isH2} isStrike = {isStrike}
        isUnderline = {isUnderline}
      />
      <input ref = {localTitleRef} className = "article-title" placeholder = "The title"
      onChange={(e)=>onTitleChange(e.target.value)}
      value={title}
      onFocus={() => {
        setFocusLocation("title")
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' || e.key === "Enter") {
          e.preventDefault();
          // editor?.commands.focus('start');
          localSubtitleRef.current?.focus();
        }
      }}

      ></input>
      <input ref = {localSubtitleRef} className = "article-subtitle" placeholder = "The subtitle"
      onChange={(e)=>onSubtitleChange(e.target.value)}
      value = {subtitle}
      onFocus={() => {
        setFocusLocation("subtitle")
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' || e.key === "Enter") {
          e.preventDefault();
          editor?.commands.focus('start');
        }
      }}
      onKeyUp={(e)=>{
        if(e.key === 'ArrowUp'){
          e.preventDefault();
          if (suppressNextArrowUp.current) {
            suppressNextArrowUp.current = false;
            return;
          }
          console.log("aqui também",document.activeElement);
          localTitleRef.current?.focus();
        }
      }}

      ></input>
      {editorContent}
    </div>
    <input
    type="file"
    ref={fileInputRef}
    onChange={addImage}
    style={{ display: 'none' }}
    accept="image/png, image/jpeg, image/gif, image/webp"
    />
    <Modal
        isOpen={isModalUploadErrorOpen}
        onClose={()=>setIsModaulUploadErrorOpen(false)}
        title="We coudn't upload your image"
        size="small"
        actionText="Close"
        showCancelButton={false}
        onAction={()=>setIsModaulUploadErrorOpen(false)}
        loading={false}
    >
      {uploadImageError}
    </Modal>


    {isUploadingImage && <FullscreenLoader text="Uploading your image..." />}
    </div>
  )
}

interface ToolbarProps{
  editor:Editor,
  toolbarPosition:Position,
  isMobile:boolean,
  focusLocation:Location,
  addImage:()=>void,
  setToolbarPosition: Dispatch<SetStateAction<Position>>,
  isBold:boolean,
  isItalic:boolean,
  isH1:boolean,
  isH2:boolean,
  isStrike:boolean,
  isUnderline:boolean
 }

const Toolbar = memo(({
  editor,
   toolbarPosition,
    isMobile,
    focusLocation,
    addImage,
    setToolbarPosition,
    isBold,
    isItalic,
    isH1,
    isH2,
    isStrike,
    isUnderline
  }:ToolbarProps) => {
  return (
    <div
    className={`toolbar ${toolbarPosition} ${focusLocation !== 'editor' ? 'disabled' : ''}`}
>
  <div className = "tools-buttons">
    <button
      className = {`button ${isBold ? 'is-active' : ''}`}
      // className = {`button ${editor.isActive('bold') ? 'is-active' : ''}`}
      onClick={() => editor.chain().focus().toggleBold().run()}
    >
      <Bold />
    </button>
    <button
      className = {`button ${isItalic ? 'is-active' : ''}`}
      onClick={() => editor.chain().focus().toggleItalic().run()}
    >
      <Italic />
    </button>
    <button
      className = {`button ${isStrike ? 'is-active' : ''}`}
      onClick={() => editor.chain().focus().toggleStrike().run()}
    >
      <Strikethrough />
    </button>
    <button
      className = {`button ${isUnderline ? 'is-active' : ''}`}
      onClick={() => editor.chain().focus().toggleUnderline().run()}
    >
      <UnderlineIcon/>
    </button>
    <button
      className = {`button ${isH1 ? 'is-active' : ''}`}
      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
    >
      <Heading1 />
    </button>
    <button
      className = {`button ${isH2 ? 'is-active' : ''}`}
      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    >
      <Heading2 />
    </button>
    <button
      className = {`button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
      onClick={() => editor.chain().focus().toggleBulletList().run()}
    >
      <List />
    </button>
    <button
      className="button"
      onClick={addImage}
    >
      <ImagePlus /> 
      <span>
        {(!isMobile && (toolbarPosition == 'top' || toolbarPosition == 'bottom') ) && ("Image")}
      </span>
    </button>
  </div>
  {
    !isMobile && (
      <div className = "position-buttons">
      {(['top','left','bottom','right'] as Position[]).map(pos => (
        <button
          key={pos}
          onClick={() => setToolbarPosition(pos)}
          className={`button ${toolbarPosition === pos ? 'is-active' : ''}`}
        >
          {pos == 'top' ? <PanelTopClose /> : 
          (pos == 'bottom' ? <PanelBottomClose /> : 
          (pos == 'left' ? <PanelLeftClose /> : <PanelRightClose />))}
        </button>
      ))}
      </div>
    )
  }


</div>
  );
});

Toolbar.displayName = 'Toolbar';