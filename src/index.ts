import { Notification } from './types';

  const allowedOrigins = [
	'http://localhost:3000',
	'http://127.0.0.1:3000',
	'https://negramidiav2.pages.dev',
	'https://negramidia.net',
	'https://negramidia.online',
  ]

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		//utiliza headers cors para as requisições e trata o preflight
		const origin = request.headers.get('Origin') ?? '';
		const corsHeaders = {
			"Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : '',
			'Access-Control-Allow-Credentials': 'true',
			"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
			'Access-Control-Allow-Headers': '*',
			"Access-Control-Max-Age": "86400",
		  };
		if (request.method === 'OPTIONS') {
			return new Response(null, {
			  headers: corsHeaders
			})
		}

		try {
			var notification: Notification = await request.json();

			//Adiciona linha no excel através da API no Azure Functions
			var resultGSheet = await fetch(env.AzureFunctionURI,{
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				  'X-Functions-Key': env.AzureFunctionAPIKey
				},
				body: JSON.stringify(notification)
			  });

			return new Response('Mensagem publicada com sucesso.', { status: 200, statusText: 'Sucesso', headers: corsHeaders});
		}
		catch (error) {
			return new Response('Houve um erro ao enviar sua mensagem.', {status: 500, statusText: 'Erro inesperado.', headers: corsHeaders});
		}
	}
}
