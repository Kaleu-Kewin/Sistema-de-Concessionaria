from datetime     import datetime, date
from decimal      import Decimal
from sqlalchemy   import Enum
from src.database import db
from src.enums    import VendaStatusEnum

class Vendas(db.Model):
    __tablename__ = 'VENDAS'
    
    VEN_CODIGO = db.Column(db.Integer,        primary_key=True, index=True)
    VEI_CODIGO = db.Column(db.Integer,        db.ForeignKey('VEICULOS.VEI_CODIGO'), nullable=False, index=True)
    CLI_CODIGO = db.Column(db.Integer,        db.ForeignKey('CLIENTES.CLI_CODIGO'), nullable=False, index=True)
    VEN_DATA   = db.Column(db.Date,           default=date.today, nullable=False, index=True)
    VEN_VALOR  = db.Column(db.Numeric(10, 2), nullable=False, default=0.00, index=True)
    
    VEN_STATUS = db.Column(
        Enum(VendaStatusEnum, name="venda_status_enum"), 
        nullable = False, 
        comment  = "Status = Concluida, Cancelada", 
        index    = True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    veiculo    = db.relationship('Veiculos', backref='vendas')
    cliente    = db.relationship('Clientes', backref='vendas')

    def __init__(
        self, 
        veiculo_cod : int, 
        cliente_cod : int, 
        data        : date, 
        valor       : Decimal, 
        status      : VendaStatusEnum = VendaStatusEnum.Concluida
    ):
        self.VEI_CODIGO = veiculo_cod
        self.CLI_CODIGO = cliente_cod
        self.VEN_DATA   = data or date.today()
        self.VEN_VALOR  = valor
        self.VEN_STATUS = status