const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./src/controllers/searchInventory.proto"
var redis = require('redis')
var protoLoader = require("@grpc/proto-loader");

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const redis_client = redis.createClient({
    url:"redis://redis"
 });
 const redis_client2 = redis.createClient({
    url:"redis://redis2"
 });
 const redis_client3 = redis.createClient({
    url:"redis://redis3"
 });

redis_client.on('ready',()=>{
    console.log("Redis listo")
    console.log("-------------------------------------------------------------------------------------------------------------")
})
redis_client2.on('ready',()=>{
    console.log("Redis 2 listo")
    console.log("-------------------------------------------------------------------------------------------------------------")
})
redis_client3.on('ready',()=>{
    console.log("Redis 3 listo")
    console.log("-------------------------------------------------------------------------------------------------------------")
})


redis_client.connect()
redis_client2.connect()
redis_client3.connect()

console.log('Redis conection: '+redis_client.isOpen);
console.log('Redis 2 conection: '+redis_client2.isOpen);
console.log('Redis 3 conection: '+redis_client3.isOpen);



var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const InventorySearch= grpc.loadPackageDefinition(packageDefinition).InventorySearch;

const client = new InventorySearch(
    "grpc_server:50051",
    grpc.credentials.createInsecure()
  );

const searchitems=(req,res)=>{
    const busqueda=req.query.q
    let direccion = 0
    
    for(var i =0; i < busqueda.length; i++){
        direccion += busqueda.charCodeAt(i)
    }
    direccion = direccion%3 + 1;

    (async () => {

        let resp1 = false;
        let resp2 = false;
        let resp3 = false;
        let cache = null;
        let cache2 = null;
        let cache3 = null;

        let reply = await redis_client.get(busqueda);
        let reply2 = await redis_client2.get(busqueda);
        let reply3 = await redis_client3.get(busqueda);


            if(reply){
                cache = JSON.parse(reply);
                console.log("Cache: "+cache)
                console.log("Busqueda: "+busqueda)
                console.log("Encontrado en Redis 1")
                console.log("Resultados:")
                var string_total=""
                for (i in cache['product']){
                var id=cache['product'][i].id
                var title=cache['product'][i].title
                var descripcion=cache['product'][i].descripcion
                var keywords=cache['product'][i].keywords
                var link=cache['product'][i].link
                const stringsumar='id: '+id+' | title:'+title+' | descripcion:'+descripcion+' | keywords:'+keywords+' | link:'+link
                string_total=string_total+stringsumar+'\n'
                }
                console.log(string_total)
                console.log("Encontrado en Redis 1")
                console.log("--------------------------------------------------------------------------------------------------------------------------------")


                // res.status(200).json(cache)
                resp1 = true
            }
            if(reply2){
                cache2 = JSON.parse(reply2);
                console.log("Cache: "+cache2)
                console.log("Busqueda: "+busqueda)
                console.log("Encontrado en Redis 2")
                console.log("Resultados:")
                var string_total=""
                for (i in cache2['product']){
                var id=cache2['product'][i].id
                var title=cache2['product'][i].title
                var descripcion=cache2['product'][i].descripcion
                var keywords=cache2['product'][i].keywords
                var link=cache2['product'][i].link
                const stringsumar='id: '+id+' | title:'+title+' | descripcion:'+descripcion+' | keywords:'+keywords+' | link:'+link
                string_total=string_total+stringsumar+'\n'
                }
                console.log(string_total)
                console.log("Encontrado en Redis 2")
                console.log("--------------------------------------------------------------------------------------------------------------------------------")

                resp2 = true
            }
            if(reply3){
                cache3 = JSON.parse(reply3);
                console.log("Cache: "+cache3)
                console.log("Busqueda: "+busqueda)
                console.log("Encontrado en Redis 3")
                console.log("Resultados:")
                var string_total=""
                for (i in cache3['product']){
                var id=cache3['product'][i].id
                var title=cache3['product'][i].title
                var descripcion=cache3['product'][i].descripcion
                var keywords=cache3['product'][i].keywords
                var link=cache3['product'][i].link
                const stringsumar='id: '+id+' | title:'+title+' | descripcion:'+descripcion+' | keywords:'+keywords+' | link:'+link
                string_total=string_total+stringsumar+'\n'
                }
                console.log(string_total)
                console.log("Encontrado en Redis 3")
                console.log("--------------------------------------------------------------------------------------------------------------------------------")

                resp3 = true
            }

            if(resp1 || resp2 || resp3){
                res.status(200).json(cache,cache2,cache3)
            }
            
            else{
                console.log("Busqueda: "+busqueda)
                console.log("No se ha encontrado en Caché, Buscando en Postgres...")
                client.GetServerResponse({message:busqueda}, (error,items) =>{
                    if(error){
                        res.status(400).json(error);
                    }
                    else{
                        if(direccion==1){
                            data = JSON.stringify(items)
                            if (data['product']!==null){
                            redis_client.set(busqueda,data)
                            res.status(200).json(items);}
                            console.log("Guardando en redis 1...")    
                        }
                        if(direccion==2){
                            data = JSON.stringify(items)
                            if (data['product']!==null){
                            redis_client2.set(busqueda,data)
                            res.status(200).json(items);}    
                            console.log("Guardando en redis 2...")    
                        }
                        if(direccion==3){
                            data = JSON.stringify(items)
                            if (data['product']!==null){
                            redis_client3.set(busqueda,data)
                            res.status(200).json(items);}    
                            console.log("Guardando en redis 3...")    
                        }
                    }
                });
            }
    })();
}





module.exports={
 searchitems
}