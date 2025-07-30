from enum import Enum

class UsuariosStatusEnum(Enum):
    Ativo     = 'Ativo'
    Inativo   = 'Inativo'
    Bloqueado = 'Bloqueado'
    
    def __str__(self) -> str:
        return self.value
    
class UsuariosTipoEnum(Enum):
    Comum          = 'Comum'
    Administrador  = 'Administrador'
    Vendedor       = 'Vendedor'
    Gerente        = 'Gerente'
    Financeiro     = 'Financeiro'
    Mecânico       = 'Mecanico'
    Estoquista     = 'Estoquista'
    Caixa          = 'Caixa'
    Atendente      = 'Atendente'
    
    def __str__(self) -> str:
        return self.value