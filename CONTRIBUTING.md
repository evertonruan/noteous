# *noteous* - Informações para contribuir


Todo tipo de contribuição é bem-vinda (ajustar um texto, corrigir um bug ou sugerir um recurso)


Por favor, considere estes pontos:

### 1. Como este projeto está organizado?
Este projeto possui dois branches principais: `main` e `main-preview`
- `main`: É o aplicativo estável, para as pessoas utilizarem sem problemas. Recebe novos recursos apenas quando são estáveis.
- `main-preview`: É o aplicativo de experimentações e com os recursos mais avançados. É direcionado para entusiastas ou desenvolvedores.

---
### 2. Ok, por onde posso contribuir?
Por favor, baseie suas contribuições apenas na branch `main-preview` (noteous preview). Essa é a branch que recebe todos os novos recursos, correções e testes.

---

### 3. Entendi. Por onde começo?
Obrigado pelo seu interesse em contribuir com o noteous! Há muito o que fazer. O foco é torná-lo prático e inteligente, usando apenas tecnologia local, não baseada em nuvem. Também, até onde for possível, não utilizar nenhum framework ou biblioteca adicional.
Você pode conferir 3 locais para ter uma ideia do projeto: Issues, Milestones e Releases.
- Issues: Veja quais são as melhorias e correções específicas de próximas versões e fique à vontade para contribuir
- Milestones: Esses são grandes objetivos a serem atingidos, às vezes mostrados de forma um pouco abstrata, afinal esse caminho vai se definindo com o tempo
- Releases: Cada nova versão ganha uma release, que agrupa todos os commits feitos, e alguns contém explicações detalhadas.

### 4. Encontrei algo para contribuir. E agora?
a. Faça um **Fork** deste repositório para seu GitHub. <br>
b. Clone o seu fork na sua máquina. <br>
c. **Importante:** Mude para o branch de preview antes de começar: <br>
```bash
   git checkout main-preview
```
d. Crie um branch para a sua alteração partindo do main-preview: <br>
```bash
git checkout -b minha-nova-feature
```
e. Faça suas alterações e crie commits claros (ex: git commit -m "feat: adiciona botão de deletar nota").

f. Envie o código para o seu fork:
```bash
   git push origin minha-nova-feature
```
g. Abrindo o Pull Request
- Vá até o repositório original do noteous no GitHub.
- Clique em New Pull Request.
- ⚠️ Atenção na Base: Altere o branch de destino (base) para main-preview. O branch de origem (compare) deve ser o branch que você criou no seu fork.
- Descreva brevemente o que você mudou e por quê

### 5. Estou com uma dúvida ou quero conversar sobre o projeto
Você pode abrir uma Issue, ou enviar pelo e-mail contato@evertonruan.com
