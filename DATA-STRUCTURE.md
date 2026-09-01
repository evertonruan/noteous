# Estrutura de Dados do Noteous

## Visão Geral
Este documento descreve a estrutura de dados armazenados no `localStorage` do Noteous.

---

## `noteous-main` (Array de Notas)

Armazena todas as notas do usuário.

### Estrutura:
```json
[
  {
    "id": 1234567890,
    "content": "Texto da nota",
    "priority": "solid",
    "done": false,
    "createdAt": 1234567890,
    "editedAt": 1234567890
  }
]
```

### Campos:
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | Number | Timestamp de criação, usado como ID único |
| `content` | String | Conteúdo da nota (texto puro, sem HTML) |
| `priority` | String | Nível de prioridade: `"solid"`, `"double"`, `"dotted"` |
| `done` | Boolean | Se a nota foi concluída (marcada como feita) |
| `createdAt` | Number | Timestamp de criação |
| `editedAt` | Number | Timestamp da última edição |

### Exemplo Completo:
```json
[
  {
    "id": 1725124800000,
    "content": "Comprar leite no supermercado",
    "priority": "solid",
    "done": false,
    "createdAt": 1725124800000,
    "editedAt": 1725124850000
  },
  {
    "id": 1725124900000,
    "content": "Projeto de implementação de segurança",
    "priority": "double",
    "done": true,
    "createdAt": 1725124900000,
    "editedAt": 1725125000000
  }
]
```

---

## `noteous-settings` (Objeto de Configurações)

Armazena todas as preferências e configurações do usuário.

### Estrutura Geral:
```json
{
  "noteousApp": {
    "noteousVersion": 2.31,
    "acceptedTermsVersion": 2607
  },
  "look": {
    "baseRem": "--base-rem: 100%;",
    "hue": "--hue: 45;",
    "saturation": "--saturation: 20%;",
    "luminosity": "light",
    "lumBack": "--lum-back: 95%;",
    "lumMid": "--lum-mid: 70%;",
    "lumFront": "--lum-front: 15%;",
    "lumFrontInverse": "--lum-front-inverse: 95%;",
    "accentSaturation": "--accent-saturation: 20%;",
    "accentLum": "--accent-lum: 60%;",
    "lumAccentContainer": "--lum-accent-container: 65%;"
  },
  "actionButtons": ["share", "copy"],
  "orbsIndex": ["donutdough", "done"],
  "selectedOrb": "donutdough",
  "priorityOrder": ["solid", "double", "dotted"],
  "priorityOrientation": "column",
  "sort": {
    "action": "editedAt",
    "time": "recent"
  },
  "input": "",
  "noteId": 0,
  "fileId": null
}
```

### Submódulos:

#### `noteousApp`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `noteousVersion` | Number | Versão atual do app (ex: 2.31) |
| `acceptedTermsVersion` | Number | Versão dos termos aceitos pelo usuário |

#### `look` (Temas e Aparência)
Controla a aparência visual do app com variáveis CSS customizadas.
- `baseRem`: Tamanho base da fonte (`100%`, `106.25%`, `93.75%`)
- `luminosity`: Tema (`"light"` ou `"dark"`)
- Outras: Variáveis CSS para cores e contraste

#### `actionButtons`
Array de strings indicando quais botões de ação estão ativos:
- `"share"` - Compartilhar notas
- `"copy"` - Copiar texto

#### `orbsIndex`
Array de orbs disponíveis:
- `"donutdough"` - Orb padrão (notas não concluídas)
- `"done"` - Orb de notas concluídas

#### `sort`
| Campo | Tipo | Valores |
|-------|------|---------|
| `action` | String | `"editedAt"` (última edição) ou `"id"` (criação) |
| `time` | String | `"recent"` (mais recentes) ou `"old"` (mais antigas) |

#### `priorityOrder`
Array que define a ordem das listas de prioridade na tela:
- `"solid"` - Prioridade alta
- `"double"` - Prioridade média
- `"dotted"` - Prioridade baixa

#### Campos de Estado
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `input` | String | Conteúdo temporário do campo de input |
| `noteId` | Number | ID da nota sendo editada (0 se nenhuma) |
| `fileId` | String \| null | ID do arquivo da última cópia criada |

---

## Validação de Dados

Ao carregar dados do localStorage, use a função `getValidatedStorage()`:

```javascript
// Carrega com validação
let noteousMain = getValidatedStorage('noteous-main', { type: 'array' }) || []
let noteousSettings = getValidatedStorage('noteous-settings')
```

Esta função:
- Verifica se o JSON é válido
- Valida o tipo esperado (array ou object)
- Retorna `null` se houver erro
- Loga avisos no console

---

## Salvamento de Dados

Use `setSafeStorage()` para garantir salvamento seguro:

```javascript
// Salvar notas
setSafeStorage('noteous-main', noteousMain)

// Salvar configurações
setSafeStorage('noteous-settings', noteousSettings)
```

---

## Notas sobre Segurança

⚠️ **Importante**: 
- **Nunca** use `.innerHTML` com dados do usuário. Sempre use `.textContent` ou `createElement()`
- Os dados em localStorage podem ser acessados por scripts maliciosos. Não armazene informações sensíveis
- Valide sempre os dados ao recuperar do storage, especialmente após importar backups
- O campo `content` em notas é sempre salvo como **texto puro**, nunca como HTML

---

## Histórico de Versões

| Versão | Data | Mudanças |
|--------|------|----------|
| 2.31 | 2026-08-31 | Documentação de segurança adicionada |
| 2.0+ | 2026+ | Orbs, sistema de prioridades |
| 1.0-1.9 | 2024-2026 | Versões iniciais |

---

## Referências
- Arquivo: `security-utils.js` - Funções de segurança
- Arquivo: `noteousParams.js` - Parâmetros constantes
- Arquivo: `index.js` - Inicialização e carregamento

