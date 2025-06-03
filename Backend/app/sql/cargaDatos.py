import json
import requests
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

class TestDatosOvacademy:

    def __init__(self):
        with open('datos.json', 'r', encoding='utf-8') as file:
            data = json.load(file)
            self.user = data['user']
            self.semestre = data['semestre']
            self.aula = data['aula']
            self.asignaciones_profesor_aula = [data['asignar_profesor_al_aula']]
            self.unidades = data['unidades']
            self.contenidos = data['contenidos']
            self.evaluaciones = data['evaluaciones']
            self.token = None
            self.type_id = None
            self.hora_inicio = datetime.now()

    def _post_request(self, url, data, tipo, identificador = ''):
        try:
            headers = {
                "token": f"{self.token}"
            }
            response = requests.post(url, json=data, headers=headers)
            if response.status_code in [200, 201]:
                print(f"{tipo} {identificador} creado exitosamente.")
            else:
                print(f"Error al crear {tipo} {identificador}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Error al crear {tipo} {identificador}: {str(e)}")

    def iniciar_sesion_user(self, email, password):

        url = "http://localhost:3333/ovacademy/auth/login"

        datos_login = {
            "email": email,
            "password": password
        }

        response = requests.post(url, json=datos_login)

        if response.status_code == 200:
            data = response.json()
            self.token = data.get("token")
            self.type_id = data.get("type")
            print(f"Inicio de sesión exitoso. Tipo: {self.type_id}, Token: {self.token}")

        else:
            print(f"Error al iniciar sesión. Código de estado: {response.status_code}")
            return None, None
 

    def cargar_usuarios(self):
        url = "http://localhost:3333/ovacademy/user"
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(self._post_request, url, usuario, "Usuario", usuario['email']) for usuario in self.user]
            for future in as_completed(futures):
                future.result()

    def cargar_semestre(self):
        url = "http://localhost:3333/ovacademy/semestre"
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [
                executor.submit(self._post_request, url, semestre, "Semestre", semestre['nombre'])
                for semestre in self.semestre
            ]
            for future in as_completed(futures):
                future.result()

    def cargar_aula(self):

        url = "http://localhost:3333/ovacademy/aula"

        for aula in self.aula:

            headers = {
                "token": f"{self.token}"
            }
            print(aula)
            response = requests.post(url, json=aula, headers=headers)
    
            if response.status_code == 201:
                print(f"aula {aula['nombre']} creado exitosamente.")
            else:
                print("Error al crear una aula")  

    def asignar_profesor_al_aula(self):
        url = "http://localhost:3333/ovacademy/semestre/aula"
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [
                executor.submit(
                    self._post_request,
                    url,
                    asignacion,
                    "AsignaciónProfesor",
                    "Aula"
                )
                for asignacion in self.asignaciones_profesor_aula
            ]
            for future in as_completed(futures):
                future.result()

    def cargar_unidades(self):

        url = "http://localhost:3333/ovacademy/unidades"

        for unidades in self.unidades:

            headers = {
                "token": f"{self.token}"
            }
            response = requests.post(url, json=unidades, headers=headers)
    
            if response.status_code == 200:
                print(f"unidad {unidades['modulo']} creado exitosamente.")
            else:
                print("Error al crear una unidad")   

    def cargar_contenido(self):

        url = "http://localhost:3333/ovacademy/contenido"

        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [
                executor.submit(self._post_request, url, contenido, "Contenido", contenido['nombre'])
                for contenido in self.contenidos
            ]
            for future in as_completed(futures):
                future.result() 

    def cargar_evaluaciones(self):

        url = "http://localhost:3333/ovacademy/evaluaciones"

        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [
                executor.submit(self._post_request, url, evaluacion, "evaluacion")
                for evaluacion in self.evaluaciones
            ]
            for future in as_completed(futures):
                future.result() 

    def main(self):

        # self.cargar_usuarios()
        # self.cargar_semestre()
        # self.cargar_aula()

        self.iniciar_sesion_user("Lisbeth.fernandez@gmail.com", "1")
        # self.cargar_unidades()
        # self.cargar_contenido()

        self.cargar_evaluaciones()


        
        
        self.hora_fin = datetime.now()
        print(f"Start Script - {self.hora_inicio}")
        print(f"Finish Script - {self.hora_fin}")
        print(f"Diferencia: {self.hora_fin - self.hora_inicio}")

if __name__ == "__main__":
    test_datos_ovacademy = TestDatosOvacademy()
    test_datos_ovacademy.main()









    # def asignar_profesor_al_aula(self):

    #     url = "http://localhost:3333/ovacademy/semestre/aula"

    #     for semestre in self.asignaciones_profesor_aula:

            # headers = {
            #     "token": f"{self.token}"
            # }
            # response = requests.post(url, json=unidades, headers=headers)
    
    #         if response.status_code == 200:
    #             print(f"asociar profesor creado exitosamente.")
    #         else:
    #             print(f"Error al crear al asociar un profesor")   