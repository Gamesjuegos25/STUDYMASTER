#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import random
from pathlib import Path

class EstudioApp:
    def __init__(self):
        self.preguntas = []
        self.indice_actual = 0
        self.preguntas_dificiles = []
        self.progreso = {}
        
    def cargar_archivo(self, ruta_archivo):
        """Carga preguntas y respuestas desde un archivo txt"""
        try:
            with open(ruta_archivo, 'r', encoding='utf-8') as archivo:
                contenido = archivo.read().strip()
                lineas = [linea.strip() for linea in contenido.split('\n')]
                
                self.preguntas = []
                i = 0
                while i < len(lineas):
                    if lineas[i] and i + 1 < len(lineas) and lineas[i + 1]:
                        self.preguntas.append({
                            'id': len(self.preguntas),
                            'pregunta': lineas[i],
                            'respuesta': lineas[i + 1]
                        })
                        i += 2
                        # Saltar líneas vacías
                        while i < len(lineas) and not lineas[i]:
                            i += 1
                    else:
                        i += 1
                        
                print(f"✅ Se cargaron {len(self.preguntas)} preguntas correctamente.")
                return True
                
        except FileNotFoundError:
            print(f"❌ Error: No se encontró el archivo {ruta_archivo}")
            return False
        except Exception as e:
            print(f"❌ Error al cargar el archivo: {e}")
            return False
    
    def mostrar_menu_principal(self):
        """Muestra el menú principal"""
        while True:
            print("\n" + "="*50)
            print("📚 APLICACIÓN DE ESTUDIO")
            print("="*50)
            
            if not self.preguntas:
                print("1. 📁 Cargar archivo de preguntas")
                print("2. 🚪 Salir")
                
                opcion = input("\nSelecciona una opción (1-2): ").strip()
                
                if opcion == '1':
                    self.cargar_archivo_interactivo()
                elif opcion == '2':
                    print("👋 ¡Hasta luego!")
                    break
                else:
                    print("❌ Opción inválida")
            else:
                print(f"📊 Preguntas cargadas: {len(self.preguntas)}")
                print(f"📈 Progreso: {self.indice_actual}/{len(self.preguntas)}")
                print("\n1. 🎯 Comenzar/Continuar estudio")
                print("2. 🔀 Mezclar preguntas")
                print("3. 📁 Cargar nuevo archivo")
                print("4. 📋 Ver preguntas difíciles")
                print("5. 🔄 Reiniciar progreso")
                print("6. 🚪 Salir")
                
                opcion = input("\nSelecciona una opción (1-6): ").strip()
                
                if opcion == '1':
                    self.estudiar()
                elif opcion == '2':
                    self.mezclar_preguntas()
                elif opcion == '3':
                    self.cargar_archivo_interactivo()
                elif opcion == '4':
                    self.mostrar_preguntas_dificiles()
                elif opcion == '5':
                    self.reiniciar_progreso()
                elif opcion == '6':
                    print("👋 ¡Hasta luego!")
                    break
                else:
                    print("❌ Opción inválida")
    
    def cargar_archivo_interactivo(self):
        """Carga un archivo de forma interactiva"""
        print("\n📁 CARGAR ARCHIVO")
        print("Archivos .txt disponibles en la carpeta actual:")
        
        archivos_txt = [f for f in os.listdir('.') if f.endswith('.txt')]
        
        if archivos_txt:
            for i, archivo in enumerate(archivos_txt, 1):
                print(f"{i}. {archivo}")
            print("0. Escribir ruta manualmente")
            
            try:
                opcion = int(input("\nSelecciona un archivo (número): "))
                if 1 <= opcion <= len(archivos_txt):
                    ruta = archivos_txt[opcion - 1]
                elif opcion == 0:
                    ruta = input("Ingresa la ruta del archivo: ").strip()
                else:
                    print("❌ Opción inválida")
                    return
            except ValueError:
                print("❌ Debes ingresar un número")
                return
        else:
            ruta = input("No se encontraron archivos .txt. Ingresa la ruta del archivo: ").strip()
        
        if self.cargar_archivo(ruta):
            self.indice_actual = 0
    
    def estudiar(self):
        """Inicia el modo de estudio"""
        if not self.preguntas:
            print("❌ No hay preguntas cargadas")
            return
            
        print(f"\n🎯 MODO ESTUDIO")
        print("Controles: [Enter] = Mostrar respuesta/Siguiente | [a] = Anterior | [d] = Marcar difícil | [q] = Salir")
        
        while self.indice_actual < len(self.preguntas):
            self.mostrar_pregunta_actual()
            
            if self.indice_actual >= len(self.preguntas):
                break
                
        print("\n🎉 ¡Felicitaciones! Has completado todas las preguntas.")
        input("Presiona Enter para continuar...")
    
    def mostrar_pregunta_actual(self):
        """Muestra la pregunta actual"""
        if self.indice_actual >= len(self.preguntas):
            return
            
        pregunta_obj = self.preguntas[self.indice_actual]
        
        print("\n" + "="*60)
        print(f"Pregunta {self.indice_actual + 1}/{len(self.preguntas)}")
        
        # Barra de progreso
        progreso = int((self.indice_actual / len(self.preguntas)) * 20)
        barra = "█" * progreso + "░" * (20 - progreso)
        print(f"Progreso: [{barra}] {self.indice_actual}/{len(self.preguntas)}")
        
        # Marcar si es difícil
        es_dificil = pregunta_obj['id'] in self.preguntas_dificiles
        if es_dificil:
            print("⭐ [MARCADA COMO DIFÍCIL]")
        
        print(f"\n❓ {pregunta_obj['pregunta']}")
        
        # Esperar a que el usuario presione Enter para ver la respuesta
        while True:
            comando = input("\n[Enter] Ver respuesta | [a] Anterior | [q] Salir: ").strip().lower()
            
            if comando == '' or comando == 'enter':
                print(f"\n💡 Respuesta: {pregunta_obj['respuesta']}")
                break
            elif comando == 'a' and self.indice_actual > 0:
                self.indice_actual -= 1
                return
            elif comando == 'q':
                return
            else:
                print("❌ Comando inválido")
        
        # Opciones después de ver la respuesta
        while True:
            opciones = "[Enter] Siguiente"
            if self.indice_actual > 0:
                opciones += " | [a] Anterior"
            opciones += " | [d] Marcar/Desmarcar difícil | [q] Salir"
            
            comando = input(f"\n{opciones}: ").strip().lower()
            
            if comando == '' or comando == 'enter':
                self.indice_actual += 1
                break
            elif comando == 'a' and self.indice_actual > 0:
                self.indice_actual -= 1
                break
            elif comando == 'd':
                self.alternar_dificultad(pregunta_obj['id'])
            elif comando == 'q':
                return
            else:
                print("❌ Comando inválido")
    
    def alternar_dificultad(self, pregunta_id):
        """Marca o desmarca una pregunta como difícil"""
        if pregunta_id in self.preguntas_dificiles:
            self.preguntas_dificiles.remove(pregunta_id)
            print("✅ Pregunta desmarcada como difícil")
        else:
            self.preguntas_dificiles.append(pregunta_id)
            print("⭐ Pregunta marcada como difícil")
    
    def mezclar_preguntas(self):
        """Mezcla aleatoriamente las preguntas"""
        random.shuffle(self.preguntas)
        self.indice_actual = 0
        print("🔀 Preguntas mezcladas aleatoriamente")
    
    def mostrar_preguntas_dificiles(self):
        """Muestra las preguntas marcadas como difíciles"""
        if not self.preguntas_dificiles:
            print("📝 No hay preguntas marcadas como difíciles")
            return
            
        print(f"\n⭐ PREGUNTAS DIFÍCILES ({len(self.preguntas_dificiles)})")
        print("="*50)
        
        for pregunta_obj in self.preguntas:
            if pregunta_obj['id'] in self.preguntas_dificiles:
                print(f"\n❓ {pregunta_obj['pregunta']}")
                print(f"💡 {pregunta_obj['respuesta']}")
        
        input("\nPresiona Enter para continuar...")
    
    def reiniciar_progreso(self):
        """Reinicia el progreso del estudio"""
        self.indice_actual = 0
        self.preguntas_dificiles = []
        print("🔄 Progreso reiniciado")

def main():
    """Función principal"""
    print("🚀 Iniciando aplicación de estudio...")
    app = EstudioApp()
    
    # Intentar cargar archivo de ejemplo si existe
    if os.path.exists('preguntas_ejemplo.txt'):
        print("📁 Se encontró archivo de ejemplo. ¿Quieres cargarlo?")
        if input("(s/n): ").strip().lower() == 's':
            app.cargar_archivo('preguntas_ejemplo.txt')
    
    app.mostrar_menu_principal()

if __name__ == "__main__":
    main()