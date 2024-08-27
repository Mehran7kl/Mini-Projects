import { defineConfig } from "vite";
import * as path from "path";
import { glob } from "glob";
import { log } from "console";
export default defineConfig(()=>{
    
    const g = glob.sync(__dirname+"/*.html");
    


    return {
    base:"/Mini-Projects/",
    build:{
        rollupOptions:{
            input: g
        }
    }
    }
});