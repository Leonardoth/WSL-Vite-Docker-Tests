# Este é um projeto simples para aprender a utilizar Vite + Docker (com WSL)

## Links uteis:
    - https://dev.to/ysmnikhil/how-to-build-with-react-or-vue-with-vite-and-docker-1a3l (Encontrei depois de ter resolvido 80% dos problemas, por isso algumas soluções desse link serão melhores que as vistas aqui, que devo atualizar futuramente)

* Comecei utilizando a plataforma WSL2 e instalei uma distro Ubuntu

## Objetivo: Acessar os arquivos do WSL pelo vscode
* Precisei adicionar a extensão Remote Development que por sua vez instalou a extensão WSL que permite o acesso.
* Dentro do code eu cliquei na extensão e em 'conectar WSL'
* Ao executar `code` dentro do WSL, ele fez o download automatico do vscode-server e abriu, permitindo que eu acessasse remotamente meus arquivos.

## Objetivo: Criar um projeto Vite e acessá-lo fora do WSL
* Utilizei o seguinte comando:
    ```
    npm create vite@latest vitedocker
    ```
* Naveguei para a pasta do projeto e instalei as dependencias e o executei.
    ```
    cd vitedocker
    npm install
    npm run dev
    ```
* Acessei o arquivo vite.config.ts e adicionei ao objeto config:
```
server : {

    # Possibilita que o vite possa ser acessado por outros dispositivos na rede e nao apenas localhost
    host: '0.0.0.0',

    # Define a porta que será usada pelo Vite
    port: 3000
  }
```

* Vi que estava tudo funcionando corretamente. Mesmo dentro do ambiente WSL2 eu consegui acessar através do localhost.


## Objetivo: Utilizar o Docker
* A partir dai meu objetivo era utilizar o docker.
* Criei uma Dockerfile com o seguinte conteúdo 
```
# Seleciona uma imagem numa versão especifica do node 
# Propositalmente selecionei uma versão diferente da instalada no sistema pai.

FROM node:14-alpine

# Define o diretório que será executado os comandos, basicamente define 'onde estamos'

WORKDIR /vitedocker

# Copia a package.json (e package-lock, basicamente qualquer arquivo que comece com package e termine com .json) para o diretorio /vitedocker
# Por que não copiar tudo? Explicação: https://dev.to/dimitrisnl/comment/ah9f

COPY package*.json /vitedocker

# Roda npm install no BUILD da imagem (instala as dependencias necessarias, node_modules)
# no docker compose também teremos npm install para garantir que todas as dependencias estão instaladas

RUN npm install

COPY . /vitedocker
``` 



* A seguir, criei um docker-compose.yml (Talvez seja desnecessário, mas achei util aprender): (Poderia ter feito diretamente assim: https://javascript.plainenglish.io/frontend-development-with-docker-a-simplified-guide-c869f6ee0fe8)

```
# Define a versão do docker-compose
version: '3'

# Define os serviços que serão abertos
services:
    # Alias do serviço
  app:
    # Define o contexto da build (substitui image)
    build:
    # Define que o contexto é o local em que está (ele irá procurar um Dockerfile na pasta raiz)
      context: .
    # Define a porta que tem que ser redirecionada, 3000 do host direcionará para 3000 do container
    ports: 
      - 3000:3000
    
    # Comandos que serão rodados sempre que utilizar o comando "docker compose up"
    command: sh -c 'npm install && npm run dev'
```

* A pesar de funcionar, quando a build (Dockerfile) acontece e os arquivos são copiados, significa que futuras alterações no host não irão ser refletidas no container. (Atrapalhando assim, utilizar para desenvolvimento)

    ## Solução:
    No arquivo `docker-compose`
    ```
    # Adicionamos volumes, que mapeia mudanças no diretório atual "./" para "/vitedocker", dentro do container

    volumes:
      - ./:/vitedocker
    ```

* Para instalar packages e etc, é preciso utilizar
    ```docker exec -it NOMEDOCONTAINER npm install NOMEDOPACOTE ```


## Objetivo: Adicionar testes

* Começamos utilizando o ```npm install vitest --save-dev```
  
  Depois na package.json adicionamos:
  ```
  {
  ...
    "scripts": {
      "dev": "vite",
      "build": "vite build",

      ## Linha Adicionada
      "test": "vitest",


      "preview": "vite preview"
    },
  }
  ```
  Criando um arquivo ex: App.test.tsx
  ```
  import { describe, it, expect } from 'vitest';

  describe('something truthy and falsy', () => {
    it('true to be true', () => {
      expect(true).toBe(true);
    });

    it('false to be false', () => {
      expect(false).toBe(false);
    });
  });
  
  ```

  Podemos rodar ```npm run test``` e confirmar que está funcionando.

## Objetivo: Adicionar React Testing Library

* Como a biblioteca React testa componentes, precisamos habilitar o HTML, adicionamos a biblioteca jsdom junto à ela.
  ```npm i -D jsdom @testing-library/react```

  * Após isso, incluiremos na configuração do Vite:
  ```
  # Adicionaremos essa parte
  /// <reference types="vitest" />
  /// <reference types="vite/client" />
  .
  .
  .
  export default defineConfig({
    ... (conteudo anterior, plugins, server)

    # Adicionamos também esse trecho:
    test: {
      globals: true,
      environment: 'jsdom',
    }
  })
  ```
  