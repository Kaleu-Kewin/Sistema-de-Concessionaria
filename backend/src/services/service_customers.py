from sqlalchemy.exc import SQLAlchemyError
from src            import db
from src.models     import Clientes
from src.enums      import ClienteStatusEnum
from src.utils      import log_info, log_error, validar_enum, remover_acentos


class ClientesService:
    def __init__(self) -> None:
        pass
        
    def criar_cliente(self, dados: dict) -> tuple[dict, int]:
        obrigatorios = ['nome', 'cpf', 'telefone', 'status']
        
        if not dados or not all(dados.get(campo) for campo in obrigatorios):
            return {'error': 'Campos obrigatórios ausentes.'}, 400

        status_rmv = remover_acentos(dados['status'])
        status     = validar_enum(ClienteStatusEnum, status_rmv)
        
        if not status:
            return {'error': 'Status inválido.'}, 400
        
        try:
            cliente = Clientes(
                nome     = dados['nome'],
                cpf      = dados['cpf'],
                telefone = dados['telefone'],
                email    = dados.get('email', ''),
                cep      = dados.get('cep', ''),
                endereco = dados.get('endereco', ''),
                cidade   = dados.get('cidade', ''),
                uf       = dados.get('uf', ''),
                saldo    = dados.get('saldo', 0.00),
                status   = status
            )
            db.session.add(cliente)
            db.session.commit()
            
            log_info('criar_cliente', 'Cliente adicionado com sucesso.')
            return {'message': 'Cliente adicionado com sucesso.'}, 201

        except SQLAlchemyError as erro:
            db.session.rollback()
            raise erro

    def atualizar_cliente(self, id: int, dados: dict) -> tuple[dict, int]:
        cliente = Clientes.query.get(id)

        if not cliente:
            raise ValueError('Cliente não encontrado.')
    
        status = None
        if 'status' in dados:
            status_rmv = remover_acentos(dados['status'])
            status = validar_enum(ClienteStatusEnum, status_rmv)
            if not status:
                return {'error': 'Status inválido.'}, 400
        
        if 'nome'     in dados: cliente.CLI_NOME     = dados['nome']
        if 'cpf'      in dados: cliente.CLI_CPF      = dados['cpf']
        if 'telefone' in dados: cliente.CLI_TELEFONE = dados['telefone']
        if 'email'    in dados: cliente.CLI_EMAIL    = dados['email']
        if 'cep'      in dados: cliente.CLI_CEP      = dados['cep']
        if 'endereco' in dados: cliente.CLI_ENDERECO = dados['endereco']
        if 'cidade'   in dados: cliente.CLI_CIDADE   = dados['cidade']
        if 'uf'       in dados: cliente.CLI_UF       = dados['uf']
        if 'saldo'    in dados: cliente.CLI_SALDO    = dados['saldo']
        if 'status'   in dados: cliente.CLI_STATUS   = status

        db.session.commit()
        log_info('atualizar_cliente', f'Cliente ID {id} atualizado com sucesso.')
        return {'message': 'Cliente atualizado com sucesso.'}, 200

    def excluir_cliente(self, id: int) -> tuple[dict, int]:
        cliente = Clientes.query.get(id)

        if not cliente:
            raise ValueError('Cliente não encontrado.')

        db.session.delete(cliente)
        db.session.commit()

        log_info('excluir_cliente', f'Cliente {id} deletado com sucesso.')
        return {'message': 'Cliente deletado com sucesso.'}, 200
    
    def listar_clientes(self, termo: str = '') -> list[dict]:
        termo    = termo.lower()
        clientes = Clientes.query.all()

        lista = []
        for cliente in clientes:
            if (
                termo in cliente.CLI_NOME.lower() or
                termo in cliente.CLI_CPF.lower() or 
                termo in cliente.CLI_EMAIL.lower()
            ):
                lista.append({
                    'id'       : cliente.CLI_CODIGO,
                    'nome'     : cliente.CLI_NOME,
                    'cpf'      : cliente.CLI_CPF,
                    'telefone' : cliente.CLI_TELEFONE,
                    'email'    : cliente.CLI_EMAIL,
                    'cep'      : cliente.CLI_CEP,
                    'endereco' : cliente.CLI_ENDERECO,
                    'cidade'   : cliente.CLI_CIDADE,
                    'uf'       : cliente.CLI_UF,
                    'saldo'    : float(cliente.CLI_SALDO),
                    'status'   : cliente.CLI_STATUS.value
                })

        return lista