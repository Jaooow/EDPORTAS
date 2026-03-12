// =========================================================
// VARIÁVEIS DE CONTROLE DE PAGINAÇÃO
// =========================================================
let paginaAtual = 1;
const produtosPorPagina = 6;
let produtosFiltradosGlobal = []; 

// =========================================================
// FUNÇÃO PARA EXIBIR PRODUTOS (COM LÓGICA DE CORTE)
// =========================================================
function exibirProdutos(lista, pagina = 1) {
    const containerProdutos = document.getElementById('lista-produtos');
    if (!containerProdutos) return; 

    const prefixo = window.location.pathname.includes('/html/') ? '../' : '';
    
    // IMPORTANTE: Atualiza a lista global para que os botões de página saibam o que exibir
    produtosFiltradosGlobal = lista; 

    // Lógica de Paginação
    const inicio = (pagina - 1) * produtosPorPagina;
    const fim = inicio + produtosPorPagina;
    const itensParaExibir = lista.slice(inicio, fim);

    containerProdutos.innerHTML = ""; 

    if (itensParaExibir.length === 0) {
        containerProdutos.innerHTML = "<p class='text-center text-muted'>Nenhum produto encontrado.</p>";
    }

    itensParaExibir.forEach(produto => {
        const card = `
            <div class="col-md-6 col-lg-4 item-produto">
                <div class="product-card-img">
                    <div class="product-image">
                        <img src="${prefixo}${produto.imagem}" alt="${produto.titulo}">
                        <span class="badge-categoria">${produto.categoria}</span>
                    </div>
                    <div class="product-body p-3 text-center">
                        <h5 class="fw-bold">${produto.titulo}</h5>
                        <p class="small text-muted">${produto.descricao}</p>
                        <div class="mt-3 d-grid gap-2">
                            <button onclick="abrirDetalhes(${produto.id})" class="btn btn-primary">
                                Ver Detalhes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        containerProdutos.innerHTML += card;
    });

    renderizarControles(lista.length, pagina);
}

// =========================================================
// FUNÇÃO PARA CRIAR OS BOTÕES DE NAVEGAÇÃO
// =========================================================
function renderizarControles(totalItens, paginaAtiva) {
    const controlesPaginacao = document.getElementById('controles-paginacao');
    if (!controlesPaginacao) return;

    const totalPaginas = Math.ceil(totalItens / produtosPorPagina);
    controlesPaginacao.innerHTML = "";

    if (totalPaginas <= 1) return; 

    for (let i = 1; i <= totalPaginas; i++) {
        const botao = document.createElement('button');
        botao.innerText = i;
        botao.className = `btn mx-1 ${i === paginaAtiva ? 'btn-primary' : 'btn-outline-primary'}`;
        botao.onclick = () => {
            paginaAtual = i;
            // Aqui usamos a lista global que foi salva no momento da exibição
            exibirProdutos(produtosFiltradosGlobal, i);
            
            // Scroll para o topo da seção de produtos
            const secaoProdutos = document.getElementById('produtos');
            if(secaoProdutos) secaoProdutos.scrollIntoView({ behavior: 'smooth' });
        };
        controlesPaginacao.appendChild(botao);
    }
}

// =========================================================
// FUNÇÃO GLOBAL PARA O MODAL (MANTIDA)
// =========================================================
window.abrirDetalhes = function(id) {
    const p = produtos.find(item => item.id === id);
    if (p) {
        const prefixo = window.location.pathname.includes('/html/') ? '../' : '';
        document.getElementById('modalTituloBadge').innerText = p.categoria.toUpperCase();
        document.getElementById('modalNome').innerText = p.titulo;
        document.getElementById('modalDescricao').innerText = p.descricao;
        document.getElementById('modalImagem').src = prefixo + p.imagem;
        document.getElementById('infoPeso').innerText = p.logistica.weight;
        document.getElementById('infoDimensoes').innerText = `${p.logistica.length} x ${p.logistica.width} x ${p.logistica.height}`;
        document.getElementById('modalZap').href = `https://wa.me/5511947835560?text=Olá! Gostaria de um orçamento da ${p.titulo}`;
        const meuModal = new bootstrap.Modal(document.getElementById('modalProduto'));
        meuModal.show();
    }
};

// =========================================================
// INICIALIZAÇÃO
// =========================================================
document.addEventListener('DOMContentLoaded', function() {
    // Se estiver na Home, mostra Destaques. Se estiver no catálogo, o script-catalogo assume.
    if (!window.location.pathname.includes('/html/')) {
        const iniciais = produtos.filter(p => p.destaque === true);
        exibirProdutos(iniciais, 1);

        // Lógica de Filtros da Home
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active', 'btn-primary'));
                button.classList.add('active', 'btn-primary');
                const cat = button.getAttribute('data-filter');
                const destaques = produtos.filter(p => p.destaque === true);
                const filtrados = cat === 'todos' ? destaques : destaques.filter(p => p.categoria === cat);
                paginaAtual = 1;
                exibirProdutos(filtrados, 1);
            });
        });
    }

    // Scroll Navbar
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) nav.classList.add('bg-primary', 'shadow');
        else nav.classList.remove('bg-primary', 'shadow');
    });
});

// Funções de CEP (Mantidas)
async function consultarCep() {
    const cep = document.getElementById('cepFrete').value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (data.erro) return;
        const peso = document.getElementById('infoPeso').innerText;
        const valor = (parseFloat(peso) * 1.5 + 20).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('resultadoFrete').innerHTML = `<div class='alert alert-success mt-3'>Entrega: ${data.logradouro}<br>Valor: ${valor}</div>`;
    } catch (e) {}
}
window.consultarCep = consultarCep;