function miCallback() {
    console.log("Función Callback después de 2 segundos");
}

function ejecutarCallback(callback) {
    setTimeout(callback, 2000);
}

ejecutarCallback(miCallback);