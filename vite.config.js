import { defineConfig } from "vite";
import { glob } from "glob";
export default defineConfig(()=>{
    let pattern=__dirname+"/*.html";
    pattern=pattern.replace("//","/").replace("\\/","/");
    const g = glob.sync(pattern);
    
    

    return {
    base:"/Mini-Projects/",
    define: {htmlFiles:g.map(file=> file.split("/").at(-1))},
    build:{
        rollupOptions:{
            input: g
        }
    }
    
    }
});