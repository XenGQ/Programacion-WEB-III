function migrando(){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Migrando una función con promesas a async/await.");
        }, 2000);
    });
}

async function usandoAsync(){
    let resultado = await migrando();
    console.log(resultado);
}

usandoAsync();