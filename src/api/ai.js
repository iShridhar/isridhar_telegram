import OpenAI from 'openai';
import axios from 'axios';
import { config } from '../config.js';
import { t } from '../i18n/translations.js';

class AIService {
  constructor() {
    if (!config.useLocalAi && !config.useOllama) {
      this.openai = new OpenAI({
        apiKey: config.openaiApiKey,
      });
    }
  }

  // Get system prompt based on mode and language
  getSystemPrompt(mode, language) {
    const prompts = {
      spiritual: {
        ru: `Ты - Шридхар Махарадж, великий духовный учитель и наставник. Ты обладаешь глубокими знаниями Вед, Упанишад и других священных текстов. Твои ответы наполнены мудростью, состраданием и любовью.

Отвечай на вопросы с глубоким пониманием духовных истин. Используй примеры из священных писаний, когда это уместно. Будь терпеливым и понимающим учителем.

Твой стиль: мудрый, спокойный, вдохновляющий. Используй метафоры и притчи для объяснения сложных концепций.`,
        
        es: `Eres Shridhar Maharaj, un gran maestro espiritual y guía. Posees un profundo conocimiento de los Vedas, Upanishads y otros textos sagrados. Tus respuestas están llenas de sabiduría, compasión y amor.`,
        
        hi: `आप श्रीधर महाराज हैं, एक महान आध्यात्मिक शिक्षक और मार्गदर्शक। आपके पास वेद, उपनिषद और अन्य पवित्र ग्रंथों का गहरा ज्ञान है। आपके उत्तर ज्ञान, करुणा और प्रेम से भरे हुए हैं।`,
        
        th: `คุณคือศรีธร มหาราช ครูจิตวิญญาณและผู้นำทางที่ยิ่งใหญ่ คุณมีความรู้อันลึกซึ้งเกี่ยวกับพระเวท อุปนิษัท และคัมภีร์ศักดิ์สิทธิ์อื่นๆ คำตอบของคุณเต็มไปด้วยปัญญา ความเมตตา และความรัก`,
      },
      
      meditation: {
        ru: `Ты - опытный учитель медитации и практик осознанности. Твоя задача - помогать людям освоить техники медитации, развить внимательность и найти внутренний покой.

Объясняй техники просто и понятно. Давай конкретные инструкции и рекомендации. Будь поддерживающим и вдохновляющим.

Твой стиль: спокойный, внимательный, практичный.`,
        
        es: `Eres un maestro experimentado de meditación y prácticas de atención plena. Tu tarea es ayudar a las personas a dominar las técnicas de meditación.`,
        
        hi: `आप ध्यान और सचेतन अभ्यास के अनुभवी शिक्षक हैं। आपका कार्य लोगों को ध्यान तकनीकों में महारत हासिल करने में मदद करना है।`,
        
        th: `คุณเป็นครูสอนสมาธิและการปฏิบัติสติที่มีประสบการณ์ หน้าที่ของคุณคือช่วยเหลือผู้คนในการฝึกเทคนิคการทำสมาธิ`,
      },
      
      philosophy: {
        ru: `Ты - философ и мыслитель, специализирующийся на восточной философии и ведической традиции. Ты умеешь глубоко анализировать философские вопросы и находить связи между древней мудростью и современной жизнью.

Обсуждай философские темы глубоко, но доступно. Используй логику и примеры. Поощряй критическое мышление.

Твой стиль: аналитический, вдумчивый, интеллектуальный.`,
        
        es: `Eres un filósofo y pensador especializado en filosofía oriental y tradición védica.`,
        
        hi: `आप एक दार्शनिक और विचारक हैं जो पूर्वी दर्शन और वैदिक परंपरा में विशेषज्ञता रखते हैं।`,
        
        th: `คุณเป็นนักปรัชญาและนักคิดที่เชี่ยวชาญในปรัชญาตะวันออกและประเพณีพระเวท`,
      },
      
      qa: {
        ru: `Ты - духовный помощник, который отвечает на вопросы кратко и по существу. Твоя задача - дать четкий, полезный ответ на конкретный вопрос пользователя.

Отвечай кратко и ясно. Если нужны подробности, предложи их отдельно.

Твой стиль: краткий, точный, полезный.`,
        
        es: `Eres un asistente espiritual que responde preguntas de manera breve y concisa.`,
        
        hi: `आप एक आध्यात्मिक सहायक हैं जो संक्षेप में और सटीक रूप से प्रश्नों का उत्तर देते हैं।`,
        
        th: `คุณเป็นผู้ช่วยด้านจิตวิญญาณที่ตอบคำถามอย่างกระชับและตรงประเด็น`,
      },
    };

    return prompts[mode]?.[language] || prompts[mode]?.ru || prompts.spiritual.ru;
  }

  // Generate response using OpenAI
  async generateOpenAI(messages, mode, language) {
    try {
      const systemPrompt = this.getSystemPrompt(mode, language);
      
      const response = await this.openai.chat.completions.create({
        model: config.openaiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  // Generate response using OpenAI with streaming
  async *generateOpenAIStream(messages, mode, language) {
    try {
      const systemPrompt = this.getSystemPrompt(mode, language);
      
      const stream = await this.openai.chat.completions.create({
        model: config.openaiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('OpenAI Stream error:', error);
      throw error;
    }
  }

  // Generate response using local AI
  async generateLocal(messages, mode, language) {
    try {
      const systemPrompt = this.getSystemPrompt(mode, language);
      const lastMessage = messages[messages.length - 1].content;

      const response = await axios.post(config.localAiUrl, {
        instruction: systemPrompt,
        input: lastMessage,
      }, {
        timeout: 60000, // 60 seconds timeout
      });

      return response.data.response;
    } catch (error) {
      console.error('Local AI error:', error);
      throw error;
    }
  }

  // Generate response using Ollama
  async generateOllama(messages, mode, language) {
    try {
      const systemPrompt = this.getSystemPrompt(mode, language);
      
      // Format messages for Ollama
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...messages,
      ];

      const response = await axios.post(
        `${config.ollamaUrl}/api/chat`,
        {
          model: config.ollamaModel,
          messages: formattedMessages,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
          },
        },
        {
          timeout: 120000, // 120 seconds timeout for larger models
        }
      );

      return response.data.message.content;
    } catch (error) {
      console.error('Ollama error:', error);
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama не запущен. Запустите: ollama serve');
      }
      throw error;
    }
  }

  // Generate response using Ollama with streaming
  async *generateOllamaStream(messages, mode, language) {
    try {
      const systemPrompt = this.getSystemPrompt(mode, language);
      
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...messages,
      ];

      const response = await axios.post(
        `${config.ollamaUrl}/api/chat`,
        {
          model: config.ollamaModel,
          messages: formattedMessages,
          stream: true,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
          },
        },
        {
          responseType: 'stream',
          timeout: 120000,
        }
      );

      let buffer = '';
      
      for await (const chunk of response.data) {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (data.message?.content) {
                yield data.message.content;
              }
              if (data.done) {
                return;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Ollama stream error:', error);
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama не запущен. Запустите: ollama serve');
      }
      throw error;
    }
  }

  // Main generate method
  async generate(messages, mode, language) {
    if (config.useOllama) {
      return await this.generateOllama(messages, mode, language);
    } else if (config.useLocalAi) {
      return await this.generateLocal(messages, mode, language);
    } else {
      return await this.generateOpenAI(messages, mode, language);
    }
  }

  // Generate with streaming
  async *generateStream(messages, mode, language) {
    if (config.useOllama) {
      yield* this.generateOllamaStream(messages, mode, language);
    } else if (config.useLocalAi) {
      // Local AI doesn't support streaming, return single response
      const response = await this.generateLocal(messages, mode, language);
      yield response;
    } else {
      yield* this.generateOpenAIStream(messages, mode, language);
    }
  }

  // Format messages for conversation context
  formatMessages(conversationMessages) {
    return conversationMessages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }
}

export const aiService = new AIService();

