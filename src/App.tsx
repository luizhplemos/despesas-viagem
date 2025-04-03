import { useState, useEffect } from "react";

type Despesa = {
  id: number;
  descricao: string;
  valor: number;
  quemPagou: string;
  categoria: string;
};

function App() {
  const [aba, setAba] = useState<"principal" | "categorias">("principal");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [quemPagou, setQuemPagou] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([
    "Alimentação",
    "Hospedagem",
    "Lazer",
    "Transporte",
  ]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [erro, setErro] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const pessoas = ["Luiz", "Michely"];

  useEffect(() => {
    const dados = localStorage.getItem("despesas");
    if (dados) setDespesas(JSON.parse(dados));
  }, []);

  useEffect(() => {
    localStorage.setItem("despesas", JSON.stringify(despesas));
  }, [despesas]);

  const limparFormulario = () => {
    setDescricao("");
    setValor("");
    setQuemPagou("");
    setCategoria("");
    setEditandoId(null);
  };

  const adicionarOuEditar = () => {
    const num = parseFloat(valor);
    if (!descricao) return setErro("Preencha o campo Descrição.");
    if (!valor || isNaN(num) || num <= 0)
      return setErro("Preencha o campo Valor corretamente.");
    if (!quemPagou) return setErro("Escolha quem pagou.");
    if (!categoria) return setErro("Escolha uma categoria.");

    if (editandoId !== null) {
      const atualizadas = despesas.map((d) =>
        d.id === editandoId
          ? { ...d, descricao, valor: num, quemPagou, categoria }
          : d
      );
      setDespesas(atualizadas);
    } else {
      setDespesas([
        ...despesas,
        { id: Date.now(), descricao, valor: num, quemPagou, categoria },
      ]);
    }

    limparFormulario();
    setMostrarFormulario(false);
  };

  const excluir = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta despesa?")) {
      setDespesas(despesas.filter((d) => d.id !== id));
    }
  };

  const editar = (id: number) => {
    const d = despesas.find((d) => d.id === id);
    if (!d) return;
    setDescricao(d.descricao);
    setValor(d.valor.toString());
    setQuemPagou(d.quemPagou);
    setCategoria(d.categoria);
    setEditandoId(d.id);
    setMostrarFormulario(true);
  };

  const adicionarCategoria = () => {
    const nova = novaCategoria.trim();
    if (nova && !categorias.includes(nova)) {
      setCategorias([...categorias, nova]);
      setNovaCategoria("");
    }
  };

  const editarCategoria = (index: number) => {
    const novoNome = prompt("Novo nome da categoria:", categorias[index]);
    if (novoNome) {
      const atualizadas = [...categorias];
      atualizadas[index] = novoNome;
      setCategorias(atualizadas);
    }
  };

  const removerCategoria = (index: number) => {
    if (confirm("Deseja realmente excluir essa categoria?")) {
      const atualizadas = [...categorias];
      atualizadas.splice(index, 1);
      setCategorias(atualizadas);
    }
  };

  const totalPorPessoa = pessoas.map((pessoa) => ({
    nome: pessoa,
    total: despesas
      .filter((d) => d.quemPagou === pessoa)
      .reduce((sum, d) => sum + d.valor, 0),
  }));

  const totalGeral = despesas.reduce((sum, d) => sum + d.valor, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-20 px-4">
      {erro && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 shadow max-w-sm w-full text-center">
            <p className="text-red-600 font-semibold mb-4">{erro}</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setErro("")}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md relative shadow">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => {
                setMostrarFormulario(false);
                limparFormulario();
              }}
            >
              ❌
            </button>
            <h2 className="text-lg font-semibold mb-3">
              {editandoId ? "Editar Despesa" : "Nova Despesa"}
            </h2>
            <input
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full border rounded p-2 mb-2"
            />
            <input
              placeholder="Valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full border rounded p-2 mb-2"
            />
            <select
              value={quemPagou}
              onChange={(e) => setQuemPagou(e.target.value)}
              className="w-full border rounded p-2 mb-2"
            >
              <option value="">Quem pagou?</option>
              {pessoas.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            >
              <option value="">Categoria</option>
              {categorias.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={adicionarOuEditar}
              className="bg-purple-600 text-white w-full py-2 rounded"
            >
              {editandoId ? "Salvar Alterações" : "Adicionar Despesa"}
            </button>
          </div>
        </div>
      )}

      {aba === "principal" && (
        <>
          <div className="py-4">
            <button
              className="bg-purple-500 text-white w-full py-2 rounded font-semibold"
              onClick={() => setMostrarFormulario(true)}
            >
              ➕ Nova Despesa
            </button>
          </div>

          <div className="space-y-4">
            {despesas.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded shadow p-3 flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold text-base">{d.descricao}</div>
                  <div className="text-sm text-gray-500">
                    {d.quemPagou}, {d.categoria}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editar(d.id)}>✏️</button>
                  <button onClick={() => excluir(d.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white rounded shadow p-4 text-sm">
            <p className="font-semibold mb-1">📊 Relatório</p>
            <p>Total: R$ {totalGeral.toFixed(2)}</p>
            {totalPorPessoa.map((p) => (
              <p key={p.nome}>
                {p.nome}: R$ {p.total.toFixed(2)}
              </p>
            ))}
          </div>
        </>
      )}

      {aba === "categorias" && (
        <div className="py-4">
          <div className="flex mb-4">
            <input
              placeholder="Nova categoria"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              className="flex-1 border rounded p-2 mr-2"
            />
            <button
              onClick={adicionarCategoria}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Adicionar
            </button>
          </div>
          <div className="space-y-2">
            {categorias.map((cat, i) => (
              <div
                key={cat}
                className="bg-white rounded shadow p-3 flex justify-between items-center"
              >
                <span>{cat}</span>
                <div className="flex gap-2">
                  <button onClick={() => editarCategoria(i)}>✏️</button>
                  <button onClick={() => removerCategoria(i)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow flex justify-around py-2">
        <button
          className={`flex flex-col items-center text-sm ${
            aba === "principal" ? "text-purple-600 font-bold" : "text-gray-600"
          }`}
          onClick={() => setAba("principal")}
        >
          🏠 <span>Principal</span>
        </button>
        <button
          className={`flex flex-col items-center text-sm ${
            aba === "categorias" ? "text-purple-600 font-bold" : "text-gray-600"
          }`}
          onClick={() => setAba("categorias")}
        >
          📂 <span>Categorias</span>
        </button>
      </div>
    </div>
  );
}

export default App;
