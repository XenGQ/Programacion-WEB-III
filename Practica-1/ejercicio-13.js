function promesaaninada(){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(5);
        }, 1000);
    });
}

async function proceso(){
    let r1 = await promesaaninada();
    console.log("Promesa anidada 1:", r1);

    let r2 = r1 * 2;
    console.log("Promesa anidada 2:", r2);

    let r3 = r2 * 3;
    console.log("Promesa anidada 3:", r3);
}

proceso();
//Un codigo mucho mas limpio que el ejercicio 11, usando sync/await.