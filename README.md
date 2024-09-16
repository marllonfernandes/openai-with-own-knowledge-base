# openai-with-own-knowledge-base

OpenAI with Own Knowledge Base
Este projeto Node.js permite criar um assistente personalizado que utiliza seus próprios documentos como base de conhecimento.

## Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:

- [Node.js](https://nodejs.org/)

Além disto, é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

## Instalação

- Clone o repositório:
  ```git clone https://github.com/marllonfernandes/openai-with-own-knowledge-base```

- Navegue até o diretório do projeto: 
- Crie o arquivo `.env` e preencha a variável de ambiente `OPENAI_API_KEY` pela sua chave de API da OpenAI

- Instale as dependências do projeto:
  ```npm install```

- Carregue seus documentos:
  ``` Coloque os arquivos que deseja usar como base de conhecimento na pasta documents. ```
  ```Arquivos suportados: *.json, *.txt, *.csv e *.pdf```

- Execute o script loader.js para processar os documentos e gerar o banco de dados de vetores:
  ```npm run loader```

- Os arquivos processados serão salvos na pasta `data`.

- Inicie a aplicação:
  ```npm start```

## Utilização

Após iniciar a aplicação, você pode fazer perguntas ao seu assistente personalizado acessando a rota `/question` com o parâmetro `prompt`:

- Exemplo: ``` http://localhost:3000/question?prompt=Sua pergunta aqui ```

## Estrutura do Projeto

- `documents/`: Pasta para armazenar os documentos da base de conhecimento.
- `data/`: Pasta para armazenar os arquivos do banco de dados de vetores.
- `loader.js`: Script para processar os documentos e gerar o banco de dados de vetores.
- `app.js`: Arquivo principal da aplicação, define as rotas da API.
### Dependências
- @langchain/community
- @langchain/openai
- d3-dsv
- express
- faiss-node
- langchain

### Observações
- Certifique-se de ter uma chave de API válida da OpenAI.
- A pasta documents será criada automaticamente se não existir.
- O script loader.js precisa ser executado apenas uma vez, a menos que você adicione ou modifique os documentos da base de conhecimento.