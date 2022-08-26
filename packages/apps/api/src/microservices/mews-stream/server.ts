import { mewsStream } from './mews-stream';
import { MewsStreamService } from './mews-stream.service';

mewsStream.get('/', (_req, res) => {
  return res.sendStatus(200);
});

mewsStream.listen(80, async () => {
  const mewsStreamService = MewsStreamService.getInstance();
  await mewsStreamService.initClients();
});
