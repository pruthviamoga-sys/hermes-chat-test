# Hermes flows: requirements and status

Last updated: 2026-11-02 (flow 1 achieved)

Status key: NOT STARTED / IN PROGRESS / ACHIEVED / NEEDS TESTING

## Flow 1: Fixed bot flow, no AI
Status: ACHIEVED
- Flow defined in JSON (flows/greeting.json)
- Page at /flow renders steps and buttons from the JSON; buttons move between steps (tested)
- UI action: "Show the time" button runs a fixed action in the page and logs the result (tested)
- Open: more actions and richer UI rendering if Krishna wants them

## Flow 2: Standard AI chat using AI
Status: ACHIEVED (with Hermes as the model)
- AI SDK chat page sends full history and streams replies
- Open: chat history is lost on refresh (no saved chats yet)

## Flow 3: Eve-only bot flow, no AI (JSON or flow file)
Status: NOT STARTED
- Eve project runs locally
- Open: try a scheduled task with a run handler and no model call

## Flow 4: Eve automation using AI, Hermes as API or JSON flow
Status: NOT STARTED
- Open: Eve tool that calls the Hermes API

## Flow 5: Hermes task from AI SDK chat, no Eve (hybrid)
Status: ACHIEVED (core), NEEDS TESTING (items below)
- Tasks sent from AI SDK chat; Hermes answers; history and streaming work
- Open: reasoning text appears in some replies (test model_options reasoning off next)
- Open: tool steps are not shown while a task runs (Hermes runs endpoint)
- Open: chat history is not saved on refresh
- Open: public test page has no login (Basic Auth decision pending)
- Open: documentation (tools, AI use, streaming, UI rendering, AI SDK version, shadcn components) not published

## Other open items
- Confirm remaining shadcn components on screen
- Hermes profile creation via API and memory isolation per profile (not tested)
- Local LLM test through the OpenAI-compatible setup (not tested)