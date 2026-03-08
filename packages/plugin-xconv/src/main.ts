import type { PluginContext } from '@xtory/plugin-api';
import ConversationService from './service.js';

export default function ({ logger, api }: PluginContext) {
  api
    .addService(
      'conversations',
      () => new ConversationService(logger, api.projectPath)
    )
    .addFileView('flow')
    .setFileType('xconv')
    .createMenuItem('New Conversation', 'templates/empty.xconv')
    .setNodes([
      {
        type: 'StartConversation',
        connections: { in: 0, out: -1 },
        renderer: 'xconv/StartConversationNode',
      },
      {
        type: 'Text',
        connections: { in: -1, out: 1 },
        renderer: 'xconv/TextNode',
      },
      {
        type: 'Choice',
        connections: { in: -1, out: 1 },
        renderer: 'xconv/ChoiceNode',
      },
      {
        type: 'Set',
        connections: { in: -1, out: 1 },
        renderer: 'xconv/SetNode',
      },
      {
        type: 'Branch',
        connections: { in: -1, out: -1 },
        renderer: 'xconv/BranchNode',
      },
      {
        type: 'Random',
        connections: { in: -1, out: -1 },
        renderer: 'xconv/RandomNode',
      },
      {
        type: 'Function',
        connections: { in: -1, out: 1 },
        renderer: 'xconv/FunctionNode',
      },
      {
        type: 'EndConversation',
        connections: { in: -1, out: 0 },
        renderer: 'xconv/EndConversationNode',
      },
    ]);

  // Add Conversation node to xflow if it exists
  api
    .addFileView('flow')
    .setFileType('xflow')
    .setOptional(true)
    .setNodes([
      {
        type: 'Conversation',
        connections: { in: 1, out: 1 },
        renderer: 'xconv/ConversationNode',
      },
    ]);
}
