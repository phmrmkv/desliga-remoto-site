# desliga-remoto-site

Site de apresentação (landing page) do **desliga-remoto**, app para Windows que agenda o desligamento do PC e controla a energia pelo celular. Ferramenta da PHMR Tech Solutions, em desenvolvimento e sem download público.

- Astro (saída estática), TypeScript estrito, Tailwind CSS 4. Só pt-BR, temas claro e escuro.
- Domínio de publicação: https://desliga-remoto.phmr.com.br (hospedagem Apache: `public/.htaccess`).
- Cada afirmação da página tem origem em `docs/fontes.md`. O logo é o ícone real do app redesenhado em SVG.

## Como rodar

```
npm install
npm run dev        # desenvolvimento
npm run check      # astro check
npm run build      # gera dist/
npm run preview    # serve dist/ na porta 4401
npm run marca      # regera favicon-32.png, apple-touch-icon.png e og-image.jpg (sharp)
```

## Onde publica

O conteúdo de `dist/` vai para o subdomínio acima. O botão "Baixar para Windows" só abre um aviso: ainda não há download.
