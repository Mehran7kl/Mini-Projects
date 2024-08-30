
function putLink(file,title,description){
    
    const con = document.querySelector("#code-links")
    con.innerHTML+=`
    <article class="code-link">
        <h3><a href="./${file}">${title}</a></h3>
        <h4>${description}</h4>
    </article>
    `
}

htmlFiles.forEach(file=>{
    const doc = document.createElement("html")
    fetch(`./${file}`)
    .then(res=>res.text())
    .then(text=>{
        doc.innerHTML=text;
        const title = doc.querySelector('title').innerText ;
        const description = doc.querySelector('[name="description"]')?.getAttribute("content") ;
        if(description){
            putLink(file,title,description);
        }
    })
    
})




