import { db, auth } from "./firebase-config.js";
import { collection, addDoc, getDocs, serverTimestamp, query, limit } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Função para garantir que as coleções existam enviando um log inicial
async function inicializarSistema() {
    const movRef = collection(db, "movimentacoes");
    const q = query(movRef, limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        // Cria a coleção de movimentações automaticamente com um log de sistema
        await addDoc(movRef, {
            produto: "Sistema",
            tipo: "Inicialização",
            quantidade: 0,
            usuario: "Auto-System",
            data: serverTimestamp()
        });
        console.log("Coleção 'movimentacoes' criada automaticamente.");
    }
}

// Chame isso ao carregar a página
inicializarSistema();

// Função de Salvar Produto (Cria a coleção 'produtos' se não existir)
window.salvarProduto = async () => {
    const nome = document.getElementById("nome").value;
    const fornecedorId = document.getElementById("selectFornecedor").value;

    if (!nome || !fornecedorId) return alert("Preencha os campos!");

    try {
        await addDoc(collection(db, "produtos"), {
            nome: nome,
            codigo: document.getElementById("cod").value || "G-001",
            fornecedorId: fornecedorId,
            dataCadastro: serverTimestamp(),
            ultimaMovimentacao: serverTimestamp()
        });
        alert("Produto e Coleção criados com sucesso!");
        location.reload();
    } catch (e) {
        console.error("Erro:", e);
    }
};
