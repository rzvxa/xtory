
# Xtory

A tool for writing branching nonlinear stories.
It is based on [Dialogger](https://github.com/etodd/dialogger) from [Evan Todd](https://github.com/etodd).
## Features

 - Node base story editor
 -  Writing story and conversations all in one tool
 - Adding notes for specefic parts of story
 - Exporting conversations for using in your game engine dialogue system
 - Highly customizable code
 - Later on all conversations will be ready for localization
 ## How to use it
 I think there is no need for a documentation on this subject, so i will just explain nodes.
 
 - **Plot**:  This node contains story parts and wont be in game exports, plot node can connect to one Plot or Start-Conversation.
 - **Note**: Note contains notes for any node and can connect to one or more entity of any type.
 - **Start-Conversation**: Marks start of a conversation and can connect to one Node, Text, Choice, Branch or Set.
 - **End-Conversation**: Marks end of a conversation and can connect to one Plot.
 - **Text**: Shows a message from the NPC and can connect to one End-Conversation, Text, Node, Set, or Branch, or to one or more Choices.
 - **Node**:Does nothing. Can connect to one Text, Node, Set, or Branch, or to one or more Choices.
 - **Choice**:Presents a choice to the player. Can connect to one End-Conversation, Text, Node, Set, or Branch.
 - **Set**:Sets a variable to a value. Can connect to one End-Conversation, Text, Node, Set, or Branch.
 - **Branch**:Takes one of several paths based on the value of a variable. Each port can connect to one Text, Node, Set, or Branch.


