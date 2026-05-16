// ═══════════════════════════════════════════════════════════════
// SERVIÇO DE INTEGRAÇÃO COM GEMINI API (GOOGLE)
// ═══════════════════════════════════════════════════════════════

import { SYSTEM_PROMPT } from '../utils/iaCore';

// Chave da API armazenada no localStorage
const getApiKey = () => {
  try {
    return localStorage.getItem('devcom_ia_key') || '';
  } catch {
    return '';
  }
};

const setApiKey = (key) => {
  try {
    localStorage.setItem('devcom_ia_key', key);
  } catch (e) {
    console.error('Erro ao salvar chave:', e);
  }
};

// Modelos disponíveis (mesmos do index.html)
const GEMINI_MODELS = {
  PRIMARY: 'gemini-3.1-flash-lite',
  FALLBACK: 'gemini-2.5-flash-preview-05-20'
};

/**
 * Consulta o Gemini API com histórico de conversa
 * 
 * @param {string} mensagemUsuario - Mensagem atual do usuário
 * @param {Array} historico - Array de objetos {role: 'user'|'model', parts: [{text: '...'}]}
 * @returns {Promise<string>} - Resposta do Gemini
 */
export async function consultarGemini(mensagemUsuario, historico = []) {
  const apiKey = getApiKey();
  
  // Validação básica
  if (!apiKey) {
    throw new Error('Chave da API Gemini não configurada. Configure em Configurações > IA');
  }

  if (!mensagemUsuario || mensagemUsuario.trim().length === 0) {
    throw new Error('Mensagem não pode ser vazia');
  }

  // Chama o Gemini (já tem fallback automático interno)
  return await callGemini(mensagemUsuario, historico, GEMINI_MODELS.PRIMARY, apiKey);
}

/**
 * Função interna para chamar a API do Gemini
 * Usa o mesmo padrão do index.html
 */
async function callGemini(mensagemUsuario, historico, modelo, apiKey) {
  console.log(`🤖 Consultando Gemini API (${modelo})...`);
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [
          ...historico,
          {
            role: 'user',
            parts: [{ text: mensagemUsuario }]
          }
        ],
        generationConfig: {
          responseMimeType: 'text/plain',
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      const status = errorData.error?.status || '';
      const code = errorData.error?.code || 0;
      
      // Rate limit temporário no modelo principal → tenta fallback uma vez
      if ((status === 'RESOURCE_EXHAUSTED' || code === 429) && 
          modelo === GEMINI_MODELS.PRIMARY && 
          modelo !== GEMINI_MODELS.FALLBACK) {
        console.warn('⚠️ Rate limit no modelo primary, tentando fallback...');
        return await callGemini(mensagemUsuario, historico, GEMINI_MODELS.FALLBACK, apiKey);
      }
      
      console.error('❌ Erro da API:', errorData);
      throw new Error(errorData.error?.message || response.statusText);
    }

    const data = await response.json();
    
    if (data.error) {
      const status = data.error.status || '';
      const code = data.error.code || 0;
      
      // Rate limit temporário → tenta fallback
      if ((status === 'RESOURCE_EXHAUSTED' || code === 429) && 
          modelo === GEMINI_MODELS.PRIMARY && 
          modelo !== GEMINI_MODELS.FALLBACK) {
        console.warn('⚠️ Rate limit no modelo primary, tentando fallback...');
        return await callGemini(mensagemUsuario, historico, GEMINI_MODELS.FALLBACK, apiKey);
      }
      
      throw new Error(data.error.message || 'Erro desconhecido da API');
    }
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      const reason = data.candidates?.[0]?.finishReason;
      throw new Error(
        reason === 'SAFETY' 
          ? 'Conteúdo bloqueado por filtro de segurança.' 
          : 'Sem resposta da IA'
      );
    }
    
    console.log('✅ Resposta recebida do Gemini');
    if (data.usageMetadata) {
      console.log('📊 Uso:', {
        promptTokens: data.usageMetadata.promptTokenCount,
        responseTokens: data.usageMetadata.candidatesTokenCount,
        totalTokens: data.usageMetadata.totalTokenCount
      });
    }

    return text;

  } catch (error) {
    console.error('❌ Erro ao consultar Gemini:', error);
    
    // Erros específicos
    if (error.message.includes('API key') || error.message.includes('API_KEY_INVALID')) {
      throw new Error('Chave da API inválida. Verifique em Configurações.');
    }
    
    if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('Limite de requisições atingido. Aguarde alguns minutos.');
    }

    if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet.');
    }

    throw error;
  }
}


/**
 * Versão com retry automático
 */
export async function consultarGeminiComRetry(mensagemUsuario, historico = [], maxTentativas = 3) {
  let ultimoErro;
  
  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      return await consultarGemini(mensagemUsuario, historico);
    } catch (error) {
      ultimoErro = error;
      console.warn(`⚠️ Tentativa ${tentativa}/${maxTentativas} falhou:`, error.message);
      
      // Se for erro de rate limit, espera mais tempo
      if (error.message.includes('quota') && tentativa < maxTentativas) {
        await sleep(3000 * tentativa); // 3s, 6s, 9s...
      } else if (tentativa < maxTentativas) {
        await sleep(1000);
      }
    }
  }
  
  throw ultimoErro;
}

/**
 * Testar se a chave da API está válida
 * Usa o mesmo modelo PRIMARY do index.html
 */
export async function testarChaveAPI(apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODELS.PRIMARY}:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'ok' }] }],
        generationConfig: { maxOutputTokens: 5 }
      })
    });

    const data = await response.json();
    
    if (!data.error) {
      return { 
        sucesso: true, 
        mensagem: `✅ Chave válida! Modelo: ${GEMINI_MODELS.PRIMARY}` 
      };
    }

    const status = data.error.status || '';
    
    // Chave válida mas rate limit temporário — não é erro permanente
    if (status === 'RESOURCE_EXHAUSTED') {
      return { 
        sucesso: true, 
        mensagem: '✅ Chave válida! (rate limit temporário — pode usar normalmente)' 
      };
    }
    
    if (status === 'UNAUTHENTICATED' || status === 'PERMISSION_DENIED') {
      return { 
        sucesso: false, 
        mensagem: '❌ Chave inválida ou sem permissão. Verifique em aistudio.google.com/app/apikey' 
      };
    }
    
    // Qualquer outro erro: mostra mas não bloqueia
    return { 
      sucesso: false, 
      mensagem: `⚠️ ${data.error.message}` 
    };

  } catch (error) {
    console.error('Erro ao testar chave:', error);
    return { 
      sucesso: false, 
      mensagem: `❌ Sem conexão: ${error.message}` 
    };
  }
}

/**
 * Helpers
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validar se a API está configurada
 */
export function validarConfiguracao() {
  const apiKey = getApiKey();
  return {
    configurada: !!apiKey,
    mensagem: apiKey 
      ? '✅ Gemini API configurada' 
      : '❌ Configure sua chave da API em Configurações'
  };
}

/**
 * Estimar custo de uma requisição
 * Gemini Flash: GRATUITO até 15 RPM / 1M TPM / 1500 RPD
 */
export function estimarCusto(inputTokens, outputTokens) {
  // Gemini Flash é gratuito para uso moderado
  const custoInput = 0;
  const custoOutput = 0;
  const custoTotal = 0;

  return {
    inputTokens,
    outputTokens,
    custoInput: 'GRÁTIS',
    custoOutput: 'GRÁTIS',
    custoTotal: 'GRÁTIS',
    formatado: 'R$ 0,00 (API Gratuita)',
    info: 'Gemini Flash é gratuito: 15 req/min, 1M tokens/min, 1500 req/dia'
  };
}

/**
 * Gerenciar a chave da API
 */
export function salvarChaveAPI(chave) {
  setApiKey(chave);
}

export function obterChaveAPI() {
  return getApiKey();
}

export function removerChaveAPI() {
  try {
    localStorage.removeItem('devcom_ia_key');
  } catch (e) {
    console.error('Erro ao remover chave:', e);
  }
}

// Exporta tudo (mantém compatibilidade com nomes antigos)
export default {
  consultarGemini,
  consultarGeminiComRetry,
  consultarClaude: consultarGemini, // Alias para compatibilidade
  consultarClaudeComRetry: consultarGeminiComRetry, // Alias
  testarChaveAPI,
  validarConfiguracao,
  estimarCusto,
  salvarChaveAPI,
  obterChaveAPI,
  removerChaveAPI
};

