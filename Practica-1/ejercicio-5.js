function miFuncion(frase){
    let invertida = frase.split("").reverse().join("");
    return frase === invertida;
}

let band1 = miFuncion("oruro");
console.log(band1);

let band2 = miFuncion("hola");
console.log(band2); 