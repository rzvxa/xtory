## Conversation flow nodes and connection rules

### Dialogue

type: `dialogue`
transient: `no`

This node represents a single dialogue which can be spoken using any of the participating characters.

While some nodes introduce more specific rules, In general when any conversation node is connected to multiple dialogues at the same time, it means the dialogues are happening together, In this scenario each character can only have a single dialogue. This is useful for representing people speaking over each other, as opposed to completely interrupting.

### Choice

type: `choice`
transient: `no`

A choice is the main interactive tool of the xtory conversations. It's used to write multiple dialogue choices for the playable characters.

A choice node can be connected to any number of dialogue nodes, all of the dialogues should belong to the same character. In the engine, this node is used to prompt the player with dialogue options in a conversation.

### Set

type: `set`
transient: `yes`

Sets a variable to a given value, It can also be used to copy the value of another variable.

### Branch

type: `set`
transient: `yes`

Sets a variable to a given value, It can also be used to copy the value of another variable.

#### Connection rules

| Input \ Output     |                        Dialogue                        |  Choice   |                       Branch                       |  Random   |    Set    | Function  |           Start Conversation           | End Conversation |
| :----------------- | :----------------------------------------------------: | :-------: | :------------------------------------------------: | :-------: | :-------: | :-------: | :------------------------------------: | :--------------: |
| Dialogue           |         Can connect to any number of dialogues         | Transient |                                                    |           | Transient | Transient | Can connect to any number of dialogues |        X         |
| Choice             |                                                        |           |                                                    |           | Transient | Transient |                                        |        X         |
| Branch             |                                                        |           |                                                    |           | Transient | Transient |                                        |        X         |
| Random             |                                                        |           |                                                    |           | Transient | Transient |                                        |        X         |
| Set                |                       Transient                        | Transient |                     Transient                      | Transient | Transient | Transient |               Transient                |        X         |
| Function           |                       Transient                        | Transient |                     Transient                      | Transient | Transient | Transient |               Transient                |        X         |
| Start Conversation |                           X                            |     X     |                         X                          |     X     |     X     |     X     |                   X                    |        X         |
| End Conversation   | Any number of dialogues can connect to the same ending |     X     | Any number of cases can connect to the same ending |     X     | Transient | Transient |                  Yes                   |        X         |
