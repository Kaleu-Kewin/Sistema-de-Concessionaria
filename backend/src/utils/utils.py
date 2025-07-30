from unicodedata import normalize

def remover_acentos(texto: str) -> str:
    return normalize('NFKD', texto).encode('ASCII', 'ignore').decode('ASCII')