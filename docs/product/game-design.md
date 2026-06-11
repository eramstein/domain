# Game Design

## RPG / Narrative systems

The RPG / narrative part of the game feels like a **“You Are the Hero”** book that writes itself on the fly. It is mostly text based with some decorative images like character portraits. Events occur and present the players with a few predefined choices, or a free text answer, and the game simulates the outcome using AI generated text.

## Colony simulation

The colony simulation part of the game is like a board game, turn based and high level. You can see a list of places, characters, resources and browse their data. Time and space are very high level: the game is turn based (e.g. 3 turns for a day, morning - afternoon - night) and there is no notion of distance or size, simply discrete places. The player interacts with it by chosing one action per turn for his character, and giving one order per turn for each NPC.

Where the simulation gets deeper is for NPC simulation. They have needs, objectives, and ambitions. They have personality traits and a backstory, and the gale will write their own narrative arc over time. Even though they are supposed to follow the player's orders, they have their own agenda. They act as independant agents.

## Core Game Loop

A turn in the simulation consists of a part of a day (e.g. Monday morning). Each turn, the narrative system will write a text describing events and NPC actions, from the perspective of the player's character. For example, "John worked in the forest and produced 3 units of lumber. A merchant arrived and proposes some good for sale.". It is presented linearly, like a book that writes itself.

Once the turn's state has been written, the game asks the player: "what do you do?". And the player answers in free text. A LLM looks for actions and parameters in the player's response, and executes the action. An action can either use up the whole turn, or be a quick action and leave the possibility to do other actions during the turn. The player can do one "full turn" action, and as many other ones as he wants.

Continuing the example, the player might say "I tell John to build some planks with the wood he cut". The simulation will add this into John's task list, and simulate what John decides to do during that turn, an account of which will be written to the player at the beginning of the next turn. This was not a full turn action, so the player gets to make another one and writes "I go see the merchant to trade". This opens a dedicated trade UI component to perform the trade and chat with the merchant (simulated by LLM). Once done, this was a full turn action, so the player can only do quick actions. Once done, he can click next turn, and the simulation loops back to the start turn, writing down what happened.

## User Interface

The UI is plit in 2 main sections. Both are visible side by side.

The first is mostly text based and is the narration written top to bottom as the events occur. This is where the player can act by typing his actions, and interacting with special widgets for some specific action types like trading.

The second is a game state explorer, a view of the simulation state. It looks like a business dashboard: list of characters, places, resources, with the option to click and drill down to details. It presents hard data, but also narrative summaries like character arcs.

Styling should be minimalistic and text based, avoid too many borders and decorations.
