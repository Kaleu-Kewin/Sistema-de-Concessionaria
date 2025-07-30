from sqlalchemy.exc import SQLAlchemyError
from src            import db
from src.models     import Veiculos
from src.enums      import VeiculoStatusEnum, VeiculoTipoEnum
from src.utils      import log_info, log_error, validar_enum, remover_acentos


class VeiculosService:
    def __init__(self) -> None:
        pass
        
    def criar_veiculo(self, dados: dict) -> tuple[dict, int]:
        obrigatorios = ['placa', 'marca', 'modelo', 'preco', 'ano', 'tipo', 'status']
        
        if not dados or not all(dados.get(campo) for campo in obrigatorios):
            return {'error': 'Campos obrigatórios ausentes.'}, 400

        status_rmv = remover_acentos(dados['status'])
        tipo_rmv   = remover_acentos(dados['tipo'])

        status = validar_enum(VeiculoStatusEnum, status_rmv)
        tipo   = validar_enum(VeiculoTipoEnum, tipo_rmv)
        
        if not status or not tipo:
            return {'error': 'Status ou Tipo inválido.'}, 400
        
        try:
            veiculo = Veiculos(
                placa  = dados['placa'],
                marca  = dados['marca'],
                modelo = dados['modelo'],
                preco  = dados['preco'],
                ano    = dados['ano'],
                cor    = dados.get('cor', ''),
                km     = dados.get('km', 0),
                tipo   = tipo,
                status = status
            )
            db.session.add(veiculo)
            db.session.commit()
            
            log_info('criar_veiculo', 'Veículo adicionado com sucesso.')
            return {'message': 'Veículo adicionado com sucesso.'}, 201

        except SQLAlchemyError as erro:
            db.session.rollback()
            raise erro
        
    def atualizar_veiculo(self, id: int, dados: dict) -> tuple[dict, int]:
        veiculo = Veiculos.query.get(id)

        if not veiculo:
            raise ValueError('Veículo não encontrado.')

        tipo = None
        if 'tipo' in dados:
            tipo_rmv = remover_acentos(dados['tipo'])
            tipo = validar_enum(VeiculoTipoEnum, tipo_rmv)
            if not tipo:
                return {'error': 'Tipo inválido.'}, 400

        status = None
        if 'status' in dados:
            status_rmv = remover_acentos(dados['status'])
            status = validar_enum(VeiculoStatusEnum, status_rmv)
            if not status:
                return {'error': 'Status inválido.'}, 400

        if 'placa'  in dados: veiculo.VEI_PLACA  = dados['placa']
        if 'marca'  in dados: veiculo.VEI_MARCA  = dados['marca']
        if 'modelo' in dados: veiculo.VEI_MODELO = dados['modelo']
        if 'preco'  in dados: veiculo.VEI_PRECO  = dados['preco']
        if 'ano'    in dados: veiculo.VEI_ANO    = dados['ano']
        if 'cor'    in dados: veiculo.VEI_COR    = dados['cor']
        if 'tipo'   in dados: veiculo.VEI_TIPO   = tipo
        if 'status' in dados: veiculo.VEI_STATUS = status

        db.session.commit()
        log_info('atualizar_veiculo', f'Veículo ID {id} atualizado com sucesso.')
        return {'message': 'Veículo atualizado com sucesso.'}, 200
    
    def excluir_veiculo(self, id: int) -> tuple[dict, int]:
        veiculo = Veiculos.query.get(id)

        if not veiculo:
            raise ValueError('Veículo não encontrado.')

        db.session.delete(veiculo)
        db.session.commit()

        log_info('excluir_veiculo', f'Veículo {id} deletado com sucesso.')
        return {'message': 'Veículo deletado com sucesso.'}, 200
    
    def listar_veiculos(self, termo: str = '') -> list[dict]:
        termo    = termo.lower()
        veiculos = Veiculos.query.all()

        lista = []
        for veiculo in veiculos:
            if (
                termo in veiculo.VEI_MARCA.lower() or
                termo in veiculo.VEI_MODELO.lower()
            ):
                lista.append({
                    'id'     : veiculo.VEI_CODIGO,
                    'marca'  : veiculo.VEI_MARCA,
                    'modelo' : veiculo.VEI_MODELO,
                    'placa'  : veiculo.VEI_PLACA,
                    'preco'  : float(veiculo.VEI_PRECO),
                    'ano'    : veiculo.VEI_ANO,
                    'km'     : float(veiculo.VEI_KM),
                    'cor'    : veiculo.VEI_COR,
                    'tipo'   : veiculo.VEI_TIPO.value,
                    'status' : veiculo.VEI_STATUS.value
                })

        return lista