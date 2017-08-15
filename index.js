var hoteles=[];	
var latG, lngG;
var marcador;	
var contadorId=1;

//---------------CAMBIAR DE PAGINA--------------------
function cambiarPagina(page){
	$.mobile.changePage("#"+page,{
		transition:'flow'
	});
}
//-----------------LIMPIAR CAMPOS---------------------
function limpiarCampos(){
	$("#nombre").val("");
	$("#ciudad").val("");
	$("#telefono").val("");
	var selectEstrellas= $("#estrellas");
	selectEstrellas[0].selectedIndex=0;
	selectEstrellas.selectmenu('refresh');	
}
//------------------MOSTRAR DATOS AL SELECCIONAR UN DATO--------------------
function mostrarDatos(id){
	cambiarPagina('pagDetalle');
	var div= $("#datos");

	for (var i=0; i<hoteles.length; i++) {
		if (id==hoteles[i].id){
			var datos="";
			datos+="<b>Nombre: </b>"+hoteles[i].nombre+"<br>";
			datos+="<b>Ciudad: </b>"+hoteles[i].ciudad+"<br>";
			datos+="<b>Telefono: </b>"+hoteles[i].telefono+"<br>";
			datos+="<b>Estrellas: </b>"+hoteles[i].estrellas+"<br>";
			div.html(datos);

			var latlngNuevo= new google.maps.LatLng(hoteles[i].latitud, hoteles[i].longitud);
			var opciones={
				zoom:5,
				center: latlngNuevo,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			var mapa= new google.maps.Map(document.getElementById('divMapa2'),opciones);
			var marcadorNuevo= new google.maps.Marker({
				position: latlngNuevo,
				map: mapa,
				title:"Mi nueva ubicacion"
			});
			
		}else{
			console.log("No encontrado")
		}
	}	
}
//--------------MAPA---------------------------------
function mostrarMapa(posicion){
	var opciones={
		zoom:5,
		center:posicion,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var mapa= new google.maps.Map(document.getElementById('divMapa'),opciones);
	marcador= new google.maps.Marker({
		position: posicion,
		map: mapa,
		draggable: true,
		title:"Mi Ubicacion"
	});
	google.maps.event.addListener(marcador,'dragend',function(event){
		latG= event.latLng.lat();//se guarda en las respectivas variables la nueva posicion del marcador
		lngG= event.latLng.lng();//se guarda en las respectivas variables la nueva posicion del marcador
		console.log(latG);
	})
}
function exito(pos){
	var latlng= new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
	mostrarMapa(latlng);
}
function fallida(error){
	if (error.code==0){
		alert("No se puede obtener la posicion actual");
	}else if (error.code==1){
		alert("Algo ha salido mal!");
	}else if (error.code==2){
		alert("No has aceptado compartir tu ubicacion");
	}else if (error.code==3){
		alert("Hemos superado el tiempo de espera");
	}
}
function obtenerDirActual(){
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(exito, fallida,{
			maximumAge: 500000,
			enableHighAccuracy: true,//que tenga alta precision
            timeout: 6000
		});
	}
}
//---------------------------------------------------------------------------
$(document).ready(function () {	
	
	$("#btnRegistrarHotel").click(function(){
		obtenerDirActual();
		cambiarPagina('pagRegistrar');
	});

	$("#btnListarHoteles").click(function(){		
		$("#ListaDatos").empty();

		for (var i=0; i<hoteles.length; i++) {
			var datos= $("<a></a>").text(hoteles[i].id+"- "+hoteles[i].nombre);
			var lista=  $("<li></li>").html(datos);	
			datos.attr("class","ui-btn");
			datos.attr("onclick","mostrarDatos("+hoteles[i].id+")");		
			$("#ListaDatos").append(lista);
		}
		cambiarPagina('pagListar');
	});

	$(".volver").click(function(){
		cambiarPagina('pagInicio');
	});

	$("#btnVolverLista").click(function(){
		cambiarPagina('pagListar');
	});

	$("#btnRegistrar").click(function(){
		var id= contadorId;		
		var nombre= $("#nombre").val();
		var ciudad= $("#ciudad").val();
		var telefono= $("#telefono").val();
		var estrellas= $("#estrellas").val();

		if (nombre.trim().length==0 || ciudad.trim().length==0 || telefono.trim().length==0 
			|| estrellas.trim().length==0){
			alert("Debes todos los campos");
			$("#nombre, #ciudad, #telefono").css({
				"backgroundColor":"#F9DFDE",
				"border":"1px solid red"
			});
		}else{
			$("#nombre, #ciudad, #telefono").css({
				"backgroundColor":"white",
				"border":"none"
			});
			var hotel={
				id: id,
				nombre: nombre,
				ciudad: ciudad,
				telefono: telefono,
				estrellas: estrellas,
				latitud: latG,
				longitud: lngG
			};
			hoteles.push(hotel);
			alert("Datos Guardados!");
			limpiarCampos();
			contadorId++;
		}				
	});
});


