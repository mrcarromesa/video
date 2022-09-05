# Blob

Como que é gerado a url blob:http… do vídeo nas plataformas de vídeo dentro do src da tag video?

[https://stackoverflow.com/questions/30864573/what-is-a-blob-url-and-why-it-is-used](https://stackoverflow.com/questions/30864573/what-is-a-blob-url-and-why-it-is-used)

Blob URLs (ref W3C, nome oficial) ou Object-URLs (ref. MDN e nome do método) são usados com um objeto Blob ou File.

> *src="blob:[https://crap.crap](https://crap.crap/)" Abri a url do blob que estava no src do vídeo deu erro e não consigo abrir mas estava trabalhando com a tag src como é possível?*
> 

Os URLs de blob só podem ser gerados internamente pelo navegador. URL.createObjectURL() criará uma referência especial para o objeto Blob ou File que posteriormente pode ser liberada usando URL.revokeObjectURL(). Esses URLs só podem ser usados localmente em uma única instância do navegador e na mesma sessão (ou seja, a vida útil da página/documento).

> **O que é URL de blob?
Por que é usado?**
> 

Blob URL/Object URL é um **pseudoprotocolo** para permitir que objetos Blob e File sejam usados como fonte de URL para coisas como imagens, links de download para dados binários e assim por diante.

Por exemplo, você não pode entregar um byte-data bruto de objeto Image, pois ele não saberia o que fazer com ele. Requer, por exemplo, que imagens (que são dados binários) sejam carregadas por meio de URLs. Isso se aplica a qualquer coisa que exija um URL como fonte. Em vez de fazer o upload dos dados binários e servi-los de volta por meio de uma URL, é melhor usar uma etapa local extra para poder acessar os dados diretamente sem passar por um servidor.

Também é uma alternativa melhor para Data-URI que são strings codificadas como Base-64. O problema com Data-URI é que cada caractere leva dois bytes em JavaScript. Além disso, um 33% é adicionado devido à codificação Base-64. Blobs são arrays de bytes binários puros que não têm nenhuma sobrecarga significativa como Data-URI, o que os torna mais rápidos e menores de manusear.

> **Posso criar meu próprio URL de blob em um servidor?**
> 

Não, URLs de Blob/URLs de Objetos só podem ser criados internamente no navegador. Você pode fazer Blobs e obter o objeto File por meio da API File Reader, embora BLOB signifique apenas Binary Large OBject e seja armazenado como matrizes de bytes. Um cliente pode solicitar que os dados sejam enviados como ArrayBuffer ou como um Blob. O servidor deve enviar os dados como dados binários puros. Bancos de dados geralmente usam Blob para descrever objetos binários também e, em essência, estamos falando basicamente de matrizes de bytes.

---

CreateObjectURL e RevokeObjectURL

[https://www.youtube.com/watch?v=18q6-QR_XXY](https://www.youtube.com/watch?v=18q6-QR_XXY)