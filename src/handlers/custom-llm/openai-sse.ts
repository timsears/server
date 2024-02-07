import { Request, Response } from 'express';
import OpenAI from 'openai';
import { envConfig } from '../../config/env.config';

const openai = new OpenAI({ apiKey: envConfig.openai.apiKey });

export const openaiSSE = async (req: Request, res: Response) => {
  try {
    const {
      model,
      messages,
      max_tokens,
      temperature,
      call,
      stream,
      ...restParams
    } = req.body;

    console.log(req.body);

    if (stream) {
      const completionStream = await openai.chat.completions.create({
        model: model || 'gpt-3.5-turbo',
        ...restParams,
        messages,
        max_tokens: max_tokens || 150,
        temperature: temperature || 0.7,
        stream: true,
      } as OpenAI.Chat.ChatCompletionCreateParamsStreaming);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const data of completionStream) {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
      res.end();
    } else {
      const completion = await openai.chat.completions.create({
        model: model || 'gpt-3.5-turbo',
        ...restParams,
        messages,
        max_tokens: max_tokens || 150,
        temperature: temperature || 0.7,
        stream: false,
      });
      return res.status(200).json(completion);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
};
