let pontos = 0;
let tarefas = [];
let ultimoDia = null;

let xp = 0;
let nivel = 1;
let xpMax = 10;

	

  

// data
function getHoje() {
  return new Date().toDateString();
}

// novo dia
function verificarNovoDia() {
  const hoje = getHoje();

  if (ultimoDia !== hoje) {
    tarefas.forEach(t => {
      if (t.repetivel && !t.feitaHoje) pontos--;
      if (t.repetivel) t.feitaHoje = false;
    });

    ultimoDia = hoje;
    salvarDados();
  }

	
	
}

// carregar
function carregarDados() {
  const dados = JSON.parse(localStorage.getItem("todoGame"));

  if (dados) {
    pontos = dados.pontos || 0;
    tarefas = dados.tarefas || [];
    ultimoDia = dados.ultimoDia || getHoje();
    xp = dados.xp || 0;
    nivel = dados.nivel || 1;
  } else {
    ultimoDia = getHoje();
  }

  verificarNovoDia();
  atualizarTudo();
}

// salvar
function salvarDados() {
  localStorage.setItem("todoGame", JSON.stringify({
    pontos,
    tarefas,
    ultimoDia,
    xp,
    nivel
  }));
}

// UI
function atualizarTudo() {
  atualizarPontos();
  atualizarXP();
  renderizarTarefas();
	

}

function atualizarPontos() {
  document.getElementById("pontos").innerText = pontos;
}

function atualizarXP() {
  document.getElementById("xpAtual").innerText = xp;
  document.getElementById("xpMax").innerText = xpMax;
  document.getElementById("nivel").innerText = nivel;

  document.getElementById("xpFill").style.width =
    (xp / xpMax) * 100 + "%";
}

// XP
function ganharXP(valor) {
  xp += valor;

  if (xp >= xpMax) {
    xp -= xpMax;
    nivel++;
    alert("🎉 Subiu de nível!");
  }
}

function PerdeXP(valor) {
  if (xp <= 0) {
    xp == 0; 
  }
 if (xp > 0) xp -= valor;
  

  
}

// render
function renderizarTarefas() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  tarefas.forEach((tarefa, index) => {
    const li = document.createElement("li");

    if (tarefa.feitaHoje) li.classList.add("feita");

    li.innerHTML = `
      <div class="linha-topo">
        <span class="status" onclick="concluir(${index})">
          ${tarefa.feitaHoje ? "✅" : "⬜"}
        </span>
        <span class="texto">${tarefa.texto}</span>
		<button onclick="concluir(${index})">✔</button>
        <button onclick="falhar(${index})">❌</button>
      </div>

      <div class="linha-baixo">
        ${tarefa.repetivel ? "🔁 Repetir todo dia" : ""}
      </div>

      <div class="acoes">
        
      </div>
    `;

    lista.appendChild(li);
  });
}

// adicionar
function adicionarTarefa() {
  const input = document.getElementById("tarefaInput");
  const repetir = document.getElementById("repetir").checked;

  const texto = input.value.trim();
  if (!texto) return;

  tarefas.push({
    texto,
    repetivel: repetir,
    feitaHoje: false
  });

  input.value = "";
  document.getElementById("repetir").checked = false;

  salvarDados();
  renderizarTarefas();
}

// concluir
function concluir(index) {
  const tarefa = tarefas[index];

  if (tarefa.feitaHoje) return;

  pontos++;
  ganharXP(2);

  tarefa.feitaHoje = true;

  if (!tarefa.repetivel) {
    tarefas.splice(index, 1);
  }

  salvarDados();
  atualizarTudo();
}

// falhar
function falhar(index) {
  if (pontos > 0) pontos--;
  PerdeXP(1)
  tarefas.splice(index, 1);

  salvarDados();
  atualizarTudo();
}

// start
carregarDados();

function resetarProgresso() {
  const confirmar = confirm("Tem certeza que quer resetar seu n�vel e XP?");

  if (!confirmar) return;

  xp = 0;
  nivel = 1;
  pontos = 0;
  salvarDados();
  atualizarTudo();
}
