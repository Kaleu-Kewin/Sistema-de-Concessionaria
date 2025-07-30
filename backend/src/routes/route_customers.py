from flask          import request, make_response, jsonify, Response
from sqlalchemy.exc import SQLAlchemyError
from src            import app, db
from src.utils      import log_info, log_error
from src.services   import ClientesService


@app.route('/api/clientes', methods=['POST'])
def adicionar_cliente() -> Response:
    dados   = request.get_json()
    service = ClientesService()
    try:
        response, status = service.criar_cliente(dados)
        return make_response(jsonify(response), status)
    
    except Exception as erro:
        log_error('adicionar_cliente', erro)
        return make_response(jsonify({'error': 'Erro ao adicionar cliente no banco de dados.'}), 500)


@app.route('/api/clientes/<int:id>', methods=['PUT'])
def editar_cliente(id) -> Response:
    dados   = request.get_json()
    service = ClientesService()
    try:
        response, status = service.atualizar_cliente(id, dados)
        return make_response(jsonify(response), status)
    
    except ValueError as erro:
        return make_response(jsonify({'error': str(erro)}), 404)

    except SQLAlchemyError as erro:
        db.session.rollback()
        log_error('editar_cliente', erro)
        return make_response(jsonify({'error': 'Erro ao atualizar cliente no banco de dados.'}), 500)


@app.route('/api/clientes/<int:id>', methods=['DELETE'])
def excluir_cliente(id) -> Response:
    service = ClientesService()
    try:
        response, status = service.excluir_cliente(id)
        return make_response(jsonify(response), status)

    except ValueError as erro:
        return make_response(jsonify({'error': str(erro)}), 404)

    except SQLAlchemyError as erro:
        db.session.rollback()
        log_error('excluir_cliente', erro)
        return make_response(jsonify({'error': 'Erro ao deletar cliente do banco de dados.'}), 500)
 

@app.route('/api/clientes', methods=['GET'])
def listar_clientes() -> Response:
    termo   = request.args.get('busca', '')
    service = ClientesService()
    try:
        lista = service.listar_clientes(termo)
        return make_response(jsonify(lista), 200)
    except Exception as erro:
        log_error('listar_clientes', erro)
        return make_response(jsonify({'error': 'Erro ao listar clientes.'}), 500)
