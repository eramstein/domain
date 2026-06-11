Update the actions system so that actions can have requirements to be checked before they are executed.

A requirement is a test on the game state, for a given character executing the action.
Examples of requirements:

- when asking for action "collect resource" with parameters resource id 'oak-wood' and place 'forest-clearing', we need to check 2 things: is there an 'oak-wood' resource in place 'forest-clearing', and is the character performing the action at the correct place.
- if the requested action is 'build stone wall', that action might require 20 resources of type 'contruction material' and subtype 'stone' in the stock. (note that action type doesn't exist yet, it's just an example)

If the requirements are not met, inform the player and cancel the action.
