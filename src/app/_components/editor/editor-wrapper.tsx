'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Dispatch, memo, RefObject, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import "./editor-wrapper.scss";
import { Bold, Heading1, Heading2, ImagePlus, Italic, List, PanelBottomClose, PanelLeftClose, PanelRightClose, PanelTopClose, Strikethrough } from 'lucide-react'
import {Underline as UnderlineIcon} from 'lucide-react';
import { LastParagraphMarker } from '@/app/write/extension';
import Underline from '@tiptap/extension-underline';
import Dropcursor from '@tiptap/extension-dropcursor';



type Props = {
  initialContent?: string
  editorRef: RefObject<Editor | null>
  titleRef:  RefObject<HTMLInputElement | null>;
  setImagesUploaded: Dispatch<SetStateAction<string[]>>
}


type Position = 'top' | 'bottom' | 'left' | 'right';
type Location = 'title' | 'subtitle' | 'editor' | null;

export default function EditorWrapper({editorRef,titleRef,setImagesUploaded} : Props) {


  const [toolbarPosition, setToolbarPosition] = useState<Position>('top');
  const [isMobile,setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 1250);
  const [focusLocation, setFocusLocation] = useState<Location>('editor');
  // const focusLocationRef = useRef<'title' | 'subtitle' | 'editor' | null>('editor');
  // const titleRef = useRef<HTMLInputElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setisItalic] = useState(false);
  const [isH1, setIsH1] = useState(false);
  const [isH2, setIsH2] = useState(false);
  const [isStrike,setIsStrike] = useState(false);
  const [isUnderline,setIsUnderline] = useState(false);

  
  const editor = useEditor({
    extensions: [
      StarterKit,Image,Underline,Dropcursor,
      LastParagraphMarker,
      Placeholder.configure({
        placeholder: 'Write something ...',
      }),
    ],
    // onUpdate({ editor }) {
    //   const html = editor.getHTML();
    //   console.log(html);
    //   onChange?.(html);
    // },
    onCreate({ editor }) {
      editor.commands.focus('start')
    },
    immediatelyRender:false,
  });

  useEffect(() => {
    if (!editor) return;
    
    //necessary for good performance
    //in the last iteration the toolbar was getting rerendered on every key press
    //so it to a memoed component and this is how im able to update it imediatly after using a tool
    //problem solved aeee
    editor.on('transaction', () => {
      setIsBold(editor.isActive('bold'));
      setisItalic(editor.isActive('italic'));
      setIsH1(editor.isActive('heading',{level:1}));
      setIsH2(editor.isActive('heading',{level:2}));
      setIsStrike(editor.isActive('strike'));
      setIsUnderline(editor.isActive('underline'));
    });
  
  }, [editor]);

  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

  useEffect(()=>{
    function adjust(){
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 1250);
    }

    //scroll the page if the last paragraph is two close to the end of the page
    function checkCaretPosition() {
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;
  
      const range = selection.getRangeAt(0);
      let node = range.startContainer;
  
      while (node && node.nodeType !== Node.ELEMENT_NODE) {
        node = node.parentNode!;
      }
  
      if (!node || !(node instanceof HTMLElement)) return;
  
      const editorEl = document.querySelector(".editor");
      if (!editorEl || !editorEl.contains(node)) return;

      const nodeRect = node.getBoundingClientRect();
      const viewportBottom = window.innerHeight;
      const distanceFromBottom = viewportBottom - nodeRect.bottom;
      const threshold = 180;
      if (distanceFromBottom < threshold) {
        window.scrollBy({
          top: threshold - distanceFromBottom,
          behavior: "smooth",
        });
      }
    }
  
    let lastCheck = 0;
    const throttleDelay = 300; // milliseconds
  
    function handleKeydown() {
      const now = Date.now();
      if (now - lastCheck > throttleDelay) {
        checkCaretPosition();
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


  // useEffect(()=>{
  //   editor?.commands.focus('start');
  // },[editor]);


  const addImage = useCallback(() => {
    const url = prompt('Enter image URL')
    if (url) {
      setImagesUploaded(prev => [...prev,url]);
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor,setImagesUploaded]);

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
            titleRef.current?.focus();
          }
        }
      }}
    />
  ), [editor]);

  if (!editor) return null;


  return (
    <div className = "pageEditor">
    <div className = "editorContainer">
      <Toolbar editor={editor} addImage={addImage} focusLocation={focusLocation} isMobile = {isMobile} setToolbarPosition={setToolbarPosition}
        toolbarPosition={toolbarPosition} key={'super-cool-toolbar'} isBold = {isBold} isItalic = {isItalic} isH1 = {isH1} isH2 = {isH2} isStrike = {isStrike}
        isUnderline = {isUnderline}
      />
      <input ref = {titleRef} className = "article-title" placeholder = "Your title" 
      onFocus={() => {
        setFocusLocation("title")
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' || e.key === "Enter") {
          e.preventDefault();
          editor?.commands.focus('start');
        }
      }}

      ></input>
      {editorContent}
    </div>
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