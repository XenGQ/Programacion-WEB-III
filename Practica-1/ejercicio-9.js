function promesa() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Callback en 3 segundos");
        }, 3000);
    });
}

promesa().then(mensaje => {
    console.log(mensaje);
});