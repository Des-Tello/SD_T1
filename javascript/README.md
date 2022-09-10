# Node

Para levantar las instancias dentro de la topología
```sh
docker-compose up --build
```
POST
```sh
http://localhost:3000/inventory/search?q=Mens
```


Para bajar las instancias del compose
```sh
docker-compose down
```

Borrar cache en contenedores
```sh
docker system prune -a
```

Borrar cache en volumenes
```sh
docker volume rm $(docker volume ls -q)
```