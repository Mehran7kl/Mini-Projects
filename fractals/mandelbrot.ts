let needsRender = true;

function mandelbrot(px: number, py:number, maxIter: number, bound=2)
{
    let x=0,y=0;
    let iterations = 0;
    while(iterations<maxIter  && x**2+y**2<bound**2)
    {
        //z^2 = (x + iy)^2 = x^2 - y^2 +i2xy
        const xtemp = x**2 - y**2 +px;
        y = 2*x*y + py;
        x = xtemp;
        iterations++;
    }
    return iterations;
}


const cv = document.getElementById("cv") as HTMLCanvasElement;
cv.style.width="600px";
cv.style.height="300px";
cv.width = 600;
cv.height = 300;
const canvasAspect = cv.width/cv.height;

const gr = cv.getContext("2d") as CanvasRenderingContext2D;

const renderBuffer = gr.createImageData(cv.width,cv.height);

let viewport = {
    x:0,y:0, width:4,
    cxtovx(x:number){
        const m = this.width/cv.width;
        return m*(x-cv.width/2)+this.x;
    },
    cytovy(y:number){
        const m = -this.width*canvasAspect/cv.height;
        return m*(y-cv.height/2)+this.y;
    }
};


window.addEventListener("keypress",e=>{
    const sens = viewport.width/5;
    
    switch(e.key)
    {
        case "a": 
            viewport.x-=sens;
            break;
            
        case "s": 
            viewport.y-=sens;
            break;
        
        case "d": 
            viewport.x+=sens;
            break;
        
        case "w": 
            viewport.y+=sens;
            break;
        
        case "e": 
            viewport.width*=0.9;
            break;
            
        case "q": 
            viewport.width*=1.1;
            break;
    }
    needsRender=true;
})

function render(){
    requestAnimationFrame(render);    
    if(!needsRender) return;
    gr.clearRect(0,0,gr.canvas.width,gr.canvas.height)
    forEachPixel((x,y)=>mandelbrot(x,y,255));
    gr.putImageData(renderBuffer,0,0);
    needsRender=false;
}

render();

function forEachPixel(callback:(x:number,y:number)=>number)
{
        
    for(let x=0; x < gr.canvas.width; x++)
    {
        for(let y=0; y< gr.canvas.height; y++)
        {
            const i =y*gr.canvas.width+x;
            renderBuffer.data[i*4+2]= callback(viewport.cxtovx(x),viewport.cytovy(y));
            renderBuffer.data[i*4+3] = 255;
        }
                
    }
}

