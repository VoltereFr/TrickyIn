var anim = 0;
var info=0;
var browser =0;
const navig = navigator.userAgent;

//Pas très joli, mais efficace pour réparer les différences entre les navigateurs
if((navig.indexOf("Opera") !=-1 || navig.indexOf('OPR')) != -1 ) 
{
	//alert('Opera');
}
else if(navig.indexOf("Chromium") != -1)
{
	//alert('Chromium');
}
else if(navig.indexOf("Firefox") != -1 )
{
	//alert('Firefox');
}
else if(navig.indexOf("Chrome") != -1 && navig.indexOf("Chromium") == -1)
{
	//alert('Chrome');
	browser=2;
}			
else if(navig.indexOf("Safari") != -1 && navig.indexOf("Chrome") == -1 && navig.indexOf("Chromium") == -1)
{
	//alert('Safari');
	browser=1;
}			
else 
{
   alert('Il se peut que les fonctionnalités de ce site ne soit pas compatibles avec votre navigateur!');
}


//Quand la page est chargée, on enleve l'écran de chargement et on positionne les éléments en fct du navigateur utilisé		
window.onload = function () {
	document.querySelector('a-assets').addEventListener('loaded', () => {
		setTimeout(() => {
			document.querySelector("#loader").style.display='none';
		}, 1300);
		
		if(browser==1){
			document.querySelector('#cursor').setAttribute('position', "0 1.6 -3.2");
			document.querySelector('#base').setAttribute('position', '0 1.6 0');	
		}
		else
			document.querySelector('#cursor').setAttribute('position', "0 0 -3.2");
	});
}		
		
AFRAME.registerComponent('registerevents', {
	init: function () {
		const marker = this.el;
		//Animation quand le marker est detecté
		marker.addEventListener('markerFound', function() {					
			if(anim==0){
				anim=1;
				document.querySelector('#ar_img1').emit('anime');
				document.querySelector('#ar_logo').emit('anime');
				document.querySelector('#ar_video').emit('anime');
				document.querySelector('#ar_website').emit('anime');
				document.querySelector('#ar_mail').emit('anime');
				document.querySelector('#ar_hall').emit('anime');
				document.querySelector('#ar_linkedin').emit('anime');		
				document.querySelector('#ar_tel').emit('anime');
						
				document.querySelector('#video').play();
				
				if(info==0){
					setTimeout(() => {
						var scene = document.querySelector('#cam');
						var bubble = document.createElement("a-image");
						bubble.setAttribute('src', "#bubble_img");
						bubble.setAttribute('id', "ar_bubble");
						if(browser ==1){
							bubble.setAttribute('position', "0.3 1.83 -4");
							}
						else
							bubble.setAttribute('position', "0.3 0.23 -4");
						bubble.setAttribute('scale', "0.6 0.6 0.6");
						scene.appendChild(bubble);
					}, 600);	
					setTimeout(() => {
						document.querySelector('#cam').removeChild(document.querySelector('#ar_bubble'));
					}, 4500);
					info=1;
				}
			}					
		});

		marker.addEventListener('markerLost', function() {
			anim=0;
		});
	}
});

//Permet à un composant d'appeler des applications (telephone, mail) à partir du site.
//Si le navigateur ne le permet pas (Chrome), affiche une bulle avec les infos dedans
AFRAME.registerComponent('spe_link', {
	schema: {
		link: {type: 'string'},
		elem: {type: 'string'},
		bubble_scale: {type: 'string', default: '4 4 4'},
		bubble_pos: {type: 'string', default: '0 0 0'},
		bubble_src: {type: 'string', default: "#bubble_img"}
	},
	init: function () {
		const elem = this.el;
		const link = this.data.link;
		const parent = this.data.elem;
		const pos = this.data.bubble_pos;
		const scale = this.data.bubble_scale;
		const src = this.data.bubble_src;
		elem.addEventListener('click', function(){
			if(browser!=2)
				window.location.replace(link);
			else{										
				var scene = document.querySelector(parent);
				var bubble = document.createElement("a-image");
				bubble.setAttribute('src', src);
				bubble.setAttribute('id', "ar_link_bubble");
				bubble.setAttribute('position', pos);
				bubble.setAttribute('scale', scale);
				scene.appendChild(bubble);
			}
		});				
		if(browser==2){
			elem.addEventListener('mouseleave', function(){
				document.querySelector(parent).removeChild(document.querySelector('#ar_link_bubble'));
			});
		}
	}
});

//Permet à un composant d'appeler un site web quand selectionné	
AFRAME.registerComponent('linkable', {
	schema: {
		path: {type: 'string'}		
	},
	init: function () {
		const elem = this.el;
		const link = this.data.path;
		elem.addEventListener('click', function(){
			if(browser ==1)
				window.location.replace(link);
			else
				myWindow=window.open(link, "_blank");
			
		});
	}
});

//Permet d'amener un element au premier plan si selectionné				
AFRAME.registerComponent('enlarge', {
	schema: {
		start_pos: {type: 'string', default: '0 0 0'},
		end_pos: {type: 'string', default: '1 1 1'},
		start_scale: {type: 'string', default: '1 1 1'},
		end_scale: {type: 'string', default: '2 2 2'}			
	},
	init: function () {
		const elem = this.el;
		
		elem.setAttribute("animation__forward", "property: position; from: "+ this.data.start_pos +"; to: "+ this.data.end_pos +"; dur: 1000; easing: easeOutCubic; startEvents: forward");
		elem.setAttribute("animation__backward", "property: position; from: "+ this.data.end_pos +"; to: "+ this.data.start_pos +"; dur: 1000; easing: easeOutCubic; startEvents: backward");
		elem.setAttribute("animation__scaleup", "property: scale; from: "+ this.data.start_scale +"; to: "+ this.data.end_scale +"; dur: 1000; easing: easeOutQuad; startEvents: forward");
		elem.setAttribute("animation__scaledown", "property: scale; from: "+ this.data.end_scale +"; to: "+ this.data.start_scale +"; dur: 1000; easing: easeOutQuad; startEvents: backward");
		elem.setAttribute("animation__scale", "property: scale; from: "+ this.data.start_scale +"; to: "+ this.data.start_scale +"; dur: 100; easing: linear; startEvents: anime");
		elem.addEventListener('click', function(){
			var pos = elem.getAttribute('position');
			if(pos.z != 1){
				elem.emit('forward');
			}
		});
			
		elem.addEventListener('mouseleave', function(){
			var pos = elem.getAttribute('position');
			if(pos.z == 1){
				elem.emit('backward');
			}
		});
	}
});