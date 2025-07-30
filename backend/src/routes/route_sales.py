from src.models import Vendas
from src    import app, db


@app.route('/api/vendas', methods=['POST'])
def adicionar_venda():
    pass

@app.route('/api/vendas/<int:id>', methods=['PUT'])
def editar_venda(id):
    pass

@app.route('/api/vendas/<int:id>', methods=['DELETE'])
def excluir_venda(id):
    pass

@app.route('/api/vendas', methods=['GET'])
def listar_vendas():
    pass