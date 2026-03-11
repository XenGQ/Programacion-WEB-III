// Primero definimos una función que usa callback
function funcionCallback(callback){
    callback("Convirtiendo un callback en una promesa");
}

// Luego creamos una promesa que usa ese callback
function callbackaPromesa(){
    return new Promise(resolve => {
        funcionCallback(resultado => {
            resolve(resultado);
        });
    });
}

// Usamos la promesa
callbackaPromesa().then(mensaje => {
    console.log(mensaje);
});