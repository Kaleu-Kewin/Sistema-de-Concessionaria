from flask          import request, make_response, jsonify, Response
from sqlalchemy.exc import SQLAlchemyError
from src            import app, db
from src.utils      import log_info, log_error
from src.services   import VeiculosService


@app.route('/api/veiculos', methods=['POST'])
def adicionar_veiculo()  -> Response:
    dados   = request.get_json()
    service = VeiculosService()
    try:
        response, status = service.criar_veiculo(dados)
        return make_response(jsonify(response), status)
    
    except Exception as erro:
        log_error('adicionar_veiculo', erro)
        return make_response(jsonify({'error': 'Erro ao adicionar veículo no banco de dados.'}), 500)


@app.route('/api/veiculos/<int:id>', methods=['PUT'])
def editar_veiculo(id) -> Response:
    dados   = request.get_json()
    service = VeiculosService()
    try:
        response, status = service.atualizar_veiculo(id, dados)
        return make_response(jsonify(response), status)
    
    except ValueError as erro:
        return make_response(jsonify({'error': str(erro)}), 404)

    except SQLAlchemyError as erro:
        db.session.rollback()
        log_error('editar_veiculo', erro)
        return make_response(jsonify({'error': 'Erro ao atualizar veículo no banco de dados.'}), 500)


@app.route('/api/veiculos/<int:id>', methods=['DELETE'])
def excluir_veiculo(id) -> Response:
        service = VeiculosService()
        try:
            response, status = service.excluir_veiculo(id)
            return make_response(jsonify(response), status)

        except ValueError as erro:
            return make_response(jsonify({'error': str(erro)}), 404)

        except SQLAlchemyError as erro:
            db.session.rollback()
            log_error('excluir_veiculo', erro)
            return make_response(jsonify({'error': 'Erro ao deletar veículo do banco de dados.'}), 500)


@app.route('/api/veiculos', methods=['GET'])
def listar_veiculos():
    termo   = request.args.get('busca', '')
    service = VeiculosService()
    try:
        lista = service.listar_veiculos(termo)
        return make_response(jsonify(lista), 200)
    except Exception as erro:
        log_error('listar_veiculos', erro)
        return make_response(jsonify({'error': 'Erro ao listar veículos.'}), 500)