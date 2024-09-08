import { defineConfig } from "vite";
import { glob } from "glob";
export default defineConfig(()=>{
    let pattern="./**/*.html";
    
    const g = glob.sync(pattern,{ignore:"./dist/**"}).map(str=>str.replace("\\","/"));
    const base = "/Mini-Projects/"
    return {
    base,
    define: { myproject:{base,htmlFiles:g,}},
    build:{
        rollupOptions:{
            input: g
        }
    }
    
    }
});