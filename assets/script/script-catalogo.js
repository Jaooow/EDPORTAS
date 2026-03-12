document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Inicialização: Mostra todos os produtos ao carregar o catálogo
    exibirProdutos(produtos); 

    const inputBusca = document.getElementById('inputBusca');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let categoriaAtual = 'todos';

    // === FUNÇÃO DE FILTRAGEM COMBINADA ===
    // Filtra por categoria E por texto simultaneamente
    function filtrarProdutos() {
        const termo = inputBusca ? inputBusca.value.toLowerCase() : "";
        
        const resultado = produtos.filter(p => {
            const matchesCategoria = (categoriaAtual === 'todos' || p.categoria === categoriaAtual);
            const matchesTexto = (p.titulo.toLowerCase().includes(termo) || p.descricao.toLowerCase().includes(termo));
            
            return matchesCategoria && matchesTexto;
        });

        exibirProdutos(resultado);

        // Feedback visual caso não encontre nada
        const container = document.getElementById('lista-produtos');
        if (resultado.length === 0 && container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                    <p class="text-muted">Nenhum produto encontrado com estes termos.</p>
                    <button class="btn btn-link text-primary" onclick="location.reload()">Limpar filtros</button>
                </div>
            `;
        }
    }

    // 2. Evento da Barra de Pesquisa
    if (inputBusca) {
        inputBusca.addEventListener('input', filtrarProdutos);
    }

    // 3. Evento dos Botões de Categoria
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Ajuste visual dos botões
            filterButtons.forEach(btn => btn.classList.remove('active', 'btn-primary'));
            button.classList.add('active', 'btn-primary');

            // Atualiza a categoria global e filtra
            categoriaAtual = button.getAttribute('data-filter');
            filtrarProdutos();
        });
    });
});