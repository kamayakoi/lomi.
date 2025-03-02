import { useEffect, useRef } from "react";

export function DevMessage() {
  const ref = useRef<boolean>(false);

  useEffect(() => {
    if (!ref.current) {
      console.log(`
      ---------------------██---
      ██╗██████╗███╗   ███╗
      ██║██║ ██║████╗ ████║██╗
      ██║██║ ██║██╔████╔██║██║
      ██║██║ ██║██║╚██╝ ██║██║ 
      ██║██████║██║     ██║██║██
      --------------------------
    We are open source: https://git.new/WOBpLCu
    Join the community: https://developers.lomi.africa/docs/support/contact
    
    `);
      ref.current = true;
    }
  }, []);

  return null;
}