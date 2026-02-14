// --- COPIE ESTE CÓDIGO PARA O SEU GOOGLE APPS SCRIPT ---

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var output = { success: false, vagas: [] };
  
  try {
    var action = e.parameter.action || (e.postData ? JSON.parse(e.postData.contents).action : "");
    
    if (action === "getVagas") {
      output = getVagasData();
    } else if (action === "saveRule") {
      output = { success: true, message: "Regra salva com sucesso (simulação)" };
    }
    
  } catch (error) {
    output.error = error.toString();
  }
  
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function getVagasData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Tenta pegar a aba específica ou a primeira se não existir
  var sheet = ss.getSheetByName("Base_GaussFleet"); 
  if (!sheet) sheet = ss.getSheets()[0];
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0]; // Assume linha 1 como cabeçalho
  
  // Mapeamento simples de colunas (Ajuste os índices se necessário)
  // Col A = Vaga (0), Col B = Placa (1), Col C = Status (2), Col D = Data (3)
  
  var vagasMap = {};
  
  // Começa da linha 2 (índice 1) para pular cabeçalho
  // Itera de baixo para cima para pegar o estado mais recente primeiro (ou use lógica de filtro)
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var vagaNome = row[0]; // Coluna A
    if (!vagaNome) continue;
    
    // Se a vaga já foi processada, adiciona evento ao histórico, senão cria
    if (!vagasMap[vagaNome]) {
      var statusRaw = row[2] ? row[2].toString() : "Sem Apropriação";
      var dataHora = row[3] instanceof Date ? formatTime(row[3]) : (row[3] || "00:00");
      
      vagasMap[vagaNome] = {
        id: "vaga-" + i,
        nome: vagaNome,
        placa: row[1] || "N/I", // Coluna B
        status: statusRaw,
        horario: dataHora,
        eventos: []
      };
    }
    
    // Adiciona evento (limitado a ultimos 5 para não pesar o JSON)
    if (vagasMap[vagaNome].eventos.length < 5) {
      var horaEvento = row[3] instanceof Date ? formatTime(row[3]) : "00:00";
      vagasMap[vagaNome].eventos.push({
        descricao: row[2] || "Evento registrado",
        dataInicio: horaEvento,
        tempoTotal: "00:00", // Cálculo de tempo seria complexo aqui, deixando placeholder
        status: row[2]
      });
    }
  }
  
  var vagasList = [];
  for (var key in vagasMap) {
    vagasList.push(vagasMap[key]);
  }
  
  return { success: true, vagas: vagasList };
}

function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
}