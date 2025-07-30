from flask          import request, make_response, jsonify, Response
from sqlalchemy.exc import SQLAlchemyError
from src            import app, db
from src.utils      import log_info, log_error
from src.services   import UsuariosService


@app.route('/api/usuarios', methods=['POST'])
def adicionar_usuario() -> Response:
    dados   = request.get_json()
    service = UsuariosService()
    try:
        response, status = service.criar_usuario(dados)
        return make_response(jsonify(response), status)
    
    except Exception as erro:
        log_error('adicionar_usuario', erro)
        return make_response(jsonify({'error': 'Erro ao adicionar usuário no banco de dados.'}), 500)


@app.route('/api/usuarios/<int:id>', methods=['PUT'])
def editar_usuario(id) -> Response:
    dados   = request.get_json()
    service = UsuariosService()
    try:
        response, status = service.atualizar_usuario(id, dados)
        return make_response(jsonify(response), status)
    
    except ValueError as erro:
        return make_response(jsonify({'error': str(erro)}), 404)

    except SQLAlchemyError as erro:
        db.session.rollback()
        log_error('editar_usuario', erro)
        return make_response(jsonify({'error': 'Erro ao atualizar usuário no banco de dados.'}), 500)


@app.route('/api/usuarios/<int:id>', methods=['DELETE'])
def excluir_usuario(id) -> Response:
        service = UsuariosService()
        try:
            response, status = service.excluir_usuario(id)
            return make_response(jsonify(response), status)

        except ValueError as erro:
            return make_response(jsonify({'error': str(erro)}), 404)

        except SQLAlchemyError as erro:
            db.session.rollback()
            log_error('deletar_cliente', erro)
            return make_response(jsonify({'error': 'Erro ao deletar usuário do banco de dados.'}), 500)


@app.route('/api/usuarios', methods=['GET'])
def listar_usuarios():
    termo   = request.args.get('busca', '')
    service = UsuariosService()
    try:
        lista = service.listar_usuarios(termo)
        return make_response(jsonify(lista), 200)
    except Exception as erro:
        log_error('listar_usuarios', erro)
        return make_response(jsonify({'error': 'Erro ao listar usuários.'}), 500)