function callbackaninado(){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(5);
        }, 1000);
    });
}

async function proceso(){
    let resultado1 = await callbackaninado();
    console.log("Callback anidado 1:", resultado1);

    let resultado2 = resultado1 * 2;
    console.log("Callback anidado 2:", resultado2);

    let resultado3 = resultado2 * 3;
    console.log("Callback anidado 3:", resultado3);
}

proceso();

//El mismo ejemplo del ejercicio 11 pero con async/await, haciendo que el uso 
//de callback sea mas legible.