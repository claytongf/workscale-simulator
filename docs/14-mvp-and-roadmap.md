# 14 — MVP e roadmap

## MVP 1 — Simulação individual

Funcionalidades:

- selecionar escala;
- configurar horas por dia;
- configurar salário;
- configurar tipo de trabalho;
- configurar deslocamento;
- configurar sono;
- configurar descanso;
- configurar perfil produtivo;
- configurar experiência;
- configurar férias;
- simular 30, 90 ou 365 dias;
- exibir barra de energia;
- exibir gráfico de energia;
- exibir produtividade;
- comparar 6x1 vs 5x2.

Sem login.

Sem banco obrigatório.

Pode salvar cenário localmente no navegador.

## MVP 2 — Empresa e custos

Funcionalidades:

- número de funcionários;
- custo por funcionário;
- benefícios;
- encargos trabalhistas editáveis;
- custo fixo;
- custo variável;
- produção total;
- custo por unidade;
- preço final;
- comparação de cenários empresariais.

## MVP 3 — Países

Funcionalidades:

- preset Brasil;
- preset EUA;
- preset Reino Unido;
- preset União Europeia genérico;
- regras de jornada;
- impostos/encargos editáveis;
- comparação internacional.

## MVP 4 — Compartilhamento

Funcionalidades:

- salvar cenários;
- gerar link público;
- exportar relatório;
- exportar imagem para redes sociais;
- exportar PDF;
- modo apresentação para vídeo.

## Roadmap técnico

```txt
Fase 1: documentação [Concluída]
Fase 2: engine matemática isolada em Python [Concluída]
Fase 3: API FastAPI [Concluída]
Fase 4: frontend Next.js [Concluída]
Fase 5: gráficos e dashboard [Concluída]
Fase 6: comparação de cenários [Concluída]
Fase 7: custos empresariais [Concluída]
Fase 8: presets por país [Concluída]
Fase 9: exportações [Concluída]
Fase 10: documentação e repositório [Concluída]
Fase 11: deploy e divulgação pública
```

## Testes

Testar:

- energia nunca passa de 100;
- energia nunca fica menor que 0;
- burnout nunca passa de 100;
- burnout nunca fica menor que 0;
- produção líquida não é negativa;
- preço final não divide por zero;
- margem deve ser menor que 1;
- férias reduzem burnout dentro dos limites;
- escalas customizadas validam horas semanais;
- deltas absolutos e percentuais são calculados com segurança para cenários zerados.

### Validação de Qualidade e Integração Contínua (CI)

Implementado na Fase 8, o projeto agora possui verificação de qualidade estrita automatizada a cada push ou pull request na branch `main`:

#### Backend (Python)
- **Ruff**: Executa análises de qualidade de código rápidas baseadas em regras de lint (`E`, `F`, `I`, `N`, `UP`, `B`, `C4`, `SIM`).
- **Mypy**: Valida a tipagem estática do código Python.
- **Pytest**: Executa toda a suíte de testes de fórmulas e endpoints da API.

#### Frontend (TypeScript / Next.js)
- **ESLint**: Linter para React e Next.js.
- **TypeScript**: Checagem estática de tipagem estrita com `tsc --noEmit`.
- **Next Build**: Validação de empacotamento completo em produção.

Workflows correspondentes são executados de forma paralela via GitHub Actions nos arquivos `.github/workflows/backend.yml` e `.github/workflows/frontend.yml`.

