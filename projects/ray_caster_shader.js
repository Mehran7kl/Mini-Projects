import  * as THREE from "../library/three.module.js"
import  {GUI as InputPanel} from "../library/controler.gui.js";
import  Stats from "../library/stats.module.js";

const log=console.log.bind(console);





const stats=new Stats();
document.body.appendChild(stats.dom);
const inputPanel=new InputPanel();
inputPanel.close()
const scene = new THREE.Scene(); 
const camera = new THREE.OrthographicCamera();
const resolution=new THREE.Vector2();
scene.add(camera);
const renderer = new THREE.WebGLRenderer();


function resize(){
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio(devicePixelRatio); 
	renderer.getDrawingBufferSize(resolution);
	camera.aspect=window.innerWidth/ window.innerHeight;
	camera.updateProjectionMatrix()
}

resize();
addEventListener("resize",resize );
document.body.appendChild( renderer.domElement );
 
const planeGeo=new THREE.PlaneGeometry(2,2);

const shaderMat=new THREE.RawShaderMaterial({
	glslVersion:THREE.GLSL3,
	vertexShader:document.getElementById("vxShader").textContent,
	fragmentShader:document.getElementById("fgShader").textContent,
	uniforms:{
		time:{value:0},
		resolution:{value:resolution},
		touch:{value:new THREE.Vector2()},
	}
});
const {uniforms}= shaderMat;

scene.add(new THREE.Mesh(planeGeo, shaderMat));



function animate(time) 
{
	if(renderer.info.render.frame===1)
		log(`rendered at ${Math.floor(performance.now())}ms`);
	
	uniforms.time.value=time/1000.0;
	renderer.render( scene, camera);
	stats.update();
}
function onTouchMove(index, x, y){
	uniforms.touch.value.set(x,y)
	uniforms.touch.value.multiplyScalar(devicePixelRatio)
}



renderer.domElement.addEventListener("touchmove",
e=>{
	let i=0;
	for(let t of e.touches){
		onTouchMove(i,t.clientX,t.clientY)
		i++;
	}
}
);
renderer.setAnimationLoop(animate);




