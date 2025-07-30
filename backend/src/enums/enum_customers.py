from enum import Enum

class ClienteStatusEnum(Enum):
    Ativo     = 'Ativo'
    Inativo   = 'Inativo'
    Bloqueado = 'Bloqueado'
    
    def __str__(self) -> str:
        return self.value