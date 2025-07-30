from datetime     import datetime
from decimal      import Decimal
from sqlalchemy   import Enum
from src.database import db
from src.enums    import UsuariosTipoEnum, UsuariosStatusEnum

class Usuarios(db.Model):
    __tablename__ = 'USUARIOS'

    USU_CODIGO = db.Column(db.Integer,     primary_key=True, autoincrement=True)
    USU_EMAIL  = db.Column(db.String(120), unique=True, nullable=False)
    USU_NOME   = db.Column(db.String(100), nullable=False)
    USU_SENHA  = db.Column(db.String(100), nullable=False)
    
    USU_TIPO   = db.Column(
        Enum(UsuariosTipoEnum, name="usuarios_tipo_enum"),   
        nullable = False,   
        comment  = "Tipo: Comum, Administrador, Vendedor, Gerente, Financeiro, Mecânico, Estoquista, Caixa, Atendente", 
        index    = True)
    
    USU_STATUS = db.Column(
        Enum(UsuariosStatusEnum, name="usuarios_status_enum"),
        nullable = False,   
        default  = UsuariosStatusEnum.Ativo, 
        comment  = "Status: Ativo, Inativo, Bloqueado", 
        index    = True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(
        self,
        nome   : str,
        email  : str,
        senha  : str,
        tipo   : UsuariosTipoEnum   = UsuariosTipoEnum.Comum,
        status : UsuariosStatusEnum = UsuariosStatusEnum.Ativo
    ):
        self.USU_NOME   = nome
        self.USU_EMAIL  = email
        self.USU_SENHA  = senha
        self.USU_TIPO   = tipo
        self.USU_STATUS = status