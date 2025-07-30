from flask             import request, make_response, jsonify, Response
from sqlalchemy.exc    import SQLAlchemyError
from src               import app, db
from src.utils         import log_info, log_error
from src.models        import Usuarios
from werkzeug.security import check_password_hash

@app.route('/api/login', methods=['POST'])
def login_usuario() -> Response:
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')

    if not email or not senha:
        return make_response(jsonify({'error': 'Email e senha são obrigatórios.'}), 400)

    try:
        usuario = Usuarios.query.filter_by(email=email).first()

        log_info('login_usuario', f'Tentativa de login para o usuário: {email}')

        if not usuario:
            return make_response(jsonify({'error': 'Usuário não encontrado.'}), 404)

        log_info('login_usuario', f'{usuario.senha} != {senha}')

        if not check_password_hash(usuario.senha, senha):
            return make_response(jsonify({'error': 'Senha incorreta.'}), 401)

        return make_response(jsonify({'message': 'Login realizado com sucesso.'}), 200)

    except Exception as erro:
        log_error('login_usuario', erro)
        return make_response(jsonify({'error': 'Erro ao realizar login.'}), 500)
