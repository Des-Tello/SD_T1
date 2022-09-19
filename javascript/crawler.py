from codecs import ignore_errors
from distutils.log import error
from netrc import netrc
import pandas as pd

def TituloDescKey(Objeto):
    # Titulo y Descripcion
    import requests
    from bs4 import BeautifulSoup
    Objeto2 = {}
    try:
        URL = str(Objeto['ClickURL'])
        page = requests.get(URL,timeout=5)
        soup = BeautifulSoup(page.content, "html.parser")
        titulo = soup.find('title')
        descripcion = soup.find("meta", {"name":"description"})['content'].replace("\n","")
        keywords = soup.find("meta", {"name":"keywords"})['content']
        Objeto2 = {
            'ID': Objeto['AnonID'],
            'Title': titulo.get_text().strip(),
            'Descripcion': descripcion.replace("'",'').strip(),
            'Keywords': keywords.strip(),
            'URL': URL
        }
    except:
        # print(error)
        pass
    return Objeto2

def toSQL():
    i = 0
    # Lectura de txt en fomato tabla, ignorando lineas con nulo contenido y pasandolas a diccionario completamente. 
    # La llave de este diccionario es el indice de la tabla y los valores para estos objeto es cada fila
    df = pd.read_table("user-ct-test-collection-09.txt", on_bad_lines='skip',nrows=15000).to_dict(orient= 'index')
    # Diccionario de datos completos para guardar cada fila sin nan
    DatosCompletos = {}
    # Arreglo para guardar los datos completos
    ArregloDatos = []
    # Arreglo para ir guardando las llaves, para ser ingresadas posteriormente
    llaves = []
    # Arreglo para ir guardando los valores para cada llave y asi ingresarse posteriormente
    datos = []
    # Flag que nos sirve para ver si uno de los diccionarios contiene un nan
    NAN = False
    # Por cada fila en el txt
    for fila in df:
        # Por cada index del archivo, es decir recorremos los valores de la fila
        for llave1 in df[fila]:
            # Encontre un nan => Flag arriba
            if pd.isna(df[fila][llave1]) and type(df[fila][llave1]) is float:
                NAN = True
                break 
            # Agregos las llaves y su respectivo valor a los arreglos 
            llaves.append(llave1)
            datos.append(df[fila][llave1])
        
        # Si en el recorrido anterior no encontramos un nan, procedemos a crear el objeto y agregalo al arreglo
        if NAN == False:
            DatosCompletos = {
                llaves[0]: datos[0],
                llaves[1]: datos[1],
                llaves[2]: datos[2],
                llaves[3]: datos[3],
                llaves[4]: datos[4]
            }
            ArregloDatos.append(DatosCompletos)
            # print(i)
            # i = i + 1

        # Reinicio de variables
        NAN = False
        llaves = []
        datos = []
        DatosCompletos = {}

    # WebScreping
    print('TITULOS DESCRIPCION Y KEYWORDS')
    i = 0
    ArregloDatosFiltrado = []
    for fila in ArregloDatos:
        Aux = TituloDescKey(fila)
        if Aux:
            ArregloDatosFiltrado.append(TituloDescKey(fila))
  

    # Escritura archivo .sql
    print('ESCRIBIENDO SQL')
    with open('readme.sql', 'w') as f:
        f.write("CREATE TABLE Items(Id INT, Title VARCHAR(255), Descripcion VARCHAR(255), keywords VARCHAR(255), link VARCHAR(255));\n")
        for dato in ArregloDatosFiltrado:
            for llave in dato:
                llaves.append(llave)
                datos.append(dato[llave])
            print(llaves)
            print(datos)
            try:
                consulta = "INSERT INTO items(Id, Title, Descripcion, keywords, link) VALUES ("+str(datos[0])+','+'"'+str(datos[1])+'"'+','+'"'+str(datos[2])+'"'+','+'"'+str(datos[3])+'"'+','+'"'+str(datos[4])+'"'+");\n"
                f.write(consulta)
            except:
                pass
            llaves = []
            datos = []

    print('TARIAMOS')
# Llamada a la funcion
toSQL()