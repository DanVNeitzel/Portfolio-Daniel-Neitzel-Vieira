# Do commit à produção: como montar uma esteira CI/CD com Jenkins, AWS e Azure

Qual commit está em produção? Foi essa versão que passou em homologação? Quanto tempo leva para voltar à versão anterior? Se a resposta depende de alguém lembrar os comandos que executou, vale colocar esse processo em uma esteira.

Vamos usar um frontend Angular estático como exemplo. O Jenkins valida o código e gera o build. A publicação pode seguir para AWS, com S3 e CloudFront, ou para Azure, com Static Web Apps.

Cada ferramenta tem um papel na esteira:

- Jenkins: orquestra instalação, testes, build e deploy a partir do Jenkinsfile.
- AWS S3 e CloudFront: armazenam e entregam os arquivos do frontend.
- Azure Static Web Apps: hospeda a aplicação estática.
- Azure Pipelines: pode orquestrar o processo quando a equipe usa Azure DevOps.

## 1. Defina o que acontece do pull request ao deploy

A integração contínua (CI) começa no pull request. Instale as dependências pelo lockfile com npm ci, execute os testes e verifique se a aplicação compila. Use o resultado como requisito para o merge.

A entrega contínua (CD) começa com um artefato pronto para publicação. Após o merge na branch principal, gere o build, publique em homologação e valide a URL. Se produção exigir aprovação, promova o mesmo artefato aprovado. Quando a publicação em produção acontece automaticamente após as verificações, o processo é chamado de implantação contínua.

No Angular, o artefato é a pasta com o index.html e os arquivos gerados. Se homologação e produção usam APIs diferentes, uma configuração pública carregada em tempo de execução permite reutilizar o build. Segredos ficam no backend, pois os arquivos enviados ao navegador podem ser inspecionados.

## 2. Versione a esteira no Jenkinsfile

O exemplo usa um job Multibranch Pipeline, um agente Linux com Node.js compatível com o projeto e um script test:ci que executa os testes uma vez e falha quando um teste quebra. Ajuste APP_DIR para a saída real do build.

```groovy
pipeline {
    agent { label 'linux-node' }

    options {
        disableConcurrentBuilds()
    }

    environment {
        APP_DIR = 'dist/meu-app/browser'
    }

    stages {
        stage('Validar') {
            steps {
                sh 'npm ci'
                sh 'npm run test:ci'
            }
        }

        stage('Gerar artefato') {
            steps {
                sh 'npm run build -- --configuration production'
                sh 'test -f "$APP_DIR/index.html"'
                archiveArtifacts artifacts: "${env.APP_DIR}/**", fingerprint: true
            }
        }
    }
}
```

Configure a integração do repositório com o Jenkins para disparar o job quando houver mudanças. Adicione um dos estágios de deploy abaixo dentro de stages, depois do build. Os dois exemplos publicam somente em homologação, a partir da main. Mantenha os agentes e as credenciais de publicação restritos a execuções confiáveis.

## 3. Publique na AWS ou no Azure

## AWS com S3 e CloudFront

Use um bucket privado, com seu endpoint REST como origem do CloudFront e acesso controlado por Origin Access Control (OAC). O agente de deploy precisa da AWS CLI e de uma identidade com credenciais temporárias e acesso limitado ao bucket e à distribuição de homologação.

```groovy
stage('Publicar na AWS') {
    when { branch 'main' }

    steps {
        sh '''
            aws s3 sync "$APP_DIR/" s3://meu-app-hml/ --exclude index.html
            aws s3 cp "$APP_DIR/index.html" s3://meu-app-hml/index.html --cache-control no-cache
            aws cloudfront create-invalidation --distribution-id ID_DA_DISTRIBUICAO --paths '/' '/index.html'
        '''
    }
}
```

Os bundles sobem primeiro porque o HTML aponta para eles. Preserve os arquivos com hash das versões anteriores durante a janela de rollback. Configure a política de cache para respeitar a revalidação do HTML. Para rotas Angular sem fragmento na URL, configure o CloudFront para encaminhar as rotas da aplicação ao index.html, preservando os erros de arquivos estáticos ausentes.

## Azure com Static Web Apps

Crie um recurso dedicado à homologação, instale a CLI swa no agente e cadastre o token de deploy como credencial Secret text no Jenkins.

```groovy
stage('Publicar no Azure') {
    when { branch 'main' }

    steps {
        withCredentials([string(
            credentialsId: 'azure-swa-hml-token',
            variable: 'SWA_CLI_DEPLOYMENT_TOKEN'
        )]) {
            sh 'swa deploy "$APP_DIR" --env production'
        }
    }
}
```

O argumento --env production aponta para o ambiente principal do recurso de homologação. A produção pode ficar em um recurso separado, com outro token. Para rotas sem fragmento na URL, inclua o arquivo staticwebapp.config.json no build e configure navigationFallback para o index.html, excluindo os caminhos dos arquivos estáticos.

Se a equipe já usa Azure Pipelines, o fluxo pode ser definido em um azure-pipelines.yml. A tarefa AzureStaticWebApp@0 aceita o frontend já compilado. Use skip_app_build: true, aponte app_location para a pasta do build e deixe output_location vazio.

## 4. Valide o que foi publicado e ensaie o rollback

Depois do deploy, teste a página inicial e abra uma rota interna diretamente pela URL. Confirme se os bundles carregam e se a aplicação chama a API do ambiente esperado. Na AWS, aguarde a conclusão da invalidação antes de verificar a versão pela URL pública.

Registre qual execução publicou cada versão. Para voltar, recupere o artefato da última versão estável e publique-o pelo mesmo processo. Faça esse exercício em homologação antes de adicionar a aprovação de produção. Assim, na primeira falha real, a equipe já sabe onde encontrar a versão estável e como confirmar que ela voltou ao ar.

## Documentação oficial

- Jenkins Pipeline: https://www.jenkins.io/doc/book/pipeline/syntax/
- S3 como origem do CloudFront: https://repost.aws/knowledge-center/cloudfront-serve-static-website
- Deploy com a CLI do Azure Static Web Apps: https://learn.microsoft.com/en-us/azure/static-web-apps/static-web-apps-cli-deploy
- Tarefa AzureStaticWebApp no Azure Pipelines: https://learn.microsoft.com/pt-br/azure/devops/pipelines/tasks/reference/azure-static-web-app-v0?view=azure-pipelines
