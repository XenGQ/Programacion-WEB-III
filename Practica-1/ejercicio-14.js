//Primero definimos una funcion que devuleve una promesa.
function promesaacallback(){
    return new Promise(resolve => {
        resolve("Convirtiendo una promesa en un callback");
    });
}
//Luego usamos una funcion y luego then para convertirlo en un callback.
function usarCallback(callback){
    promesaacallback().then(resultado => {
        callback(resultado);
    });
}

usarCallback(function(mensaje){
    console.log(mensaje);
});