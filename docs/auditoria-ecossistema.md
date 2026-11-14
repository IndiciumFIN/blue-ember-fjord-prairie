# Auditoria do ecossistema

Isto não certifica ISO, COSO, WCAG nem COFEN. O escopo gravado em `governance_item` deixa certificado ISO de fora. A auditoria só cobra o que as tabelas e as políticas desta mesa já dizem.

## Bloqueio

Falha o teste. Não pode ir ao ar.

| Id | Norma interna | O que impede |
|---|---|---|
| PUB-CORPO | Política de dado | Texto publicado com corpo vazio |
| CLI-CAPA | Capa do instrumento | Cálculo aberto fora de Apgar, Braden, gotejamento, IMC e Morse |
| CLI-FORMULA | Fórmula | Capa publicada sem fórmula, critério ou campo |
| KER-PESSOA | Admissão | Aprovador com o valor `kernel` |
| LGPD-PACIENTE | Política de dado | Coluna de paciente, leito, prontuário ou CPF |

## Achado

O teste exige que um achado só permaneça enquanto a causa existir. Os dois de dicionário físico só aparecem se a paridade das tabelas quebrar.

| Id | Norma citada | O que ainda não fecha |
|---|---|---|
| I18N-ALT | WCAG 3.1.2 | Texto alternativo em outro idioma ainda em rascunho |
| I18N-HREFLANG | WCAG 3.1.1 | O seletor anuncia idioma cujo corpo clínico não está publicado |
| I18N-CHROME | Rótulo da interface | Português sem par em inglês, espanhol ou francês. Hoje não dispara. |
| REG-RASCUNHO | Regra de negócio | Nasce em rascunho e não vale como controle aprovado |
| DIC-ENTIDADE-SEM-TABELA | Dicionário interno, não ISO 8000 | Entidade sem tabela. Hoje não dispara. |
| DIC-TABELA-SEM-ENTIDADE | Dicionário interno | Tabela sem entidade. Hoje não dispara. |

A aprovação de 1º de novembro de 2026 publicou o texto que já tinha corpo. As 77 capas sem fórmula não entram no `db:migrate`. A prévia sem `DATABASE_URL` aplica [migrations/preview/0086_publicacao_teste.sql](../migrations/preview/0086_publicacao_teste.sql) e abre esse texto. Isso não homologa fórmula nem autorização de publicação.

Fora deste conjunto: produto Schema.org, CPF, endereço, isolamento por empresa e estatística de tabela zumbi. Não há essas estruturas.

A execução está em [src/lib/ecosystem-audit.ts](../src/lib/ecosystem-audit.ts) e entra no `npm test`.
