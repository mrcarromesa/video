# Building video Play

## MPEG-DASH

https://www.cloudflare.com/pt-br/learning/video/what-is-mpeg-dash/


- é um método de streaming. DASH significa "streaming adaptável" dinâmico por HTTP. como o MPEG-DASH  é baseado em HTTP qualquer servidor de origem comum pode veicular o streaming
- é semelhante ao HLS,pois divide os vídeos em partes menores e codifica esses blocos em diferentes níveis de qualidade, permitindo transmitir vídeos em diferentes níveis de qualidade e alternar de um nível de qualidade para outro no meio da reprodução

### Como funciona o MPEG-DASH

1 - Codificação e segmentação: No server-side o arquivo de vídeo é quebrado em pequenos pedaços (segundos de duração) e é atrelado um arquivo de índice ou sumário para mapear os pedaços do vídeo, e os pedaços são códificados para formatos suportados para os mais diversos dispositivos

2 - Transmissão: O usuário começa a assistir o streaming, os segmentos (pedaços) do vídeo são codificados e enviados para o dispositivo do usuário via internet em geral utilizando CDN.

3 - Decodificação e reprodução: ao receber os dados transmitidos, os segmentos ou pedaços, do vídeo o dispositivo do usuário decodifica e reproduz o vídeo, o player de vídeo trabalhando no modo Auto pode alternar a qualidade do vídeo dependendo da condição de Rede. Caso o usuário tenha pouca largura de banda, o vídeo será reproduzido em qualidade mais baixa.

---

## MSE

- Media Source API, ou Media Source Extensions (MSE), fornece fucnionalidade que permite mídia de streaming para web sem plug-ins.
Os fluxos de midia podem ser criados através do JS e reproduzidos usando `<audio>` e `<video>`

## HLS

https://www.cloudflare.com/pt-br/learning/video/what-is-http-live-streaming/

- HTTP Live Streaming (HLS) é um protocolo de transmissão de vídeo.
- é utilizado para streaming ao vivo, e também sob demanda.
- Divide o arquivos HTTP menores para download e os distribui usando o protocolo HTTP. 
- Os dispositivos carregam os arquivos e reproduzem em forma de vídeo.

---

## Escolher encoder

https://support.google.com/youtube/answer/2853702#zippy=%2Ck-p-fps

---

## M3U8

Um arquivo com a extensão de arquivo M3U8 é um arquivo de lista de reprodução de áudio codificado em UTF-8. Eles são arquivos de texto simples que podem ser usados por players de áudio e vídeo para descrever onde os arquivos de mídia estão localizados.

Exemplo, observe os comentários:

```m3u8
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:8
#EXT-X-MEDIA-SEQUENCE:0
# Segmento com 8.3 segundos <---
#EXTINF:8.333333,
# endereço/nome do segmento <---
output0.ts
# Segmento com 8.3 segundos <---
#EXTINF:8.333333,
# endereço/nome do segmento <---
output1.ts
# Segmento com 8.3 segundos <---
#EXTINF:8.333333,
output2.ts
# Segmento com 5.0 segundos <---
#EXTINF:5.033333,
# endereço/nome do segmento <---
output3.ts
#EXT-X-ENDLIST
```

---

### Gerar os segmentos e o arquivo de lista de reprodução a partir de um arquivo .mp4

- Para tal iremos utilizar o `FFMPEG`, para tal estamos utilizando o docker.
- Para iniciar executar o comando:

```shell
docker compose up --build
```

- Depois de o container ter subido executar o comando em outro terminal:

```shell
docker compose exec app sh
```

- Dessa forma iremos acessar o container

- Já dentro do container acessar a pasta do vídeo: 

```shell
cd /tmp/videos
```

- E executar o seguinte comando para gerar os arquivos `.ts` e o output.m3u8:

```shell
ffmpeg -i video.mp4 -profile:v baseline -level 3.0 -start_number 0 -hls_time 1 -hls_list_size 0 -f hls output.m3u8
```

- Com o vídeo que estamos utilizando de exemplo deverá ser gerado 3 arquivos `.ts` e um arquivo `output.m3u8` na pasta `public/videos/`

---

### Executando os arquivos com a tag `<video>`

- Para tal utilizamos o framewor `express` para criação das rotas no arquivo `index.js` o qual definimos um endereço pelo qual ele irá servir os arquivos da lista de reprodução
contida no arquivo `public/videos/output.m3u8`:

```js
app.get("/video/:path", (request, response) => {
  var filePath = path.resolve(".", "public", "videos", request.params.path);
  console.log("request starting...", filePath);

  fs.readFile(filePath, (error, content) => {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });

    if (error) {
      if (error.code == "ENOENT") {
        response.end('Not found', "utf-8");
      } else {
        response.writeHead(500);
        response.end(
          "Sorry, check with the site admin for error: " + error.code + " ..\n"
        );
        response.end();
      }
    } else {
      response.end(content, "utf-8");
    }
  });
});
```

- Feito isso só executar em um terminal --Aqui não está sendo utilizado o container docker--:

```shell
node index.js
```

- No frontend está sendo utilizado o videojs em `frontend/index.html` e observando no fonte estamos passando a url da rota para acessar a lista de reprodução do vídeo:

```html
http://localhost:3003/video/output.m3u8
```

---

## Alguns links que podem ajudar:


https://medium.com/@HoseungJang/video-streaming-with-node-js-9401213a04e7
https://github.com/HoseungJang/express-hls-example


https://github.com/t-mullen/hls-server

https://codepen.io/wgenial/pen/pRRjoY

https://github.com/illuspas/Node-Media-Server


https://superuser.com/questions/1292392/how-to-generate-m3u8-from-a-list-of-files-in-ffmpeg


https://blog.boot.dev/javascript/hls-video-streaming-node/


https://superuser.com/questions/1292392/how-to-generate-m3u8-from-a-list-of-files-in-ffmpeg


https://ffmpeg.org/ffmpeg-formats.html


https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track

---

## Alguns comandos que podem ajudar


ffmpeg -i video.mp4 -profile:v baseline -level 3.0 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls output.m3u8

Motivo pelo qual o hls_time não segue o valor informado:
https://superuser.com/questions/1414310/ffmpeg-ignores-hls-time-argument


ffmpeg -i videos2/friday.mp4 -i videos2/friday.vtt \
  -map 0:v -map 0:a -map 1 \
  -c:v copy -c:a copy -c:s webvtt \
  -metadata:s:s:0 language=en \
  -metadata:s:s:1 language=es \
  -start_number 0 -hls_time 10 -hls_list_size 0 -f hls \
  -var_stream_map "v:0,name:video a:0,s:0,language:eng,name:english a:1,s:1,language:spa,name:espanol"
  -master_pl_name master.m3u8 \
  out/sample.m3u8



ffmpeg -i videos2/friday.mp4 -i videos2/friday.vtt \
-map 0:v -map 0:a -map 1 \
-metadata:s:s:0 language=en \
-c:v copy -c:a copy -c:s webvtt \
-level 3.0 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls \ 
-var_stream_map "v:0,name:video a:0,s:0,language:eng,name:english" \
videos2/output.m3u8


ffmpeg \
-i videos2/friday.mp4 \
-i videos2/friday.vtt \
-c copy -c:s webvtt \
-metadata:s:s:0 language=en \
-start_number 0 -hls_time 10 -hls_list_size 0 \
-f hls \
videos2/output.m3u8
