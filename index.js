
const urlParams = (()=>{
    try{
        return new URLSearchParams(window.location.search)
    }catch{ return null}})();

function getPath(file)
{
    const i = window.location.pathname.indexOf(myproject.base) + myproject.base.length;    
    const base = window.location.pathname.slice(0,i);
    return base+file;
}

function putLink(file,title,description,tags){
    
    const con = document.querySelector("#code-links")
    con.innerHTML+=`
    <article class="code-link">
        <h3><a href="${getPath(file)}">${title}</a></h3>
        <h4>${description}</h4>
        <div class="code-tags">
            ${tags.map(tag=>`<button class="code-tag" onclick="location.href+='?tags=${tag}'" >${tag}</button>`).join(" ")}
        </div>
    </article>
    `
}

myproject.htmlFiles.forEach(file=>{
    const doc = document.createElement("html")
    fetch(`${getPath(file)}`)
    .then(res=>res.text())
    .then(text=>{
        doc.innerHTML=text;
        const title = doc.querySelector('title').innerText ;
        const description = doc.querySelector('[name="description"]')?.getAttribute("content") ;
        const tags = doc.querySelector('[name="keywords"]')?.getAttribute("content").split(",").map(s=>s.trim());
        const urlTags = urlParams?.get("tags");
        if(tags&& title&&description){
            if(urlTags == null || tags.includes(urlTags) ) putLink(file,title,description,tags);
        }
    })
    
})




