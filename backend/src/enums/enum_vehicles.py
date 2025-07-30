from enum import Enum

class VeiculoStatusEnum(Enum):
    Disponivel   = 'Disponivel'
    Indisponivel = 'Indisponivel'
    Vendido      = 'Vendido'
    Manutencao   = 'Manutencao'
    Reservado    = 'Reservado'

    def __str__(self) -> str:
        return self.value

class VeiculoTipoEnum(Enum):
    Moto       = 'Moto'
    Carro      = 'Carro'
    Caminhao   = 'Caminhao'
    Indefinido = 'Indefinido'

    def __str__(self) -> str: 
        return self.value