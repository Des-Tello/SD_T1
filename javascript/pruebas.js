function convertStoI() {
    let a = "ca"
    let direccion = 0
    
    for(var i =0; i < a.length; i++){
        direccion += a.charCodeAt(i)
    }
    console.log(a,":",direccion%3 + 1)
}
convertStoI();