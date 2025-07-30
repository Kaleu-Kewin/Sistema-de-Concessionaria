from datetime     import datetime
from decimal      import Decimal
from sqlalchemy   import Enum
from src.database import db
from src.enums    import ClienteStatusEnum

class Clientes(db.Model):
    __tablename__ = 'CLIENTES'

    CLI_CODIGO   = db.Column(db.Integer,        primary_key=True, index=True)
    CLI_NOME     = db.Column(db.String(100),    nullable=False,   index=True)
    CLI_CPF      = db.Column(db.String(20),     nullable=False,   unique=True, index=True)
    CLI_TELEFONE = db.Column(db.String(20),     nullable=False,   index=True)
    CLI_EMAIL    = db.Column(db.String(100),    index=True)
    CLI_CEP      = db.Column(db.String(10),     index=True)
    CLI_ENDERECO = db.Column(db.String(150),    index=True)
    CLI_CIDADE   = db.Column(db.String(50),     index=True)
    CLI_UF       = db.Column(db.String(2),      index=True)
    CLI_SALDO    = db.Column(db.Numeric(10, 2), default=0.00)
    
    CLI_STATUS   = db.Column(
        Enum(ClienteStatusEnum, name="cliente_status_enum"), 
        nullable = False,   
        default  = ClienteStatusEnum.Ativo, 
        comment  = "Status = Ativo, Inativo, Bloqueado", 
        index    = True)
    
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at   = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(
        self, 
        nome     : str, 
        cpf      : str, 
        telefone : str, 
        email    : str = None, 
        cep      : str = None, 
        endereco : str = None, 
        cidade   : str = None, 
        uf       : str = None, 
        saldo    : Decimal = 0.00, 
        status   : ClienteStatusEnum = ClienteStatusEnum.Ativo
    ):
        self.CLI_NOME     = nome
        self.CLI_CPF      = cpf
        self.CLI_TELEFONE = telefone
        self.CLI_EMAIL    = email
        self.CLI_CEP      = cep
        self.CLI_ENDERECO = endereco
        self.CLI_CIDADE   = cidade
        self.CLI_UF       = uf
        self.CLI_SALDO    = saldo
        self.CLI_STATUS   = status
