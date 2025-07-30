from sqlalchemy.exc    import SQLAlchemyError
from src               import db
from src.models        import Usuarios
from src.enums         import UsuariosStatusEnum, UsuariosTipoEnum
from src.utils         import log_info, log_error, validar_enum, remover_acentos
from werkzeug.security import generate_password_hash


class UsuariosService:
    def __init__(self) -> None:
        pass
        
    def criar_usuario(self, dados: dict) -> tuple[dict, int]:
        obrigatorios = ['email', 'nome', 'senha', 'tipo', 'status']
        
        if not dados or not all(dados.get(campo) for campo in obrigatorios):
            return {'error': 'Campos obrigatórios ausentes.'}, 400

        tipo_rmv   = remover_acentos(dados['tipo'])
        status_rmv = remover_acentos(dados['status'])
        
        tipo   = validar_enum(UsuariosTipoEnum,   tipo_rmv)
        status = validar_enum(UsuariosStatusEnum, status_rmv)

        if not tipo or not status:
            return {'error': 'Tipo ou status inválido.'}, 400

        try:       
            usuario = Usuarios(
                nome   = dados['nome'],
                email  = dados['email'],
                senha  = generate_password_hash(dados['senha']),
                tipo   = tipo,
                status = status
            )
            db.session.add(usuario)
            db.session.commit()
            
            log_info('criar_usuario', 'Usuário adicionado com sucesso.')
            return {'message': 'Usuário adicionado com sucesso.'}, 201

        except SQLAlchemyError as e:
            db.session.rollback()
            raise e    
           
    def atualizar_usuario(self, id: int, dados: dict) -> tuple[dict, int]:
        usuario = Usuarios.query.get(id)

        if not usuario:
            raise ValueError('Usuário não encontrado.')
        
        tipo = None
        if 'tipo' in dados:
            tipo_rmv = remover_acentos(dados['tipo'])
            tipo = validar_enum(UsuariosTipoEnum, tipo_rmv)
            if not tipo:
                return {'error': 'Tipo inválido.'}, 400

        status = None
        if 'status' in dados:
            status_rmv = remover_acentos(dados['status'])
            status = validar_enum(UsuariosStatusEnum, status_rmv)
            if not status:
                return {'error': 'Status inválido.'}, 400

        if 'email'  in dados: usuario.USU_EMAIL  = dados['email']
        if 'nome'   in dados: usuario.USU_NOME   = dados['nome']
        if 'senha'  in dados: usuario.USU_SENHA  = generate_password_hash(dados['senha'])
        if 'tipo'   in dados: usuario.USU_TIPO   = tipo
        if 'status' in dados: usuario.USU_STATUS = status

        db.session.commit()
        log_info('atualizar_usuario', f'Usuário ID {id} atualizado com sucesso.')
        return {'message': 'Usuário atualizado com sucesso.'}, 200
    
    def excluir_usuario(self, id: int) -> tuple[dict, int]:
        usuario = Usuarios.query.get(id)

        if not usuario:
            raise ValueError('Usuário não encontrado.')

        db.session.delete(usuario)
        db.session.commit()

        log_info('excluir_usuario', f'Usuário {id} deletado com sucesso.')
        return {'message': 'Usuário deletado com sucesso.'}, 200
    
    def listar_usuarios(self, termo: str = '') -> list[dict]:
        termo    = termo.lower()
        usuarios = Usuarios.query.all()

        lista = []
        for usuario in usuarios:
            if (
                termo in usuario.USU_NOME.lower() or
                termo in usuario.USU_EMAIL.lower() or 
                termo in usuario.USU_TIPO.lower()
            ):
                lista.append({
                    'id'         : usuario.USU_CODIGO,
                    'email'      : usuario.USU_EMAIL,
                    'nome'       : usuario.USU_NOME,
                    'senha'      : usuario.USU_SENHA,
                    'tipo'       : usuario.USU_TIPO.value,
                    'status'     : usuario.USU_STATUS.value,
                    'created_at' : usuario.created_at
                })

        return lista