import logging
import os

from datetime import datetime

os.makedirs('logs', exist_ok=True)

logger = logging.getLogger('logger')
logger.setLevel(logging.DEBUG)

formato = logging.Formatter(
    fmt='%(asctime)s | %(levelname)s | %(message)s',
    datefmt='%d/%m/%Y %H:%M:%S'
)

arquivo_handler = logging.FileHandler(
    f'logs/sistema_{datetime.now().strftime("%d-%m-%Y")}.log',
    encoding='utf-8'
)
arquivo_handler.setFormatter(formato)

if not logger.handlers:
    logger.addHandler(arquivo_handler)

def log_info(origem: str, mensagem: str):
    logger.info(f'{origem} | {mensagem}')

def log_warning(origem: str, mensagem: str):
    logger.warning(f'{origem} | {mensagem}')

def log_error(origem: str, erro: Exception):
    logger.error(f'\n{origem} | {type(erro).__name__} | {erro}\n')

def log_critical(origem: str, mensagem: str):
    logger.critical(f'\n{origem} | {mensagem}\n')

