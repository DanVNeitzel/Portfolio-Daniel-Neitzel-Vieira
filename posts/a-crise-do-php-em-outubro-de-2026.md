# A Crise do PHP em Outubro de 2026

Publicado em 30 de outubro de 2026 por Daniel Neitzel. Informações verificadas até esta data.

Outubro de 2026 trouxe um alerta importante para quem desenvolve ou mantém aplicações PHP. Duas vulnerabilidades críticas exigiram uma atualização emergencial e colocaram em discussão a manutenção da infraestrutura usada por muitos serviços web.

O episódio também oferece uma oportunidade para entender como falhas no ambiente de execução afetam aplicações e por que atualizar a infraestrutura precisa fazer parte da rotina de desenvolvimento.

## O que aconteceu

Em 20 de outubro, o projeto PHP anunciou uma atualização de segurança para o dia seguinte. As duas falhas receberam classificação CVSS v4.0 de 9,2, considerada crítica. Em 21 de outubro, foram disponibilizadas as correções para as versões estáveis afetadas. Fonte: comunicado oficial do PHP.

As vulnerabilidades podem permitir execução remota de código sem autenticação. As condições de exploração variam conforme a configuração e os caminhos de execução da aplicação. O comunicado incluiu PHP-FPM, mod_php e outros ambientes que atendem requisições web, destacando o risco do mod_php.

## Duas falhas no gerenciamento interno

A CVE-2026-109618 envolve corrupção de memória durante o tratamento de falta de memória. A CVE-2026-109619 envolve estado interno que pode continuar apontando para memória já liberada e ser reutilizado por outra requisição. Fonte: análise da PHP Foundation.

São falhas no próprio runtime. Isso explica por que revisar apenas o código do projeto não resolve o incidente: a correção também precisa chegar ao componente que executa a aplicação.

## Por que a divulgação virou uma crise

Segundo a PHP Foundation, os identificadores das falhas começaram a circular em 20 de outubro, acompanhados de informações incorretas. O lançamento foi antecipado de 22 para 21 de outubro. Depois, um vídeo publicado por engano expôs detalhes adicionais limitados.

A Foundation também reconheceu que sinais do problema de falta de memória haviam surgido em 2024. Dificuldades de decisão, compatibilidade e recursos atrasaram a solução. Novas pesquisas em 2026 demonstraram seu impacto e tornaram a correção prioridade.

Esse relato mostra a importância de financiar a manutenção do software aberto e definir processos capazes de resolver decisões técnicas difíceis antes que se tornem emergências.

## Quais versões receberam correções

Para as duas vulnerabilidades, as atualizações estáveis anunciadas em 21 de outubro foram:

- PHP 8.2.35.
- PHP 8.3.36.
- PHP 8.4.27.
- PHP 8.5.12.

Essas são as versões daquele lançamento; consulte o fornecedor para atualizações posteriores e correções retroportadas. Fonte: PHP.net.

## O impacto no WordPress

O WordPress esclareceu que as falhas não eram específicas do CMS e que uma atualização do WordPress não corrigiria esses problemas. A orientação foi verificar com a hospedagem a atualização do PHP. A versão pode ser consultada em Ferramentas, Saúde do site, Informações, Servidor. Fonte: WordPress.org.

## O que acompanhar depois da atualização

O PHP publicou orientações adicionais em 23 de outubro sobre uma combinação incomum de configurações de sessão e, em 26 de outubro, novos pacotes Windows com uma correção na dependência Brotli. Portanto, a resposta ao incidente exige acompanhar os avisos posteriores ao primeiro patch. Fonte: PHP.net.

## Lições para quem desenvolve e mantém sistemas

Na minha avaliação, o episódio reforça práticas que precisam ter responsáveis e espaço no planejamento:

- Inventariar versões e ambientes em produção.
- Confirmar com a hospedagem quais correções foram aplicadas.
- Testar atualizações e verificar a aplicação após a implantação.
- Planejar migrações de versões sem suporte.
- Acompanhar comunicados oficiais durante todo o incidente.

Uma boa rotina de manutenção reduz a incerteza na hora de agir. Saber o que está em produção, quem atualiza cada componente e como verificar o resultado ajuda a responder com mais rapidez e segurança.

## Fontes oficiais

PHP.net — comunicados de 20, 21, 23 e 26 de outubro de 2026: https://www.php.net/archive/2026.php

PHP Foundation — análise técnica e relato da coordenação da correção: https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/

WordPress.org — orientação para responsáveis por sites: https://wordpress.org/news/2026/10/critical-php-security-release/
