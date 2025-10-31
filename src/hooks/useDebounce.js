import {useRef,useEffect} from "react";
export function useDebounceCallback(cb,delay=600){
  const t=useRef();
  useEffect(()=>()=> clearTimeout(t.current),[]);
  return (...args)=>{
    clearTimeout(t.current);
    t.current=setTimeout(()=> cb(...args),delay);
  }
}