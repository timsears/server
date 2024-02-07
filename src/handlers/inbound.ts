import { Request, Response } from 'express';
import { VapiPayload, VapiWebhookEnum } from '../types/vapi.types';

export const inboundHandler = async (req: Request, res: Response) => {
  try {
    const payload = req.body.message as VapiPayload;
    switch (payload.type) {
      case VapiWebhookEnum.ASSISTANT_REQUEST: {
        /**!SECTION
         * Handle Business logic here.
         * This is triggered when someone calls your registered number with Vapi
         * You can fetch your database to see if there is an existing assistant associated with this call. If yes, return the assistant.
         * You can also fetch some params from your database to create the assistant and return it.
         * You can have various predefined static assistant here and return them based on the call details.
         */

        const assistant = payload.call
          ? {
              name: 'Paula',
              model: {
                provider: 'openai',
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                systemPrompt:
                  "You're Paula, an AI assistant who can help user draft beautiful emails to their clients based on the user requirements. Then Call sendEmail function to actually send the email.",
                functions: [
                  {
                    name: 'sendEmail',
                    description:
                      'Send email to the given email address and with the given content.',
                    parameters: {
                      type: 'object',
                      properties: {
                        email: {
                          type: 'string',
                          description:
                            'Email to which we want to send the content.',
                        },
                        content: {
                          type: 'string',
                          description:
                            'Actual Content of the email to be sent.',
                        },
                      },
                      required: ['email'],
                    },
                  },
                ],
              },
              voice: {
                provider: '11labs',
                voiceId: 'paula',
              },
              firstMessage: "Hi, I'm Paula, your personal email assistant.",
            }
          : null;
        if (assistant) return { assistant };
        break;
      }
      default: {
        throw new Error(`Unhandled message type`);
      }
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
