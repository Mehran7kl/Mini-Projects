import { defineConfig } from "vite";
import { glob } from "glob";
export default defineConfig(()=>{
    let pattern="./**/*.html";
    
    const g = glob.sync(pattern,{ignore:"./dist/**"}).map(str=>str.replace("\\","/"));
    
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