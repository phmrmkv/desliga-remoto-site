# Fontes das afirmações da página

Repositório da ferramenta (somente leitura): `C:\Users\phsil\Aplicativos\DesligaRemoto` (commit 59f7881, versão 1.2.0). Abreviação abaixo: `DR/`. Notas: `Obsidian Vault\memoria-ia\projetos\desliga-remoto\` (abreviação `Notas/`). Linhas são aproximadas (arquivos no commit citado).

## Hero e descrição
| Afirmação | Origem |
|---|---|
| "App para Windows que agenda o desligamento do PC e controla a energia pelo celular" | Resumo do dono na vitrine; `Notas/README.md` (Objetivo) |
| Versão 1.2.0 | `DR/app.go` (appVersion), `DR/app.manifest` |
| Em desenvolvimento, sem download público | Pedido do dono; `Notas/ESTADO_ATUAL.md` (nenhuma release no GitHub); repositório privado |

## O que faz
| Afirmação | Origem |
|---|---|
| Atalhos de 1 min a 4 h (1, 3, 5, 10, 15, 30, 45, 60, 90, 120, 180, 240 min) | `DR/web/app.js` linha 4 (PRESETS) |
| Outro tempo até 7 dias | `DR/server.go` POST schedule (1 a 7*24*60 minutos); `DR/web/index.html` (customMin max 10080) |
| Horário do dia; passou, vale amanhã | `DR/server.go` POST schedule (campo `at`, `AddDate(0,0,1)`) |
| Desligar/reiniciar agora (poucos segundos) | `DR/server.go` (`req.Now` → 5 s) |
| Cancelar (PC, celular, bandeja) | `DR/server.go` POST cancel; `DR/tray_windows.go` (Cancelar agendamento) |
| Rotinas: dias, horário, desligar ou reiniciar, até 10 | `DR/routines.go` (validateRoutine); `DR/server.go` (limite de 10) |
| Rotina agenda para 1 min depois (aviso, cancelável) | `DR/routines.go` (routineWarn = 60); `DR/web/index.html` (banner das rotinas) |
| Rotina ignorada se já há agendamento, e registrada | `DR/routines.go` (runRoutines, "Rotina ignorada") |
| Rotina só com PC ligado e acordado | `DR/web/index.html` (banner das rotinas) |
| Bloquear tela, suspender, hibernar; painel continua ao bloquear; suspender/hibernar tiram o painel do ar | `DR/power.go`; `DR/os_windows.go` (osPower); `DR/web/index.html` (seção Energia) |
| Hibernar só se a hibernação estiver ligada | `DR/power.go` (hibernateEnabled); `DR/os_windows.go` (osHibernateEnabled) |
| QR code ou endereço + PIN de 6 números | `DR/server.go` (links, /pair, /api/login); `DR/web/index.html` (login e Celular) |
| Lista de aparelhos com nome, desde, último acesso e desconectar | `DR/app.go` (deviceList, revokeDevice, deviceLabel em server.go); `DR/web/app.js` |
| Adicionar à tela inicial | `DR/web/app.js` linhas ~467-469 (passos do QR) |
| Bandeja: ícone muda com agendamento; menu (tempo restante, abrir, 30 min/1 h/2 h, reiniciar em 1 min, cancelar, conectar celular, iniciar com Windows, sair) | `DR/tray_windows.go` |
| Sair não cancela o agendamento | `DR/tray_windows.go` (dica do item Sair); o agendamento é do próprio Windows (`DR/os_windows.go`, shutdown.exe /t) |
| Iniciar com o Windows | `DR/app.go` (SetAutostart); `DR/os_windows.go` (chave Run); `DR/web/index.html` |
| Bloquear a tela ao iniciar o Windows; só logo depois de ligar o PC; para login automático | `DR/app.go` (shouldLockOnBoot, uptime < 10 min); `DR/main.go`; `DR/web/index.html` (texto do ajuste) |
| Não deixar o PC dormir; tela ainda pode apagar | `DR/os_windows.go` (osKeepAwake); `DR/web/index.html` |
| Forçar o fechamento de programas; o que não foi salvo se perde; ligado por padrão na primeira execução | `DR/os_windows.go` (/f); `DR/web/index.html`; `DR/app.go` (loadApp: isNew → Force=true) |
| Wake on LAN: preparar o PC (liga na placa, desativa Inicialização Rápida); BIOS, cabo, app no celular | `DR/os_windows.go` (osPrepareWake); `DR/wake.go`; `DR/web/index.html` (seção Ligar à distância) |
| RustDesk: não transmite a tela, detecta, mostra endereço, abre no PC | `DR/remote.go` (comentário inicial); `DR/remote_windows.go`; `DR/web/app.js` (renderRemote) |
| Processos: processador, memória, tempo ligado, lista | `DR/procs.go` (ProcReport); `DR/web/index.html` (Processos) |
| Atividade recente com origem (PC, celular, bandeja, rotina) | `DR/app.go` (Events, source); `DR/server.go` (sourceOf); `DR/tray_windows.go`; `DR/routines.go` |

## Como funciona
| Afirmação | Origem |
|---|---|
| Primeira abertura instala na pasta do usuário, cria atalhos, fica na bandeja | `DR/main.go` (cópia para dataDir, osCreateShortcuts); `DR/app.go` (dataDir = LOCALAPPDATA\Programs); `DR/os_windows.go` (atalhos) |
| Sem conta, sem nuvem | `DR/*.go`: nenhuma chamada de rede para fora; só `127.0.0.1` e o servidor local (busca por http.Get/Dial) |
| Anel de contagem regressiva no painel | `DR/web/index.html` (ringbox) |
| QR no mesmo Wi-Fi; PIN; cada QR vale para um aparelho | `DR/server.go` (consumePairKey); `DR/web/app.js` (steps); `Notas/DECISOES.md` |

## Segurança (comportamento, sem detalhes internos)
| Afirmação | Origem |
|---|---|
| Sem entrar não vê o estado nem manda comandos | `DR/server.go` (state: authorized=false; auth() devolve 401) |
| QR de uso único, muda após o uso | `DR/server.go`/`DR/app.go` (consumePairKey); `DR/server_test.go` (TestQRDeUsoUnico); `Notas/DECISOES.md` |
| PIN só aparece no painel do PC | `DR/server.go` (state: pin só se isLocal) |
| Bloqueio por endereço (5 min) e bloqueio global de entradas (5 min); aviso no painel e no histórico | `DR/server.go` (limiter, "Entrada bloqueada por 5 min"); `DR/web/index.html` (loginBlockedBanner); `DR/server_test.go` (TestBloqueioGlobalDeEntradas). Os limites numéricos NÃO são publicados |
| Aparelho por aparelho; desconectar só no PC; novo PIN desconecta todos; 90 dias sem uso expira | `DR/app.go` (sessionIdleLimit, RotatePIN, revokeDevice); `DR/server.go` (revoke localOnly) |
| Só no PC: rotinas, PIN, aparelhos, iniciar com Windows, bloquear ao iniciar, preparar rede, desinstalar | `DR/server.go` (auth(true, ...) nas rotas correspondentes) |
| Celular agenda, cancela, controla energia | `DR/server.go` (auth(false, ...)) |
| Pedidos de outros sites recusados | `DR/server.go` (guard: Origin e cabeçalho de pedido) |
| Conexão é HTTP, sem HTTPS | `DR/server.go` (links montados com `http://`) |
| Tailscale (instalado à parte) dá endereço "De qualquer lugar" | `DR/server.go` (networkAddrs, links); `DR/web/index.html` (banner Fora de casa) |
| Senha do RustDesk não passa pelo programa | `DR/remote.go` (comentário); `DR/web/index.html` |

## Requisitos
| Afirmação | Origem |
|---|---|
| Windows 10 ou 11 | `DR/app.manifest` (supportedOS Windows 10/11); `DR/go.mod` (Go 1.24, que exige Windows 10+) |
| Sem Mac/Linux | `DR/os_other.go` é só um modo de teste que não desliga nada |
| Sem administrador para usar; admin só para firewall e Wake on LAN | `DR/app.manifest` (asInvoker); `DR/os_windows.go` (runElevated em osAllowFirewall e osPrepareWake) |
| Janela WebView2, com reserva no Edge/Chrome | `DR/window_windows.go` (runUI) |
| Celular: iPhone, Android ou outro com navegador; sem instalar nada | `DR/server.go` (deviceName); `DR/web/manifest.webmanifest` |
| Mesma rede (servidor escuta em todas as interfaces) e botão de liberar firewall | `DR/main.go` (net.Listen ":porta"); `DR/server.go` (/api/firewall); `DR/web/index.html` |

## Identidade
Cor menta `#2ec4a6` e preto `#000000`: lidos dos pixels de `DR/assets/icon.png`. O logo é redesenho em SVG do ícone.
