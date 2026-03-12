// === BANCO DE DADOS DE PRODUTOS ===
// Definido fora para ser acessível por todas as funções
const produtos = [
    {
        id: 1,
        titulo: "Porta Pivotante Luxo",
        categoria: "madeira",
        descricao: "Madeira maciça com acabamento premium.",
        imagem: "assets/img/porta_bbb.jpg",
        logistica: {
            weight: 45.5,
            length: 210,
            width: 110,
            height: 5
        }
    },
    {
        id: 2,
        titulo: "Basculante de Alumínio",
        categoria: "aluminio",
        descricao: "Alumínio anodizado com isolamento acústico.",
        imagem: "assets/img/basculante_aluminio.jpg",
        logistica: {
            weight: 15.0,
            length: 60,
            width: 60,
            height: 8
        }
    }
];

// === FUNÇÃO PARA EXIBIR PRODUTOS ===
function exibirProdutos(lista) {
    const containerProdutos = document.getElementById('lista-produtos');
    
    if (!containerProdutos) return; 

    containerProdutos.innerHTML = ""; 

    lista.forEach(produto => {
        const card = `
            <div class="col-md-6 col-lg-4 item-produto">
                <div class="product-card-img">
                    <div class="product-image">
                        <img src="${produto.imagem}" alt="${produto.titulo}">
                        <span class="badge-categoria">${produto.categoria}</span>
                    </div>
                    <div class="product-body p-3">
                        <h5>${produto.titulo}</h5>
                        <p>${produto.descricao}</p>
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
}

// === FUNÇÃO GLOBAL PARA O MODAL ===
window.abrirDetalhes = function(id) {
    const p = produtos.find(item => item.id === id);
    
    if (p) {
        // Preenche os campos do modal
        document.getElementById('modalTituloBadge').innerText = p.categoria.toUpperCase();
        document.getElementById('modalNome').innerText = p.titulo;
        document.getElementById('modalDescricao').innerText = p.descricao;
        document.getElementById('modalImagem').src = p.imagem;
        
        // Dados de logística
        document.getElementById('infoPeso').innerText = p.logistica.weight;
        document.getElementById('infoDimensoes').innerText = 
            `${p.logistica.length} x ${p.logistica.width} x ${p.logistica.height}`;
            
        // Link do WhatsApp
        document.getElementById('modalZap').href = 
            `https://wa.me/5511947835560?text=Olá! Gostaria de um orçamento da ${p.titulo}`;

        // Abre o modal do Bootstrap
        const modalElement = document.getElementById('modalProduto');
        const meuModal = new bootstrap.Modal(modalElement);
        meuModal.show();
    }
};

// === INICIALIZAÇÃO AO CARREGAR A PÁGINA ===
document.addEventListener('DOMContentLoaded', function() {
    
    // Mostra os produtos iniciais
    exibirProdutos(produtos);

    // Lógica de Filtragem
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active', 'btn-primary'));
            button.classList.add('active', 'btn-primary');

            const categoriaSelecionada = button.getAttribute('data-filter');
            
            if (categoriaSelecionada === 'todos') {
                exibirProdutos(produtos);
            } else {
                const produtosFiltrados = produtos.filter(p => p.categoria === categoriaSelecionada);
                exibirProdutos(produtosFiltrados);
            }
        });
    });

    // Efeito de Scroll na Navbar
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.classList.add('bg-primary', 'shadow');
        } else {
            nav.classList.remove('bg-primary', 'shadow');
        }
    });
});

// Função para validar e buscar o CEP via API
async function consultarCep() {
    const cep = document.getElementById('cepFrete').value.replace(/\D/g, '');
    const resultadoFrete = document.getElementById('resultadoFrete'); // Vamos criar este ID no HTML

    if (cep.length !== 8) {
        alert("Por favor, digite um CEP válido com 8 dígitos.");
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert("CEP não encontrado.");
            return;
        }

        // Exibe o endereço e simula um valor de frete baseado no peso
        // Aqui você integraria com a API de uma transportadora real no futuro
        const peso = document.getElementById('infoPeso').innerText;
        const valorSimulado = (parseFloat(peso) * 1.5 /*Custo por KG*/+ 20 /*Custo Fixo*/).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        resultadoFrete.innerHTML = `
            <div class="alert alert-success mt-3 small">
                <i class="bi bi-truck me-2"></i>
                <strong>Entrega para:</strong> ${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}<br>
                <strong>Prazo estimado:</strong> 3 a 5 dias úteis<br>
                <strong>Valor estimado:</strong> ${valorSimulado}
            </div>
        `;

    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao consultar o frete. Tente novamente mais tarde.");
    }
}

// Torna a função acessível ao botão do modal
window.consultarCep = consultarCep;