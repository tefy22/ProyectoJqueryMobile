var hoteles=[];	
var latG, lngG;

$(document).ready(function () {

	var marcador;	
	var contadorId=1;
	
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
		obtenerDirActual();		
	});


});
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
			div.append(datos);

			var latlngNuevo= new google.maps.LatLng(hoteles[i].latitud, hoteles[i].longitud);
			mostrarMapaNuevo(latlngNuevo);
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
		latG= event.latLng.lat();
		lngG= event.latLng.lng();
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
//----------------------MOSTRAR MAPA NUEVO--------------------------
function mostrarMapaNuevo(posNueva){
	var opciones={
		zoom:5,
		center: posNueva,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var mapa= new google.maps.Map(document.getElementById('divMapa2'),opciones);
	var marcadorNuevo= new google.maps.Marker({
		position: posNueva,
		map: mapa,
		title:"Mi Ubicacion"
	});
}

