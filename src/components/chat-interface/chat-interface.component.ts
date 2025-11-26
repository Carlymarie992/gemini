import { ChangeDetectionStrategy, Component, inject, signal, OnInit, OnDestroy, WritableSignal } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chat } from '@google/genai';

interface ChatMessage {
  sender: 'user' | 'gemini';
  text: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-chat-interface',
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md mb-6 w-full lg:w-1/2">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">AI Chat Assistant</h2>

      <div class="flex items-center space-x-4 mb-4">
        <label class="flex items-center">
          <input
            type="checkbox"
            [(ngModel)]="useStreaming"
            class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
          />
          <span class="ml-2 text-gray-700">Stream Response</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            [(ngModel)]="useLowLatency"
            class="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out"
          />
          <span class="ml-2 text-gray-700">Low Latency (Disabled Thinking)</span>
        </label>
        <button
          (click)="toggleTTS()"
          class="px-3 py-1 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          {{ ttsEnabled() ? 'Disable TTS' : 'Enable TTS' }}
        </button>
      </div>

      <div class="h-80 overflow-y-auto border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
        @for (message of messages(); track $index) {
          <div
            [class.text-right]="message.sender === 'user'"
            [class.text-left]="message.sender === 'gemini'"
            class="mb-2"
          >
            <span
              [class.bg-blue-500]="message.sender === 'user'"
              [class.bg-gray-300]="message.sender === 'gemini'"
              [class.text-white]="message.sender === 'user'"
              [class.text-gray-800]="message.sender === 'gemini'"
              class="inline-block p-2 rounded-lg max-w-lg break-words"
            >
              {{ message.text }}
            </span>
          </div>
        }
        @if (geminiService.loading() && !streamingResponse()) {
          <div class="text-center text-gray-500 italic">Thinking...</div>
        }
        @if (streamingResponse()) {
          <div class="text-left mb-2">
            <span class="inline-block p-2 rounded-lg max-w-lg break-words bg-gray-300 text-gray-800">
              {{ streamingResponse() }}<span class="animate-pulse">_</span>
            </span>
          </div>
        }
      </div>

      <div class="flex">
        <input
          type="text"
          [(ngModel)]="userMessage"
          (keyup.enter)="sendMessage()"
          placeholder="Ask me anything..."
          class="flex-1 border border-gray-300 p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          [disabled]="geminiService.loading()"
        />
        <button
          (click)="sendMessage()"
          [disabled]="!userMessage.trim() || geminiService.loading()"
          class="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
      @if (geminiService.error()) {
        <p class="text-red-500 mt-2 text-sm">{{ geminiService.error() }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatInterfaceComponent implements OnInit, OnDestroy {
  geminiService = inject(GeminiService);
  userMessage: string = '';
  messages = signal<ChatMessage[]>([]);
  streamingResponse = signal<string>('');
  useStreaming: boolean = true;
  useLowLatency: boolean = false; // Controls thinkingBudget: 0 for disabled thinking
  ttsEnabled = signal(false);

  private chat: Chat | undefined; // Make it possibly undefined to handle API key errors

  ngOnInit(): void {
    // Initialize chat when component is created
    this.initChat();
  }

  ngOnDestroy(): void {
    // Optionally clean up chat resources if any, though the SDK typically handles this.
  }

  // Fix: Initialize chat in a dedicated method to handle API key errors gracefully.
  private initChat(): void {
    if (this.geminiService.error()) {
      console.warn('Chat initialization skipped due to Gemini API key error.');
      return;
    }
    // Fix: startChat no longer takes useLowLatencyConfig here; thinking is handled per message.
    this.chat = this.geminiService.startChat();
  }

  async sendMessage(): Promise<void> {
    if (!this.userMessage.trim() || this.geminiService.loading() || !this.chat) {
      return;
    }

    const currentMessage = this.userMessage;
    this.messages.update((msgs) => [...msgs, { sender: 'user', text: currentMessage }]);
    this.userMessage = '';
    this.streamingResponse.set('');

    const messageConfig = this.useLowLatency ? { thinkingBudget: 0 } : undefined;

    try {
      if (this.useStreaming) {
        // Fix: Pass messageConfig to sendMessageStream for per-message thinking control.
        const stream = await this.geminiService.sendMessageStream(this.chat, currentMessage, messageConfig);
        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse += chunk;
          this.streamingResponse.set(fullResponse);
        }
        this.messages.update((msgs) => [...msgs, { sender: 'gemini', text: fullResponse }]);
        if (this.ttsEnabled()) {
          await this.speakResponse(fullResponse);
        }
        this.streamingResponse.set('');
      } else {
        // Fix: Pass messageConfig to sendMessage for per-message thinking control.
        const response = await this.geminiService.sendMessage(this.chat, currentMessage, messageConfig);
        this.messages.update((msgs) => [...msgs, { sender: 'gemini', text: response }]);
        if (this.ttsEnabled()) {
          await this.speakResponse(response);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Error handling is managed by the service, but we can add a local message if needed.
    }
  }

  async speakResponse(text: string): Promise<void> {
    if (!this.ttsEnabled() || !text) {
      return;
    }
    try {
      // Fix: Call the textToSpeech service method and play the audio blob.
      const audioBlob = await this.geminiService.textToSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl); // Clean up the object URL after playback
      };
    } catch (error) {
      console.error('Error speaking text:', error);
      // Handle TTS error
    }
  }

  toggleTTS() {
    this.ttsEnabled.update(value => !value);
  }
}