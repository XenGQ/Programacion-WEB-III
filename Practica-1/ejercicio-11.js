function encadenarpromesas(){
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(5);
        }, 1000);
    });
}

encadenarpromesas()
.then(resultado => {
    console.log("Promesa1:", resultado);
    return resultado * 2;
})
.then(resultado => {
    console.log("Promesa2:", resultado);
    return resultado * 3;
})
.then(resultado => {
    console.log("Promesa3:", resultado);
});
//Ejemplo de encadenamiento de promesas, una tras otra otra dependiendo del resultado
//anterior, haciendo un codigo mas limpio, a diferencias del uso de varios callbacks.