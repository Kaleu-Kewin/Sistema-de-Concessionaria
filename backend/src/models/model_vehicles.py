from datetime     import datetime
from decimal      import Decimal
from sqlalchemy   import Enum
from src.database import db
from src.enums    import VeiculoTipoEnum, VeiculoStatusEnum

class Veiculos(db.Model):
    __tablename__ = 'VEICULOS'

    VEI_CODIGO = db.Column(db.Integer,        primary_key=True, index=True)
    VEI_PLACA  = db.Column(db.String(10),     nullable=False,   unique=True)    
    VEI_MARCA  = db.Column(db.String(50),     nullable=False,   index=True)
    VEI_MODELO = db.Column(db.String(50),     nullable=False,   index=True)
    VEI_PRECO  = db.Column(db.Numeric(10, 2), nullable=False,   default=0.00, index=True)
    VEI_ANO    = db.Column(db.Integer,        nullable=False,   index=True)
    VEI_KM     = db.Column(db.Numeric(10, 2), default=0)
    VEI_COR    = db.Column(db.String(30),     index=True)
    
    VEI_TIPO   = db.Column(
        Enum(VeiculoTipoEnum, name="veiculo_tipo_enum"),   
        nullable = False,   
        default  = VeiculoTipoEnum.Indefinido, 
        comment  = "Tipo = Moto, Carro, Caminhao, Indefinido", 
        index    = True)
    
    VEI_STATUS = db.Column(
        Enum(VeiculoStatusEnum, name="veiculo_status_enum"), 
        nullable = False,   
        default  = VeiculoStatusEnum.Disponivel, 
        comment  = "Status = Disponivel, Indisponivel, Vendido, Manutencao, Reservado", 
        index    = True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(
        self, 
        placa  : str,  
        marca  : str, 
        modelo : str, 
        preco  : Decimal, 
        ano    : int, 
        cor    : str = None,
        km     : Decimal = 0.00,
        tipo   : VeiculoTipoEnum = VeiculoTipoEnum.Indefinido, 
        status : VeiculoStatusEnum = VeiculoStatusEnum.Disponivel
    ):
        self.VEI_PLACA  = placa
        self.VEI_TIPO   = tipo
        self.VEI_MARCA  = marca
        self.VEI_MODELO = modelo
        self.VEI_PRECO  = preco
        self.VEI_ANO    = ano
        self.VEI_COR    = cor
        self.KM         = km
        self.VEI_STATUS = status
