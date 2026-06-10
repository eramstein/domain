import { Mistral } from '@mistralai/mistralai'

import type { ResolvedAction } from '@/types'

export type MistralModel =
  | 'mistral-small-latest'
  | 'mistral-medium-latest'
  | 'mistral-large-latest'

export interface LLMOptions {
  model?: string
  temperature?: number
}

export interface ActionToolParameter {
  name: string
  type: string
  description: string
  enum?: string[]
}

export interface ActionTool {
  id: string
  name: string
  description: string
  parameters: ActionToolParameter[]
}

export interface PlaceLabel {
  id: string
  name: string
}

const DEFAULT_MODEL = 'mistral-small-latest'

export class LLMService {
  private client: Mistral | null = null
  private apiKey: string | null = null

  constructor() {
    this.apiKey = import.meta.env.VITE_MISTRAL_API_KEY || null
    if (this.apiKey) {
      this.client = new Mistral({ apiKey: this.apiKey })
    }
  }

  async chat(
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    options: LLMOptions = {},
  ) {
    if (!this.client) {
      console.warn('Mistral API Key not found. Returning mock response.')
      return this.getMockChatResponse(messages)
    }

    try {
      const result = await this.client.chat.complete({
        model: options.model || DEFAULT_MODEL,
        messages,
        temperature: options.temperature ?? 0.7,
      })

      return result.choices?.[0]?.message?.content || 'No response'
    } catch (error) {
      console.error('LLM Error:', error)
      return 'Sorry, I encountered an error connecting to the brain center.'
    }
  }

  async resolveActions(
    text: string,
    tools: ActionTool[],
    placeLabels: PlaceLabel[],
  ): Promise<ResolvedAction[]> {
    if (!this.client) {
      return this.mockResolveActions(text, tools, placeLabels)
    }

    try {
      const mistralTools = tools.map((tool) => ({
        type: 'function' as const,
        function: {
          name: tool.id,
          description: tool.description,
          parameters: {
            type: 'object',
            properties: Object.fromEntries(
              tool.parameters.map((parameter) => [
                parameter.name,
                {
                  type: parameter.type,
                  description: parameter.description,
                  ...(parameter.enum ? { enum: parameter.enum } : {}),
                },
              ]),
            ),
            required: tool.parameters.map((parameter) => parameter.name),
          },
        },
      }))

      const placeList = placeLabels
        .map((place) => `${place.id} (${place.name})`)
        .join(', ')

      const result = await this.client.chat.complete({
        model: DEFAULT_MODEL,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content:
              'You resolve player intent into game actions. Call the matching tool when the player wants to perform an action. If the text does not describe a game action, do not call any tool.',
          },
          {
            role: 'user',
            content: `Player text: ${text}\n\nKnown places: ${placeList}`,
          },
        ],
        tools: mistralTools,
        toolChoice: 'auto',
      })

      const toolCalls = result.choices?.[0]?.message?.toolCalls ?? []
      return toolCalls.map((toolCall) => {
        const rawArguments = toolCall.function.arguments
        const parameters =
          typeof rawArguments === 'string'
            ? (JSON.parse(rawArguments) as Record<
                string,
                string | number | boolean
              >)
            : rawArguments

        return {
          actionId: toolCall.function.name,
          parameters,
        }
      })
    } catch (error) {
      console.error('LLM action resolution error:', error)
      return this.mockResolveActions(text, tools, placeLabels)
    }
  }

  private mockResolveActions(
    text: string,
    tools: ActionTool[],
    placeLabels: PlaceLabel[],
  ): ResolvedAction[] {
    const lower = text.toLowerCase().trim()
    if (
      !/(go to|goto|head to|travel to|visit|walk to|move to)/.test(lower)
    ) {
      return []
    }

    if (!tools.some((tool) => tool.id === 'goto')) {
      return []
    }

    for (const place of placeLabels) {
      const nameLower = place.name.toLowerCase()
      const idAsWords = place.id.replace(/-/g, ' ')
      if (lower.includes(nameLower) || lower.includes(idAsWords)) {
        return [{ actionId: 'goto', parameters: { placeId: place.id } }]
      }
    }

    return []
  }

  private getMockChatResponse(messages: { role: string; content: string }[]) {
    const lastMessage = messages[messages.length - 1].content.toLowerCase()

    if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
      return "Hi there! I'm your OrientationIA agent. What's on your mind today?"
    }

    return 'That sounds interesting! Tell me more about your experience with that.'
  }
}

export const llmService = new LLMService()
