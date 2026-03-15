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
        connections: { in: 0, out: undefined },
        renderer: 'xconv/StartConversationNode',
      },
      {
        type: 'Text',
        connections: { in: undefined, out: undefined },
        renderer: 'xconv/TextNode',
      },
      {
        type: 'Choice',
        connections: { in: undefined, out: undefined },
        renderer: 'xconv/ChoiceNode',
      },
      {
        type: 'Set',
        connections: { in: undefined, out: undefined },
        renderer: 'xconv/SetNode',
      },
      {
        type: 'Branch',
        connections: { in: undefined, out: undefined },
        renderer: 'xconv/BranchNode',
      },
      {
        type: 'Random',
        connections: { in: undefined, out: undefined },
        renderer: 'xconv/RandomNode',
      },
      {
        type: 'Function',
        connections: { in: undefined, out: undefined },
        renderer: 'xconv/FunctionNode',
      },
      {
        type: 'EndConversation',
        connections: { in: undefined, out: undefined },
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
