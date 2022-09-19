# Importante

Para ejecutar $\textbf{crawler.py}$, usaremos:
```
py crawler.py
```
Donde obtendremos un archivo $\textit{.sql}$ con todas las sentencias que se ejecutarán al momento de ejecutar la sentencia.

Para poder levantar todos los servicios haremos uso del comando:
```sh
docker-compose up --build
```
Para poder realizar peticiones de tipo POST al cliente, usaremos:
```sh
http://localhost:3000/inventory/search?q=<BUSQUEDA>
```
 
## Prueba
Finalmente para hacer las pruebas de las diferentes politicas de remoción que configuramos en cada uno de los servicios redis, utilizaremos el archivo $\textbf{llaves.txt}$, donde se especifican llaves que sirven para poder hacer consultas y que estas "caigan" en los contenedores especificos de redis y así poder someter a pruebas mas especificas a nuestro sistema.
Si analizamos las llaves
```
Redis3 lru:
    disco
    disc
    discover
    music
    dis
```
Si hacemos consultas secuencialmente, es decir de abajo para arriba, al agregar la ultima, nuestro servicio se verá lleno en su capacidad y debera tomar la decisión de eliminar alguna de las consultas guardadas anteriormente. Al estar configurado bajo la politica de LRU, el servicio quitara de cache la consulta hecha bajo la llave de $\textit{disco}$

El procedimiento y resultado de esta prueba queda documentado en el video que se adjuntó anteriormente y en el informe.

