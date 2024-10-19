/**
 *
 * Jquery WebGL Rendering Plugin
 *
 * Author 	: Adrian Alibec
 * Created  : 2016/06/20
 * 
 * Jquery WebGL library
 *
 */


(function( $ ){
	
	$.fn.showModel = function(para) 
	{
		var main 		= this;

		main.elemID 	= "";
		main.objList 	= para;
		main.render_id 	= 0;
		main.m_color 	= 0x735413;
		main.clock 		= new THREE.Clock();

		main.view_angle = 45;
		main.near 		= 0.1;
		main.far 		= 2000;

		main.camera_x 	= 0;
		main.camera_y 	= 100;
		main.camera_z 	= 450;

		main.camera_lx 	= 0;
		main.camera_ly 	= 0;
		main.camera_lz 	= 0;

		main.dlight 	= 0xFFFFFF;
		main.hlight 	= 0xFFFFFF;
		main.hopacity 	= 0.3;

		main.hemi_h 	= 0.58;
		main.hemi_s 	= 0.16;
		main.hemi_l 	= 0.88;

		main.hemi_x 	= 0;
		main.hemi_y 	= 200;
		main.hemi_z 	= 0;

		main.light_x 	= -320;
		main.light_y 	= 200;
		main.light_z 	= 50;

		main.gcolor_h 	= 0.095;
		main.gcolor_s 	= 0.5;
		main.gcolor_l 	= 0.5;

		main.shininess 	= 2;
		main.ambient 	= 0x969696;
		main.amb_color 	= 0xFFFFFF;
		main.specular 	= 0xE5E5E5;
		main.opacity 	= 100;

		main.obj_scaleX = 50;
		main.obj_scaleY = 50;
		main.obj_scaleZ = 50;
        main.groundMirror = null;

        main.obj        = null;
        main.speed      = 0.01
        main.s_direct   = 1;
        main.is_stop    = 0;

		main.init 			= function()
		{
			main.initScene();
            main.initCamera();
            main.initControl();
            main.initRenderer();
            main.initLights();
			main.initElement();
			// main.dispObjects();
			main.initGround();
            main.render();

		}

		main.initElement 	= function()
		{
			document.getElementById($(this).attr("id")).appendChild(main.webGLRenderer.domElement);
		}

		main.initScene      = function()
        {
            main.scene      = new THREE.Scene();
        }

        main.initCamera     = function()
        {
            var SCREEN_WIDTH    = window.innerWidth, SCREEN_HEIGHT   = window.innerHeight;            
            var ASPECT 			= SCREEN_WIDTH / SCREEN_HEIGHT;
            
            main.camera = new THREE.PerspectiveCamera(main.view_angle, ASPECT, main.near, main.far);
            main.scene.add(main.camera);
            
            main.camera.position.set(main.camera_x, main.camera_y, main.camera_z);
            // main.camera.lookAt(new THREE.Vector3(main.camera_lx, main.camera_ly, main.camera_lz));
            // main.camera.lookAt(new THREE.Vector3(100, 0, -420));
            main.camera.lookAt(new THREE.Vector3(0, 0, 0));
        }

        main.initControl    = function()
        {
            main.orbitControls          	= new THREE.OrbitControls(main.camera);
            main.orbitControls.maxDistance 	= main.far;
        }

        main.initRenderer   = function()
        {
            main.webGLRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
            main.webGLRenderer.setSize(window.innerWidth, window.innerHeight);

            main.webGLRenderer.shadowMapEnabled = true;
            main.webGLRenderer.shadowMapSoft = true;
            
        }

        main.initGround     = function()
        {
            var groundGeo = new THREE.PlaneBufferGeometry( 3000, 3000 );
            var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );
                groundMat.color.setHSL( 1, 1, 1 );
             var ground = new THREE.Mesh( groundGeo, groundMat );
                ground.rotation.x = -Math.PI/2;
                ground.position.y = -20;
                main.scene.add( ground );
                ground.material.opacity = 0.7;
                ground.material.transparent  = true;
                ground.receiveShadow = true;

var skyGeo = new THREE.SphereGeometry( 2700, 32, 15 );
var skyMat = new THREE.MeshLambertMaterial( { color: 0xffffff, side: THREE.BackSide } );
var sky = new THREE.Mesh( skyGeo, skyMat );
main.scene.add( sky );
// var geometry = new THREE.BoxBufferGeometry( 3000, 3000, 3000 );
// var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff, side: THREE.BackSide } ) );
// main.scene.add(object);

                // MIRROR planes
                var planeGeo = new THREE.PlaneBufferGeometry( 550, 550 );

                // MIRROR planes
                main.groundMirror = new THREE.Mirror( main.webGLRenderer, main.camera, { clipBias: 0.01, textureWidth: 1000, textureHeight: 1000, color: 0xCCCCCC } );

                var mirrorMesh = new THREE.Mesh( planeGeo, main.groundMirror.material );
                mirrorMesh.add( main.groundMirror );
                mirrorMesh.rotateX( - Math.PI / 2 );
                mirrorMesh.position.y = - 23;
                mirrorMesh.receiveShadow = true;

                console.log(mirrorMesh);
                
                main.scene.add( mirrorMesh );
        }

        main.initLights     = function()
        {
            var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xFFFFFF, 0.55 );
                hemiLight.color.setHSL( 1, 1, 1 );
                hemiLight.groundColor.setHSL( 1, 1, 1 );
                hemiLight.position.set( 0, 120, 0 );
                main.scene.add( hemiLight );

            // var hemi2 = hemiLight.clone();
            //     hemi2.position.set(300, 800, -500);
            //     main.scene.add( hemi2 );
                //
            var    dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
                dirLight.color.setHSL( 0.1, 1, 0.95 );
                dirLight.position.set( -1, 0.75, 1 );
                dirLight.position.multiplyScalar( 50 );
                main.scene.add( dirLight );

                dirLight.castShadow = true;
                dirLight.shadowMapWidth = 2048;
                dirLight.shadowMapHeight = 2048;
                var d = 250;
                dirLight.shadowCameraLeft = -d;
                dirLight.shadowCameraRight = d;
                dirLight.shadowCameraTop = d;
                dirLight.shadowCameraBottom = -d;
                dirLight.shadowCameraFar = 3500;
                dirLight.shadowBias = -0.0001;

        }

        main.drawSphere     = function()
        {
            var segments = 10000;
            var geometry = new THREE.BufferGeometry();
            var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
            var positions = new Float32Array( segments * 3 );
            var colors = new Float32Array( segments * 3 );
            var r = 300;
            
            // for ( var i = 0; i < segments; i ++ ) {
            //     var x = Math.random() * r;
            //     var y = Math.random() * r - r / 2;
            //     var z = Math.random() * r - r / 2;
            //     // positions
            //     positions[ i * 3 ] = x;
            //     positions[ i * 3 + 1 ] = y;
            //     positions[ i * 3 + 2 ] = z;
            //     // colors
            //     colors[ i * 3 ] = ( x / r ) + 0.5;
            //     colors[ i * 3 + 1 ] = ( y / r ) + 0.5;
            //     colors[ i * 3 + 2 ] = ( z / r ) + 0.5;
            // }
            // geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
            // geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
            // geometry.computeBoundingSphere();
            
            // mesh = new THREE.Line( geometry, material );

            // main.scene.add( mesh );

            var geometry = new THREE.BufferGeometry();
                geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setDynamic( true ) );
                geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) );
                geometry.computeBoundingSphere();
                geometry.setDrawRange( 0, 0 );
            var material = new THREE.LineBasicMaterial( {
                vertexColors: THREE.VertexColors,
                blending: THREE.AdditiveBlending,
                transparent: true
            } );
            var linesMesh = new THREE.LineSegments( geometry, material );
            main.scene.add( linesMesh );
        }

        main.addObject 		= function(param)
        {
        	var pos_x 		= 0;
        	var pos_y 		= 0;
        	var pos_z 		= 0;

        	var material 	= null;
        	var objLoader 	= new THREE.OBJMTLLoader();
        	var obj_path 	= param.obj;

        	var mtl_path 	= param.mtl;
        	var mtl_color 	= param.color ? param.color : main.m_color;

    		var pos_x 	= param.pos_x ? param.pos_x : 0;
            var pos_y 	= param.pos_y ? param.pos_y : 0;
            var pos_z 	= param.pos_z ? param.pos_z : 0;

            var scale_x = param.scale_x ? param.scale_x : main.obj_scaleX;
            var scale_y = param.scale_y ? param.scale_y : main.obj_scaleY;
            var scale_z = param.scale_z ? param.scale_z : main.obj_scaleZ;

            var mtlLoader = new THREE.MTLLoader();

            var onProgress = function ( xhr ) {
                    if ( xhr.lengthComputable ) {
                        var percentComplete = xhr.loaded / xhr.total * 100;
                        console.log( Math.round(percentComplete, 2) + '% downloaded' );
                    }
                };

            var onError = function ( xhr ) { };

            mtlLoader.setPath( 'model/' );
            mtlLoader.load( 'Box.mtl', function( materials ) 
            {
                materials.preload();

                var objLoader = new THREE.OBJLoader();

                objLoader.setMaterials( materials );
                objLoader.setPath( 'model/' );
                objLoader.load( 'Box.obj', function ( object ) 
                {
                    object.position.x = 0;
                    object.position.y = 0;
                    object.position.z = 0;

                    var material123    = new THREE.MeshPhongMaterial(
                    {
                        specular    : 0xFFFFFF, // light
                        color       : 0x2E46C2,      // intermediate
                        emissive    : '#000000',    // dark
                        shininess   : 50 ,
                        transparent : true,
                        opacity     : 1,

                        combine: THREE.MixOperation,
                        reflectivity: 0.3,
                        // map        : texture1
                    });

                    object.children[0].castShadow     = true;
                    object.children[0].receiveShadow  = true;
                    object.children[0].material = material123;

                    main.obj = object;
                    main.obj.children[0].position.x = -100;
                    main.scene.add( object );
                });
               }, onProgress, onError );
        }

        main.render     = function() 
        {
            var delta = main.clock.getDelta();

            main.orbitControls.update(delta);

            if(main.obj && !main.is_stop)
            {
                main.obj.rotation.y = main.obj.rotation.y + main.speed;

                main.speed = main.speed + 0.003 * main.s_direct;

                if(Math.abs(Math.PI - main.obj.rotation.y) < main.speed)
                {
                    main.obj.position.x = 100;
                    main.s_direct = -1;
                    main.obj.children[0].position.x = 0;
                }

                if(Math.abs(Math.PI * 2 - main.obj.rotation.y) < main.speed)
                {
                    main.is_stop = 1;
                }
            }

            if(main.groundMirror)
            {
                main.groundMirror.render( );
            }

            requestAnimationFrame(main.render);

            main.webGLRenderer.render(main.scene, main.camera);
        }

        main.init();

        return main;
	}; 

})( jQuery );

function rotateAroundObjectAxis(object, axis, radians) 
{
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

    object.matrix.multiply(rotObjectMatrix);
    object.rotation.setFromRotationMatrix(object.matrix);
}
