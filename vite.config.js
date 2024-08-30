import { defineConfig } from "vite";
import { glob } from "glob";
export default defineConfig(()=>{
    
    const g = glob.sync(__dirname+"/*.html");
    
    

    return {
    base:"/Mini-Projects/",
    define: {htmlFiles:g},
    build:{
        rollupOptions:{
            input: g
        }
    }
    
    }
});