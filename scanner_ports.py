#!/usr/bin/env python3
"""
Scanner de ports TCP simple
But pédagogique — à utiliser uniquement sur des systèmes que vous
possédez ou pour lesquels vous avez l'autorisation de tester.
"""

import socket
import threading
from queue import Queue

# Configuration
cible = "127.0.0.1"          # Ne scannez QUE des systèmes autorisés
plage_ports = (1, 1024)
nb_threads = 100
delai_attente = 1

# File d'attente thread-safe pour les ports
file_ports = Queue()
ports_ouverts = []
verrou = threading.Lock()


def scanner_port(port):
    """Tente de se connecter à un seul port."""
    try:
        # Création d'un objet socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(delai_attente)

        # Tentative de connexion
        resultat = sock.connect_ex((cible, port))

        if resultat == 0:
            # Le port est ouvert
            with verrou:
                ports_ouverts.append(port)
                # Tentative de récupération de la bannière
                try:
                    sock.send(b'HEAD / HTTP/1.1\r\n\r\n')
                    banniere = sock.recv(1024).decode().strip()
                    print(f"[+] Port {port} : OUVERT — {banniere[:50]}")
                except Exception:
                    print(f"[+] Port {port} : OUVERT")

        sock.close()
    except Exception:
        # Échec silencieux (port fermé, hôte injoignable, etc.)
        pass


def travailleur():
    """Traite les ports de la file tant qu'il en reste."""
    while not file_ports.empty():
        port = file_ports.get()
        scanner_port(port)
        file_ports.task_done()


def main():
    # Remplissage de la file avec la plage de ports
    for port in range(plage_ports[0], plage_ports[1] + 1):
        file_ports.put(port)

    print(f"[*] Démarrage du scan de {cible} "
          f"(ports {plage_ports[0]}-{plage_ports[1]})...")

    # Lancement des threads de travail
    threads = []
    for _ in range(nb_threads):
        t = threading.Thread(target=travailleur)
        t.start()
        threads.append(t)

    # Attente de la fin de tous les threads
    for t in threads:
        t.join()

    print(f"\n[*] Scan terminé. {len(ports_ouverts)} port(s) ouvert(s) : "
          f"{sorted(ports_ouverts)}")


if __name__ == "__main__":
    main()
