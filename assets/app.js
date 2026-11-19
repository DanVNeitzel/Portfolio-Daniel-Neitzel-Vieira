const state = {
    user: null,
    chats: [],
    currentChat: null,
    messagesLoaded: new Set(),
    messageById: new Map(),
    pinnedMessages: [],
    pendingOutbox: [],
    contextMessage: null,
    replyTo: null,
    editingMessage: null,
    selectionMode: false,
    selectedMessages: new Set(),
    forwardMessage: null,
    viewerMessage: null,
    viewerZoom: 1,
    viewerPanX: 0,
    viewerPanY: 0,
    viewerDragging: false,
    viewerDragStartX: 0,
    viewerDragStartY: 0,
    viewerDragBaseX: 0,
    viewerDragBaseY: 0,
    viewerLastTapAt: 0,
    viewerLastTapX: 0,
    viewerLastTapY: 0,
    viewerEditing: false,
    viewerGallery: [],
    viewerGalleryIndex: 0,
    imageEditor: null,
    confirmResolver: null,
    confirmHasCheckbox: false,
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    pendingIceCandidates: [],
    activeCall: null,
    incomingCall: null,
    callRole: '',
    callMode: 'audio',
    callPolling: null,
    callPollInFlight: false,
    callAlertTimer: null,
    callDurationTimer: null,
    callStartedAt: null,
    localMediaStateTimer: null,
    lastLocalMediaStateKey: '',
    callLastSignalId: 0,
    callConnectionTimer: null,
    callIceRestartTimer: null,
    callIceRestartAttempts: 0,
    callStatsTimer: null,
    callEnding: false,
    callFacingMode: 'user',
    callSpeakerOn: false,
    callSpeakerDeviceId: '',
    callVideoSwapped: false,
    callControlsHidden: false,
    callPipPosition: null,
    callPipDrag: null,
    remoteMediaState: null,
    selectedFile: null,
    selectedFiles: [],
    imageQuality: 'reduced',
    mediaRecorder: null,
    recordingStream: null,
    recordingChunks: [],
    recordingStartedAt: 0,
    recordingTimer: null,
    recordingTimeout: null,
    isRecording: false,
    shouldSendRecording: false,
    soundEnabled: localStorage.getItem('NexoMessageSound') !== 'off',
    notificationPreview: localStorage.getItem('NexoMessageNotificationPreview') !== 'off',
    soundUnlocked: false,
    audioContext: null,
    notificationPermissionAsked: localStorage.getItem('NexoMessageNotificationAsked') === 'yes',
    previousUnread: new Map(),
    chatsLoadedOnce: false,
    polling: null,
    loadingCount: 0,
    loadingTimer: null,
    quickTab: 'emoji',
    emojiCatalog: null,
    emojiGroups: null,
    emojiActiveGroup: 'smileys-emotion',
    emojiSearchQuery: '',
    emojiCatalogLoading: false,
    emojiRecent: [],
    emojiRecentUser: '',
    customStickers: [],
    stickersLoaded: false,
    stickerHoldTimer: null,
    stickerHoldTargetId: 0,
    stickerSuppressClickUntil: 0,
    messageStickerHoldTimer: null,
    messageStickerHoldTargetId: 0,
    messageStickerSuppressClickUntil: 0,
    gifSearchQuery: '',
    gifSearchResults: [],
    gifSearching: false,
    gifSearchTimer: null,
    linkPreview: null,
    linkPreviewUrl: '',
    linkPreviewTimer: null,
    linkPreviewDismissed: false,
    qrDetector: null,
    qrScanFrame: 0,
    qrScanStream: null,
    qrScanning: false,
    deviceQrScanFrame: 0,
    deviceQrScanStream: null,
    deviceQrScanning: false,
    contextChat: null,
    chatFilter: 'all',
    qrLink: '',
    qrLoginToken: '',
    qrLoginTimer: null,
    qrLoginPollTimer: null,
    pendingUpdateVersion: '',
    appHistoryReady: false,
    leavingApp: false,
    sessionLogoutHandled: false,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const APP_VERSION = '165';
const APP_VERSION_COOKIE = 'NexoMessageVersion';
const OUTBOX_KEY = 'NexoMessageOutbox';
const USER_STATUS_KEY = 'NexoMessageUserStatus';
const INSTALL_PROMPT_DISMISSED_KEY = 'NexoMessageInstallPromptDismissed';
const PENDING_SHARE_KEY = 'NexoMessagePendingShare';
let deferredInstallPrompt = null;
const USER_STATUS_LABELS = { online: 'Online', away: 'Ausente', busy: 'Ocupado', invisible: 'Invisível' };
const APP_CHANGELOG = [
    'Chamadas de audio e video agora sao bloqueadas quando o destinatario esta offline.',
    'Sessao expirada agora forca o retorno imediato para a tela de login.',
    'Janela de emojis ajustada para nao criar rolagem lateral.',
    'O seletor de emojis agora possui o icone e a categoria de usados recentemente.',
    'Transcricao de audio agora usa a API gratuita da Groq com Whisper.',
    'Mensagens de audio agora podem ser transcritas e exibem o texto recolhivel.',
    'O painel administrativo agora configura globalmente os limites de upload de usuarios e administradores.',
    'O envio aguarda a previa do link quando ela ainda esta carregando.',
    'Links agora exibem previa com titulo, descricao e imagem antes e depois do envio.',
    'Busca dentro da conversa foi ativada pelo botao de lupa do cabecalho.',
    'QR Code do usuario agora pode ser aberto diretamente no painel de informacoes do contato.',
    'Notificacoes de chamada no celular agora ignoram registros tecnicos da conversa.',
    'A bolinha de status do avatar no cabecalho agora acompanha as atualizacoes da lista de conversas.',
    'Avisos e mensagens temporarias agora ficam acima dos botoes em todas as telas.',
    'Manifesto PWA atualizado para usar os icones 192x192 e 512x512 tambem no atalho de conversas.',
    'O site agora sugere a instalacao do NexoMessage no Chrome para Windows.',
    'Gravacao de audio no celular corrigida para nao descartar audios validos como muito curtos.',
    'Galeria de varias midias corrigida para abrir fotos e videos sem erro de funcao ausente.',
    'Botao voltar agora fecha modais, paineis e menus abertos antes de sair da conversa ou do app.',
    'Textos visiveis da interface foram padronizados em portugues.',
    'Envio de varias fotos e videos ganhou grid agrupada e visualizador com navegacao lateral.',
    'Painel de grupos voltou a mostrar edicao, participantes e comandos de administracao.',
    'Videochamadas ganharam layout em tela cheia com toque no video principal para ocultar ou mostrar os comandos.',
    'Historico de chamadas agora mostra cartoes com atendida, nao atendida e duracao.',
    'Chamada de audio ganhou layout inspirado no Telegram com avatar central e painel inferior.',
    'Cache do documento principal desativado para evitar retorno ao layout antigo da chamada.',
    'Mensagem falsa de rota de mídia corrigida quando a chamada ja foi alterada para audio ou encerrada.',
    'Fallback de video corrigido para respeitar ICE conectado mesmo quando o connectionState ainda esta conectando.',
    'Configuracao de teste WebRTC sem TURN: somente STUN e rotas diretas ICE serao usadas.',
    'Correção do áudio unidirecional: tracks remotos agora são tratados individualmente nos navegadores.',
    'Service Worker agora ignora requisições de extensões do navegador ao usar o cache.',
    'Chamadas agora monitoram qualidade, ajustam bitrate e fazem fallback automático para áudio.',
    'URLs de imagens e uploads agora usam o diretório real de publicação para sobreviver às novas versões.',
    'Chamadas otimizaram áudio, resolução, FPS e bitrate para melhorar desempenho e estabilidade da conexão.',
    'Áudio remoto agora usa elemento dedicado para melhorar reprodução e saída no WebRTC.',
    'ICE restart é coordenado pelo iniciador para evitar conflito de negociação entre os dois lados.',
    'WebRTC ganhou mais rotas STUN, timeout de conexão e reconexão automática por ICE restart.',
    'Chamadas de áudio e vídeo ganharam controles flutuantes, melhor indicação de conexão e enquadramento de vídeo.',
    'Figurinhas enviadas agora têm comportamento próprio e não abrem como imagens.',
    'Figurinhas padrão do serviço foram removidas; agora aparecem somente as figurinhas adicionadas pelo usuário.',
    'Status Ausente, Ocupado e Invisível agora é preservado diretamente na lista de contatos.',
    'Registro do Service Worker corrigido para funcionar com o caminho real de publicacao do app.',
    'Lista de conversas agora ignora cache para refletir imediatamente as mudanças de status.',
    'Todos os status de presenca passam para offline quando o app fica sem atividade.',
    'Presenca online agora expira automaticamente quando o usuario fecha o app sem fazer logout.',
    'Correção do erro ao salvar o status em instalações com configuração antiga.',
    'Status do usuário agora é salvo no servidor e refletido na lista de conversas dos outros usuários.',
    'Avatar corrigido para manter formato quadrado e circular mesmo com o indicador de status sobreposto.',
    'Indicador de status dos avatares foi reposicionado sobre a lateral da foto para ficar visível.',
    'Avatares de usuarios agora exibem uma bolinha colorida conforme o status.',
    'Menu principal agora permite definir o status como Online, Ausente, Ocupado ou Invisível.',
    'Botão de nova conversa agora oferece criar canal, grupo ou chat privado.',
    'Painel de informações agora mostra notificacoes e abas de Histórias, Mídias, Arquivos e Links para usuarios e grupos.',
    'Atalho de mensagem fixada abaixo do header da conversa.',
    'Clique no fixado e nas respostas citadas leva direto para a mensagem original.',
    'Visualizador de imagem mostra dimensoes, tamanho do arquivo e nome da mídia.',
    'Duplo clique ou duplo toque na imagem alterna o zoom.',
    'Modal de atualização com changelog e limpeza de cache/cookies.',
    'Campo de mensagem, botão de anexo e acoes do composer ficam fixos no rodape com muitas mensagens.',
    'Mensagens de texto podem ficar na fila offline e sao enviadas ao reconectar.',
    'Aviso offline do header fica curto e responsivo no celular.',
    'Opção de remover contato aparece no menu de conversas diretas.',
    'Recarregar sem internet mostra tela de erro de conexao com botão de tentar novamente.',
    'Status de Mensagens Salvas agora mostra suas mensagens privadas.',
    'Login ganhou opção de manter conectado por 30 dias.',
    'Adicionar usuário agora pode ler QR Code pela câmera.',
    'Mensagens Salvas ganhou icone proprio no avatar.',
    'Ligacao de áudio e videochamada agora usam WebRTC dentro do app.',
    'Botao voltar retorna para a lista ou confirma saida do app.',
    'Chamadas ficam registradas na conversa e mostram microfone/câmera do outro usuário.',
    'Videochamada agora divide as câmeras em tamanhos iguais com controles no rodape.',
    'Alternar entre video e áudio e encerrar chamada agora pedem confirmação.',
    'Chamadas agora mostram duracao, inverter câmera e atualizam microfone/câmera em tempo real.',
    'Duracao e status remoto de microfone/câmera agora sao persistidos na sessão da chamada.',
    'Status remoto de chamada usa tabela propria para evitar erro de banco em instalacoes existentes.',
    'Câmera durante chamada agora alterna o track sem remover a mídia ativa do WebRTC.',
    'Gravacao de áudio agora pode ser cancelada antes do envio.',
    'Notificações do navegador avisam novas mensagens e chamadas recebidas.',
    'Modal de atualização mostra changelog resumido com opção de ver mais.',
    'Player de áudio ganhou layout compacto inspirado no Telegram.',
    'Configurações expandidas ganharam Dispositivos, sessões e login via QR Code.',
    'Players de áudio antigos sao convertidos automaticamente para o novo layout.',
    'Áudios gravados como webm agora usam o player de áudio mesmo quando o servidor detecta como video.',
    'Chamadas de áudio e video ganharam controle de viva voz.',
    'Player de áudio permite alternar velocidade entre 1x, 1.5x e 2x.',
    'QR Code de login ganhou fallback visual e instrucoes mais claras em Dispositivos.',
    'Horarios agora sao convertidos para o fuso local do usuário.',
    'Tela de login permite rolagem para mostrar o QR Code completo.',
    'Sessões encerradas em outro dispositivo voltam automaticamente para o login.',
    'Visualizador de fotos ganhou editor com recorte, giro, ajustes, pincel, download e envio.',
    'Composer agora mantem o botão de acao encostado na lateral direita.',
    'Seletor de emojis agora inclui o catalogo Unicode atualizado.',
    'Nova secao Ajuda com informações do app e busca manual por atualizações.',
    'Seletor de emojis ganhou busca e categorias organizadas por tipo.',
    'Ligacoes de voz ganharam layout com avatar central e controles inferiores.',
    'Verificacao de atualização exibe a modal automaticamente quando existe uma nova versao.',
    'Controle de versao do app agora usa cookie proprio em vez de localStorage.',
    'Inicializacao do app agora consulta o servidor e forca a modal quando existe nova versao.',
    'Busca manual de atualizações ganhou fallback para evitar falso erro de conexao.',
    'Seletor de emojis agora usa a lista oficial do Unicode e imagens Sample em base64.',
    'Campos de senha ganharam botão para mostrar e ocultar o texto digitado.',
    'Modal de confirmação e legendas dos botões de chamada foram ajustadas para telas pequenas e grandes.',
    'Ícones e símbolos de mensagens agora usam SVG ou escapes seguros contra problemas de codificacao.',
    'Videochamada no computador ganhou layout com câmera remota principal e preview local dimensionado.',
    'Janela menor da videochamada agora pode ser movida e alternada com clique simples.',
    'Atualização do app agora preserva a sessão e apenas recarrega o conteudo novo.',
    'Icone do app, favicon e logo do login foram atualizados com as novas imagens.',
    'Agora e possivel criar grupos com usuários das conversas ativas.',
    'Arquivos anexados ganharam cartao compacto com download e reacao de coracao no hover.',
    'Atualização sincroniza a versao do app com o service worker e evita modal presa.',
    'Grupos ganharam administracao de membros, foto, descricao, nome e permissão de envio.',
    'Correção de acentuação em textos da interface e nomes técnicos do player de áudio.',
    'Opção de abrir conversa em nova guia foi removida do menu de contexto.',
    'Notificações do PWA ficaram mais confiáveis e ganharam teste manual nas configurações.',
    'Textos das mensagens agora podem ser selecionados e copiados sem selecionar textos do app.',
    'Chamadas normalizam permissões de câmera e microfone antes de abrir o getUserMedia.',
    'Chamadas de áudio e vídeo agora aguardam candidatos ICE até a descrição remota estar pronta.',
    'Botão de videochamada voltou para o header das conversas diretas.',
    'Registros de chamadas voltaram a aparecer como card em vez de texto tecnico.',
    'Sinais WebRTC agora so avançam depois de processados para evitar chamada presa em conectando.',
    'Layout mobile de videochamada ajustado para evitar avatar grande e video remoto cortado.',
    'Encerramento de chamada agora desliga midia local/remota e corta audio residual da aba.',
    'Video remoto em celular e tablet agora mantem proporcao para nao ficar cortado.',
    'Envio de anexos agora aceita mais tipos de arquivo e bloqueia formatos perigosos ao app.',
    'Figurinhas personalizadas agora podem ser removidas ao pressionar e segurar.',
    'Upload de arquivos agora mostra porcentagem diretamente na bolha da mensagem.',
    'Arquivos APK agora podem ser enviados mesmo quando detectados como pacote Java.',
    'Mensagens apagadas em conversas e grupos agora somem automaticamente para os demais usuários.',
    'Bolha de upload agora mostra aguardando apenas no rodape da mensagem.',
    'Segurar uma mensagem com figurinha ou imagem agora permite salvar na sua lista.',
];

const AUDIO_PLAYBACK_RATES = [1, 1.5, 2];
const BLOCKED_UPLOAD_EXTENSIONS = new Set([
    'php', 'phtml', 'phar', 'php3', 'php4', 'php5', 'php7', 'php8',
    'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx',
    'html', 'htm', 'xhtml', 'shtml', 'svg',
    'css', 'xml', 'xsl', 'xslt',
    'asp', 'aspx', 'ashx', 'asmx', 'jsp', 'jspx', 'cfm', 'cgi', 'pl', 'py', 'rb', 'lua',
    'sh', 'bash', 'zsh', 'fish', 'bat', 'cmd', 'ps1', 'psm1', 'vbs', 'vbe', 'wsf', 'wsh',
    'exe', 'msi', 'dll', 'com', 'scr', 'pif', 'hta', 'jar',
    'reg', 'lnk', 'desktop',
]);

const RTC_CONFIGURATION = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ],
    iceTransportPolicy: 'all',
    iceCandidatePoolSize: 10,
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
};

const QUICK_EMOJIS = [
    '\u{1F600}', '\u{1F603}', '\u{1F604}', '\u{1F601}', '\u{1F606}', '\u{1F602}', '\u{1F923}', '\u{1F60A}',
    '\u{1F60D}', '\u{1F618}', '\u{1F60E}', '\u{1F973}', '\u{1F622}', '\u{1F62D}', '\u{1F621}', '\u{1F631}',
    '\u{1F44D}', '\u{1F44E}', '\u{1F44F}', '\u{1F64F}', '\u{1F4AA}', '\u{1F525}', '\u{2764}\u{FE0F}', '\u{1F49C}',
    '\u{2B50}', '\u{2728}', '\u{1F389}', '\u{1F381}', '\u{2705}', '\u{274C}', '\u{26A1}', '\u{1F680}',
];

const SERVICE_EMOJIS = [
    { char: '\u{1F600}', code: '1f600' },
    { char: '\u{1F603}', code: '1f603' },
    { char: '\u{1F604}', code: '1f604' },
    { char: '\u{1F601}', code: '1f601' },
    { char: '\u{1F606}', code: '1f606' },
    { char: '\u{1F602}', code: '1f602' },
    { char: '\u{1F923}', code: '1f923' },
    { char: '\u{1F60A}', code: '1f60a' },
    { char: '\u{1F60D}', code: '1f60d' },
    { char: '\u{1F618}', code: '1f618' },
    { char: '\u{1F60E}', code: '1f60e' },
    { char: '\u{1F973}', code: '1f973' },
    { char: '\u{1F622}', code: '1f622' },
    { char: '\u{1F62D}', code: '1f62d' },
    { char: '\u{1F621}', code: '1f621' },
    { char: '\u{1F631}', code: '1f631' },
    { char: '\u{1F44D}', code: '1f44d' },
    { char: '\u{1F44E}', code: '1f44e' },
    { char: '\u{1F44F}', code: '1f44f' },
    { char: '\u{1F64F}', code: '1f64f' },
    { char: '\u{1F4AA}', code: '1f4aa' },
    { char: '\u{1F525}', code: '1f525' },
    { char: '\u2764\uFE0F', code: '2764-fe0f' },
    { char: '\u{1F49C}', code: '1f49c' },
    { char: '\u2B50', code: '2b50' },
    { char: '\u2728', code: '2728' },
    { char: '\u{1F389}', code: '1f389' },
    { char: '\u{1F381}', code: '1f381' },
    { char: '\u2705', code: '2705' },
    { char: '\u274C', code: '274c' },
    { char: '\u26A1', code: '26a1' },
    { char: '\u{1F680}', code: '1f680' },
];

const UNICODE_EMOJI_CHART_URL = 'api.php?action=unicode_emoji_chart';

const SERVICE_QUICK_MEDIA = {
    gifs: [
        { id: 'giphy-risada', label: 'Risada', src: 'https://media.giphy.com/media/3oEjHI8WJv4x6UPDB6/giphy.gif' },
        { id: 'giphy-aplausos', label: 'Aplausos', src: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif' },
        { id: 'giphy-surpresa', label: 'Surpresa', src: 'https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif' },
    ],
};

document.addEventListener('DOMContentLoaded', () => {
    preventPinchZoom();
    bindViewportHeight();
    bindAuth();
    bindApp();
    bindSoundUnlock();
    loadPendingOutbox();
    checkAppVersion();
    registerPwa();
    bindInstallPrompt();
    checkStartupUpdate();
    boot();
    handlePasswordResetLink();
});

function preventPinchZoom() {
    document.addEventListener('gesturestart', (event) => {
        event.preventDefault();
    }, { passive: false });

    document.addEventListener('gesturechange', (event) => {
        event.preventDefault();
    }, { passive: false });

    document.addEventListener('gestureend', (event) => {
        event.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (event) => {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });
}

function bindViewportHeight() {
    const update = () => {
        const height = window.visualViewport?.height || window.innerHeight;
        document.documentElement.style.setProperty('--app-height', `${Math.round(height)}px`);
        document.body.classList.toggle('is-mobile', isMobileViewport());
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('resize', updateCurrentHeaderStatus);
    window.addEventListener('orientationchange', () => setTimeout(() => {
        update();
        updateCurrentHeaderStatus();
    }, 250));
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
}

function isMobileViewport() {
    return window.matchMedia('(max-width: 1024px)').matches
        || window.matchMedia('(pointer: coarse)').matches
        || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function registerPwa() {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    window.addEventListener('load', () => {
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data?.type === 'APP_UPDATE_READY' && event.data.version !== APP_VERSION) {
                showUpdateModal(
                    'Uma nova versao ficou pronta para instalar.',
                    event.data.version,
                    event.data.changelog
                );
            }
            if (event.data?.type === 'OPEN_CHAT_FROM_NOTIFICATION') {
                openChatFromNotification(event.data.chatId);
            }
        });

        const serviceWorkerUrl = new URL('service-worker.js', window.location.href);
        const serviceWorkerScope = new URL('./', serviceWorkerUrl).pathname;
        navigator.serviceWorker.register(serviceWorkerUrl.href, { scope: serviceWorkerScope }).then((registration) => {
            registration.update().catch(() => {});
            registration.addEventListener('updatefound', () => {
                const worker = registration.installing;
                worker?.addEventListener('statechange', () => {
                    if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                        checkStartupUpdate();
                    }
                });
            });
        }).catch(() => {});
    });
}

function bindInstallPrompt() {
    const prompt = $('#installPrompt');
    const action = $('#installPromptAction');
    const later = $('#installPromptLater');
    const message = $('#installPromptMessage');
    if (!prompt || !action || !later || !message) {
        return;
    }

    const isChromeDesktop = /Chrome\//.test(navigator.userAgent)
        && !/Edg\//.test(navigator.userAgent)
        && !isMobileViewport();
    const isOpera = /OPR\//.test(navigator.userAgent);
    const isInstalled = window.matchMedia?.('(display-mode: standalone)').matches
        || window.navigator.standalone === true;
    if (!isChromeDesktop || isInstalled || localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY) === 'yes') {
        return;
    }

    const showPrompt = () => prompt.classList.remove('hidden');
    const hidePrompt = () => prompt.classList.add('hidden');

    window.addEventListener('beforeinstallprompt', (event) => {
        // No Opera, deixamos o navegador exibir o comando nativo de instalação
        // na barra de endereço. Nos demais Chromium, usamos o botão do site.
        if (!isOpera) {
            event.preventDefault();
        }
        deferredInstallPrompt = event;
        action.textContent = 'Instalar agora';
        message.textContent = 'Adicione o NexoMessage ao Windows como um aplicativo do Chrome.';
        showPrompt();
    });

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        hidePrompt();
        toast('NexoMessage instalado no Chrome.');
    });

    action.addEventListener('click', async () => {
        if (!deferredInstallPrompt) {
            message.textContent = 'No Chrome, abra o menu ⋮ e escolha “Instalar NexoMessage”.';
            action.textContent = 'Entendi';
            action.onclick = () => hidePrompt();
            return;
        }

        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        hidePrompt();
    });

    later.addEventListener('click', () => {
        localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, 'yes');
        hidePrompt();
    });

    setTimeout(showPrompt, 1800);
}

async function boot() {
    if (!navigator.onLine) {
        showConnectionError();
        return;
    }

    try {
        const response = await withLoading(
            () => api('me'),
            'Abrindo app...',
            'Verificando sua sessão.',
            400
        );
        state.user = response.user;
        applyPreferences();
        showApp();
        updateCurrentDeviceSession().catch(() => {});
        await withLoading(
            () => loadChats(),
            'Carregando conversas...',
            'Preparando sua lista de chats.',
            300
        );
        setupWebPush().catch(() => {});
        await handleIncomingQrLoginLink();
        await handleIncomingContactLink();
        handleIncomingShare();
        openInitialChatFromUrl();
        resetPolling();
        flushPendingOutbox().catch(() => {});
    } catch (error) {
        if (isNetworkError(error)) {
            showConnectionError();
            return;
        }

        showAuth();
    }
}

function openInitialChatFromUrl() {
    const chatId = Number(new URLSearchParams(window.location.search).get('chat'));
    if (!chatId) {
        return;
    }

    const chat = state.chats.find((item) => item.id === chatId);
    if (chat) {
        openChat(chat);
    }
}

function handleIncomingShare() {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title')?.trim() || '';
    const text = params.get('text')?.trim() || '';
    const url = params.get('url')?.trim() || '';
    const parts = [text, url].filter(Boolean);
    if (url && text.includes(url)) {
        parts.splice(parts.lastIndexOf(url), 1);
    }

    const sharedContent = [title, ...parts].filter(Boolean).join('\n');
    if (!sharedContent) {
        return;
    }

    localStorage.setItem(PENDING_SHARE_KEY, sharedContent);
    ['title', 'text', 'url'].forEach((key) => params.delete(key));
    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', nextUrl);
    toast('Conteúdo compartilhado recebido. Abra uma conversa para enviar.');
}

async function handleIncomingQrLoginLink() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('login_qr');
    if (!token || !state.user) {
        return;
    }

    const confirmed = await confirmAction({
        title: 'Entrar em outro dispositivo?',
        message: 'Autorizar este QR Code vai conectar sua conta no dispositivo que exibiu o codigo.',
        confirmText: 'Autorizar',
    });
    if (confirmed) {
        const form = new FormData();
        form.append('token', token);
        await api('approve_qr_login', { method: 'POST', body: form });
        toast('Login por QR Code autorizado.');
    }

    params.delete('login_qr');
    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', nextUrl);
}

async function handleIncomingContactLink() {
    const params = new URLSearchParams(window.location.search);
    const identifier = params.get('add');
    if (!identifier) {
        return;
    }

    try {
        const response = await withLoading(
            () => addContactByIdentifier(identifier),
            'Adicionando contato...',
            'Lendo o QR Code.'
        );
        params.delete('add');
        const nextUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
        window.history.replaceState({}, '', nextUrl);
        const chat = state.chats.find((item) => item.id === Number(response.conversation_id));
        if (chat) {
            openChat(chat);
        }
        toast('Usuário adicionado pelo QR Code.');
    } catch (error) {
        toast(error.message);
    }
}

async function addContactByIdentifier(identifier) {
    const form = new FormData();
    form.append('identifier', identifier);
    const response = await api('add_contact', { method: 'POST', body: form });
    await loadChats();
    return response;
}

function groupCandidatesFromActiveChats() {
    const seen = new Set();
    return state.chats
        .filter((chat) => chat.type === 'direct' && !chat.archived && !chat.blocked && chat.other_id)
        .filter((chat) => {
            if (seen.has(chat.other_id)) {
                return false;
            }
            seen.add(chat.other_id);
            return true;
        })
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR'));
}

function openCreateGroupModal() {
    const candidates = groupCandidatesFromActiveChats();
    const list = $('#groupMemberList');
    $('#createGroupForm').reset();
    $('#groupMemberCounter').textContent = '0 selecionado(s)';

    list.innerHTML = candidates.length
        ? candidates.map((chat) => `
            <label class="group-member-row">
                <input type="checkbox" name="member_ids[]" value="${chat.other_id}">
                ${avatarMarkup(chat)}
                <span>
                    <strong>${escapeHtml(chat.name)}</strong>
                    <small>${chat.nick ? '@' + escapeHtml(chat.nick) : escapeHtml(chat.phone || 'Conversa ativa')}</small>
                </span>
            </label>
        `).join('')
        : '<div class="group-empty">Você ainda não tem conversas ativas para adicionar ao grupo.</div>';

    openModal('#createGroupModal');
}

function updateGroupMemberCounter() {
    const total = $$('#groupMemberList input[type="checkbox"]:checked').length;
    $('#groupMemberCounter').textContent = `${total} selecionado(s)`;
}

async function createGroup(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selected = form.getAll('member_ids[]').filter(Boolean);

    if (!selected.length) {
        toast('Selecione pelo menos um usuário com conversa ativa.');
        return;
    }

    try {
        const response = await withLoading(
            () => api('create_group', { method: 'POST', body: form }),
            'Criando grupo...',
            'Adicionando participantes.'
        );
        closeModal($('#createGroupModal'));
        await loadChats();
        const chat = state.chats.find((item) => item.id === Number(response.conversation_id));
        if (chat) {
            openChat(chat);
        }
        toast('Grupo criado.');
    } catch (error) {
        toast(error.message);
    }
}

async function startQrScanner() {
    const scanner = $('#qrScanner');
    const video = $('#qrScannerVideo');
    const status = $('#qrScannerStatus');

    if (state.qrScanning) {
        return;
    }

    stopQrScanner();
    scanner.classList.remove('hidden');
    status.textContent = 'Aponte a câmera para o QR Code.';

    if (!navigator.mediaDevices?.getUserMedia || !('BarcodeDetector' in window)) {
        status.textContent = 'Seu navegador não suporta leitura de QR Code pela câmera.';
        toast('Leitura de QR Code indisponível neste navegador.');
        return;
    }

    try {
        state.qrDetector = state.qrDetector || new BarcodeDetector({ formats: ['qr_code'] });
        state.qrScanStream = await requestUserMedia({
            video: { facingMode: { ideal: 'environment' } },
            audio: false,
        });
        video.srcObject = state.qrScanStream;
        await video.play();
        state.qrScanning = true;
        scanQrFrame();
    } catch (error) {
        status.textContent = 'Não foi possivel acessar a câmera.';
        toast('Não foi possivel acessar a câmera.');
    }
}

function stopQrScanner() {
    state.qrScanning = false;
    if (state.qrScanFrame) {
        cancelAnimationFrame(state.qrScanFrame);
        state.qrScanFrame = 0;
    }
    if (state.qrScanStream) {
        state.qrScanStream.getTracks().forEach((track) => track.stop());
        state.qrScanStream = null;
    }
    const video = $('#qrScannerVideo');
    if (video) {
        video.pause();
        video.srcObject = null;
    }
    $('#qrScanner')?.classList.add('hidden');
}

async function scanQrFrame() {
    if (!state.qrScanning) {
        return;
    }

    const video = $('#qrScannerVideo');
    if (video?.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        try {
            const codes = await state.qrDetector.detect(video);
            const rawValue = codes[0]?.rawValue || '';
            if (rawValue) {
                const handled = await handleScannedQr(rawValue);
                if (handled) {
                    return;
                }
            }
        } catch {
            $('#qrScannerStatus').textContent = 'Continue apontando para o QR Code.';
        }
    }

    state.qrScanFrame = requestAnimationFrame(scanQrFrame);
}

async function handleScannedQr(value) {
    const loginToken = qrLoginTokenFromValue(value);
    if (loginToken && state.user) {
        stopQrScanner();
        await approveQrLoginToken(loginToken);
        return true;
    }

    const identifier = contactIdentifierFromQr(value);
    if (!identifier) {
        $('#qrScannerStatus').textContent = 'QR Code não reconhecido.';
        toast('QR Code não reconhecido.');
        return false;
    }

    $('#addContactForm [name="identifier"]').value = identifier;
    stopQrScanner();

    try {
        const response = await withLoading(
            () => addContactByIdentifier(identifier),
            'Adicionando contato...',
            'Lendo o QR Code.'
        );
        closeModal($('#addContactModal'));
        $('#addContactForm').reset();
        $('#chatSearch').value = '';
        const chat = state.chats.find((item) => item.id === Number(response.conversation_id));
        if (chat) {
            openChat(chat);
        } else {
            renderChats();
        }
        toast('Usuário adicionado pelo QR Code.');
        return true;
    } catch (error) {
        toast(error.message);
        return true;
    }
}

function qrLoginTokenFromValue(value) {
    const text = String(value || '').trim();
    if (!text) {
        return '';
    }

    try {
        const url = new URL(text);
        return url.searchParams.get('login_qr') || '';
    } catch {
    }

    const match = text.match(/[?&]login_qr=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

async function approveQrLoginToken(token) {
    const confirmed = await confirmAction({
        title: 'Entrar em outro dispositivo?',
        message: 'Autorizar este QR Code vai conectar sua conta no dispositivo que exibiu o codigo.',
        confirmText: 'Autorizar',
    });
    if (!confirmed) {
        return;
    }

    const form = new FormData();
    form.append('token', token);
    await api('approve_qr_login', { method: 'POST', body: form });
    toast('Login por QR Code autorizado.');
}

function contactIdentifierFromQr(value) {
    const text = String(value || '').trim();
    if (!text) {
        return '';
    }

    try {
        const url = new URL(text);
        const add = url.searchParams.get('add');
        if (add) {
            return add.trim();
        }
    } catch {
    }

    const addMatch = text.match(/[?&]add=([^&]+)/);
    if (addMatch) {
        return decodeURIComponent(addMatch[1]).trim();
    }

    return text;
}

function bindAuth() {
    $$('[data-auth-tab]').forEach((button) => {
        button.addEventListener('click', () => {
            $$('[data-auth-tab]').forEach((item) => item.classList.toggle('active', item === button));
            $('#loginForm').classList.toggle('hidden', button.dataset.authTab !== 'login');
            $('#registerForm').classList.toggle('hidden', button.dataset.authTab !== 'register');
        });
    });

    $('#loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        await submitAuth('login', new FormData(event.currentTarget));
    });
    $('#forgotPasswordButton')?.addEventListener('click', () => openPasswordResetModal());
    $('#passwordResetRequestForm')?.addEventListener('submit', submitPasswordResetModal);
    $('#verifyTwoFactorButton')?.addEventListener('click', verifyPendingTwoFactor);
    $('#showQrLoginButton').addEventListener('click', startQrLogin);

    $('#registerForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        await submitAuth('register', new FormData(event.currentTarget));
    });

    document.addEventListener('click', (event) => {
        const toggle = event.target.closest('[data-toggle-password]');
        if (toggle) {
            togglePasswordVisibility(toggle);
        }
    });
}

function openPasswordResetModal(token = '') {
    const modal = $('#passwordResetModal');
    const form = $('#passwordResetRequestForm');
    if (!modal || !form) return;
    const isReset = Boolean(token);
    form.dataset.token = token;
    $('#passwordResetTitle').textContent = isReset ? 'Definir nova senha' : 'Recuperar senha';
    $('#passwordResetDescription').textContent = isReset
        ? 'Escolha uma nova senha para voltar a acessar sua conta.'
        : 'Informe o e-mail da sua conta para receber um link de recuperacao.';
    $('#passwordResetNotice')?.classList.toggle('hidden', isReset);
    $('#passwordResetEmailField').classList.toggle('hidden', isReset);
    $('#passwordResetEmail').required = !isReset;
    $('#passwordResetPasswordFields').classList.toggle('hidden', !isReset);
    $('#passwordResetPassword').required = isReset;
    $('#passwordResetConfirmation').required = isReset;
    $('#passwordResetSubmit').textContent = isReset ? 'Salvar nova senha' : 'Enviar link';
    $('#passwordResetError').classList.add('hidden');
    $('#passwordResetError').textContent = '';
    modal.classList.remove('hidden');
    paintIcons();
    (isReset ? $('#passwordResetPassword') : $('#passwordResetEmail'))?.focus();
}

async function submitPasswordResetModal(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const token = formElement.dataset.token || '';
    const form = new FormData();
    if (!token) {
        const email = $('#passwordResetEmail').value.trim();
        if (!email) return;
        form.append('email', email);
    } else {
        const password = $('#passwordResetPassword').value;
        const confirmation = $('#passwordResetConfirmation').value;
        if (password.length < 8) {
            showPasswordResetError('A senha deve ter pelo menos 8 caracteres.');
            return;
        }
        if (password !== confirmation) {
            showPasswordResetError('As senhas nao conferem.');
            return;
        }
        form.append('token', token);
        form.append('password', password);
        form.append('password_confirmation', confirmation);
    }
    try {
        const response = await api(token ? 'reset_password' : 'request_password_reset', { method: 'POST', body: form });
        toast(response.message);
        closeModal($('#passwordResetModal'));
        if (token) history.replaceState({}, '', window.location.pathname);
    } catch (error) {
        showPasswordResetError(error.message);
    }
}

function showPasswordResetError(message) {
    const element = $('#passwordResetError');
    if (!element) return;
    element.textContent = message;
    element.classList.remove('hidden');
}

async function verifyPendingTwoFactor() {
    const code = $('#twoFactorLoginCode')?.value.trim();
    if (!code) return;
    const form = new FormData();
    form.append('code', code);
    try {
        const response = await api('verify_2fa', { method: 'POST', body: form });
        $('#twoFactorLoginBox')?.classList.add('hidden');
        state.user = response.user;
        applyPreferences();
        showApp();
        await loadChats();
        resetPolling();
    } catch (error) {
        toast(error.message);
    }
}

async function handlePasswordResetLink() {
    const token = new URLSearchParams(window.location.search).get('reset_token');
    if (!token) return;
    openPasswordResetModal(token);
    return;
    const password = '';
    const confirmation = '';
    if (!password || password !== confirmation) {
        toast('As senhas não conferem.');
        return;
    }
    const form = new FormData();
    form.append('token', token);
    form.append('password', password);
    form.append('password_confirmation', confirmation);
    try {
        const response = await api('reset_password', { method: 'POST', body: form });
        toast(response.message);
        history.replaceState({}, '', window.location.pathname);
    } catch (error) {
        toast(error.message);
    }
}

function togglePasswordVisibility(toggle) {
    const field = toggle.closest('.password-field');
    const input = field?.querySelector('input');
    if (!input) {
        return;
    }

    const isVisible = input.type === 'text';
    input.type = isVisible ? 'password' : 'text';
    const label = isVisible ? 'Mostrar senha' : 'Ocultar senha';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    toggle.innerHTML = `<i data-lucide="${isVisible ? 'eye' : 'eye-off'}"></i>`;
    input.focus();
    paintIcons();
}

async function startQrLogin() {
    const box = $('#authQrLogin');
    const status = $('#loginQrStatus');
    box.classList.remove('hidden');
    status.textContent = 'Gerando QR Code...';
    $('#loginQrCodeBox').innerHTML = '<span class="qr-loading">Gerando...</span>';
    clearQrLoginTimers();

    try {
        const response = await api('create_qr_login');
        state.qrLoginToken = response.token;
        renderQrCodeInto($('#loginQrCodeBox'), response.url, 'QR Code de login');
        status.textContent = 'Aguardando leitura pelo celular...';
        const expiresAt = Date.now() + Number(response.expires_in || 120) * 1000;
        state.qrLoginTimer = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
            status.textContent = remaining > 0
                ? `Aguardando leitura pelo celular... ${remaining}s`
                : 'QR Code expirado. Gere outro codigo.';
            if (remaining <= 0) {
                clearQrLoginTimers();
            }
        }, 1000);
        state.qrLoginPollTimer = setInterval(checkQrLoginStatus, 1500);
    } catch (error) {
        status.textContent = error.message;
        renderQrFallback($('#loginQrCodeBox'), 'Não foi possivel gerar o QR Code agora.');
    }
}

function clearQrLoginTimers() {
    clearInterval(state.qrLoginTimer);
    clearInterval(state.qrLoginPollTimer);
    state.qrLoginTimer = null;
    state.qrLoginPollTimer = null;
}

async function checkQrLoginStatus() {
    if (!state.qrLoginToken) {
        return;
    }

    try {
        const response = await api(`qr_login_status&token=${encodeURIComponent(state.qrLoginToken)}`);
        if (response.status === 'approved' && response.user) {
            clearQrLoginTimers();
            state.qrLoginToken = '';
            state.user = response.user;
            applyPreferences();
            showApp();
            updateCurrentDeviceSession().catch(() => {});
            await loadChats();
            resetPolling();
            toast('Login por QR Code confirmado.');
        } else if (response.status === 'expired' || response.status === 'consumed' || response.status === 'rejected') {
            clearQrLoginTimers();
            $('#loginQrStatus').textContent = 'QR Code expirado. Gere outro codigo.';
        }
    } catch {
    }
}

function bindApp() {
    renderQuickPanel();
    bindAppBackNavigation();
    $('#retryConnectionButton').addEventListener('click', retryConnection);
    $('#menuButton').addEventListener('click', () => $('#mainMenu').classList.toggle('hidden'));
    bindStatusMenu();
    $('#openAddContact').addEventListener('click', (event) => {
        event.stopPropagation();
        $('#composeMenu').classList.toggle('hidden');
        paintIcons();
    });
    $('#scanQrButton').addEventListener('click', startQrScanner);
    $('#stopQrScanButton').addEventListener('click', stopQrScanner);
    $('#backToChats').addEventListener('click', returnToChatList);
    $('#openProfilePanel').addEventListener('click', () => renderProfilePanel(state.currentChat));
    $('#conversationSearchButton').addEventListener('click', openConversationSearch);
    $('#conversationSearchClose').addEventListener('click', closeConversationSearch);
    $('#conversationSearchInput').addEventListener('input', filterConversationMessages);
    $('#conversationMoreButton').addEventListener('click', (event) => {
        event.stopPropagation();
        $('#chatOptionsMenu').classList.toggle('hidden');
    });
    $('#callButton').addEventListener('click', () => startOutgoingCall('audio'));
    $('#videoCallButton').addEventListener('click', startVideoCall);

    document.addEventListener('click', (event) => {
        if (!event.target.closest('#mainMenu') && !event.target.closest('#menuButton')) {
            $('#mainMenu').classList.add('hidden');
        }
        if (!event.target.closest('#composeMenu') && !event.target.closest('#openAddContact')) {
            $('#composeMenu').classList.add('hidden');
        }
        if (!event.target.closest('#chatOptionsMenu') && !event.target.closest('#conversationMoreButton')) {
            $('#chatOptionsMenu').classList.add('hidden');
        }
        if (!event.target.closest('#chatContextMenu')) {
            closeChatContextMenu();
        }
        if (!event.target.closest('#quickPanel') && !event.target.closest('#quickToggle')) {
            closeQuickPanel();
        }
        if (!event.target.closest('#messageContextMenu')) {
            closeMessageContextMenu();
        }
    });

    $$('[data-close-modal]').forEach((button) => {
        button.addEventListener('click', () => closeModal(button.closest('.modal')));
    });
    $('#updateLaterButton').addEventListener('click', () => $('#updateModal').classList.add('hidden'));
    $('#updateNowButton').addEventListener('click', updateAppContentAndReload);

    $('#addContactForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const form = new FormData(event.currentTarget);
            const response = await withLoading(
                () => addContactByIdentifier(form.get('identifier')),
                'Adicionando contato...',
                'Atualizando sua lista de conversas.'
            );
            closeModal($('#addContactModal'));
            event.currentTarget.reset();
            $('#chatSearch').value = '';
            const chat = state.chats.find((item) => item.id === Number(response.conversation_id));
            if (chat) {
                openChat(chat);
            } else {
                renderChats();
            }
            toast('Usuário adicionado.');
        } catch (error) {
            toast(error.message);
        }
    });
    $('#createGroupForm').addEventListener('submit', createGroup);
    $('#composeMenu').addEventListener('click', (event) => {
        const button = event.target.closest('[data-compose-action]');
        if (!button) {
            return;
        }

        $('#composeMenu').classList.add('hidden');
        const action = button.dataset.composeAction;
        if (action === 'group') {
            openCreateGroupModal();
            return;
        }
        if (action === 'private') {
            openModal('#addContactModal');
            $('#addContactForm header strong').textContent = 'Novo chat privado';
            return;
        }
        toast('A criação de canais ainda não está disponível.');
    });
    $('#groupMemberList').addEventListener('change', updateGroupMemberCounter);

    $('#chatSearch').addEventListener('input', renderChats);
    $$('.folder-tabs [data-chat-filter]').forEach((button) => {
        button.addEventListener('click', () => {
            state.chatFilter = button.dataset.chatFilter;
            renderChats();
        });
    });
    $('#chatList').addEventListener('contextmenu', (event) => {
        const item = event.target.closest('.chat-item');
        if (!item) {
            return;
        }
        const chat = state.chats.find((entry) => entry.id === Number(item.dataset.chatId));
        if (!chat) {
            return;
        }
        event.preventDefault();
        openChatContextMenu(event.clientX, event.clientY, chat);
    });
    $('#chatContextMenu').addEventListener('click', handleChatContextAction);
    $('#attachButton').addEventListener('click', () => $('#mediaInput').click());
    $('#audioShortcut').addEventListener('click', toggleVoiceRecording);
    $('#cancelRecordingButton').addEventListener('click', cancelVoiceRecording);
    $('#quickToggle').addEventListener('click', (event) => {
        event.stopPropagation();
        toggleQuickPanel();
    });
    $('#quickPanel').addEventListener('click', handleQuickPanelClick);
    $('#quickPanel').addEventListener('change', handleQuickPanelChange);
    $('#quickPanel').addEventListener('input', handleQuickPanelInput);
    $('#quickPanel').addEventListener('pointerdown', startStickerHold);
    $('#quickPanel').addEventListener('pointerup', cancelStickerHold);
    $('#quickPanel').addEventListener('pointercancel', cancelStickerHold);
    $('#quickPanel').addEventListener('pointerleave', cancelStickerHold);
    $('#quickPanel').addEventListener('contextmenu', preventStickerContextMenu);

    $('#mediaInput').addEventListener('click', () => {
        if ($('#mediaInput').getAttribute('accept') === 'audio/*') {
            setTimeout(() => $('#mediaInput').removeAttribute('accept'), 500);
        }
    });

    $('#mediaInput').addEventListener('change', (event) => {
        state.selectedFiles = Array.from(event.target.files || []);
        state.selectedFile = state.selectedFiles[0] || null;
        state.imageQuality = 'reduced';
        const blockedReason = state.selectedFiles.map(blockedUploadReason).find(Boolean);
        if (blockedReason) {
            toast(blockedReason);
            clearAttachment();
            return;
        }
        renderAttachmentPreview();
        toggleSendButton();
    });

    $('#messageInput').addEventListener('input', handleMessageInput);
    $('#messageInput').addEventListener('paste', handleMessagePaste);
    $('#messageInput').addEventListener('keydown', (event) => {
        if (shouldSubmitMessage(event)) {
            event.preventDefault();
            $('#composer').requestSubmit();
        }
    });
    window.addEventListener('online', handleNetworkOnline);
    window.addEventListener('offline', updateCurrentHeaderStatus);

    $('#composer').addEventListener('submit', async (event) => {
        event.preventDefault();
        await sendMessage();
    });

    $('#mainMenu').addEventListener('click', async (event) => {
        const button = event.target.closest('button[data-menu-action]');
        if (!button) {
            return;
        }

        $('#mainMenu').classList.add('hidden');
        const action = button.dataset.menuAction;

        if (action === 'logout') {
            await handleExitChoice();
            return;
        }

        if (action === 'contacts') {
            openModal('#addContactModal');
            $('#addContactForm header strong').textContent = 'Adicionar usuário';
            return;
        }

        if (action === 'group') {
            openCreateGroupModal();
            return;
        }

        if (action === 'qr') {
            openQrModal();
            return;
        }

        if (action === 'settings') {
            renderSettingsMenuPanel();
            return;
        }

        if (action === 'admin') {
            renderAdminPanel();
            return;
        }

        if (action === 'profile') {
            renderOwnProfilePanel();
            return;
        }

        if (action === 'saved') {
            const saved = state.chats.find((chat) => chat.type === 'saved');
            if (saved) {
                openChat(saved);
            }
        }
    });

    $('#chatOptionsMenu').addEventListener('click', async (event) => {
        const button = event.target.closest('button[data-chat-option]');
        if (!button) {
            return;
        }

        $('#chatOptionsMenu').classList.add('hidden');
        await handleChatOption(button.dataset.chatOption);
    });

    $('#editChatForm').addEventListener('submit', saveChatAlias);
    $('#closeCall').addEventListener('click', endVideoCall);
    $('#hangupCall').addEventListener('click', endVideoCall);
    $('#acceptCall').addEventListener('click', acceptIncomingCall);
    $('#rejectCall').addEventListener('click', rejectIncomingCall);
    $('#toggleMic').addEventListener('click', toggleCallMic);
    $('#toggleSpeaker').addEventListener('click', toggleCallSpeaker);
    $('#switchCamera').addEventListener('click', switchCallCameraFacing);
    $('#toggleCamera').addEventListener('click', toggleCallCamera);
    $('#moreCallActions').addEventListener('click', () => toast('Mais opcoes de chamada em breve.'));
    $('#shareCall').addEventListener('click', shareCallInvite);
    $('#callModal').addEventListener('click', toggleVideoCallChrome);
    $('#localVideoTile').addEventListener('pointerdown', startCallPipPointer);
    $('.remote-video-tile').addEventListener('pointerdown', startCallPipPointer);
    document.addEventListener('pointermove', moveCallPipPointer);
    document.addEventListener('pointerup', endCallPipPointer);
    document.addEventListener('pointercancel', endCallPipPointer);

    $('#messages').addEventListener('contextmenu', (event) => {
        if (event.target.closest('[data-open-media]')) {
            const messageId = Number(event.target.closest('[data-open-media]')?.dataset.openMedia || 0);
            const message = state.messageById.get(messageId);
            if (canSaveMessageAsSticker(message)) {
                event.preventDefault();
                return;
            }
        }

        const row = event.target.closest('.message-row');
        if (!row) {
            return;
        }

        const message = state.messageById.get(Number(row.dataset.messageId));
        if (!message) {
            return;
        }

        event.preventDefault();
        openMessageContextMenu(event.clientX, event.clientY, message);
    });

    $('#messages').addEventListener('scroll', closeMessageContextMenu);
    $('#messages').addEventListener('click', handleAudioPlayerClick);
    $('#messages').addEventListener('pointerdown', startMessageStickerHold);
    $('#messages').addEventListener('pointerup', cancelMessageStickerHold);
    $('#messages').addEventListener('pointercancel', cancelMessageStickerHold);
    $('#messages').addEventListener('pointerleave', cancelMessageStickerHold);
    $('#pinnedShortcut').addEventListener('click', jumpToPinnedMessage);
    $('#messageContextMenu').addEventListener('click', handleMessageContextAction);
    $('#cancelSelection').addEventListener('click', exitSelectionMode);
    $('#deleteSelected').addEventListener('click', deleteSelectedMessages);
    $('#confirmAccept').addEventListener('click', () => resolveConfirm(true));
    $$('#confirmModal [data-confirm-cancel]').forEach((button) => {
        button.addEventListener('click', () => resolveConfirm(false));
    });
    $$('[data-close-qr]').forEach((button) => {
        button.addEventListener('click', closeQrModal);
    });
    $('#qrModal').addEventListener('click', (event) => {
        if (event.target.id === 'qrModal') {
            closeQrModal();
        }
    });
    $('#copyQrButton').addEventListener('click', copyQrLink);
    $('#confirmModal').addEventListener('click', (event) => {
        if (event.target.id === 'confirmModal') {
            resolveConfirm(false);
        }
    });
    $('#replyPreview').addEventListener('click', (event) => {
        if (event.target.closest('[data-cancel-reply]')) {
            clearReply();
        }
    });
    $('#forwardList').addEventListener('click', forwardToSelectedChat);
    $('#messages').addEventListener('click', (event) => {
        const reactionButton = event.target.closest('[data-toggle-reaction]');
        if (reactionButton && !state.selectionMode) {
            event.preventDefault();
            event.stopPropagation();
            toggleMessageReaction(Number(reactionButton.dataset.toggleReaction));
            return;
        }

        const jumpButton = event.target.closest('[data-jump-message]');
        if (jumpButton && !state.selectionMode) {
            jumpToMessage(Number(jumpButton.dataset.jumpMessage));
            return;
        }

        const mediaButton = event.target.closest('[data-open-media]');
        if (mediaButton && !state.selectionMode) {
            if (Date.now() < state.messageStickerSuppressClickUntil) {
                return;
            }
            const message = state.messageById.get(Number(mediaButton.dataset.openMedia));
            if (message) {
                openMediaViewer(message, galleryForMessage(message));
            }
            return;
        }

        if (!state.selectionMode) {
            return;
        }

        const row = event.target.closest('.message-row');
        if (row) {
            toggleSelectedMessage(Number(row.dataset.messageId));
        }
    });
    $('#mediaViewer').addEventListener('click', (event) => {
        const editorButton = event.target.closest('[data-editor-action]');
        if (editorButton) {
            handleImageEditorAction(editorButton.dataset.editorAction);
            return;
        }

        const actionButton = event.target.closest('[data-viewer-action]');
        if (actionButton) {
            if (actionButton.dataset.viewerAction === 'edit' && state.viewerMessage) {
                startImageEditor(state.viewerMessage);
                return;
            }
            handleViewerAction(actionButton.dataset.viewerAction);
            return;
        }

        if (!state.viewerDragging && event.target.id === 'mediaViewer') {
            closeMediaViewer();
        }
    });
    $('#viewerImage').addEventListener('pointerdown', startViewerPan);
    $('#viewerImage').addEventListener('pointermove', moveViewerPan);
    $('#viewerImage').addEventListener('pointerup', endViewerPan);
    $('#viewerImage').addEventListener('pointercancel', endViewerPan);
    $('#viewerImage').addEventListener('dragstart', (event) => event.preventDefault());
    $('#viewerImage').addEventListener('dblclick', handleViewerDoubleClick);
    $('#viewerEditorCanvas').addEventListener('pointerdown', startImageEditorDraw);
    $('#viewerEditorCanvas').addEventListener('pointermove', moveImageEditorDraw);
    $('#viewerEditorCanvas').addEventListener('pointerup', endImageEditorDraw);
    $('#viewerEditorCanvas').addEventListener('pointercancel', endImageEditorDraw);
    $('#viewerFooter').addEventListener('input', handleImageEditorInput);
    document.addEventListener('keydown', (event) => {
        if (state.confirmResolver && event.key === 'Escape') {
            resolveConfirm(false);
            return;
        }

        if (!state.viewerMessage) {
            return;
        }

        if (event.key === 'Escape') {
            closeMediaViewer();
        }
        if (state.viewerEditing) {
            return;
        }
        if (event.key === 'ArrowRight') {
            showViewerGalleryOffset(1);
        }
        if (event.key === 'ArrowLeft') {
            showViewerGalleryOffset(-1);
        }
        if (event.key === '+' || event.key === '=') {
            setViewerZoom(state.viewerZoom + 0.15);
        }
        if (event.key === '-') {
            setViewerZoom(state.viewerZoom - 0.15);
        }
    });
}

function bindStatusMenu() {
    const trigger = $('#statusMenuTrigger');
    const options = $('#statusOptions');
    if (!trigger || !options) {
        return;
    }

    const savedStatus = localStorage.getItem(USER_STATUS_KEY);
    setUserStatus(savedStatus || 'online', false);
    trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = !options.classList.contains('hidden');
        options.classList.toggle('hidden', isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
    });
    options.addEventListener('click', (event) => {
        const button = event.target.closest('[data-status]');
        if (!button) {
            return;
        }
        setUserStatus(button.dataset.status).catch(() => {});
        options.classList.add('hidden');
        trigger.setAttribute('aria-expanded', 'false');
    });
}

async function setUserStatus(status, notify = true) {
    if (!USER_STATUS_LABELS[status]) {
        status = 'online';
    }
    localStorage.setItem(USER_STATUS_KEY, status);
    if (state.user) {
        state.user.status = status;
    }
    const label = $('#currentStatusLabel');
    if (label) {
        label.textContent = USER_STATUS_LABELS[status];
    }
    if (notify) {
        const form = new FormData();
        form.append('status', status);
        const response = await api('update_status', { method: 'POST', body: form });
        if (response.user) {
            state.user = response.user;
        }
        await loadChats();
        toast(`Status definido como ${USER_STATUS_LABELS[status]}.`);
    }
}

async function handleChatOption(action) {
    if (!state.currentChat) {
        return;
    }

    if (action === 'edit') {
        $('#chatAliasInput').value = state.currentChat.name || '';
        openModal('#editChatModal');
        return;
    }

    if (action === 'video') {
        await startOutgoingCall('video');
        return;
    }

    if (action === 'mute') {
        await toggleChatMute();
        return;
    }

    if (action === 'select') {
        state.selectionMode = true;
        renderSelectionState();
        toast('Selecione as mensagens que deseja gerenciar.');
        return;
    }

    if (action === 'gift') {
        await sendGift();
        return;
    }

    if (action === 'share-off') {
        await toggleChatSharing();
        return;
    }

    if (action === 'block') {
        await toggleBlockUser();
        return;
    }

    if (action === 'delete') {
        await deleteCurrentChat();
    }
}

async function saveChatAlias(event) {
    event.preventDefault();
    if (!state.currentChat) {
        return;
    }

    const form = new FormData(event.currentTarget);
    form.append('conversation_id', state.currentChat.id);
    await withLoading(
        () => api('update_chat_alias', { method: 'POST', body: form }),
        'Salvando...',
        'Atualizando a conversa.'
    );
    closeModal($('#editChatModal'));
    await loadChats();
    const updated = state.chats.find((chat) => chat.id === state.currentChat.id);
    if (updated) {
        state.currentChat = updated;
        $('#headerName').textContent = updated.name;
        renderChats();
    }
    toast('Conversa editada.');
}

async function toggleChatMute() {
    const confirmed = await confirmAction({
        title: state.currentChat.muted ? 'Reativar notificações?' : 'Silenciar conversa?',
        message: state.currentChat.muted ? 'As notificações sonoras voltarão para esta conversa.' : 'Você não ouvirá notificações sonoras desta conversa.',
        confirmText: state.currentChat.muted ? 'Reativar' : 'Silenciar',
    });
    if (!confirmed) {
        return;
    }

    const form = chatActionForm();
    const response = await withLoading(
        () => api('toggle_mute', { method: 'POST', body: form }),
        'Atualizando...',
        'Alterando notificações.'
    );
    state.currentChat.muted = response.muted;
    await loadChats();
    toast(response.muted ? 'Conversa silenciada.' : 'Notificações reativadas.');
}

async function toggleChatSharing() {
    const confirmed = await confirmAction({
        title: state.currentChat.sharing_disabled ? 'Ativar compartilhamento?' : 'Desativar compartilhamento?',
        message: state.currentChat.sharing_disabled ? 'Mensagens desta conversa poderão ser encaminhadas novamente.' : 'Mensagens desta conversa não poderão ser encaminhadas enquanto estiver desativado.',
        confirmText: state.currentChat.sharing_disabled ? 'Ativar' : 'Desativar',
    });
    if (!confirmed) {
        return;
    }

    const response = await withLoading(
        () => api('toggle_sharing', { method: 'POST', body: chatActionForm() }),
        'Atualizando...',
        'Alterando compartilhamento.'
    );
    state.currentChat.sharing_disabled = response.sharing_disabled;
    await loadChats();
    toast(response.sharing_disabled ? 'Compartilhamento desativado.' : 'Compartilhamento ativado.');
}

async function toggleBlockUser() {
    const confirmed = await confirmAction({
        title: state.currentChat.blocked ? 'Desbloquear usuário?' : 'Bloquear usuário?',
        message: state.currentChat.blocked ? 'Você poderá trocar mensagens com este usuário novamente.' : 'Você não receberá nem enviará novas mensagens nesta conversa.',
        confirmText: state.currentChat.blocked ? 'Desbloquear' : 'Bloquear',
        danger: !state.currentChat.blocked,
    });
    if (!confirmed) {
        return;
    }

    const response = await withLoading(
        () => api('block_user', { method: 'POST', body: chatActionForm() }),
        'Atualizando...',
        'Alterando bloqueio.'
    );
    state.currentChat.blocked = response.blocked;
    await loadChats();
    toast(response.blocked ? 'Usuário bloqueado.' : 'Usuário desbloqueado.');
}

async function deleteCurrentChat() {
    const confirmed = await confirmAction({
        title: 'Apagar chat?',
        message: 'As mensagens serao apagadas somente para voce, mas o contato continuara na lista.',
        confirmText: 'Apagar',
        danger: true,
    });
    if (!confirmed || !state.currentChat) {
        return;
    }

    await withLoading(
        () => api('delete_chat', { method: 'POST', body: chatActionForm() }),
        'Apagando chat...',
        'Limpando as mensagens.'
    );
    state.messagesLoaded.clear();
    state.messageById.clear();
    state.selectedMessages.clear();
    $('#messages').innerHTML = '';
    exitSelectionMode();
    await loadChats();
    const updated = state.chats.find((chat) => chat.id === state.currentChat.id);
    if (updated) {
        state.currentChat = updated;
        renderChats();
        $('#headerName').textContent = updated.name;
        updateHeaderStatus(updated);
    }
    toast('Mensagens apagadas. O contato continua na lista.');
}

async function sendGift() {
    const confirmed = await confirmAction({
        title: 'Enviar presente?',
        message: 'Uma mensagem de presente será enviada nesta conversa.',
        confirmText: 'Enviar',
    });
    if (!confirmed) {
        return;
    }

    const response = await withLoading(
        () => api('send_gift', { method: 'POST', body: chatActionForm() }),
        'Enviando presente...',
        'Só um instante.'
    );
    appendMessages([response.message_data]);
    $('#messages').scrollTop = $('#messages').scrollHeight;
    await loadChats();
    toast('Presente enviado.');
}

function chatActionForm() {
    const form = new FormData();
    form.append('conversation_id', state.currentChat.id);
    return form;
}

async function startVideoCall() {
    await startOutgoingCall('video');
}

async function startOutgoingCall(type = 'audio') {
    if (!state.currentChat) {
        return;
    }
    if (state.currentChat.type !== 'direct') {
        toast('Chamadas estao disponiveis apenas em conversas diretas.');
        return;
    }
    if (state.currentChat.status === 'offline') {
        toast('Este usuario esta offline e nao pode receber chamadas agora.');
        return;
    }
    if (!window.RTCPeerConnection || !navigator.mediaDevices?.getUserMedia) {
        toast('Chamadas não estao disponiveis neste navegador.');
        return;
    }

    cleanupCall(false);
    state.callMode = type === 'video' ? 'video' : 'audio';
    openCallModal('calling');

    try {
        await prepareLocalCallStream(state.callMode);
        const form = new FormData();
        form.append('conversation_id', state.currentChat.id);
        form.append('type', state.callMode);
        const response = await api('start_call', { method: 'POST', body: form });
        state.activeCall = response.call;
        await refreshCallConversation(response.call);
        state.callRole = 'caller';
        await createCallPeer();
        const offer = await state.peerConnection.createOffer();
        await state.peerConnection.setLocalDescription(offer);
        await sendCallSignal('offer', offer);
        await sendLocalMediaState(true).catch(() => {});
        startCallPolling();
        startLocalMediaStateSync();
        updateCallStatus('Chamando...');
    } catch (error) {
        updateCallStatus(error.message || 'Não foi possivel iniciar a chamada.');
        toast(error.message || 'Não foi possivel iniciar a chamada.');
        cleanupCall(true);
    }
}

function normalizeMediaConstraints(constraints = {}) {
    const normalized = {
        ...constraints,
    };

    if (Object.prototype.hasOwnProperty.call(normalized, 'áudio') && !Object.prototype.hasOwnProperty.call(normalized, 'audio')) {
        normalized.audio = normalized['áudio'];
    }
    delete normalized['áudio'];

    if (!normalized.audio && !normalized.video) {
        normalized.audio = true;
    }

    return normalized;
}

function requestUserMedia(constraints = {}) {
    return navigator.mediaDevices.getUserMedia(normalizeMediaConstraints(constraints));
}

function openIncomingCall(call) {
    if (state.activeCall || state.incomingCall || $('#callModal')?.classList.contains('hidden') === false) {
        return;
    }

    state.incomingCall = call;
    state.callMode = call.type === 'video' ? 'video' : 'audio';
    showIncomingCallNotification(call);
    openCallModal('incoming');
    if (call.remote_media_state) {
        updateRemoteMediaState(call.remote_media_state);
    }
    startIncomingCallAlert();
    startCallPolling();
}

async function acceptIncomingCall() {
    if (!state.incomingCall) {
        return;
    }
    if (!window.RTCPeerConnection || !navigator.mediaDevices?.getUserMedia) {
        toast('Chamadas não estao disponiveis neste navegador.');
        return;
    }

    const call = state.incomingCall;
    stopIncomingCallAlert();
    state.activeCall = call;
    state.incomingCall = null;
    state.callRole = 'callee';
    state.callLastSignalId = 0;
    openCallModal('connecting');

    try {
        await prepareLocalCallStream(state.callMode);
        const form = new FormData();
        form.append('call_id', call.id);
        const response = await api('answer_call', { method: 'POST', body: form });
        state.activeCall = response.call;
        if (response.call.remote_media_state) {
            updateRemoteMediaState(response.call.remote_media_state);
        }
        await refreshCallConversation(response.call);
        await createCallPeer();
        await sendLocalMediaState(true).catch(() => {});
        startCallPolling();
        startLocalMediaStateSync();
        startCallDuration(response.call);
        await pollActiveCall();
        updateCallStatus('Conectando...');
    } catch (error) {
        updateCallStatus(error.message || 'Não foi possivel atender.');
        toast(error.message || 'Não foi possivel atender.');
        await endCallRequest('reject_call').catch(() => {});
        cleanupCall(true);
    }
}

async function rejectIncomingCall() {
    const confirmed = await confirmAction({
        title: 'Recusar chamada?',
        message: 'Deseja recusar esta chamada?',
        confirmText: 'Recusar',
        danger: true,
    });
    if (!confirmed) {
        return;
    }

    stopIncomingCallAlert();
    if (state.incomingCall) {
        state.activeCall = state.incomingCall;
        state.incomingCall = null;
        await endCallRequest('reject_call').catch(() => {});
    }
    cleanupCall(true);
}

async function endVideoCall() {
    if (state.callEnding) {
        return;
    }

    const confirmed = await confirmAction({
        title: state.incomingCall && !state.activeCall ? 'Recusar chamada?' : 'Encerrar chamada?',
        message: state.incomingCall && !state.activeCall ? 'Deseja recusar esta chamada?' : 'Deseja encerrar a chamada atual?',
        confirmText: state.incomingCall && !state.activeCall ? 'Recusar' : 'Encerrar',
        danger: true,
    });
    if (!confirmed) {
        return;
    }

    state.callEnding = true;
    try {
        stopIncomingCallAlert();
        if (state.incomingCall) {
            state.activeCall = state.incomingCall;
            state.incomingCall = null;
            await endCallRequest('reject_call').catch(() => {});
        } else if (state.activeCall) {
            await sendCallSignal('hangup', { ended: true }).catch(() => {});
            await endCallRequest('end_call').catch(() => {});
        }
    } finally {
        state.callEnding = false;
        cleanupCall(true);
    }
}

async function prepareLocalCallStream(type) {
    try {
        state.localStream = await requestUserMedia({
            audio: callAudioConstraints(),
            video: type === 'video' ? callVideoConstraints() : false,
        });
    } catch (error) {
        if (type !== 'video') {
            throw error;
        }
        state.localStream = await requestUserMedia({
            audio: callAudioConstraints(),
            video: false,
        });
        toast('Câmera indisponível. Chamada iniciada somente com áudio.');
    }
    const localVideo = $('#localVideo');
    const hasVideo = state.localStream.getVideoTracks().length > 0;
    localVideo.srcObject = state.localStream;
    localVideo.classList.toggle('hidden', !hasVideo);
    bindLocalMediaTrackEvents();
    await localVideo.play().catch(() => {});
    renderLocalVideoState();
    syncCallLayout();
}

function callAudioConstraints() {
    return {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: { ideal: 1 },
        sampleRate: { ideal: 48000 },
    };
}

function callVideoConstraints() {
    return {
        facingMode: { ideal: state.callFacingMode },
        width: { ideal: 640, max: 1280 },
        height: { ideal: 360, max: 720 },
        frameRate: { ideal: 24, max: 30 },
    };
}

async function createCallPeer() {
    state.remoteStream = new MediaStream();
    state.peerConnection = new RTCPeerConnection(RTC_CONFIGURATION);
    state.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            sendCallSignal('candidate', event.candidate.toJSON()).catch(() => {});
        }
    };
    state.peerConnection.onicecandidateerror = () => {
        if (state.peerConnection?.iceConnectionState !== 'connected') {
            updateCallStatus('Procurando uma rota segura...');
        }
    };
    state.peerConnection.ontrack = (event) => {
        const incomingTracks = event.streams[0]?.getTracks() || [event.track];
        incomingTracks.filter(Boolean).forEach((track) => {
            if (!state.remoteStream.getTracks().some((item) => item.id === track.id)) {
                state.remoteStream.addTrack(track);
            }
        });
        callLog('track remoto recebido', {
            kind: event.track?.kind,
            id: event.track?.id,
            enabled: event.track?.enabled,
            muted: event.track?.muted,
        });
        const remoteVideo = $('#remoteVideo');
        const remoteAudio = $('#remoteAudio');
        remoteVideo.srcObject = state.remoteStream;
        remoteAudio.srcObject = state.remoteStream;
        applyCallSpeakerOutput().catch(() => {});
        remoteVideo.play().catch(() => {});
        remoteAudio.play().catch(() => {});
        event.track?.addEventListener('unmute', () => {
            callLog('track remoto desbloqueado', event.track.kind);
            remoteAudio.play().catch(() => {});
        });
        if (event.track.kind === 'video' && !state.remoteMediaState) {
            updateRemoteMediaState({ audio_enabled: true, video_enabled: true, has_video: true });
        } else {
            renderRemoteMediaState();
        }
        markCallConnected();
    };
    state.peerConnection.onconnectionstatechange = () => {
        const status = state.peerConnection?.connectionState;
        callLog('estado da conexão alterado', status);
        if (status === 'connected') {
            markCallConnected();
        }
        if (status === 'connecting') {
            updateCallStatus('Conectando mídia...');
        }
        if (status === 'failed') {
            updateCallStatus('Falha ao conectar a chamada.');
            scheduleCallIceRestart();
        }
        if (status === 'disconnected') {
            updateCallStatus('Conexão instável. Tentando reconectar...');
            scheduleCallIceRestart();
        }
    };
    state.peerConnection.oniceconnectionstatechange = () => {
        const status = state.peerConnection?.iceConnectionState;
        callLog('estado ICE alterado', status);
        if (status === 'checking') {
            updateCallStatus('Verificando rota de mídia...');
        }
        if (['connected', 'completed'].includes(status)) {
            markCallConnected();
        }
        if (status === 'failed') {
            updateCallStatus('Falha na conexão de mídia. Tente novamente ou use outra rede.');
            scheduleCallIceRestart();
        }
    };
    state.localStream.getTracks().forEach((track) => {
        track.enabled = true;
        const sender = state.peerConnection.addTrack(track, state.localStream);
        tuneCallSender(sender);
    });
    startCallConnectionTimeout();
    startCallStatsMonitor();
}

function tuneCallSender(sender, videoBitrate = 900000) {
    if (!sender?.getParameters) {
        return;
    }

    const parameters = sender.getParameters();
    parameters.encodings = parameters.encodings?.length ? parameters.encodings : [{}];
    if (sender.track?.kind === 'audio') {
        parameters.encodings[0].maxBitrate = 64000;
    }
    if (sender.track?.kind === 'video') {
        parameters.degradationPreference = 'balanced';
        parameters.encodings[0].maxBitrate = videoBitrate;
        parameters.encodings[0].maxFramerate = 24;
    }
    sender.setParameters(parameters).catch(() => {});
}

function startCallConnectionTimeout() {
    clearTimeout(state.callConnectionTimer);
    state.callConnectionTimer = setTimeout(() => {
        const connection = state.peerConnection?.connectionState;
        const iceConnection = state.peerConnection?.iceConnectionState;
        const mediaRouteReady = ['connected', 'completed'].includes(iceConnection);
        callLog('timeout de conexão avaliado', { connection, iceConnection, mediaRouteReady });
        if (state.activeCall && state.callMode === 'video' && !mediaRouteReady && connection !== 'connected') {
            fallbackCallToAudio('A conexão de vídeo demorou. Mantendo somente o áudio.');
        }
    }, 22000);
}

function callLog(message, details = null) {
    if (details) {
        console.info(`[WebRTC] ${message}`, details);
    } else {
        console.info(`[WebRTC] ${message}`);
    }
}

function startCallStatsMonitor() {
    clearInterval(state.callStatsTimer);
    state.callStatsTimer = setInterval(async () => {
        const peer = state.peerConnection;
        if (!peer || peer.connectionState === 'closed') {
            return;
        }

        try {
            const stats = await peer.getStats();
            let packetsLost = 0;
            let packetsReceived = 0;
            let videoOutbound = null;
            stats.forEach((report) => {
                if (report.type === 'inbound-rtp' && report.kind === 'video') {
                    packetsLost += report.packetsLost || 0;
                    packetsReceived += report.packetsReceived || 0;
                }
                if (report.type === 'outbound-rtp' && report.kind === 'video') {
                    videoOutbound = report;
                }
            });

            const totalPackets = packetsLost + packetsReceived;
            const loss = totalPackets ? packetsLost / totalPackets : 0;
            callLog('qualidade da mídia', {
                connection: peer.connectionState,
                ice: peer.iceConnectionState,
                videoLoss: `${(loss * 100).toFixed(1)}%`,
                videoBitrate: videoOutbound?.bytesSent || 0,
            });

            if (videoOutbound && loss > 0.08) {
                const sender = peer.getSenders().find((item) => item.track?.kind === 'video');
                tuneCallSender(sender, 450000);
                updateCallStatus('Rede instável. Reduzindo qualidade do vídeo...');
            } else if (videoOutbound && loss < 0.02) {
                const sender = peer.getSenders().find((item) => item.track?.kind === 'video');
                tuneCallSender(sender, 900000);
            }
        } catch (error) {
            callLog('não foi possível ler estatísticas', error);
        }
    }, 5000);
}

async function fallbackCallToAudio(message = 'Vídeo indisponível. Chamada mantida com áudio.') {
    if (!state.activeCall || state.callMode !== 'video' || !state.localStream) {
        callLog('fallback de vídeo ignorado: chamada não está em vídeo', {
            hasActiveCall: Boolean(state.activeCall),
            callMode: state.callMode,
            hasLocalStream: Boolean(state.localStream),
        });
        return;
    }

    state.localStream.getVideoTracks().forEach((track) => {
        track.enabled = false;
    });
    state.callMode = 'audio';
    updateCallStatus(message);
    renderLocalVideoState();
    syncCallLayout();
    await sendLocalMediaState(true).catch(() => {});
    toast(message);
}

function scheduleCallIceRestart() {
    if (state.callRole !== 'caller' || !state.activeCall || !state.peerConnection || state.callIceRestartAttempts >= 2 || state.callIceRestartTimer) {
        return;
    }

    state.callIceRestartTimer = setTimeout(async () => {
        state.callIceRestartTimer = null;
        if (!state.peerConnection || !state.activeCall || state.peerConnection.signalingState !== 'stable') {
            return;
        }

        state.callIceRestartAttempts += 1;
        updateCallStatus(`Reconectando mídia (${state.callIceRestartAttempts}/2)...`);
        try {
            const offer = await state.peerConnection.createOffer({ iceRestart: true });
            await state.peerConnection.setLocalDescription(offer);
            await sendCallSignal('offer', offer);
        } catch {
            updateCallStatus('Não foi possível renovar a rota de mídia.');
        }
    }, 1200);
}

async function enableLocalVideo() {
    const existing = state.localStream.getVideoTracks()[0];
    if (existing && existing.readyState === 'live') {
        existing.enabled = true;
        return;
    }

    const videoStream = await requestUserMedia({
        video: callVideoConstraints(),
        audio: false,
    });
    const videoTrack = videoStream.getVideoTracks()[0];
    if (!videoTrack) {
        throw new Error('Câmera indisponível.');
    }

    bindLocalMediaTrackEvents(videoTrack);
    state.localStream.addTrack(videoTrack);
    $('#localVideo').srcObject = state.localStream;
    await $('#localVideo').play().catch(() => {});
    if (state.peerConnection) {
        const sender = state.peerConnection.addTrack(videoTrack, state.localStream);
        tuneCallSender(sender);
        await renegotiateCall();
    }
}

async function switchCallCameraFacing() {
    if (!state.activeCall || !state.localStream) {
        return;
    }

    const currentTrack = state.localStream.getVideoTracks()[0];
    const videoOn = Boolean(currentTrack && currentTrack.readyState === 'live' && currentTrack.enabled);
    if (!videoOn) {
        toast('Ative o video para inverter a câmera.');
        return;
    }

    const nextFacingMode = state.callFacingMode === 'user' ? 'environment' : 'user';
    try {
        const videoStream = await requestUserMedia({
            video: { ...callVideoConstraints(), facingMode: { ideal: nextFacingMode } },
            audio: false,
        });
        const nextTrack = videoStream.getVideoTracks()[0];
        if (!nextTrack) {
            throw new Error('Câmera indisponível.');
        }

        bindLocalMediaTrackEvents(nextTrack);
        const sender = state.peerConnection?.getSenders().find((item) => item.track?.kind === 'video');
        if (sender) {
            await sender.replaceTrack(nextTrack);
            tuneCallSender(sender);
        } else if (state.peerConnection) {
            const nextSender = state.peerConnection.addTrack(nextTrack, state.localStream);
            tuneCallSender(nextSender);
            await renegotiateCall();
        }

        currentTrack.stop();
        state.localStream.removeTrack(currentTrack);
        state.localStream.addTrack(nextTrack);
        state.callFacingMode = nextFacingMode;
        $('#localVideo').srcObject = state.localStream;
        await $('#localVideo').play().catch(() => {});
        renderLocalVideoState();
        syncCallLayout();
        await sendLocalMediaState(true).catch(() => {});
        toast('Câmera invertida.');
    } catch (error) {
        toast(error.message || 'Não foi possivel inverter a câmera.');
    }
}

function bindLocalMediaTrackEvents(track = null) {
    const tracks = track ? [track] : (state.localStream?.getTracks() || []);
    tracks.forEach((mediaTrack) => {
        mediaTrack.addEventListener('mute', handleLocalMediaTrackChange);
        mediaTrack.addEventListener('unmute', handleLocalMediaTrackChange);
        mediaTrack.addEventListener('ended', handleLocalMediaTrackChange);
    });
}

function handleLocalMediaTrackChange() {
    renderLocalVideoState();
    syncCallLayout();
    sendLocalMediaState(true).catch(() => {});
}

async function disableLocalVideo() {
    const tracks = state.localStream?.getVideoTracks() || [];
    tracks.forEach((track) => {
        track.enabled = false;
    });
    $('#localVideo').srcObject = state.localStream;
}

async function renegotiateCall() {
    if (!state.peerConnection || state.peerConnection.signalingState !== 'stable') {
        return;
    }

    const offer = await state.peerConnection.createOffer();
    await state.peerConnection.setLocalDescription(offer);
    await sendCallSignal('offer', offer);
}

async function sendCallSignal(type, payload) {
    if (!state.activeCall?.id) {
        return;
    }

    const form = new FormData();
    form.append('call_id', state.activeCall.id);
    form.append('type', type);
    form.append('payload', JSON.stringify(payload));
    await api('call_signal', { method: 'POST', body: form });
}

async function sendLocalMediaState(force = false) {
    if (!state.activeCall?.id || !state.localStream) {
        return;
    }

    const mediaState = currentLocalMediaState();
    const mediaStateKey = JSON.stringify(mediaState);
    if (!force && mediaStateKey === state.lastLocalMediaStateKey) {
        return;
    }

    await sendCallSignal('media_state', mediaState);
    state.lastLocalMediaStateKey = mediaStateKey;
}

function currentLocalMediaState() {
    const audioTrack = state.localStream?.getAudioTracks()[0];
    const videoTrack = state.localStream?.getVideoTracks()[0];
    const videoLive = Boolean(videoTrack && videoTrack.readyState === 'live');

    return {
        audio_enabled: audioTrack ? audioTrack.enabled : false,
        video_enabled: videoLive ? videoTrack.enabled : false,
        has_video: videoLive,
    };
}

function updateRemoteMediaState(mediaState) {
    state.remoteMediaState = {
        audio_enabled: mediaState?.audio_enabled !== false,
        video_enabled: mediaState?.video_enabled !== false,
        has_video: Boolean(mediaState?.has_video),
    };
    const remoteVideoOn = state.remoteMediaState.has_video && state.remoteMediaState.video_enabled;
    const localState = currentLocalMediaState();
    if (remoteVideoOn) {
        state.callMode = 'video';
    } else if (!localState.has_video || !localState.video_enabled) {
        state.callMode = 'audio';
    }
    renderRemoteMediaState();
    syncCallLayout();
}

async function pollCallUpdates() {
    if (state.callPollInFlight) {
        return;
    }

    state.callPollInFlight = true;
    try {
        if (state.activeCall) {
            await pollActiveCall();
            return;
        }

        if (state.incomingCall) {
            return;
        }

        const response = await api('poll_call');
        if (response.call) {
            openIncomingCall(response.call);
        }
    } finally {
        state.callPollInFlight = false;
    }
}

async function pollActiveCall() {
    if (!state.activeCall?.id) {
        return;
    }

    const response = await api(`poll_call&call_id=${encodeURIComponent(state.activeCall.id)}&since_signal_id=${encodeURIComponent(state.callLastSignalId)}`);
    if (!response.call) {
        cleanupCall(true);
        return;
    }

    state.activeCall = response.call;
    if (response.call.remote_media_state) {
        updateRemoteMediaState(response.call.remote_media_state);
    }
    if (['rejected', 'ended', 'missed'].includes(response.call.status)) {
        toast(response.call.status === 'rejected' ? 'Chamada recusada.' : 'Chamada encerrada.');
        await refreshCallConversation(response.call);
        cleanupCall(true);
        return;
    }

    if (response.call.status === 'accepted' && state.peerConnection?.connectionState !== 'connected') {
        updateCallStatus('Conectando...');
    }
    if (response.call.status === 'accepted' && !state.callStartedAt) {
        startCallDuration(response.call);
        startLocalMediaStateSync();
    }

    await processCallSignals(response.signals || []);
}

async function processCallSignals(signals) {
    for (const signal of signals) {
        await processCallSignal(signal);
        state.callLastSignalId = Math.max(state.callLastSignalId, Number(signal.id) || 0);
    }
}

async function processCallSignal(signal) {
    if (!state.peerConnection && !['hangup', 'media_state'].includes(signal.type)) {
        await createCallPeer();
    }

    if (signal.type === 'offer') {
        if (state.peerConnection.signalingState !== 'stable') {
            await state.peerConnection.setLocalDescription({ type: 'rollback' }).catch(() => {});
        }
        await state.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.payload));
        await flushPendingIceCandidates();
        const answer = await state.peerConnection.createAnswer();
        await state.peerConnection.setLocalDescription(answer);
        await sendCallSignal('answer', answer);
        updateCallStatus('Resposta enviada. Conectando...');
        return;
    }

    if (signal.type === 'answer') {
        if (state.peerConnection.signalingState !== 'stable') {
            await state.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.payload));
            await flushPendingIceCandidates();
            updateCallStatus('Resposta recebida. Conectando...');
        }
        return;
    }

    if (signal.type === 'candidate' && signal.payload) {
        await addRemoteIceCandidate(signal.payload);
        return;
    }

    if (signal.type === 'media_state') {
        updateRemoteMediaState(signal.payload);
        return;
    }

    if (signal.type === 'hangup') {
        toast('Chamada encerrada.');
        cleanupCall(true);
    }
}

async function addRemoteIceCandidate(payload) {
    if (!state.peerConnection || !payload) {
        return;
    }

    const candidate = new RTCIceCandidate(payload);
    if (!state.peerConnection.remoteDescription) {
        state.pendingIceCandidates.push(candidate);
        return;
    }

    await state.peerConnection.addIceCandidate(candidate).catch(() => {});
}

async function flushPendingIceCandidates() {
    if (!state.peerConnection?.remoteDescription || !state.pendingIceCandidates.length) {
        return;
    }

    const candidates = state.pendingIceCandidates.splice(0);
    for (const candidate of candidates) {
        await state.peerConnection.addIceCandidate(candidate).catch(() => {});
    }
}

async function endCallRequest(action) {
    if (!state.activeCall?.id) {
        return;
    }
    const form = new FormData();
    form.append('call_id', state.activeCall.id);
    const response = await api(action, { method: 'POST', body: form });
    await refreshCallConversation(response.call);
}

async function refreshCallConversation(call) {
    await loadChats().catch(() => {});
    if (call?.conversation_id && state.currentChat?.id === Number(call.conversation_id)) {
        await loadMessages(false, true).catch(() => {});
    }
}

function startCallPolling() {
    clearInterval(state.callPolling);
    state.callPolling = setInterval(() => {
        pollCallUpdates().catch(() => {});
    }, 650);
}

function startLocalMediaStateSync() {
    clearInterval(state.localMediaStateTimer);
    state.localMediaStateTimer = setInterval(() => {
        if (state.activeCall && state.localStream) {
            sendLocalMediaState().catch(() => {});
        }
    }, 2000);
}

function openCallModal(mode) {
    const isIncoming = mode === 'incoming';
    const callName = isIncoming ? state.incomingCall?.caller_name : state.currentChat?.name;
    const label = state.callMode === 'video' ? 'Videochamada' : 'Ligação';
    const callPerson = isIncoming
        ? {
            avatar_url: state.incomingCall?.caller_avatar_url || state.incomingCall?.avatar_url,
            initials: initialsFromName(callName || 'U'),
        }
        : (state.currentChat || { initials: initialsFromName(callName || 'U') });
    $('#callName').textContent = callName || label;
    $('#callAudioAvatar').innerHTML = avatarMarkup(callPerson);
    state.callVideoSwapped = false;
    state.callControlsHidden = false;
    state.callPipPosition = null;
    state.callPipDrag = null;
    resetCallPipPlacement();
    $('#callModal').classList.toggle('audio-call', state.callMode !== 'video');
    $('#callModal').classList.toggle('áudio-call', state.callMode !== 'video');
    $('#callModal').classList.remove('video-swapped');
    $('#callModal').classList.remove('call-ui-hidden');
    $('#callModal').classList.remove('call-connected');
    clearTimeout(state.callConnectionTimer);
    clearTimeout(state.callIceRestartTimer);
    state.callConnectionTimer = null;
    state.callIceRestartTimer = null;
    state.callIceRestartAttempts = 0;
    $('#callModal').classList.toggle('incoming-call', isIncoming);
    $('#callModal').classList.remove('hidden');
    $('#acceptCall').classList.toggle('hidden', !isIncoming);
    $('#rejectCall').classList.toggle('hidden', !isIncoming);
    $('#toggleMic').classList.toggle('hidden', isIncoming);
    $('#toggleSpeaker').classList.toggle('hidden', isIncoming);
    $('#toggleCamera').classList.toggle('hidden', isIncoming);
    $('#moreCallActions').classList.toggle('hidden', isIncoming);
    $('#shareCall').classList.toggle('hidden', isIncoming);
    $('#switchCamera').classList.add('hidden');
    $('#hangupCall').classList.toggle('hidden', isIncoming);
    resetMediaElementPlayback($('#localVideo'), { muted: true, volume: 0, hidden: true });
    resetMediaElementPlayback($('#remoteVideo'), { muted: false, volume: 1 });
    resetMediaElementPlayback($('#remoteAudio'), { muted: false, volume: 1 });
    state.remoteMediaState = null;
    state.callSpeakerOn = state.callMode === 'video';
    $('#callDuration').textContent = '00:00';
    $('#callPlaceholder').innerHTML = `<i data-lucide="${state.callMode === 'video' ? 'video' : 'phone'}"></i><span>${state.callMode === 'video' ? 'Aguardando câmera' : 'Chamada somente com áudio'}</span>`;
    $('#callPlaceholder').classList.remove('hidden');
    updateCallStatus(isIncoming ? `${label} recebida.` : (mode === 'calling' ? 'Chamando...' : 'Conectando...'));
    syncCallLayout();
    renderCallSpeakerControl();
    applyCallSpeakerOutput().catch(() => {});
    paintIcons();
}

async function shareCallInvite() {
    const name = state.currentChat?.name || state.incomingCall?.caller_name || 'contato';
    const shareData = {
        title: 'Ligacao no NexoMessage',
        text: `Ligacao com ${name}`,
        url: window.location.href,
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(window.location.href);
            toast('Link copiado.');
        } else {
            toast('Compartilhamento não disponivel neste navegador.');
        }
    } catch {
        // O usuário pode cancelar o compartilhamento sem nenhuma mensagem de erro.
    }
}

function updateCallStatus(message) {
    $('#callStatus').textContent = message;
}

function markCallConnected() {
    updateCallStatus('Chamada conectada.');
    $('#callModal').classList.add('call-connected');
    clearTimeout(state.callConnectionTimer);
    state.callConnectionTimer = null;
    clearTimeout(state.callIceRestartTimer);
    state.callIceRestartTimer = null;
    state.callIceRestartAttempts = 0;
    if (!state.callStartedAt) {
        startCallDuration(state.activeCall);
    }
    startLocalMediaStateSync();
}

function startCallDuration(call = state.activeCall) {
    stopCallDuration(false);
    const acceptedAt = Date.parse(call?.accepted_at || (call?.status === 'accepted' ? call?.updated_at : '') || '');
    state.callStartedAt = Number.isFinite(acceptedAt) ? acceptedAt : Date.now();
    updateCallDuration();
    state.callDurationTimer = setInterval(updateCallDuration, 1000);
}

function stopCallDuration(resetText = true) {
    clearInterval(state.callDurationTimer);
    state.callDurationTimer = null;
    state.callStartedAt = null;
    if (resetText && $('#callDuration')) {
        $('#callDuration').textContent = '00:00';
    }
}

function updateCallDuration() {
    if (!state.callStartedAt || !$('#callDuration')) {
        return;
    }

    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - state.callStartedAt) / 1000));
    $('#callDuration').textContent = formatCallDuration(elapsedSeconds);
}

function formatCallDuration(totalSeconds) {
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    const padded = (value) => String(value).padStart(2, '0');

    return hours > 0
        ? `${padded(hours)}:${padded(minutes)}:${padded(seconds)}`
        : `${padded(minutes)}:${padded(seconds)}`;
}

function renderRemoteMediaState() {
    const mic = $('#remoteMicState');
    const camera = $('#remoteCameraState');
    const placeholder = $('#callPlaceholder');
    if (!mic || !camera) {
        return;
    }

    const mediaState = state.remoteMediaState;
    const isPending = !mediaState;
    const micOn = mediaState?.audio_enabled !== false;
    const hasVideo = state.callMode === 'video' || Boolean(mediaState?.has_video);
    const cameraOn = hasVideo && mediaState?.has_video && mediaState?.video_enabled !== false;

    mic.classList.toggle('media-pending', isPending);
    mic.classList.toggle('media-off', !isPending && !micOn);
    mic.innerHTML = `<i data-lucide="${micOn ? 'mic' : 'mic-off'}"></i>${isPending ? 'Aguardando microfone' : (micOn ? 'Microfone ligado' : 'Microfone mutado')}`;

    camera.classList.toggle('hidden', !hasVideo);
    camera.classList.toggle('media-pending', isPending);
    camera.classList.toggle('media-off', !isPending && !cameraOn);
    camera.innerHTML = `<i data-lucide="${cameraOn ? 'video' : 'video-off'}"></i>${isPending ? 'Aguardando câmera' : (cameraOn ? 'Câmera ligada' : 'Câmera desligada')}`;

    if (placeholder) {
        const placeholderText = isPending
            ? (hasVideo ? 'Aguardando câmera' : 'Chamada somente com áudio')
            : (hasVideo ? 'Câmera do contato desligada' : 'Chamada somente com áudio');
        placeholder.classList.toggle('hidden', Boolean(cameraOn));
        placeholder.innerHTML = `<i data-lucide="${hasVideo ? 'video-off' : 'phone'}"></i><span>${placeholderText}</span>`;
    }
    paintIcons();
}

function renderLocalVideoState() {
    const localVideo = $('#localVideo');
    const placeholder = $('#localCallPlaceholder');
    const mediaState = currentLocalMediaState();
    const videoOn = mediaState.has_video && mediaState.video_enabled;

    localVideo.classList.toggle('hidden', !videoOn);
    placeholder?.classList.toggle('hidden', videoOn);
    if (placeholder) {
        placeholder.innerHTML = '<i data-lucide="video-off"></i><span>Sua câmera desligada</span>';
    }
    updateLocalCallControls();
    paintIcons();
}

function syncCallLayout() {
    const localState = currentLocalMediaState();
    const remoteState = state.remoteMediaState;
    const localVideoOn = localState.has_video && localState.video_enabled;
    const remoteVideoOn = Boolean(remoteState?.has_video && remoteState?.video_enabled);
    const waitingForVideo = state.callMode === 'video' && !remoteState;
    const showVideoLayout = localVideoOn || remoteVideoOn || waitingForVideo;
    const callModal = $('#callModal');

    callModal.classList.toggle('audio-call', !showVideoLayout);
    callModal.classList.toggle('áudio-call', !showVideoLayout);
    callModal.classList.toggle('local-video-on', localVideoOn);
    callModal.classList.toggle('remote-video-on', remoteVideoOn);
    callModal.classList.toggle('waiting-video', waitingForVideo);
    callModal.classList.toggle('video-swapped', state.callVideoSwapped && showVideoLayout);
    $('#toggleCamera').classList.toggle('hidden', Boolean(state.incomingCall && !state.activeCall));
    applyCallPipPlacement();
    renderRemoteMediaState();
    renderLocalVideoState();
}

function currentCallPipTile() {
    const modal = $('#callModal');
    if (!modal || modal.classList.contains('áudio-call') || modal.classList.contains('hidden')) {
        return null;
    }

    return state.callVideoSwapped ? $('.remote-video-tile') : $('#localVideoTile');
}

function currentCallMainVideoTile() {
    const modal = $('#callModal');
    if (!modal || modal.classList.contains('audio-call') || modal.classList.contains('áudio-call') || modal.classList.contains('hidden')) {
        return null;
    }

    return state.callVideoSwapped ? $('#localVideoTile') : $('.remote-video-tile');
}

function toggleVideoCallChrome(event) {
    const modal = $('#callModal');
    if (!modal || modal.classList.contains('audio-call') || modal.classList.contains('áudio-call') || modal.classList.contains('hidden')) {
        return;
    }

    if (event.target.closest('button, .call-controls, .call-header, .remote-media-state')) {
        return;
    }

    const tile = event.target.closest('.call-video-tile');
    if (!tile || tile !== currentCallMainVideoTile()) {
        return;
    }

    state.callControlsHidden = !state.callControlsHidden;
    modal.classList.toggle('call-ui-hidden', state.callControlsHidden);
}

function resetCallPipPlacement() {
    [$('#localVideoTile'), $('.remote-video-tile')].forEach((tile) => {
        if (!tile) {
            return;
        }

        tile.style.left = '';
        tile.style.top = '';
        tile.style.right = '';
        tile.style.bottom = '';
    });
}

function applyCallPipPlacement() {
    resetCallPipPlacement();
    const tile = currentCallPipTile();
    if (!tile || !state.callPipPosition) {
        return;
    }

    tile.style.left = `${state.callPipPosition.x}px`;
    tile.style.top = `${state.callPipPosition.y}px`;
    tile.style.right = 'auto';
    tile.style.bottom = 'auto';
}

function toggleCallVideoSwap() {
    const modal = $('#callModal');
    if (!modal || modal.classList.contains('áudio-call')) {
        return;
    }

    state.callVideoSwapped = !state.callVideoSwapped;
    state.callControlsHidden = false;
    $('#callModal')?.classList.remove('call-ui-hidden');
    syncCallLayout();
}

function startCallPipPointer(event) {
    const tile = event.target.closest('.call-video-tile');
    if (!tile || tile !== currentCallPipTile()) {
        return;
    }

    const stage = $('.call-stage');
    const tileRect = tile.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    state.callPipDrag = {
        pointerId: event.pointerId,
        tile,
        stage,
        startX: event.clientX,
        startY: event.clientY,
        tileX: tileRect.left - stageRect.left,
        tileY: tileRect.top - stageRect.top,
        moved: false,
    };
    tile.setPointerCapture?.(event.pointerId);
    event.preventDefault();
}

function moveCallPipPointer(event) {
    const drag = state.callPipDrag;
    if (!drag || drag.pointerId !== event.pointerId) {
        return;
    }

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        drag.moved = true;
    }

    const stageRect = drag.stage.getBoundingClientRect();
    const tileRect = drag.tile.getBoundingClientRect();
    const margin = 10;
    const x = Math.max(margin, Math.min(drag.tileX + dx, stageRect.width - tileRect.width - margin));
    const y = Math.max(margin, Math.min(drag.tileY + dy, stageRect.height - tileRect.height - margin));
    state.callPipPosition = { x: Math.round(x), y: Math.round(y) };
    applyCallPipPlacement();
}

function endCallPipPointer(event) {
    const drag = state.callPipDrag;
    if (!drag || drag.pointerId !== event.pointerId) {
        return;
    }

    drag.tile.releasePointerCapture?.(event.pointerId);
    state.callPipDrag = null;
    if (!drag.moved) {
        toggleCallVideoSwap();
    }
}

function updateLocalCallControls() {
    const micButton = $('#toggleMic');
    const cameraButton = $('#toggleCamera');
    const switchButton = $('#switchCamera');
    const speakerButton = $('#toggleSpeaker');
    if (!micButton || !cameraButton || !switchButton || !speakerButton) {
        return;
    }

    const mediaState = currentLocalMediaState();
    const micOn = mediaState.audio_enabled;
    const videoOn = mediaState.has_video && mediaState.video_enabled;
    micButton.innerHTML = `<i data-lucide="${micOn ? 'mic' : 'mic-off'}"></i><span class="call-control-label">Silenciar</span>`;
    micButton.classList.toggle('media-off', !micOn);
    micButton.setAttribute('title', micOn ? 'Mutar microfone' : 'Ligar microfone');
    micButton.setAttribute('aria-label', micOn ? 'Mutar microfone' : 'Ligar microfone');

    cameraButton.innerHTML = `<i data-lucide="${videoOn ? 'video-off' : 'video'}"></i><span class="call-control-label">Vídeo</span>`;
    cameraButton.classList.toggle('media-off', !videoOn);
    cameraButton.setAttribute('title', videoOn ? 'Mudar para áudio' : 'Ativar vídeo');
    cameraButton.setAttribute('aria-label', videoOn ? 'Mudar para áudio' : 'Ativar vídeo');

    switchButton.classList.toggle('hidden', !videoOn || Boolean(state.incomingCall && !state.activeCall));
    switchButton.classList.toggle('media-off', false);
    renderCallSpeakerControl();
    paintIcons();
}

function startIncomingCallAlert() {
    stopIncomingCallAlert();
    playIncomingCallSound();
    state.callAlertTimer = setInterval(playIncomingCallSound, 2200);
}

function stopIncomingCallAlert() {
    clearInterval(state.callAlertTimer);
    state.callAlertTimer = null;
}

function playIncomingCallSound() {
    if (!state.soundEnabled) {
        return;
    }

    unlockNotificationSound();
    const context = state.audioContext;
    if (!context || context.state === 'suspended') {
        return;
    }

    const now = context.currentTime;
    playTone(context, now, 660, 0.16, 0.05);
    playTone(context, now + 0.2, 880, 0.18, 0.045);
    playTone(context, now + 0.45, 660, 0.16, 0.05);
}

function stopMediaStreamTracks(stream) {
    if (!stream) {
        return;
    }

    stream.getTracks().forEach((track) => {
        try {
            track.stop();
        } catch {
            // Track may already be stopped by the browser.
        }
    });
}

function stopPeerConnectionMedia(peerConnection) {
    if (!peerConnection) {
        return;
    }

    const stopTrack = (track) => {
        if (!track) {
            return;
        }

        try {
            track.stop();
        } catch {
            // Track may already be stopped by another cleanup path.
        }
    };

    peerConnection.getSenders?.().forEach((sender) => stopTrack(sender.track));
    peerConnection.getReceivers?.().forEach((receiver) => stopTrack(receiver.track));
    peerConnection.getTransceivers?.().forEach((transceiver) => {
        stopTrack(transceiver.sender?.track);
        stopTrack(transceiver.receiver?.track);
        try {
            transceiver.stop?.();
        } catch {
            // Some browsers throw if the transceiver is already stopped.
        }
    });
}

function resetMediaElementPlayback(mediaElement, { muted = true, volume = 0, hidden = false } = {}) {
    if (!mediaElement) {
        return;
    }

    try {
        mediaElement.pause();
    } catch {
        // Ignored: the element may not have active playback.
    }

    try {
        mediaElement.srcObject = null;
    } catch {
        // Ignored for older browser implementations.
    }

    mediaElement.removeAttribute('src');
    mediaElement.muted = muted;
    mediaElement.volume = volume;
    mediaElement.classList.toggle('hidden', hidden);

    try {
        mediaElement.load();
    } catch {
        // Ignored: load() is just to force detaching the media pipeline.
    }
}

function suspendAppAudioContext() {
    const context = state.audioContext;
    if (!context || context.state !== 'running') {
        return;
    }

    state.soundUnlocked = false;
    context.suspend().catch(() => {});
}

function cleanupCall(hideModal) {
    clearInterval(state.callPolling);
    state.callPolling = null;
    clearTimeout(state.callConnectionTimer);
    clearTimeout(state.callIceRestartTimer);
    clearInterval(state.callStatsTimer);
    state.callConnectionTimer = null;
    state.callIceRestartTimer = null;
    state.callStatsTimer = null;
    state.callIceRestartAttempts = 0;
    clearInterval(state.localMediaStateTimer);
    state.localMediaStateTimer = null;
    stopCallDuration(!hideModal);
    stopIncomingCallAlert();
    if (state.peerConnection) {
        stopPeerConnectionMedia(state.peerConnection);
        state.peerConnection.close();
        state.peerConnection = null;
    }
    stopMediaStreamTracks(state.localStream);
    stopMediaStreamTracks(state.remoteStream);
    state.localStream = null;
    state.remoteStream = null;
    resetMediaElementPlayback($('#localVideo'), { muted: true, volume: 0, hidden: true });
    resetMediaElementPlayback($('#remoteVideo'), { muted: true, volume: 0 });
    resetMediaElementPlayback($('#remoteAudio'), { muted: true, volume: 0 });
    suspendAppAudioContext();
    state.activeCall = null;
    state.incomingCall = null;
    state.pendingIceCandidates = [];
    state.callRole = '';
    state.callPollInFlight = false;
    state.callLastSignalId = 0;
    state.callStartedAt = null;
    state.lastLocalMediaStateKey = '';
    state.callFacingMode = 'user';
    state.callSpeakerOn = false;
    state.callSpeakerDeviceId = '';
    state.callVideoSwapped = false;
    state.callControlsHidden = false;
    state.callPipPosition = null;
    state.callPipDrag = null;
    state.remoteMediaState = null;
    $('#callModal')?.classList.remove('call-ui-hidden');
    resetCallPipPlacement();
    renderCallSpeakerControl();
    if (hideModal) {
        $('#callModal').classList.add('hidden');
    }
}

function toggleCallMic() {
    if (!state.localStream) {
        return;
    }
    const audioTracks = state.localStream.getAudioTracks();
    const shouldEnable = !audioTracks.some((track) => track.enabled);
    audioTracks.forEach((track) => {
        track.enabled = shouldEnable;
    });
    updateLocalCallControls();
    sendLocalMediaState(true).catch(() => {});
    toast(shouldEnable ? 'Microfone ligado.' : 'Microfone desligado.');
}

async function toggleCallSpeaker() {
    const callVisible = !$('#callModal')?.classList.contains('hidden');
    if (!callVisible) {
        return;
    }

    state.callSpeakerOn = !state.callSpeakerOn;
    renderCallSpeakerControl();
    await applyCallSpeakerOutput();
    toast(state.callSpeakerOn ? 'Viva voz ativado.' : 'Viva voz desativado.');
}

function renderCallSpeakerControl() {
    const speakerButton = $('#toggleSpeaker');
    if (!speakerButton) {
        return;
    }

    speakerButton.innerHTML = `<i data-lucide="${state.callSpeakerOn ? 'volume-2' : 'volume-1'}"></i><span class="call-control-label">Alto-falante</span>`;
    speakerButton.classList.toggle('speaker-on', state.callSpeakerOn);
    speakerButton.setAttribute('title', state.callSpeakerOn ? 'Desativar viva voz' : 'Ativar viva voz');
    speakerButton.setAttribute('aria-label', state.callSpeakerOn ? 'Desativar viva voz' : 'Ativar viva voz');
}

async function applyCallSpeakerOutput() {
    const remoteMediaElements = [$('#remoteAudio'), $('#remoteVideo')].filter(Boolean);
    const remoteMedia = remoteMediaElements[0];
    if (!remoteMediaElements.length) {
        return;
    }

    remoteMediaElements.forEach((element) => {
        element.muted = false;
        element.volume = 1;
    });

    if (typeof remoteMedia.setSinkId !== 'function' || !navigator.mediaDevices?.enumerateDevices) {
        return;
    }

    try {
        const outputs = (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === 'audiooutput');
        const targetOutput = state.callSpeakerOn
            ? preferredSpeakerOutput(outputs)
            : preferredDefaultOutput(outputs);

        if (targetOutput?.deviceId) {
            await Promise.all(remoteMediaElements
                .filter((element) => typeof element.setSinkId === 'function' && element.sinkId !== targetOutput.deviceId)
                .map((element) => element.setSinkId(targetOutput.deviceId)));
            if (state.callSpeakerOn) {
                state.callSpeakerDeviceId = targetOutput.deviceId;
            }
        }
    } catch {
        // Alguns navegadores movem a saida de áudio pelo sistema operacional e bloqueiam setSinkId.
    }
}

function preferredSpeakerOutput(outputs) {
    if (!outputs.length) {
        return null;
    }

    const speakerTerms = ['speaker', 'speakers', 'alto-falante', 'alto falante', 'viva voz'];
    const headsetTerms = ['headphone', 'headset', 'earphone', 'fone', 'bluetooth'];
    const speaker = outputs.find((device) => {
        const label = device.label.toLowerCase();
        return speakerTerms.some((term) => label.includes(term))
            && !headsetTerms.some((term) => label.includes(term));
    });

    return speaker
        || outputs.find((device) => device.deviceId === state.callSpeakerDeviceId)
        || outputs.find((device) => device.deviceId === 'default')
        || outputs[0];
}

function preferredDefaultOutput(outputs) {
    return outputs.find((device) => device.deviceId === 'communications')
        || outputs.find((device) => device.deviceId === 'default')
        || outputs[0]
        || null;
}

async function toggleCallCamera() {
    if (!state.activeCall || !state.localStream) {
        return;
    }

    const videoTrack = state.localStream.getVideoTracks()[0];
    const videoOn = Boolean(videoTrack && videoTrack.readyState === 'live' && videoTrack.enabled);

    if (videoOn) {
        const confirmed = await confirmAction({
            title: 'Mudar para áudio?',
            message: 'Sua câmera sera desligada e a chamada continuara somente com áudio.',
            confirmText: 'Usar so áudio',
        });
        if (!confirmed) {
            return;
        }

        await disableLocalVideo();
        state.callMode = state.remoteMediaState?.has_video && state.remoteMediaState?.video_enabled ? 'video' : 'audio';
        toast('Chamada alterada para áudio.');
    } else {
        const confirmed = await confirmAction({
        title: 'Ativar vídeo?',
            message: 'Sua câmera sera ligada e a chamada passara a usar video.',
        confirmText: 'Ativar vídeo',
        });
        if (!confirmed) {
            return;
        }

        try {
            if (videoTrack && videoTrack.readyState === 'live') {
                videoTrack.enabled = true;
            } else {
                await enableLocalVideo();
            }
            state.callMode = 'video';
            toast('Video ativado.');
        } catch {
            toast('Não foi possivel acessar a câmera.');
        }
    }

    renderLocalVideoState();
    syncCallLayout();
    await sendLocalMediaState(true).catch(() => {});
}

async function submitAuth(action, form) {
    try {
        const response = await withLoading(
            () => api(action, { method: 'POST', body: form }),
            action === 'login' ? 'Entrando...' : 'Criando conta...',
            'Preparando seu chat privado.'
        );
        if (response.requires_2fa) {
            $('#twoFactorLoginBox')?.classList.remove('hidden');
            $('#twoFactorLoginCode')?.focus();
            toast('Digite o código do Google Authenticator.');
            return;
        }
        state.user = response.user;
        applyPreferences();
        showApp();
        updateCurrentDeviceSession().catch(() => {});
        await loadChats();
        resetPolling();
        toast('Bem-vindo ao NexoMessage.');
    } catch (error) {
        toast(error.message);
    }
}

function showAuth() {
    clearQrLoginTimers();
    $('#authScreen').classList.remove('hidden');
    $('#connectionErrorScreen').classList.add('hidden');
    $('#appShell').classList.add('hidden');
    paintIcons();
}

function handleRemoteSessionLogout(message = 'Sessao encerrada. Faça login novamente.') {
    if (state.sessionLogoutHandled) {
        return;
    }

    state.sessionLogoutHandled = true;
    clearInterval(state.polling);
    state.polling = null;
    cleanupCall(true);
    closeModal($('#addContactModal'));
    closeModal($('#editChatModal'));
    closeProfilePanel();
    $('#mainMenu')?.classList.add('hidden');
    $('#chatOptionsMenu')?.classList.add('hidden');
    $('#messageContextMenu')?.classList.add('hidden');

    state.user = null;
    state.chats = [];
    state.currentChat = null;
    state.messagesLoaded.clear();
    state.messageById.clear();
    state.pinnedMessages = [];
    state.selectedMessages.clear();
    state.selectionMode = false;
    state.forwardMessage = null;
    state.replyTo = null;
    state.contextMessage = null;
    showAuth();
    toast(message);
}

function isRemoteSessionLogout(response, data) {
    if (response.status === 401 && state.user) {
        return true;
    }

    if (response.status !== 401 || !state.user) {
        return false;
    }

    const message = normalize(String(data?.message || ''));
    return message.includes('sessão encerrada')
        || message.includes('sessão expirada')
        || message.includes('usuário não encontrado');
}

function showApp() {
    state.sessionLogoutHandled = false;
    $('#authScreen').classList.add('hidden');
    $('#connectionErrorScreen').classList.add('hidden');
    $('#appShell').classList.remove('hidden');
    $('#adminMenuButton')?.classList.toggle('hidden', !state.user?.is_admin);
    ensureAppHistoryState();
    paintIcons();
}

function bindAppBackNavigation() {
    window.addEventListener('popstate', handleAppBackNavigation);
}

function ensureAppHistoryState() {
    if (state.appHistoryReady || !window.history?.pushState) {
        return;
    }

    history.replaceState({ NexoMessage: 'base' }, '', window.location.href);
    history.pushState({ NexoMessage: 'app' }, '', window.location.href);
    state.appHistoryReady = true;
}

async function handleAppBackNavigation() {
    if (state.leavingApp || $('#appShell')?.classList.contains('hidden')) {
        return;
    }

    history.pushState({ NexoMessage: 'app' }, '', window.location.href);

    if (closeTopOverlay()) {
        return;
    }

    if (document.body.classList.contains('chat-open')) {
        returnToChatList();
        return;
    }

    await handleExitChoice();
}

function closeTopOverlay() {
    if (!$('#confirmModal')?.classList.contains('hidden')) {
        resolveConfirm(false);
        return true;
    }

    if (!$('#mediaViewer')?.classList.contains('hidden')) {
        closeMediaViewer();
        return true;
    }

    if (!$('#qrModal')?.classList.contains('hidden')) {
        closeQrModal();
        return true;
    }

    if (!$('#updateModal')?.classList.contains('hidden')) {
        $('#updateModal').classList.add('hidden');
        return true;
    }

    const openModalElement = $$('.modal:not(.hidden)').find((modal) => modal.id !== 'confirmModal' && modal.id !== 'updateModal');
    if (openModalElement) {
        closeModal(openModalElement);
        return true;
    }

    if (!$('#profilePanel')?.classList.contains('hidden')) {
        closeProfilePanel();
        return true;
    }

    const openMenu = ['#messageContextMenu', '#chatContextMenu', '#chatOptionsMenu', '#quickPanel', '#composeMenu', '#mainMenu']
        .map((selector) => $(selector))
        .find((element) => element && !element.classList.contains('hidden'));
    if (openMenu) {
        openMenu.classList.add('hidden');
        return true;
    }

    return false;
}

async function handleExitChoice() {
    const shouldLogout = await confirmAction({
        title: 'Sair do app?',
        message: 'Escolha se deseja apenas fechar o app ou encerrar sua sessão.',
        confirmText: 'Deslogar',
        cancelText: 'Fechar app',
        danger: true,
    });

    if (shouldLogout) {
        await logoutAndReload();
        return;
    }

    closeAppWindow();
}

async function logoutAndReload() {
    await withLoading(
        () => api('logout', { method: 'POST', body: new FormData() }),
        'Saindo...',
        'Encerrando sua sessão.'
    );
    location.reload();
}

function closeAppWindow() {
    state.leavingApp = true;
    history.go(-2);
    setTimeout(() => window.close(), 300);
}

function returnToChatList() {
    document.body.classList.remove('chat-open');
    $('#chatOptionsMenu').classList.add('hidden');
    $('#quickPanel').classList.add('hidden');
    closeProfilePanel();
}

function showConnectionError() {
    hideLoading();
    $('#authScreen').classList.add('hidden');
    $('#appShell').classList.add('hidden');
    $('#connectionErrorScreen').classList.remove('hidden');
    paintIcons();
}

async function retryConnection() {
    if (!navigator.onLine) {
        toast('Ainda sem conexao. Verifique sua internet e tente novamente.');
        return;
    }

    $('#connectionErrorScreen').classList.add('hidden');
    await boot();
}

async function updateCurrentDeviceSession(locationLabel = '') {
    if (!state.user) {
        return;
    }

    const form = new FormData();
    form.append('device_name', readableDeviceName());
    form.append('platform', navigator.userAgentData?.platform || navigator.platform || '');
    form.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone || '');
    form.append('language', navigator.language || '');
    if (locationLabel) {
        form.append('location_label', locationLabel);
    }
    await api('update_session_device', { method: 'POST', body: form });
}

function readableDeviceName() {
    const ua = navigator.userAgent || '';
    const platform = navigator.userAgentData?.platform || navigator.platform || 'Dispositivo';
    if (/Android/i.test(ua)) {
        return `Android ${platform}`;
    }
    if (/iPhone|iPad/i.test(ua)) {
        return /iPad/i.test(ua) ? 'iPad' : 'iPhone';
    }
    if (/Windows/i.test(ua)) {
        return `Computador Windows`;
    }
    if (/Mac/i.test(ua)) {
        return `Mac`;
    }
    return platform;
}

function bindSoundUnlock() {
    const unlock = () => {
        unlockNotificationSound();
        requestBrowserNotificationPermission().catch(() => {});
    };
    document.addEventListener('pointerdown', unlock, { passive: true });
    document.addEventListener('keydown', unlock);
}

function unlockNotificationSound() {
    if (state.soundUnlocked) {
        return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        return;
    }

    state.audioContext = state.audioContext || new AudioContextClass();
    if (state.audioContext.state === 'suspended') {
        state.audioContext.resume().catch(() => {});
    }
    state.soundUnlocked = true;
}

function notifyUnreadIncreases(chats) {
    const currentChatId = state.currentChat?.id;
    const increasedChats = chats.filter((chat) => {
        const previous = state.previousUnread.get(chat.id) || 0;
        const current = chat.unread_count || 0;
        return chat.id !== currentChatId && !chat.muted && !chat.last_is_call && current > previous;
    });

    if (increasedChats.length) {
        playNotificationSound();
        increasedChats.slice(0, 3).forEach((chat) => {
            showMessageNotification(chat, chat.last_message || 'Nova mensagem recebida.');
        });
    }
}

async function requestBrowserNotificationPermission({ force = false } = {}) {
    if (!('Notification' in window) || Notification.permission !== 'default') {
        return 'Notification' in window ? Notification.permission : 'unsupported';
    }
    if (state.notificationPermissionAsked && !force) {
        return 'Notification' in window ? Notification.permission : 'unsupported';
    }

    state.notificationPermissionAsked = true;
            localStorage.setItem('NexoMessageNotificationAsked', 'yes');
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        setupWebPush().catch(() => {});
    }
    return permission;
}

function notificationAllowed() {
    return 'Notification' in window && Notification.permission === 'granted';
}

async function setupWebPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !notificationAllowed()) {
        return;
    }

    const config = await api('push_config');
    if (!config.enabled || !config.public_key) {
        return;
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(config.public_key),
        });
    }

    const form = new FormData();
    form.append('subscription', JSON.stringify(subscription.toJSON()));
    form.append('device_name', readableDeviceName());
    await api('save_push_subscription', { method: 'POST', body: form });
}

function urlBase64ToUint8Array(value) {
    const padding = '='.repeat((4 - (value.length % 4)) % 4);
    const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(base64);
    return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

async function showAppNotification(title, options = {}) {
    if (!notificationAllowed()) {
        return;
    }

    const notificationOptions = {
        icon: new URL('assets/icon-192.png', window.location.href).href,
        badge: new URL('assets/icon-192.png', window.location.href).href,
        timestamp: Date.now(),
        ...options,
    };

    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready.catch(() => null);
        if (registration?.showNotification) {
            await registration.showNotification(title, notificationOptions);
            return;
        }
        if (registration?.active) {
            registration.active.postMessage({
                type: 'SHOW_NOTIFICATION',
                title,
                options: notificationOptions,
            });
            return;
        }
    }

    new Notification(title, notificationOptions);
}

async function showTestNotification() {
    await showAppNotification('NexoMessage', {
        body: 'Notificações do PWA ativadas com sucesso.',
        tag: 'nexomessage-test',
        renotify: true,
        data: {
            type: 'test',
        },
    });
}

function showMessageNotification(chat, body = '') {
    if (isCallLogBody(body)) {
        return;
    }

    showAppNotification(chat?.name || 'Nova mensagem', {
        body: state.notificationPreview ? (body || 'Nova mensagem recebida.') : 'Nova mensagem recebida.',
        tag: `chat-${chat?.id || 'new'}`,
        renotify: true,
        data: {
            type: 'chat',
            chatId: chat?.id || null,
        },
    }).catch(() => {});
}

function isCallLogBody(body) {
    return /^\[call:(?:audio|áudio|video):(?:started|accepted|ended|rejected|missed)(?::\d+)?\]/i.test(String(body || '').trim());
}

function showIncomingCallNotification(call) {
    const isVideo = call?.type === 'video';
    showAppNotification(call?.caller_name || 'Chamada recebida', {
        body: isVideo ? 'Videochamada recebida.' : 'Chamada de voz recebida.',
        tag: `call-${call?.id || 'incoming'}`,
        renotify: true,
        requireInteraction: true,
        data: {
            type: 'call',
            chatId: call?.conversation_id || null,
            callId: call?.id || null,
        },
    }).catch(() => {});
}

async function openChatFromNotification(chatId) {
    const id = Number(chatId);
    if (!id || !state.user) {
        return;
    }

    let chat = state.chats.find((entry) => entry.id === id);
    if (!chat) {
        await loadChats().catch(() => {});
        chat = state.chats.find((entry) => entry.id === id);
    }
    if (chat) {
        openChat(chat);
    }
}

function playNotificationSound() {
    if (!state.soundEnabled) {
        return;
    }

    unlockNotificationSound();
    const context = state.audioContext;
    if (!context || context.state === 'suspended') {
        return;
    }

    const now = context.currentTime;
    playTone(context, now, 740, 0.09, 0.045);
    playTone(context, now + 0.1, 920, 0.12, 0.038);
}

function playTone(context, start, frequency, duration, volume) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
}

function updateHeaderStatus(chat) {
    const status = $('#headerStatus');
    if (!status || !chat) {
        return;
    }

    const pendingCount = pendingMessagesForConversation(chat.id).length;
    const offline = !navigator.onLine;
    status.classList.toggle('offline-status', offline || pendingCount > 0);

    if (offline) {
        const text = pendingCount
            ? responsiveHeaderStatus(`${pendingCount} mensagem(ns) aguardando internet para enviar`, `${pendingCount} pendente(s): envia ao reconectar`)
            : responsiveHeaderStatus('sem internet: novas mensagens serao enviadas quando voltar online', 'offline: envia ao reconectar');
        status.textContent = text;
        status.title = pendingCount
            ? `${pendingCount} mensagem(ns) aguardando internet para enviar`
            : 'sem internet: novas mensagens serao enviadas quando voltar online';
        return;
    }

    if (pendingCount > 0) {
        status.textContent = responsiveHeaderStatus(`${pendingCount} mensagem(ns) aguardando envio`, `${pendingCount} pendente(s)`);
        status.title = `${pendingCount} mensagem(ns) aguardando envio`;
        return;
    }

    status.textContent = chat.blocked
        ? 'bloqueado'
        : (chat.muted ? 'silenciado' : (chat.type === 'saved' ? 'suas mensagens privadas' : (chat.type === 'group' ? `${chat.member_count || 1} participantes` : (chat.status === 'online' ? 'online' : 'visto recentemente'))));
    status.removeAttribute('title');
}

function updateCurrentHeaderStatus() {
    if (state.currentChat) {
        updateHeaderStatus(state.currentChat);
    }
}

function responsiveHeaderStatus(fullText, compactText) {
    return isMobileViewport() ? compactText : fullText;
}

function pendingMessagesForConversation(conversationId) {
    return state.pendingOutbox.filter((message) => Number(message.conversation_id) === Number(conversationId));
}

function loadPendingOutbox() {
    try {
        const stored = JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]');
        state.pendingOutbox = Array.isArray(stored) ? stored.filter((message) => message?.id && message?.body) : [];
    } catch {
        state.pendingOutbox = [];
    }
}

function savePendingOutbox() {
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(state.pendingOutbox));
}

function queueOfflineMessage(text) {
    if (!state.currentChat || !text) {
        return;
    }

    const input = $('#messageInput');
    const pending = {
        id: -(Date.now() + Math.floor(Math.random() * 1000)),
        conversation_id: state.currentChat.id,
        body: text,
        reply_to_message_id: state.replyTo?.id || null,
        reply: state.replyTo ? {
            id: state.replyTo.id,
            sender_name: state.replyTo.sender_name || 'Mensagem',
            body: state.replyTo.body || mediaLabel(state.replyTo.media_type),
            media_type: state.replyTo.media_type || null,
        } : null,
        created_at: localDateTimeString(new Date()),
        queued_at: Date.now(),
    };

    state.pendingOutbox.push(pending);
    savePendingOutbox();
    appendMessages([pendingMessagePayload(pending)]);
    $('#messages').scrollTop = $('#messages').scrollHeight;
    input.value = '';
    autoResizeComposer(input);
    clearReply();
    toggleSendButton();
    updateCurrentHeaderStatus();
    renderChats();
    toast('Mensagem salva. Ela sera enviada quando a internet voltar.');
}

function renderPendingMessagesForCurrentChat() {
    if (!state.currentChat) {
        return;
    }

    appendMessages(pendingMessagesForConversation(state.currentChat.id).map(pendingMessagePayload));
    updateCurrentHeaderStatus();
}

function pendingMessagePayload(message) {
    return {
        id: Number(message.id),
        conversation_id: Number(message.conversation_id),
        sender_id: state.user?.id || 0,
        sender_name: state.user?.name || 'Você',
        mine: true,
        reply_to_message_id: message.reply_to_message_id,
        reply: message.reply,
        forwarded_from_name: null,
        is_pinned: false,
        pinned_at: null,
        seen_count: 0,
        body: message.body,
        media_type: null,
        media_url: null,
        media_name: null,
        mime_type: null,
        media_size: null,
        reactions: { heart: { count: 0, mine: false } },
        created_at: message.created_at,
        pending: true,
    };
}

async function handleNetworkOnline() {
    if (!$('#connectionErrorScreen')?.classList.contains('hidden')) {
        await retryConnection();
        return;
    }

    updateCurrentHeaderStatus();
    await flushPendingOutbox();
}

async function flushPendingOutbox() {
    if (!navigator.onLine || !state.pendingOutbox.length) {
        updateCurrentHeaderStatus();
        return;
    }

    const queued = [...state.pendingOutbox].sort((a, b) => (a.queued_at || Math.abs(a.id)) - (b.queued_at || Math.abs(b.id)));
    for (const pending of queued) {
        if (!navigator.onLine) {
            break;
        }

        const form = new FormData();
        form.append('conversation_id', pending.conversation_id);
        form.append('body', pending.body);
        if (pending.reply_to_message_id) {
            form.append('reply_to_message_id', pending.reply_to_message_id);
        }

        try {
            const response = await api('send_message', { method: 'POST', body: form });
            removePendingOutboxMessage(pending.id);
            if (state.currentChat?.id === Number(pending.conversation_id)) {
                removeMessage(pending.id);
                appendMessages([response.message_data]);
                $('#messages').scrollTop = $('#messages').scrollHeight;
            }
        } catch (error) {
            if (isNetworkError(error)) {
                break;
            }
            toast(error.message);
            break;
        }
    }

    savePendingOutbox();
    updateCurrentHeaderStatus();
    await loadChats().catch(() => {});
}

function removePendingOutboxMessage(messageId) {
    state.pendingOutbox = state.pendingOutbox.filter((message) => Number(message.id) !== Number(messageId));
    savePendingOutbox();
}

function isNetworkError(error) {
    return !navigator.onLine || error instanceof TypeError || String(error?.message || '').toLowerCase().includes('failed to fetch');
}

function localDateTimeString(date) {
    const pad = (value) => String(value).padStart(2, '0');
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetMinutes);
    const offset = `${sign}${pad(Math.floor(absOffset / 60))}:${pad(absOffset % 60)}`;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${offset}`;
}

async function loadChats(notify = false) {
    const response = await api('list_chats');
    if (notify && state.chatsLoadedOnce) {
        notifyUnreadIncreases(response.chats);
    }
    state.chats = response.chats;
    state.previousUnread = new Map(state.chats.map((chat) => [chat.id, chat.unread_count || 0]));
    state.chatsLoadedOnce = true;
    renderChats();
    if (state.currentChat) {
        const updated = state.chats.find((chat) => chat.id === state.currentChat.id);
        if (updated) {
            state.currentChat = updated;
            updateHeaderAvatar(updated);
            updateHeaderStatus(updated);
        }
    }
}

function updateHeaderAvatar(chat) {
    const headerAvatar = $('#headerAvatar');
    if (headerAvatar && chat) {
        headerAvatar.outerHTML = avatarMarkup(chat, 'headerAvatar');
    }
}

function renderChats() {
    const list = $('#chatList');
    const search = normalize($('#chatSearch').value || '');
    const visibleChats = state.chats.filter((chat) => chatFilterMatch(chat));
    const chats = visibleChats.filter((chat) => {
        return normalize(`${chat.name} ${chat.nick || ''} ${chat.phone || ''} ${chat.last_message || ''} ${chat.folder_name || ''}`).includes(search);
    });

    $('#allBadge').textContent = state.chats.filter((chat) => !chat.archived).length;
    $('#privateBadge').textContent = state.chats.filter((chat) => !chat.archived && chat.folder_name === 'Privado').length;
    $('#archivedBadge').textContent = state.chats.filter((chat) => chat.archived).length;
    updateUnreadBadge();
    $$('.folder-tabs [data-chat-filter]').forEach((button) => {
        button.classList.toggle('active', button.dataset.chatFilter === state.chatFilter);
    });
    list.innerHTML = chats.map((chat) => `
        <button class="chat-item ${state.currentChat?.id === chat.id ? 'active' : ''}" type="button" data-chat-id="${chat.id}">
            ${avatarMarkup(chat)}
            <span class="chat-meta">
                <strong>${chat.pinned ? '<i data-lucide="pin"></i>' : ''}${escapeHtml(chat.name)}</strong>
                <span>${chat.folder_name ? escapeHtml(chat.folder_name) + ' \u00b7 ' : ''}${chat.archived ? 'Arquivado \u00b7 ' : ''}${chat.muted ? 'Silenciada \u00b7 ' : ''}${chat.blocked ? 'Bloqueada \u00b7 ' : ''}${escapeHtml(chat.last_message || (chat.type === 'saved' ? 'Suas mensagens privadas' : 'Sem mensagens ainda'))}</span>
            </span>
            <span class="chat-side">
                <small>${formatChatDate(chat.last_at)}</small>
                ${chat.unread_count ? `<span class="unread">${chat.unread_count}</span>` : ''}
            </span>
        </button>
    `).join('');

    $$('.chat-item').forEach((item) => {
        item.addEventListener('click', () => {
            const chat = state.chats.find((entry) => entry.id === Number(item.dataset.chatId));
            if (chat) {
                openChat(chat);
            }
        });
    });

    paintIcons();
}

function updateUnreadBadge() {
    const total = state.chats.reduce((sum, chat) => sum + Math.max(0, Number(chat.unread_count || 0)), 0);
    document.title = total > 0 ? `(${total > 99 ? '99+' : total}) NexoMessage` : 'NexoMessage';
    if (navigator.setAppBadge) {
        const promise = total > 0 ? navigator.setAppBadge(total) : navigator.clearAppBadge?.();
        promise?.catch?.(() => {});
    }
}

function chatFilterMatch(chat) {
    if (state.chatFilter === 'private') {
        return !chat.archived && chat.folder_name === 'Privado';
    }
    if (state.chatFilter === 'archived') {
        return chat.archived;
    }
    return !chat.archived;
}

function openChatContextMenu(x, y, chat) {
    state.contextChat = chat;
    const menu = $('#chatContextMenu');
    const labels = {
        folder: chat.folder_name === 'Privado' ? 'Remover da Pasta' : 'Adicionar à Pasta',
        pin: chat.pinned ? 'Desafixar do Topo' : 'Fixar no Topo',
        sound: chat.muted ? 'Ativar Som' : 'Silenciar',
        archive: chat.archived ? 'Desarquivar' : 'Arquivar',
    };
    Object.entries(labels).forEach(([action, label]) => {
        const button = menu.querySelector(`[data-chat-context-action="${action}"] span`);
        if (button) {
            button.textContent = label;
        }
    });
    const removeContactButton = menu.querySelector('[data-chat-context-action="remove-contact"]');
    if (removeContactButton) {
        removeContactButton.classList.toggle('hidden', chat.type !== 'direct');
    }

    menu.classList.remove('hidden');
    paintIcons();
    const rect = menu.getBoundingClientRect();
    menu.style.left = `${Math.min(x, window.innerWidth - rect.width - 8)}px`;
    menu.style.top = `${Math.min(y, window.innerHeight - rect.height - 8)}px`;
}

function closeChatContextMenu() {
    $('#chatContextMenu')?.classList.add('hidden');
}

async function handleChatContextAction(event) {
    const button = event.target.closest('[data-chat-context-action]');
    if (!button || !state.contextChat) {
        return;
    }
    event.stopPropagation();
    const chat = state.contextChat;
    closeChatContextMenu();

    const action = button.dataset.chatContextAction;

    if (action === 'preview') {
        await openChatPreview(chat);
        return;
    }

    if (action === 'read') {
        await runChatContextRequest(chat, 'mark_chat_read', 'Marcando como lido...', 'Conversa marcada como lida.');
        return;
    }

    if (action === 'folder') {
        await runChatContextRequest(chat, 'toggle_chat_folder', 'Atualizando pasta...', chat.folder_name === 'Privado' ? 'Conversa removida da pasta.' : 'Conversa adicionada à pasta Privado.', { folder_name: 'Privado' });
        return;
    }

    if (action === 'pin') {
        await runChatContextRequest(chat, 'toggle_pin_chat', chat.pinned ? 'Desafixando...' : 'Fixando...', chat.pinned ? 'Conversa desafixada.' : 'Conversa fixada no topo.');
        return;
    }

    if (action === 'sound') {
        await runChatContextRequest(chat, 'toggle_mute', 'Atualizando som...', chat.muted ? 'Som ativado para esta conversa.' : 'Conversa silenciada.');
        return;
    }

    if (action === 'archive') {
        const confirmed = await confirmAction({
            title: chat.archived ? 'Desarquivar conversa?' : 'Arquivar conversa?',
            message: chat.archived ? 'A conversa voltar? para a lista principal.' : 'A conversa sair? da lista principal e ficará na aba Arquivados.',
            confirmText: chat.archived ? 'Desarquivar' : 'Arquivar',
        });
        if (confirmed) {
            await runChatContextRequest(chat, 'toggle_archive_chat', chat.archived ? 'Desarquivando...' : 'Arquivando...', chat.archived ? 'Conversa desarquivada.' : 'Conversa arquivada.');
        }
        return;
    }

    if (action === 'remove-contact') {
        await removeContactFromList(chat);
        return;
    }

    if (action === 'delete') {
        if (state.currentChat?.id === chat.id) {
            await deleteCurrentChat();
        } else {
            await deleteChatFromList(chat);
        }
    }
}

async function removeContactFromList(chat) {
    if (chat.type !== 'direct') {
        toast('Esta conversa não e um contato direto.');
        return;
    }

    const confirmed = await confirmAction({
        title: 'Remover usuário?',
        message: 'O usuário sera removido da sua lista de amigos. As mensagens não serao apagadas.',
        confirmText: 'Remover',
        danger: true,
    });
    if (!confirmed) {
        return;
    }

    const form = new FormData();
    form.append('conversation_id', chat.id);
    await withLoading(
        () => api('remove_contact', { method: 'POST', body: form }),
        'Removendo usuário...',
        'Atualizando sua lista de amigos.'
    );

    if (state.currentChat?.id === chat.id) {
        state.currentChat = null;
        state.messagesLoaded.clear();
        state.messageById.clear();
        $('#conversation').classList.add('hidden');
        $('#emptyChat').classList.remove('hidden');
        document.body.classList.remove('chat-open');
    }

    await loadChats();
    toast('Usuário removido da lista de amigos.');
}

async function deleteChatFromList(chat) {
    const confirmed = await confirmAction({
        title: 'Apagar chat?',
        message: 'As mensagens serao apagadas somente para voce, mas o contato continuara na lista.',
        confirmText: 'Apagar',
        danger: true,
    });
    if (!confirmed) {
        return;
    }

    const form = new FormData();
    form.append('conversation_id', chat.id);
    await withLoading(
        () => api('delete_chat', { method: 'POST', body: form }),
        'Apagando chat...',
        'Limpando as mensagens.'
    );
    await loadChats();
    toast('Mensagens apagadas. O contato continua na lista.');
}

async function runChatContextRequest(chat, action, loadingTitle, successMessage, fields = {}) {
    const form = new FormData();
    form.append('conversation_id', chat.id);
    Object.entries(fields).forEach(([key, value]) => form.append(key, value));
    await withLoading(
        () => api(action, { method: 'POST', body: form }),
        loadingTitle,
        'Atualizando conversa.'
    );
    await loadChats();
    const updated = state.chats.find((item) => item.id === chat.id);
    if (updated && state.currentChat?.id === chat.id) {
        state.currentChat = updated;
        $('#headerName').textContent = updated.name;
        updateHeaderStatus(updated);
    }
    toast(successMessage);
}

async function openChatPreview(chat) {
    $('#chatPreviewTitle').textContent = chat.name;
    $('#chatPreviewList').innerHTML = '<div class="preview-empty">Carregando prévia...</div>';
    openModal('#chatPreviewModal');

    try {
        const response = await api(`preview_chat&conversation_id=${chat.id}`);
        $('#chatPreviewList').innerHTML = response.messages.length
            ? response.messages.map((message) => `
                <div class="preview-message">
                    <strong>${escapeHtml(message.sender_name || chat.name)}</strong>
                    <span>${escapeHtml(message.body || mediaLabel(message.media_type))}</span>
                </div>
            `).join('')
            : '<div class="preview-empty">Sem mensagens para mostrar.</div>';
    } catch (error) {
        $('#chatPreviewList').innerHTML = `<div class="preview-empty">${escapeHtml(error.message)}</div>`;
    }
}

async function openChat(chat) {
    if (state.isRecording) {
        stopVoiceRecording(false);
    }

    state.currentChat = chat;
    state.messagesLoaded.clear();
    state.messageById.clear();
    state.pinnedMessages = [];
    state.contextMessage = null;
    state.replyTo = null;
    exitSelectionMode();
    renderReplyPreview();
    closeMessageContextMenu();
    $('#chatOptionsMenu').classList.add('hidden');
    $('#emptyChat').classList.add('hidden');
    $('#conversation').classList.remove('hidden');
    $('#messages').innerHTML = '';
    $('#messages').dataset.lastDate = '';
    renderPinnedShortcut();
    $('#headerName').textContent = chat.name;
    updateHeaderStatus(chat);
    $('#headerAvatar').outerHTML = avatarMarkup(chat, 'headerAvatar');
    $('#callButton').classList.toggle('hidden', chat.type !== 'direct');
    $('#videoCallButton').classList.toggle('hidden', chat.type !== 'direct');
    const canSend = groupCanSendClient(chat);
    $('#composer').classList.toggle('composer-disabled', !canSend);
    $('#messageInput').disabled = !canSend;
    $('#messageInput').placeholder = canSend ? 'Mensagem' : 'Somente admins podem enviar mensagens';
    $('#attachButton').disabled = !canSend;
    $('#quickToggle').disabled = !canSend;
    $('#audioShortcut').disabled = !canSend;
    if (!canSend) {
        closeQuickPanel();
    }
    ['edit', 'video', 'block'].forEach((option) => {
        const button = $(`#chatOptionsMenu [data-chat-option="${option}"]`);
        if (button) {
            button.classList.toggle('hidden', chat.type !== 'direct');
        }
    });
    document.body.classList.add('chat-open');
    renderChats();
    try {
        await withLoading(
            () => loadMessages(true),
            'Abrindo conversa...',
            'Carregando mensagens.'
        );
    } catch (error) {
        if (!isNetworkError(error)) {
            toast(error.message);
        }
    }
    renderPendingMessagesForCurrentChat();
    $('#messages').scrollTop = $('#messages').scrollHeight;
    resetPolling();
    paintIcons();
}

function groupCanSendClient(chat) {
    return chat?.type !== 'group' || chat.messages_policy !== 'admins' || ['owner', 'admin'].includes(chat.my_role);
}

async function loadMessages(scrollToEnd = false, notify = false) {
    if (!state.currentChat) {
        return;
    }

    const lastId = Math.max(0, ...Array.from(state.messagesLoaded));
    const response = await api(`messages&conversation_id=${state.currentChat.id}&after_id=${lastId}`);
    removeDeletedMessages(response.deleted_message_ids);
    const appended = appendMessages(response.messages);
    if (Array.isArray(response.pinned_messages)) {
        state.pinnedMessages = response.pinned_messages;
        renderPinnedShortcut();
    }
    if (notify && appended.some((message) => !message.mine)) {
        playNotificationSound();
        const incoming = appended.filter((message) => !message.mine && !isCallLogBody(message.body));
        const latest = incoming[incoming.length - 1];
        if (document.hidden && latest) {
            showMessageNotification(state.currentChat, latest?.body || mediaLabel(latest?.media_type));
        }
    }
    if (scrollToEnd || appended.length) {
        const box = $('#messages');
        box.scrollTop = box.scrollHeight;
    }
    applyPendingShareToComposer();
}

function applyPendingShareToComposer() {
    const pendingShare = localStorage.getItem(PENDING_SHARE_KEY);
    const input = $('#messageInput');
    if (!pendingShare || !input || input.disabled || input.value.trim()) {
        return;
    }

    input.value = pendingShare;
    localStorage.removeItem(PENDING_SHARE_KEY);
    handleMessageInput({ currentTarget: input });
    input.focus();
    toast('Conteúdo compartilhado pronto para envio.');
}

function appendMessages(messages) {
    if (!messages.length) {
        return [];
    }

    const box = $('#messages');
    let lastDate = box.dataset.lastDate || '';
    const appended = [];
    let shouldRegroup = false;

    messages.forEach((message) => {
        if (state.messagesLoaded.has(message.id)) {
            return;
        }

        state.messagesLoaded.add(message.id);
        state.messageById.set(message.id, message);
        appended.push(message);
        shouldRegroup = shouldRegroup || isGalleryMediaMessage(message);
        const day = formatMessageDay(message.created_at);

        if (day !== lastDate) {
            box.insertAdjacentHTML('beforeend', `<div class="date-chip">${day}</div>`);
            lastDate = day;
        }

        box.insertAdjacentHTML('beforeend', renderMessageMarkup(message));
    });

    box.dataset.lastDate = lastDate;
    if (shouldRegroup) {
        renderMessagesFromState();
        return appended;
    }
    initializeAudioPlayers(box);
    renderPinnedShortcut();
    filterConversationMessages();
    if (appended.length) {
        paintIcons();
    }
    return appended;
}

function renderMessagesFromState() {
    const box = $('#messages');
    const messages = Array.from(state.messageById.values()).sort((a, b) => a.id - b.id);
    const renderItems = buildMessageRenderItems(messages);
    let lastDate = '';

    box.innerHTML = '';
    box.dataset.lastDate = '';
    renderItems.forEach((item) => {
        const message = item.type === 'gallery' ? item.messages[0] : item.message;
        const day = formatMessageDay(message.created_at);

        if (day !== lastDate) {
            box.insertAdjacentHTML('beforeend', `<div class="date-chip">${day}</div>`);
            lastDate = day;
        }

        box.insertAdjacentHTML('beforeend', item.type === 'gallery' ? renderGalleryMessageMarkup(item.messages) : renderMessageMarkup(message));
    });
    box.dataset.lastDate = lastDate;
    initializeAudioPlayers(box);
    renderSelectionState();
    renderPinnedShortcut();
    filterConversationMessages();
    paintIcons();
}

function openConversationSearch() {
    const search = $('#conversationSearch');
    const input = $('#conversationSearchInput');
    if (!search || !input) {
        return;
    }
    search.classList.remove('hidden');
    input.focus();
    input.select();
    filterConversationMessages();
}

function closeConversationSearch() {
    const search = $('#conversationSearch');
    const input = $('#conversationSearchInput');
    if (!search || !input) {
        return;
    }
    input.value = '';
    search.classList.add('hidden');
    filterConversationMessages();
}

function filterConversationMessages() {
    const input = $('#conversationSearchInput');
    const count = $('#conversationSearchCount');
    const query = normalize(input?.value || '');
    const rows = $$('#messages .message-row');
    let matches = 0;

    rows.forEach((row) => {
        const ids = row.dataset.galleryIds
            ? row.dataset.galleryIds.split(',')
            : [row.dataset.messageId];
        const text = ids
            .map((id) => state.messageById.get(Number(id)))
            .filter(Boolean)
            .map((message) => `${message.body || ''} ${message.media_name || ''}`)
            .join(' ');
        const visible = !query || normalize(text).includes(query);
        row.classList.toggle('hidden', !visible);
        if (visible && query) {
            matches += 1;
        }
    });

    if (count) {
        count.textContent = query ? `${matches} encontrada(s)` : '';
    }
}

function renderPinnedShortcut() {
    const shortcut = $('#pinnedShortcut');
    const text = $('#pinnedShortcutText');
    if (!shortcut || !text) {
        return;
    }

    const pinned = latestPinnedMessage();
    if (!pinned) {
        shortcut.classList.add('hidden');
        shortcut.removeAttribute('data-pinned-message-id');
        text.textContent = '';
        return;
    }

    shortcut.dataset.pinnedMessageId = pinned.id;
    text.textContent = messageSummary(pinned);
    shortcut.classList.remove('hidden');
}

function buildMessageRenderItems(messages) {
    const items = [];

    messages.forEach((message) => {
        const previous = items[items.length - 1];
        if (previous?.type === 'gallery' && shouldJoinGallery(previous.messages[previous.messages.length - 1], message)) {
            previous.messages.push(message);
            return;
        }

        if (previous?.type === 'message' && shouldJoinGallery(previous.message, message)) {
            items[items.length - 1] = { type: 'gallery', messages: [previous.message, message] };
            return;
        }

        items.push({ type: 'message', message });
    });

    return items;
}

function isGalleryMediaMessage(message) {
    if (!message || message.pending || message.uploading || !message.media_url) {
        return false;
    }

    return ['image', 'gif', 'video'].includes(normalizedMediaType(message));
}

function shouldJoinGallery(previous, message) {
    if (!isGalleryMediaMessage(previous) || !isGalleryMediaMessage(message)) {
        return false;
    }

    if (Number(previous.conversation_id || 0) !== Number(message.conversation_id || 0)) {
        return false;
    }

    if (Number(previous.sender_id || 0) !== Number(message.sender_id || 0)) {
        return false;
    }

    if (Boolean(previous.mine) !== Boolean(message.mine)) {
        return false;
    }

    if (String(message.body || '').trim() || message.reply_to_message_id) {
        return false;
    }

    const previousTime = parseAppDate(previous.created_at)?.getTime() || 0;
    const messageTime = parseAppDate(message.created_at)?.getTime() || 0;
    return previousTime && messageTime && Math.abs(messageTime - previousTime) <= 120000;
}

function galleryForMessage(message) {
    if (!message) {
        return [];
    }

    const messages = Array.from(state.messageById.values()).sort((a, b) => a.id - b.id);
    const item = buildMessageRenderItems(messages).find((entry) => (
        entry.type === 'gallery'
        && entry.messages.some((galleryMessage) => Number(galleryMessage.id) === Number(message.id))
    ));

    return item?.messages || [message];
}

function latestPinnedMessage() {
    const pinned = new Map();

    state.pinnedMessages.forEach((message) => {
        if (message.is_pinned) {
            pinned.set(message.id, message);
        }
    });

    state.messageById.forEach((message) => {
        if (message.is_pinned) {
            pinned.set(message.id, message);
        } else {
            pinned.delete(message.id);
        }
    });

    return Array.from(pinned.values()).sort((a, b) => {
        const pinnedAtA = a.pinned_at ? (parseAppDate(a.pinned_at)?.getTime() || 0) : 0;
        const pinnedAtB = b.pinned_at ? (parseAppDate(b.pinned_at)?.getTime() || 0) : 0;
        return (pinnedAtB - pinnedAtA) || (b.id - a.id);
    })[0] || null;
}

function messageSummary(message) {
    const callLog = callLogFromMessage(message);
    if (callLog) {
        return callLog.text;
    }

    const body = String(message.body || '').replace(/\s+/g, ' ').trim();
    if (body) {
        return body;
    }
    return mediaLabel(message.media_type);
}

async function jumpToPinnedMessage() {
    const messageId = Number($('#pinnedShortcut')?.dataset.pinnedMessageId || 0);
    if (!messageId) {
        return;
    }

    await jumpToMessage(messageId);
}

async function jumpToMessage(messageId) {
    if (!Number.isFinite(messageId) || messageId <= 0) {
        return;
    }

    let row = document.querySelector(`[data-message-id="${messageId}"]`);

    if (!row) {
        try {
            const response = await withLoading(
                () => api(`message_context&message_id=${messageId}`),
                'Abrindo mensagem...',
                'Buscando a mensagem fixada.'
            );
            response.messages.forEach((message) => {
                state.messagesLoaded.add(message.id);
                state.messageById.set(message.id, message);
            });
            if (Array.isArray(response.pinned_messages)) {
                state.pinnedMessages = response.pinned_messages;
            }
            renderMessagesFromState();
            row = document.querySelector(`[data-message-id="${messageId}"]`);
        } catch (error) {
            toast(error.message);
            return;
        }
    }

    if (!row) {
        toast('Mensagem fixada não encontrada.');
        return;
    }

    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    row.classList.add('jump-target');
    setTimeout(() => row.classList.remove('jump-target'), 1800);
}

function renderMessageMarkup(message) {
    const callLog = callLogFromMessage(message);
    if (callLog) {
        if (callLog.hidden) {
            return '';
        }

        return `
            <div class="message-row call-log-row ${message.mine ? 'mine' : ''}" data-message-id="${message.id}">
                <span class="call-log call-log-card ${callLog.answered ? 'answered' : 'not-answered'}">
                    <span class="call-log-icon"><i data-lucide="${callLog.icon}"></i></span>
                    <span class="call-log-copy">
                        <strong>${escapeHtml(callLog.title)}</strong>
                        <em>${escapeHtml(callLog.subtitle)}</em>
                    </span>
                    <small>${formatTime(message.created_at)}</small>
                </span>
            </div>
        `;
    }

    return `
        <div class="message-row ${message.mine ? 'mine' : ''} ${message.pending ? 'pending' : ''} ${state.selectedMessages.has(message.id) ? 'selected' : ''}" data-message-id="${message.id}" title="Clique com o botão direito para opções">
            <span class="select-check"><i data-lucide="check"></i></span>
            <div class="bubble">
                ${message.pending && !message.uploading ? '<span class="pending-chip">Aguardando conexao</span>' : ''}
                ${message.is_pinned ? '<span class="pin-chip">Mensagem fixada</span>' : ''}
                ${message.forwarded_from_name ? `<span class="forward-chip">Encaminhada de ${escapeHtml(message.forwarded_from_name)}</span>` : ''}
                ${replyMarkup(message)}
                ${mediaMarkup(message)}
                ${message.body ? `<div class="bubble-text">${linkify(escapeHtml(message.body))}</div>` : ''}
                ${linkPreviewMarkup(message.link_preview)}
                ${message.edited ? '<small class="edited-label">editada</small>' : ''}
                ${reactionMarkup(message)}
                <span class="message-time">${formatTime(message.created_at)} ${messageStatusMarkup(message)}</span>
                <button class="message-heart-button ${message.reactions?.heart?.mine ? 'liked' : ''}" type="button" data-toggle-reaction="${message.id}" aria-label="Curtir mensagem" title="Curtir com coracao"><i data-lucide="heart"></i></button>
            </div>
        </div>
    `;
}

function renderGalleryMessageMarkup(messages) {
    const first = messages[0];
    const last = messages[messages.length - 1] || first;
    const selected = messages.some((message) => state.selectedMessages.has(message.id));
    const gridClass = messages.length === 2 ? 'two' : messages.length === 3 ? 'three' : messages.length === 4 ? 'four' : 'many';

    return `
        <div class="message-row gallery-row ${first.mine ? 'mine' : ''} ${selected ? 'selected' : ''}" data-message-id="${first.id}" data-gallery-ids="${messages.map((message) => message.id).join(',')}" title="Clique com o botão direito para opções">
            <span class="select-check"><i data-lucide="check"></i></span>
            <div class="bubble gallery-bubble">
                ${first.is_pinned ? '<span class="pin-chip">Mensagem fixada</span>' : ''}
                ${first.forwarded_from_name ? `<span class="forward-chip">Encaminhada de ${escapeHtml(first.forwarded_from_name)}</span>` : ''}
                ${replyMarkup(first)}
                <div class="media-gallery-grid ${gridClass}">
                    ${messages.map((message, index) => galleryTileMarkup(message, index, messages.length)).join('')}
                </div>
                ${first.body ? `<div class="bubble-text">${linkify(escapeHtml(first.body))}</div>` : ''}
                ${linkPreviewMarkup(first.link_preview)}
                ${reactionMarkup(first)}
                <span class="message-time">${formatTime(last.created_at)} ${messageStatusMarkup(last)}</span>
                <button class="message-heart-button ${first.reactions?.heart?.mine ? 'liked' : ''}" type="button" data-toggle-reaction="${first.id}" aria-label="Curtir mensagem" title="Curtir com coracao"><i data-lucide="heart"></i></button>
            </div>
        </div>
    `;
}

function linkPreviewMarkup(preview, composer = false) {
    if (!preview?.url) {
        return '';
    }
    const title = preview.title || preview.site_name || preview.url;
    const description = preview.description || '';
    const image = preview.image
        ? `<img src="${escapeAttr(preview.image)}" alt="" loading="lazy" referrerpolicy="no-referrer">`
        : '';
    let hostname = preview.site_name || preview.url;
    try {
        hostname = preview.site_name || new URL(preview.url).hostname;
    } catch {
    }
    return `<a class="link-preview-card${composer ? ' composer-link-preview' : ''}" href="${escapeAttr(preview.url)}" target="_blank" rel="noopener noreferrer">
        ${image}
        <span class="link-preview-copy">
            <small>${escapeHtml(hostname)}</small>
            <strong>${escapeHtml(title)}</strong>
            ${description ? `<span>${escapeHtml(description)}</span>` : ''}
        </span>
    </a>`;
}

function galleryTileMarkup(message, index, total) {
    const mediaType = normalizedMediaType(message);
    const extra = total > 5 && index === 4 ? `<span class="gallery-more">+${total - 5}</span>` : '';
    const hidden = total > 5 && index > 4 ? ' hidden' : '';
    const content = mediaType === 'video'
        ? `<video src="${escapeAttr(message.media_url)}" preload="metadata" muted playsinline></video><span class="gallery-play"><i data-lucide="play"></i></span>`
        : `<img src="${escapeAttr(message.media_url)}" alt="${escapeAttr(message.media_name || 'Mídia enviada')}">`;

    return `
        <button class="media-gallery-tile media-open${hidden}" type="button" data-open-media="${message.id}" aria-label="Abrir mídia ${index + 1} de ${total}">
            ${content}
            ${extra}
        </button>
    `;
}

function callLogFromMessage(message) {
    const match = String(message.body || '').match(/^\[call:(audio|áudio|video):(started|accepted|ended|rejected|missed)(?::(\d+))?\]\s*(.+)$/);
    if (!match) {
        return null;
    }
    const type = match[1] === 'video' ? 'video' : 'audio';
    const status = match[2];
    const durationSeconds = Math.max(0, Number(match[3] || 0));
    if (status === 'started' || status === 'accepted') {
        return { hidden: true };
    }

    const answered = status === 'ended' && durationSeconds > 0;

    return {
        type,
        status,
        answered,
        icon: type === 'video' ? 'video' : 'phone',
        title: type === 'video' ? 'Ligação de vídeo' : 'Ligação de voz',
        subtitle: answered ? `Atendida · ${formatCallLogDuration(durationSeconds)}` : 'Não atendida',
    };
}

function formatCallLogDuration(totalSeconds) {
    const seconds = Math.max(0, Number(totalSeconds || 0));
    if (seconds < 60) {
        return `${seconds || 1} s`;
    }

    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes ? `${hours} h ${remainingMinutes} min` : `${hours} h`;
}

function replyMarkup(message) {
    if (!message.reply) {
        return '';
    }

    return `
        <span class="reply-quote" data-jump-message="${message.reply.id}">
            <strong>${escapeHtml(message.reply.sender_name)}</strong>
            <span>${escapeHtml(message.reply.body || mediaLabel(message.reply.media_type))}</span>
        </span>
    `;
}

function messageMarkup(message) {
    return `
        <div class="message-row ${message.mine ? 'mine' : ''}" data-message-id="${message.id}" title="Clique com o botão direito para opções">
            <div class="bubble">
                ${mediaMarkup(message)}
                ${message.body ? `<div class="bubble-text">${linkify(escapeHtml(message.body))}</div>` : ''}
                ${reactionMarkup(message)}
                <span class="message-time">${formatTime(message.created_at)} ${messageStatusMarkup(message)}</span>
                <button class="message-heart-button ${message.reactions?.heart?.mine ? 'liked' : ''}" type="button" data-toggle-reaction="${message.id}" aria-label="Curtir mensagem" title="Curtir com coracao"><i data-lucide="heart"></i></button>
            </div>
        </div>
    `;
}

function messageStatusMarkup(message) {
    if (message.pending) {
        return '<span class="message-status pending-status">Aguardando</span>';
    }

    if (!message.mine) {
        return '';
    }

    return '<span class="message-status sent-status" aria-label="Mensagem enviada" title="Mensagem enviada"><i data-lucide="check-check"></i></span>';
}

function reactionMarkup(message) {
    const heart = message.reactions?.heart;
    if (!heart?.count) {
        return '';
    }

    return `
        <button class="reaction-pill ${heart.mine ? 'mine-reaction' : ''}" type="button" data-toggle-reaction="${message.id}" aria-label="Remover curtida">
            <span class="reaction-heart">\u2764\uFE0F</span>
            ${heart.count > 1 ? `<span class="reaction-count">${heart.count}</span>` : ''}
            ${heart.mine ? avatarMarkup(state.user) : ''}
        </button>
    `;
}

async function toggleMessageReaction(messageId) {
    const message = state.messageById.get(Number(messageId));
    if (!message || message.pending) {
        return;
    }

    const previous = message.reactions || { heart: { count: 0, mine: false } };
    const wasMine = Boolean(previous.heart?.mine);
    message.reactions = {
        ...previous,
        heart: {
            count: Math.max(0, Number(previous.heart?.count || 0) + (wasMine ? -1 : 1)),
            mine: !wasMine,
        },
    };
    replaceMessage(message);

    const form = new FormData();
    form.append('message_id', message.id);
    try {
        const response = await api('toggle_message_reaction', { method: 'POST', body: form });
        message.reactions = response.reactions || message.reactions;
        replaceMessage(message);
    } catch (error) {
        message.reactions = previous;
        replaceMessage(message);
        toast(error.message);
    }
}

function openMessageContextMenu(x, y, message) {
    state.contextMessage = message;
    const menu = $('#messageContextMenu');
    const copyTextButton = menu.querySelector('[data-message-action="copy-text"]');
    const copyButton = menu.querySelector('[data-message-action="copy-image"]');
    const downloadButton = menu.querySelector('[data-message-action="download"]');
    const seenLabel = menu.querySelector('.seen-disabled span');
    const hasText = Boolean(String(message.body || '').trim());
    const hasImage = message.media_url && (message.media_type === 'image' || message.media_type === 'gif');
    const hasDownload = Boolean(message.media_url);

    copyTextButton.disabled = !hasText;
    copyTextButton.classList.toggle('unavailable', !hasText);
    copyButton.disabled = !hasImage;
    copyButton.classList.toggle('unavailable', !hasImage);
    downloadButton.disabled = !hasDownload;
    downloadButton.classList.toggle('unavailable', !hasDownload);
    seenLabel.textContent = message.seen_count > 0 ? `${message.seen_count} viu` : 'Ninguém Viu';

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.classList.remove('hidden');
    paintIcons();

    requestAnimationFrame(() => {
        const margin = 10;
        const rect = menu.getBoundingClientRect();
        const left = Math.max(margin, Math.min(x, window.innerWidth - rect.width - margin));
        const top = Math.max(margin, Math.min(y, window.innerHeight - rect.height - margin));
        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
    });
}

function closeMessageContextMenu() {
    const menu = $('#messageContextMenu');
    if (menu) {
        menu.classList.add('hidden');
    }
}

function startMessageStickerHold(event) {
    const mediaButton = event.target.closest('[data-open-media]');
    if (!mediaButton || state.selectionMode) {
        return;
    }

    const messageId = Number(mediaButton.dataset.openMedia);
    const message = state.messageById.get(messageId);
    if (!canSaveMessageAsSticker(message)) {
        return;
    }

    cancelMessageStickerHold();
    state.messageStickerHoldTargetId = messageId;
    mediaButton.classList.add('holding');
    state.messageStickerHoldTimer = setTimeout(() => {
        state.messageStickerHoldTimer = null;
        state.messageStickerSuppressClickUntil = Date.now() + 900;
        mediaButton.classList.remove('holding');
        saveMessageAsSticker(messageId).catch((error) => toast(error.message));
    }, 700);
}

function cancelMessageStickerHold() {
    if (state.messageStickerHoldTimer) {
        clearTimeout(state.messageStickerHoldTimer);
        state.messageStickerHoldTimer = null;
    }
    state.messageStickerHoldTargetId = 0;
    $('#messages')?.querySelectorAll('.media-open.holding').forEach((button) => {
        button.classList.remove('holding');
    });
}

function canSaveMessageAsSticker(message) {
    if (!message || message.pending || !message.media_url) {
        return false;
    }

    const mediaType = normalizedMediaType(message);

    return mediaType === 'image' || mediaType === 'gif';
}

async function saveMessageAsSticker(messageId) {
    const message = state.messageById.get(Number(messageId));
    if (!canSaveMessageAsSticker(message)) {
        toast('Esta mensagem não pode virar figurinha.');
        return;
    }

    const confirmed = await confirmAction({
        title: 'Adicionar figurinha?',
        message: 'Deseja salvar esta imagem na sua lista de figurinhas?',
        confirmText: 'Adicionar',
    });
    if (!confirmed) {
        return;
    }

    const form = new FormData();
    form.append('message_id', String(messageId));
    try {
        const response = await withLoading(
            () => api('save_sticker_from_message', { method: 'POST', body: form }),
            'Salvando figurinha...',
            'Adicionando na sua lista.'
        );
        state.customStickers = [
            response.sticker,
            ...state.customStickers.filter((item) => Number(item.id) !== Number(response.sticker.id)),
        ];
        state.stickersLoaded = true;
        if (state.quickTab === 'stickers' && !$('#quickPanel')?.classList.contains('hidden')) {
            renderQuickPanel();
            paintIcons();
        }
        toast('Figurinha adicionada.');
    } catch (error) {
        toast(error.message);
    }
}

async function handleMessageContextAction(event) {
    const button = event.target.closest('button[data-message-action]');
    if (!button || button.disabled || !state.contextMessage) {
        return;
    }

    const action = button.dataset.messageAction;
    const message = state.contextMessage;
    closeMessageContextMenu();

    if (message.pending) {
        if (action === 'delete') {
            removePendingOutboxMessage(message.id);
            removeMessage(message.id);
            updateCurrentHeaderStatus();
            renderChats();
            toast('Mensagem removida da fila.');
            return;
        }

        toast('Esta mensagem sera enviada quando a internet voltar.');
        return;
    }

    if (action === 'download') {
        downloadMessageMedia(message);
        return;
    }

    if (action === 'copy-text') {
        await copyMessageText(message);
        return;
    }

    if (action === 'copy-image') {
        await copyMessageImage(message);
        return;
    }

    if (action === 'reply') {
        setReply(message);
        return;
    }

    if (action === 'edit') {
        await editMessage(message);
        return;
    }

    if (action === 'pin') {
        await togglePinnedMessage(message);
        return;
    }

    if (action === 'forward') {
        openForwardModal(message);
        return;
    }

    if (action === 'select') {
        enterSelectionMode(message.id);
        return;
    }

    if (action === 'delete') {
        await deleteMessage(message.id);
    }
}

async function editMessage(message) {
    if (!message.mine || !String(message.body || '').trim()) {
        toast('Somente mensagens de texto enviadas por voce podem ser editadas.');
        return;
    }

    state.replyTo = null;
    state.editingMessage = message;
    const input = $('#messageInput');
    input.value = message.body;
    renderReplyPreview();
    autoResizeComposer(input);
    toggleSendButton();
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}

function downloadMessageMedia(message) {
    if (!message.media_url) {
        toast('Esta mensagem não possui arquivo para download.');
        return;
    }

    const link = document.createElement('a');
    link.href = message.media_url;
    link.download = message.media_name || '';
    document.body.appendChild(link);
    link.click();
    link.remove();
}

async function copyMessageText(message) {
    const text = String(message.body || '').trim();
    if (!text) {
        toast('Esta mensagem não possui texto para copiar.');
        return;
    }

    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
        }
        toast('Texto da mensagem copiado.');
    } catch {
        toast('Não foi possível copiar o texto da mensagem.');
    }
}

async function copyMessageImage(message) {
    if (!message.media_url || (message.media_type !== 'image' && message.media_type !== 'gif')) {
        toast('Esta mensagem não possui imagem para copiar.');
        return;
    }

    if (!navigator.clipboard || !window.ClipboardItem) {
        toast('Seu navegador não permite copiar imagem diretamente.');
        return;
    }

    try {
        const response = await fetch(message.media_url);
        const blob = await response.blob();
        await navigator.clipboard.write([
            new ClipboardItem({ [blob.type || 'image/png']: blob }),
        ]);
        toast('Imagem copiada.');
    } catch {
        toast('Não foi possível copiar a imagem.');
    }
}

function openMediaViewer(message, gallery = null) {
    if (!message?.media_url || !['image', 'gif', 'video'].includes(normalizedMediaType(message))) {
        return;
    }

    exitImageEditor(false);
    const availableGallery = Array.isArray(gallery) && gallery.length
        ? gallery.filter((item) => item?.media_url && ['image', 'gif', 'video'].includes(normalizedMediaType(item)))
        : [message];
    const currentIndex = Math.max(0, availableGallery.findIndex((item) => Number(item.id) === Number(message.id)));

    state.viewerGallery = availableGallery.length ? availableGallery : [message];
    state.viewerGalleryIndex = currentIndex;
    state.viewerMessage = state.viewerGallery[state.viewerGalleryIndex] || message;
    state.viewerZoom = 1;
    state.viewerPanX = 0;
    state.viewerPanY = 0;
    state.viewerLastTapAt = 0;
    const viewer = $('#mediaViewer');
    viewer.classList.remove('hidden');
    document.body.classList.add('viewer-open');
    renderViewerCurrentMedia();
    paintIcons();
}

function renderViewerCurrentMedia() {
    const message = state.viewerMessage;
    if (!message) {
        return;
    }

    exitImageEditor(false);
    state.viewerZoom = 1;
    state.viewerPanX = 0;
    state.viewerPanY = 0;

    const mediaType = normalizedMediaType(message);
    const image = $('#viewerImage');
    const video = $('#viewerVideo');
    const canvas = $('#viewerEditorCanvas');

    canvas?.classList.add('hidden');
    if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
        video.classList.toggle('hidden', mediaType !== 'video');
    }
    if (image) {
        image.onload = null;
        image.removeAttribute('src');
        image.classList.toggle('hidden', mediaType === 'video');
        image.style.transform = '';
        image.classList.remove('is-zoomed', 'dragging');
    }

    if (mediaType === 'video' && video) {
        video.src = message.media_url;
        video.poster = message.thumbnail_url || '';
        video.load();
        video.onloadedmetadata = () => renderViewerFooter(message, video);
    } else if (image) {
        image.onload = () => renderViewerFooter(message, image);
        image.src = message.media_url;
        image.alt = message.media_name || 'Imagem enviada';
    }

    renderViewerInfo(message);
    renderViewerFooter(message, mediaType === 'video' ? video : image);
    renderViewerNavigation();
    setViewerZoom(1);
    paintIcons();
}

function renderViewerNavigation() {
    const canNavigate = (state.viewerGallery?.length || 0) > 1;
    document.querySelectorAll('[data-viewer-action="prev"], [data-viewer-action="next"]').forEach((button) => {
        button.classList.toggle('hidden', !canNavigate);
    });
}

function showViewerGalleryOffset(offset) {
    if (state.viewerEditing || !state.viewerGallery?.length || state.viewerGallery.length < 2) {
        return;
    }

    const total = state.viewerGallery.length;
    state.viewerGalleryIndex = (state.viewerGalleryIndex + offset + total) % total;
    state.viewerMessage = state.viewerGallery[state.viewerGalleryIndex];
    renderViewerCurrentMedia();
}

function closeMediaViewer() {
    exitImageEditor(false);
    state.viewerMessage = null;
    state.viewerGallery = [];
    state.viewerGalleryIndex = 0;
    state.viewerPanX = 0;
    state.viewerPanY = 0;
    state.viewerDragging = false;
    state.viewerLastTapAt = 0;
    const viewer = $('#mediaViewer');
    if (viewer) {
        viewer.classList.add('hidden');
    }
    const image = $('#viewerImage');
    if (image) {
        image.onload = null;
        image.removeAttribute('src');
        image.classList.remove('hidden');
        image.style.transform = '';
        image.classList.remove('is-zoomed', 'dragging');
    }
    const video = $('#viewerVideo');
    if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
        video.classList.add('hidden');
    }
    renderViewerNavigation();
    $('#viewerEditorCanvas')?.classList.add('hidden');
    renderViewerFooter(null);
    document.body.classList.remove('viewer-open');
}

function renderViewerInfo(message) {
    const chat = state.currentChat || {};
    const info = $('#viewerInfo');
    info.innerHTML = `
        <span class="viewer-avatar">${avatarMarkup({ avatar_url: null, initials: initialsFromName(message.sender_name || chat.name || 'U') })}</span>
        <span>
            <strong>${escapeHtml(message.sender_name || chat.name || 'Usuário')}</strong>
            <small>${formatFullDate(message.created_at)}</small>
            ${chat.name ? `<small>${escapeHtml(chat.name)}</small>` : ''}
        </span>
    `;
}

function renderViewerFooter(message, image = null) {
    const footer = $('#viewerFooter');
    if (!footer) {
        return;
    }

    if (!message) {
        footer.innerHTML = '';
        return;
    }

    const isVideo = normalizedMediaType(message) === 'video';
    const width = isVideo ? (image?.videoWidth || 0) : (image?.naturalWidth || 0);
    const height = isVideo ? (image?.videoHeight || 0) : (image?.naturalHeight || 0);
    const dimensions = width && height ? `${width} x ${height} px` : 'Carregando dimensões...';
    const size = formatBytes(message.media_size) || 'Tamanho indisponível';
    const name = message.media_name ? `<span>${escapeHtml(message.media_name)}</span>` : '';
    const position = (state.viewerGallery?.length || 0) > 1
        ? `<span><strong>Mídia</strong>${state.viewerGalleryIndex + 1} de ${state.viewerGallery.length}</span>`
        : '';

    footer.innerHTML = `
        ${position}
        <span><strong>Dimensões</strong>${escapeHtml(dimensions)}</span>
        <span><strong>Tamanho</strong>${escapeHtml(size)}</span>
        ${name}
    `;
}

function setViewerZoom(value) {
    if (normalizedMediaType(state.viewerMessage) === 'video') {
        state.viewerZoom = 1;
        state.viewerPanX = 0;
        state.viewerPanY = 0;
        applyViewerTransform();
        return;
    }

    state.viewerZoom = Math.max(1, Math.min(3, value));
    if (state.viewerZoom === 1) {
        state.viewerPanX = 0;
        state.viewerPanY = 0;
    }
    applyViewerTransform();
}

function applyViewerTransform() {
    const image = $('#viewerImage');
    if (image) {
        image.style.transform = `translate3d(${state.viewerPanX}px, ${state.viewerPanY}px, 0) scale(${state.viewerZoom})`;
        image.classList.toggle('is-zoomed', state.viewerZoom > 1);
    }
}

function handleViewerDoubleClick(event) {
    if (!state.viewerMessage) {
        return;
    }

    event.preventDefault();
    toggleViewerZoom();
}

function handleViewerTap(event) {
    if (!state.viewerMessage || state.viewerDragging || event.pointerType === 'mouse') {
        return;
    }

    const now = Date.now();
    const movedX = Math.abs(event.clientX - state.viewerLastTapX);
    const movedY = Math.abs(event.clientY - state.viewerLastTapY);
    const isDoubleTap = now - state.viewerLastTapAt < 300 && movedX < 28 && movedY < 28;

    if (isDoubleTap) {
        event.preventDefault();
        toggleViewerZoom();
        state.viewerLastTapAt = 0;
        return;
    }

    state.viewerLastTapAt = now;
    state.viewerLastTapX = event.clientX;
    state.viewerLastTapY = event.clientY;
}

function toggleViewerZoom() {
    setViewerZoom(state.viewerZoom > 1 ? 1 : 2);
}

function startViewerPan(event) {
    if (!state.viewerMessage || normalizedMediaType(state.viewerMessage) === 'video' || state.viewerZoom <= 1) {
        return;
    }

    state.viewerDragging = false;
    state.viewerDragStartX = event.clientX;
    state.viewerDragStartY = event.clientY;
    state.viewerDragBaseX = state.viewerPanX;
    state.viewerDragBaseY = state.viewerPanY;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add('dragging');
}

function moveViewerPan(event) {
    if (!state.viewerMessage || state.viewerZoom <= 1 || event.buttons === 0) {
        return;
    }

    const dx = event.clientX - state.viewerDragStartX;
    const dy = event.clientY - state.viewerDragStartY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        state.viewerDragging = true;
    }
    state.viewerPanX = state.viewerDragBaseX + dx;
    state.viewerPanY = state.viewerDragBaseY + dy;
    applyViewerTransform();
}

function endViewerPan(event) {
    event.currentTarget.classList.remove('dragging');
    handleViewerTap(event);
    setTimeout(() => {
        state.viewerDragging = false;
    }, 0);
}

async function handleViewerAction(action) {
    const message = state.viewerMessage;
    if (!message) {
        return;
    }

    if (state.viewerEditing && action !== 'close') {
        return;
    }

    if (action === 'close') {
        closeMediaViewer();
        return;
    }

    if (action === 'prev') {
        showViewerGalleryOffset(-1);
        return;
    }

    if (action === 'next') {
        showViewerGalleryOffset(1);
        return;
    }

    if (action === 'zoom-in') {
        setViewerZoom(state.viewerZoom + 0.15);
        return;
    }

    if (action === 'zoom-out') {
        setViewerZoom(state.viewerZoom - 0.15);
        return;
    }

    if (action === 'download') {
        downloadMessageMedia(message);
        return;
    }

    if (action === 'share') {
        await shareViewerMedia(message);
        return;
    }

    if (action === 'delete') {
        const deleted = await deleteMessage(message.id, true, {
            title: 'Apagar mídia?',
            message: 'Escolha se deseja apagar a mídia para todos ou somente ocultar para você.',
            checkboxLabel: 'Excluir somente para mim',
        });
        if (deleted) {
            closeMediaViewer();
        }
        return;
    }

    if (action === 'edit') {
        if (normalizedMediaType(message) !== 'video') {
            toast('Edição de imagem ainda não está ativada.');
        } else {
            toast('Edição de vídeo ainda não está ativada.');
        }
    }
}

async function startImageEditor(message) {
    if (!message?.media_url) {
        return;
    }

    try {
        const sourceImage = await loadImageForEditor(message.media_url);
        state.viewerEditing = true;
        state.imageEditor = {
            sourceImage,
            rotation: 0,
            flipX: false,
            cropSquare: false,
            brightness: 100,
            contrast: 100,
            drawMode: false,
            brushColor: '#ff5d5d',
            brushSize: 7,
            strokes: [],
            activeStroke: null,
        };

        setViewerZoom(1);
        $('#viewerImage')?.classList.add('hidden');
        $('#viewerEditorCanvas')?.classList.remove('hidden');
        $('#mediaViewer')?.classList.add('editing');
        renderImageEditorCanvas();
        renderImageEditorFooter();
    } catch {
        toast('Não foi possivel abrir a imagem para edicao.');
    }
}

function loadImageForEditor(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = new URL(src, window.location.href).href;
    });
}

function exitImageEditor(renderFooter = true) {
    state.viewerEditing = false;
    state.imageEditor = null;
    $('#mediaViewer')?.classList.remove('editing');
    $('#viewerEditorCanvas')?.classList.add('hidden');
    $('#viewerImage')?.classList.remove('hidden');
    if (renderFooter && state.viewerMessage) {
        renderViewerFooter(state.viewerMessage, $('#viewerImage'));
    }
}

function renderImageEditorFooter() {
    const editor = state.imageEditor;
    const footer = $('#viewerFooter');
    if (!editor || !footer) {
        return;
    }

    footer.innerHTML = `
        <div class="image-editor-toolbar">
            <button class="icon-button" type="button" data-editor-action="cancel" aria-label="Cancelar" title="Cancelar"><i data-lucide="arrow-left"></i></button>
            <button class="icon-button" type="button" data-editor-action="rotate-left" aria-label="Girar para esquerda" title="Girar para esquerda"><i data-lucide="rotate-ccw"></i></button>
            <button class="icon-button" type="button" data-editor-action="rotate-right" aria-label="Girar para direita" title="Girar para direita"><i data-lucide="rotate-cw"></i></button>
            <button class="icon-button ${editor.flipX ? 'active' : ''}" type="button" data-editor-action="flip" aria-label="Espelhar" title="Espelhar"><i data-lucide="flip-horizontal"></i></button>
            <button class="icon-button ${editor.cropSquare ? 'active' : ''}" type="button" data-editor-action="crop-square" aria-label="Recorte quadrado" title="Recorte quadrado"><i data-lucide="crop"></i></button>
            <label class="image-editor-slider" title="Brilho"><i data-lucide="sun"></i><input type="range" min="60" max="140" value="${editor.brightness}" data-editor-input="brightness"></label>
            <label class="image-editor-slider" title="Contraste"><i data-lucide="contrast"></i><input type="range" min="60" max="160" value="${editor.contrast}" data-editor-input="contrast"></label>
            <button class="icon-button ${editor.drawMode ? 'active' : ''}" type="button" data-editor-action="draw" aria-label="Pincel" title="Pincel"><i data-lucide="brush"></i></button>
            <input class="image-editor-color" type="color" value="${escapeAttr(editor.brushColor)}" data-editor-input="brushColor" aria-label="Cor do pincel" title="Cor do pincel">
            <label class="image-editor-slider compact" title="Tamanho do pincel"><i data-lucide="circle"></i><input type="range" min="2" max="24" value="${editor.brushSize}" data-editor-input="brushSize"></label>
            <button class="icon-button" type="button" data-editor-action="undo" aria-label="Desfazer" title="Desfazer" ${editor.strokes.length ? '' : 'disabled'}><i data-lucide="undo-2"></i></button>
            <button class="icon-button" type="button" data-editor-action="download" aria-label="Baixar imagem editada" title="Baixar imagem editada"><i data-lucide="download"></i></button>
            <button class="icon-button primary-action" type="button" data-editor-action="send" aria-label="Enviar imagem editada" title="Enviar imagem editada"><i data-lucide="send"></i></button>
        </div>
    `;
    paintIcons();
}

function handleImageEditorInput(event) {
    const input = event.target.closest('[data-editor-input]');
    const editor = state.imageEditor;
    if (!input || !editor) {
        return;
    }

    const key = input.dataset.editorInput;
    if (key === 'brushColor') {
        editor.brushColor = input.value;
    } else if (key === 'brushSize') {
        editor.brushSize = Number(input.value) || 7;
    } else if (key === 'brightness' || key === 'contrast') {
        editor[key] = Number(input.value) || 100;
        renderImageEditorCanvas();
    }
}

async function handleImageEditorAction(action) {
    const editor = state.imageEditor;
    if (!editor) {
        return;
    }

    if (action === 'cancel') {
        exitImageEditor(true);
        return;
    }
    if (action === 'rotate-left') {
        editor.rotation = (editor.rotation + 270) % 360;
        renderImageEditorCanvas();
    }
    if (action === 'rotate-right') {
        editor.rotation = (editor.rotation + 90) % 360;
        renderImageEditorCanvas();
    }
    if (action === 'flip') {
        editor.flipX = !editor.flipX;
        renderImageEditorCanvas();
    }
    if (action === 'crop-square') {
        editor.cropSquare = !editor.cropSquare;
        renderImageEditorCanvas();
    }
    if (action === 'draw') {
        editor.drawMode = !editor.drawMode;
    }
    if (action === 'undo') {
        editor.strokes.pop();
        renderImageEditorCanvas();
    }
    if (action === 'download') {
        await downloadEditedImage();
    }
    if (action === 'send') {
        await sendEditedImage();
    }

    renderImageEditorFooter();
}

function renderImageEditorCanvas() {
    const editor = state.imageEditor;
    const canvas = $('#viewerEditorCanvas');
    const image = editor?.sourceImage;
    if (!editor || !canvas || !image) {
        return;
    }

    const crop = editorCropRect(image, editor.cropSquare);
    const rotated = editor.rotation === 90 || editor.rotation === 270;
    canvas.width = rotated ? crop.height : crop.width;
    canvas.height = rotated ? crop.width : crop.height;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((editor.rotation * Math.PI) / 180);
    context.scale(editor.flipX ? -1 : 1, 1);
    context.filter = `brightness(${editor.brightness}%) contrast(${editor.contrast}%)`;
    context.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        -crop.width / 2,
        -crop.height / 2,
        crop.width,
        crop.height
    );
    context.restore();
    drawEditorStrokes(context, editor);
}

function editorCropRect(image, square) {
    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    if (!square) {
        return { x: 0, y: 0, width, height };
    }

    const size = Math.min(width, height);
    return {
        x: Math.round((width - size) / 2),
        y: Math.round((height - size) / 2),
        width: size,
        height: size,
    };
}

function drawEditorStrokes(context, editor) {
    context.save();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    editor.strokes.forEach((stroke) => {
        if (!stroke.points.length) {
            return;
        }
        if (stroke.points.length === 1) {
            context.fillStyle = stroke.color;
            context.beginPath();
            context.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
            context.fill();
            return;
        }
        context.beginPath();
        context.strokeStyle = stroke.color;
        context.lineWidth = stroke.size;
        context.moveTo(stroke.points[0].x, stroke.points[0].y);
        stroke.points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
        context.stroke();
    });
    context.restore();
}

function startImageEditorDraw(event) {
    const editor = state.imageEditor;
    if (!editor?.drawMode) {
        return;
    }

    event.preventDefault();
    const point = imageEditorCanvasPoint(event);
    editor.activeStroke = {
        color: editor.brushColor,
        size: editor.brushSize,
        points: [point],
    };
    editor.strokes.push(editor.activeStroke);
    event.currentTarget.setPointerCapture(event.pointerId);
}

function moveImageEditorDraw(event) {
    const editor = state.imageEditor;
    if (!editor?.drawMode || !editor.activeStroke) {
        return;
    }

    event.preventDefault();
    const point = imageEditorCanvasPoint(event);
    const points = editor.activeStroke.points;
    const lastPoint = points[points.length - 1];
    if (Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) < 1.5) {
        return;
    }

    points.push(point);
    renderImageEditorCanvas();
}

function endImageEditorDraw(event) {
    const editor = state.imageEditor;
    if (!editor?.activeStroke) {
        return;
    }

    editor.activeStroke = null;
    try {
        event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch {
    }
    renderImageEditorCanvas();
    renderImageEditorFooter();
}

function imageEditorCanvasPoint(event) {
    const canvas = $('#viewerEditorCanvas');
    const rect = canvas.getBoundingClientRect();
    return {
        x: ((event.clientX - rect.left) / rect.width) * canvas.width,
        y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
}

function editedImageBlob(type = 'image/jpeg', quality = 0.92) {
    return new Promise((resolve, reject) => {
        const canvas = $('#viewerEditorCanvas');
        if (!canvas) {
            reject(new Error('Canvas indisponível.'));
            return;
        }
        try {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Não foi possivel exportar a imagem.'));
                }
            }, type, quality);
        } catch (error) {
            reject(error);
        }
    });
}

function editedImageName(message = state.viewerMessage) {
    const original = String(message?.media_name || 'imagem.jpg');
    const base = original.replace(/\.[^.]+$/, '') || 'imagem';
    return `${base}-editada.jpg`;
}

async function downloadEditedImage() {
    try {
        const blob = await editedImageBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = editedImageName();
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    } catch {
        toast('Não foi possivel baixar a imagem editada.');
    }
}

async function sendEditedImage() {
    const message = state.viewerMessage;
    if (!message?.conversation_id) {
        return;
    }

    try {
        const blob = await editedImageBlob();
        const file = new File([blob], editedImageName(message), { type: 'image/jpeg' });
        const form = new FormData();
        form.append('conversation_id', message.conversation_id);
        form.append('body', '');
        form.append('media', file, file.name);
        form.append('media_quality', 'original');

        const response = await withLoading(
            () => api('send_message', { method: 'POST', body: form }),
            'Enviando imagem...',
            'Salvando a edicao na conversa.'
        );
        if (state.currentChat?.id === Number(message.conversation_id)) {
            appendMessages([response.message_data]);
            $('#messages').scrollTop = $('#messages').scrollHeight;
        }
        await loadChats();
        closeMediaViewer();
        toast('Imagem editada enviada.');
    } catch {
        toast('Não foi possivel enviar a imagem editada.');
    }
}

async function shareViewerMedia(message) {
    if (state.currentChat?.sharing_disabled) {
        toast('O compartilhamento desta conversa está desativado.');
        return;
    }

    if (navigator.share) {
        try {
            await navigator.share({
                title: message.media_name || 'Imagem',
                text: message.body || 'Imagem enviada no NexoMessage',
                url: new URL(message.media_url, window.location.href).href,
            });
            return;
        } catch {
            return;
        }
    }

    if (navigator.clipboard) {
        await navigator.clipboard.writeText(new URL(message.media_url, window.location.href).href);
        toast('Link da imagem copiado.');
    } else {
        toast('Compartilhamento não disponível neste navegador.');
    }
}

function setReply(message) {
    state.editingMessage = null;
    state.replyTo = message;
    renderReplyPreview();
    $('#messageInput').focus();
}

function clearReply() {
    state.replyTo = null;
    state.editingMessage = null;
    renderReplyPreview();
}

function renderReplyPreview() {
    const preview = $('#replyPreview');
    if (!preview) {
        return;
    }

    if (!state.replyTo && !state.editingMessage) {
        preview.classList.add('hidden');
        preview.innerHTML = '';
        return;
    }

    preview.classList.remove('hidden');
    if (state.editingMessage) {
        preview.innerHTML = `
            <span>
                <strong>Editando mensagem</strong>
                <small>${escapeHtml(state.editingMessage.body)}</small>
            </span>
            <button type="button" data-cancel-reply aria-label="Cancelar edição">×</button>
        `;
        return;
    }

    preview.innerHTML = `
        <span>
            <strong>Responder ${escapeHtml(state.replyTo.sender_name)}</strong>
            <small>${escapeHtml(state.replyTo.body || mediaLabel(state.replyTo.media_type))}</small>
        </span>
        <button type="button" data-cancel-reply aria-label="Cancelar resposta">x</button>
    `;
}

async function togglePinnedMessage(message) {
    const confirmed = await confirmAction({
        title: message.is_pinned ? 'Desafixar mensagem?' : 'Fixar mensagem?',
        message: message.is_pinned
            ? 'A mensagem deixará de aparecer como fixada nesta conversa.'
            : 'A mensagem ficará marcada como importante nesta conversa.',
        confirmText: message.is_pinned ? 'Desafixar' : 'Fixar',
    });
    if (!confirmed) {
        return;
    }

    const form = new FormData();
    form.append('message_id', message.id);
    const response = await withLoading(
        () => api('pin_message', { method: 'POST', body: form }),
        message.is_pinned ? 'Desafixando...' : 'Fixando...',
        'Atualizando a conversa.'
    );
    message.is_pinned = response.is_pinned;
    message.pinned_at = response.pinned_at || null;
    if (Array.isArray(response.pinned_messages)) {
        state.pinnedMessages = response.pinned_messages;
    } else if (response.is_pinned) {
        state.pinnedMessages = [
            message,
            ...state.pinnedMessages.filter((item) => item.id !== message.id),
        ];
    } else {
        state.pinnedMessages = state.pinnedMessages.filter((item) => item.id !== message.id);
    }
    replaceMessage(message);
    toast(response.is_pinned ? 'Mensagem fixada.' : 'Mensagem desafixada.');
}

async function deleteMessage(messageId, askConfirmation = true, confirmOptions = {}) {
    let deleteForMe = false;
    if (askConfirmation) {
        const confirmed = await confirmAction({
            title: 'Apagar mensagem?',
            message: 'A mensagem será removida da conversa para os participantes.',
            confirmText: 'Apagar',
            danger: true,
            checkboxLabel: 'Excluir somente para mim',
            ...confirmOptions,
        });
        if (!confirmed) {
            return false;
        }
        deleteForMe = typeof confirmed === 'object' ? Boolean(confirmed.checked) : false;
    }

    const form = new FormData();
    form.append('message_id', messageId);
    if (deleteForMe) {
        form.append('delete_for_me', '1');
    }
    await withLoading(
        () => api('delete_message', { method: 'POST', body: form }),
        'Apagando...',
        'Atualizando a conversa.'
    );
    removeMessage(messageId);
    toast(deleteForMe ? 'Mensagem removida somente para você.' : 'Mensagem apagada.');
    await loadChats();
    return true;
}

function openForwardModal(message) {
    if (state.currentChat?.sharing_disabled) {
        toast('O compartilhamento desta conversa está desativado.');
        return;
    }

    state.forwardMessage = message;
    const list = $('#forwardList');
    list.innerHTML = state.chats.map((chat) => `
        <button type="button" data-forward-chat-id="${chat.id}">
            ${avatarMarkup(chat)}
            <span>
                <strong>${escapeHtml(chat.name)}</strong>
                <small>${escapeHtml(chat.last_message || 'Sem mensagens')}</small>
            </span>
        </button>
    `).join('');
    openModal('#forwardModal');
}

async function forwardToSelectedChat(event) {
    const button = event.target.closest('[data-forward-chat-id]');
    if (!button || !state.forwardMessage) {
        return;
    }

    const destinationId = Number(button.dataset.forwardChatId);
    const form = new FormData();
    form.append('message_id', state.forwardMessage.id);
    form.append('destination_conversation_id', destinationId);
    let response;
    try {
        response = await withLoading(
            () => api('forward_message', { method: 'POST', body: form }),
            'Encaminhando...',
            'Enviando para a conversa escolhida.'
        );
        closeModal($('#forwardModal'));
        state.forwardMessage = null;
    } catch (error) {
        toast(error.message);
        return;
    }

    if (state.currentChat && state.currentChat.id === Number(response.destination_conversation_id)) {
        appendMessages([response.message_data]);
        $('#messages').scrollTop = $('#messages').scrollHeight;
    }

    await loadChats();
    toast('Mensagem encaminhada.');
}

function enterSelectionMode(messageId) {
    state.selectionMode = true;
    state.selectedMessages.add(messageId);
    renderSelectionState();
}

function exitSelectionMode() {
    state.selectionMode = false;
    state.selectedMessages.clear();
    renderSelectionState();
}

function toggleSelectedMessage(messageId) {
    if (state.selectedMessages.has(messageId)) {
        state.selectedMessages.delete(messageId);
    } else {
        state.selectedMessages.add(messageId);
    }

    if (!state.selectedMessages.size) {
        state.selectionMode = false;
    }

    renderSelectionState();
}

function renderSelectionState() {
    const messagesBox = $('#messages');
    const bar = $('#selectionBar');
    if (!messagesBox || !bar) {
        return;
    }

    messagesBox.classList.toggle('selection-mode', state.selectionMode);
    bar.classList.toggle('hidden', !state.selectionMode);
    $('#selectionCount').textContent = state.selectedMessages.size;
    $$('.message-row').forEach((row) => {
        row.classList.toggle('selected', state.selectedMessages.has(Number(row.dataset.messageId)));
    });
    paintIcons();
}

async function deleteSelectedMessages() {
    const ids = Array.from(state.selectedMessages);
    if (!ids.length) {
        return;
    }

    const confirmed = await confirmAction({
        title: 'Apagar mensagens?',
        message: `${ids.length} mensagem(ns) selecionada(s) serão removidas da conversa.`,
        confirmText: 'Apagar',
        danger: true,
    });
    if (!confirmed) {
        return;
    }

    for (const id of ids) {
        await deleteMessage(id, false);
    }
    exitSelectionMode();
}

function replaceMessage(message) {
    state.messageById.set(message.id, message);
    const row = document.querySelector(`[data-message-id="${message.id}"]`);
    if (row) {
        row.outerHTML = renderMessageMarkup(message);
        initializeAudioPlayers(document.querySelector(`[data-message-id="${message.id}"]`));
        renderSelectionState();
        paintIcons();
    }
    renderPinnedShortcut();
}

function removeMessage(messageId) {
    state.messagesLoaded.delete(messageId);
    state.messageById.delete(messageId);
    state.pinnedMessages = state.pinnedMessages.filter((message) => message.id !== messageId);
    state.selectedMessages.delete(messageId);
    const row = document.querySelector(`[data-message-id="${messageId}"]`);
    if (row) {
        row.remove();
    }
    renderSelectionState();
    renderPinnedShortcut();
}

function removeDeletedMessages(messageIds) {
    if (!Array.isArray(messageIds) || !messageIds.length) {
        return;
    }

    let changed = false;
    messageIds.forEach((messageId) => {
        const id = Number(messageId);
        if (!state.messagesLoaded.has(id) && !state.messageById.has(id)) {
            return;
        }

        state.messagesLoaded.delete(id);
        state.messageById.delete(id);
        state.selectedMessages.delete(id);
        const row = document.querySelector(`[data-message-id="${id}"]`);
        row?.remove();
        changed = true;
    });

    if (!changed) {
        return;
    }

    const removed = new Set(messageIds.map(Number));
    state.pinnedMessages = state.pinnedMessages.filter((message) => !removed.has(message.id));
    renderSelectionState();
    renderPinnedShortcut();
}

function mediaMarkup(message) {
    if (message.uploading) {
        return uploadProgressMarkup(message);
    }

    if (!message.media_url) {
        return '';
    }

    const mediaType = normalizedMediaType(message);

    if (mediaType === 'sticker') {
        return `<span class="sticker-message"><img src="${escapeAttr(message.media_url)}" alt="${escapeAttr(message.media_name || 'Figurinha')}"></span>`;
    }

    if (mediaType === 'image' || mediaType === 'gif') {
        return `<button class="media-open" type="button" data-open-media="${message.id}" aria-label="Abrir imagem"><img class="media-image" src="${escapeAttr(message.media_url)}" alt="${escapeAttr(message.media_name || 'Imagem enviada')}"></button>`;
    }

    if (mediaType === 'audio') {
        return audioPlayerMarkup(message.media_url, message.id, message.transcription);
    }

    if (mediaType === 'video') {
        return `<button class="media-open video-open" type="button" data-open-media="${message.id}" aria-label="Abrir vídeo"><video class="media-video" src="${escapeAttr(message.media_url)}" preload="metadata" muted playsinline></video><span class="gallery-play"><i data-lucide="play"></i></span></button>`;
    }

    const extension = fileExtensionLabel(message.media_name || message.media_url || 'file');
    return `
        <a class="file-card" href="${message.media_url}" target="_blank" download>
            <span class="file-icon">
                <span class="file-fold"></span>
                <span class="file-ext">${escapeHtml(extension)}</span>
                <span class="file-download"><i data-lucide="download"></i></span>
            </span>
            <span class="file-info">
                <strong>${escapeHtml(message.media_name || 'Arquivo')}</strong>
                <small>${formatBytes(message.media_size)}</small>
            </span>
        </a>
    `;
}

function uploadProgressMarkup(message) {
    const percent = Math.max(0, Math.min(100, Number(message.uploadProgress || 0)));
    const extension = fileExtensionLabel(message.media_name || 'file');
    return `
        <div class="file-card upload-file-card" aria-live="polite">
            <span class="file-icon">
                <span class="file-fold"></span>
                <span class="file-ext">${escapeHtml(extension)}</span>
                <span class="file-download upload-spinner"><i data-lucide="upload"></i></span>
            </span>
            <span class="file-info">
                <strong>${escapeHtml(message.media_name || 'Arquivo')}</strong>
                <small>${formatBytes(message.media_size)} · Enviando ${percent}%</small>
                <span class="upload-progress-track">
                    <span class="upload-progress-bar" style="width: ${percent}%"></span>
                </span>
            </span>
        </div>
    `;
}

function fileExtensionLabel(name) {
    const clean = String(name || '').split('?')[0].split('#')[0];
    const extension = clean.includes('.') ? clean.split('.').pop() : 'file';
    return String(extension || 'file').slice(0, 4).toLowerCase();
}

function normalizedMediaType(message) {
    if (looksLikeAudioMedia(message)) {
        return 'audio';
    }

    return String(message.media_type || '').toLowerCase();
}

function looksLikeAudioMedia(message) {
    const mediaType = String(message.media_type || '').toLowerCase();
    const mimeType = String(message.mime_type || '').toLowerCase();
    const mediaName = String(message.media_name || '').toLowerCase();
    const mediaUrl = String(message.media_url || '').split('?')[0].split('#')[0].toLowerCase();
    const nameOrUrl = mediaName || mediaUrl;
    const extension = nameOrUrl.includes('.') ? nameOrUrl.split('.').pop() : '';
    const audioExtensions = ['mp3', 'wav', 'ogg', 'oga', 'opus', 'm4a', 'aac', 'flac'];

    if (mediaType === 'audio' || mimeType.startsWith('audio/')) {
        return true;
    }

    if (audioExtensions.includes(extension)) {
        return true;
    }

    if (extension === 'webm') {
        return mimeType.includes('opus') || /^(audio|áudio)-\d+\.(webm|ogg|m4a|mp4|aac)$/.test(mediaName);
    }

    return false;
}

function audioPlayerMarkup(src, messageId = 0, transcription = '') {
    return `
        <div class="audio-player" data-audio-player>
            <button class="audio-play-button" type="button" data-audio-play aria-label="Reproduzir áudio">
                <i data-lucide="play"></i>
            </button>
            <div class="audio-player-main">
                <div class="audio-wave" data-audio-seek>
                    <span class="audio-progress" data-audio-progress></span>
                </div>
                <div class="audio-meta">
                    <span data-audio-current>0:00</span>
                    <button class="audio-speed-button" type="button" data-audio-rate aria-label="Alterar velocidade">1x</button>
                    <span data-audio-duration>0:00</span>
                </div>
            </div>
            <audio class="media-audio" src="${escapeAttr(src)}" preload="metadata"></audio>
        </div>
        ${audioTranscriptionMarkup(messageId, transcription)}
    `;
}

function audioTranscriptionMarkup(messageId, transcription = '') {
    if (transcription) {
        const shortText = transcription.length > 180 ? `${transcription.slice(0, 180).trim()}...` : transcription;
        return `<div class="audio-transcription" data-audio-transcription="${messageId}">
            <span class="audio-transcription-label">Transcrição</span>
            <span class="audio-transcription-text">${escapeHtml(shortText)}</span>
            ${transcription.length > 180 ? `<button type="button" class="audio-transcription-more" data-transcription-more="${messageId}" data-full-transcription="${escapeAttr(transcription)}">Mostrar mais</button>` : ''}
        </div>`;
    }
    return `<button type="button" class="audio-transcribe-button" data-transcribe-audio="${messageId}"><i data-lucide="text"></i>Transcrever áudio</button>`;
}

function handleAudioPlayerClick(event) {
    const transcribeButton = event.target.closest('[data-transcribe-audio]');
    const moreButton = event.target.closest('[data-transcription-more]');
    if (transcribeButton) {
        transcribeAudio(Number(transcribeButton.dataset.transcribeAudio));
        return;
    }
    if (moreButton) {
        const container = moreButton.closest('[data-audio-transcription]');
        const text = container?.querySelector('.audio-transcription-text');
        if (text) {
            text.textContent = moreButton.dataset.fullTranscription || text.textContent;
            moreButton.remove();
        }
        return;
    }
    const playButton = event.target.closest('[data-audio-play]');
    const rateButton = event.target.closest('[data-audio-rate]');
    const seekBar = event.target.closest('[data-audio-seek]');

    if (rateButton) {
        const player = rateButton.closest('[data-audio-player]');
        cycleAudioPlaybackRate(player);
        return;
    }

    if (playButton) {
        const player = playButton.closest('[data-audio-player]');
        toggleAudioPlayer(player);
        return;
    }

    if (seekBar) {
        const player = seekBar.closest('[data-audio-player]');
        seekAudioPlayer(player, event);
    }
}

async function transcribeAudio(messageId) {
    const button = document.querySelector(`[data-transcribe-audio="${messageId}"]`);
    if (!button) {
        return;
    }
    button.disabled = true;
    button.classList.add('loading');
    button.textContent = 'Transcrevendo...';
    try {
        const form = new FormData();
        form.append('message_id', String(messageId));
        const response = await api('transcribe_audio', { method: 'POST', body: form });
        const message = state.messageById.get(messageId);
        if (message) {
            message.transcription = response.transcription;
            renderMessagesFromState();
        }
    } catch (error) {
        button.disabled = false;
        button.classList.remove('loading');
        button.innerHTML = '<i data-lucide="text"></i>Transcrever áudio';
        paintIcons();
        toast(error.message);
    }
}

function toggleAudioPlayer(player) {
    const áudio = player?.querySelector('audio');
    if (!áudio) {
        return;
    }

    setupAudioPlayer(player);
    if (áudio.paused) {
        pauseOtherAudioPlayers(player);
        áudio.play().catch(() => toast('Não foi possivel reproduzir o áudio.'));
    } else {
        áudio.pause();
    }
}

function setupAudioPlayer(player) {
    if (!player || player.dataset.ready === 'yes') {
        return;
    }

    const áudio = player.querySelector('audio');
    if (!áudio) {
        return;
    }

    player.dataset.ready = 'yes';
    áudio.playbackRate = Number(player.dataset.playbackRate || 1);
    áudio.addEventListener('loadedmetadata', () => updateAudioPlayer(player));
    áudio.addEventListener('timeupdate', () => updateAudioPlayer(player));
    áudio.addEventListener('play', () => renderAudioPlayerState(player));
    áudio.addEventListener('pause', () => renderAudioPlayerState(player));
    áudio.addEventListener('ended', () => {
        áudio.currentTime = 0;
        updateAudioPlayer(player);
        renderAudioPlayerState(player);
    });
    updateAudioPlayer(player);
    renderAudioPlaybackRate(player);
}

function initializeAudioPlayers(root = document) {
    upgradeLegacyAudioPlayers(root);
    root?.querySelectorAll?.('[data-audio-player]').forEach((player) => setupAudioPlayer(player));
}

function upgradeLegacyAudioPlayers(root = document) {
    root?.querySelectorAll?.('audio:not([data-upgraded-audio])').forEach((áudio) => {
        if (áudio.closest('[data-audio-player]')) {
            áudio.dataset.upgradedAudio = 'yes';
            return;
        }

        const src = áudio.currentSrc || áudio.getAttribute('src');
        if (!src) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.innerHTML = audioPlayerMarkup(src).trim();
        áudio.replaceWith(wrapper.firstElementChild);
    });
}

function pauseOtherAudioPlayers(currentPlayer) {
    $$('[data-audio-player]').forEach((player) => {
        if (player === currentPlayer) {
            return;
        }

        const áudio = player.querySelector('audio');
        if (áudio && !áudio.paused) {
            áudio.pause();
        }
    });
}

function seekAudioPlayer(player, event) {
    const áudio = player?.querySelector('audio');
    const seekBar = player?.querySelector('[data-audio-seek]');
    if (!áudio || !seekBar || !Number.isFinite(áudio.duration) || áudio.duration <= 0) {
        return;
    }

    const rect = seekBar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    áudio.currentTime = áudio.duration * ratio;
    updateAudioPlayer(player);
}

function cycleAudioPlaybackRate(player) {
    const áudio = player?.querySelector('audio');
    if (!áudio) {
        return;
    }

    setupAudioPlayer(player);
    const currentRate = Number(player.dataset.playbackRate || áudio.playbackRate || 1);
    const currentIndex = AUDIO_PLAYBACK_RATES.findIndex((rate) => Math.abs(rate - currentRate) < 0.01);
    const nextRate = AUDIO_PLAYBACK_RATES[(currentIndex + 1) % AUDIO_PLAYBACK_RATES.length];
    player.dataset.playbackRate = String(nextRate);
    áudio.playbackRate = nextRate;
    renderAudioPlaybackRate(player);
}

function renderAudioPlaybackRate(player) {
    const button = player?.querySelector('[data-audio-rate]');
    const áudio = player?.querySelector('audio');
    if (!button || !áudio) {
        return;
    }

    const rate = Number(player.dataset.playbackRate || áudio.playbackRate || 1);
    button.textContent = formatPlaybackRate(rate);
    button.classList.toggle('active', Math.abs(rate - 1) > 0.01);
    button.setAttribute('title', `Velocidade ${formatPlaybackRate(rate)}`);
}

function formatPlaybackRate(rate) {
    return Number.isInteger(rate) ? `${rate}x` : `${rate.toFixed(1)}x`;
}

function updateAudioPlayer(player) {
    const áudio = player?.querySelector('audio');
    if (!áudio) {
        return;
    }

    const duration = Number.isFinite(áudio.duration) ? áudio.duration : 0;
    const current = Number.isFinite(áudio.currentTime) ? áudio.currentTime : 0;
    const progress = duration > 0 ? Math.min(100, Math.max(0, (current / duration) * 100)) : 0;
    const progressEl = player.querySelector('[data-audio-progress]');
    const currentEl = player.querySelector('[data-audio-current]');
    const durationEl = player.querySelector('[data-audio-duration]');

    if (progressEl) {
        progressEl.style.width = `${progress}%`;
    }
    if (currentEl) {
        currentEl.textContent = formatAudioDuration(current);
    }
    if (durationEl) {
        durationEl.textContent = formatAudioDuration(duration);
    }
}

function renderAudioPlayerState(player) {
    const áudio = player?.querySelector('audio');
    const button = player?.querySelector('[data-audio-play]');
    if (!áudio || !button) {
        return;
    }

    const playing = !áudio.paused && !áudio.ended;
    player.classList.toggle('playing', playing);
    button.innerHTML = `<i data-lucide="${playing ? 'pause' : 'play'}"></i>`;
    button.setAttribute('aria-label', playing ? 'Pausar áudio' : 'Reproduzir áudio');
    paintIcons();
}

function formatAudioDuration(value) {
    const totalSeconds = Math.max(0, Math.floor(value || 0));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function renderQuickPanel() {
    const panel = $('#quickPanel');
    if (!panel) {
        return;
    }

    panel.innerHTML = `
        <nav class="quick-tabs" aria-label="Atalhos de mensagem">
            <button class="${state.quickTab === 'emoji' ? 'active' : ''}" type="button" data-quick-tab="emoji">Emoji</button>
            <button class="${state.quickTab === 'stickers' ? 'active' : ''}" type="button" data-quick-tab="stickers">Figurinhas</button>
            <button class="${state.quickTab === 'gifs' ? 'active' : ''}" type="button" data-quick-tab="gifs">GIF</button>
        </nav>
        <div class="quick-content">
            ${quickPanelContent()}
        </div>
    `;
}

async function loadEmojiCatalog() {
    if (state.emojiCatalog || state.emojiCatalogLoading) {
        return;
    }

    state.emojiCatalogLoading = true;
    try {
        const response = await fetch(UNICODE_EMOJI_CHART_URL, {
            cache: 'force-cache',
            credentials: 'same-origin',
        });
        if (!response.ok) {
            throw new Error(`Emoji catalog request failed: ${response.status}`);
        }

        state.emojiGroups = parseUnicodeEmojiChart(await response.text());
        if (!state.emojiGroups.length) {
            throw new Error('Unicode emoji chart did not include parsed emoji.');
        }

        state.emojiCatalog = state.emojiGroups.flatMap((group) => group.emojis || []);
        if (state.emojiActiveGroup !== 'recent' && !state.emojiGroups.some((group) => group.slug === state.emojiActiveGroup)) {
            state.emojiActiveGroup = state.emojiGroups[0]?.slug || '';
        }
    } catch {
        state.emojiGroups = fallbackEmojiGroups();
        state.emojiCatalog = state.emojiGroups.flatMap((group) => group.emojis || []);
        state.emojiActiveGroup = state.emojiGroups[0]?.slug || '';
    } finally {
        state.emojiCatalogLoading = false;
        if ($('#quickPanel') && state.quickTab === 'emoji') {
            renderQuickPanel();
        }
    }
}

function parseUnicodeEmojiChart(html) {
    const documentHtml = new DOMParser().parseFromString(html, 'text/html');
    const rows = Array.from(documentHtml.querySelectorAll('table tr'));
    const groups = [];
    let activeGroup = null;
    let activeSubgroup = '';

    rows.forEach((row) => {
        const groupHeader = row.querySelector('th.bighead');
        if (groupHeader) {
            const name = groupHeader.textContent.trim();
            activeGroup = {
                name,
                slug: emojiSlug(name),
                icon: '',
                iconImage: '',
                emojis: [],
            };
            groups.push(activeGroup);
            activeSubgroup = '';
            return;
        }

        const subgroupHeader = row.querySelector('th.mediumhead');
        if (subgroupHeader) {
            activeSubgroup = subgroupHeader.textContent.trim();
            return;
        }

        const cells = Array.from(row.querySelectorAll('td'));
        const codeCell = row.querySelector('td.code');
        const sampleCell = cells[3];
        const sampleImage = sampleCell?.querySelector('img[src^="data:image"]');
        if (!activeGroup || !codeCell || !sampleImage) {
            return;
        }

        const emoji = sampleImage.alt || row.querySelector('td.chars')?.textContent.trim() || '';
        const image = (sampleImage.getAttribute('src') || '').replace(/\s+/g, '');
        const name = cells[cells.length - 1]?.textContent.replace(/^⊛\s*/, '').trim() || emoji;
        if (!emoji || !image || name === 'subtotal') {
            return;
        }

        const item = {
            emoji,
            image,
            name,
            slug: emojiSlug(name),
            group: activeGroup.name,
            subgroup: activeSubgroup,
            code: codeCell.textContent.replace(/\s+/g, ' ').trim(),
        };

        activeGroup.emojis.push(item);
        if (!activeGroup.iconImage) {
            activeGroup.icon = emoji;
            activeGroup.iconImage = image;
        }
    });

    return groups.filter((group) => group.emojis.length);
}

function emojiSearchText(item) {
    return normalize(`${item.emoji || ''} ${item.name || ''} ${item.slug || ''} ${item.group || ''} ${item.subgroup || ''} ${item.code || ''}`);
}

function emojiSlug(value) {
    return normalize(value).replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function fallbackEmojiGroups() {
    return [{
        name: 'Smileys & Emotion',
        slug: 'smileys-emotion',
        icon: SERVICE_EMOJIS[0]?.char || '🙂',
        iconImage: '',
        emojis: SERVICE_EMOJIS.map((emoji) => ({
            emoji: emoji.char,
            image: '',
            name: emoji.char,
            slug: emoji.code,
            group: 'Smileys & Emotion',
            subgroup: 'fallback',
            code: emoji.code,
        })),
    }];
}

function quickPanelContent() {
    if (state.quickTab === 'emoji') {
        ensureRecentEmojis();
        if (!state.emojiCatalog) {
            loadEmojiCatalog();
        }
        const fallback = SERVICE_EMOJIS.map((emoji) => ({ emoji: emoji.char, name: emoji.char }));
        const catalog = state.emojiCatalog || fallback;
        const query = normalize(state.emojiSearchQuery.trim());
        const activeGroup = state.emojiGroups?.find((group) => group.slug === state.emojiActiveGroup);
        const recentItems = state.emojiRecent.map((emoji) => catalog.find((item) => item.emoji === emoji) || ({ emoji, name: emoji }));
        const emojis = query
            ? catalog.filter((item) => emojiSearchText(item).includes(query))
            : (state.emojiActiveGroup === 'recent' ? recentItems : (activeGroup?.emojis || catalog));
        const groups = state.emojiGroups || [];
        const groupIcons = {
            'smileys-emotion': '😀',
            'people-body': '🧑',
            'animals-nature': '🐻',
            'food-drink': '🍔',
            'travel-places': '🚗',
            activities: '⚽',
            objects: '💡',
            symbols: '💟',
            flags: '🏳️',
        };
        return `
            <label class="emoji-search quick-search">
                <i data-lucide="search"></i>
                <input type="search" data-emoji-search placeholder="Pesquisar emoji" value="${escapeAttr(state.emojiSearchQuery)}" autocomplete="off">
            </label>
            <div class="emoji-category-tabs" role="tablist" aria-label="Categorias de emoji">
                <button class="emoji-category-tab ${!query && state.emojiActiveGroup === 'recent' ? 'active' : ''}" type="button" data-emoji-group="recent" title="Usados recentemente" aria-label="Usados recentemente">
                    <i data-lucide="history"></i>
                </button>
                ${groups.map((group) => `
                    <button class="emoji-category-tab ${!query && group.slug === state.emojiActiveGroup ? 'active' : ''}" type="button" data-emoji-group="${escapeAttr(group.slug)}" title="${escapeAttr(group.name)}" aria-label="${escapeAttr(group.name)}">
                        ${group.iconImage
                            ? `<img class="emoji-category-icon" src="${escapeAttr(group.iconImage)}" alt="">`
                            : (groupIcons[group.slug] || group.icon || '🙂')}
                    </button>
                `).join('')}
            </div>
            ${!emojis.length ? `<div class="quick-status">${state.emojiActiveGroup === 'recent' && !query ? 'Nenhum emoji usado recentemente.' : 'Nenhum emoji encontrado.'}</div>` : ''}
            <div class="quick-grid">
                ${emojis.map((item) => `
                    <button class="quick-item emoji-image-button" type="button" data-emoji="${escapeAttr(item.emoji)}" aria-label="Inserir ${escapeAttr(item.name)}" title="${escapeAttr(item.name)}">
                        ${item.image
                            ? `<img class="emoji-sample-image" src="${escapeAttr(item.image)}" alt="${escapeAttr(item.emoji)}">`
                            : item.emoji}
                    </button>
                `).join('')}
            </div>
        `;
    }

    if (state.quickTab === 'gifs') {
        const searched = state.gifSearchQuery.trim().length >= 2;
        const items = searched ? state.gifSearchResults : SERVICE_QUICK_MEDIA.gifs;
        return `
            <label class="quick-search">
                <i data-lucide="search"></i>
                <input type="search" data-gif-search placeholder="Pesquisar GIF" value="${escapeAttr(state.gifSearchQuery)}" autocomplete="off">
            </label>
            ${state.gifSearching ? '<div class="quick-status">Buscando GIFs...</div>' : ''}
            ${searched && !state.gifSearching && !items.length ? '<div class="quick-status">Nenhum GIF encontrado.</div>' : ''}
            <div class="quick-media-grid">
                ${items.map((item, index) => `
                    <button class="quick-media" type="button" ${searched ? `data-gif-result="${index}"` : `data-quick-media="${item.id}"`}>
                        <img src="${item.src}" alt="${escapeAttr(item.label)}">
                        <span>${escapeHtml(item.label)}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    const items = SERVICE_QUICK_MEDIA[state.quickTab] || [];
    const customBlock = state.quickTab === 'stickers' ? `
        <div class="quick-upload-row">
            <label class="quick-upload">
                <i data-lucide="upload"></i>
                <span>Subir figurinha</span>
                <input class="hidden" type="file" accept="image/*,.gif" data-sticker-upload>
            </label>
        </div>
        ${state.customStickers.length ? `
            <strong class="quick-section-title">Minhas figurinhas</strong>
            <div class="quick-media-grid">
                ${state.customStickers.map((item) => `
                    <button class="quick-media custom-sticker" type="button" data-custom-sticker="${item.id}" title="Enviar. Segure para remover.">
                        <img src="${item.media_url}" alt="${escapeAttr(item.label)}">
                        <span>${escapeHtml(item.label)}</span>
                    </button>
                `).join('')}
            </div>
        ` : ''}
    ` : '';

    return `
        ${customBlock}
        <div class="quick-media-grid">
            ${items.map((item) => `
                <button class="quick-media" type="button" data-quick-media="${item.id}">
                    <img src="${item.src}" alt="${escapeAttr(item.label)}">
                    <span>${escapeHtml(item.label)}</span>
                </button>
            `).join('')}
        </div>
    `;
}

function toggleQuickPanel() {
    const panel = $('#quickPanel');
    const shouldOpen = panel.classList.contains('hidden');
    panel.classList.toggle('hidden', !shouldOpen);
    $('#quickToggle').classList.toggle('active', shouldOpen);
    if (shouldOpen) {
        renderQuickPanel();
        paintIcons();
        if (state.quickTab === 'stickers') {
            ensureCustomStickers();
        }
    }
}

function closeQuickPanel() {
    const panel = $('#quickPanel');
    if (!panel) {
        return;
    }
    panel.classList.add('hidden');
    $('#quickToggle')?.classList.remove('active');
}

function startStickerHold(event) {
    const button = event.target.closest('[data-custom-sticker]');
    if (!button) {
        return;
    }

    cancelStickerHold();
    const stickerId = Number(button.dataset.customSticker);
    state.stickerHoldTargetId = stickerId;
    button.classList.add('holding');
    state.stickerHoldTimer = setTimeout(() => {
        state.stickerHoldTimer = null;
        state.stickerSuppressClickUntil = Date.now() + 900;
        button.classList.remove('holding');
        removeCustomSticker(stickerId).catch((error) => toast(error.message));
    }, 650);
}

function cancelStickerHold() {
    if (state.stickerHoldTimer) {
        clearTimeout(state.stickerHoldTimer);
        state.stickerHoldTimer = null;
    }
    state.stickerHoldTargetId = 0;
    $('#quickPanel')?.querySelectorAll('.quick-media.holding').forEach((button) => {
        button.classList.remove('holding');
    });
}

function preventStickerContextMenu(event) {
    if (event.target.closest('[data-custom-sticker]')) {
        event.preventDefault();
    }
}

async function handleQuickPanelClick(event) {
    event.stopPropagation();
    const tab = event.target.closest('[data-quick-tab]');
    if (tab) {
        state.quickTab = tab.dataset.quickTab;
        renderQuickPanel();
        paintIcons();
        if (state.quickTab === 'stickers') {
            await ensureCustomStickers();
        }
        return;
    }

    const emojiButton = event.target.closest('[data-emoji]');
    if (emojiButton) {
        insertEmoji(emojiButton.dataset.emoji);
        return;
    }

    const emojiGroup = event.target.closest('[data-emoji-group]');
    if (emojiGroup) {
        state.emojiActiveGroup = emojiGroup.dataset.emojiGroup;
        state.emojiSearchQuery = '';
        renderQuickPanel();
        paintIcons();
        return;
    }

    const mediaButton = event.target.closest('[data-quick-media]');
    if (mediaButton) {
        const item = findQuickMedia(mediaButton.dataset.quickMedia);
        if (item) {
            await sendQuickMedia(item);
        }
        return;
    }

    const gifResultButton = event.target.closest('[data-gif-result]');
    if (gifResultButton) {
        const item = state.gifSearchResults[Number(gifResultButton.dataset.gifResult)];
        if (item) {
            await sendQuickMedia(item);
        }
        return;
    }

    const customButton = event.target.closest('[data-custom-sticker]');
    if (customButton) {
        if (Date.now() < state.stickerSuppressClickUntil) {
            return;
        }
        await sendCustomSticker(Number(customButton.dataset.customSticker));
    }
}

function insertEmoji(emoji) {
    const input = $('#messageInput');
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.value = `${input.value.slice(0, start)}${emoji}${input.value.slice(end)}`;
    const cursor = start + emoji.length;
    input.setSelectionRange(cursor, cursor);
    input.focus();
    input.dispatchEvent(new Event('input', { bubbles: true }));
    addRecentEmoji(emoji);
}

function recentEmojiStorageKey() {
    return `NexoMessageRecentEmojis:${state.user?.id || 'guest'}`;
}

function ensureRecentEmojis() {
    const userKey = recentEmojiStorageKey();
    if (state.emojiRecentUser === userKey) {
        return;
    }
    state.emojiRecentUser = userKey;
    try {
        const saved = JSON.parse(localStorage.getItem(userKey) || '[]');
        state.emojiRecent = Array.isArray(saved) ? saved.filter((emoji) => typeof emoji === 'string').slice(0, 24) : [];
    } catch {
        state.emojiRecent = [];
    }
}

function addRecentEmoji(emoji) {
    ensureRecentEmojis();
    state.emojiRecent = [emoji, ...state.emojiRecent.filter((item) => item !== emoji)].slice(0, 24);
    try {
        localStorage.setItem(state.emojiRecentUser, JSON.stringify(state.emojiRecent));
    } catch {
    }
}

function findQuickMedia(id) {
    return SERVICE_QUICK_MEDIA.gifs.find((item) => item.id === id);
}

async function ensureCustomStickers() {
    if (state.stickersLoaded) {
        return;
    }

    try {
        const response = await api('list_stickers');
        state.customStickers = response.stickers;
        state.stickersLoaded = true;
        if (state.quickTab === 'stickers' && !$('#quickPanel').classList.contains('hidden')) {
            renderQuickPanel();
            paintIcons();
        }
    } catch (error) {
        toast(error.message);
    }
}

async function sendQuickMedia(item) {
    if (!state.currentChat) {
        toast('Escolha uma conversa para enviar.');
        return;
    }

    closeQuickPanel();
    try {
        const response = await withLoading(
            () => {
                const form = new FormData();
                form.append('conversation_id', state.currentChat.id);
                form.append('source_url', item.src);
                form.append('label', item.label);
                if (state.replyTo) {
                    form.append('reply_to_message_id', state.replyTo.id);
                }
                return api('send_remote_media', { method: 'POST', body: form });
            },
            state.quickTab === 'gifs' ? 'Enviando GIF...' : 'Enviando figurinha...',
            'Baixando do servico e salvando no seu upload.'
        );
        clearReply();
        appendMessages([response.message_data]);
        $('#messages').scrollTop = $('#messages').scrollHeight;
        await loadChats();
    } catch (error) {
        toast(error.message);
    }
}

async function handleQuickPanelChange(event) {
    const input = event.target.closest('[data-sticker-upload]');
    if (!input || !input.files?.length) {
        return;
    }

    event.stopPropagation();
    await uploadCustomSticker(input.files[0]);
    input.value = '';
}

function handleQuickPanelInput(event) {
    const emojiInput = event.target.closest('[data-emoji-search]');
    if (emojiInput) {
        event.stopPropagation();
        state.emojiSearchQuery = emojiInput.value;
        renderQuickPanel();
        requestAnimationFrame(() => {
            const input = $('#quickPanel [data-emoji-search]');
            input?.focus();
            input?.setSelectionRange(input.value.length, input.value.length);
        });
        return;
    }

    const input = event.target.closest('[data-gif-search]');
    if (!input) {
        return;
    }

    event.stopPropagation();
    state.gifSearchQuery = input.value;
    clearTimeout(state.gifSearchTimer);
    state.gifSearchTimer = setTimeout(() => searchGifs(state.gifSearchQuery), 420);

    if (state.gifSearchQuery.trim().length < 2) {
        state.gifSearchResults = [];
        state.gifSearching = false;
        renderQuickPanel();
        focusGifSearch();
    }
}

async function searchGifs(query) {
    const term = query.trim();
    if (term.length < 2) {
        return;
    }

    state.gifSearching = true;
    renderQuickPanel();
    focusGifSearch();

    try {
        const response = await api(`search_gifs&q=${encodeURIComponent(term)}`);
        if (state.gifSearchQuery.trim() !== term) {
            return;
        }
        state.gifSearchResults = response.gifs || [];
    } catch (error) {
        toast(error.message);
        state.gifSearchResults = [];
    } finally {
        if (state.gifSearchQuery.trim() === term) {
            state.gifSearching = false;
            renderQuickPanel();
            focusGifSearch();
        }
    }
}

function focusGifSearch() {
    requestAnimationFrame(() => {
        const input = $('#quickPanel [data-gif-search]');
        if (!input) {
            return;
        }
        const cursor = input.value.length;
        input.focus();
        input.setSelectionRange(cursor, cursor);
    });
}

async function uploadCustomSticker(file) {
    if (!file.type.startsWith('image/')) {
        toast('A figurinha precisa ser imagem ou GIF.');
        return;
    }

    try {
        const response = await withLoading(
            () => {
                const form = new FormData();
                form.append('sticker', file, file.name);
                form.append('label', file.name.replace(/\.[^.]+$/, ''));
                return api('upload_sticker', { method: 'POST', body: form });
            },
            'Subindo figurinha...',
            'Salvando na sua biblioteca.'
        );
        state.customStickers.unshift(response.sticker);
        state.stickersLoaded = true;
        renderQuickPanel();
        paintIcons();
        toast('Figurinha adicionada.');
    } catch (error) {
        toast(error.message);
    }
}

async function removeCustomSticker(stickerId) {
    const sticker = state.customStickers.find((item) => Number(item.id) === Number(stickerId));
    if (!sticker) {
        return;
    }

    const confirmed = await confirmAction({
        title: 'Remover figurinha?',
        message: `Deseja remover "${sticker.label}" da sua lista de figurinhas?`,
        confirmText: 'Remover',
        danger: true,
    });
    if (!confirmed) {
        return;
    }

    const form = new FormData();
    form.append('sticker_id', String(stickerId));
    try {
        await withLoading(
            () => api('delete_sticker', { method: 'POST', body: form }),
            'Removendo figurinha...',
            'Atualizando sua biblioteca.'
        );
        state.customStickers = state.customStickers.filter((item) => Number(item.id) !== Number(stickerId));
        state.stickersLoaded = true;
        renderQuickPanel();
        paintIcons();
        toast('Figurinha removida.');
    } catch (error) {
        toast(error.message);
    }
}

async function sendCustomSticker(stickerId) {
    if (!state.currentChat) {
        toast('Escolha uma conversa para enviar.');
        return;
    }

    closeQuickPanel();
    try {
        const response = await withLoading(
            () => {
                const form = new FormData();
                form.append('conversation_id', state.currentChat.id);
                form.append('sticker_id', String(stickerId));
                if (state.replyTo) {
                    form.append('reply_to_message_id', state.replyTo.id);
                }
                return api('send_sticker', { method: 'POST', body: form });
            },
            'Enviando figurinha...',
            'Preparando sua figurinha.'
        );
        clearReply();
        appendMessages([response.message_data]);
        $('#messages').scrollTop = $('#messages').scrollHeight;
        await loadChats();
    } catch (error) {
        toast(error.message);
    }
}

async function sendMessage() {
    if (!state.currentChat) {
        return;
    }
    if (!groupCanSendClient(state.currentChat)) {
        toast('Somente admins podem enviar mensagens neste grupo.');
        return;
    }

    const input = $('#messageInput');
    const text = input.value.trim();
    const selectedFiles = state.selectedFiles.length ? [...state.selectedFiles] : (state.selectedFile ? [state.selectedFile] : []);
    if (state.editingMessage) {
        if (!text || selectedFiles.length) {
            toast('A edição aceita apenas texto.');
            return;
        }
        if (!navigator.onLine) {
            toast('Conecte-se à internet para editar a mensagem.');
            return;
        }

        const form = new FormData();
        form.append('message_id', state.editingMessage.id);
        form.append('body', text);
        try {
            const response = await api('edit_message', { method: 'POST', body: form });
            if (response.message_data) {
                state.messageById.set(Number(response.message_data.id), response.message_data);
                renderMessagesFromState();
            }
            input.value = '';
            autoResizeComposer(input);
            clearReply();
            clearLinkPreview();
            toggleSendButton();
            toast('Mensagem editada.');
        } catch (error) {
            toast(error.message);
        }
        return;
    }

    if (!text && !selectedFiles.length) {
        return;
    }

    const blockedReason = selectedFiles.map(blockedUploadReason).find(Boolean);
    if (blockedReason) {
        toast(blockedReason);
        clearAttachment();
        return;
    }

    if (!navigator.onLine) {
        if (selectedFiles.length) {
            toast('Mídias precisam de internet para fazer upload.');
            updateCurrentHeaderStatus();
            return;
        }

        queueOfflineMessage(text);
        return;
    }

    // Evita salvar somente a URL quando o usuário envia imediatamente após
    // colá-la e a prévia ainda está sendo carregada.
    const messageUrl = extractFirstUrl(text);
    if (messageUrl && !state.linkPreviewDismissed && state.linkPreviewUrl !== messageUrl) {
        state.linkPreviewUrl = messageUrl;
        state.linkPreview = null;
        renderLinkPreviewComposer(true);
    }
    if (messageUrl && !state.linkPreviewDismissed && !state.linkPreview) {
        clearTimeout(state.linkPreviewTimer);
        await fetchLinkPreview(messageUrl);
    }

    const responses = [];
    const uploadMessageIds = [];
    try {
        if (selectedFiles.length) {
            for (const [index, selectedFile] of selectedFiles.entries()) {
                const form = new FormData();
                form.append('conversation_id', state.currentChat.id);
                form.append('body', index === 0 ? text : '');
                if (index === 0) {
                    appendLinkPreviewField(form);
                }
                if (state.replyTo && index === 0) {
                    form.append('reply_to_message_id', state.replyTo.id);
                }
                const mediaFile = await prepareMediaFile(selectedFile);
                form.append('media', mediaFile, mediaFile.name);
                form.append('media_quality', imageQualityApplies(selectedFile) ? state.imageQuality : 'original');
                const uploadMessageId = appendUploadProgressMessage(selectedFile, index === 0 ? text : '');
                uploadMessageIds.push(uploadMessageId);
                const response = await apiWithUploadProgress('send_message', form, (percent) => {
                    updateUploadProgressMessage(uploadMessageId, percent);
                });
                responses.push(response);
            }
        } else {
            const form = new FormData();
            form.append('conversation_id', state.currentChat.id);
            form.append('body', text);
            appendLinkPreviewField(form);
            if (state.replyTo) {
                form.append('reply_to_message_id', state.replyTo.id);
            }
            const response = await withLoading(
                () => api('send_message', { method: 'POST', body: form }),
                'Enviando mensagem...',
                'Só um instante.'
            );
            responses.push(response);
        }
    } catch (error) {
        uploadMessageIds.forEach(removeMessage);
        if (!selectedFiles.length && isNetworkError(error)) {
            queueOfflineMessage(text);
            return;
        }

        toast(error.message);
        return;
    }
    input.value = '';
    autoResizeComposer(input);
    clearReply();
    clearAttachment();
    clearLinkPreview();
    uploadMessageIds.forEach(removeMessage);
    appendMessages(responses.map((response) => response.message_data).filter(Boolean));
    $('#messages').scrollTop = $('#messages').scrollHeight;
    await loadChats();
    toggleSendButton();
}

function shouldSubmitMessage(event) {
    if (event.key !== 'Enter') {
        return false;
    }

    if (state.user?.enter_send_mode === 'ctrl_enter') {
        return event.ctrlKey || event.metaKey;
    }

    return !event.shiftKey;
}

function handleMessageInput(event) {
    if (state.user?.auto_replace) {
        applyTextReplacements(event.currentTarget);
    }
    autoResizeComposer(event.currentTarget);
    toggleSendButton();
    scheduleLinkPreview(event.currentTarget.value);
}

function extractFirstUrl(value) {
    const match = String(value || '').match(/https?:\/\/[^\s<]+/i);
    return match ? match[0].replace(/[),.;!?]+$/, '') : '';
}

function scheduleLinkPreview(value) {
    const url = extractFirstUrl(value);
    clearTimeout(state.linkPreviewTimer);
    if (!url) {
        state.linkPreview = null;
        state.linkPreviewUrl = '';
        state.linkPreviewDismissed = false;
        renderLinkPreviewComposer();
        return;
    }
    if (state.linkPreviewUrl === url && (state.linkPreview || state.linkPreviewDismissed)) {
        return;
    }

    state.linkPreview = null;
    state.linkPreviewUrl = url;
    state.linkPreviewDismissed = false;
    renderLinkPreviewComposer(true);
    state.linkPreviewTimer = setTimeout(() => fetchLinkPreview(url), 450);
}

async function fetchLinkPreview(url) {
    try {
        const response = await api(`link_preview&url=${encodeURIComponent(url)}`);
        if (state.linkPreviewUrl !== url || extractFirstUrl($('#messageInput')?.value) !== url) {
            return null;
        }
        state.linkPreview = response.preview || null;
        renderLinkPreviewComposer();
        return state.linkPreview;
    } catch {
        if (state.linkPreviewUrl === url) {
            state.linkPreview = null;
            renderLinkPreviewComposer();
        }
        return null;
    }
}

function appendLinkPreviewField(form) {
    if (state.linkPreview && !state.linkPreviewDismissed) {
        form.append('link_preview', JSON.stringify(state.linkPreview));
    }
}

function clearLinkPreview() {
    clearTimeout(state.linkPreviewTimer);
    state.linkPreview = null;
    state.linkPreviewUrl = '';
    state.linkPreviewDismissed = false;
    renderLinkPreviewComposer();
}

function renderLinkPreviewComposer(loading = false) {
    const box = $('#linkPreviewComposer');
    if (!box) {
        return;
    }
    if (!state.linkPreviewUrl || state.linkPreviewDismissed) {
        box.classList.add('hidden');
        box.innerHTML = '';
        return;
    }
    box.classList.remove('hidden');
    box.innerHTML = loading && !state.linkPreview
        ? '<span class="link-preview-loading">Buscando prévia do link...</span>'
        : `${linkPreviewMarkup(state.linkPreview || { url: state.linkPreviewUrl }, true)}<button type="button" class="link-preview-remove" id="removeLinkPreview">Remover prévia</button>`;
    box.querySelector('#removeLinkPreview')?.addEventListener('click', () => {
        state.linkPreviewDismissed = true;
        renderLinkPreviewComposer();
    });
}

function handleMessagePaste(event) {
    const items = Array.from(event.clipboardData?.items || []);
    const imageItem = items.find((item) => item.kind === 'file' && item.type.startsWith('image/'));
    if (!imageItem) {
        return;
    }

    const file = imageItem.getAsFile();
    if (!file) {
        return;
    }

    event.preventDefault();
    state.selectedFile = clipboardImageFile(file);
    state.selectedFiles = [state.selectedFile];
    state.imageQuality = imageQualityApplies(state.selectedFile) ? 'reduced' : 'full';
    renderAttachmentPreview();
    toggleSendButton();
    toast('Imagem colada como anexo.');
}

function clipboardImageFile(file) {
    const extension = ({
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/webp': 'webp',
        'image/gif': 'gif',
    })[file.type] || 'png';
    const name = `imagem-colada-${new Date().toISOString().replace(/[:.]/g, '-')}.${extension}`;
    return new File([file], name, { type: file.type || 'image/png', lastModified: Date.now() });
}

function blockedUploadReason(file) {
    if (!file) {
        return '';
    }

    const fileName = String(file.name || '').toLowerCase();
    const parts = fileName.split('.').filter(Boolean);
    const dangerousPart = parts.find((part) => BLOCKED_UPLOAD_EXTENSIONS.has(part));
    if (dangerousPart) {
        return `Arquivos .${dangerousPart} não podem ser enviados por segurança.`;
    }

    const mime = String(file.type || '').toLowerCase();
    if (
        mime === 'image/svg+xml'
        || mime === 'text/html'
        || mime === 'application/xhtml+xml'
        || mime === 'application/javascript'
        || mime === 'text/javascript'
        || mime === 'text/css'
    ) {
        return 'Este tipo de arquivo pode executar código e foi bloqueado por segurança.';
    }

    return '';
}

function autoResizeComposer(input) {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
}

function applyTextReplacements(input) {
    const replacements = [
        ['-->', '\u2192'],
        ['<--', '\u2190'],
        ['<3', '\u2665'],
    ];
    const original = input.value;
    let value = original;
    replacements.forEach(([from, to]) => {
        value = value.split(from).join(to);
    });

    if (value === original) {
        return;
    }

    const delta = original.length - value.length;
    const cursor = Math.max(0, (input.selectionStart ?? value.length) - delta);
    input.value = value;
    input.setSelectionRange(cursor, cursor);
}

function renderAttachmentPreview() {
    const preview = $('#attachmentPreview');
    const files = state.selectedFiles.length ? state.selectedFiles : (state.selectedFile ? [state.selectedFile] : []);
    if (!files.length) {
        preview.classList.add('hidden');
        preview.innerHTML = '';
        return;
    }

    preview.classList.remove('hidden');
    const hasImageQuality = files.some(imageQualityApplies);
    const qualityControls = hasImageQuality ? `
        <span class="quality-choice" role="group" aria-label="Qualidade da imagem">
            <button class="${state.imageQuality === 'reduced' ? 'active' : ''}" type="button" data-quality="reduced">Reduzida</button>
            <button class="${state.imageQuality === 'full' ? 'active' : ''}" type="button" data-quality="full">Completa</button>
        </span>
    ` : '';
    const label = files.length === 1 ? files[0].name : `${files.length} arquivos selecionados`;

    preview.innerHTML = `
        <i data-lucide="paperclip"></i>
        <span>${escapeHtml(label)}</span>
        ${qualityControls}
        <button type="button" data-remove-attachment aria-label="Remover anexo">&times;</button>
    `;
    preview.querySelector('[data-remove-attachment]').addEventListener('click', clearAttachment);
    preview.querySelectorAll('[data-quality]').forEach((button) => {
        button.addEventListener('click', () => {
            state.imageQuality = button.dataset.quality;
            renderAttachmentPreview();
        });
    });
    paintIcons();
}

function clearAttachment() {
    state.selectedFile = null;
    state.selectedFiles = [];
    state.imageQuality = 'reduced';
    $('#mediaInput').value = '';
    renderAttachmentPreview();
    toggleSendButton();
}

function appendUploadProgressMessage(file, body = '') {
    const message = {
        id: -Date.now(),
        mine: true,
        pending: true,
        uploading: true,
        uploadProgress: 0,
        body,
        media_type: uploadPreviewMediaType(file),
        media_url: '',
        media_name: file.name,
        mime_type: file.type || 'application/octet-stream',
        media_size: file.size,
        reactions: {},
        created_at: new Date().toISOString(),
    };
    appendMessages([message]);
    $('#messages').scrollTop = $('#messages').scrollHeight;
    return message.id;
}

function updateUploadProgressMessage(messageId, percent) {
    const message = state.messageById.get(messageId);
    if (!message) {
        return;
    }

    message.uploadProgress = Math.max(0, Math.min(100, Math.round(percent)));
    const row = document.querySelector(`[data-message-id="${messageId}"]`);
    if (!row) {
        return;
    }

    const small = row.querySelector('.upload-file-card .file-info small');
    if (small) {
        small.textContent = `${formatBytes(message.media_size)} · Enviando ${message.uploadProgress}%`;
    }
    const bar = row.querySelector('.upload-progress-bar');
    if (bar) {
        bar.style.width = `${message.uploadProgress}%`;
    }
}

function uploadPreviewMediaType(file) {
    const mime = String(file?.type || '').toLowerCase();
    if (mime.startsWith('image/')) {
        return mime === 'image/gif' ? 'gif' : 'image';
    }
    if (mime.startsWith('audio/')) {
        return 'audio';
    }
    if (mime.startsWith('video/')) {
        return 'video';
    }
    return 'file';
}

async function toggleVoiceRecording() {
    if (state.isRecording) {
        stopVoiceRecording(true);
        return;
    }

    await startVoiceRecording();
}

async function startVoiceRecording() {
    if (!state.currentChat) {
        toast('Escolha uma conversa para gravar Áudio.');
        return;
    }

    if (!navigator.mediaDevices || !window.MediaRecorder) {
        toast('Seu navegador não permite gravar Áudio aqui.');
        return;
    }

    try {
        state.recordingStream = await requestUserMedia({ audio: true });
    } catch {
        toast('Permita acesso ao microfone para gravar Áudio.');
        return;
    }

    const mimeType = chooseRecorderMimeType();
    state.recordingChunks = [];
    try {
        state.mediaRecorder = new MediaRecorder(state.recordingStream, mimeType ? { mimeType } : undefined);
    } catch {
        state.mediaRecorder = new MediaRecorder(state.recordingStream);
    }
    state.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data && event.data.size > 0) {
            state.recordingChunks.push(event.data);
        }
    });
    state.mediaRecorder.addEventListener('stop', () => finishVoiceRecording());
    state.recordingStartedAt = Date.now();
    state.isRecording = true;
    state.mediaRecorder.start(250);
    renderRecordingState();
    state.recordingTimer = setInterval(updateRecordingTimer, 250);
    state.recordingTimeout = setTimeout(() => stopVoiceRecording(true), 60000);
}

function chooseRecorderMimeType() {
    const types = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4;codecs=mp4a.40.2',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/aac',
    ];
    return types.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

function stopVoiceRecording(send = true) {
    if (!state.mediaRecorder || !state.isRecording) {
        return;
    }

    state.shouldSendRecording = send;
    try {
        if (state.mediaRecorder.state === 'recording') {
            state.mediaRecorder.requestData();
        }
    } catch {
        // Alguns navegadores mobile não permitem requestData perto do stop.
    }
    state.mediaRecorder.stop();
}

function cancelVoiceRecording() {
    if (!state.isRecording) {
        return;
    }

    stopVoiceRecording(false);
    toast('Gravacao cancelada.');
}

async function finishVoiceRecording() {
    const elapsedMs = Math.max(0, Date.now() - (state.recordingStartedAt || Date.now()));
    clearInterval(state.recordingTimer);
    clearTimeout(state.recordingTimeout);
    state.recordingTimer = null;
    state.recordingTimeout = null;
    state.isRecording = false;
    const shouldSend = state.shouldSendRecording;
    state.shouldSendRecording = false;
    stopRecordingStream();
    renderRecordingState();

    if (!shouldSend || !state.recordingChunks.length) {
        state.recordingChunks = [];
        state.mediaRecorder = null;
        return;
    }

    const type = state.recordingChunks[0].type || state.mediaRecorder?.mimeType || 'audio/webm';
    const extension = recorderExtensionFromMime(type);
    const blob = new Blob(state.recordingChunks, { type });
    state.recordingChunks = [];
    state.mediaRecorder = null;

    if (elapsedMs < 700 || blob.size < 200) {
        toast('Áudio muito curto para enviar.');
        return;
    }

    const file = new File([blob], `audio-${Date.now()}.${extension}`, { type });
    await sendVoiceMessage(file);
}

function recorderExtensionFromMime(type) {
    const cleanType = String(type || '').toLowerCase();
    if (cleanType.includes('ogg')) {
        return 'ogg';
    }
    if (cleanType.includes('mp4')) {
        return 'm4a';
    }
    if (cleanType.includes('aac')) {
        return 'aac';
    }
    return 'webm';
}

function stopRecordingStream() {
    if (state.recordingStream) {
        state.recordingStream.getTracks().forEach((track) => track.stop());
        state.recordingStream = null;
    }
}

function renderRecordingState() {
    $('#recordingPreview').classList.toggle('hidden', !state.isRecording);
    $('.message-entry').classList.toggle('hidden', state.isRecording);
    $('#audioShortcut').classList.toggle('recording', state.isRecording);
    $('#audioShortcut').setAttribute('title', state.isRecording ? 'Enviar Áudio' : 'Gravar Áudio');
    if (state.isRecording) {
        closeQuickPanel();
        updateRecordingTimer();
    }
    paintIcons();
}

function updateRecordingTimer() {
    const elapsed = Math.min(60, Math.floor((Date.now() - state.recordingStartedAt) / 1000));
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    $('#recordingTimer').textContent = `${minutes}:${seconds}`;
}

async function sendVoiceMessage(file) {
    if (!state.currentChat) {
        return;
    }

    const form = new FormData();
    form.append('conversation_id', state.currentChat.id);
    form.append('body', '');
    if (state.replyTo) {
        form.append('reply_to_message_id', state.replyTo.id);
    }
    form.append('media', file, file.name);
    form.append('media_quality', 'original');

    try {
        const response = await withLoading(
            () => api('send_message', { method: 'POST', body: form }),
            'Enviando Áudio...',
            'Enviando a gravação.'
        );
        clearReply();
        appendMessages([response.message_data]);
        $('#messages').scrollTop = $('#messages').scrollHeight;
        await loadChats();
        toast('Áudio enviado.');
    } catch (error) {
        toast(error.message);
    }
}

function imageQualityApplies(file) {
    return file && file.type.startsWith('image/') && file.type !== 'image/gif';
}

async function prepareMediaFile(file) {
    if (!imageQualityApplies(file) || state.imageQuality === 'full') {
        return file;
    }

    return compressImage(file);
}

function compressImage(file) {
    return new Promise((resolve) => {
        const image = new Image();
        const reader = new FileReader();

        reader.onload = () => {
            image.onload = () => {
                const maxSide = 1600;
                const ratio = Math.min(1, maxSide / Math.max(image.width, image.height));
                const width = Math.max(1, Math.round(image.width * ratio));
                const height = Math.max(1, Math.round(image.height * ratio));
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        resolve(file);
                        return;
                    }

                    const baseName = file.name.replace(/\.[^.]+$/, '');
                    const reduced = new File([blob], `${baseName}-reduzida.jpg`, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(reduced.size < file.size ? reduced : file);
                }, 'image/jpeg', 0.82);
            };
            image.onerror = () => resolve(file);
            image.src = reader.result;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
    });
}

function toggleSendButton() {
    const hasContent = $('#messageInput').value.trim() || state.selectedFile;
    $('#sendButton').classList.toggle('hidden', !hasContent);
    $('#audioShortcut').classList.toggle('hidden', Boolean(hasContent));
}

function renderProfilePanel(chat) {
    if (!chat) {
        return;
    }

    if (chat.type === 'group') {
        renderGroupProfilePanel(chat);
        return;
    }

    const panel = $('#profilePanel');
    panel.classList.remove('hidden');
    panel.innerHTML = `
        <header class="panel-header">
            <button class="icon-button" type="button" data-close-panel aria-label="Fechar"><i data-lucide="x"></i></button>
            <strong>${chat.type === 'saved' ? 'Mensagens Salvas' : 'Informações do usuário'}</strong>
        </header>
        <div class="profile-content profile-info-content">
            <div class="profile-hero">
                ${avatarMarkup(chat)}
                <div>
                    <strong>${escapeHtml(chat.name)}</strong>
                    <span>${chat.status === 'online' ? 'online' : 'visto recentemente'}</span>
                </div>
            </div>
            ${chat.type === 'saved' ? '' : profileContactCard(chat)}
            ${profileSharedTabs(chat)}
        </div>
    `;
    panel.querySelector('[data-close-panel]').addEventListener('click', closeProfilePanel);
    bindProfileTabs(panel, chat);
    paintIcons();
}

function profileContactCard(chat) {
    if (chat.type === 'group') {
        return `<section class="profile-contact-card profile-group-notifications">
            <div class="profile-contact-row">
                <i data-lucide="bell"></i>
                <strong>Notificações</strong>
                <button class="profile-switch is-on" type="button" aria-label="Alternar notificações"><span></span></button>
            </div>
        </section>`;
    }
    return `<section class="profile-contact-card">
        <div class="profile-contact-row">
            <i data-lucide="at-sign"></i>
            <div><strong>${escapeHtml(chat.nick ? chat.nick : chat.name)}</strong><small>Nome de usuário</small></div>
            <button class="profile-qr-button" type="button" data-profile-qr aria-label="Mostrar QR Code do usuário" title="Mostrar QR Code do usuário"><i data-lucide="qr-code"></i></button>
        </div>
        <div class="profile-contact-row">
            <i data-lucide="bell"></i>
            <strong>Notificações</strong>
            <button class="profile-switch is-on" type="button" aria-label="Alternar notificações"><span></span></button>
        </div>
    </section>`;
}

function profileSharedTabs(chat) {
    const tabs = [
        ['stories', 'Histórias'],
        ['media', 'Mídias'],
        ['files', 'Arquivos'],
        ['links', 'Links'],
    ];
    return `<section class="profile-shared">
        <nav class="profile-tabs" aria-label="Conteúdo compartilhado">
            ${tabs.map(([key, label], index) => `<button type="button" class="profile-tab${index === 0 ? ' active' : ''}" data-profile-tab="${key}">${label}</button>`).join('')}
        </nav>
        <div class="profile-shared-content" data-profile-content="stories">
            <span class="profile-empty">Sem histórias</span>
        </div>
    </section>`;
}

function bindProfileTabs(panel, chat) {
    panel.querySelector('[data-profile-qr]')?.addEventListener('click', () => openQrModalForPerson(chat));
    panel.querySelectorAll('.profile-switch').forEach((button) => {
        button.addEventListener('click', () => {
            button.classList.toggle('is-on');
        });
    });
    panel.querySelectorAll('[data-profile-tab]').forEach((button) => {
        button.addEventListener('click', () => {
            panel.querySelectorAll('[data-profile-tab]').forEach((item) => item.classList.toggle('active', item === button));
            const content = panel.querySelector('[data-profile-content]');
            content.innerHTML = profileSharedContent(button.dataset.profileTab, chat);
            paintIcons();
        });
    });
}

function profileSharedContent(tab, chat) {
    const messages = Array.from(state.messageById.values()).filter((message) => message.conversation_id === chat.id || !message.conversation_id);
    if (tab === 'stories') {
        return '<span class="profile-empty">Nenhuma história</span>';
    }
    if (tab === 'media') {
        const media = messages.filter((message) => ['image', 'gif', 'video'].includes(normalizedMediaType(message)) && message.media_url);
        return media.length ? `<div class="profile-media-grid">${media.map((message) => `<button type="button" class="profile-media-item" data-open-media="${message.id}"><img src="${escapeAttr(message.media_url)}" alt="${escapeAttr(message.media_name || 'Mídia')}"></button>`).join('')}</div>` : '<span class="profile-empty">Nenhuma mídia compartilhada</span>';
    }
    if (tab === 'files') {
        const files = messages.filter((message) => normalizedMediaType(message) === 'file');
        return files.length ? `<div class="profile-file-list">${files.map((message) => `<a class="profile-file-item" href="${escapeAttr(message.media_url || '#')}" target="_blank" download><span class="profile-file-icon">${escapeHtml(fileExtensionLabel(message.media_name || 'arquivo'))}</span><span><strong>${escapeHtml(message.media_name || 'Arquivo')}</strong><small>${formatBytes(message.media_size)}</small></span></a>`).join('')}</div>` : '<span class="profile-empty">Nenhum arquivo compartilhado</span>';
    }
    const links = messages.flatMap((message) => [...String(message.body || '').matchAll(/https?:\/\/[^\s<]+/g)].map((match) => match[0].replace(/[),.;]+$/, '')));
    return links.length ? `<div class="profile-link-list">${links.map((url) => `<a href="${escapeAttr(url)}" target="_blank" rel="noopener"><span class="profile-link-icon">L</span><span><strong>${escapeHtml(new URL(url).hostname)}</strong><small>${escapeHtml(url)}</small></span></a>`).join('')}</div>` : '<span class="profile-empty">Nenhum link compartilhado</span>';
}

async function renderGroupProfilePanel(chat) {
    const panel = $('#profilePanel');
    panel.classList.remove('hidden');
    panel.innerHTML = `
        <header class="panel-header">
            <button class="icon-button" type="button" data-close-panel aria-label="Fechar"><i data-lucide="x"></i></button>
            <strong>Informações do grupo</strong>
        </header>
        <div class="profile-content"><span class="muted-text">Carregando grupo...</span></div>
    `;
    panel.querySelector('[data-close-panel]').addEventListener('click', closeProfilePanel);
    paintIcons();

    try {
        const response = await api(`group_details&conversation_id=${chat.id}`);
        renderGroupProfileContent(response);
    } catch (error) {
        panel.querySelector('.profile-content').innerHTML = `<span class="muted-text">${escapeHtml(error.message)}</span>`;
    }
}

function renderGroupProfileContent(data) {
    const panel = $('#profilePanel');
    const group = data.group;
    const permissions = data.permissions || {};
    const members = Array.isArray(data.members) ? data.members : [];
    const candidates = Array.isArray(data.candidates) ? data.candidates : [];
    const canManage = Boolean(permissions.can_manage);
    const canDelete = Boolean(permissions.can_delete);
    panel.innerHTML = `
        <header class="panel-header">
            <button class="icon-button" type="button" data-close-panel aria-label="Fechar"><i data-lucide="x"></i></button>
            <strong>Informações do grupo</strong>
        </header>
        <div class="profile-content profile-info-content group-profile-content">
            <div class="profile-hero">
                ${avatarMarkup(group)}
                <div>
                    <strong>${escapeHtml(group.name)}</strong>
                    <span>${escapeHtml(group.description || `${members.length || 1} participante(s)`)}</span>
                </div>
            </div>
            ${profileContactCard(group)}
            ${canManage ? groupEditFormMarkup(group) : groupParticipantNoticeMarkup(permissions.role)}
            <section class="settings-card group-admin-list-card">
                <strong>Participantes</strong>
                <small class="muted-text">${members.length} participante(s)</small>
                <div class="group-admin-list">
                    ${members.map((member) => groupMemberRowMarkup(member, canManage, permissions.role)).join('')}
                </div>
            </section>
            ${canManage ? groupAddMembersMarkup(candidates) : ''}
            ${canDelete ? groupDeleteMarkup() : ''}
            ${profileSharedTabs(group)}
        </div>
    `;

    panel.querySelector('[data-close-panel]').addEventListener('click', closeProfilePanel);
    panel.querySelector('#groupEditForm')?.addEventListener('submit', saveGroupInfo);
    panel.querySelector('#groupAddMembersForm')?.addEventListener('submit', addGroupMembers);
    panel.querySelector('[data-delete-group]')?.addEventListener('click', deleteCurrentGroup);
    panel.querySelectorAll('[data-group-role]').forEach((button) => {
        button.addEventListener('click', () => updateGroupMemberRole(Number(button.dataset.memberId), button.dataset.groupRole));
    });
    panel.querySelectorAll('[data-remove-group-member]').forEach((button) => {
        button.addEventListener('click', () => removeGroupMember(Number(button.dataset.removeGroupMember)));
    });
    bindProfileTabs(panel, group);
    paintIcons();
}

function groupParticipantNoticeMarkup(role) {
    return `
        <section class="settings-card group-permission-card">
            <strong>Você está como ${escapeHtml(groupRoleLabel(role))}</strong>
            <small class="muted-text">Somente admins do grupo podem alterar nome, foto, descrição, participantes e permissões.</small>
        </section>
    `;
}

function groupEditFormMarkup(group) {
    return `
        <form class="settings-card profile-form" id="groupEditForm">
            <strong>Informações do grupo</strong>
            <input type="hidden" name="conversation_id" value="${group.id}">
            <label>Nome do grupo <input name="title" value="${escapeAttr(group.name)}" maxlength="140" required></label>
            <label>Descricao <textarea name="description" rows="3" maxlength="2000" placeholder="Descricao do grupo">${escapeHtml(group.description || '')}</textarea></label>
            <label>Foto do grupo <input name="avatar" type="file" accept="image/*,.gif"></label>
            <label>Quem pode enviar mensagens
                <select name="messages_policy">
                    <option value="all" ${group.messages_policy !== 'admins' ? 'selected' : ''}>Todos os participantes</option>
                    <option value="admins" ${group.messages_policy === 'admins' ? 'selected' : ''}>Somente admins</option>
                </select>
            </label>
            <button class="primary-button" type="submit">Salvar grupo</button>
        </form>
    `;
}

function groupMemberRowMarkup(member, canManage, myRole) {
    const canChange = canManage && member.role !== 'owner' && member.id !== state.user?.id;
    const nextRole = member.role === 'admin' ? 'member' : 'admin';
    return `
        <div class="group-admin-row">
            ${avatarMarkup(member)}
            <span>
                <strong>${escapeHtml(member.name)}</strong>
                <small>${member.nick ? '@' + escapeHtml(member.nick) + ' · ' : ''}${groupRoleLabel(member.role)}</small>
            </span>
            ${canChange ? `
                <button class="secondary-button compact-button" type="button" data-member-id="${member.id}" data-group-role="${nextRole}">
                    ${member.role === 'admin' ? 'Virar participante' : 'Virar admin'}
                </button>
                <button class="icon-button danger" type="button" data-remove-group-member="${member.id}" aria-label="Remover participante"><i data-lucide="user-minus"></i></button>
            ` : ''}
        </div>
    `;
}

function groupAddMembersMarkup(candidates) {
    return `
        <form class="settings-card profile-form" id="groupAddMembersForm">
            <strong>Adicionar participantes</strong>
            ${candidates.length ? `
                <div class="group-member-list">
                    ${candidates.map((user) => `
                        <label class="group-member-row">
                            <input type="checkbox" name="member_ids[]" value="${user.id}">
                            ${avatarMarkup(user)}
                            <span>
                                <strong>${escapeHtml(user.name)}</strong>
                                <small>${user.nick ? '@' + escapeHtml(user.nick) : escapeHtml(user.phone || 'Conversa ativa')}</small>
                            </span>
                        </label>
                    `).join('')}
                </div>
                <button class="primary-button" type="submit">Adicionar selecionados</button>
            ` : '<span class="muted-text">Nenhum usuário disponivel nas conversas ativas.</span>'}
        </form>
    `;
}

function groupDeleteMarkup() {
    return `
        <section class="settings-card group-danger-card">
            <strong>Zona de perigo</strong>
            <small class="muted-text">Somente o criador pode apagar o grupo para todos os participantes.</small>
            <button class="danger-button" type="button" data-delete-group><i data-lucide="trash-2"></i>Apagar grupo</button>
        </section>
    `;
}

function groupRoleLabel(role) {
    if (role === 'owner') {
        return 'Criador / admin do grupo';
    }
    if (role === 'admin') {
        return 'Admin do grupo';
    }
    return 'Participante';
}

async function reloadGroupProfile() {
    if (state.currentChat?.type === 'group') {
        await loadChats();
        const updated = state.chats.find((chat) => chat.id === state.currentChat.id);
        if (updated) {
            state.currentChat = updated;
        }
        await renderGroupProfilePanel(state.currentChat);
        renderChats();
        updateHeaderStatus(state.currentChat);
        $('#headerName').textContent = state.currentChat.name;
        $('#headerAvatar').outerHTML = avatarMarkup(state.currentChat, 'headerAvatar');
    }
}

async function saveGroupInfo(event) {
    event.preventDefault();
    try {
        await withLoading(
            () => api('update_group', { method: 'POST', body: new FormData(event.currentTarget) }),
            'Salvando grupo...',
            'Atualizando informações.'
        );
        toast('Grupo atualizado.');
        await reloadGroupProfile();
    } catch (error) {
        toast(error.message);
    }
}

async function addGroupMembers(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!form.getAll('member_ids[]').length) {
        toast('Selecione pelo menos um usuário.');
        return;
    }
    form.append('conversation_id', state.currentChat.id);
    try {
        await api('add_group_members', { method: 'POST', body: form });
        toast('Participantes adicionados.');
        await reloadGroupProfile();
    } catch (error) {
        toast(error.message);
    }
}

async function updateGroupMemberRole(memberId, role) {
    const form = new FormData();
    form.append('conversation_id', state.currentChat.id);
    form.append('member_id', memberId);
    form.append('role', role);
    try {
        await api('update_group_member_role', { method: 'POST', body: form });
        toast(role === 'admin' ? 'Participante virou admin.' : 'Admin virou participante.');
        await reloadGroupProfile();
    } catch (error) {
        toast(error.message);
    }
}

async function removeGroupMember(memberId) {
    const confirmed = await confirmAction({
        title: 'Remover participante?',
        message: 'Esta pessoa sera removida do grupo.',
        confirmText: 'Remover',
        danger: true,
    });
    if (!confirmed) {
        return;
    }
    const form = new FormData();
    form.append('conversation_id', state.currentChat.id);
    form.append('member_id', memberId);
    try {
        await api('remove_group_member', { method: 'POST', body: form });
        toast('Participante removido.');
        await reloadGroupProfile();
    } catch (error) {
        toast(error.message);
    }
}

async function deleteCurrentGroup() {
    const confirmed = await confirmAction({
        title: 'Apagar grupo?',
        message: 'O grupo e todas as mensagens serao apagados para todos os participantes.',
        confirmText: 'Apagar grupo',
        danger: true,
    });
    if (!confirmed) {
        return;
    }
    const form = new FormData();
    form.append('conversation_id', state.currentChat.id);
    try {
        await api('delete_group', { method: 'POST', body: form });
        toast('Grupo apagado.');
        closeProfilePanel();
        state.currentChat = null;
        $('#conversation').classList.add('hidden');
        $('#emptyChat').classList.remove('hidden');
        document.body.classList.remove('chat-open');
        await loadChats();
    } catch (error) {
        toast(error.message);
    }
}

function renderOwnProfilePanel(edit = false) {
    const panel = $('#profilePanel');
    panel.classList.remove('hidden');

    if (edit) {
        panel.innerHTML = `
            <header class="panel-header">
                <button class="icon-button" type="button" data-back-profile aria-label="Voltar"><i data-lucide="arrow-left"></i></button>
                <strong>Editar perfil</strong>
            </header>
            <div class="profile-content">
                <form class="profile-form" id="profileForm">
                    <label class="avatar-upload">
                        ${state.user.avatar_url ? `<img src="${state.user.avatar_url}" alt="">` : `<span>${escapeHtml(state.user.initials)}</span>`}
                        <input class="hidden" name="avatar" type="file" accept="image/*,.gif">
                    </label>
                    <label>Nome <input name="name" value="${escapeAttr(state.user.name)}" required></label>
                    <label>Nick <input name="nick" value="${escapeAttr(state.user.nick)}" required></label>
                    <label>Celular <input name="phone" value="${escapeAttr(state.user.phone)}" required></label>
                    <label>Bio <textarea name="bio" maxlength="180">${escapeHtml(state.user.bio || '')}</textarea></label>
                    <button class="primary-button" type="submit">Salvar perfil</button>
                </form>
            </div>
        `;
        panel.querySelector('[data-back-profile]').addEventListener('click', () => renderOwnProfilePanel(false));
        panel.querySelector('#profileForm').addEventListener('submit', saveProfile);
        paintIcons();
        return;
    }

    panel.innerHTML = `
        <header class="panel-header">
            <button class="icon-button" type="button" data-close-panel aria-label="Fechar"><i data-lucide="x"></i></button>
            <strong>Meu Perfil</strong>
            <button class="icon-button" type="button" data-edit-profile aria-label="Editar"><i data-lucide="pencil"></i></button>
        </header>
        <div class="profile-content">
            <div class="profile-hero">
                ${avatarMarkup(state.user)}
                <div>
                    <strong>${escapeHtml(state.user.name)}</strong>
                    <span>online</span>
                </div>
            </div>
            <div class="info-card">
                ${infoRow('phone', state.user.phone, 'Telefone')}
                ${infoRow('at-sign', '@' + state.user.nick, 'Nome de usuário')}
                ${state.user.email ? infoRow('mail', state.user.email, 'E-mail') : ''}
            </div>
            <section class="settings-card">
                <button class="secondary-button" type="button" data-change-password><i data-lucide="key-round"></i>Alterar senha</button>
            </section>
            ${state.user.bio ? `<div class="info-card">${escapeHtml(state.user.bio)}</div>` : ''}
        </div>
    `;
    panel.querySelector('[data-close-panel]').addEventListener('click', closeProfilePanel);
    panel.querySelector('[data-edit-profile]').addEventListener('click', () => renderOwnProfilePanel(true));
    panel.querySelector('[data-change-password]').addEventListener('click', renderChangePasswordPanel);
    paintIcons();
}

function renderChangePasswordPanel() {
    const panel = $('#profilePanel');
    panel.classList.remove('hidden');
    panel.innerHTML = `
        <header class="panel-header">
            <button class="icon-button" type="button" data-back-profile aria-label="Voltar"><i data-lucide="arrow-left"></i></button>
            <strong>Alterar senha</strong>
        </header>
        <div class="profile-content">
            <form class="profile-form" id="passwordForm">
                <label>Senha atual ${passwordFieldMarkup('current_password', 'current-password')}</label>
                <label>Nova senha ${passwordFieldMarkup('new_password', 'new-password', '6')}</label>
                <label>Confirmar nova senha ${passwordFieldMarkup('confirm_password', 'new-password', '6')}</label>
                <button class="primary-button" type="submit"><i data-lucide="lock-keyhole"></i>Salvar nova senha</button>
            </form>
        </div>
    `;
    panel.querySelector('[data-back-profile]').addEventListener('click', () => renderOwnProfilePanel(false));
    panel.querySelector('#passwordForm').addEventListener('submit', savePassword);
    paintIcons();
}

function passwordFieldMarkup(name, autocomplete, minlength = '') {
    return `
        <span class="password-field">
            <input name="${escapeAttr(name)}" type="password" autocomplete="${escapeAttr(autocomplete)}" ${minlength ? `minlength="${escapeAttr(minlength)}"` : ''} required>
            <button class="password-toggle" type="button" data-toggle-password aria-label="Mostrar senha" title="Mostrar senha">
                <i data-lucide="eye"></i>
            </button>
        </span>
    `;
}

async function savePassword(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    if (String(form.get('new_password') || '') !== String(form.get('confirm_password') || '')) {
        toast('A confirmação da senha não confere.');
        return;
    }

    await withLoading(
        () => api('change_password', { method: 'POST', body: form }),
        'Alterando senha...',
        'Atualizando credenciais da sua conta.'
    );
    toast('Senha alterada com sucesso.');
    renderOwnProfilePanel(false);
}

async function saveProfile(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const avatar = form.get('avatar');

    if (avatar instanceof File && avatar.size > 5 * 1024 * 1024) {
        toast('A imagem do perfil deve ter no máximo 5MB.');
        return;
    }

    const response = await withLoading(
        () => api('update_profile', { method: 'POST', body: form }),
        'Salvando perfil...',
        'Atualizando seus dados.'
    );
    state.user = response.user;
    toast('Perfil atualizado.');
    renderOwnProfilePanel(false);
}

function renderSettingsPanel() {
    const colors = ['#8774e1', '#2ea6ff', '#28b463', '#f59e0b', '#ef4444', '#e056a8', '#00a884'];
    const panel = $('#profilePanel');
    panel.classList.remove('hidden');
    panel.innerHTML = `
        <header class="panel-header">
            <button class="icon-button" type="button" data-close-panel aria-label="Fechar"><i data-lucide="x"></i></button>
            <strong>Configurações</strong>
        </header>
        <div class="profile-content">
            <div class="profile-hero">
                ${avatarMarkup(state.user)}
                <div>
                    <strong>${escapeHtml(state.user.name)}</strong>
                    <span>@${escapeHtml(state.user.nick)}</span>
                </div>
            </div>
            <section class="settings-card">
                <strong>Tema</strong>
                <div class="theme-choice">
                    <button type="button" data-theme="dark" class="${state.user.theme === 'dark' ? 'active' : ''}">Escuro</button>
                    <button type="button" data-theme="oled" class="${state.user.theme === 'oled' ? 'active' : ''}">OLED</button>
                    <button type="button" data-theme="light" class="${state.user.theme === 'light' ? 'active' : ''}">Claro</button>
                </div>
            </section>
            <section class="settings-card">
                <strong>Notificações</strong>
                <div class="theme-choice">
                    <button type="button" data-sound="on" class="${state.soundEnabled ? 'active' : ''}">Som ligado</button>
                    <button type="button" data-sound="off" class="${!state.soundEnabled ? 'active' : ''}">Som desligado</button>
                </div>
            </section>
            <section class="settings-card">
                <strong>Cor principal</strong>
                <div class="swatches">
                    ${colors.map((color) => `<button class="swatch ${state.user.accent === color ? 'active' : ''}" type="button" data-color="${color}" style="--swatch:${color}" aria-label="${color}"></button>`).join('')}
                </div>
                <label>Personalizada <input type="color" id="customAccent" value="${escapeAttr(state.user.accent)}"></label>
            </section>
        </div>
    `;

    panel.querySelector('[data-close-panel]').addEventListener('click', closeProfilePanel);
    panel.querySelectorAll('[data-theme]').forEach((button) => {
        button.addEventListener('click', () => savePreferences(button.dataset.theme, state.user.accent));
    });
    panel.querySelectorAll('[data-sound]').forEach((button) => {
        button.addEventListener('click', () => {
            state.soundEnabled = button.dataset.sound === 'on';
            localStorage.setItem('NexoMessageSound', state.soundEnabled ? 'on' : 'off');
            if (state.soundEnabled) {
                playNotificationSound();
            }
            renderSettingsPanel();
        });
    });
    panel.querySelectorAll('[data-color]').forEach((button) => {
        button.addEventListener('click', () => savePreferences(state.user.theme, button.dataset.color));
    });
    panel.querySelector('#customAccent').addEventListener('change', (event) => savePreferences(state.user.theme, event.target.value));
    paintIcons();
}

async function savePreferences(theme, accent) {
    state.user.theme = theme;
    state.user.accent = accent;
    applyTheme(theme, accent);

    const form = new FormData();
    form.append('theme', theme);
    form.append('accent', accent);
    await api('preferences', { method: 'POST', body: form });
    renderSettingsPanel();
}

function renderSettingsMenuPanel() {
    const panel = $('#profilePanel');
    panel.classList.remove('hidden');
    panel.innerHTML = `
        <header class="panel-header">
            <button class="icon-button" type="button" data-close-panel aria-label="Fechar"><i data-lucide="x"></i></button>
            <strong>Configurações</strong>
        </header>
        <div class="profile-content settings-menu-content">
            <div class="profile-hero compact-profile-hero">
                ${avatarMarkup(state.user)}
                <div>
                    <strong>${escapeHtml(state.user.name)}</strong>
                    <span>@${escapeHtml(state.user.nick)}</span>
                </div>
            </div>
            <section class="settings-card settings-menu-card">
                ${settingsNavRow('monitor-smartphone', 'Dispositivos', 'Sessões, aparelhos conectados e login por QR Code', 'devices')}
                ${settingsNavRow('bell', 'Notificações', 'Som, permissão do navegador e avisos de chamadas', 'notifications')}
                ${settingsNavRow('database', 'Dados e Armazenamento', 'Cache, cookies e qualidade de mídia', 'storage')}
                ${settingsNavRow('lock-keyhole', 'Privacidade e Segurança', 'Senha, sessões ativas e proteções da conta', 'privacy')}
                ${settingsNavRow('laugh', 'Stickers e Emojis', 'Figurinhas, GIFs e substituicoes automaticas', 'stickers')}
                ${settingsNavRow('palette', 'Temas e Chats', 'Tema, cor principal e papel de parede', 'themes')}
                ${settingsNavRow('puzzle', 'Interface', 'Fonte, teclado e formato de hora', 'interface')}
                ${settingsNavRow('folder', 'Pastas de Chat', 'Filtros de conversas privadas e arquivadas', 'folders')}
                ${settingsNavRow('languages', 'Idioma', 'Idioma preferido do app', 'language')}
                ${settingsNavRow('circle-help', 'Ajuda', 'Informações do desenvolvedor, versao e atualizações', 'help')}
            </section>
        </div>
    `;
    panel.querySelector('[data-close-panel]').addEventListener('click', closeProfilePanel);
    panel.querySelectorAll('[data-settings-section]').forEach((button) => {
        button.addEventListener('click', () => openSettingsSection(button.dataset.settingsSection));
    });
    paintIcons();
}

function settingsNavRow(icon, title, description, section) {
    return `
        <button class="settings-nav-row" type="button" data-settings-section="${section}">
            <i data-lucide="${icon}"></i>
            <span><strong>${title}</strong><small>${description}</small></span>
            <i data-lucide="chevron-right"></i>
        </button>
    `;
}

function openSettingsSection(section) {
    const routes = {
        devices: renderDevicesPanel,
        notifications: renderNotificationsPanel,
        storage: renderStoragePanel,
        privacy: renderPrivacyPanel,
        stickers: renderStickersEmojisPanel,
        themes: renderThemesChatsPanel,
        interface: renderInterfacePanel,
        folders: renderChatFoldersPanel,
        language: renderLanguagePanel,
        help: renderHelpPanel,
    };
    routes[section]?.();
}

function settingsPanelShell(title, content, afterRender = null) {
    stopDeviceQrLoginScanner();
    const panel = $('#profilePanel');
    panel.classList.remove('hidden');
    panel.innerHTML = `
        <header class="panel-header">
            <button class="icon-button" type="button" data-back-settings aria-label="Voltar"><i data-lucide="arrow-left"></i></button>
            <strong>${title}</strong>
        </header>
        <div class="profile-content">${content}</div>
    `;
    panel.querySelector('[data-back-settings]').addEventListener('click', renderSettingsMenuPanel);
    afterRender?.(panel);
    paintIcons();
}

function renderHelpPanel() {
    settingsPanelShell('Ajuda', `
        <section class="settings-card">
            <strong>Sobre o NexoMessage</strong>
            <span class="settings-help">Aplicativo de mensagens privado para conversar, enviar arquivos e fazer chamadas.</span>
            <div class="settings-help"><strong>Versao do app</strong><br>${APP_VERSION}</div>
            <button class="primary-button" type="button" id="checkForUpdates"><i data-lucide="refresh-cw"></i>Buscar atualizações</button>
            <span class="settings-help" id="updateCheckStatus">Verifique manualmente se existe uma nova versao disponivel.</span>
        </section>
        <section class="settings-card">
            <strong>Desenvolvedor</strong>
            <span class="settings-help"><strong>Desenvolvedor</strong><br>Daniel Neitzel Vieira</span>
            <span class="settings-help">Projeto desenvolvido para comunicacao privada na web.</span>
            <a class="settings-help" href="https://github.com/DanVNeitzel" target="_blank" rel="noopener noreferrer">GitHub: github.com/DanVNeitzel</a>
            <span class="settings-help">Versao atual: ${APP_VERSION}</span>
        </section>
    `, (panel) => {
        panel.querySelector('#checkForUpdates').addEventListener('click', checkForUpdates);
    });
}

async function checkForUpdates() {
    const button = $('#checkForUpdates');
    const status = $('#updateCheckStatus');
    if (!button) {
        return;
    }

    button.disabled = true;
    button.innerHTML = '<i data-lucide="loader-circle"></i>Buscando atualizações...';
    paintIcons();
    try {
        const update = await fetchAvailableAppUpdate();
        if (!update.available) {
            status.textContent = `Nenhuma atualização disponivel. Você ja esta usando a versao ${APP_VERSION}.`;
            toast('Nenhuma atualização disponivel.');
        } else {
            status.textContent = `Nova versao ${update.version} encontrada. Atualize para aplicar as mudancas.`;
            showUpdateModal('Uma nova versao foi encontrada.', update.version, update.changelog);
        }
    } catch {
        status.textContent = 'Não foi possivel consultar atualizações agora. Verifique sua conexao e tente novamente.';
        toast('Não foi possivel buscar atualizações.');
    } finally {
        button.disabled = false;
        button.innerHTML = '<i data-lucide="refresh-cw"></i>Buscar atualizações';
        paintIcons();
    }
}

async function checkStartupUpdate() {
    try {
        const update = await fetchAvailableAppUpdate();
        if (update.available) {
            showUpdateModal(
                `Nova versao ${update.version} disponivel. Atualize para aplicar as mudancas mais recentes.`,
                update.version,
                update.changelog
            );
        }
    } catch {
        // A verificacao de inicializacao e silenciosa; a Ajuda mostra erro quando o usuário pedir.
    }
}

async function fetchAvailableAppUpdate() {
    const source = await fetchVersionSource();
    const remoteVersion = source.content.match(/const APP_VERSION = ['"]([^'"]+)['"]/)?.[1] || '';
    const remoteChangelog = parseWorkerChangelog(source.content);
    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration().catch(() => null);
        await registration?.update().catch(() => {});
    }

    return {
        available: Boolean(remoteVersion && remoteVersion !== APP_VERSION),
        version: remoteVersion,
        changelog: remoteChangelog.length ? remoteChangelog : APP_CHANGELOG,
    };
}

async function fetchVersionSource() {
    const attempted = [];
    for (const url of getUpdateSourceUrls()) {
        const urlWithCheck = new URL(url.href);
        urlWithCheck.searchParams.set('check', Date.now());
        try {
            const response = await fetch(urlWithCheck, {
                cache: 'no-store',
                credentials: 'same-origin',
            });
            attempted.push(`${url.pathname}: ${response.status}`);
            if (response.ok) {
                const content = await response.text();
                if (!/const APP_VERSION = ['"][^'"]+['"]/.test(content)) {
                    attempted.push(`${url.pathname}: sem APP_VERSION`);
                    continue;
                }

                return {
                    url,
                    content,
                };
            }
        } catch (error) {
            attempted.push(`${url.pathname}: ${error.message || 'erro de rede'}`);
        }
    }

    throw new Error(`Update source unavailable (${attempted.join(', ')})`);
}

function getUpdateSourceUrls() {
    const appScript = document.querySelector('script[src*="assets/app.js"]');
    const scriptUrl = appScript?.src ? new URL(appScript.src, window.location.href) : null;
    const serviceWorkerUrl = scriptUrl
        ? new URL('../service-worker.js', scriptUrl)
        : new URL('service-worker.js', window.location.href);
    const appUrl = scriptUrl
        ? new URL(scriptUrl.pathname, scriptUrl.origin)
        : new URL('assets/app.js', window.location.href);

    return [serviceWorkerUrl, appUrl];
}

function parseWorkerChangelog(workerSource) {
    const changelogBlock = workerSource.match(/const APP_CHANGELOG = \[([\s\S]*?)\];/)?.[1] || '';
    return Array.from(changelogBlock.matchAll(/['"]([^'"]+)['"]/g)).map((match) => match[1]);
}

async function renderDevicesPanel() {
    settingsPanelShell('Dispositivos', `
        <section class="settings-card">
            <span class="settings-help">No aparelho que ainda não esta conectado, abra a tela de login e toque em Entrar com QR Code. Depois leia esse codigo por aqui.</span>
            <button class="settings-nav-row highlight-row" type="button" id="startDeviceQrScanner">
                <i data-lucide="qr-code"></i>
                <span><strong>Ler Codigo QR</strong><small>Use a câmera deste aparelho para entrar no app de desktop.</small></span>
            </button>
            <div class="device-qr-scanner hidden" id="deviceQrScanner">
                <video id="deviceQrScannerVideo" autoplay muted playsinline></video>
                <span class="qr-scan-frame"></span>
                <small id="deviceQrScannerStatus">Aponte a câmera para o QR Code de login.</small>
                <button class="secondary-button" type="button" id="stopDeviceQrScanner">Parar leitura</button>
            </div>
        </section>
        <section class="settings-card">
            <div class="setting-head">
                <strong>Sessões conectadas</strong>
                <button class="secondary-button compact-button" type="button" id="refreshDevices">Atualizar</button>
            </div>
            <button class="secondary-button" type="button" id="updateDeviceLocation"><i data-lucide="map-pin"></i>Atualizar local deste aparelho</button>
            <div class="device-list" id="deviceList"><span class="muted-text">Carregando dispositivos...</span></div>
        </section>
        <section class="settings-card danger-zone">
            <button class="settings-nav-row danger-row" type="button" id="terminateOtherSessions">
                <i data-lucide="x-circle"></i>
                <span><strong>Terminar todas as outras sessões</strong><small>Sai de todos os dispositivos, exceto deste.</small></span>
            </button>
        </section>
    `, (panel) => {
        panel.querySelector('#startDeviceQrScanner').addEventListener('click', startDeviceQrLoginScanner);
        panel.querySelector('#stopDeviceQrScanner').addEventListener('click', stopDeviceQrLoginScanner);
        panel.querySelector('#refreshDevices').addEventListener('click', loadDeviceSessions);
        panel.querySelector('#updateDeviceLocation').addEventListener('click', updateDeviceLocation);
        panel.querySelector('#terminateOtherSessions').addEventListener('click', terminateOtherSessions);
    });
    await loadDeviceSessions();
}

function updateDeviceLocation() {
    if (!navigator.geolocation) {
        toast('Geolocalização indisponível neste navegador.');
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const label = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        await updateCurrentDeviceSession(label);
        toast('Local do dispositivo atualizado.');
        await loadDeviceSessions();
    }, () => {
        toast('Não foi possivel acessar o local deste aparelho.');
    }, {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 10 * 60 * 1000,
    });
}

async function loadDeviceSessions() {
    const list = $('#deviceList');
    if (!list) {
        return;
    }
    list.innerHTML = '<span class="muted-text">Carregando dispositivos...</span>';
    try {
        await updateCurrentDeviceSession();
        const response = await api('list_sessions');
        const current = response.sessions.find((session) => session.current);
        const others = response.sessions.filter((session) => !session.current);
        list.innerHTML = `
            ${current ? `<div class="device-group-label">Este dispositivo</div>${deviceSessionMarkup(current)}` : ''}
            ${others.length ? `<div class="device-group-label">Outros dispositivos</div>${others.map(deviceSessionMarkup).join('')}` : '<span class="muted-text">Nenhum outro dispositivo conectado.</span>'}
        `;
        list.querySelectorAll('[data-terminate-session]').forEach((button) => {
            button.addEventListener('click', () => terminateSession(Number(button.dataset.terminateSession)));
        });
        paintIcons();
    } catch (error) {
        list.innerHTML = `<span class="muted-text">${escapeHtml(error.message)}</span>`;
    }
}

function deviceSessionMarkup(session) {
    const location = session.location_label || session.timezone || session.ip_address || 'Local não identificado';
    return `
        <article class="device-session ${session.current ? 'current' : ''}">
            <i data-lucide="${deviceIcon(session.platform)}"></i>
            <span>
                <strong>${escapeHtml(session.device_name || session.browser || 'Dispositivo')}</strong>
                <small>${escapeHtml(`${session.browser || 'Navegador'} ${session.app_version ? `- v${session.app_version}` : ''}`)}</small>
                <small>${escapeHtml(location)}</small>
                <small>${escapeHtml(`Ultimo acesso: ${formatDateTime(session.last_seen)}`)}</small>
            </span>
            ${session.current ? '<em>Atual</em>' : `<button class="icon-button danger" type="button" data-terminate-session="${session.id}" aria-label="Terminar sessão"><i data-lucide="x"></i></button>`}
        </article>
    `;
}

function deviceIcon(platform = '') {
    const value = String(platform).toLowerCase();
    if (value.includes('android')) return 'smartphone';
    if (value.includes('ios') || value.includes('iphone') || value.includes('ipad')) return 'smartphone';
    if (value.includes('windows') || value.includes('mac') || value.includes('linux')) return 'monitor';
    return 'monitor-smartphone';
}

async function terminateSession(sessionId) {
    const confirmed = await confirmAction({
        title: 'Terminar sessão?',
        message: 'Este dispositivo precisara fazer login novamente.',
        confirmText: 'Terminar',
        danger: true,
    });
    if (!confirmed) {
        return;
    }

    const form = new FormData();
    form.append('session_id', String(sessionId));
    await api('terminate_session', { method: 'POST', body: form });
    toast('Sessao encerrada.');
    await loadDeviceSessions();
}

async function terminateOtherSessions() {
    const confirmed = await confirmAction({
        title: 'Terminar outras sessões?',
        message: 'Todos os outros dispositivos conectados precisarao fazer login novamente.',
        confirmText: 'Terminar todas',
        danger: true,
    });
    if (!confirmed) {
        return;
    }

    await api('terminate_other_sessions', { method: 'POST', body: new FormData() });
    toast('Outras sessões foram enviadas para o login.');
    await loadDeviceSessions();
}

async function startDeviceQrLoginScanner() {
    const scanner = $('#deviceQrScanner');
    const video = $('#deviceQrScannerVideo');
    const status = $('#deviceQrScannerStatus');
    if (!scanner || state.deviceQrScanning) {
        return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !('BarcodeDetector' in window)) {
        status.textContent = 'Seu navegador não suporta leitura de QR Code pela câmera.';
        return;
    }

    stopDeviceQrLoginScanner();
    scanner.classList.remove('hidden');
    status.textContent = 'Aponte a câmera para o QR Code de login.';
    try {
        state.qrDetector = state.qrDetector || new BarcodeDetector({ formats: ['qr_code'] });
        state.deviceQrScanStream = await requestUserMedia({
            video: { facingMode: { ideal: 'environment' } },
            audio: false,
        });
        video.srcObject = state.deviceQrScanStream;
        await video.play();
        state.deviceQrScanning = true;
        scanDeviceQrLoginFrame();
    } catch {
        status.textContent = 'Não foi possivel acessar a câmera.';
    }
}

function stopDeviceQrLoginScanner() {
    state.deviceQrScanning = false;
    if (state.deviceQrScanFrame) {
        cancelAnimationFrame(state.deviceQrScanFrame);
        state.deviceQrScanFrame = 0;
    }
    if (state.deviceQrScanStream) {
        state.deviceQrScanStream.getTracks().forEach((track) => track.stop());
        state.deviceQrScanStream = null;
    }
    const video = $('#deviceQrScannerVideo');
    if (video) {
        video.pause();
        video.srcObject = null;
    }
    $('#deviceQrScanner')?.classList.add('hidden');
}

async function scanDeviceQrLoginFrame() {
    if (!state.deviceQrScanning) {
        return;
    }

    const video = $('#deviceQrScannerVideo');
    if (video?.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        try {
            const codes = await state.qrDetector.detect(video);
            const token = qrLoginTokenFromValue(codes[0]?.rawValue || '');
            if (token) {
                stopDeviceQrLoginScanner();
                await approveQrLoginToken(token);
                return;
            }
            if (codes[0]) {
                $('#deviceQrScannerStatus').textContent = 'Este QR Code não e de login.';
            }
        } catch {
            $('#deviceQrScannerStatus').textContent = 'Continue apontando para o QR Code.';
        }
    }

    state.deviceQrScanFrame = requestAnimationFrame(scanDeviceQrLoginFrame);
}

function renderNotificationsPanel() {
    settingsPanelShell('Notificações', `
        <section class="settings-card">
            <strong>Som</strong>
            <div class="theme-choice">
                <button type="button" data-sound="on" class="${state.soundEnabled ? 'active' : ''}">Som ligado</button>
                <button type="button" data-sound="off" class="${!state.soundEnabled ? 'active' : ''}">Som desligado</button>
            </div>
        </section>
        <section class="settings-card">
            <strong>Prévia da mensagem</strong>
            <div class="theme-choice">
                <button type="button" data-preview="on" class="${state.notificationPreview ? 'active' : ''}">Mostrar texto</button>
                <button type="button" data-preview="off" class="${!state.notificationPreview ? 'active' : ''}">Ocultar texto</button>
            </div>
        </section>
        <section class="settings-card">
            <strong>Notificações do navegador</strong>
            <span class="muted-text">Status: ${browserNotificationLabel()}</span>
            <button class="secondary-button" type="button" id="requestNotificationPermission"><i data-lucide="bell"></i>Permitir notificações</button>
        </section>
    `, (panel) => {
        panel.querySelectorAll('[data-sound]').forEach((button) => {
            button.addEventListener('click', () => {
                state.soundEnabled = button.dataset.sound === 'on';
                localStorage.setItem('NexoMessageSound', state.soundEnabled ? 'on' : 'off');
                if (state.soundEnabled) playNotificationSound();
                renderNotificationsPanel();
            });
        });
        panel.querySelectorAll('[data-preview]').forEach((button) => {
            button.addEventListener('click', () => {
                state.notificationPreview = button.dataset.preview === 'on';
                localStorage.setItem('NexoMessageNotificationPreview', state.notificationPreview ? 'on' : 'off');
                renderNotificationsPanel();
            });
        });
        panel.querySelector('#requestNotificationPermission').addEventListener('click', async () => {
            state.notificationPermissionAsked = false;
            localStorage.removeItem('NexoMessageNotificationAsked');
            const permission = await requestBrowserNotificationPermission({ force: true });
            if (permission === 'granted') {
                await showTestNotification().catch(() => {});
            } else if (permission === 'denied') {
                toast('Notificações bloqueadas no navegador. Libere nas configurações do site/PWA.');
            } else {
                toast('Permissão de notificação ainda não foi concedida.');
            }
            renderNotificationsPanel();
        });
    });
}

function browserNotificationLabel() {
    if (!('Notification' in window)) return 'indisponível neste navegador';
    if (Notification.permission === 'granted') return 'permitidas';
    if (Notification.permission === 'denied') return 'bloqueadas';
    return 'aguardando permissão';
}

function renderStoragePanel() {
    settingsPanelShell('Dados e Armazenamento', `
        <section class="settings-card">
            <strong>Cache do app</strong>
            <span class="muted-text" id="cacheInfo">Calculando...</span>
            <button class="secondary-button" type="button" id="refreshStorageInfo">Atualizar uso</button>
            <button class="primary-button" type="button" id="clearStorageNow">Limpar cache e cookies</button>
        </section>
        <section class="settings-card">
            <strong>Qualidade de imagem</strong>
            <div class="theme-choice">
                <button type="button" data-image-quality="reduced" class="${state.imageQuality === 'reduced' ? 'active' : ''}">Reduzida</button>
                <button type="button" data-image-quality="full" class="${state.imageQuality === 'full' ? 'active' : ''}">Completa</button>
            </div>
        </section>
    `, (panel) => {
        panel.querySelector('#clearStorageNow').addEventListener('click', clearCacheCookiesAndReload);
        panel.querySelector('#refreshStorageInfo').addEventListener('click', updateStorageInfo);
        panel.querySelectorAll('[data-image-quality]').forEach((button) => {
            button.addEventListener('click', () => {
                state.imageQuality = button.dataset.imageQuality;
                renderStoragePanel();
            });
        });
        updateStorageInfo();
    });
}

async function updateStorageInfo() {
    const info = $('#cacheInfo');
    if (!info) return;
    if (!navigator.storage?.estimate) {
        info.textContent = 'Estimativa indisponível neste navegador.';
        return;
    }
    const estimate = await navigator.storage.estimate();
    info.textContent = `${formatBytes(estimate.usage || 0)} usados de ${formatBytes(estimate.quota || 0)} disponiveis.`;
}

function renderPrivacyPanel() {
    settingsPanelShell('Privacidade e Segurança', `
        <section class="settings-card">
            <button class="settings-nav-row" type="button" id="openPasswordSettings">
                <i data-lucide="key-round"></i>
                <span><strong>Alterar senha</strong><small>Atualize sua senha de acesso.</small></span>
            </button>
            <button class="settings-nav-row" type="button" id="openDevicesSettings">
                <i data-lucide="monitor-smartphone"></i>
                <span><strong>Sessões ativas</strong><small>Veja e encerre dispositivos conectados.</small></span>
            </button>
            <button class="settings-nav-row" type="button" id="configureTwoFactor">
                <i data-lucide="shield-check"></i>
                <span><strong>Autenticação em dois fatores</strong><small>${state.user.two_factor_enabled ? 'Ativada' : 'Configure com Google Authenticator.'}</small></span>
            </button>
        </section>
    `, (panel) => {
        panel.querySelector('#openPasswordSettings').addEventListener('click', renderChangePasswordPanel);
        panel.querySelector('#openDevicesSettings').addEventListener('click', renderDevicesPanel);
        panel.querySelector('#configureTwoFactor').addEventListener('click', configureTwoFactor);
    });
}

async function configureTwoFactor() {
    try {
        const setup = await api('setup_2fa');
        openTwoFactorModal(setup);
        return;
        if (state.user.two_factor_enabled) {
            const code = '';
            const password = '';
            if (!code || !password) return;
            const form = new FormData();
            form.append('code', code);
            form.append('password', password);
            await api('disable_2fa', { method: 'POST', body: form });
            state.user.two_factor_enabled = false;
            toast('Autenticação em dois fatores desativada.');
            renderPrivacyPanel();
            return;
        }
        // A chave agora e exibida no modal interno do aplicativo.
        const code = '';
        if (!code) return;
        const form = new FormData();
        form.append('code', code);
        await api('confirm_2fa', { method: 'POST', body: form });
        state.user.two_factor_enabled = true;
        toast('Autenticação em dois fatores ativada.');
        renderPrivacyPanel();
    } catch (error) {
        toast(error.message);
    }
}

function openTwoFactorModal(setup) {
    const enabled = Boolean(state.user.two_factor_enabled);
    const modal = $('#twoFactorModal');
    if (!modal) return;
    modal.dataset.mode = enabled ? 'disable' : 'enable';
    $('#twoFactorModalTitle').textContent = enabled ? 'Desativar autenticacao em dois fatores' : 'Ativar autenticacao em dois fatores';
    $('#twoFactorModalDescription').textContent = enabled
        ? 'Informe o codigo atual e sua senha para desativar a protecao.'
        : 'Adicione a chave abaixo no Google Authenticator e informe o codigo gerado.';
    $('#twoFactorSecretField').classList.toggle('hidden', enabled);
    $('#twoFactorQrWrap').classList.toggle('hidden', enabled);
    $('#twoFactorSecret').value = setup?.secret || '';
    if (!enabled && setup?.otpauth_url) {
        renderQrCodeInto($('#twoFactorQrBox'), setup.otpauth_url, 'QR Code do Google Authenticator');
    }
    $('#twoFactorPasswordField').classList.toggle('hidden', !enabled);
    $('#twoFactorPassword').required = enabled;
    $('#twoFactorSubmit').textContent = enabled ? 'Desativar 2FA' : 'Ativar 2FA';
    $('#twoFactorError').classList.add('hidden');
    modal.classList.remove('hidden');
    paintIcons();
    $('#twoFactorCode').focus();
}

$('#copyTwoFactorCodeButton')?.addEventListener('click', async () => {
    const secret = $('#twoFactorSecret')?.value || '';
    try {
        await navigator.clipboard.writeText(secret);
        toast('Chave copiada.');
    } catch {
        $('#twoFactorSecret')?.select();
        toast('Selecione e copie a chave manualmente.');
    }
});

$('#twoFactorForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const modal = $('#twoFactorModal');
    const enabled = modal?.dataset.mode === 'disable';
    const code = $('#twoFactorCode').value.trim();
    const error = $('#twoFactorError');
    if (!/^\d{6}$/.test(code)) {
        error.textContent = 'Informe um codigo de 6 digitos.';
        error.classList.remove('hidden');
        return;
    }
    const form = new FormData();
    form.append('code', code);
    if (enabled) form.append('password', $('#twoFactorPassword').value);
    try {
        await api(enabled ? 'disable_2fa' : 'confirm_2fa', { method: 'POST', body: form });
        state.user.two_factor_enabled = !enabled;
        closeModal(modal);
        toast(enabled ? 'Autenticacao em dois fatores desativada.' : 'Autenticacao em dois fatores ativada.');
        renderPrivacyPanel();
    } catch (requestError) {
        error.textContent = requestError.message;
        error.classList.remove('hidden');
    }
});

function renderStickersEmojisPanel() {
    settingsPanelShell('Stickers e Emojis', `
        <section class="settings-card">
            <strong>Atalhos do composer</strong>
            <div class="theme-choice">
                <button type="button" data-quick-open="emoji">Emojis</button>
                <button type="button" data-quick-open="stickers">Figurinhas</button>
                <button type="button" data-quick-open="gifs">GIFs</button>
            </div>
        </section>
        <section class="settings-card">
            <label class="setting-row">
                <input type="checkbox" data-auto-replace-toggle ${state.user.auto_replace ? 'checked' : ''}>
                <span><strong>Substituicoes automaticas</strong><span>Converte atalhos como &lt;3 e --&gt;.</span></span>
            </label>
        </section>
    `, (panel) => {
        panel.querySelectorAll('[data-quick-open]').forEach((button) => {
            button.addEventListener('click', () => {
                state.quickTab = button.dataset.quickOpen;
                renderQuickPanel();
                closeProfilePanel();
                toggleQuickPanel();
            });
        });
        panel.querySelector('[data-auto-replace-toggle]').addEventListener('change', (event) => saveAllPreferences({ auto_replace: event.target.checked }));
    });
}

function renderThemesChatsPanel() {
    renderGeneralSettingsPanel();
}

function renderInterfacePanel() {
    settingsPanelShell('Interface', `
        <section class="settings-card">
            <div class="setting-head"><strong>Tamanho da fonte</strong><span id="fontSizeValue">${state.user.message_font_size || 16}</span></div>
            <input class="range-control" type="range" min="12" max="22" step="1" value="${state.user.message_font_size || 16}" data-setting="message_font_size">
        </section>
        <section class="settings-card">
            <strong>Formato de hora</strong>
            <div class="setting-list">
                ${settingRadio('time_format', '12', '12 horas', '', state.user.time_format)}
                ${settingRadio('time_format', '24', '24 horas', '', state.user.time_format)}
            </div>
        </section>
        <section class="settings-card">
            <strong>Teclado</strong>
            <div class="setting-list">
                ${settingRadio('enter_send_mode', 'enter', 'Enviar com Enter', 'Shift + Enter cria nova linha', state.user.enter_send_mode)}
                ${settingRadio('enter_send_mode', 'ctrl_enter', 'Enviar com Ctrl+Enter', 'Enter cria nova linha', state.user.enter_send_mode)}
            </div>
        </section>
    `, (panel) => {
        const fontInput = panel.querySelector('[data-setting="message_font_size"]');
        fontInput.addEventListener('input', (event) => {
            $('#fontSizeValue').textContent = event.target.value;
            state.user.message_font_size = Number(event.target.value);
            applyPreferences();
        });
        fontInput.addEventListener('change', (event) => saveAllPreferences({ message_font_size: Number(event.target.value) }));
        panel.querySelectorAll('input[type="radio"][data-setting]').forEach((input) => {
            input.addEventListener('change', () => input.checked && saveAllPreferences({ [input.dataset.setting]: input.value }));
        });
    });
}

function renderChatFoldersPanel() {
    settingsPanelShell('Pastas de Chat', `
        <section class="settings-card">
            <button class="settings-nav-row" type="button" data-folder-filter="all">
                <i data-lucide="inbox"></i><span><strong>Todos</strong><small>${state.chats.filter((chat) => !chat.archived).length} conversas</small></span>
            </button>
            <button class="settings-nav-row" type="button" data-folder-filter="private">
                <i data-lucide="lock"></i><span><strong>Privado</strong><small>${state.chats.filter((chat) => !chat.archived && chat.folder_name === 'Privado').length} conversas</small></span>
            </button>
            <button class="settings-nav-row" type="button" data-folder-filter="archived">
                <i data-lucide="archive"></i><span><strong>Arquivados</strong><small>${state.chats.filter((chat) => chat.archived).length} conversas</small></span>
            </button>
        </section>
    `, (panel) => {
        panel.querySelectorAll('[data-folder-filter]').forEach((button) => {
            button.addEventListener('click', () => {
                state.chatFilter = button.dataset.folderFilter;
                renderChats();
                closeProfilePanel();
            });
        });
    });
}

function renderLanguagePanel() {
    const current = localStorage.getItem('NexoMessageLanguage') || 'pt-BR';
    settingsPanelShell('Idioma', `
        <section class="settings-card">
            <div class="setting-list">
                ${settingRadio('app_language', 'pt-BR', 'Portugues do Brasil', '', current)}
                ${settingRadio('app_language', 'en-US', 'English', 'Interface completa em breve', current)}
                ${settingRadio('app_language', 'es', 'Espanol', 'Interface completa em breve', current)}
            </div>
        </section>
    `, (panel) => {
        panel.querySelectorAll('input[name="app_language"]').forEach((input) => {
            input.addEventListener('change', () => {
                localStorage.setItem('NexoMessageLanguage', input.value);
                document.documentElement.lang = input.value;
                renderLanguagePanel();
            });
        });
    });
}

function renderGeneralSettingsPanel() {
    const colors = ['#8774e1', '#2ea6ff', '#28b463', '#f59e0b', '#ef4444', '#e056a8', '#00a884'];
    const wallpapers = [
        ['pattern', 'Padrao'],
        ['circles', 'Circulos'],
        ['solid', 'Solido'],
        ['gradient', 'Gradiente'],
    ];
    const panel = $('#profilePanel');
    panel.classList.remove('hidden');
    panel.innerHTML = `
        <header class="panel-header">
            <button class="icon-button" type="button" data-close-panel aria-label="Fechar"><i data-lucide="arrow-left"></i></button>
            <strong>Temas e Chats</strong>
        </header>
        <div class="profile-content">
            <section class="settings-card">
                <div class="setting-head">
                    <strong>Tamanho da Fonte das Mensagens</strong>
                    <span id="fontSizeValue">${state.user.message_font_size || 16}</span>
                </div>
                <input class="range-control" type="range" min="12" max="22" step="1" value="${state.user.message_font_size || 16}" data-setting="message_font_size">
                <strong>Papel de Parede</strong>
                <div class="wallpaper-choice">
                    ${wallpapers.map(([value, label]) => `
                        <button class="wallpaper-option ${state.user.wallpaper === value ? 'active' : ''}" type="button" data-wallpaper="${value}">
                            <span class="wallpaper-preview ${value}"></span>
                            ${label}
                        </button>
                    `).join('')}
                </div>
            </section>
            <section class="settings-card">
                <strong>Tema</strong>
                <div class="setting-list">
                    ${settingRadio('theme', 'light', 'Claro', '', state.user.theme)}
                    ${settingRadio('theme', 'dark', 'Escuro', '', state.user.theme)}
                    ${settingRadio('theme', 'oled', 'OLED', 'Preto absoluto para telas OLED', state.user.theme)}
                    ${settingRadio('theme', 'system', 'Sistema', '', state.user.theme)}
                </div>
            </section>
            <section class="settings-card">
                <strong>Cor principal</strong>
                <div class="swatches">
                    ${colors.map((color) => `<button class="swatch ${state.user.accent === color ? 'active' : ''}" type="button" data-color="${color}" style="--swatch:${color}" aria-label="${color}"></button>`).join('')}
                </div>
                <label>Personalizada <input type="color" id="customAccent" value="${escapeAttr(state.user.accent)}"></label>
            </section>
            <section class="settings-card">
                <strong>Formato de hora</strong>
                <div class="setting-list">
                    ${settingRadio('time_format', '12', '12 horas', '', state.user.time_format)}
                    ${settingRadio('time_format', '24', '24 horas', '', state.user.time_format)}
                </div>
            </section>
            <section class="settings-card">
                <strong>Teclado</strong>
                <div class="setting-list">
                    ${settingRadio('enter_send_mode', 'enter', 'Enviar com Enter', 'Use Shift + Enter para uma nova linha', state.user.enter_send_mode)}
                    ${settingRadio('enter_send_mode', 'ctrl_enter', 'Enviar com Ctrl+Enter', 'Use Enter para uma nova linha', state.user.enter_send_mode)}
                    <label class="setting-row">
                        <input type="checkbox" data-setting="auto_replace" ${state.user.auto_replace ? 'checked' : ''}>
                        <span><strong>Substituicoes automaticas</strong><span>Converte --&gt;, &lt;-- e &lt;3 enquanto voce digita</span></span>
                    </label>
                </div>
            </section>
            <section class="settings-card">
                <strong>Notificações</strong>
                <div class="theme-choice">
                    <button type="button" data-sound="on" class="${state.soundEnabled ? 'active' : ''}">Som ligado</button>
                    <button type="button" data-sound="off" class="${!state.soundEnabled ? 'active' : ''}">Som desligado</button>
                </div>
            </section>
        </div>
    `;

    panel.querySelector('[data-close-panel]').addEventListener('click', renderSettingsMenuPanel);
    panel.querySelectorAll('input[type="radio"][data-setting]').forEach((input) => {
        input.addEventListener('change', () => {
            if (input.checked) {
                saveAllPreferences({ [input.dataset.setting]: input.value });
            }
        });
    });
    panel.querySelectorAll('input[type="checkbox"][data-setting]').forEach((input) => {
        input.addEventListener('change', () => saveAllPreferences({ [input.dataset.setting]: input.checked }));
    });
    const fontInput = panel.querySelector('[data-setting="message_font_size"]');
    fontInput.addEventListener('input', (event) => {
        $('#fontSizeValue').textContent = event.target.value;
        state.user.message_font_size = Number(event.target.value);
        applyPreferences();
    });
    fontInput.addEventListener('change', (event) => saveAllPreferences({ message_font_size: Number(event.target.value) }));
    panel.querySelectorAll('[data-wallpaper]').forEach((button) => {
        button.addEventListener('click', () => saveAllPreferences({ wallpaper: button.dataset.wallpaper }));
    });
    panel.querySelectorAll('[data-color]').forEach((button) => {
        button.addEventListener('click', () => saveAllPreferences({ accent: button.dataset.color }));
    });
    panel.querySelector('#customAccent').addEventListener('change', (event) => saveAllPreferences({ accent: event.target.value }));
    panel.querySelectorAll('[data-sound]').forEach((button) => {
        button.addEventListener('click', () => {
            state.soundEnabled = button.dataset.sound === 'on';
            localStorage.setItem('NexoMessageSound', state.soundEnabled ? 'on' : 'off');
            if (state.soundEnabled) {
                playNotificationSound();
            }
            renderGeneralSettingsPanel();
        });
    });
    paintIcons();
}

function settingRadio(name, value, title, description, current) {
    return `
        <label class="setting-row">
            <input type="radio" name="${name}" data-setting="${name}" value="${value}" ${current === value ? 'checked' : ''}>
            <span><strong>${title}</strong>${description ? `<span>${description}</span>` : ''}</span>
        </label>
    `;
}

async function saveAllPreferences(changes = {}) {
    state.user = { ...state.user, ...changes };
    applyPreferences();

    const form = new FormData();
    form.append('theme', state.user.theme || 'dark');
    form.append('accent', state.user.accent || '#8774e1');
    form.append('message_font_size', String(state.user.message_font_size || 16));
    form.append('wallpaper', state.user.wallpaper || 'pattern');
    form.append('time_format', state.user.time_format || '24');
    form.append('enter_send_mode', state.user.enter_send_mode || 'enter');
    form.append('auto_replace', state.user.auto_replace ? '1' : '0');
    const response = await api('preferences', { method: 'POST', body: form });
    state.user = { ...state.user, ...response.preferences };
    applyPreferences();
    renderChats();
    refreshMessagesMarkup();
    renderGeneralSettingsPanel();
}

async function renderAdminPanel() {
    const panel = $('#profilePanel');
    panel.classList.remove('hidden');
    panel.innerHTML = `
        <header class="panel-header">
            <button class="icon-button" type="button" data-close-panel aria-label="Fechar"><i data-lucide="arrow-left"></i></button>
            <strong>Admin</strong>
        </header>
        <div class="profile-content">
            <section class="settings-card">
                <div class="quick-status">Carregando painel administrativo...</div>
            </section>
        </div>
    `;
    panel.querySelector('[data-close-panel]').addEventListener('click', closeProfilePanel);
    paintIcons();

    try {
        const [statsResponse, usersResponse] = await withLoading(
            () => Promise.all([api('admin_stats'), api('admin_users')]),
            'Carregando admin...',
            'Organizando contas e estatisticas.'
        );
        renderAdminPanelContent(statsResponse.stats, usersResponse.users);
    } catch (error) {
        panel.querySelector('.profile-content').innerHTML = `<section class="settings-card"><strong>Admin indisponível</strong><span>${escapeHtml(error.message)}</span></section>`;
    }
}

function renderAdminPanelContent(stats, users) {
    const panel = $('#profilePanel');
    panel.innerHTML = `
        <header class="panel-header">
            <button class="icon-button" type="button" data-close-panel aria-label="Fechar"><i data-lucide="arrow-left"></i></button>
            <strong>Admin</strong>
        </header>
        <div class="profile-content admin-content">
            <section class="admin-stats">
                ${adminStat('Usuários', stats.users)}
                ${adminStat('Admins', stats.admins)}
                ${adminStat('Mensagens', stats.messages)}
                ${adminStat('Conversas', stats.conversations)}
                ${adminStat('Uploads', stats.upload_files)}
                ${adminStat('Espaco', formatBytes(stats.upload_bytes) || '0 B')}
            </section>

            <section class="settings-card admin-actions-card">
                <strong>Comandos globais</strong>
                <button class="secondary-button" type="button" data-admin-bulk="admin_clear_messages"><i data-lucide="message-square-x"></i>Limpar todas as mensagens</button>
                <button class="secondary-button" type="button" data-admin-bulk="admin_clear_uploads"><i data-lucide="image-off"></i>Limpar imagens e uploads</button>
                <button class="danger-button" type="button" data-admin-bulk="admin_clear_users"><i data-lucide="users-x"></i>Apagar usuários não admin</button>
            </section>

            <form class="settings-card admin-upload-settings" id="adminUploadSettingsForm">
                <strong>Limites globais de upload</strong>
                <span class="settings-help">UsuÃ¡rios comuns continuam limitados a 50 MB. Use 0 para deixar administradores sem limite da aplicaÃ§Ã£o.</span>
                <label>Usuarios comuns (MB)
                    <input name="user_upload_limit_mb" type="number" min="0" max="2048" step="1" value="${Number(stats.user_upload_limit_mb ?? 50)}" required>
                </label>
                <label>Administradores (MB)
                    <input name="admin_upload_limit_mb" type="number" min="0" max="2048" step="1" value="${Number(stats.admin_upload_limit_mb || 0)}" required>
                </label>
                <button class="secondary-button" type="submit"><i data-lucide="save"></i>Salvar limite</button>
            </form>

            <section class="settings-card admin-users-card">
                <div class="setting-head">
                    <strong>Contas existentes</strong>
                    <span>${users.length}</span>
                </div>
                <div class="admin-user-list">
                    ${users.map(adminUserRow).join('')}
                </div>
            </section>
        </div>
    `;

    panel.querySelector('[data-close-panel]').addEventListener('click', closeProfilePanel);
    panel.querySelectorAll('[data-admin-bulk]').forEach((button) => {
        button.addEventListener('click', () => runAdminBulkAction(button.dataset.adminBulk));
    });
    panel.querySelector('#adminUploadSettingsForm')?.addEventListener('submit', saveAdminUploadSettings);
    panel.querySelectorAll('[data-admin-save]').forEach((button) => {
        button.addEventListener('click', () => saveAdminUser(button.closest('[data-admin-user-row]')));
    });
    panel.querySelectorAll('[data-admin-delete]').forEach((button) => {
        button.addEventListener('click', () => deleteAdminUser(button.closest('[data-admin-user-row]')));
    });
    paintIcons();
}

async function saveAdminUploadSettings(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await withLoading(
        () => api('admin_update_upload_settings', { method: 'POST', body: form }),
        'Salvando limite...',
        'Atualizando configuracao de uploads.'
    );
    toast('Limite de upload atualizado.');
    await renderAdminPanel();
}

function adminStat(label, value) {
    return `<div class="admin-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function adminUserRow(user) {
    return `
        <form class="admin-user-row" data-admin-user-row data-user-id="${user.id}">
            ${avatarMarkup(user)}
            <div class="admin-user-fields">
                <label>Nome <input name="name" value="${escapeAttr(user.name)}" required></label>
                <label>E-mail <input name="email" type="email" value="${escapeAttr(user.email)}" required></label>
                <label>Nick <input name="nick" value="${escapeAttr(user.nick)}" required></label>
                <label>Telefone <input name="phone" value="${escapeAttr(user.phone)}" required></label>
                <label class="admin-check"><input name="is_admin" type="checkbox" ${user.is_admin ? 'checked' : ''}> Admin</label>
                <small>${escapeHtml(user.status)} \u00b7 ${user.message_count} mensagens \u00b7 criado em ${formatFullDate(user.created_at)}</small>
            </div>
            <div class="admin-user-actions">
                <button class="icon-button" type="button" data-admin-save aria-label="Salvar"><i data-lucide="save"></i></button>
                <button class="icon-button danger" type="button" data-admin-delete aria-label="Apagar usuário"><i data-lucide="trash-2"></i></button>
            </div>
        </form>
    `;
}

async function runAdminBulkAction(action) {
    const options = {
        admin_clear_messages: {
            title: 'Limpar todas as mensagens?',
            message: 'Todas as conversas ficarao vazias, mas usuários e contatos continuam existindo.',
            confirmText: 'Limpar mensagens',
            loading: 'Limpando mensagens...',
            done: 'Todas as mensagens foram removidas.',
            checkboxLabel: 'Entendo que esta acao não pode ser desfeita.',
        },
        admin_clear_uploads: {
            title: 'Limpar imagens e uploads?',
            message: 'Fotos de perfil, imagens, videos, áudios, arquivos e figurinhas enviadas serao removidos da pasta uploads.',
            confirmText: 'Limpar uploads',
            loading: 'Limpando uploads...',
            done: 'Uploads removidos.',
            checkboxLabel: 'Entendo que os arquivos enviados serao apagados.',
        },
        admin_clear_users: {
            title: 'Apagar usuários não admin?',
            message: 'Todas as contas comuns serao apagadas. As contas administradoras serao preservadas.',
            confirmText: 'Apagar usuários',
            loading: 'Apagando usuários...',
            done: 'Usuários não admin removidos.',
            checkboxLabel: 'Entendo que as contas comuns serao apagadas.',
        },
    }[action];

    if (!options) {
        return;
    }

    const confirmed = await confirmAction({
        title: options.title,
        message: options.message,
        confirmText: options.confirmText,
        danger: true,
        checkboxLabel: options.checkboxLabel,
    });
    if (!confirmed?.checked) {
        toast('Marque a confirmação para continuar.');
        return;
    }

    await withLoading(
        () => api(action, { method: 'POST', body: new FormData() }),
        options.loading,
        'Aplicando comando administrativo.'
    );
    toast(options.done);
    await loadChats(true);
    await renderAdminPanel();
}

async function saveAdminUser(row) {
    if (!row) {
        return;
    }

    const form = new FormData(row);
    form.set('user_id', row.dataset.userId);
    form.set('is_admin', row.querySelector('[name="is_admin"]').checked ? '1' : '0');

    await withLoading(
        () => api('admin_update_user', { method: 'POST', body: form }),
        'Salvando usuário...',
        'Atualizando dados da conta.'
    );
    toast('Conta atualizada.');

    if (Number(row.dataset.userId) === state.user.id) {
        state.user.name = form.get('name');
        state.user.email = form.get('email');
        state.user.nick = form.get('nick');
        state.user.phone = form.get('phone');
    }
    await renderAdminPanel();
}

async function deleteAdminUser(row) {
    if (!row) {
        return;
    }

    const name = row.querySelector('[name="name"]')?.value || 'usuário';
    const confirmed = await confirmAction({
        title: `Apagar ${name}?`,
        message: 'A conta, contatos, conversas associadas e pasta de upload desse usuário serao removidos.',
        confirmText: 'Apagar usuário',
        danger: true,
        checkboxLabel: 'Entendo que esta conta sera apagada permanentemente.',
    });
    if (!confirmed?.checked) {
        toast('Marque a confirmação para continuar.');
        return;
    }

    const form = new FormData();
    form.set('user_id', row.dataset.userId);
    await withLoading(
        () => api('admin_delete_user', { method: 'POST', body: form }),
        'Apagando usuário...',
        'Removendo conta e arquivos.'
    );
    toast('Usuário removido.');
    await loadChats(true);
    await renderAdminPanel();
}

function refreshMessagesMarkup() {
    const messages = Array.from(state.messageById.values()).sort((a, b) => a.id - b.id);
    messages.forEach((message) => replaceMessage(message));
}

function infoRow(icon, value, label) {
    return `
        <div class="info-row">
            <i data-lucide="${icon}"></i>
            <span><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></span>
        </div>
    `;
}

function closeProfilePanel() {
    stopDeviceQrLoginScanner();
    $('#profilePanel').classList.add('hidden');
}

function openModal(selector) {
    $(selector).classList.remove('hidden');
    paintIcons();
}

function closeModal(modal) {
    if (!modal) {
        return;
    }
    if (modal?.id === 'addContactModal') {
        stopQrScanner();
    }
    modal.classList.add('hidden');
}

function checkAppVersion() {
    const storedVersion = getCookie(APP_VERSION_COOKIE);
    if (storedVersion !== APP_VERSION) {
        setCookie(APP_VERSION_COOKIE, APP_VERSION, 365);
    }
}

function showUpdateModal(message = '', version = APP_VERSION, changelog = APP_CHANGELOG) {
    const modal = $('#updateModal');
    if (!modal) {
        return;
    }

    state.pendingUpdateVersion = version || APP_VERSION;
    $('#updateVersion').textContent = `Versao ${state.pendingUpdateVersion}`;
    $('#updateMessage').textContent = message || 'Atualize o conteudo do app para carregar todas as modificacoes desta versao sem sair da sua conta.';
    renderUpdateChangelog(Array.isArray(changelog) ? changelog : APP_CHANGELOG);
    modal.classList.remove('hidden');
    paintIcons();
}

function renderUpdateChangelog(changelog) {
    const visibleLimit = 4;
    const visibleItems = changelog.slice(0, visibleLimit);
    const hiddenItems = changelog.slice(visibleLimit);
    const itemMarkup = (item) => `<span><i data-lucide="check"></i>${escapeHtml(item)}</span>`;
    const extraMarkup = hiddenItems.length ? `
        <div class="update-changelog-extra hidden" id="updateChangelogExtra">
            ${hiddenItems.map(itemMarkup).join('')}
        </div>
        <button class="update-more-button" type="button" id="updateChangelogToggle" aria-expanded="false">
            Ver mais ${hiddenItems.length ? `(${hiddenItems.length})` : ''}
        </button>
    ` : '';

    $('#updateChangelog').innerHTML = `
        ${visibleItems.map(itemMarkup).join('')}
        ${extraMarkup}
    `;

    $('#updateChangelogToggle')?.addEventListener('click', () => {
        const extra = $('#updateChangelogExtra');
        const button = $('#updateChangelogToggle');
        const expanded = extra?.classList.toggle('hidden') === false;
        button.textContent = expanded ? 'Ver menos' : `Ver mais (${hiddenItems.length})`;
        button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
}

async function clearCacheCookiesAndReload() {
    const button = $('#clearStorageNow') || $('#updateNowButton');
    if (button) {
        button.disabled = true;
        button.textContent = 'Limpando...';
    }

    try {
        await fetch('api.php?action=logout', {
            method: 'POST',
            credentials: 'same-origin',
            body: new FormData(),
        }).catch(() => {});

        await clearAppCachesAndWorkers();
        clearClientCookies();
        setCookie(APP_VERSION_COOKIE, state.pendingUpdateVersion || APP_VERSION, 365);
        sessionStorage.clear();

        const url = new URL(window.location.href);
        url.searchParams.set('v', `${state.pendingUpdateVersion || APP_VERSION}-${Date.now()}`);
        window.location.replace(url.toString());
    } catch {
        if (button) {
            button.disabled = false;
            button.textContent = button.id === 'clearStorageNow' ? 'Limpar cache e cookies' : 'Limpar e atualizar';
        }
        toast('Não foi possivel limpar tudo automaticamente.');
    }
}

async function updateAppContentAndReload() {
    const button = $('#updateNowButton');
    if (button) {
        button.disabled = true;
        button.textContent = 'Atualizando...';
    }

    try {
        await clearAppCachesAndWorkers();
        setCookie(APP_VERSION_COOKIE, state.pendingUpdateVersion || APP_VERSION, 365);

        const url = new URL(window.location.href);
        url.searchParams.set('v', `${state.pendingUpdateVersion || APP_VERSION}-${Date.now()}`);
        window.location.replace(url.toString());
    } catch {
        if (button) {
            button.disabled = false;
            button.textContent = 'Atualizar agora';
        }
        toast('Não foi possivel atualizar automaticamente.');
    }
}

async function clearAppCachesAndWorkers() {
    if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
    }

    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
    }
}

function getCookie(name) {
    const prefix = `${encodeURIComponent(name)}=`;
    const cookie = document.cookie.split('; ').find((item) => item.startsWith(prefix));
    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : '';
}

function setCookie(name, value, days = 365) {
    const maxAge = Math.max(0, Math.floor(days * 24 * 60 * 60));
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function clearClientCookies() {
    const cookies = document.cookie ? document.cookie.split(';') : [];
    const paths = Array.from(new Set([
        '/',
        window.location.pathname.replace(/\/[^/]*$/, '/') || '/',
    ]));
    const domains = Array.from(new Set([
        window.location.hostname,
        `.${window.location.hostname}`,
    ]));

    cookies.forEach((cookie) => {
        const name = cookie.split('=')[0]?.trim();
        if (!name) {
            return;
        }

        paths.forEach((path) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
            domains.forEach((domain) => {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}`;
            });
        });
    });
}

function openQrModal() {
    openQrModalForPerson(state.user);
}

function openQrModalForPerson(person) {
    if (!person || !person.nick) {
        toast('Este usuário ainda não possui um nome de usuário para gerar o QR Code.');
        return;
    }

    state.qrLink = qrContactLink(person.nick);
    $('#qrAvatar').innerHTML = person.avatar_url
        ? `<img src="${person.avatar_url}" alt="">`
        : escapeHtml(person.initials || initialsFromName(person.name));
    $('#qrNick').textContent = `@${String(person.nick).toUpperCase()}`;
    renderQrCode(state.qrLink);
    $('#qrModal').classList.remove('hidden');
    paintIcons();
}

function closeQrModal() {
    $('#qrModal').classList.add('hidden');
}

function qrContactLink(nick = state.user?.nick) {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set('add', `@${nick}`);
    return url.toString();
}

function renderQrCode(value) {
    renderQrCodeInto($('#qrCodeBox'), value, 'QR Code do contato');
}

function renderQrCodeInto(box, value, altText = 'QR Code') {
    if (!box) {
        return;
    }

    if (!window.qrcode) {
        renderQrFallback(box, value);
        return;
    }

    try {
        const qr = qrcode(0, 'M');
        qr.addData(value, 'Byte');
        qr.make();
        const svg = qr.createSvgTag({ cellSize: 6, margin: 4, scalable: true, alt: { text: altText } });
        if (!svg) {
            throw new Error('QR vazio');
        }
        box.innerHTML = `${svg}<span class="qr-logo"><i data-lucide="send"></i></span>`;
        paintIcons();
    } catch {
        try {
            const qr = qrcode(0, 'M');
            qr.addData(value, 'Byte');
            qr.make();
            box.innerHTML = `${qr.createImgTag(8, 16, altText)}<span class="qr-logo"><i data-lucide="send"></i></span>`;
            paintIcons();
        } catch {
            renderQrFallback(box, value);
        }
    }
}

function renderQrFallback(box, value) {
    box.innerHTML = `
        <div class="qr-fallback">
            <i data-lucide="qr-code"></i>
            <span>${escapeHtml(value)}</span>
        </div>
    `;
    paintIcons();
}

async function copyQrLink() {
    try {
        const svg = $('#qrCodeBox svg');
        if (svg && navigator.clipboard && window.ClipboardItem) {
            const blob = await qrSvgToPngBlob(svg);
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            toast('QR copiado.');
            return;
        }

        await navigator.clipboard.writeText(state.qrLink || qrContactLink());
        toast('Link do QR copiado.');
    } catch {
        try {
            await navigator.clipboard.writeText(state.qrLink || qrContactLink());
            toast('Link do QR copiado.');
        } catch {
            toast('Não foi possivel copiar o QR.');
        }
    }
}

function qrSvgToPngBlob(svg) {
    return new Promise((resolve, reject) => {
        const clone = svg.cloneNode(true);
        clone.querySelector('rect')?.setAttribute('fill', '#ffffff');
        clone.querySelector('path')?.setAttribute('fill', state.user?.accent || '#8774e1');
        const source = new XMLSerializer().serializeToString(clone);
        const image = new Image();
        const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }));
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 720;
            canvas.height = 720;
            const context = canvas.getContext('2d');
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Falha ao gerar QR.'));
                }
            }, 'image/png');
        };
        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Falha ao gerar QR.'));
        };
        image.src = url;
    });
}

async function withLoading(task, title = 'Carregando...', message = 'Aguarde um instante.', delay = 250) {
    showLoading(title, message, delay);
    try {
        return await task();
    } finally {
        hideLoading();
    }
}

function showLoading(title = 'Carregando...', message = 'Aguarde um instante.', delay = 250) {
    state.loadingCount += 1;
    $('#loadingTitle').textContent = title;
    $('#loadingMessage').textContent = message;
    clearTimeout(state.loadingTimer);
    state.loadingTimer = setTimeout(() => {
        if (state.loadingCount > 0) {
            $('#loadingOverlay').classList.remove('hidden');
        }
    }, delay);
}

function hideLoading() {
    state.loadingCount = Math.max(0, state.loadingCount - 1);
    if (state.loadingCount === 0) {
        clearTimeout(state.loadingTimer);
        $('#loadingOverlay').classList.add('hidden');
    }
}

function confirmAction({ title = 'Confirmar ação', message = 'Deseja continuar?', confirmText = 'Confirmar', cancelText = 'Cancelar', danger = false, checkboxLabel = '', checkboxDefault = false } = {}) {
    const modal = $('#confirmModal');
    $('#confirmTitle').textContent = title;
    $('#confirmMessage').textContent = message;
    const checkboxWrap = $('#confirmCheckboxWrap');
    const checkbox = $('#confirmCheckbox');
    $('#confirmCheckboxLabel').textContent = checkboxLabel;
    checkbox.checked = Boolean(checkboxDefault);
    state.confirmHasCheckbox = Boolean(checkboxLabel);
    checkboxWrap.classList.toggle('hidden', !state.confirmHasCheckbox);
    const accept = $('#confirmAccept');
    accept.textContent = confirmText;
    accept.classList.toggle('danger-button', danger);
    const closeButton = $('#confirmModal header [data-confirm-cancel]');
    if (closeButton) {
        closeButton.innerHTML = '<i data-lucide="x"></i>';
        closeButton.setAttribute('aria-label', 'Fechar');
        closeButton.setAttribute('title', 'Fechar');
    }
    $$('#confirmModal .confirm-actions [data-confirm-cancel]').forEach((button) => {
        button.textContent = cancelText;
    });
    modal.classList.remove('hidden');
    paintIcons();

    return new Promise((resolve) => {
        state.confirmResolver = resolve;
    });
}

function resolveConfirm(value) {
    const modal = $('#confirmModal');
    const checkbox = $('#confirmCheckbox');
    if (modal) {
        modal.classList.add('hidden');
    }

    if (state.confirmResolver) {
        state.confirmResolver(value && state.confirmHasCheckbox ? { confirmed: true, checked: checkbox.checked } : value);
        state.confirmResolver = null;
    }
    state.confirmHasCheckbox = false;
}

function resetPolling() {
    clearInterval(state.polling);
    state.polling = setInterval(() => {
        loadMessages(false, true).catch(() => {});
        loadChats(true).catch(() => {});
        pollCallUpdates().catch(() => {});
    }, 3000);
}

async function api(action, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('X-App-Version', APP_VERSION);
    headers.set('X-Device-Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone || '');
    headers.set('X-Device-Language', navigator.language || '');
    const response = await fetch(`api.php?action=${action}`, {
        credentials: 'same-origin',
        ...options,
        cache: 'no-store',
        headers,
    });
    const data = await response.json().catch(() => ({
        ok: false,
        message: response.status === 401 ? 'Sessao expirada. Faça login novamente.' : 'Erro inesperado.',
    }));
    if (isRemoteSessionLogout(response, data)) {
        handleRemoteSessionLogout(data.message || 'Sessao encerrada. Faça login novamente.');
    }
    if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Erro inesperado.');
    }
    return data;
}

function apiWithUploadProgress(action, body, onProgress = () => {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `api.php?action=${action}`, true);
        xhr.withCredentials = true;
        xhr.setRequestHeader('X-App-Version', APP_VERSION);
        xhr.setRequestHeader('X-Device-Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone || '');
        xhr.setRequestHeader('X-Device-Language', navigator.language || '');

        xhr.upload.onprogress = (event) => {
            if (!event.lengthComputable || !event.total) {
                return;
            }
            onProgress((event.loaded / event.total) * 100);
        };

        xhr.onload = () => {
            let data;
            try {
                data = JSON.parse(xhr.responseText || '{}');
            } catch {
                data = {
                    ok: false,
                    message: xhr.status === 401 ? 'Sessao expirada. Faça login novamente.' : 'Erro inesperado.',
                };
            }

            const responseLike = { status: xhr.status };
            if (isRemoteSessionLogout(responseLike, data)) {
                handleRemoteSessionLogout(data.message || 'Sessao encerrada. Faça login novamente.');
            }

            if (xhr.status < 200 || xhr.status >= 300 || !data.ok) {
                reject(new Error(data.message || 'Erro inesperado.'));
                return;
            }

            onProgress(100);
            resolve(data);
        };

        xhr.onerror = () => reject(new TypeError('Network request failed'));
        xhr.onabort = () => reject(new Error('Upload cancelado.'));
        xhr.send(body);
    });
}

function avatarMarkup(person, id = '') {
    const idAttr = id ? ` id="${id}"` : '';
    if (person.type === 'saved') {
        return `<span class="avatar saved-avatar"${idAttr}><i data-lucide="bookmark"></i></span>`;
    }
    if (person.type === 'group') {
        const avatar = person.avatar_url || person.avatar_path;
        if (avatar) {
            return `<span class="avatar group-avatar"${idAttr}><img src="${avatar}" alt=""></span>`;
        }
        return `<span class="avatar group-avatar"${idAttr}><i data-lucide="users"></i></span>`;
    }
    const avatar = person.avatar_url || person.avatar_path;
    return `<span class="avatar"${idAttr}>${avatar ? `<img src="${avatar}" alt="">` : escapeHtml(person.initials || '?')}${avatarStatusMarkup(person)}</span>`;
}

function avatarStatusMarkup(person) {
    if (!person || person.type === 'group' || person.type === 'saved') {
        return '';
    }
    const status = USER_STATUS_LABELS[person.status] ? person.status : (person.status === 'offline' ? 'invisible' : 'online');
    return `<span class="avatar-status-dot status-${status}" title="${USER_STATUS_LABELS[status]}"></span>`;
}

function applyPreferences() {
    if (!state.user) {
        return;
    }

    applyTheme(state.user.theme, state.user.accent);
    document.documentElement.style.setProperty('--message-font-size', `${state.user.message_font_size || 16}px`);
    document.body.classList.remove('wallpaper-pattern', 'wallpaper-circles', 'wallpaper-solid', 'wallpaper-gradient');
    document.body.classList.add(`wallpaper-${state.user.wallpaper || 'pattern'}`);
}

function applyTheme(theme, accent) {
    const resolvedTheme = theme === 'system'
        ? (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
        : theme;
    document.body.classList.toggle('theme-light', resolvedTheme === 'light');
    document.body.classList.toggle('theme-oled', resolvedTheme === 'oled');
    document.body.classList.toggle('theme-dark', resolvedTheme !== 'light' && resolvedTheme !== 'oled');
    document.documentElement.style.setProperty('--primary', accent);
    document.documentElement.style.setProperty('--primary-rgb', hexToRgb(accent));
}

function hexToRgb(hex) {
    const value = hex.replace('#', '');
    const bigint = parseInt(value, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

function formatChatDate(value) {
    const date = parseAppDate(value);
    if (!date) {
        return '';
    }

    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        return formatTime(date);
    }
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function formatTime(value) {
    const date = parseAppDate(value);
    if (!date) {
        return '';
    }

    return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: state.user?.time_format === '12',
    });
}

function formatFullDate(value) {
    const date = parseAppDate(value);
    if (!date) {
        return '';
    }

    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: state.user?.time_format === '12',
    });
}

function formatDateTime(value) {
    return formatFullDate(value);
}

function formatMessageDay(value) {
    const date = parseAppDate(value);
    if (!date) {
        return '';
    }

    return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function parseAppDate(value) {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    const raw = String(value).trim();
    if (!raw) {
        return null;
    }

    const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function initialsFromName(name) {
    return String(name || '?')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0] || '')
        .join('')
        .toUpperCase() || '?';
}

function formatBytes(bytes) {
    if (!bytes) {
        return '';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let index = 0;
    while (value >= 1024 && index < units.length - 1) {
        value /= 1024;
        index += 1;
    }
    return `${value.toFixed(index ? 1 : 0)} ${units[index]}`;
}

function mediaLabel(mediaType) {
    return ({
        image: 'Foto',
        gif: 'GIF',
        áudio: 'Áudio',
        video: 'Vídeo',
        file: 'Arquivo',
    })[mediaType] || 'Mensagem';
}

function normalize(value) {
    return value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    })[char]);
}

function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, '&#096;');
}

function linkify(value) {
    return value.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

function toast(message) {
    const element = $('#toast');
    element.textContent = message;
    element.classList.remove('hidden');
    clearTimeout(element.timer);
    element.timer = setTimeout(() => element.classList.add('hidden'), 3200);
}

function paintIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
