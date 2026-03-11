function miFuncion(mayormenor){
    let mayor = mayormenor[0];
    let menor = mayormenor[0];

    for(let num of mayormenor){
        if(num > mayor){
            mayor = num;
        }
        if(num < menor){
            menor = num;
        }
    }

    return { mayor: mayor, menor: menor };
}

let obj = miFuncion([3,1,5,4,2]);
console.log(obj); 