import  * as THREE from "../library/three.module.js"
import  {GUI as InputPanel} from "../library/controler.gui.js";
import  Stats from "../library/stats.module.js";
import {OrbitControls} from "../library/ThreeJs/OrbitControls.js";

const log=console.log.bind(console);

const vec3a=new THREE.Vector3();
const vec3b=new THREE.Vector3();
const vec3c=new THREE.Vector3();



function Physics()
{
	const objects=new WeakMap();
	const dtFps=1/60.0;
	this.speed=1;
	const G=6.67*1e-11;
	
	this.set=(object,properties)=>
	{
		const data={
			gravityCast:false,
			gravityReceive:false,
			mass:1,
			velocity:new THREE.Vector3(),
			
			hardness:0,
		};
		
		for(let key in properties)
			if(!(key in data))throw("there's no such physical property: "+key);
		Object.assign(data,properties);
		objects.set(object,data);
	}
	const vec3a=new THREE.Vector3(),
				vec3b=new THREE.Vector3(),
				vec3c=new THREE.Vector3();
	
	
	
	this.do=scene=>{
		
		const dt=this.speed*dtFps;
		scene.traverse(obj=>{
			const objList=obj.children;
			const listLength=objList.length;
			const data=objects.get(obj);
			
			//I apply movement..(dx) changes
			if(data){
				vec3a.copy(data.velocity).multiplyScalar(dt)
				obj.position.add(vec3a);
			}
			//you may use for(let j=i-1;..... 
			//it helps to avoid call map.get but causes to test gravity attributes at the end
			//time to apply gravity
			for(let i=0;i<listLength;i++)
			{
				
				const obj1=objList[i];
				const data1=objects.get(obj1);
				if(!data1) continue;
				if(!data1.gravityCast)continue;
				
				const gm=data1.mass*G;
				
				for(let j=0;j<listLength;j++)
				{
					if(i==j)continue;
					
					const obj2=objList[j];
					const data2=objects.get(obj2);
					if(!data2) continue;
					if(!data2.gravityReceive)continue;
					
					const dvec=vec3a;
					dvec.subVectors(obj1.position,obj2.position);
					const distanceSquared=dvec.lengthSq();
					const acceleration=gm/(distanceSquared);
					//now apply acc to v
					const accVec=vec3b;
					accVec.copy(dvec).setLength(acceleration*dt);
					data2.velocity.add(accVec);
				}//for j
			}//for i
		});//traverse
	}//method
	this.get=obj=>{
		return objects.get(obj);
	}
}

console.time("creation time");
const stats=new Stats();
const customStat=new Stats.Panel("calls","#000","#ddd");
stats.addPanel(customStat)
document.body.appendChild(stats.dom);
stats.showPanel(0);

const inputPanel=new InputPanel();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(6,3,-12);
camera.lookAt(0,0,0);
scene.add(camera);
const renderer = new THREE.WebGLRenderer();
const orbitCon=new OrbitControls(camera,renderer.domElement );
orbitCon.enableDamping=true;

function resize(){
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio(devicePixelRatio); 
	camera.aspect=window.innerWidth/ window.innerHeight;
	camera.updateProjectionMatrix()
}

resize();
addEventListener("resize",resize );
document.body.appendChild( renderer.domElement );
const physics=new Physics();


inputPanel.add(physics,"speed",0.25,10,0.25)
const sphereGeo=new THREE.SphereGeometry();
const uniforms={
	planets:{value:[]}
}
function addPlanet(isStar, color ,radius, mass, pos , v)
{
	let mat;
	if(isStar)
	mat=new THREE.MeshBasicMaterial({
		color,
	}); 
	else 
	mat=new THREE.MeshStandardMaterial({
		color,
		roughness:0.3,
		metalness:0,
	}); 
	
	
	let p=new THREE.Mesh(sphereGeo,mat);
	if(!isStar){
		p.castShadow=true;
		p.receiveShadow=true; 
		
	}
	p.scale.multiplyScalar(radius);
	p.position.copy(pos);
	physics.set(p,{mass,velocity:v.clone(), gravityCast:true, gravityReceive:true});
	scene.add(p);
	uniforms.planets.value.push({
		pos:p.position,
		mass,
	});
	addPlanet.count++;
	
	return p;
}
addPlanet.count=0;
const sun=addPlanet(true,0xffff1f,1,1e10,vec3a.set(0,0,0),vec3b.set(0,0,0) );
addPlanet(false,0x8585ff,0.3,2e9,vec3a.set(0,0,8.7),vec3b.set(0.3,0.,0) );
addPlanet(false,0xf5f5ff,0.1,1,vec3a.set(0,0,8.0),vec3b.set(0.73,0.,0) );

const planeGeo=new THREE.PlaneGeometry(40,40,100,100);
planeGeo.rotateX(-Math.PI/2);
const material=new THREE.PointsMaterial({
	size:0.1,
	onBeforeCompile(s){
		
	Object.assign(s.uniforms, uniforms)
	s.vertexShader=`
	
	struct Planet{
		float mass;
		vec3 pos;
	};
	uniform Planet planets[${addPlanet.count}];
	${s.vertexShader}
	`.replace("#include <begin_vertex>",`
	#include <begin_vertex>
	vec3 g=vec3(0.0);
	vec3 d;
	#pragma unroll_loop_start
	for(int i=0;i<${addPlanet.count};i++){
		d = position - planets[i].pos;
		g+=(5e-10*planets[i].mass/dot(d,d))*d;
	}
	#pragma unroll_loop_end
	transformed.y-=smoothstep(0.,3.,length(g));
	`);
	log(s.vertexShader)
	s.fragmentShader=s.fragmentShader.replace("#include <clipping_planes_fragment>",`
		#include <clipping_planes_fragment>
		//makes points round
		if(length(gl_PointCoord-0.5)>0.5)discard;
	`);
	
}});
const plane=new THREE.Points(planeGeo, material );
scene.add(plane);
plane.translateY(-1.0)
const light=new THREE.PointLight();
light.position.copy(sun.position);
scene.add( light );
renderer.shadowMap.enabled=true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
light.shadow.mapSize.width = 256; // default 512
light.shadow.mapSize.height = 256; // default 512
light.shadow.camera.near = 0.5; // default 0.5
light.shadow.camera.far = 500; //
light.castShadow = true; 

renderer.compile(scene,camera);
console.timeEnd("creation time");

renderer.setAnimationLoop(animate);

function animate(time) 
{
	physics.do(scene);
	orbitCon.update();
	light.position.copy(sun.position);
	
	renderer.render( scene, camera);
	//Do you feel the points are big or non-perspective ? If yes, let me know.
	//Do you feel some suddenly slow frames after a few 60fps seconds ?
	//If yes let me know , tell me in the issues
	customStat.update(50,100);
	stats.update();
}
//
