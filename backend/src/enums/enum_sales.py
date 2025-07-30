from enum import Enum

class VendaStatusEnum(Enum):
    Concluida = 'Concluida'
    Cancelada = 'Cancelada'
    
    def __str__(self) -> str:
        return self.value