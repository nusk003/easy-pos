import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { processRequest } from 'graphql-upload';

interface Request extends FastifyRequest {
  isMultipart: boolean;
}

export const graphqlUpload = fp((fastify, _options = {}, done: () => void) => {
  fastify.addContentTypeParser('multipart', (request, _payload, next) => {
    (<Request>request).isMultipart = true;
    next(null);
  });

  fastify.addHook('preValidation', async (request, reply) => {
    if (!(<Request>request).isMultipart) {
      return;
    }

    request.body = await processRequest(request.raw, reply.raw);
  });

  done();
});
